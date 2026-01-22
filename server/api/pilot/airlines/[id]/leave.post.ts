import { db } from '~/server/database/db'
import { pilots, airlineMemberships } from '~/server/database/schema'
import { eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const session = await getSession(event)

  if (!session?.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  const airlineId = getRouterParam(event, 'id')
  if (!airlineId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid airline ID'
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

  // Get the membership
  const membership = await db.query.airlineMemberships.findFirst({
    where: and(
      eq(airlineMemberships.pilotId, pilot.id),
      eq(airlineMemberships.airlineId, Number(airlineId))
    )
  })

  if (!membership) {
    throw createError({
      statusCode: 404,
      message: 'Membership not found'
    })
  }

  // Owners cannot leave their airline
  if (membership.role === 'owner') {
    throw createError({
      statusCode: 400,
      message: 'Owners cannot leave their airline. Transfer ownership first or delete the airline.'
    })
  }

  // Delete membership
  await db.delete(airlineMemberships)
    .where(and(
      eq(airlineMemberships.pilotId, pilot.id),
      eq(airlineMemberships.airlineId, Number(airlineId))
    ))

  return { success: true, message: 'Successfully left the airline' }
})
