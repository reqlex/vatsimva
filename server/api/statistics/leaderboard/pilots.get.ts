import { db } from '~/server/database/db'
import { pilots, airlineMemberships, airlines } from '~/server/database/schema'
import { desc, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const limit = Number(query.limit) || 10

  try {
    // Get top pilots by total hours
    const topPilots = await db
      .select({
        cid: pilots.cid,
        firstName: pilots.firstName,
        lastName: pilots.lastName,
        displayName: pilots.displayName,
        totalFlights: pilots.totalFlights,
        totalHours: pilots.totalHours,
        totalDistance: pilots.totalDistance,
        vatsimStats: pilots.vatsimStats,
        country: pilots.country,
        rating: pilots.rating,
        pilotRating: pilots.pilotRating
      })
      .from(pilots)
      .orderBy(desc(pilots.totalHours))
      .limit(limit)

    // Enrich with airline information
    const enrichedPilots = await Promise.all(
      topPilots.map(async (pilot, index) => {
        // Get pilot's primary airline
        const membership = await db.query.airlineMemberships.findFirst({
          where: sql`${airlineMemberships.pilotId} = (SELECT id FROM ${pilots} WHERE cid = ${pilot.cid})`,
          with: {
            airline: {
              columns: {
                code: true,
                name: true
              }
            }
          }
        })

        // Calculate combined hours (platform + VATSIM)
        let combinedHours = Number(pilot.totalHours) || 0
        if (pilot.vatsimStats) {
          const stats = pilot.vatsimStats as any
          if (stats.pilot?.hours) {
            combinedHours += stats.pilot.hours
          }
        }

        return {
          rank: index + 1,
          cid: pilot.cid,
          name: pilot.displayName || `${pilot.firstName} ${pilot.lastName}`,
          firstName: pilot.firstName,
          lastName: pilot.lastName,
          airline: membership?.airline?.code || 'N/A',
          airlineName: membership?.airline?.name,
          flights: Number(pilot.totalFlights) || 0,
          hours: combinedHours,
          distance: Number(pilot.totalDistance) || 0,
          country: pilot.country,
          rating: pilot.rating,
          pilotRating: pilot.pilotRating,
          vatsimHours: pilot.vatsimStats ? (pilot.vatsimStats as any).pilot?.hours || 0 : 0
        }
      })
    )

    // Re-sort by combined hours
    enrichedPilots.sort((a, b) => b.hours - a.hours)
    enrichedPilots.forEach((pilot, index) => {
      pilot.rank = index + 1
    })

    return {
      success: true,
      data: enrichedPilots
    }
  } catch (error) {
    console.error('Failed to fetch pilots leaderboard:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch pilots leaderboard'
    })
  }
})
