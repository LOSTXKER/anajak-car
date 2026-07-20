-- Phase 4 (VOCABULARY.md §2.3): partial unique index กันแถว TrimFeature ซ้ำ
-- @@unique ปกติใช้ไม่ได้: Postgres ถือ NULL ≠ NULL — สองแถว trim+feature เดียวกันที่ effectiveFrom เป็น null
-- ทั้งคู่จะ insert ซ้ำได้เงียบๆ (เปิดช่อง hasFeature=true และ false พร้อมกัน)
CREATE UNIQUE INDEX IF NOT EXISTS "TrimFeature_unique_no_date"
  ON "TrimFeature" ("trimId", "featureId") WHERE "effectiveFrom" IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "TrimFeature_unique_dated"
  ON "TrimFeature" ("trimId", "featureId", "effectiveFrom") WHERE "effectiveFrom" IS NOT NULL;
