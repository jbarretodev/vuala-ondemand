-- CreateEnum
CREATE TYPE "RiderStatus" AS ENUM ('OFFLINE', 'IDLE', 'ON_DELIVERY');

-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('MOTORCYCLE', 'CAR', 'BICYCLE', 'SCOOTER');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "rider_id" INTEGER;

-- CreateTable
CREATE TABLE "riders" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "status" "RiderStatus" NOT NULL DEFAULT 'OFFLINE',
    "phone" VARCHAR(20) NOT NULL,
    "license_number" VARCHAR(100),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "rating" DECIMAL(3,2),
    "completed_orders" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "riders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" SERIAL NOT NULL,
    "rider_id" INTEGER NOT NULL,
    "type" "VehicleType" NOT NULL,
    "brand" VARCHAR(100),
    "model" VARCHAR(100),
    "year" INTEGER,
    "license_plate" VARCHAR(20) NOT NULL,
    "color" VARCHAR(50),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rider_last_locations" (
    "rider_id" INTEGER NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "speed" DOUBLE PRECISION,
    "heading" DOUBLE PRECISION,
    "accuracy" DOUBLE PRECISION,
    "battery" INTEGER,
    "source" VARCHAR(20),
    "ts" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rider_last_locations_pkey" PRIMARY KEY ("rider_id")
);

-- CreateTable
CREATE TABLE "rider_locations" (
    "id" BIGSERIAL NOT NULL,
    "rider_id" INTEGER NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "speed" DOUBLE PRECISION,
    "heading" DOUBLE PRECISION,
    "accuracy" DOUBLE PRECISION,
    "ts" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rider_locations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "riders_user_id_key" ON "riders"("user_id");

-- CreateIndex
CREATE INDEX "riders_status_idx" ON "riders"("status");

-- CreateIndex
CREATE INDEX "riders_user_id_idx" ON "riders"("user_id");

-- CreateIndex
CREATE INDEX "riders_is_active_idx" ON "riders"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_rider_id_key" ON "vehicles"("rider_id");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_license_plate_key" ON "vehicles"("license_plate");

-- CreateIndex
CREATE INDEX "vehicles_rider_id_idx" ON "vehicles"("rider_id");

-- CreateIndex
CREATE INDEX "rider_last_locations_ts_idx" ON "rider_last_locations"("ts");

-- CreateIndex
CREATE INDEX "rider_locations_rider_id_ts_idx" ON "rider_locations"("rider_id", "ts");

-- CreateIndex
CREATE INDEX "orders_rider_id_idx" ON "orders"("rider_id");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_rider_id_fkey" FOREIGN KEY ("rider_id") REFERENCES "riders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "riders" ADD CONSTRAINT "riders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_rider_id_fkey" FOREIGN KEY ("rider_id") REFERENCES "riders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rider_last_locations" ADD CONSTRAINT "rider_last_locations_rider_id_fkey" FOREIGN KEY ("rider_id") REFERENCES "riders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rider_locations" ADD CONSTRAINT "rider_locations_rider_id_fkey" FOREIGN KEY ("rider_id") REFERENCES "riders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
