-- Phase 2 ต่อ (VOCABULARY.md §2.1): rename มือ — Motor.location / Battery.chemistry เป็น *Raw
ALTER TABLE "Motor" RENAME COLUMN "location" TO "locationRaw";
ALTER TABLE "Battery" RENAME COLUMN "chemistry" TO "chemistryRaw";
