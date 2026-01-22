import { db } from '~/server/database/db'
import { pilots } from '~/server/database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const cid = getRouterParam(event, 'cid')

  if (!cid) {
    throw createError({
      statusCode: 400,
      statusMessage: 'CID is required'
    })
  }

  try {
    // Get pilot from database
    const pilot = await db.query.pilots.findFirst({
      where: eq(pilots.cid, cid),
      columns: {
        id: true,
        cid: true,
        firstName: true,
        lastName: true,
        email: true,
        country: true,
        rating: true,
        pilotRating: true,
        division: true,
        displayName: true,
        bio: true,
        homeAirport: true,
        totalFlights: true,
        totalHours: true,
        totalDistance: true,
        vatsimStats: true,
        vatsimStatsUpdatedAt: true,
        createdAt: true,
        updatedAt: true,
        // Exclude sensitive fields
        showEmail: true,
        showFlights: true,
        showStatistics: true
      }
    })

    if (!pilot) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Pilot not found'
      })
    }

    // Check privacy settings
    const session = await getSession(event)
    const isOwnProfile = session?.user?.cid === cid

    // Filter data based on privacy settings
    const publicData = {
      cid: pilot.cid,
      firstName: pilot.firstName,
      lastName: pilot.lastName,
      displayName: pilot.displayName,
      country: pilot.country,
      rating: pilot.rating,
      pilotRating: pilot.pilotRating,
      division: pilot.division,
      homeAirport: pilot.homeAirport,
      bio: pilot.bio,
      createdAt: pilot.createdAt,
      // Conditionally include based on privacy
      email: (isOwnProfile || pilot.showEmail) ? pilot.email : undefined,
      totalFlights: pilot.showStatistics ? pilot.totalFlights : undefined,
      totalHours: pilot.showStatistics ? pilot.totalHours : undefined,
      totalDistance: pilot.showStatistics ? pilot.totalDistance : undefined,
      vatsimStats: pilot.showStatistics ? pilot.vatsimStats : undefined,
      vatsimStatsUpdatedAt: pilot.showStatistics ? pilot.vatsimStatsUpdatedAt : undefined
    }

    return {
      success: true,
      data: publicData
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error(`Failed to fetch pilot data for CID ${cid}:`, error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch pilot data'
    })
  }
})
