/*
  Warnings:

  - You are about to drop the column `customer_last_name` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `customer_name` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `orders` table. All the data in the column will be lost.
  - Added the required column `customer_id` to the `orders` table without a default value. This is not possible if the table is not empty.

*/

-- CreateTable for customers first
CREATE TABLE "public"."customers" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "lastname" VARCHAR(255) NOT NULL,
    "address" TEXT,
    "dni" VARCHAR(50) NOT NULL,
    "date_of_birth" TIMESTAMP(3),
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_dni_key" ON "public"."customers"("dni");

-- CreateIndex
CREATE INDEX "customers_user_id_idx" ON "public"."customers"("user_id");

-- CreateIndex
CREATE INDEX "customers_dni_idx" ON "public"."customers"("dni");

-- AddForeignKey for customers
ALTER TABLE "public"."customers" ADD CONSTRAINT "customers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Migrate existing orders data: Create customers from ALL existing orders
INSERT INTO "public"."customers" ("name", "lastname", "dni", "user_id", "created_at", "updated_at")
SELECT 
    COALESCE("customer_name", 'Cliente'),
    COALESCE("customer_last_name", 'Genérico'),
    'DNI-' || "id",  -- Generate unique DNI from order ID
    "user_id",
    "created_at",
    "updated_at"
FROM "public"."orders";

-- Add customer_id column to orders (nullable first)
ALTER TABLE "public"."orders" ADD COLUMN "customer_id" INTEGER;

-- Update orders with the newly created customer IDs
UPDATE "public"."orders" o
SET "customer_id" = c."id"
FROM "public"."customers" c
WHERE c."dni" = 'DNI-' || o."id";

-- Make customer_id NOT NULL
ALTER TABLE "public"."orders" ALTER COLUMN "customer_id" SET NOT NULL;

-- Drop old foreign key and columns
ALTER TABLE "public"."orders" DROP CONSTRAINT IF EXISTS "orders_user_id_fkey";
ALTER TABLE "public"."orders" DROP COLUMN IF EXISTS "customer_last_name";
ALTER TABLE "public"."orders" DROP COLUMN IF EXISTS "customer_name";
ALTER TABLE "public"."orders" DROP COLUMN IF EXISTS "user_id";

-- CreateIndex for orders
CREATE INDEX "orders_customer_id_idx" ON "public"."orders"("customer_id");

-- AddForeignKey for orders
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
