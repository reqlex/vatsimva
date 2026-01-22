import { db } from '~/server/database/db'
import { pilots } from '~/server/database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const session = await getSession(event)

  if (!session?.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  const body = await readBody(event)

  // Validate and sanitize input
  const updateData: Record<string, unknown> = {
    updatedAt: new Date()
  }

  // Profile settings
  if (body.displayName !== undefined) {
    updateData.displayName = body.displayName?.trim() || null
  }
  if (body.bio !== undefined) {
    updateData.bio = body.bio?.trim() || null
  }
  if (body.homeAirport !== undefined) {
    updateData.homeAirport = body.homeAirport?.toUpperCase().trim() || null
  }
  if (body.timezone !== undefined) {
    updateData.timezone = body.timezone || 'UTC'
  }

  // Notification settings
  if (body.notifications) {
    if (body.notifications.email !== undefined) {
      updateData.notifyEmail = Boolean(body.notifications.email)
    }
    if (body.notifications.browser !== undefined) {
      updateData.notifyBrowser = Boolean(body.notifications.browser)
    }
    if (body.notifications.flightReminders !== undefined) {
      updateData.notifyFlightReminders = Boolean(body.notifications.flightReminders)
    }
    if (body.notifications.eventUpdates !== undefined) {
      updateData.notifyEventUpdates = Boolean(body.notifications.eventUpdates)
    }
    if (body.notifications.weeklyDigest !== undefined) {
      updateData.notifyWeeklyDigest = Boolean(body.notifications.weeklyDigest)
    }
  }

  // Privacy settings
  if (body.privacy) {
    if (body.privacy.showEmail !== undefined) {
      updateData.showEmail = Boolean(body.privacy.showEmail)
    }
    if (body.privacy.showFlights !== undefined) {
      updateData.showFlights = Boolean(body.privacy.showFlights)
    }
    if (body.privacy.showStatistics !== undefined) {
      updateData.showStatistics = Boolean(body.privacy.showStatistics)
    }
    if (body.privacy.showAirlines !== undefined) {
      updateData.showAirlines = Boolean(body.privacy.showAirlines)
    }
  }

  await db.update(pilots)
    .set(updateData)
    .where(eq(pilots.cid, session.user.cid))

  return { success: true }
})
