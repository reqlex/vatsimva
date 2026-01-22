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

  const pilot = await db.query.pilots.findFirst({
    where: eq(pilots.cid, session.user.cid)
  })

  if (!pilot) {
    throw createError({
      statusCode: 404,
      message: 'Pilot not found'
    })
  }

  return {
    pilot: {
      id: pilot.id,
      cid: pilot.cid,
      firstName: pilot.firstName,
      lastName: pilot.lastName,
      fullName: `${pilot.firstName} ${pilot.lastName}`,
      email: pilot.email,
      country: pilot.country,
      rating: pilot.rating,
      pilotRating: pilot.pilotRating,
      division: pilot.division,
      displayName: pilot.displayName,
      bio: pilot.bio,
      homeAirport: pilot.homeAirport,
      timezone: pilot.timezone,
      notifications: {
        email: pilot.notifyEmail,
        browser: pilot.notifyBrowser,
        flightReminders: pilot.notifyFlightReminders,
        eventUpdates: pilot.notifyEventUpdates,
        weeklyDigest: pilot.notifyWeeklyDigest
      },
      privacy: {
        showEmail: pilot.showEmail,
        showFlights: pilot.showFlights,
        showStatistics: pilot.showStatistics,
        showAirlines: pilot.showAirlines
      },
      stats: {
        totalFlights: pilot.totalFlights || 0,
        totalHours: Number(pilot.totalHours) || 0,
        totalDistance: pilot.totalDistance || 0
      },
      createdAt: pilot.createdAt,
      updatedAt: pilot.updatedAt
    }
  }
})
