# 📍 PROGRESS — สถานะสด

> เขียนทับทุกครั้ง ไม่สะสม log (log อยู่ git history) · hook โหลดไฟล์นี้ทุก session
อัปเดตล่าสุด: 2026-07-22 (**M25e SKU-first + M26 เพิ่มแบรนด์ Tesla/Benz — เสร็จ branch `redesign/m25-sidebar-tabs`**)

## รอบล่าสุด (M25e + M26 — เบสเคาะแล้วทำเลย)
- **SKU-first**: กดรุ่น → `/cars/[slug]` = หน้าเลือกรุ่นย่อย (การ์ด SKU จัดกลุ่มตามตัวถัง) → `/cars/[slug]/[sku]` = 1 SKU (สเปกเต็ม + **ประวัติราคา** append-only + ADAS ของ trim + switcher สลับรุ่นพี่น้อง) · tab หน้ารุ่นเหลือ 3 (ภาพรวม/เทียบรุ่นย่อย/ไทม์ไลน์) · skuKey = derived slug ไม่แตะ schema (`variantKey` ใน slugs.ts + `selectVariant` ใน queries.ts)
- **แบรนด์ใหม่ 2**: Tesla (Model 3 ×4 SKU, Model Y ×3) + Mercedes-Benz (C-Class ×5, E-Class ×3, S-Class ×2, GLC ×5 รวม Coupé, EQS ×1) = 7 nameplate / 23 SKU · research ผ่าน workflow 15 agents ทุกราคา cross-check สื่อไทย · seed: `prisma/ops/phase7-seed-tesla-benz.ts` (+7b backfill links, sanity) · raw: `prisma/ops/data/research-tesla-benz-20260722.json` · ค่าที่แหล่งขัดแย้ง (แบต/กำลัง Tesla LR·Perf, ระยะ Model Y RWD, แบต PHEV Benz) = **unknown ไม่เดา** จดใน notes · Tesla Model 3 ราคาจากสื่อ (ทางการ 403) = MEDIA/MEDIUM · ที่เหลือ MANUFACTURER_OFFICIAL/HIGH
- verify แล้ว: lint+build ผ่าน · `verify-vocab.ts` **33/33 ✅** · เปิดจริง (port 3001) ทุกหน้าใหม่ 200 + ลิงก์ SKU ทุกอันเข้าได้ + screenshot จริง · commit `75e2005` (Part A) + Part B รอ commit
- ค้าง: โลโก้ Tesla/Benz (ตอนนี้ fallback ตัวอักษร) + รูปรถ · sku มั่ว = soft-404 (โชว์หน้า 404 ถูกแต่ HTTP 200 — ข้อจำกัด streaming + loading.tsx ของ [slug]) · เบสรีวิว → merge

(ก่อนหน้า: M25 sidebar หมวดกลาง + หน้ารุ่นเป็น tab แบบ prydwen — sidebar หลักอันเดียว(หมวด)+brand switcher บนหัว)

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

หน้าเว็บ (5 หน้า — อย่าลืม `/brands/[slug]` ใช้ CarDatabaseExplorer ตัวเดียวกับหน้าแรก) · **deploy แล้ว: anajak-car.vercel.app (auto-deploy จาก main)** · **หน้าใน (/brands/[slug], /cars/[slug]) ได้ shell ใหม่ navbar+sidebar ตั้งแต่ M23 (ดูท้ายไฟล์)**:
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

## 🎨 M22 REDESIGN — merge เข้า main แล้ว (Kanit + light-only + typewriter + ตารางเกลา)
สถานะปัจจุบันของ main · รายละเอียด+เหตุผลอยู่ DESIGN.md §เคาะแล้ว M22

## 🧭 M23 INNER-SHELL (2026-07-22 — implement เสร็จ branch `redesign/m23-inner-shell`, ยังไม่ merge)
เบสสั่ง "หน้าแรกคงเดิม แต่เข้าไปในเว็บให้มี sidebar ประจำแบรนด์ + navbar เครื่องมือกลาง" → ทำหน้าเทียบ 3 แบบ (branch `mockup/m23-shell-compare` · preview บน Vercel) → **เบสเลือก Variant A "เมนู"**
- **โครง route**: root layout สลิมเหลือ html/body · แยกโซนด้วย route group — `(home)/` = SiteHeader เดิม (หน้าแรก output ไม่เปลี่ยน) · `(app)/` = GlobalNavbar + sidebar (URL เดิมทุกอัน: route group ไม่เปลี่ยน path) · `/brands` index อยู่ `(app)/(plain)/` (navbar เปล่าไม่มี sidebar)
- **Sidebar Variant A** (`brand-sidebar.tsx`): เมนู ภาพรวมแบรนด์/รุ่นรถทั้งหมด/แหล่งอ้างอิง · หน้ารุ่นเพิ่มกลุ่ม "ในหน้านี้" (บันไดราคา/ADAS/ไทม์ไลน์/แหล่งอ้างอิง — **gate ตามข้อมูลจริง**: ไม่มี ADAS/event → ซ่อน) · anchor เลื่อนด้วย `scroll-mt-20` กัน navbar บัง
- **Navbar** (`global-navbar.tsx`): ค้นหา (→ `/?q=#database` reuse สัญญาเดิม) · BrandSwitcher (รู้แบรนด์ทั้ง /brands/[slug] และ /cars/[slug]) · **"เทียบรุ่น (เร็วๆ นี้)"** disabled (เบสเคาะให้โชว์) · แบรนด์ · mobile = hamburger→drawer (รายชื่อรุ่น + เมนูกลาง · a11y ครบ)
- **query ใหม่** `getNavIndex()` เบา (brands+nameplates · cache dedupe) ป้อน switcher/drawer · **ลบ `theme-toggle.tsx`** (dead code)
- **ไฟล์ใหม่**: `(home)/layout.tsx` `(app)/layout.tsx` `(app)/(plain)/layout.tsx` `(app)/brands/[slug]/layout.tsx` `(app)/cars/[slug]/layout.tsx` `(app)/not-found.tsx` + loading ต่อโซน · components: `app-shell` `global-navbar` `brand-sidebar` `brand-switcher` `mobile-nav-drawer`
- verify: lint+tsc+build ผ่าน · เปิดจริง 3105 — หน้าแรกเหมือนเดิม · /brands (navbar เปล่า) · /brands/toyota + /cars/* (navbar+sidebar) · 404 ถูก (แบรนด์/รุ่นไม่มี→notFound จาก layout) · **สัญญา filter URL รอด** (`?body/pt/q` ยัง pre-apply) · anchor เลื่อนพ้น navbar · mobile drawer (iframe harness 400px) ครบ

## 🗂️ M24 ENTITY-SPLIT + REDESIGN + TIERLIST (2026-07-22 — branch `redesign/m24-entity-split`)
เบสสั่ง "รื้อ UXUI: แยกข้อมูลแต่ละหน้า + สวยขึ้น + Tierlist" → mockup รวม (branch `mockup/m24-compare`) → เบสเลือก Dense/Cards/Editorial
- **แยกหน้าตามลำดับชั้น (nested ใต้ /cars/[slug])**: `/gen/[launchYear]` (Generation) · `/gen/[gen]/[deriv]` (Derivative+Phase inline) · `/gen/[gen]/[deriv]/[trim]` (Trim/Variant — leaf รวยสุด: สเปกเต็ม+BEV+evidence) · `/timeline` (Change Timeline) — ทุกหน้าใช้ M23 shell (sidebar/navbar) · **หน้า thin ตอบ 200 + placeholder ซื่อสัตย์** (มิติ/facelift/model year = "ไม่มีข้อมูล/รอข้อมูล" ไม่ปลอมเลข)
- **query ใหม่**: `getNameplateTree` (คงชั้น gen→deriv→phase→trim→variant · `src/lib/slugs.ts` gen key=launchYear) + selectors + `getBrandTimeline` · ขยาย `getNameplateDetail` มีสเปก BEV (specExtras: motor/battery/range/charging — known เท่านั้น)
- **redesign**: หน้ารุ่น `/cars/[slug]` = **Dense** (stat tiles + PricePositionBar + ตารางเทียบ + BEV block จาก data จริง + generation strip ลิงก์หน้าย่อย) · หน้าแบรนด์ `/brands/[slug]` = **Cards** (KPI row + การ์ดรุ่น + brand timeline) คง CarDatabaseExplorer + สัญญา filter · primitives ใหม่ใน `badges.tsx` (StatTile/SpecRow/PricePositionBar/PendingBlock) · label ใหม่ CAB_TYPE/RIDE_HEIGHT/CHASSIS (กัน raw enum หลุด)
- **Tierlist Editorial** (`/tierlist` + `/tierlist/[slug]` โซน (plain)): S/A/B/C ติดป้าย "ความเห็นบรรณาธิการ" + byline + เหตุผล + หลักฐานต่ออันดับ · **เก็บเป็น config `src/lib/editorial-tiers.ts` (ไม่แตะ schema — แยก opinion จาก Fact tables · เบสแก้ไฟล์นี้เพื่อจัด tier)** · navbar เพิ่มลิงก์ "จัดอันดับ" · sidebar route-aware (หน้าย่อยโชว์ "← กลับหน้ารุ่น")
- verify: lint+tsc+build ผ่าน · เปิดจริง 3105 ทุกหน้า (hub/gen/deriv/trim/timeline/tierlist/brand) · slug รุ่น/tierlist ผิด = 404 · หน้า thin = 200+placeholder · filter URL รอด · ไม่มี raw enum หลุด (ตรวจแล้ว)
- ⚠️ known issue เล็ก: **deep invalid key** (เช่น `/gen/9999`, bad deriv/trim) เรนเดอร์หน้า 404 ถูก **แต่ HTTP status = 200** (soft-404 — Next.js: notFound จาก nested page ไม่ set 404 เหมือนจาก layout) · ผู้ใช้เห็นหน้า "ไม่พบ" ปกติ · แก้เต็มต้องเพิ่ม layout validate ต่อชั้น (ยังไม่ทำ — กระทบแค่ URL ที่พิมพ์มั่ว/ลิงก์เสีย)

## 🧭 M25 หน้ารุ่นเป็น TAB + แยก navbar(กลาง)/sidebar(แบรนด์) ชัด (2026-07-22 — branch `redesign/m25-sidebar-tabs` · ref prydwen.gg tabs)
เบสส่ง prydwen เป็น ref (แคปเก็บแล้ว) → หน้ารุ่นเป็น tab · **แล้วเบสเคาะ split สุดท้าย: navbar = เครื่องมือกลางใช้ร่วมทั้งเว็บ · sidebar = ทางลัดของแบรนด์นั้นๆ เท่านั้น** (ตรงคำขอแรกสุด)
- **navbar เครื่องมือกลาง** (`global-navbar.tsx`): logo + สลับแบรนด์ + ค้นหา + จัดอันดับ + เทียบรุ่น(เร็วๆนี้) + แบรนด์ — ข้ามแบรนด์ ใช้ทั้งเว็บ · อยู่ `(app)/layout`
- **sidebar ประจำแบรนด์ = เมนูเนื้อหาแบรนด์ "1 หน้า 1 เรื่อง"** (`brand-sidebar.tsx` · แบบหมวดใน prydwen · **ไม่ใช่ลิสต์ชื่อรุ่น** — เบสแก้รอบสุดท้าย): **ภาพรวม · รุ่นรถ · ไทม์ไลน์และประวัติ · แหล่งอ้างอิง** (แต่ละอันเป็นหน้าแยกจริง) · โชว์เฉพาะโซนแบรนด์/รุ่น · โซนไม่ผูกแบรนด์ (`/tierlist`,`/brands` index) = ไม่มี sidebar
- **หน้าแบรนด์แตกเป็น 4 หน้า** (1 เรื่อง/หน้า): `/brands/[slug]` ภาพรวม(ตัวตน+KPI+ทางเข้า) · `/models` (การ์ดรุ่น+explorer · filter ย้ายมาที่นี่) · `/timeline` (getBrandTimeline · Toyota 7 เหตุการณ์) · `/sources`
- **หน้ารุ่นเป็น tab** (`nameplate-tabs.tsx` client): ภาพรวม / ราคา·รุ่นย่อย / สเปก / ADAS / ไทม์ไลน์ — hero อยู่บน แท็บสลับ client · **ยุบ route เจน/ตัวถัง/รุ่นย่อย/timeline (M24) เข้า tab แล้วลบ** · slugs/getNameplateTree ยังใช้
- mobile drawer = ทางลัดรุ่นแบรนด์ปัจจุบัน + เมนูกลาง (หน้าแรก/แบรนด์/จัดอันดับ)
- verify: lint+tsc+build · เปิดจริง 3105 — navbar เครื่องมือกลางทุกหน้า · sidebar รุ่นโชว์เฉพาะ brand/car (active ถูก) · tierlist เต็มกว้างไม่มี sidebar · tab สลับ 5 แท็บ · brand Cards · slug ผิด=404 · mobile

## ▶ NEXT (ทำต่อทันที)
1. **รอเบสรีวิว M25 บน preview** → ถ้า OK merge M23+M24+M25 → main + deploy · ลบ branch mockup (m23/m24) + โฟลเดอร์ dev
2. เกลาถ้าเบสสั่ง: soft-404 status (เพิ่ม gen/deriv layout validate) · scroll-spy sidebar · Tierlist Data-driven (เพิ่มอีกหมวดในหน้า /tierlist) · เทียบรุ่น (Compare) เปลี่ยนปุ่ม navbar เป็นลิงก์
3. เติมข้อมูลให้หน้าย่อยรวยขึ้น: มิติตัวถัง (L×W×H) · ประวัติเจน/facelift · รูปจริง Champ/Revo
4. งานเดิมค้าง: ขยาย ADAS (BSM/AHB/LDW) · VOCABULARY Phase 5 · แบรนด์ที่ 2 (editorial gate)
