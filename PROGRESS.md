# 📍 PROGRESS — สถานะสด

> เขียนทับทุกครั้ง ไม่สะสม log (log อยู่ git history) · hook โหลดไฟล์นี้ทุก session
อัปเดตล่าสุด: 2026-07-20 (apply ระบบภาษากลาง Phase 0–4 เสร็จ)

## ทำถึงไหน
**CARMETA v1 + ระบบภาษากลาง (canonical vocabulary) apply แล้ว Phase 0–4** — สเปกเต็ม + สถานะอยู่ใน `VOCABULARY.md` (มี TL;DR อ่านง่ายหัวไฟล์) · milestone ครบใน PLAN.md (M0–M14)

ระบบภาษากลาง (ใหม่ — 2026-07-20 เบสอนุมัติ "ทำเลย"):
- ทุก attribute เก็บ 2 ชั้น: **คำกลาง (enum ล็อกไว้)** ใช้แสดง/กรอง/เทียบ + **ชื่อการตลาดดิบ (`*Raw`/`name`)** ไม่ทิ้ง โชว์เป็น tooltip · ทุกการ map มี EvidenceLink คู่ (รวม 101 แถว) · ไม่รู้ = unknown ไม่เดา
- ผลจริงใน DB: เครื่องยนต์ 9 ตัวได้ FuelType/Aspiration canonical · **HEV 5 รุ่นแยกจากเกียร์ CVT (ผิด) → E_CVT_POWER_SPLIT** (สร้างแถวใหม่ ไม่ทับแถวที่ ICE แชร์) · กระบะได้ CabType (Derivative) + RideHeightClass (Trim — Prerunner 6 = HIGH_RIDER, 4WD/AWD = not_applicable) · Yaris Ativ ECO_CAR→SUBCOMPACT · chassisType/platformName ทุก generation · gradeCode 23 ตัว + สเปกชาร์จ AC/DC + NEDC ดึงจาก notes · HybridArchitecture (HEV=POWER_SPLIT)
- ตอบคำถามค้าง 2 ข้อของเบสไปในตัว: ✅ เพิ่ม `MEDIA` ใน EvidenceSourceType (สื่อ 9 แถวย้ายจาก EDITORIAL) · ✅ rename `maxPowerHp→maxPowerPs`
- ตาราง ADAS (`Feature`/`TrimFeature` + partial unique index) = โครงพร้อม **ยังไม่ seed** — ต้อง research หลักฐานต่อ trim ก่อน
- สคริปต์ migrate/backfill/verify ทั้งหมดอยู่ `prisma/ops/` (audit trail) · `prisma/ops/verify-vocab.ts` รันซ้ำได้ = 24/24 ผ่าน

ข้อมูล (ของจริง ตรวจแล้ว):
- Supabase · Toyota 5 nameplate: Corolla Altis (4) · Yaris Ativ (7) · Hilux Travo (18 รวม Travo-e BEV) · Fortuner (10) · bZ4X (2) = 41 variant/41 ราคา MANUFACTURER_OFFICIAL/HIGH · EvidenceSource 30 (ทางการ 20 · MEDIA 9 · EDITORIAL 1 = "การจัดประเภทศัพท์กลาง rev.1") · EvidenceLink 101 · 0 orphan
- ข้อมูล verified ที่ยังไม่ seed: Hilux Champ (6) · Revo Standard (6) · Revo Z Edition (9) — อยู่ใน workflow journal `wf_827f82de-ed0` · ตอน seed ต้องผ่าน editorial gate ของ VOCABULARY.md §4 (Revo Standard = กระบะเตี้ย → RideHeightClass.STANDARD ตัวแรกของระบบ)
- ⚠️ prisma CLI: รันด้วย `PRISMA_CLI_DIRECT=1` (สลับไป DIRECT_URL 5432 ใน prisma.config.ts — pooler 6543 ทำ CLI ค้าง) · enum/rename ที่มีข้อมูลต้องทำ SQL มือใน `prisma/ops/*.sql` ก่อน push (db push cast เองไม่ได้) · partial unique index ของ TrimFeature สร้างด้วย SQL มือ (db push ไม่ลบ — ตรวจแล้ว)

หน้าเว็บ (5 หน้า — อย่าลืม `/brands/[slug]` ใช้ CarDatabaseExplorer ตัวเดียวกับหน้าแรก):
- `/` landing + ตาราง 2 มุมมอง + dropdown filters (ตัวเลือกขุมพลังมาจาก enum canonical แล้ว — เพิ่มแบรนด์ไม่แตกเป็น "ดีเซล/Diesel/ดีเซล เทอร์โบ" อีก)
- `/cars/[slug]` = บันไดราคา · specLine เป็นคำกลางล้วน (`ดีเซล · 204 PS · อัตโนมัติ 6 สปีด · 4WD`) · ชื่อการตลาด (VN Turbo ฯลฯ) อยู่ title tooltip เท่านั้น · HEV โชว์ "E-CVT"
- `/brands` + `/brands/[slug]` (แหล่งอ้างอิงอ่านผ่าน EntityType enum แล้ว — type-safe)
- ธีม: ขาวล้วน/เทาเข้ม · accent Royal Softened #2f56c9/#7c9dfa · Geist+Noto Sans Thai — **หน้าตาไม่เปลี่ยนจากรอบก่อน (ตั้งใจ)**

บทเรียนดีไซน์สำคัญ (DESIGN.md — อย่าหลุดซ้ำ): เบส reject gradient/aurora/แอนิเมชันเข้าฉาก/ไอคอนประดับ/ฟอนต์ Anuphan/ป้าย HIGH ซ้ำรายแถว · หลัก: หนึ่งหน้าหนึ่งพระเอก · บันไดราคา+delta · สเปกเป็นประโยค · ความเชื่อมั่นพูดครั้งเดียว

## ตรวจแล้ว (รอบภาษากลาง)
- `prisma/ops/verify-vocab.ts` 24/24 ✅ (governance/engine/E-CVT/cab/rideHeight/segment/chassis/gradeCode/arch/charging/Feature ว่าง/evidence ครบ/ราคา 41 ไม่กระทบ)
- lint + tsc + production build ผ่าน · curl 5 หน้า 200 + เช็คเนื้อหา: คำกลางขึ้นถูก, marketing อยู่ tooltip, ไม่มี enum ดิบ (E_CVT_*) หลุดหน้าเว็บ · screenshot จริง home + hilux (dark) — layout เดิมไม่พัง
- Headless Chrome pipeline เดิมใช้ได้: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --screenshot=... --window-size=... URL`

## ค้าง / ติดอะไร
- **ADAS ยัง 0 แถว** — โครงตารางพร้อม · seed 3 ฟีเจอร์แรก (AEB/ACC/LKA) ต้อง research หลักฐานต่อ trim จาก toyota.co.th/technology/safetysense ก่อน (ห้ามใส่จากความรู้ทั่วไป)
- VOCABULARY Phase 5 backlog: reclassify legacy AWD/FOUR_WD → subtype (ต้องเช็ค spec ทีละรุ่น) · motor type PMSM/induction · `ecoCarPhase` Yaris Ativ รอหลักฐานภาษี
- dev server: อย่ารันบน 3000 (ชนงาน meecard ของเบส) — ตอน verify ใช้ `PORT=3105 npm start` แล้วปิดแล้ว
- รูปรถ = ลิขสิทธิ์ Toyota (CREDITS.md ครบ) — ทบทวนสิทธิ์ก่อน production · ยังไม่มี production domain
- ~~งานยังไม่ commit~~ → **commit + push แล้ว (เบสสั่ง 2026-07-20)**: `a330ea4` เว็บ v1 (M2–M12) + `a01076e` ภาษากลาง (M13–M14) — tree สะอาด

## ▶ NEXT (ทำต่อทันที)
1. Seed Hilux Champ/Revo 21 รุ่นย่อย (ข้อมูล verified รอใน journal) — รอบนี้ต้องกรอกช่องภาษากลางใหม่ด้วย (cabType/rideHeight/fuelType ฯลฯ ผ่าน editorial gate §4)
2. Research + seed ADAS 3 ฟีเจอร์แรกจากหน้า Toyota Safety Sense ทางการ → เปิดหน้าเทียบฟีเจอร์
3. รอเบสรีวิวหน้า "บันไดราคา" (`/cars/hilux-travo`) — ถ้าใช่ทิศทาง เกลาหน้าแรก/แบรนด์ต่อ
