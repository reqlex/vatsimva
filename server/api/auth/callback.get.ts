import type { SessionData } from '~/types/auth'
import { db } from '../../database/db'
import { pilots } from '../../database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { code, state, error } = query

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error)
    return sendRedirect(event, '/?error=oauth_error')
  }

  // Validate required parameters
  if (!code || typeof code !== 'string') {
    return sendRedirect(event, '/?error=missing_code')
  }

  if (!state || typeof state !== 'string') {
    return sendRedirect(event, '/?error=missing_state')
  }

  // Verify state for CSRF protection
  const storedState = getState(event)
  clearState(event)

  if (state !== storedState) {
    console.error('State mismatch:', { received: state, stored: storedState })
    return sendRedirect(event, '/?error=invalid_state')
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await exchangeCodeForToken(code)

    // Fetch user data from VATSIM
    const vatsimUser = await fetchVatsimUser(tokenResponse.access_token)

    // Transform to our user format
    const user = transformVatsimUser(vatsimUser)

    // Fetch VATSIM statistics in background (non-blocking)
    let vatsimStats = null
    try {
      vatsimStats = await fetchVatsimStatistics(user.cid)
    } catch (err) {
      console.warn('Failed to fetch VATSIM statistics on login:', err)
      // Continue even if stats fetch fails
    }

    // Create or update pilot in database
    const existingPilot = await db.query.pilots.findFirst({
      where: eq(pilots.cid, user.cid)
    })

    if (existingPilot) {
      // Update existing pilot
      await db.update(pilots)
        .set({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          country: user.country,
          rating: user.rating,
          pilotRating: user.pilotRating,
          division: user.division,
          vatsimStats: vatsimStats ? {
            atc: vatsimStats.atc,
            pilot: vatsimStats.pilot,
            regDate: vatsimStats.reg_date,
            lastRatingChange: vatsimStats.lastratingchange
          } : undefined,
          vatsimStatsUpdatedAt: vatsimStats ? new Date() : undefined,
          updatedAt: new Date()
        })
        .where(eq(pilots.cid, user.cid))
    } else {
      // Create new pilot
      await db.insert(pilots).values({
        cid: user.cid,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        country: user.country,
        rating: user.rating,
        pilotRating: user.pilotRating,
        division: user.division,
        vatsimStats: vatsimStats ? {
          atc: vatsimStats.atc,
          pilot: vatsimStats.pilot,
          regDate: vatsimStats.reg_date,
          lastRatingChange: vatsimStats.lastratingchange
        } : undefined,
        vatsimStatsUpdatedAt: vatsimStats ? new Date() : undefined
      })
    }

    // Create session
    const sessionData: SessionData = {
      user,
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
      expiresAt: Date.now() + (tokenResponse.expires_in * 1000)
    }

    await setSession(event, sessionData)

    // Redirect to home page
    return sendRedirect(event, '/')
  } catch (err) {
    console.error('OAuth callback error:', err)
    return sendRedirect(event, '/?error=callback_failed')
  }
})
