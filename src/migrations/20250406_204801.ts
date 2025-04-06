import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_app_users_role" AS ENUM('coach', 'staff', 'player', 'visitor');
  CREATE TABLE IF NOT EXISTS "admins" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"fullname" varchar NOT NULL,
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
  
  CREATE TABLE IF NOT EXISTS "media" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"alt" varchar NOT NULL,
  	"prefix" varchar DEFAULT 'media-simply-life',
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
  
  CREATE TABLE IF NOT EXISTS "app_users" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"lastname" varchar NOT NULL,
  	"firstname" varchar NOT NULL,
  	"role" "enum_app_users_role" DEFAULT 'player' NOT NULL,
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
  
  CREATE TABLE IF NOT EXISTS "sponsors" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"logo_id" uuid NOT NULL,
  	"category_id" uuid NOT NULL,
  	"phone" varchar,
  	"website" varchar,
  	"address" varchar,
  	"latitude" numeric,
  	"longitude" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "sponsor_categories" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "chat_rooms" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"app_user_id" uuid NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"color" varchar,
  	"category" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "signatures" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"app_user_id" uuid NOT NULL,
  	"file_id" uuid NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid,
  	"media_id" uuid,
  	"app_users_id" uuid,
  	"sponsors_id" uuid,
  	"sponsor_categories_id" uuid,
  	"chat_rooms_id" uuid,
  	"signatures_id" uuid
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid,
  	"app_users_id" uuid
  );
  
  CREATE TABLE IF NOT EXISTS "payload_migrations" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  DO $$ BEGIN
   ALTER TABLE "sponsors" ADD CONSTRAINT "sponsors_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "sponsors" ADD CONSTRAINT "sponsors_category_id_sponsor_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."sponsor_categories"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "chat_rooms" ADD CONSTRAINT "chat_rooms_app_user_id_app_users_id_fk" FOREIGN KEY ("app_user_id") REFERENCES "public"."app_users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "signatures" ADD CONSTRAINT "signatures_app_user_id_app_users_id_fk" FOREIGN KEY ("app_user_id") REFERENCES "public"."app_users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "signatures" ADD CONSTRAINT "signatures_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_app_users_fk" FOREIGN KEY ("app_users_id") REFERENCES "public"."app_users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sponsors_fk" FOREIGN KEY ("sponsors_id") REFERENCES "public"."sponsors"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sponsor_categories_fk" FOREIGN KEY ("sponsor_categories_id") REFERENCES "public"."sponsor_categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_chat_rooms_fk" FOREIGN KEY ("chat_rooms_id") REFERENCES "public"."chat_rooms"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_signatures_fk" FOREIGN KEY ("signatures_id") REFERENCES "public"."signatures"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_app_users_fk" FOREIGN KEY ("app_users_id") REFERENCES "public"."app_users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "admins_updated_at_idx" ON "admins" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "admins_created_at_idx" ON "admins" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "admins_email_idx" ON "admins" USING btree ("email");
  CREATE INDEX IF NOT EXISTS "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX IF NOT EXISTS "app_users_updated_at_idx" ON "app_users" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "app_users_created_at_idx" ON "app_users" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "app_users_email_idx" ON "app_users" USING btree ("email");
  CREATE INDEX IF NOT EXISTS "sponsors_logo_idx" ON "sponsors" USING btree ("logo_id");
  CREATE INDEX IF NOT EXISTS "sponsors_category_idx" ON "sponsors" USING btree ("category_id");
  CREATE INDEX IF NOT EXISTS "sponsors_updated_at_idx" ON "sponsors" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "sponsors_created_at_idx" ON "sponsors" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "sponsor_categories_updated_at_idx" ON "sponsor_categories" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "sponsor_categories_created_at_idx" ON "sponsor_categories" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "chat_rooms_app_user_idx" ON "chat_rooms" USING btree ("app_user_id");
  CREATE INDEX IF NOT EXISTS "chat_rooms_updated_at_idx" ON "chat_rooms" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "chat_rooms_created_at_idx" ON "chat_rooms" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "signatures_app_user_idx" ON "signatures" USING btree ("app_user_id");
  CREATE INDEX IF NOT EXISTS "signatures_file_idx" ON "signatures" USING btree ("file_id");
  CREATE INDEX IF NOT EXISTS "signatures_updated_at_idx" ON "signatures" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "signatures_created_at_idx" ON "signatures" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_admins_id_idx" ON "payload_locked_documents_rels" USING btree ("admins_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_app_users_id_idx" ON "payload_locked_documents_rels" USING btree ("app_users_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_sponsors_id_idx" ON "payload_locked_documents_rels" USING btree ("sponsors_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_sponsor_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("sponsor_categories_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_chat_rooms_id_idx" ON "payload_locked_documents_rels" USING btree ("chat_rooms_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_signatures_id_idx" ON "payload_locked_documents_rels" USING btree ("signatures_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX IF NOT EXISTS "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_admins_id_idx" ON "payload_preferences_rels" USING btree ("admins_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_app_users_id_idx" ON "payload_preferences_rels" USING btree ("app_users_id");
  CREATE INDEX IF NOT EXISTS "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "admins" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "app_users" CASCADE;
  DROP TABLE "sponsors" CASCADE;
  DROP TABLE "sponsor_categories" CASCADE;
  DROP TABLE "chat_rooms" CASCADE;
  DROP TABLE "signatures" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_app_users_role";`)
}
