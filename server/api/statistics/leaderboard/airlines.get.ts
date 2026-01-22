import { db } from '~/server/database/db'
import { airlines } from '~/server/database/schema'
import { desc, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const limit = Number(query.limit) || 10

  try {
    // Get top airlines by flight count
    const topAirlines = await db
      .select({
        id: airlines.id,
        name: airlines.name,
        code: airlines.code,
        icao: airlines.icao,
        logo: airlines.logo,
        memberCount: airlines.memberCount,
        flightCount: airlines.flightCount,
        region: airlines.region,
        verified: airlines.verified
      })
      .from(airlines)
      .where(sql`${airlines.active} = true`)
      .orderBy(desc(airlines.flightCount))
      .limit(limit)

    const enrichedAirlines = topAirlines.map((airline, index) => ({
      rank: index + 1,
      name: airline.name,
      code: airline.code,
      icao: airline.icao,
      logo: airline.logo,
      flights: Number(airline.flightCount) || 0,
      hours: 0, // TODO: Calculate from flights table
      pilots: Number(airline.memberCount) || 0,
      region: airline.region,
      verified: airline.verified,
      change: 0 // TODO: Implement rank change tracking
    }))

    return {
      success: true,
      data: enrichedAirlines
    }
  } catch (error) {
    console.error('Failed to fetch airlines leaderboard:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch airlines leaderboard'
    })
  }
})
