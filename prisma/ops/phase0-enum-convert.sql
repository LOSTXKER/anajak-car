-- Phase 0 (VOCABULARY.md §2.0): แปลง polymorphic entityType String → enum ด้วย USING cast
-- (db push แปลงเองไม่ได้เมื่อ column มีข้อมูล — EvidenceLink มี 20 แถวที่ normalize เป็น enum label แล้ว)
CREATE TYPE "EntityType" AS ENUM ('BRAND','MARKET_PRESENCE','NAMEPLATE','GENERATION','DERIVATIVE','PHASE','TRIM','TRIM_FEATURE','VARIANT_REVISION','ENGINE','MOTOR','BATTERY','TRANSMISSION','DRIVETRAIN','PROMOTION_OBSERVATION','ALIAS_MAPPING','OTHER');
ALTER TABLE "EvidenceLink" ALTER COLUMN "entityType" TYPE "EntityType" USING ("entityType"::"EntityType");
ALTER TABLE "AliasMapping" ALTER COLUMN "entityType" TYPE "EntityType" USING ("entityType"::"EntityType");

CREATE TYPE "DiscountType" AS ENUM ('CASH','GIFT','INTEREST_RATE','OTHER');
ALTER TABLE "PromotionObservation" ALTER COLUMN "discountType" TYPE "DiscountType" USING ("discountType"::"DiscountType");
