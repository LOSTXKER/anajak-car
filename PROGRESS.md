# 📍 PROGRESS — สถานะสด

> เขียนทับทุกครั้ง ไม่สะสม log (log อยู่ git history) · hook โหลดไฟล์นี้ทุก session
อัปเดตล่าสุด: 2026-07-22 (**M22+M22b redesign — merge เข้า main (local) แล้ว รอ push**: Kanit + light-only + typewriter + ตารางเกลา + แตก NameplateTable · เบสสั่ง deploy แต่ push main ถูก safety guard บล็อก → เบสรัน `git push origin main` เอง)

## ทำถึงไหน
**CARMETA v1 + ระบบภาษากลาง (canonical vocabulary) apply แล้ว Phase 0–4** — สเปกเต็ม + สถานะอยู่ใน `VOCABULARY.md` (มี TL;DR อ่านง่ายหัวไฟล์) · milestone ครบใน PLAN.md (M0–M14)

ระบบภาษากลาง (ใหม่ — 2026-07-20 เบสอนุมัติ "ทำเลย"):
- ทุก attribute เก็บ 2 ชั้น: **คำกลาง (enum ล็อกไว้)** ใช้แสดง/กรอง/เทียบ + **ชื่อการตลาดดิบ (`*Raw`/`name`)** ไม่ทิ้ง โชว์เป็น tooltip · ทุกการ map มี EvidenceLink คู่ (รวม 101 แถว) · ไม่รู้ = unknown ไม่เดา
- ผลจริงใน DB: เครื่องยนต์ 9 ตัวได้ FuelType/Aspiration canonical · **HEV 5 รุ่นแยกจากเกียร์ CVT (ผิด) → E_CVT_POWER_SPLIT** (สร้างแถวใหม่ ไม่ทับแถวที่ ICE แชร์) · กระบะได้ CabType (Derivative) + RideHeightClass (Trim — Prerunner 6 = HIGH_RIDER, 4WD/AWD = not_applicable) · Yaris Ativ ECO_CAR→SUBCOMPACT · chassisType/platformName ทุก generation · gradeCode 23 ตัว + สเปกชาร์จ AC/DC + NEDC ดึงจาก notes · HybridArchitecture (HEV=POWER_SPLIT)
- ตอบคำถามค้าง 2 ข้อของเบสไปในตัว: ✅ เพิ่ม `MEDIA` ใน EvidenceSourceType (สื่อ 9 แถวย้ายจาก EDITORIAL) · ✅ rename `maxPowerHp→maxPowerPs`
- ตาราง ADAS (`Feature`/`TrimFeature` + partial unique index) = โครงพร้อม **ยังไม่ seed** — ต้อง research หลักฐานต่อ trim ก่อน
- สคริปต์ migrate/backfill/verify ทั้งหมดอยู่ `prisma/ops/` (audit trail) · `prisma/ops/verify-vocab.ts` รันซ้ำได้ = 24/24 ผ่าน

ข้อมูล (ของจริง ตรวจแล้ว):
- Supabase · Toyota 7 nameplate: Corolla Altis (4) · Yaris Ativ (7) · Hilux Travo (18 รวม Travo-e BEV) · **Hilux Champ (6) · Hilux Revo (15 — Standard Cab 6 + Z Edition 9) 🆕 seed 2026-07-20 จาก API ทางการ fetch สด** · Fortuner (10) · bZ4X (2) = **62 variant/62 ราคา** MANUFACTURER_OFFICIAL/HIGH · EvidenceSource 33 (ทางการ 23 · MEDIA 9 · EDITORIAL 1) · EvidenceLink 169 · 0 orphan · GlobalModelFamily "hilux" เชื่อม Travo/Champ/Revo (ตารางนี้เปิดใช้แล้ว)
- ~~Champ/Revo ยังไม่ seed~~ → **seed แล้ว (M15)**: RideHeightClass.STANDARD ใช้จริง 14 trims · raw API JSON เก็บที่ `prisma/ops/data/hilux-3lines-20260720.json` · endpoint สเปกทางการ: `GET /model/api/car/?series_code=<code>` (+ ราคารวม: `POST /api-service/car/series {"grades":true}`)
- ⚠️ prisma CLI: รันด้วย `PRISMA_CLI_DIRECT=1` (สลับไป DIRECT_URL 5432 ใน prisma.config.ts — pooler 6543 ทำ CLI ค้าง) · enum/rename ที่มีข้อมูลต้องทำ SQL มือใน `prisma/ops/*.sql` ก่อน push (db push cast เองไม่ได้) · partial unique index ของ TrimFeature สร้างด้วย SQL มือ (db push ไม่ลบ — ตรวจแล้ว)

หน้าเว็บ (5 หน้า — อย่าลืม `/brands/[slug]` ใช้ CarDatabaseExplorer ตัวเดียวกับหน้าแรก) · **deploy แล้ว: anajak-car.vercel.app (auto-deploy จาก main)**:
- `/` **Hero ใหม่ search-first (M16 — เบสเลือกจากหน้าเทียบ 3 แบบ)**: ช่องค้นหาใหญ่เป็นพระเอก + ชิปหมวดผูก filter จริง + บรรทัดพิสูจน์ตัวเลขจริง · hero ส่งเงื่อนไขเข้าตารางผ่าน URL param (`?q=/&body=/&pt=/&cap=` — แชร์ลิงก์ผลกรองได้) · ช่องค้นหาในตารางซ่อนบนหน้าแรก (hideSearch — กันซ้ำ) · ตาราง 2 มุมมอง + dropdown filters (ตัวเลือกขุมพลังจาก enum canonical)
- `/cars/[slug]` = บันไดราคา · specLine เป็นคำกลางล้วน (`ดีเซล · 204 PS · อัตโนมัติ 6 สปีด · 4WD`) · ชื่อการตลาด (VN Turbo ฯลฯ) อยู่ title tooltip เท่านั้น · HEV โชว์ "E-CVT"
- `/brands` + `/brands/[slug]` (แหล่งอ้างอิงอ่านผ่าน EntityType enum แล้ว — type-safe)
- ธีม: ขาวล้วน/เทาเข้ม · accent Royal Softened #2f56c9/#7c9dfa · Geist+Noto Sans Thai — **หน้าตาไม่เปลี่ยนจากรอบก่อน (ตั้งใจ)**

บทเรียนดีไซน์สำคัญ (DESIGN.md — อย่าหลุดซ้ำ): เบส reject gradient/aurora/แอนิเมชันเข้าฉาก/ไอคอนประดับ/ฟอนต์ Anuphan/ป้าย HIGH ซ้ำรายแถว · หลัก: หนึ่งหน้าหนึ่งพระเอก · บันไดราคา+delta · สเปกเป็นประโยค · ความเชื่อมั่นพูดครั้งเดียว

## ตรวจแล้ว (รอบภาษากลาง)
- `prisma/ops/verify-vocab.ts` 24/24 ✅ (governance/engine/E-CVT/cab/rideHeight/segment/chassis/gradeCode/arch/charging/Feature ว่าง/evidence ครบ/ราคา 41 ไม่กระทบ)
- lint + tsc + production build ผ่าน · curl 5 หน้า 200 + เช็คเนื้อหา: คำกลางขึ้นถูก, marketing อยู่ tooltip, ไม่มี enum ดิบ (E_CVT_*) หลุดหน้าเว็บ · screenshot จริง home + hilux (dark) — layout เดิมไม่พัง
- Headless Chrome pipeline ใช้ได้สำหรับ desktop · **⚠️ mobile <500px ห้ามใช้ --window-size ตรงๆ — Chrome headless บังคับ viewport ขั้นต่ำ 500 แล้ว crop ภาพ ทำให้ดูเหมือน layout พังทั้งที่ไม่พัง (เจ็บมาแล้ว M16)** → ใช้ iframe harness ดูวิธีใน DESIGN.md ท้ายไฟล์

## ค้าง / ติดอะไร
- ~~ADAS 0 แถว~~ → **seed แล้ว (M21)**: Feature 3 (AEB/ACC/LKA) + TrimFeature 90 known + evidence ครบ · section "ระบบช่วยขับขี่" ขึ้นหน้า /cars ทุกรุ่นแล้ว (uniform=สรุปบรรทัด · ต่าง=ตาราง) · ที่เหลือ unknown โดยตั้งใจ: Fortuner AEB/LKA (สเปกไม่มีแถว) + ACC 5 trim (ครูซ "มี" เฉยๆ ไม่ระบุ radar)
- VOCABULARY Phase 5 backlog: reclassify legacy AWD/FOUR_WD → subtype (ต้องเช็ค spec ทีละรุ่น) · motor type PMSM/induction · `ecoCarPhase` Yaris Ativ รอหลักฐานภาษี
- dev server: อย่ารันบน 3000 (ชนงาน meecard ของเบส) — ตอน verify ใช้ `PORT=3105 npm start` แล้วปิดแล้ว
- รูปรถ = ลิขสิทธิ์ Toyota (CREDITS.md ครบ) — ทบทวนสิทธิ์ก่อน production · ยังไม่มี production domain
- ~~งานยังไม่ commit~~ → **commit + push แล้ว (เบสสั่ง 2026-07-20)**: `a330ea4` เว็บ v1 (M2–M12) + `a01076e` ภาษากลาง (M13–M14) — tree สะอาด

## 🎨 M22 REDESIGN (2026-07-22 — implement แล้ว บน branch `redesign/m22-carmeta-light-kanit`, ยังไม่ merge/deploy)
เบสสั่ง "รื้อ UXUI" → ผ่าน mockup หลายรอบ (tracker=รกไป · Apple=โล่งไป) → เบสชี้หน้าจริงเดิม "อยากได้ประมาณนี้" + ขอ Kanit + typewriter + light
- **ทำจริงแล้ว** (ดู DESIGN.md §เคาะแล้ว M22 · git diff branch นี้): Kanit ทั้งเว็บ · **light-only** (ตัด dark+toggle — โลโก้แบรนด์ไม่เหมาะมืด) · hero typewriter (`hero-headline.tsx`) · `car-database-explorer` เกลา (จุดสีขุมพลัง+tnum+sort⇅+ตัดของซ้ำ) · `globals.css` token ใหม่ (`.tnum`, `--pt-*`) · ตัด ThemeToggle ใน header · ทุกหน้า (home/cars/brands) เข้าชุดอัตโนมัติ
- verify: lint+tsc+build ผ่าน · เปิดจริง 3105 + screenshot home/car/brands ครบ
- **ไฟล์แก้**: `layout.tsx` `globals.css` `(home)/page.tsx` `car-database-explorer.tsx` `site-header.tsx` + ใหม่ `hero-headline.tsx`

## ▶ NEXT (ทำต่อทันที)
1. **รอเบสรีวิว M22 บน branch** แล้วตัดสิน: merge→main + deploy · หรือปรับเพิ่มก่อน
2. งานเสริมหน้าแรกที่เสนอไว้ (ทำระหว่าง/หลัง merge): ชิปงบด่วน (≤5แสน/1ล้าน/2ล้าน) · ป้าย "ปรับราคาล่าสุด/ใหม่" (ใช้ประวัติ append-only เป็นจุดต่าง) · mobile ตาราง→การ์ด
3. หน้ารุ่น (/cars) ใส่ data รวยขึ้น (strip-plot การกระจายราคา + ADAS meter จากงาน tracker mockup) · เทียบรุ่น (Compare) · รูปจริง Champ/Revo
4. งานเดิมค้าง: ขยาย ADAS (BSM/AHB/LDW) · VOCABULARY Phase 5 · แบรนด์ที่ 2 (editorial gate)
