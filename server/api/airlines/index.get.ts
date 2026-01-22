import { db } from '~/server/database/db'
import { airlines, airlineHubs, airlineFleet } from '~/server/database/schema'
import { sql, like, or, eq, and, desc, asc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const search = query.search as string || ''
  const region = query.region as string || 'all'
  const size = query.size as string || 'all'
  const sortBy = query.sortBy as string || 'members'

  try {
    // Build where conditions
    const conditions = []

    // Active airlines only
    conditions.push(eq(airlines.active, true))

    // Search filter
    if (search) {
      conditions.push(
        or(
          like(airlines.name, `%${search}%`),
          like(airlines.code, `%${search}%`),
          like(airlines.icao, `%${search}%`),
          like(airlines.description, `%${search}%`)
        )
      )
    }

    // Region filter
    if (region !== 'all') {
      conditions.push(eq(airlines.region, region))
    }

    // Fetch airlines
    let airlinesQuery = db
      .select({
        id: airlines.id,
        name: airlines.name,
        code: airlines.code,
        icao: airlines.icao,
        logo: airlines.logo,
        description: airlines.description,
        tagline: airlines.tagline,
        region: airlines.region,
        founded: airlines.founded,
        website: airlines.website,
        discord: airlines.discord,
        memberCount: airlines.memberCount,
        flightCount: airlines.flightCount,
        rating: airlines.rating,
        verified: airlines.verified,
        createdAt: airlines.createdAt
      })
      .from(airlines)

    if (conditions.length > 0) {
      airlinesQuery = airlinesQuery.where(and(...conditions))
    }

    // Sorting
    if (sortBy === 'members') {
      airlinesQuery = airlinesQuery.orderBy(desc(airlines.memberCount))
    } else if (sortBy === 'flights') {
      airlinesQuery = airlinesQuery.orderBy(desc(airlines.flightCount))
    } else if (sortBy === 'rating') {
      airlinesQuery = airlinesQuery.orderBy(desc(airlines.rating))
    } else if (sortBy === 'newest') {
      airlinesQuery = airlinesQuery.orderBy(desc(airlines.createdAt))
    }

    const airlinesList = await airlinesQuery

    // Enrich with hubs and fleet for each airline
    const enrichedAirlines = await Promise.all(
      airlinesList.map(async (airline) => {
        // Get hubs
        const hubs = await db
          .select({ icaoCode: airlineHubs.icaoCode })
          .from(airlineHubs)
          .where(eq(airlineHubs.airlineId, airline.id))

        // Get fleet
        const fleet = await db
          .select({ aircraftType: airlineFleet.aircraftType })
          .from(airlineFleet)
          .where(eq(airlineFleet.airlineId, airline.id))

        return {
          ...airline,
          members: Number(airline.memberCount) || 0,
          flights: Number(airline.flightCount) || 0,
          rating: Number(airline.rating) || 0,
          hubs: hubs.map(h => h.icaoCode),
          fleet: fleet.map(f => f.aircraftType)
        }
      })
    )

    // Apply size filter after enrichment
    let filteredAirlines = enrichedAirlines
    if (size !== 'all') {
      filteredAirlines = enrichedAirlines.filter(airline => {
        if (size === 'large') return airline.members >= 500
        if (size === 'medium') return airline.members >= 100 && airline.members < 500
        if (size === 'small') return airline.members < 100
        return true
      })
    }

    return {
      success: true,
      data: filteredAirlines,
      count: filteredAirlines.length
    }
  } catch (error) {
    console.error('Failed to fetch airlines:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch airlines'
    })
  }
})
