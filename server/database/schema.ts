import { pgTable, serial, varchar, text, integer, boolean, timestamp, decimal, pgEnum, json, uniqueIndex } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Enums - Existing
export const regionEnum = pgEnum('region', ['europe', 'north-america', 'asia', 'middle-east', 'south-america', 'africa', 'oceania'])
export const memberRoleEnum = pgEnum('member_role', ['owner', 'admin', 'staff', 'pilot'])
export const memberStatusEnum = pgEnum('member_status', ['active', 'inactive', 'pending'])
export const inviteStatusEnum = pgEnum('invite_status', ['pending', 'accepted', 'declined'])

// Enums - New
export const eventTypeEnum = pgEnum('event_type', ['group-flight', 'fly-in', 'tour', 'competition'])
export const eventRegistrationStatusEnum = pgEnum('event_registration_status', ['registered', 'waitlist', 'cancelled', 'attended', 'no-show'])
export const flightStatusEnum = pgEnum('flight_status', ['scheduled', 'boarding', 'departed', 'enroute', 'arrived', 'completed', 'cancelled', 'diverted'])
export const pirepStatusEnum = pgEnum('pirep_status', ['draft', 'pending', 'approved', 'rejected'])
export const achievementRarityEnum = pgEnum('achievement_rarity', ['common', 'uncommon', 'rare', 'epic', 'legendary'])
export const newsCategoryEnum = pgEnum('news_category', ['announcement', 'event', 'update', 'tutorial', 'community'])
export const routeFrequencyEnum = pgEnum('route_frequency', ['daily', 'weekdays', 'weekends', 'weekly', 'custom'])
export const aircraftCategoryEnum = pgEnum('aircraft_category', ['narrowbody', 'widebody', 'regional', 'cargo', 'ga', 'military'])

// Pilots table (linked to VATSIM users)
export const pilots = pgTable('pilots', {
  id: serial('id').primaryKey(),
  cid: varchar('cid', { length: 20 }).notNull().unique(), // VATSIM CID
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  country: varchar('country', { length: 100 }),
  rating: varchar('rating', { length: 20 }), // ATC rating
  pilotRating: varchar('pilot_rating', { length: 20 }), // Pilot rating
  division: varchar('division', { length: 100 }),

  // Profile settings
  displayName: varchar('display_name', { length: 100 }),
  bio: text('bio'),
  homeAirport: varchar('home_airport', { length: 4 }),
  timezone: varchar('timezone', { length: 50 }).default('UTC'),

  // Notification settings
  notifyEmail: boolean('notify_email').default(true),
  notifyBrowser: boolean('notify_browser').default(false),
  notifyFlightReminders: boolean('notify_flight_reminders').default(true),
  notifyEventUpdates: boolean('notify_event_updates').default(true),
  notifyWeeklyDigest: boolean('notify_weekly_digest').default(false),

  // Privacy settings
  showEmail: boolean('show_email').default(false),
  showFlights: boolean('show_flights').default(true),
  showStatistics: boolean('show_statistics').default(true),
  showAirlines: boolean('show_airlines').default(true),

  // Stats (cached/computed)
  totalFlights: integer('total_flights').default(0),
  totalHours: decimal('total_hours', { precision: 10, scale: 2 }).default('0'),
  totalDistance: integer('total_distance').default(0), // in NM

  // VATSIM Statistics (from API)
  vatsimStats: json('vatsim_stats').$type<{
    atc?: {
      hours: number
      s1?: number
      s2?: number
      s3?: number
      c1?: number
      c3?: number
      i1?: number
      i3?: number
      sup?: number
      adm?: number
    }
    pilot?: {
      hours: number
      p1?: number
      p2?: number
      p3?: number
      p4?: number
    }
    regDate?: string
    lastRatingChange?: string
  }>(),
  vatsimStatsUpdatedAt: timestamp('vatsim_stats_updated_at'),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

// Airlines table
export const airlines = pgTable('airlines', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  code: varchar('code', { length: 3 }).notNull().unique(), // IATA code
  icao: varchar('icao', { length: 4 }).notNull().unique(), // ICAO code
  logo: varchar('logo', { length: 500 }),
  description: text('description'),
  tagline: varchar('tagline', { length: 200 }),

  region: regionEnum('region').default('europe'),
  founded: varchar('founded', { length: 4 }), // Year
  website: varchar('website', { length: 500 }),
  discord: varchar('discord', { length: 500 }),

  // Stats (cached/computed)
  memberCount: integer('member_count').default(0),
  flightCount: integer('flight_count').default(0),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0'),

  verified: boolean('verified').default(false),
  active: boolean('active').default(true),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

// Airline hubs
export const airlineHubs = pgTable('airline_hubs', {
  id: serial('id').primaryKey(),
  airlineId: integer('airline_id').notNull().references(() => airlines.id, { onDelete: 'cascade' }),
  icaoCode: varchar('icao_code', { length: 4 }).notNull()
})

// Airline fleet (aircraft types)
export const airlineFleet = pgTable('airline_fleet', {
  id: serial('id').primaryKey(),
  airlineId: integer('airline_id').notNull().references(() => airlines.id, { onDelete: 'cascade' }),
  aircraftType: varchar('aircraft_type', { length: 20 }).notNull() // e.g., 'A320', 'B747'
})

// Airline memberships (pilot <-> airline relationship)
export const airlineMemberships = pgTable('airline_memberships', {
  id: serial('id').primaryKey(),
  pilotId: integer('pilot_id').notNull().references(() => pilots.id, { onDelete: 'cascade' }),
  airlineId: integer('airline_id').notNull().references(() => airlines.id, { onDelete: 'cascade' }),

  role: memberRoleEnum('role').default('pilot'),
  rank: varchar('rank', { length: 100 }).default('New Pilot'),
  status: memberStatusEnum('status').default('active'),

  // Stats within this airline
  flights: integer('flights').default(0),
  hours: decimal('hours', { precision: 10, scale: 2 }).default('0'),

  joinedAt: timestamp('joined_at').defaultNow(),
  lastFlightAt: timestamp('last_flight_at')
})

// Airline invitations
export const airlineInvitations = pgTable('airline_invitations', {
  id: serial('id').primaryKey(),
  airlineId: integer('airline_id').notNull().references(() => airlines.id, { onDelete: 'cascade' }),
  pilotId: integer('pilot_id').notNull().references(() => pilots.id, { onDelete: 'cascade' }),
  invitedById: integer('invited_by_id').references(() => pilots.id),

  role: memberRoleEnum('role').default('pilot'),
  status: inviteStatusEnum('status').default('pending'),

  createdAt: timestamp('created_at').defaultNow(),
  respondedAt: timestamp('responded_at')
})

// ============================================================================
// NEW TABLES - Phase 1: Aircraft reference data
// ============================================================================

// Aircraft - Reference data for aircraft types
export const aircraft = pgTable('aircraft', {
  id: serial('id').primaryKey(),
  icaoCode: varchar('icao_code', { length: 4 }).notNull().unique(),
  iataCode: varchar('iata_code', { length: 3 }),
  name: varchar('name', { length: 200 }).notNull(),
  manufacturer: varchar('manufacturer', { length: 100 }),
  category: aircraftCategoryEnum('category'),

  maxPax: integer('max_pax'),
  maxCargo: integer('max_cargo'), // in kg
  range: integer('range'), // in NM
  cruiseSpeed: integer('cruise_speed'), // in knots
  imageUrl: varchar('image_url', { length: 500 }),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

// ============================================================================
// NEW TABLES - Phase 2: Tables with only existing FKs
// ============================================================================

// Routes - Airline flight schedules
export const routes = pgTable('routes', {
  id: serial('id').primaryKey(),
  airlineId: integer('airline_id').notNull().references(() => airlines.id, { onDelete: 'cascade' }),

  flightNumber: varchar('flight_number', { length: 10 }).notNull(),
  callsign: varchar('callsign', { length: 20 }),
  departureIcao: varchar('departure_icao', { length: 4 }).notNull(),
  arrivalIcao: varchar('arrival_icao', { length: 4 }).notNull(),
  distance: integer('distance'), // in NM
  flightLevel: integer('flight_level'),
  estimatedDuration: integer('estimated_duration'), // in minutes

  frequency: routeFrequencyEnum('frequency').default('daily'),
  daysOfWeek: varchar('days_of_week', { length: 20 }), // e.g., "1,2,3,4,5" for weekdays
  departureTime: varchar('departure_time', { length: 5 }), // e.g., "14:30"
  allowedAircraftTypes: json('allowed_aircraft_types').$type<string[]>(),

  timesFlown: integer('times_flown').default(0),
  popularity: decimal('popularity', { precision: 5, scale: 2 }).default('0'),
  active: boolean('active').default(true),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

// Events - Group flights, tours, competitions
export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  airlineId: integer('airline_id').notNull().references(() => airlines.id, { onDelete: 'cascade' }),
  createdById: integer('created_by_id').notNull().references(() => pilots.id),

  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  shortDescription: varchar('short_description', { length: 500 }),
  eventType: eventTypeEnum('event_type').notNull(),

  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  duration: integer('duration'), // in minutes

  departureIcao: varchar('departure_icao', { length: 4 }),
  arrivalIcao: varchar('arrival_icao', { length: 4 }),
  routeDescription: text('route_description'),
  allowedAircraft: json('allowed_aircraft').$type<string[]>(),

  maxParticipants: integer('max_participants'),
  currentParticipants: integer('current_participants').default(0),
  imageUrl: varchar('image_url', { length: 500 }),

  featured: boolean('featured').default(false),
  active: boolean('active').default(true),
  cancelled: boolean('cancelled').default(false),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

// News - Announcements and articles
export const news = pgTable('news', {
  id: serial('id').primaryKey(),
  airlineId: integer('airline_id').notNull().references(() => airlines.id, { onDelete: 'cascade' }),
  authorId: integer('author_id').notNull().references(() => pilots.id),

  title: varchar('title', { length: 300 }).notNull(),
  slug: varchar('slug', { length: 300 }).notNull().unique(),
  excerpt: varchar('excerpt', { length: 500 }),
  content: text('content').notNull(),
  category: newsCategoryEnum('category').default('announcement'),

  imageUrl: varchar('image_url', { length: 500 }),
  featured: boolean('featured').default(false),
  pinned: boolean('pinned').default(false),
  published: boolean('published').default(false),
  publishedAt: timestamp('published_at'),
  views: integer('views').default(0),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

// Airline Ranks - Rank progression within airlines
export const airlineRanks = pgTable('airline_ranks', {
  id: serial('id').primaryKey(),
  airlineId: integer('airline_id').notNull().references(() => airlines.id, { onDelete: 'cascade' }),

  name: varchar('name', { length: 100 }).notNull(),
  level: integer('level').notNull(),
  minHours: decimal('min_hours', { precision: 10, scale: 2 }).default('0'),
  minFlights: integer('min_flights').default(0),
  minXp: integer('min_xp').default(0),

  icon: varchar('icon', { length: 100 }),
  color: varchar('color', { length: 20 }),
  privileges: json('privileges').$type<string[]>(),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

// Achievements - Badges and accomplishments
export const achievements = pgTable('achievements', {
  id: serial('id').primaryKey(),
  airlineId: integer('airline_id').references(() => airlines.id, { onDelete: 'cascade' }), // null = global achievement

  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  rarity: achievementRarityEnum('rarity').default('common'),
  category: varchar('category', { length: 50 }),

  icon: varchar('icon', { length: 100 }),
  imageUrl: varchar('image_url', { length: 500 }),
  requirements: json('requirements').$type<Record<string, unknown>>(),
  xpReward: integer('xp_reward').default(0),

  hidden: boolean('hidden').default(false),
  active: boolean('active').default(true),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

// Pilot Career - Career progression tracking
export const pilotCareer = pgTable('pilot_career', {
  id: serial('id').primaryKey(),
  pilotId: integer('pilot_id').notNull().references(() => pilots.id, { onDelete: 'cascade' }).unique(),

  totalXp: integer('total_xp').default(0),
  currentLevel: integer('current_level').default(1),
  globalRankName: varchar('global_rank_name', { length: 100 }).default('Student Pilot'),

  uniqueAirportsVisited: integer('unique_airports_visited').default(0),
  uniqueAircraftFlown: integer('unique_aircraft_flown').default(0),
  longestFlight: integer('longest_flight').default(0), // in minutes

  currentStreak: integer('current_streak').default(0),
  longestStreak: integer('longest_streak').default(0),
  lastFlightDate: timestamp('last_flight_date'),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

// ============================================================================
// NEW TABLES - Phase 3: Tables with Phase 2 dependencies
// ============================================================================

// Flights - Logged/tracked flights
export const flights = pgTable('flights', {
  id: serial('id').primaryKey(),
  pilotId: integer('pilot_id').notNull().references(() => pilots.id, { onDelete: 'cascade' }),
  airlineId: integer('airline_id').references(() => airlines.id, { onDelete: 'set null' }),
  routeId: integer('route_id').references(() => routes.id, { onDelete: 'set null' }),

  flightNumber: varchar('flight_number', { length: 20 }),
  callsign: varchar('callsign', { length: 20 }),
  departureIcao: varchar('departure_icao', { length: 4 }).notNull(),
  arrivalIcao: varchar('arrival_icao', { length: 4 }).notNull(),
  alternateIcao: varchar('alternate_icao', { length: 4 }),

  aircraftIcao: varchar('aircraft_icao', { length: 4 }),
  aircraftRegistration: varchar('aircraft_registration', { length: 20 }),
  cruiseAltitude: integer('cruise_altitude'),
  plannedRoute: text('planned_route'),

  scheduledDeparture: timestamp('scheduled_departure'),
  actualDeparture: timestamp('actual_departure'),
  actualArrival: timestamp('actual_arrival'),
  blockTime: integer('block_time'), // in minutes
  flightTime: integer('flight_time'), // in minutes

  plannedDistance: integer('planned_distance'), // in NM
  actualDistance: integer('actual_distance'), // in NM
  fuelUsed: integer('fuel_used'), // in kg
  fuelPlanned: integer('fuel_planned'), // in kg

  landingRate: integer('landing_rate'), // in fpm (negative = descent)
  landingScore: integer('landing_score'), // 0-100
  vatsimFlightId: varchar('vatsim_flight_id', { length: 50 }),
  networkConnected: boolean('network_connected').default(false),

  status: flightStatusEnum('status').default('scheduled'),
  xpEarned: integer('xp_earned').default(0),
  trackingData: json('tracking_data').$type<Record<string, unknown>>(),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

// Event Registrations - Event participant tracking
export const eventRegistrations = pgTable('event_registrations', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  pilotId: integer('pilot_id').notNull().references(() => pilots.id, { onDelete: 'cascade' }),

  status: eventRegistrationStatusEnum('status').default('registered'),
  aircraftType: varchar('aircraft_type', { length: 10 }),
  currentLeg: integer('current_leg').default(0),
  completedLegs: integer('completed_legs').default(0),
  notes: text('notes'),

  registeredAt: timestamp('registered_at').defaultNow(),
  attendedAt: timestamp('attended_at'),
  cancelledAt: timestamp('cancelled_at')
})

// Event Legs - Tour stages
export const eventLegs = pgTable('event_legs', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),

  legNumber: integer('leg_number').notNull(),
  departureIcao: varchar('departure_icao', { length: 4 }).notNull(),
  arrivalIcao: varchar('arrival_icao', { length: 4 }).notNull(),
  distance: integer('distance'), // in NM
  estimatedDuration: integer('estimated_duration'), // in minutes

  briefing: text('briefing'),
  availableFrom: timestamp('available_from'),
  availableUntil: timestamp('available_until'),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

// Airline Reviews - User reviews for airlines
export const airlineReviews = pgTable('airline_reviews', {
  id: serial('id').primaryKey(),
  airlineId: integer('airline_id').notNull().references(() => airlines.id, { onDelete: 'cascade' }),
  pilotId: integer('pilot_id').notNull().references(() => pilots.id, { onDelete: 'cascade' }),

  rating: decimal('rating', { precision: 2, scale: 1 }).notNull(), // 1.0-5.0
  title: varchar('title', { length: 200 }),
  content: text('content'),

  ratingCommunity: integer('rating_community'), // 1-5
  ratingRoutes: integer('rating_routes'), // 1-5
  ratingEvents: integer('rating_events'), // 1-5
  ratingManagement: integer('rating_management'), // 1-5

  verified: boolean('verified').default(false),
  approved: boolean('approved').default(false),
  helpful: integer('helpful').default(0),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

// Pilot Achievements - Junction table for earned achievements
export const pilotAchievements = pgTable('pilot_achievements', {
  id: serial('id').primaryKey(),
  pilotId: integer('pilot_id').notNull().references(() => pilots.id, { onDelete: 'cascade' }),
  achievementId: integer('achievement_id').notNull().references(() => achievements.id, { onDelete: 'cascade' }),

  progress: integer('progress').default(0),
  target: integer('target').default(1),
  completed: boolean('completed').default(false),
  earnedAt: timestamp('earned_at'),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

// ============================================================================
// NEW TABLES - Phase 4: Tables with Phase 3 dependencies
// ============================================================================

// PIREPs - Pilot Reports
export const pireps = pgTable('pireps', {
  id: serial('id').primaryKey(),
  flightId: integer('flight_id').references(() => flights.id, { onDelete: 'set null' }),
  pilotId: integer('pilot_id').notNull().references(() => pilots.id, { onDelete: 'cascade' }),
  airlineId: integer('airline_id').references(() => airlines.id, { onDelete: 'set null' }),

  route: varchar('route', { length: 100 }), // e.g., "EDDF-KJFK"
  comments: text('comments'),
  flightTime: integer('flight_time'), // in minutes
  fuelUsed: integer('fuel_used'), // in kg
  landingRate: integer('landing_rate'), // in fpm

  departureMetar: text('departure_metar'),
  arrivalMetar: text('arrival_metar'),
  status: pirepStatusEnum('status').default('pending'),

  reviewedById: integer('reviewed_by_id').references(() => pilots.id),
  reviewedAt: timestamp('reviewed_at'),
  reviewNotes: text('review_notes'),
  score: integer('score'), // 0-100

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

// ============================================================================
// RELATIONS
// ============================================================================

// Pilots relations (extended)
export const pilotsRelations = relations(pilots, ({ one, many }) => ({
  memberships: many(airlineMemberships),
  invitations: many(airlineInvitations),
  flights: many(flights),
  pireps: many(pireps),
  eventRegistrations: many(eventRegistrations),
  achievements: many(pilotAchievements),
  reviews: many(airlineReviews),
  career: one(pilotCareer),
  createdEvents: many(events),
  authoredNews: many(news)
}))

// Airlines relations (extended)
export const airlinesRelations = relations(airlines, ({ many }) => ({
  memberships: many(airlineMemberships),
  hubs: many(airlineHubs),
  fleet: many(airlineFleet),
  invitations: many(airlineInvitations),
  routes: many(routes),
  flights: many(flights),
  pireps: many(pireps),
  events: many(events),
  news: many(news),
  ranks: many(airlineRanks),
  achievements: many(achievements),
  reviews: many(airlineReviews)
}))

export const airlineMembershipsRelations = relations(airlineMemberships, ({ one }) => ({
  pilot: one(pilots, {
    fields: [airlineMemberships.pilotId],
    references: [pilots.id]
  }),
  airline: one(airlines, {
    fields: [airlineMemberships.airlineId],
    references: [airlines.id]
  })
}))

export const airlineHubsRelations = relations(airlineHubs, ({ one }) => ({
  airline: one(airlines, {
    fields: [airlineHubs.airlineId],
    references: [airlines.id]
  })
}))

export const airlineFleetRelations = relations(airlineFleet, ({ one }) => ({
  airline: one(airlines, {
    fields: [airlineFleet.airlineId],
    references: [airlines.id]
  })
}))

export const airlineInvitationsRelations = relations(airlineInvitations, ({ one }) => ({
  airline: one(airlines, {
    fields: [airlineInvitations.airlineId],
    references: [airlines.id]
  }),
  pilot: one(pilots, {
    fields: [airlineInvitations.pilotId],
    references: [pilots.id]
  }),
  invitedBy: one(pilots, {
    fields: [airlineInvitations.invitedById],
    references: [pilots.id]
  })
}))

// Routes relations
export const routesRelations = relations(routes, ({ one, many }) => ({
  airline: one(airlines, {
    fields: [routes.airlineId],
    references: [airlines.id]
  }),
  flights: many(flights)
}))

// Flights relations
export const flightsRelations = relations(flights, ({ one, many }) => ({
  pilot: one(pilots, {
    fields: [flights.pilotId],
    references: [pilots.id]
  }),
  airline: one(airlines, {
    fields: [flights.airlineId],
    references: [airlines.id]
  }),
  route: one(routes, {
    fields: [flights.routeId],
    references: [routes.id]
  }),
  pireps: many(pireps)
}))

// PIREPs relations
export const pirepsRelations = relations(pireps, ({ one }) => ({
  flight: one(flights, {
    fields: [pireps.flightId],
    references: [flights.id]
  }),
  pilot: one(pilots, {
    fields: [pireps.pilotId],
    references: [pilots.id]
  }),
  airline: one(airlines, {
    fields: [pireps.airlineId],
    references: [airlines.id]
  }),
  reviewedBy: one(pilots, {
    fields: [pireps.reviewedById],
    references: [pilots.id]
  })
}))

// Events relations
export const eventsRelations = relations(events, ({ one, many }) => ({
  airline: one(airlines, {
    fields: [events.airlineId],
    references: [airlines.id]
  }),
  createdBy: one(pilots, {
    fields: [events.createdById],
    references: [pilots.id]
  }),
  registrations: many(eventRegistrations),
  legs: many(eventLegs)
}))

// Event Registrations relations
export const eventRegistrationsRelations = relations(eventRegistrations, ({ one }) => ({
  event: one(events, {
    fields: [eventRegistrations.eventId],
    references: [events.id]
  }),
  pilot: one(pilots, {
    fields: [eventRegistrations.pilotId],
    references: [pilots.id]
  })
}))

// Event Legs relations
export const eventLegsRelations = relations(eventLegs, ({ one }) => ({
  event: one(events, {
    fields: [eventLegs.eventId],
    references: [events.id]
  })
}))

// News relations
export const newsRelations = relations(news, ({ one }) => ({
  airline: one(airlines, {
    fields: [news.airlineId],
    references: [airlines.id]
  }),
  author: one(pilots, {
    fields: [news.authorId],
    references: [pilots.id]
  })
}))

// Airline Ranks relations
export const airlineRanksRelations = relations(airlineRanks, ({ one }) => ({
  airline: one(airlines, {
    fields: [airlineRanks.airlineId],
    references: [airlines.id]
  })
}))

// Achievements relations
export const achievementsRelations = relations(achievements, ({ one, many }) => ({
  airline: one(airlines, {
    fields: [achievements.airlineId],
    references: [airlines.id]
  }),
  pilotAchievements: many(pilotAchievements)
}))

// Pilot Achievements relations
export const pilotAchievementsRelations = relations(pilotAchievements, ({ one }) => ({
  pilot: one(pilots, {
    fields: [pilotAchievements.pilotId],
    references: [pilots.id]
  }),
  achievement: one(achievements, {
    fields: [pilotAchievements.achievementId],
    references: [achievements.id]
  })
}))

// Pilot Career relations
export const pilotCareerRelations = relations(pilotCareer, ({ one }) => ({
  pilot: one(pilots, {
    fields: [pilotCareer.pilotId],
    references: [pilots.id]
  })
}))

// Airline Reviews relations
export const airlineReviewsRelations = relations(airlineReviews, ({ one }) => ({
  airline: one(airlines, {
    fields: [airlineReviews.airlineId],
    references: [airlines.id]
  }),
  pilot: one(pilots, {
    fields: [airlineReviews.pilotId],
    references: [pilots.id]
  })
}))

// ============================================================================
// TYPE EXPORTS
// ============================================================================

// Existing types
export type Pilot = typeof pilots.$inferSelect
export type NewPilot = typeof pilots.$inferInsert
export type Airline = typeof airlines.$inferSelect
export type NewAirline = typeof airlines.$inferInsert
export type AirlineMembership = typeof airlineMemberships.$inferSelect
export type AirlineInvitation = typeof airlineInvitations.$inferSelect

// New types - Aircraft
export type Aircraft = typeof aircraft.$inferSelect
export type NewAircraft = typeof aircraft.$inferInsert

// New types - Routes
export type Route = typeof routes.$inferSelect
export type NewRoute = typeof routes.$inferInsert

// New types - Flights
export type Flight = typeof flights.$inferSelect
export type NewFlight = typeof flights.$inferInsert

// New types - PIREPs
export type Pirep = typeof pireps.$inferSelect
export type NewPirep = typeof pireps.$inferInsert

// New types - Events
export type Event = typeof events.$inferSelect
export type NewEvent = typeof events.$inferInsert

// New types - Event Registrations
export type EventRegistration = typeof eventRegistrations.$inferSelect
export type NewEventRegistration = typeof eventRegistrations.$inferInsert

// New types - Event Legs
export type EventLeg = typeof eventLegs.$inferSelect
export type NewEventLeg = typeof eventLegs.$inferInsert

// New types - News
export type News = typeof news.$inferSelect
export type NewNews = typeof news.$inferInsert

// New types - Airline Ranks
export type AirlineRank = typeof airlineRanks.$inferSelect
export type NewAirlineRank = typeof airlineRanks.$inferInsert

// New types - Achievements
export type Achievement = typeof achievements.$inferSelect
export type NewAchievement = typeof achievements.$inferInsert

// New types - Pilot Achievements
export type PilotAchievement = typeof pilotAchievements.$inferSelect
export type NewPilotAchievement = typeof pilotAchievements.$inferInsert

// New types - Pilot Career
export type PilotCareer = typeof pilotCareer.$inferSelect
export type NewPilotCareer = typeof pilotCareer.$inferInsert

// New types - Airline Reviews
export type AirlineReview = typeof airlineReviews.$inferSelect
export type NewAirlineReview = typeof airlineReviews.$inferInsert
