# 📍 PROGRESS — สถานะสด

> เขียนทับทุกครั้ง ไม่สะสม log (log อยู่ git history) · hook โหลดไฟล์นี้ทุก session
อัปเดตล่าสุด: 2026-07-19

## ทำถึงไหน
Bootstrap เสร็จ (Milestone 0) — scaffold Next.js 16 (App Router + TS + Tailwind v4 + `src/`) + Prisma 7 + Supabase client + เอกสารมาตรฐาน repo วางครบ
- `prisma/schema.prisma` = 24 models + 15 enums (ground บน product doc section 5-8) · `prisma validate` ผ่าน · `prisma generate` ผ่าน
- `src/lib/prisma.ts` (singleton) + `src/lib/supabase.ts` วางแล้ว
- `npm run build` ผ่าน (verify แล้ว 2026-07-19)

## ค้าง / ติดอะไร
- **ยังไม่ต่อ DB จริง** — `.env` มี `DATABASE_URL` เป็น placeholder (localhost dummy จาก prisma init) · ยังไม่ได้ตั้ง Supabase project
- **ยังไม่ seed** — ยังไม่มีข้อมูลรถจริง
- ยังไม่ได้รัน `prisma migrate` (ตั้งใจ — ยังไม่มี DB)

## ▶ NEXT (ทำต่อทันที)
1. ตั้ง Supabase project → คัดลอก connection string มาใส่ `.env` (`DATABASE_URL` pooled + เพิ่ม `DIRECT_URL` สำหรับ migrate) + `NEXT_PUBLIC_SUPABASE_URL`/`ANON_KEY`
2. `npx prisma migrate dev --name init` → สร้างตารางจริง
3. เขียน `prisma/seed.ts` — 1 แบรนด์ + 3–5 Nameplate (ครอบ ICE/กระบะ-PPV/EV) + ราคามือหนึ่ง + change + evidence
4. เริ่มหน้าแรก: Car Market Database หรือ Nameplate Hub (ดู PLAN.md)
