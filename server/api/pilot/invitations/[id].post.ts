import { db } from '~/server/database/db'
import { pilots, airlineInvitations, airlineMemberships } from '~/server/database/schema'
import { eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const session = await getSession(event)

  if (!session?.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  const invitationId = getRouterParam(event, 'id')
  if (!invitationId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid invitation ID'
    })
  }

  const body = await readBody(event)
  const action = body.action // 'accept' or 'decline'

  if (!['accept', 'decline'].includes(action)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid action. Must be "accept" or "decline"'
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

  // Get the invitation
  const invitation = await db.query.airlineInvitations.findFirst({
    where: and(
      eq(airlineInvitations.id, Number(invitationId)),
      eq(airlineInvitations.pilotId, pilot.id),
      eq(airlineInvitations.status, 'pending')
    )
  })

  if (!invitation) {
    throw createError({
      statusCode: 404,
      message: 'Invitation not found'
    })
  }

  if (action === 'accept') {
    // Create membership
    await db.insert(airlineMemberships).values({
      pilotId: pilot.id,
      airlineId: invitation.airlineId,
      role: invitation.role || 'pilot',
      rank: 'New Pilot',
      status: 'active'
    })

    // Update invitation status
    await db.update(airlineInvitations)
      .set({
        status: 'accepted',
        respondedAt: new Date()
      })
      .where(eq(airlineInvitations.id, invitation.id))

    return { success: true, message: 'Invitation accepted' }
  } else {
    // Decline invitation
    await db.update(airlineInvitations)
      .set({
        status: 'declined',
        respondedAt: new Date()
      })
      .where(eq(airlineInvitations.id, invitation.id))

    return { success: true, message: 'Invitation declined' }
  }
})
