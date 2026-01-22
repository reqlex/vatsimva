import { db } from '~/server/database/db'
import { events, airlines, pilots } from '~/server/database/schema'
import { eq, and, gte, desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const category = query.category as string || 'all'
  const featured = query.featured === 'true'

  try {
    // Build where conditions
    const conditions = []

    // Active events only
    conditions.push(eq(events.active, true))
    conditions.push(eq(events.cancelled, false))

    // Category filter
    if (category !== 'all') {
      conditions.push(eq(events.eventType, category))
    }

    // Featured filter
    if (featured) {
      conditions.push(eq(events.featured, true))
    }

    // Fetch events
    const eventsList = await db
      .select({
        id: events.id,
        title: events.title,
        description: events.description,
        shortDescription: events.shortDescription,
        eventType: events.eventType,
        startDate: events.startDate,
        endDate: events.endDate,
        duration: events.duration,
        departureIcao: events.departureIcao,
        arrivalIcao: events.arrivalIcao,
        routeDescription: events.routeDescription,
        allowedAircraft: events.allowedAircraft,
        maxParticipants: events.maxParticipants,
        currentParticipants: events.currentParticipants,
        imageUrl: events.imageUrl,
        featured: events.featured,
        airlineId: events.airlineId,
        airlineName: airlines.name,
        airlineCode: airlines.code,
        createdById: events.createdById,
        createdByName: pilots.displayName,
        createdByFirstName: pilots.firstName,
        createdByLastName: pilots.lastName
      })
      .from(events)
      .leftJoin(airlines, eq(events.airlineId, airlines.id))
      .leftJoin(pilots, eq(events.createdById, pilots.id))
      .where(and(...conditions))
      .orderBy(desc(events.startDate))

    // Transform to match frontend format
    const transformedEvents = eventsList.map(e => {
      const startDate = new Date(e.startDate)
      const organizer = e.airlineName ||
                       (e.createdByName || `${e.createdByFirstName} ${e.createdByLastName}`) ||
                       'VATSIM VA Community'

      // Format route
      let route = ''
      if (e.departureIcao && e.arrivalIcao) {
        route = `${e.departureIcao} → ${e.arrivalIcao}`
      } else if (e.routeDescription) {
        route = e.routeDescription
      } else if (e.departureIcao) {
        route = `${e.departureIcao} Hub`
      } else {
        route = 'Various'
      }

      // Format aircraft
      let aircraft = 'Any'
      if (e.allowedAircraft && Array.isArray(e.allowedAircraft) && e.allowedAircraft.length > 0) {
        aircraft = e.allowedAircraft.join('/')
      }

      // Format duration
      let durationStr = ''
      if (e.duration) {
        const hours = Math.floor(e.duration / 60)
        const mins = e.duration % 60
        if (hours > 0) durationStr = `${hours}h`
        if (mins > 0) durationStr += ` ${mins}m`
        if (!durationStr) durationStr = `${e.duration}m`
      } else if (e.endDate) {
        const end = new Date(e.endDate)
        const diffDays = Math.ceil((end.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        if (diffDays > 1) {
          durationStr = `${diffDays} days`
        } else {
          durationStr = 'TBD'
        }
      } else {
        durationStr = 'TBD'
      }

      return {
        id: e.id,
        title: e.title,
        description: e.description || e.shortDescription || '',
        category: e.eventType,
        date: startDate.toISOString().split('T')[0],
        time: startDate.toTimeString().slice(0, 5),
        duration: durationStr,
        airline: e.airlineCode || 'Open',
        route,
        aircraft,
        participants: Number(e.currentParticipants) || 0,
        maxParticipants: Number(e.maxParticipants) || 100,
        image: e.imageUrl,
        featured: e.featured,
        organizer
      }
    })

    return {
      success: true,
      data: transformedEvents,
      count: transformedEvents.length
    }
  } catch (error) {
    console.error('Failed to fetch events:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch events'
    })
  }
})
