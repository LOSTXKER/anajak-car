# CARMETA — PLAN (แผนโค้ด · ไม่ใช่แผนธุรกิจ)

> แตก task ติ๊กได้ · ทำทีละอัน · ติ๊กเมื่อ verify แล้ว (รัน/เปิดดูจริง)
> แผนธุรกิจ/coverage strategy อยู่ที่ bestos `records/projects/anajak-car/`

## ✅ Milestone 0: Bootstrap (เสร็จ)
- [x] Scaffold Next.js (App Router + TS + Tailwind v4 + src/)
- [x] ติดตั้ง Prisma + Supabase client
- [x] เขียน `prisma/schema.prisma` (24 models ครอบ taxonomy + market + evidence)
- [x] `src/lib/prisma.ts` (singleton) + `src/lib/supabase.ts`
- [x] เอกสารมาตรฐาน repo (AGENTS/CLAUDE/SPEC/PLAN/PROGRESS/PRODUCT/DESIGN) + hook + settings

## ▶ Milestone 1: DB จริง + Seed (ปัจจุบัน)
- [ ] ตั้ง Supabase project + ใส่ `DATABASE_URL` (pooled) + `DIRECT_URL` (migrate) ใน `.env`
- [ ] `prisma migrate dev` — สร้างตารางจริง + ตรวจ schema กับ DB
- [ ] เขียน seed script (`prisma/seed.ts`) — 1 แบรนด์ + 3–5 Nameplate (ครอบ ICE/กระบะ-PPV/EV)
- [ ] Seed ราคามือหนึ่ง + Change event + Evidence source ครบ

## ถัดไป (ยังไม่เริ่ม)
- [ ] หน้า Car Market Database (ค้นหา + filter + แยกปัจจุบัน/เลิกจำหน่าย)
- [ ] Brand Hub (ประวัติ + Generation tree)
- [ ] Nameplate Hub (Generation + ภาพรวมราคา)
- [ ] Generation/Phase Profile (Phase/Trim/Variant + timeline)
- [ ] Trim/Variant Revision Profile (สเปก + ราคา + source/revision)
- [ ] Price Timeline (ราคาป้าย + ประวัติปรับราคา · append-only)
- [ ] Compare exact entity (กันเทียบคนละตลาด/ชนิดราคา)
- [ ] UI แสดง Source/Confidence/Freshness/Sample เป็น first-class (ตาม DESIGN.md)
