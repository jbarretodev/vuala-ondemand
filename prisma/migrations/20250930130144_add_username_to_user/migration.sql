/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable: Add username column as nullable first
ALTER TABLE "public"."users" ADD COLUMN "username" VARCHAR(100);

-- Generate usernames from email for existing users
UPDATE "public"."users" 
SET "username" = LOWER(SPLIT_PART("email", '@', 1) || '_' || "id");

-- Make username NOT NULL
ALTER TABLE "public"."users" ALTER COLUMN "username" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "public"."users"("username");
