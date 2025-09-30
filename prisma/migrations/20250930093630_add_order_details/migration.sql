-- AlterTable
ALTER TABLE "public"."orders" ADD COLUMN     "customer_last_name" VARCHAR(255),
ADD COLUMN     "customer_name" VARCHAR(255),
ADD COLUMN     "distance_km" DECIMAL(10,2),
ADD COLUMN     "estimated_price" DECIMAL(10,2),
ADD COLUMN     "estimated_time" VARCHAR(50),
ADD COLUMN     "is_scheduled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pickup_address" TEXT,
ADD COLUMN     "scheduled_date" TIMESTAMP(3),
ADD COLUMN     "scheduled_time" VARCHAR(10);
