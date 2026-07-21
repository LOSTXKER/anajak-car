# CARMETA — AGENTS.md

> แหล่งความจริงเดียวสำหรับ AI ทุกเจ้า (Claude / Cursor / Copilot / Codex)
> 📌 แผนธุรกิจ / research / go-to-market / การตัดสินใจเชิงกลยุทธ์ **ไม่อยู่ใน repo นี้** — อยู่ที่ระบบจัดการเจ้าของ (bestos `records/projects/anajak-car/`) · ไฟล์ใน repo = สเปค + โค้ดเท่านั้น

<!-- BEGIN:nextjs-agent-rules -->
## ⚠️ This is NOT the Next.js you know
Next.js เวอร์ชันนี้ (16.x, App Router) มี breaking changes — API, conventions, file structure อาจต่างจากที่โมเดลจำมา · ก่อนเขียนโค้ด Next ให้เปิดอ่าน guide ใน `node_modules/next/dist/docs/` และสังเกต deprecation notice
<!-- END:nextjs-agent-rules -->

## โปรเจคนี้คือ
CARMETA — ฐานข้อมูลรถยนต์ไทย + ระบบติดตามราคา/ตลาดรถ (Thailand Car Database & Market Intelligence) · positioning: "ฐานข้อมูลรถไทยที่ต้องเช็กก่อนซื้อ" · เป็น **data product** ไม่ใช่เว็บรีวิว/เว็บประกาศขายรถ

หลักการแกน (ฝังในสคีมาและต้องยึดตอนสร้างฟีเจอร์):
- **Database-first** — ทุกอย่างอ้าง canonical entity ชุดเดียว (Brand → Nameplate → Generation → Derivative → Phase → Trim → VariantRevision)
- **Evidence-first** — fact สำคัญ (ราคา/การเปลี่ยนแปลง) ต้องผูก `EvidenceSource` (source, url, วันที่, confidence)
- **Versioned / append-only** — ราคา/ประกาศ = เพิ่มแถวใหม่ ไม่เขียนทับอดีต · entity ที่เปลี่ยนตามเวลาใช้ `effectiveFrom`/`effectiveTo`
- **No false precision** — ข้อมูลไม่พอต้องบอกว่าไม่พอ · ใช้ `DataStatus (known/unknown/not_applicable)` แทน 0/null-as-missing · ตัวเลขตลาดต้องมาพร้อม Sample/Confidence/Cohort
- **Exact entity matching** — ห้ามรวมรถคนละ Generation/Phase/Trim/Cohort เพื่อเพิ่ม sample · ห้ามเรียกราคาประกาศว่า "ราคาซื้อขายจริง"

## คำสั่งหลัก
- ติดตั้ง: `npm install` (postinstall รัน `prisma generate` ให้อัตโนมัติ)
- รัน dev: `npm run dev` → http://localhost:3000
- build: `npm run build` · start: `npm start` · lint: `npm run lint`
- Prisma: `npm run db:generate` (gen client) · `npm run db:migrate` (ต้องมี DB จริงก่อน) · `npm run db:studio`

## โครงสร้าง
- `src/app/` — Next.js App Router (หน้า/route/layout)
- `src/lib/prisma.ts` — Prisma client singleton (อ่าน/เขียน DB หลัก)
- `src/lib/supabase.ts` — Supabase client (auth/storage/realtime · env public keys)
- `src/generated/prisma/` — Prisma client ที่ generate เอง (**gitignored · ห้ามแก้มือ** · regenerate ด้วย `npm run db:generate`)
- `prisma/schema.prisma` — โครงฐานข้อมูล (canonical taxonomy + market data) · `prisma.config.ts` — จ่าย `DATABASE_URL`
- `PRODUCT.md` / `DESIGN.md` — กลยุทธ์ผลิตภัณฑ์ + กฎ visual (อ่านก่อนงาน UI)

## code style
- TypeScript · indent 2 ช่อง · import alias `@/*` → `src/*`
- React Server Component เป็น default · ใส่ `'use client'` เฉพาะเมื่อจำเป็น
- data access ผ่าน `src/lib/prisma.ts` (อย่าสร้าง `new PrismaClient()` ซ้ำ)
- ชื่อ component = PascalCase · ไฟล์ route ตาม convention ของ App Router
- เลียนสไตล์โค้ดเดิม · surgical (แตะเฉพาะที่เกี่ยวกับสิ่งที่สั่ง)

## 🔄 วงจรการทำงาน (บังคับ — กันหลุด 3 อย่าง)
1. เริ่มงาน → อ่าน `SPEC.md` + `PLAN.md` ก่อนแตะโค้ด (และ PROGRESS.md ที่ hook โหลดให้)
2. งานใหญ่ → อัปเดต `PLAN.md` ก่อน (แตก task) · ทำทีละ task
3. ก่อนเคลม "เสร็จ" → verify ทุกข้อใน `SPEC.md` ด้วยการรัน/เปิดดูจริง (build ผ่าน ≠ เสร็จ)
4. ก่อนจบงาน → เขียนทับ `PROGRESS.md` (ทำอะไร · ค้าง · NEXT) + ติ๊ก `PLAN.md`
5. **งาน UI ทิศใหม่/redesign → ทำหน้าเทียบ 2-3 ทิศให้เบสเห็นภาพจริงก่อน แล้วค่อย implement ทิศที่เบสเลือก** · ฟีดแบ็ก "ไม่เอา X" = ปรับงาน + อัปเดต `DESIGN.md` §สถานะปัจจุบัน — **ห้ามจดเป็นข้อห้ามถาวร** (กติกาเต็มอยู่หัวไฟล์ DESIGN.md)

## permission (3 ชั้น)
- ✅ ทำได้เลย: แก้โค้ดตามสั่ง · รัน dev/build/lint · `prisma generate`
- ⚠️ ถามก่อน: ลบไฟล์ · แก้ `prisma/schema.prisma` / รัน `prisma migrate` · เพิ่ม dependency · แตะ config (next/tsconfig/eslint/env)
- ⛔ ห้าม: push เข้า main ตรงๆ · commit secret (`.env`) · ลบ/ปิด test เพื่อให้ผ่าน · สร้างข้อมูล/ราคา/ประวัติ "ปลอม" ที่ไม่มีหลักฐาน (ผิดหลัก evidence-first)
