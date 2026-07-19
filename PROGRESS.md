# 📍 PROGRESS — สถานะสด

> เขียนทับทุกครั้ง ไม่สะสม log (log อยู่ git history) · hook โหลดไฟล์นี้ทุก session
อัปเดตล่าสุด: 2026-07-19

## ทำถึงไหน
Bootstrap + เชื่อม DB เสร็จ (Milestone 0) — scaffold Next.js 16 (App Router + TS + Tailwind v4 + `src/`) + Prisma 7 + Supabase + เอกสารมาตรฐาน repo
- `prisma/schema.prisma` = 24 models + 15 enums (ground บน product doc §5-8) · `prisma validate` + `npm run build` ผ่าน
- **DB เชื่อม Supabase แล้ว** — `.env` มี key จริงครบ (gitignored) · `prisma db push` สร้าง **24 ตาราง**บน Supabase สำเร็จ · verify: app ต่อผ่าน pooler 6543 + query ตารางครบ 24 (2026-07-19)
- push ขึ้น GitHub แล้ว (`LOSTXKER/anajak-car`, public)

## ค้าง / ติดอะไร
- **ยังไม่ seed** — ยังไม่มีข้อมูลรถจริงใน DB (ตาราง 24 ตัวว่าง)
- **ยังไม่มีหน้าเว็บจริง** — มีแค่ default Next.js page (ยังไม่เริ่ม UI)
- ⚠️ **migrate ต้องใช้ `DIRECT_URL` (pooler session 5432)** — direct `db.xxx:5432` เป็น IPv6-only ต่อไม่ได้ · คำสั่ง: `npx prisma db push --url "$DIRECT_URL"` (prototype ใช้ db push · ยังไม่ทำ migration file)

## ▶ NEXT (ทำต่อทันที)
1. เขียน `prisma/seed.ts` — 1 แบรนด์ + 3–5 Nameplate (ครอบ ICE / กระบะ-PPV / EV ตาม doc §10.1) + ราคามือหนึ่ง + change event + evidence
2. เริ่มหน้าแรก: Car Market Database หรือ Brand/Nameplate Hub (ดู `PLAN.md` + `DESIGN.md`)
3. ต่อ query จริงผ่าน `src/lib/prisma.ts` (RSC) แสดงข้อมูลจาก DB
