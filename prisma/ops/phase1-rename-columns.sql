-- Phase 1 (VOCABULARY.md §2.1/§5): rename มือ — ห้ามให้ prisma migrate เดา diff (จะกลายเป็น DROP+ADD ข้อมูลหาย)
-- fuelType/aspiration เดิมเป็น free text → เก็บไว้ที่ *Raw · maxPowerHp → maxPowerPs (ค่าจริงจากสเปกไทยเป็น PS — คำถามค้างเดิมของเบส ตอบพร้อมงานภาษากลาง)
ALTER TABLE "Engine" RENAME COLUMN "fuelType" TO "fuelTypeRaw";
ALTER TABLE "Engine" RENAME COLUMN "aspiration" TO "aspirationRaw";
ALTER TABLE "Engine" RENAME COLUMN "maxPowerHp" TO "maxPowerPs";
