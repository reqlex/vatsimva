CREATE TYPE "public"."achievement_rarity" AS ENUM('common', 'uncommon', 'rare', 'epic', 'legendary');--> statement-breakpoint
CREATE TYPE "public"."aircraft_category" AS ENUM('narrowbody', 'widebody', 'regional', 'cargo', 'ga', 'military');--> statement-breakpoint
CREATE TYPE "public"."event_registration_status" AS ENUM('registered', 'waitlist', 'cancelled', 'attended', 'no-show');--> statement-breakpoint
CREATE TYPE "public"."event_type" AS ENUM('group-flight', 'fly-in', 'tour', 'competition');--> statement-breakpoint
CREATE TYPE "public"."flight_status" AS ENUM('scheduled', 'boarding', 'departed', 'enroute', 'arrived', 'completed', 'cancelled', 'diverted');--> statement-breakpoint
CREATE TYPE "public"."invite_status" AS ENUM('pending', 'accepted', 'declined');--> statement-breakpoint
CREATE TYPE "public"."member_role" AS ENUM('owner', 'admin', 'staff', 'pilot');--> statement-breakpoint
CREATE TYPE "public"."member_status" AS ENUM('active', 'inactive', 'pending');--> statement-breakpoint
CREATE TYPE "public"."news_category" AS ENUM('announcement', 'event', 'update', 'tutorial', 'community');--> statement-breakpoint
CREATE TYPE "public"."pirep_status" AS ENUM('draft', 'pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."region" AS ENUM('europe', 'north-america', 'asia', 'middle-east', 'south-america', 'africa', 'oceania');--> statement-breakpoint
CREATE TYPE "public"."route_frequency" AS ENUM('daily', 'weekdays', 'weekends', 'weekly', 'custom');--> statement-breakpoint
CREATE TABLE "achievements" (
	"id" serial PRIMARY KEY NOT NULL,
	"airline_id" integer,
	"name" varchar(100) NOT NULL,
	"description" text,
	"rarity" "achievement_rarity" DEFAULT 'common',
	"category" varchar(50),
	"icon" varchar(100),
	"image_url" varchar(500),
	"requirements" json,
	"xp_reward" integer DEFAULT 0,
	"hidden" boolean DEFAULT false,
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "aircraft" (
	"id" serial PRIMARY KEY NOT NULL,
	"icao_code" varchar(4) NOT NULL,
	"iata_code" varchar(3),
	"name" varchar(200) NOT NULL,
	"manufacturer" varchar(100),
	"category" "aircraft_category",
	"max_pax" integer,
	"max_cargo" integer,
	"range" integer,
	"cruise_speed" integer,
	"image_url" varchar(500),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "aircraft_icao_code_unique" UNIQUE("icao_code")
);
--> statement-breakpoint
CREATE TABLE "airline_fleet" (
	"id" serial PRIMARY KEY NOT NULL,
	"airline_id" integer NOT NULL,
	"aircraft_type" varchar(20) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "airline_hubs" (
	"id" serial PRIMARY KEY NOT NULL,
	"airline_id" integer NOT NULL,
	"icao_code" varchar(4) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "airline_invitations" (
	"id" serial PRIMARY KEY NOT NULL,
	"airline_id" integer NOT NULL,
	"pilot_id" integer NOT NULL,
	"invited_by_id" integer,
	"role" "member_role" DEFAULT 'pilot',
	"status" "invite_status" DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	"responded_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "airline_memberships" (
	"id" serial PRIMARY KEY NOT NULL,
	"pilot_id" integer NOT NULL,
	"airline_id" integer NOT NULL,
	"role" "member_role" DEFAULT 'pilot',
	"rank" varchar(100) DEFAULT 'New Pilot',
	"status" "member_status" DEFAULT 'active',
	"flights" integer DEFAULT 0,
	"hours" numeric(10, 2) DEFAULT '0',
	"joined_at" timestamp DEFAULT now(),
	"last_flight_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "airline_ranks" (
	"id" serial PRIMARY KEY NOT NULL,
	"airline_id" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"level" integer NOT NULL,
	"min_hours" numeric(10, 2) DEFAULT '0',
	"min_flights" integer DEFAULT 0,
	"min_xp" integer DEFAULT 0,
	"icon" varchar(100),
	"color" varchar(20),
	"privileges" json,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "airline_reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"airline_id" integer NOT NULL,
	"pilot_id" integer NOT NULL,
	"rating" numeric(2, 1) NOT NULL,
	"title" varchar(200),
	"content" text,
	"rating_community" integer,
	"rating_routes" integer,
	"rating_events" integer,
	"rating_management" integer,
	"verified" boolean DEFAULT false,
	"approved" boolean DEFAULT false,
	"helpful" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "airlines" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"code" varchar(3) NOT NULL,
	"icao" varchar(4) NOT NULL,
	"logo" varchar(500),
	"description" text,
	"tagline" varchar(200),
	"region" "region" DEFAULT 'europe',
	"founded" varchar(4),
	"website" varchar(500),
	"discord" varchar(500),
	"member_count" integer DEFAULT 0,
	"flight_count" integer DEFAULT 0,
	"rating" numeric(3, 2) DEFAULT '0',
	"verified" boolean DEFAULT false,
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "airlines_code_unique" UNIQUE("code"),
	CONSTRAINT "airlines_icao_unique" UNIQUE("icao")
);
--> statement-breakpoint
CREATE TABLE "event_legs" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"leg_number" integer NOT NULL,
	"departure_icao" varchar(4) NOT NULL,
	"arrival_icao" varchar(4) NOT NULL,
	"distance" integer,
	"estimated_duration" integer,
	"briefing" text,
	"available_from" timestamp,
	"available_until" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "event_registrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"pilot_id" integer NOT NULL,
	"status" "event_registration_status" DEFAULT 'registered',
	"aircraft_type" varchar(10),
	"current_leg" integer DEFAULT 0,
	"completed_legs" integer DEFAULT 0,
	"notes" text,
	"registered_at" timestamp DEFAULT now(),
	"attended_at" timestamp,
	"cancelled_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"airline_id" integer NOT NULL,
	"created_by_id" integer NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"short_description" varchar(500),
	"event_type" "event_type" NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"duration" integer,
	"departure_icao" varchar(4),
	"arrival_icao" varchar(4),
	"route_description" text,
	"allowed_aircraft" json,
	"max_participants" integer,
	"current_participants" integer DEFAULT 0,
	"image_url" varchar(500),
	"featured" boolean DEFAULT false,
	"active" boolean DEFAULT true,
	"cancelled" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "flights" (
	"id" serial PRIMARY KEY NOT NULL,
	"pilot_id" integer NOT NULL,
	"airline_id" integer,
	"route_id" integer,
	"flight_number" varchar(20),
	"callsign" varchar(20),
	"departure_icao" varchar(4) NOT NULL,
	"arrival_icao" varchar(4) NOT NULL,
	"alternate_icao" varchar(4),
	"aircraft_icao" varchar(4),
	"aircraft_registration" varchar(20),
	"cruise_altitude" integer,
	"planned_route" text,
	"scheduled_departure" timestamp,
	"actual_departure" timestamp,
	"actual_arrival" timestamp,
	"block_time" integer,
	"flight_time" integer,
	"planned_distance" integer,
	"actual_distance" integer,
	"fuel_used" integer,
	"fuel_planned" integer,
	"landing_rate" integer,
	"landing_score" integer,
	"vatsim_flight_id" varchar(50),
	"network_connected" boolean DEFAULT false,
	"status" "flight_status" DEFAULT 'scheduled',
	"xp_earned" integer DEFAULT 0,
	"tracking_data" json,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "news" (
	"id" serial PRIMARY KEY NOT NULL,
	"airline_id" integer NOT NULL,
	"author_id" integer NOT NULL,
	"title" varchar(300) NOT NULL,
	"slug" varchar(300) NOT NULL,
	"excerpt" varchar(500),
	"content" text NOT NULL,
	"category" "news_category" DEFAULT 'announcement',
	"image_url" varchar(500),
	"featured" boolean DEFAULT false,
	"pinned" boolean DEFAULT false,
	"published" boolean DEFAULT false,
	"published_at" timestamp,
	"views" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "news_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "pilot_achievements" (
	"id" serial PRIMARY KEY NOT NULL,
	"pilot_id" integer NOT NULL,
	"achievement_id" integer NOT NULL,
	"progress" integer DEFAULT 0,
	"target" integer DEFAULT 1,
	"completed" boolean DEFAULT false,
	"earned_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pilot_career" (
	"id" serial PRIMARY KEY NOT NULL,
	"pilot_id" integer NOT NULL,
	"total_xp" integer DEFAULT 0,
	"current_level" integer DEFAULT 1,
	"global_rank_name" varchar(100) DEFAULT 'Student Pilot',
	"unique_airports_visited" integer DEFAULT 0,
	"unique_aircraft_flown" integer DEFAULT 0,
	"longest_flight" integer DEFAULT 0,
	"current_streak" integer DEFAULT 0,
	"longest_streak" integer DEFAULT 0,
	"last_flight_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "pilot_career_pilot_id_unique" UNIQUE("pilot_id")
);
--> statement-breakpoint
CREATE TABLE "pilots" (
	"id" serial PRIMARY KEY NOT NULL,
	"cid" varchar(20) NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"country" varchar(100),
	"rating" varchar(20),
	"pilot_rating" varchar(20),
	"division" varchar(100),
	"display_name" varchar(100),
	"bio" text,
	"home_airport" varchar(4),
	"timezone" varchar(50) DEFAULT 'UTC',
	"notify_email" boolean DEFAULT true,
	"notify_browser" boolean DEFAULT false,
	"notify_flight_reminders" boolean DEFAULT true,
	"notify_event_updates" boolean DEFAULT true,
	"notify_weekly_digest" boolean DEFAULT false,
	"show_email" boolean DEFAULT false,
	"show_flights" boolean DEFAULT true,
	"show_statistics" boolean DEFAULT true,
	"show_airlines" boolean DEFAULT true,
	"total_flights" integer DEFAULT 0,
	"total_hours" numeric(10, 2) DEFAULT '0',
	"total_distance" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "pilots_cid_unique" UNIQUE("cid")
);
--> statement-breakpoint
CREATE TABLE "pireps" (
	"id" serial PRIMARY KEY NOT NULL,
	"flight_id" integer,
	"pilot_id" integer NOT NULL,
	"airline_id" integer,
	"route" varchar(100),
	"comments" text,
	"flight_time" integer,
	"fuel_used" integer,
	"landing_rate" integer,
	"departure_metar" text,
	"arrival_metar" text,
	"status" "pirep_status" DEFAULT 'pending',
	"reviewed_by_id" integer,
	"reviewed_at" timestamp,
	"review_notes" text,
	"score" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "routes" (
	"id" serial PRIMARY KEY NOT NULL,
	"airline_id" integer NOT NULL,
	"flight_number" varchar(10) NOT NULL,
	"callsign" varchar(20),
	"departure_icao" varchar(4) NOT NULL,
	"arrival_icao" varchar(4) NOT NULL,
	"distance" integer,
	"flight_level" integer,
	"estimated_duration" integer,
	"frequency" "route_frequency" DEFAULT 'daily',
	"days_of_week" varchar(20),
	"departure_time" varchar(5),
	"allowed_aircraft_types" json,
	"times_flown" integer DEFAULT 0,
	"popularity" numeric(5, 2) DEFAULT '0',
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_airline_id_airlines_id_fk" FOREIGN KEY ("airline_id") REFERENCES "public"."airlines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "airline_fleet" ADD CONSTRAINT "airline_fleet_airline_id_airlines_id_fk" FOREIGN KEY ("airline_id") REFERENCES "public"."airlines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "airline_hubs" ADD CONSTRAINT "airline_hubs_airline_id_airlines_id_fk" FOREIGN KEY ("airline_id") REFERENCES "public"."airlines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "airline_invitations" ADD CONSTRAINT "airline_invitations_airline_id_airlines_id_fk" FOREIGN KEY ("airline_id") REFERENCES "public"."airlines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "airline_invitations" ADD CONSTRAINT "airline_invitations_pilot_id_pilots_id_fk" FOREIGN KEY ("pilot_id") REFERENCES "public"."pilots"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "airline_invitations" ADD CONSTRAINT "airline_invitations_invited_by_id_pilots_id_fk" FOREIGN KEY ("invited_by_id") REFERENCES "public"."pilots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "airline_memberships" ADD CONSTRAINT "airline_memberships_pilot_id_pilots_id_fk" FOREIGN KEY ("pilot_id") REFERENCES "public"."pilots"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "airline_memberships" ADD CONSTRAINT "airline_memberships_airline_id_airlines_id_fk" FOREIGN KEY ("airline_id") REFERENCES "public"."airlines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "airline_ranks" ADD CONSTRAINT "airline_ranks_airline_id_airlines_id_fk" FOREIGN KEY ("airline_id") REFERENCES "public"."airlines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "airline_reviews" ADD CONSTRAINT "airline_reviews_airline_id_airlines_id_fk" FOREIGN KEY ("airline_id") REFERENCES "public"."airlines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "airline_reviews" ADD CONSTRAINT "airline_reviews_pilot_id_pilots_id_fk" FOREIGN KEY ("pilot_id") REFERENCES "public"."pilots"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_legs" ADD CONSTRAINT "event_legs_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_pilot_id_pilots_id_fk" FOREIGN KEY ("pilot_id") REFERENCES "public"."pilots"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_airline_id_airlines_id_fk" FOREIGN KEY ("airline_id") REFERENCES "public"."airlines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_created_by_id_pilots_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."pilots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flights" ADD CONSTRAINT "flights_pilot_id_pilots_id_fk" FOREIGN KEY ("pilot_id") REFERENCES "public"."pilots"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flights" ADD CONSTRAINT "flights_airline_id_airlines_id_fk" FOREIGN KEY ("airline_id") REFERENCES "public"."airlines"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flights" ADD CONSTRAINT "flights_route_id_routes_id_fk" FOREIGN KEY ("route_id") REFERENCES "public"."routes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "news" ADD CONSTRAINT "news_airline_id_airlines_id_fk" FOREIGN KEY ("airline_id") REFERENCES "public"."airlines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "news" ADD CONSTRAINT "news_author_id_pilots_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."pilots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pilot_achievements" ADD CONSTRAINT "pilot_achievements_pilot_id_pilots_id_fk" FOREIGN KEY ("pilot_id") REFERENCES "public"."pilots"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pilot_achievements" ADD CONSTRAINT "pilot_achievements_achievement_id_achievements_id_fk" FOREIGN KEY ("achievement_id") REFERENCES "public"."achievements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pilot_career" ADD CONSTRAINT "pilot_career_pilot_id_pilots_id_fk" FOREIGN KEY ("pilot_id") REFERENCES "public"."pilots"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pireps" ADD CONSTRAINT "pireps_flight_id_flights_id_fk" FOREIGN KEY ("flight_id") REFERENCES "public"."flights"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pireps" ADD CONSTRAINT "pireps_pilot_id_pilots_id_fk" FOREIGN KEY ("pilot_id") REFERENCES "public"."pilots"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pireps" ADD CONSTRAINT "pireps_airline_id_airlines_id_fk" FOREIGN KEY ("airline_id") REFERENCES "public"."airlines"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pireps" ADD CONSTRAINT "pireps_reviewed_by_id_pilots_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."pilots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routes" ADD CONSTRAINT "routes_airline_id_airlines_id_fk" FOREIGN KEY ("airline_id") REFERENCES "public"."airlines"("id") ON DELETE cascade ON UPDATE no action;