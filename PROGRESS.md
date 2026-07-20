# 📍 PROGRESS — สถานะสด

> เขียนทับทุกครั้ง ไม่สะสม log (log อยู่ git history) · hook โหลดไฟล์นี้ทุก session
อัปเดตล่าสุด: 2026-07-20 (M22: รื้อโครงเว็บเป็น sidebar แบบ prydwen.gg + หน้าแบรนด์เปลี่ยนเป็น model grid)

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

**โครงเว็บ = sidebar หมวด แบบ prydwen (M22 · เบสสั่ง+ให้ไปดู `/star-rail/characters` จริง) · deploy: anajak-car.vercel.app**:
> ⚠️ รอบแรกทำผิด (เอาชื่อรุ่นยัด sidebar + หน้าแรกมี sidebar) → เบสแก้: sidebar = "หมวด" · รุ่นรถ = "character" grid ในหน้า · หน้าแรก = landing ไม่มี sidebar
- **แยก layout ด้วย route group:** `layout.tsx` root minimal (html/body/theme/fonts) · `(home)/` มี `LandingHeader` (top nav, ไม่มี sidebar) · `(app)/` มี `Sidebar`+`MobileTopBar` (brands/cars ย้ายเข้า `(app)/` ด้วย git mv — URL เดิม) · `max-w-6xl` อยู่ที่ layout ของแต่ละ group
- **Sidebar = เมนูหมวดล้วน** (`sidebar-nav.tsx` config array + `nav-icons.tsx`): หน้าแรก · **ฐานข้อมูล** > รุ่นรถทั้งหมด, แบรนด์ (icon + section header + active by startsWith) → footer evidence-first + ThemeToggle · **ไม่มีชื่อรุ่นใน sidebar** (getSidebarNav/navData ถูกลบ) · ตามธีมเว็บ · mobile = drawer เมนูหมวดเดียวกัน (a11y ครบ)
- `/` = **landing เต็มจอ ไม่มี sidebar** (M16 hero search-first + BrandShortcuts + value cards + Coverage + FAQ · ตัดตารางใหญ่ออก) · HeroSearch → `router.push('/cars?...')`
- `/cars` = **หน้า "รุ่นรถทั้งหมด" = character grid** (ใหม่ · `car-grid.tsx` client): ค้นหา (ครอบชื่อรุ่นย่อย) + ฟิลเตอร์ชิปตัวถัง/ขุมพลัง + "แสดง N รุ่น" + ล้างตัวกรอง + grid `ModelCard` (อ่าน URL param จาก hero)
- `/brands/[slug]` = model grid การ์ดรุ่น (`ModelCard` ใช้ร่วมกับ /cars) + dl บริษัทใต้ grid · `/cars/[slug]` = บันไดราคา (คงเดิม) · `/brands` = การ์ดเลือกยี่ห้อ (live+upcoming)
- ธีม: ขาวล้วน/เทาเข้ม · accent #2f56c9/#7c9dfa · Geist+Noto Sans Thai

บทเรียนดีไซน์สำคัญ (DESIGN.md): เบส reject gradient/aurora/แอนิเมชันเข้าฉาก/ไอคอนประดับหัว section/ฟอนต์ Anuphan/ป้าย HIGH ซ้ำ · **prydwen model: sidebar = หมวด · รุ่น = character grid · หน้าแรก = landing ไม่มี sidebar** · หลัก: หนึ่งหน้าหนึ่งพระเอก · บันไดราคา · สเปกประโยคเดียว · ความเชื่อมั่นพูดครั้งเดียว

## ตรวจแล้ว (M22 โครงใหม่)
- lint + tsc + production build ผ่าน (routes: / · /cars · /cars/[slug] · /brands · /brands/[slug])
- curl 6 route: `/` `/cars` `/cars?body=PICKUP` `/brands` `/brands/toyota` `/cars/hilux-revo` = 200 · `/cars/nope` = 404
- **screenshot CDP จริง** (`scratchpad/shot.mjs`/`shot2.mjs` — Node 24 WebSocket + `setDeviceMetricsOverride`/`setEmulatedMedia`): home landing (ไม่มี sidebar, top header) · /cars character grid + ฟิลเตอร์ + "แสดง 7 รุ่น" · filter `?body=PICKUP`→3 กระบะ + "ล้างตัวกรอง" · sidebar active ถูกหมวด · dark ทำงาน · mobile 390 drawer = เมนูหมวดล้วน (ไม่มีชื่อรุ่น) focus ไป X
- **⚠️ mobile <500px:** ใช้ CDP `setDeviceMetricsOverride` (width 390) — เลี่ยงบั๊ก `--window-size` headless ≥500 (บทเรียน M16)
- **⚠️ cold start:** หน้า force-dynamic รอบแรกอาจติด loading skeleton ตอน screenshot — warm ด้วย curl ก่อนถ่าย
- verify-vocab.ts (รอบภาษากลาง) 34/34 ✅ ไม่กระทบ (M22 ไม่แตะ data/schema)

## ค้าง / ติดอะไร
- ~~ADAS 0 แถว~~ → **seed แล้ว (M21)**: Feature 3 (AEB/ACC/LKA) + TrimFeature 90 known + evidence ครบ · section "ระบบช่วยขับขี่" ขึ้นหน้า /cars ทุกรุ่นแล้ว (uniform=สรุปบรรทัด · ต่าง=ตาราง) · ที่เหลือ unknown โดยตั้งใจ: Fortuner AEB/LKA (สเปกไม่มีแถว) + ACC 5 trim (ครูซ "มี" เฉยๆ ไม่ระบุ radar)
- VOCABULARY Phase 5 backlog: reclassify legacy AWD/FOUR_WD → subtype (ต้องเช็ค spec ทีละรุ่น) · motor type PMSM/induction · `ecoCarPhase` Yaris Ativ รอหลักฐานภาษี
- dev server: อย่ารันบน 3000 (ชนงาน meecard ของเบส) · 3001 เบสเปิด dev อยู่ — ตอน verify ใช้ `PORT=3105 npm start`
- M22 ยังไม่ commit (รอเบสรีวิว) · Champ/Revo ยังไม่มีภาพในการ์ด (ใช้ fallback เงารถ) — เพิ่มภาพทางการภายหลังได้
- `car-database-explorer.tsx` (ตารางเดิม) **ไม่ถูก import ที่ไหนแล้ว** หลังย้ายไป model grid — เก็บไว้ก่อน (โค้ดใหญ่ที่ทดสอบแล้ว เผื่ออยากได้ table view) · `(home)/loading.tsx` skeleton ยังเป็นทรงตาราง ไม่เข้ากับ landing (cosmetic ตอน cold load)
- รูปรถ = ลิขสิทธิ์ Toyota (CREDITS.md ครบ) — ทบทวนสิทธิ์ก่อน production · ยังไม่มี production domain
- ~~งานยังไม่ commit~~ → **commit + push แล้ว (เบสสั่ง 2026-07-20)**: `a330ea4` เว็บ v1 (M2–M12) + `a01076e` ภาษากลาง (M13–M14) — tree สะอาด

## ▶ NEXT (ทำต่อทันที)
1. รอเบสรีวิวโครงใหม่ (localhost:3105 / vercel): หน้าแรก landing ไม่มี sidebar · /cars character grid · sidebar เมนูหมวด — ถ้าโอเคค่อย commit + push M22
2. Polish ที่กันไว้ (เสนอเบส): เกลาการ์ด `ModelCard` ให้ image-forward ขึ้นแบบ prydwen (รูปใหญ่ + badge ตัวถังมุมบน?) ถ้าเบสอยากใกล้ prydwen กว่านี้ · loading.tsx หน้าแรกให้เข้ากับ landing · เพิ่มภาพทางการ Champ/Revo · ลบ car-database-explorer ถ้าแน่ใจไม่ใช้
3. งานต่อที่เลือกได้: ขยาย ADAS (BSM/AHB/LDW) · หน้า Compare exact entity (เพิ่มเป็นหมวดใน sidebar config ได้เลย) · แบรนด์ที่ 2 (editorial gate VOCABULARY §4)
4. VOCABULARY Phase 5 backlog (ดูหัวข้อ "ค้าง")
