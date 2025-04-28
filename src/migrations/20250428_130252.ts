import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "messages" ALTER COLUMN "message" DROP NOT NULL;
  ALTER TABLE "messages" ADD COLUMN "media_id" uuid;
  DO $$ BEGIN
   ALTER TABLE "messages" ADD CONSTRAINT "messages_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "messages_media_idx" ON "messages" USING btree ("media_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "messages" DROP CONSTRAINT "messages_media_id_media_id_fk";
  
  DROP INDEX IF EXISTS "messages_media_idx";
  ALTER TABLE "messages" ALTER COLUMN "message" SET NOT NULL;
  ALTER TABLE "messages" DROP COLUMN IF EXISTS "media_id";`)
}
