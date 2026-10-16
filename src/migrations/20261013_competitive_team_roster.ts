import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_competitive_team_members_event_interests" AS ENUM(
        'sprints',
        'jumps',
        'mid-distance',
        'distance',
        'long-distance',
        'uphill-trail'
      );
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_competitive_team_members_class_year" AS ENUM(
        'frosh',
        'soph',
        'junior',
        'senior',
        'grad'
      );
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;

    CREATE TABLE IF NOT EXISTS "competitive_team_members" (
      "id" serial PRIMARY KEY NOT NULL,
      "published" boolean DEFAULT false,
      "name" varchar NOT NULL,
      "photo_id" integer,
      "class_year" "enum_competitive_team_members_class_year" NOT NULL,
      "season" varchar DEFAULT '2025–26' NOT NULL,
      "hometown" varchar,
      "high_school" varchar,
      "major" varchar,
      "main_events" varchar,
      "fun_fact" varchar,
      "highlights" varchar,
      "order" numeric DEFAULT 0 NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "competitive_team_members_event_interests" (
      "order" integer NOT NULL,
      "parent_id" integer NOT NULL,
      "value" "enum_competitive_team_members_event_interests",
      "id" serial PRIMARY KEY NOT NULL
    );

    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'competitive_team_members_event_interests_parent_fk'
      ) THEN
        ALTER TABLE "competitive_team_members_event_interests"
          ADD CONSTRAINT "competitive_team_members_event_interests_parent_fk"
          FOREIGN KEY ("parent_id") REFERENCES "public"."competitive_team_members"("id")
          ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'competitive_team_members_photo_id_media_id_fk'
      ) THEN
        ALTER TABLE "competitive_team_members"
          ADD CONSTRAINT "competitive_team_members_photo_id_media_id_fk"
          FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id")
          ON DELETE set null ON UPDATE no action;
      END IF;
    END $$;

    CREATE INDEX IF NOT EXISTS "competitive_team_members_event_interests_order_idx"
      ON "competitive_team_members_event_interests" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "competitive_team_members_event_interests_parent_idx"
      ON "competitive_team_members_event_interests" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "competitive_team_members_photo_idx"
      ON "competitive_team_members" USING btree ("photo_id");
    CREATE INDEX IF NOT EXISTS "competitive_team_members_updated_at_idx"
      ON "competitive_team_members" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "competitive_team_members_created_at_idx"
      ON "competitive_team_members" USING btree ("created_at");

    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'payload_locked_documents_rels'
          AND column_name = 'competitive_team_members_id'
      ) THEN
        ALTER TABLE "payload_locked_documents_rels"
          ADD COLUMN "competitive_team_members_id" integer;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'payload_locked_documents_rels_competitive_team_members_fk'
      ) THEN
        ALTER TABLE "payload_locked_documents_rels"
          ADD CONSTRAINT "payload_locked_documents_rels_competitive_team_members_fk"
          FOREIGN KEY ("competitive_team_members_id")
          REFERENCES "public"."competitive_team_members"("id")
          ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;

    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_competitive_team_members_i_idx"
      ON "payload_locked_documents_rels" USING btree ("competitive_team_members_id");

    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'team'
          AND column_name = 'active_roster_season'
      ) THEN
        ALTER TABLE "team"
          ADD COLUMN "active_roster_season" varchar DEFAULT '2025–26' NOT NULL;
      END IF;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'team'
          AND column_name = 'active_roster_season'
      ) THEN
        ALTER TABLE "team" DROP COLUMN "active_roster_season";
      END IF;
    END $$;

    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_competitive_team_members_fk";
    ALTER TABLE "payload_locked_documents_rels"
      DROP COLUMN IF EXISTS "competitive_team_members_id";

    DROP TABLE IF EXISTS "competitive_team_members_event_interests" CASCADE;
    DROP TABLE IF EXISTS "competitive_team_members" CASCADE;

    DROP TYPE IF EXISTS "public"."enum_competitive_team_members_event_interests";
    DROP TYPE IF EXISTS "public"."enum_competitive_team_members_class_year";
  `)
}
