import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "reservations_invitations" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "reservations" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"title" varchar NOT NULL,
  	"day_reservation" timestamp(3) with time zone NOT NULL,
  	"start_time_reservation" timestamp(3) with time zone,
  	"end_time_reservation" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "reservations_id" uuid;
  DO $$ BEGIN
   ALTER TABLE "reservations_invitations" ADD CONSTRAINT "reservations_invitations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reservations"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "reservations_invitations_order_idx" ON "reservations_invitations" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "reservations_invitations_parent_id_idx" ON "reservations_invitations" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "reservations_updated_at_idx" ON "reservations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "reservations_created_at_idx" ON "reservations" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reservations_fk" FOREIGN KEY ("reservations_id") REFERENCES "public"."reservations"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_reservations_id_idx" ON "payload_locked_documents_rels" USING btree ("reservations_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "reservations_invitations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "reservations" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "reservations_invitations" CASCADE;
  DROP TABLE "reservations" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_reservations_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_reservations_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "reservations_id";`)
}
