import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-vercel-postgres";


export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
	await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "suppliers" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"logo_id" uuid NOT NULL,
  	"contact_info_lastname" varchar,
  	"contact_info_firstname" varchar,
  	"contact_info_email" varchar,
  	"contact_info_phone" varchar,
  	"connexion_password" varchar,
  	"other_information_theme" varchar,
  	"other_information_subscription_fee" varchar,
  	"other_information_duration" varchar,
  	"other_information_rentability" varchar,
  	"other_information_rentability_n1" varchar,
  	"other_information_commission" varchar,
  	"other_information_commission_public_offer" varchar,
  	"other_information_commission_offer_group_valorem" varchar,
  	"other_information_scpi" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "product_suppliers" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"logo_id" uuid NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "product_suppliers_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"suppliers_id" uuid
  );
  
  CREATE TABLE IF NOT EXISTS "category_suppliers_offers" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"file_id" uuid NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "category_suppliers" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"logo_id" uuid NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "category_suppliers_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"product_suppliers_id" uuid
  );

  ALTER TABLE "public"."app_users" ALTER COLUMN "role" SET DATA TYPE text;
  DROP TYPE "public"."enum_app_users_role";
  CREATE TYPE "public"."enum_app_users_role" AS ENUM('associate', 'employee', 'independent', 'visitor');
  
  ALTER TABLE "public"."app_users" ALTER COLUMN "role" SET DATA TYPE "public"."enum_app_users_role" USING "role"::"public"."enum_app_users_role";
  ALTER TABLE "app_users" ALTER COLUMN "role" SET DEFAULT 'independent';
  ALTER TABLE "app_users" ADD COLUMN "phone" varchar;
  ALTER TABLE "app_users" ADD COLUMN "photo_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "suppliers_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "product_suppliers_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "category_suppliers_id" uuid;
  DO $$ BEGIN
   ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "product_suppliers" ADD CONSTRAINT "product_suppliers_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "product_suppliers_rels" ADD CONSTRAINT "product_suppliers_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."product_suppliers"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "product_suppliers_rels" ADD CONSTRAINT "product_suppliers_rels_suppliers_fk" FOREIGN KEY ("suppliers_id") REFERENCES "public"."suppliers"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "category_suppliers_offers" ADD CONSTRAINT "category_suppliers_offers_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "category_suppliers_offers" ADD CONSTRAINT "category_suppliers_offers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."category_suppliers"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "category_suppliers" ADD CONSTRAINT "category_suppliers_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "category_suppliers_rels" ADD CONSTRAINT "category_suppliers_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."category_suppliers"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "category_suppliers_rels" ADD CONSTRAINT "category_suppliers_rels_product_suppliers_fk" FOREIGN KEY ("product_suppliers_id") REFERENCES "public"."product_suppliers"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "suppliers_logo_idx" ON "suppliers" USING btree ("logo_id");
  CREATE INDEX IF NOT EXISTS "suppliers_updated_at_idx" ON "suppliers" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "suppliers_created_at_idx" ON "suppliers" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "product_suppliers_logo_idx" ON "product_suppliers" USING btree ("logo_id");
  CREATE INDEX IF NOT EXISTS "product_suppliers_updated_at_idx" ON "product_suppliers" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "product_suppliers_created_at_idx" ON "product_suppliers" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "product_suppliers_rels_order_idx" ON "product_suppliers_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "product_suppliers_rels_parent_idx" ON "product_suppliers_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "product_suppliers_rels_path_idx" ON "product_suppliers_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "product_suppliers_rels_suppliers_id_idx" ON "product_suppliers_rels" USING btree ("suppliers_id");
  CREATE INDEX IF NOT EXISTS "category_suppliers_offers_order_idx" ON "category_suppliers_offers" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "category_suppliers_offers_parent_id_idx" ON "category_suppliers_offers" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "category_suppliers_offers_file_idx" ON "category_suppliers_offers" USING btree ("file_id");
  CREATE INDEX IF NOT EXISTS "category_suppliers_logo_idx" ON "category_suppliers" USING btree ("logo_id");
  CREATE INDEX IF NOT EXISTS "category_suppliers_updated_at_idx" ON "category_suppliers" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "category_suppliers_created_at_idx" ON "category_suppliers" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "category_suppliers_rels_order_idx" ON "category_suppliers_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "category_suppliers_rels_parent_idx" ON "category_suppliers_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "category_suppliers_rels_path_idx" ON "category_suppliers_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "category_suppliers_rels_product_suppliers_id_idx" ON "category_suppliers_rels" USING btree ("product_suppliers_id");
  DO $$ BEGIN
   ALTER TABLE "app_users" ADD CONSTRAINT "app_users_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_suppliers_fk" FOREIGN KEY ("suppliers_id") REFERENCES "public"."suppliers"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_product_suppliers_fk" FOREIGN KEY ("product_suppliers_id") REFERENCES "public"."product_suppliers"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_category_suppliers_fk" FOREIGN KEY ("category_suppliers_id") REFERENCES "public"."category_suppliers"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "app_users_photo_idx" ON "app_users" USING btree ("photo_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_suppliers_id_idx" ON "payload_locked_documents_rels" USING btree ("suppliers_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_product_suppliers_id_idx" ON "payload_locked_documents_rels" USING btree ("product_suppliers_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_category_suppliers_id_idx" ON "payload_locked_documents_rels" USING btree ("category_suppliers_id");
`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
	await db.execute(sql`
   ALTER TABLE "suppliers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "product_suppliers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "product_suppliers_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "category_suppliers_offers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "category_suppliers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "category_suppliers_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "suppliers" CASCADE;
  DROP TABLE "product_suppliers" CASCADE;
  DROP TABLE "product_suppliers_rels" CASCADE;
  DROP TABLE "category_suppliers_offers" CASCADE;
  DROP TABLE "category_suppliers" CASCADE;
  DROP TABLE "category_suppliers_rels" CASCADE;
  ALTER TABLE "app_users" DROP CONSTRAINT "app_users_photo_id_media_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_suppliers_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_product_suppliers_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_category_suppliers_fk";
  
  DROP INDEX IF EXISTS "app_users_photo_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_suppliers_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_product_suppliers_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_category_suppliers_id_idx";
  ALTER TABLE "app_users" ALTER COLUMN "role" SET DEFAULT 'player';
  ALTER TABLE "app_users" DROP COLUMN IF EXISTS "phone";
  ALTER TABLE "app_users" DROP COLUMN IF EXISTS "photo_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "suppliers_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "product_suppliers_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "category_suppliers_id";
  ALTER TABLE "public"."app_users" ALTER COLUMN "role" SET DATA TYPE text;
  DROP TYPE "public"."enum_app_users_role";
  CREATE TYPE "public"."enum_app_users_role" AS ENUM('coach', 'staff', 'player', 'visitor');
  ALTER TABLE "public"."app_users" ALTER COLUMN "role" SET DATA TYPE "public"."enum_app_users_role" USING "role"::"public"."enum_app_users_role";`);
}
