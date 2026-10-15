import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Baseline schema for fresh databases. Existing databases were created via dev-mode
  // schema push before migrations existed, so skip if the schema is already there.
  const existing = await db.execute(sql`SELECT to_regclass('public.home') AS t`)
  if (existing.rows[0]?.t) {
    payload.logger.info('Schema already exists, skipping baseline migration.')
    return
  }
  await db.execute(sql`
   CREATE TYPE "public"."enum_traditions_when" AS ENUM('Fall', 'Winter', 'Spring', 'Summer');
  CREATE TYPE "public"."enum_schedule_days" AS ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
  CREATE TYPE "public"."enum_schedule_difficulty" AS ENUM('easy', 'medium', 'hard');
  CREATE TYPE "public"."enum_records_category" AS ENUM('track', 'xc', 'road', 'field', 'misc');
  CREATE TYPE "public"."enum_routes_type" AS ENUM('campus', 'offCampus');
  CREATE TYPE "public"."enum_contacts_role" AS ENUM('co-president', 'president', 'vice-president', 'treasurer', 'secretary', 'webmaster', 'social-chair', 'other');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "traditions_when" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_traditions_when",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "traditions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "schedule_days" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_schedule_days",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "schedule" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"image_id" integer NOT NULL,
  	"time" varchar NOT NULL,
  	"location_name" varchar NOT NULL,
  	"location_url" varchar,
  	"difficulty" "enum_schedule_difficulty" NOT NULL,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "records" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"category" "enum_records_category" NOT NULL,
  	"distance" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"time" varchar NOT NULL,
  	"date" varchar NOT NULL,
  	"location" varchar NOT NULL,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "routes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"type" "enum_routes_type" NOT NULL,
  	"distance" numeric,
  	"climb" numeric,
  	"strava_id" varchar,
  	"is_rickroll" boolean DEFAULT false,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "contacts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"image_id" integer NOT NULL,
  	"role" "enum_contacts_role" NOT NULL,
  	"custom_role" varchar,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "history" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"year" numeric NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"image_id" integer,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"traditions_id" integer,
  	"schedule_id" integer,
  	"records_id" integer,
  	"routes_id" integer,
  	"contacts_id" integer,
  	"history_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "about_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "about" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"header" varchar DEFAULT 'WE DO IT ALL' NOT NULL,
  	"description" varchar DEFAULT 'Whether you''re a total newbie or a seasoned marathoner, we''re your running squad! 🏃‍♂️ Join undegrads, grad students, profs, and Stanford presidents for runs whenever you can make it. No pressure, just good vibes and great company. Trust us, there''s always someone at your pace ready to hit the trails! Come run with us and see what the hype is all about. 🌲' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"banner" varchar,
  	"hero_image_id" integer NOT NULL,
  	"hero_text" varchar DEFAULT 'Run with us.' NOT NULL,
  	"join_us_image_id" integer NOT NULL,
  	"discord_url" varchar DEFAULT 'https://discord.gg/' NOT NULL,
  	"calendar_url" varchar DEFAULT 'https://outlook.office365.com/owa/calendar/b6f73639d6304cdab5c7a39f7cf7092a@stanford.edu/e8a81f3347a346768bc04112919325d715752844312060503601/calendar.html' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "team" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"header" varchar DEFAULT 'COMPETE WITH US!' NOT NULL,
  	"description" varchar DEFAULT 'Ran in high school? We compete in cross country, track, and road races across the Bay Area and beyond. We have a great time and are always looking for new members.' NOT NULL,
  	"hero_image_id" integer NOT NULL,
  	"join_url" varchar DEFAULT 'https://docs.google.com/forms/d/e/1FAIpQLSfqAx6QZlH1p14ZFe7uNFYTMaP15KNZ7BCYNd__-1Wid1flQQ/viewform?usp=sf_link' NOT NULL,
  	"coach_name" varchar DEFAULT 'Ernest Lee' NOT NULL,
  	"coach_bio" varchar DEFAULT 'A Palo Alto native (born in Stanford Hospital), Ernie Lee ran competitively for Gunn High School and Princeton University. After graduating with a degree in physics, Ernie completed graduate studies at Stanford in the applied physics department. It was then that he began coaching at his former high school. He coached both cross country and track and field at Gunn High School for 18 years. Ernie currently works for a nanomaterials company and still races as a member of the HOKA Aggies Running Club.' NOT NULL,
  	"coach_image_id" integer NOT NULL,
  	"coach_headshot_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "traditions_when" ADD CONSTRAINT "traditions_when_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."traditions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "traditions" ADD CONSTRAINT "traditions_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "schedule_days" ADD CONSTRAINT "schedule_days_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."schedule"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "schedule" ADD CONSTRAINT "schedule_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contacts" ADD CONSTRAINT "contacts_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "history" ADD CONSTRAINT "history_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_traditions_fk" FOREIGN KEY ("traditions_id") REFERENCES "public"."traditions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_schedule_fk" FOREIGN KEY ("schedule_id") REFERENCES "public"."schedule"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_records_fk" FOREIGN KEY ("records_id") REFERENCES "public"."records"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_routes_fk" FOREIGN KEY ("routes_id") REFERENCES "public"."routes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contacts_fk" FOREIGN KEY ("contacts_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_history_fk" FOREIGN KEY ("history_id") REFERENCES "public"."history"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_images" ADD CONSTRAINT "about_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_images" ADD CONSTRAINT "about_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_join_us_image_id_media_id_fk" FOREIGN KEY ("join_us_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team" ADD CONSTRAINT "team_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team" ADD CONSTRAINT "team_coach_image_id_media_id_fk" FOREIGN KEY ("coach_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team" ADD CONSTRAINT "team_coach_headshot_id_media_id_fk" FOREIGN KEY ("coach_headshot_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "traditions_when_order_idx" ON "traditions_when" USING btree ("order");
  CREATE INDEX "traditions_when_parent_idx" ON "traditions_when" USING btree ("parent_id");
  CREATE INDEX "traditions_image_idx" ON "traditions" USING btree ("image_id");
  CREATE INDEX "traditions_updated_at_idx" ON "traditions" USING btree ("updated_at");
  CREATE INDEX "traditions_created_at_idx" ON "traditions" USING btree ("created_at");
  CREATE INDEX "schedule_days_order_idx" ON "schedule_days" USING btree ("order");
  CREATE INDEX "schedule_days_parent_idx" ON "schedule_days" USING btree ("parent_id");
  CREATE INDEX "schedule_image_idx" ON "schedule" USING btree ("image_id");
  CREATE INDEX "schedule_updated_at_idx" ON "schedule" USING btree ("updated_at");
  CREATE INDEX "schedule_created_at_idx" ON "schedule" USING btree ("created_at");
  CREATE INDEX "records_updated_at_idx" ON "records" USING btree ("updated_at");
  CREATE INDEX "records_created_at_idx" ON "records" USING btree ("created_at");
  CREATE INDEX "routes_updated_at_idx" ON "routes" USING btree ("updated_at");
  CREATE INDEX "routes_created_at_idx" ON "routes" USING btree ("created_at");
  CREATE INDEX "contacts_image_idx" ON "contacts" USING btree ("image_id");
  CREATE INDEX "contacts_updated_at_idx" ON "contacts" USING btree ("updated_at");
  CREATE INDEX "contacts_created_at_idx" ON "contacts" USING btree ("created_at");
  CREATE INDEX "history_image_idx" ON "history" USING btree ("image_id");
  CREATE INDEX "history_updated_at_idx" ON "history" USING btree ("updated_at");
  CREATE INDEX "history_created_at_idx" ON "history" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_traditions_id_idx" ON "payload_locked_documents_rels" USING btree ("traditions_id");
  CREATE INDEX "payload_locked_documents_rels_schedule_id_idx" ON "payload_locked_documents_rels" USING btree ("schedule_id");
  CREATE INDEX "payload_locked_documents_rels_records_id_idx" ON "payload_locked_documents_rels" USING btree ("records_id");
  CREATE INDEX "payload_locked_documents_rels_routes_id_idx" ON "payload_locked_documents_rels" USING btree ("routes_id");
  CREATE INDEX "payload_locked_documents_rels_contacts_id_idx" ON "payload_locked_documents_rels" USING btree ("contacts_id");
  CREATE INDEX "payload_locked_documents_rels_history_id_idx" ON "payload_locked_documents_rels" USING btree ("history_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "about_images_order_idx" ON "about_images" USING btree ("_order");
  CREATE INDEX "about_images_parent_id_idx" ON "about_images" USING btree ("_parent_id");
  CREATE INDEX "about_images_image_idx" ON "about_images" USING btree ("image_id");
  CREATE INDEX "home_hero_image_idx" ON "home" USING btree ("hero_image_id");
  CREATE INDEX "home_join_us_image_idx" ON "home" USING btree ("join_us_image_id");
  CREATE INDEX "team_hero_image_idx" ON "team" USING btree ("hero_image_id");
  CREATE INDEX "team_coach_image_idx" ON "team" USING btree ("coach_image_id");
  CREATE INDEX "team_coach_headshot_idx" ON "team" USING btree ("coach_headshot_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "traditions_when" CASCADE;
  DROP TABLE "traditions" CASCADE;
  DROP TABLE "schedule_days" CASCADE;
  DROP TABLE "schedule" CASCADE;
  DROP TABLE "records" CASCADE;
  DROP TABLE "routes" CASCADE;
  DROP TABLE "contacts" CASCADE;
  DROP TABLE "history" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "about_images" CASCADE;
  DROP TABLE "about" CASCADE;
  DROP TABLE "home" CASCADE;
  DROP TABLE "team" CASCADE;
  DROP TYPE "public"."enum_traditions_when";
  DROP TYPE "public"."enum_schedule_days";
  DROP TYPE "public"."enum_schedule_difficulty";
  DROP TYPE "public"."enum_records_category";
  DROP TYPE "public"."enum_routes_type";
  DROP TYPE "public"."enum_contacts_role";`)
}
