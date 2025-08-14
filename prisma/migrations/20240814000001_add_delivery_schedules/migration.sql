-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'DELIVERED', 'MISSED', 'CANCELLED');

-- CreateTable
CREATE TABLE "delivery_schedules" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "deliveryDate" TIMESTAMP(3) NOT NULL,
    "assignedDriver" TEXT,
    "status" "DeliveryStatus" NOT NULL DEFAULT 'SCHEDULED',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "delivery_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "delivery_schedules_orderId_idx" ON "delivery_schedules"("orderId");

-- CreateIndex
CREATE INDEX "delivery_schedules_deliveryDate_idx" ON "delivery_schedules"("deliveryDate");

-- CreateIndex
CREATE INDEX "delivery_schedules_status_idx" ON "delivery_schedules"("status");

-- AddForeignKey
ALTER TABLE "delivery_schedules" ADD CONSTRAINT "delivery_schedules_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
