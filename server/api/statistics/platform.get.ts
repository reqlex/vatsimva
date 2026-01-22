import { db } from '~/server/database/db'
import { pilots, airlines, flights, airlineMemberships } from '~/server/database/schema'
import { sql, count, sum } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    // Get total pilots count
    const totalPilotsResult = await db.select({ count: count() }).from(pilots)
    const totalPilots = totalPilotsResult[0]?.count || 0

    // Get total airlines count
    const totalAirlinesResult = await db.select({ count: count() }).from(airlines)
    const totalAirlines = totalAirlinesResult[0]?.count || 0

    // Get total flights and hours
    const flightStatsResult = await db.select({
      totalFlights: count(),
      totalHours: sum(flights.flightTime)
    }).from(flights)

    const totalFlights = flightStatsResult[0]?.totalFlights || 0
    const totalHours = flightStatsResult[0]?.totalHours || 0

    // Get total distance
    const distanceResult = await db.select({
      totalDistance: sum(flights.actualDistance)
    }).from(flights)

    const totalDistance = distanceResult[0]?.totalDistance || 0

    // Calculate average flights per day (if we have data)
    const avgFlightsPerDay = totalFlights > 0 ? Math.round(totalFlights / 30) : 0

    // Get VATSIM statistics from pilots (aggregate pilot hours from vatsimStats)
    const pilotsWithStats = await db.select({
      vatsimStats: pilots.vatsimStats
    }).from(pilots)

    let totalVatsimPilotHours = 0
    let totalVatsimAtcHours = 0

    pilotsWithStats.forEach(pilot => {
      if (pilot.vatsimStats) {
        const stats = pilot.vatsimStats as any
        if (stats.pilot?.hours) {
          totalVatsimPilotHours += stats.pilot.hours
        }
        if (stats.atc?.hours) {
          totalVatsimAtcHours += stats.atc.hours
        }
      }
    })

    return {
      success: true,
      data: {
        totalPilots: Number(totalPilots),
        totalAirlines: Number(totalAirlines),
        totalFlights: Number(totalFlights),
        totalHours: Number(totalHours),
        totalDistance: Number(totalDistance),
        avgFlightsPerDay: Number(avgFlightsPerDay),
        vatsimStats: {
          totalPilotHours: Math.round(totalVatsimPilotHours),
          totalAtcHours: Math.round(totalVatsimAtcHours)
        }
      }
    }
  } catch (error) {
    console.error('Failed to fetch platform statistics:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch platform statistics'
    })
  }
})
