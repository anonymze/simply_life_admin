import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-vercel-postgres";


export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
	await db.execute(sql`
    DROP TYPE "public"."_locales";
   CREATE TYPE "public"."_locales" AS ENUM('fr', 'en');
  ALTER TABLE "product_suppliers" ALTER COLUMN "logo_id" DROP NOT NULL;
  ALTER TABLE "category_suppliers" ALTER COLUMN "logo_id" DROP NOT NULL;`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
	await db.execute(sql`
   ALTER TABLE "category_suppliers" ALTER COLUMN "logo_id" SET NOT NULL;
  ALTER TABLE "product_suppliers" ALTER COLUMN "logo_id" SET NOT NULL;
  DROP TYPE "public"."_locales";`);
}
