import { db } from '~/server/database/db'
import { pilots } from '~/server/database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  // Get the authenticated user from session
  const session = await getSession(event)

  if (!session?.user?.cid) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const cid = session.user.cid

  try {
    // Fetch statistics from VATSIM API
    const vatsimStats = await fetchVatsimStatistics(cid)

    // Update pilot record with statistics
    await db.update(pilots)
      .set({
        vatsimStats: {
          atc: vatsimStats.atc,
          pilot: vatsimStats.pilot,
          regDate: vatsimStats.reg_date,
          lastRatingChange: vatsimStats.lastratingchange
        },
        vatsimStatsUpdatedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(pilots.cid, cid))

    // Return the statistics
    return {
      success: true,
      data: {
        cid: vatsimStats.id,
        atc: vatsimStats.atc,
        pilot: vatsimStats.pilot,
        regDate: vatsimStats.reg_date,
        lastRatingChange: vatsimStats.lastratingchange,
        rating: vatsimStats.rating,
        pilotRating: vatsimStats.pilotrating
      }
    }
  } catch (error) {
    console.error('Failed to fetch VATSIM statistics:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch statistics from VATSIM'
    })
  }
})
