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
    // Fetch fresh statistics from VATSIM API
    const vatsimStats = await fetchVatsimStatistics(cid)

    // Check if pilot exists in database
    const pilot = await db.query.pilots.findFirst({
      where: eq(pilots.cid, cid)
    })

    // If pilot exists in database, update their statistics
    if (pilot) {
      await db.update(pilots)
        .set({
          vatsimStats: {
            atc: vatsimStats.atc,
            pilot: vatsimStats.pilot,
            regDate: vatsimStats.reg_date,
            lastRatingChange: vatsimStats.lastratingchange
          },
          vatsimStatsUpdatedAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(pilots.cid, cid))
    }

    // Return the statistics
    return {
      success: true,
      data: {
        cid: vatsimStats.id,
        atc: vatsimStats.atc || { hours: 0 },
        pilot: vatsimStats.pilot || { hours: 0 },
        regDate: vatsimStats.reg_date,
        lastRatingChange: vatsimStats.lastratingchange,
        rating: vatsimStats.rating,
        pilotRating: vatsimStats.pilotrating,
        region: vatsimStats.region,
        division: vatsimStats.division
      }
    }
  } catch (error: any) {
    console.error(`Failed to fetch VATSIM statistics for CID ${cid}:`, error)

    // If the error is a 404, the pilot doesn't exist
    if (error?.response?.status === 404 || error?.statusCode === 404) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Pilot not found on VATSIM'
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch statistics from VATSIM'
    })
  }
})
