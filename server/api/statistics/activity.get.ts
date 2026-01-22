import { db } from '~/server/database/db'
import { flights, pilots, airlines } from '~/server/database/schema'
import { desc, or, eq, isNotNull } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const limit = Number(query.limit) || 20

  try {
    // Get recent flights with pilot and airline information
    const recentFlights = await db
      .select({
        flightId: flights.id,
        flightNumber: flights.flightNumber,
        callsign: flights.callsign,
        departureIcao: flights.departureIcao,
        arrivalIcao: flights.arrivalIcao,
        aircraftIcao: flights.aircraftIcao,
        status: flights.status,
        actualDeparture: flights.actualDeparture,
        actualArrival: flights.actualArrival,
        createdAt: flights.createdAt,
        updatedAt: flights.updatedAt,
        pilotCid: pilots.cid,
        pilotFirstName: pilots.firstName,
        pilotLastName: pilots.lastName,
        pilotDisplayName: pilots.displayName,
        airlineCode: airlines.code,
        airlineName: airlines.name
      })
      .from(flights)
      .leftJoin(pilots, eq(flights.pilotId, pilots.id))
      .leftJoin(airlines, eq(flights.airlineId, airlines.id))
      .where(
        or(
          isNotNull(flights.actualDeparture),
          isNotNull(flights.actualArrival)
        )
      )
      .orderBy(desc(flights.updatedAt))
      .limit(limit)

    // Transform to activity feed format
    const activities = []

    for (const flight of recentFlights) {
      // Calculate time ago
      const getTimeAgo = (date: Date | null) => {
        if (!date) return ''
        const now = new Date()
        const diffMs = now.getTime() - new Date(date).getTime()
        const diffMins = Math.floor(diffMs / 60000)

        if (diffMins < 1) return 'just now'
        if (diffMins === 1) return '1 min ago'
        if (diffMins < 60) return `${diffMins} min ago`

        const diffHours = Math.floor(diffMins / 60)
        if (diffHours === 1) return '1 hour ago'
        if (diffHours < 24) return `${diffHours} hours ago`

        const diffDays = Math.floor(diffHours / 24)
        if (diffDays === 1) return '1 day ago'
        return `${diffDays} days ago`
      }

      const pilotName = flight.pilotDisplayName ||
                        `${flight.pilotFirstName} ${flight.pilotLastName}` ||
                        'Unknown Pilot'

      // Add departure event if exists
      if (flight.actualDeparture) {
        activities.push({
          type: 'takeoff',
          pilot: pilotName,
          pilotCid: flight.pilotCid,
          flight: flight.flightNumber || flight.callsign || 'N/A',
          route: `${flight.departureIcao} → ${flight.arrivalIcao}`,
          time: getTimeAgo(flight.actualDeparture),
          timestamp: flight.actualDeparture,
          aircraft: flight.aircraftIcao || 'Unknown',
          airline: flight.airlineCode,
          status: flight.status
        })
      }

      // Add arrival event if exists and different from departure
      if (flight.actualArrival && flight.actualArrival !== flight.actualDeparture) {
        activities.push({
          type: 'landing',
          pilot: pilotName,
          pilotCid: flight.pilotCid,
          flight: flight.flightNumber || flight.callsign || 'N/A',
          route: `${flight.departureIcao} → ${flight.arrivalIcao}`,
          time: getTimeAgo(flight.actualArrival),
          timestamp: flight.actualArrival,
          aircraft: flight.aircraftIcao || 'Unknown',
          airline: flight.airlineCode,
          status: flight.status
        })
      }
    }

    // Sort by timestamp (most recent first)
    activities.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime()
      const timeB = new Date(b.timestamp).getTime()
      return timeB - timeA
    })

    // Limit to requested amount
    const limitedActivities = activities.slice(0, limit)

    return {
      success: true,
      data: limitedActivities
    }
  } catch (error) {
    console.error('Failed to fetch recent activity:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch recent activity'
    })
  }
})
