import { db } from '~/server/database/db'
import { pilots, airlineInvitations } from '~/server/database/schema'
import { eq, and } from 'drizzle-orm'

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

  // Get pending invitations
  const invitations = await db.query.airlineInvitations.findMany({
    where: and(
      eq(airlineInvitations.pilotId, pilot.id),
      eq(airlineInvitations.status, 'pending')
    ),
    with: {
      airline: true,
      invitedBy: true
    }
  })

  // Transform data for frontend
  const pendingInvites = invitations.map((invite) => ({
    id: invite.id,
    airlineName: invite.airline.name,
    airlineCode: invite.airline.code,
    invitedBy: invite.invitedBy ? `${invite.invitedBy.firstName} ${invite.invitedBy.lastName}` : 'Unknown',
    invitedAt: invite.createdAt?.toISOString().split('T')[0],
    role: invite.role
  }))

  return { invitations: pendingInvites }
})
