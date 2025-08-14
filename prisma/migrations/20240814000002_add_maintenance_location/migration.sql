-- AlterTable
ALTER TABLE "maintenance_visits" ADD COLUMN "location" JSONB;

-- Update existing maintenance visits with sample locations (optional)
-- UPDATE "maintenance_visits" SET "location" = '{"lat": 40.7128, "lng": -74.0060}' WHERE "location" IS NULL;
