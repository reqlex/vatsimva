import { db } from '~/server/database/db'
import { pilots, airlineMemberships } from '~/server/database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const session = await getSession(event)

  if (!session?.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  // Get pilot from database
  const pilot = await db.query.pilots.findFirst({
    where: eq(pilots.cid, session.user.cid)
  })

  if (!pilot) {
    throw createError({
      statusCode: 404,
      message: 'Pilot not found'
    })
  }

  // Get all memberships with airline data
  const memberships = await db.query.airlineMemberships.findMany({
    where: eq(airlineMemberships.pilotId, pilot.id),
    with: {
      airline: {
        with: {
          hubs: true
        }
      }
    }
  })

  // Transform data for frontend
  const myAirlines = memberships.map((membership) => ({
    id: membership.airline.id,
    name: membership.airline.name,
    code: membership.airline.code,
    icao: membership.airline.icao,
    logo: membership.airline.logo,
    role: membership.role,
    rank: membership.rank,
    joinDate: membership.joinedAt?.toISOString().split('T')[0],
    flights: membership.flights || 0,
    hours: Number(membership.hours) || 0,
    lastFlight: membership.lastFlightAt?.toISOString().split('T')[0] || null,
    status: membership.status,
    hubs: membership.airline.hubs.map(h => h.icaoCode),
    isOwner: membership.role === 'owner'
  }))

  return { airlines: myAirlines }
})
