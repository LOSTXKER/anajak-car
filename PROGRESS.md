# 📍 PROGRESS — สถานะสด

> เขียนทับทุกครั้ง ไม่สะสม log (log อยู่ git history) · hook โหลดไฟล์นี้ทุก session
อัปเดตล่าสุด: 2026-07-19

## ทำถึงไหน
Bootstrap + DB + seed เสร็จ (Milestone 0-1) — โครงพร้อม + มีข้อมูลจริงใน DB
- scaffold Next.js 16 + Prisma 7 + Supabase · `prisma/schema.prisma` = 24 models/15 enums · build ผ่าน
- DB เชื่อม Supabase — 24 ตาราง (db push ผ่าน pooler session 5432 · runtime pooler 6543)
- **seed เสร็จ** (`prisma/seed.ts` · `npm run db:seed` · idempotent) — Toyota 5 nameplate ครอบ 3 ประเภท:
  Corolla Altis (ICE/HEV), Yaris Ativ (eco), Hilux Revo (กระบะ), Fortuner (PPV), bZ4X (BEV)
  → **14 VariantRevision + 14 ราคา + 5 ChangeEvent** · verify query จริง: 0 orphan (ทุกราคา/change มี evidence)
  → ⚠️ ข้อมูล **seed demo** (EvidenceSource EDITORIAL, confidence LOW) — ราคา/สเปกโดยประมาณ ยังไม่ verify กับ price list ทางการ
- push GitHub `LOSTXKER/anajak-car` (public)

## ค้าง / ติดอะไร
- **ยังไม่มีหน้าเว็บจริง** — มีแค่ default Next.js page (ยังไม่ดึงข้อมูลจาก DB มาโชว์)
- ข้อมูล seed = demo ยังไม่ verify (ถ้าจะ production ต้อง re-verify ราคา/สเปกทีละรุ่นกับแหล่งทางการ)
- migrate/seed ต้องใช้ `DIRECT_URL` (pooler session 5432) — direct `db.xxx:5432` IPv6-only ต่อไม่ได้

## ▶ NEXT (ทำต่อทันที)
1. หน้าแรก **Car Market Database** (ค้น/ลิสต์รถ) หรือ **Nameplate Hub** — ดึงจาก DB จริง (RSC ผ่าน `src/lib/prisma.ts`) ตามธีม `DESIGN.md`
2. แสดง Source/Confidence/Freshness เป็น first-class UI (หัวใจ evidence-first — ดู DESIGN.md)
3. (ภายหลัง) verify ราคา/สเปกจริง + เพิ่ม nameplate coverage · seed ข้อมูลมือสอง
