# 📍 PROGRESS — สถานะสด

> เขียนทับทุกครั้ง ไม่สะสม log (log อยู่ git history) · hook โหลดไฟล์นี้ทุก session
อัปเดตล่าสุด: 2026-07-20 (M23: "แบรนด์=เกม" เต็มรูปแบบ — navbar + brand zone + หน้าใหม่ Brand Home/บันไดราคา/ไทม์ไลน์)

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

**โครงเว็บ = "แบรนด์ = เกม" แบบ prydwen (M22→M23 · เบสสั่ง) · deploy: anajak-car.vercel.app**:
> M22: sidebar=หมวด · รุ่น=character grid · หน้าแรก=landing · M23: navbar บน + แต่ละแบรนด์มี zone/home/เมนูของตัวเอง (แบรนด์=เกม)
- **Navbar บนสุด (`global-navbar.tsx` · ทุกหน้าโซน app+home):** โลโก้ + `BrandSwitcher` (dropdown สลับแบรนด์) + ลิงก์ "รุ่นรถทั้งหมด" + ThemeToggle · sticky top-0 z-40 h-14
- **Layout: route group** — `layout.tsx` root minimal · `(home)/` = landing (navbar, ไม่มี sidebar) · `(app)/` = navbar + `(global)/` (sidebar หมวด: /cars, /brands) และ `brands/[slug]/` (brand zone: sidebar เมนูแบรนด์) · `app-shell.tsx` ใช้ร่วม 2 โซน · sidebar sticky `top-14`
- **`lib/nav.ts`** = เมนู pure data (GLOBAL_NAV + brandNav) · **iconKey string** map ผ่าน NAV_ICONS ฝั่ง client (ห้ามส่ง fn ข้าม boundary) · sidebar/mobile-drawer รับ nav prop
- **โซนแบรนด์ `/brands/[slug]/*`** (layout: getBrandShell เบา + gate เมนู): **หน้าหลัก** (Brand Home: การ์ดนำทาง 3 ใบตัวเลขจริง + ทางลัดรุ่น + ความเคลื่อนไหวล่าสุด) · **รุ่นรถ** (`/cars` model grid) · **บันไดราคา** (`/price-ladder` บันได 62 ขั้น + หมุดราคา + delta cross-รุ่น · แทน tier list) · **ไทม์ไลน์และประวัติ** (`/timeline` ChangeEvent จัดปี + evidence + dl บริษัท + sources)
- **หน้ารถย้าย** `/cars/[slug]` → `/brands/[slug]/cars/[carSlug]` · **ลิงก์เก่า 308 redirect** ไป canonical (`getNameplateBrandSlug`) · brand mismatch → redirect · `/cars` (index ข้ามแบรนด์) คงอยู่
- `/` = landing (M16 hero → `/cars?...`) · mobile = navbar hamburger → drawer เมนูโซนปัจจุบัน (**portal ไป body** กัน backdrop-blur บีบ)
- ลบ: site-header/landing-header/mobile-topbar/car-database-explorer · ธีม: ขาว/เทาเข้ม · accent #2f56c9/#7c9dfa

บทเรียนดีไซน์ (DESIGN.md): prydwen model (แบรนด์=เกม · รุ่น=character · sidebar=เมนูโซน · หน้าแรก=landing) · **บันไดราคา=หมุดราคาแทนหลอด · ไม่มีคอลัมน์ # · delta ข้ามรุ่นตั้งใจ** · reject gradient/animation/ไอคอนประดับ section · หนึ่งหน้าหนึ่งพระเอก · ความเชื่อมั่นพูดครั้งเดียว

## ตรวจแล้ว (M23 brand zone)
- lint + production build ผ่าน (9 routes: / · /cars · /cars/[slug](redirect) · /brands · /brands/[slug] + /cars + /cars/[carSlug] + /price-ladder + /timeline)
- **curl matrix:** 8×200 · **`/cars/hilux-revo`→308** loc canonical ถูก · `/cars/nope`,`/brands/nope`,`/brands/toyota/cars/nope`→404
- **screenshot CDP** (`scratchpad/shot3.mjs`): navbar+brand switcher · Brand Home การ์ด 3 ใบ+ทางลัด+ความเคลื่อนไหว · บันไดราคา 62 ขั้น+หมุด(฿750k/1M/1.25M/1.5M/1.75M)+delta · timeline จัดปี+evidence+ประวัติ+sources · brand cars grid · light+dark · mobile drawer เมนูแบรนด์+global (active ถูก)
- **บั๊กที่จับ+แก้:** mobile drawer อยู่ใน navbar `backdrop-blur` → containing block บีบ fixed drawer ใน 56px → **portal ไป body** (บันทึก DESIGN.md บทเรียนเทคนิค M23)
- **review workflow 15 agents (3 มุม → adversarial verify) → 10 finding ยืนยัน แก้ครบ:** (รากใหญ่) นิยาม "ช่วงราคา/gate" ไม่ตรงกัน 3 ที่ — header ใช้ทุก lifecycle · บันได/gate ใช้ CURRENT/TRANSITION → **แก้ getBrandDetail stats + getBrandShell gate + Brand Home ให้ใช้ชุดเดียว (buyable = price!=null && CURRENT/TRANSITION)** กัน false precision (latent กับ Toyota ที่ CURRENT หมด แต่จะโผล่ตอนมีรุ่นเลิกขาย/แบรนด์ที่ 2) · timeline gate ให้ตรง (events||operationFrom) · drawer "แบรนด์" active ซ้อน → `/brands` เป็น exact · nav landmark ซ้ำ → ตั้งชื่อต่างกัน · BrandSwitcher ตัด role=menu (disclosure) · getBrandShell orderBy presence
- **⚠️ ต้อง kill server เก่าบน 3105 ก่อน start ใหม่** (EADDRINUSE → curl ไปโดนตัวเก่า) · warm ก่อน screenshot (cold start ติด loading)

## ค้าง / ติดอะไร
- ~~ADAS 0 แถว~~ → **seed แล้ว (M21)**: Feature 3 (AEB/ACC/LKA) + TrimFeature 90 known + evidence ครบ · section "ระบบช่วยขับขี่" ขึ้นหน้า /cars ทุกรุ่นแล้ว (uniform=สรุปบรรทัด · ต่าง=ตาราง) · ที่เหลือ unknown โดยตั้งใจ: Fortuner AEB/LKA (สเปกไม่มีแถว) + ACC 5 trim (ครูซ "มี" เฉยๆ ไม่ระบุ radar)
- VOCABULARY Phase 5 backlog: reclassify legacy AWD/FOUR_WD → subtype (ต้องเช็ค spec ทีละรุ่น) · motor type PMSM/induction · `ecoCarPhase` Yaris Ativ รอหลักฐานภาษี
- dev server: อย่ารันบน 3000 (ชนงาน meecard ของเบส) · 3001 เบสเปิด dev อยู่ — ตอน verify ใช้ `PORT=3105 npm start`
- **M22+M23 commit + push main แล้ว (เบสสั่ง 2026-07-21): `a36ed1c` M22 · `1cd1bdc` M23 → Vercel auto-deploy** · Champ/Revo ยังไม่มีภาพ (fallback เงารถ)
- timeline: narrative ประวัติจาก `MarketPresence.notes` ยังไม่ render (ท้าย notes มี comment ภายใน) — v1 โชว์ dl+channel+events+sources · จะเพิ่ม narrative เมื่อ clean notes (ops) แยกเนื้อหาสาธารณะ
- `(home)/loading.tsx` skeleton ยังเป็นทรงตาราง ไม่เข้ากับ landing (cosmetic ตอน cold load)
- รูปรถ = ลิขสิทธิ์ Toyota (CREDITS.md ครบ) — ทบทวนสิทธิ์ก่อน production · ยังไม่มี production domain
- ~~งานยังไม่ commit~~ → **commit + push แล้ว (เบสสั่ง 2026-07-20)**: `a330ea4` เว็บ v1 (M2–M12) + `a01076e` ภาษากลาง (M13–M14) — tree สะอาด

## ▶ NEXT (ทำต่อทันที)
1. รอเบสรีวิว M23 (localhost:3105): navbar+brand switcher · Brand Home การ์ดนำทาง · บันไดราคา · ไทม์ไลน์ · โซนแบรนด์ครบ — โอเคแล้ว commit + push M22+M23
2. Polish ที่กันไว้ (เสนอเบส): narrative ประวัติหน้า timeline (clean notes) · การ์ด ModelCard image-forward แบบ prydwen · เพิ่มภาพ Champ/Revo · loading.tsx เข้ากับ landing
3. งานต่อ: หน้า Compare exact entity (เพิ่มเป็นหมวดใน brandNav ได้เลย — sidebar config รองรับ) · ขยาย ADAS (BSM/AHB/LDW) · แบรนด์ที่ 2 (editorial gate VOCABULARY §4 — โครง multi-brand พร้อมแล้ว: brand switcher + zone)
4. VOCABULARY Phase 5 backlog (ดูหัวข้อ "ค้าง")
