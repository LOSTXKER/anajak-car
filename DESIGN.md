# CARMETA — DESIGN (baseline design token + กฎ visual)

> AI ยึดก่อนงาน UI · เว็บ data-dense ที่ต้อง "อ่านง่าย เชื่อถือได้ ทันสมัย"
> ธีม: minimal ทันสมัยแบบ apple / tesla — สะอาด มีที่ว่าง คมชัด · ยืมโครงข้อมูลจาก data-tracker (op.gg/dotabuff) แต่ **ไม่ลอกหน้าตา**

## หลักการภาพ
1. **Minimal + data-dense** — ข้อมูลแน่นแต่ไม่รก · ใช้ whitespace + ลำดับชั้น (hierarchy) แยกกลุ่มข้อมูล
2. **Neutral palette + accent เดียว** — พื้นเทา/ขาว-ดำเป็นหลัก · สีเน้น 1 สีสำหรับ action/ค่าเด่น (ไม่ใช้สีจัดหลายสีแข่งกัน)
3. **Typography คม อ่านง่าย** — sans-serif · ตัวเลข tabular (align ราคา/สเปกเป็นคอลัมน์) · น้ำหนักตัวอักษรแยก label/value ชัด
4. **ทันสมัย** — มุมโค้งพอดี · เส้นบาง\/เงาเบา · ไม่ skeuomorphic ไม่ฉูดฉาด

## Evidence-first เป็น first-class UI (หัวใจ CARMETA — ต่างจากเว็บรถทั่วไป)
ทุกครั้งที่แสดงตัวเลข/ข้อเท็จจริงสำคัญ ต้องแสดง (หรือเข้าถึงได้ทันที):
- **Source** — มาจากไหน (ผู้ผลิต/รัฐ/marketplace) + ลิงก์/อ้างอิง
- **Freshness** — Checked date / Effective date ("ข้อมูล ณ วันที่…")
- **Confidence** — high/medium/low (แสดงเป็น badge/สีอ่อน)
- **Sample** — ราคามือสองต้องบอกจำนวนตัวอย่าง + cohort ("จาก N ประกาศ")
- **สถานะข้อมูล** — ค่าที่ไม่มี = "ไม่มีข้อมูล / ยังสรุปไม่ได้" (ไม่โชว์ 0 ปลอม · map จาก `DataStatus`)
- แยกชนิดราคาให้เห็นชัด (ป้ายมือหนึ่ง ≠ โปร ≠ ประกาศมือสอง ≠ ซื้อขายจริง) — ใช้ label/สี/ตำแหน่งต่างกัน

## Tokens (baseline — ปรับผ่าน Tailwind v4 `@theme` ใน globals.css · อัปเดตตามคำสั่งเบส 2026-07-19)
- **สี:** light = พื้นขาวล้วน (#ffffff) · dark = เทาเข้มแบบ GitHub/Linear (#17181c ไม่ดำสนิท) + accent "Royal Softened" (#2f56c9 / dark #7c9dfa — จากตระกูลสีโลโก้) + semantic (success/warning/danger สำหรับ confidence/quality)
- **ลดกล่องการ์ด:** แยกชั้นข้อมูลด้วย whitespace + เส้นแบ่งบาง (`divide-y`/`border-t`) แทนกล่องมีกรอบ · ใช้พื้น `surface-muted` เฉพาะ element ที่ต้องการ affordance (ปุ่ม/pill/tile ที่กดได้)
- **radius:** โค้งมนทันสมัย — ปุ่ม/pill/ตัวกรอง = `rounded-full` · การ์ด/ตาราง/รูป = `rounded-2xl` (16px)
- **ตัวกรอง:** dropdown select แบบมาตรฐานเว็บตารางข้อมูล (ตัวถัง ▾ ขุมพลัง ▾ สถานะ ▾) — state ที่เลือกแสดงเป็นสี accent บนตัวปุ่ม
- **spacing:** สเกล 4px · padding สม่ำเสมอ
- **font:** UI sans (Geist + Noto Sans Thai) · ตัวเลขใช้ `font-variant-numeric: tabular-nums`
- **dark mode:** รองรับตั้งแต่ต้น (neutral + accent ทำงานทั้ง 2 โหมด · CSS variables + data-theme toggle)
- **❌ ห้าม (เบสตัดสินใจแล้ว 2026-07-19):** gradient (ทั้ง text/พื้น/เส้น) · aurora/เอฟเฟกต์พื้นหลัง · แอนิเมชันเข้าฉาก · ไอคอนประดับหัว section · ฟอนต์อื่นนอกจาก Geist+Noto Sans Thai

## หลักการนำเสนอข้อมูล (สำคัญกว่าการตกแต่ง — บทเรียนจากฟีดแบ็กเบส 2026-07-19)
- **หนึ่งหน้า หนึ่งพระเอก:** หน้ารายละเอียดรถ พระเอกคือ "ราคา" — ช่วงราคาแสดงตัวใหญ่ระดับ display, ทุกอย่างอื่นถอยเป็นฉากหลัง
- **บันไดราคา:** รุ่นย่อยเรียงราคาต่ำ→สูงเป็นขั้นบันได แต่ละขั้นแสดง **"+ส่วนต่างจากขั้นก่อน"** — ตอบคำถามจริงของคนซื้อ ("จ่ายเพิ่มเท่าไหร่ได้อะไร")
- **สเปกเป็นประโยคเดียว:** "ดีเซล · 204 PS · อัตโนมัติ 6 สปีด · 4WD" ในบรรทัดเงียบๆ ใต้ชื่อรุ่น ไม่แตกเป็นหลายคอลัมน์
- **ความเชื่อมั่นพูดครั้งเดียว:** ถ้าทุกราคาอ้างแหล่งเดียว/ระดับเดียว → สรุปเป็นประโยคเดียวต่อหน้า (เช่น "ทุกราคาอ้างอิง Toyota Motor Thailand · ตรวจสอบ 19 ก.ค. 2026") ห้ามติดป้าย HIGH ซ้ำทุกแถว · ป้ายรายแถวใช้เฉพาะเมื่อแหล่ง/ระดับต่างกันจริง · รายละเอียดรายแหล่งอยู่ section แหล่งอ้างอิงเสมอ
- **อย่าใส่ข้อมูลซ้ำ:** ค่าที่ซ้ำกันทุกแถว (วันที่เดียวกัน แหล่งเดียวกัน) ยกขึ้นไปพูดที่ระดับ section
- **Hero หน้าแรก = search-first (เบสเลือกจากหน้าเทียบ 3 แบบ 2026-07-20):** ช่องค้นหาใหญ่คือพระเอกแทนปุ่ม CTA — คนมาเว็บนี้เพื่อ "ค้นรถ" ให้ทำได้ทันที · ใต้ช่องค้นหา = ชิปหมวดที่ผูก filter จริง (ห้ามชิปที่ไม่ทำงานจริง) เท่านั้น — **เบสสั่งตัดบรรทัดข้อความใต้ชิปออกหมด (2026-07-20): จำนวนรุ่น/รุ่นย่อย · คำเคลม "ทุกราคาอ้างแหล่งทางการ" · "ตรวจล่าสุด <วันที่>" — ห้ามใส่กลับ hero จบที่ชิป** · hero ส่งเงื่อนไขเข้าตารางผ่าน URL param (`?q=/&body=/&pt=/&cap=`) — แชร์ลิงก์ผลกรองได้ · ช่องค้นหาในตารางซ่อนบนหน้าแรก (ซ้ำกับ hero — หน้าอื่นที่ไม่มี hero ยังแสดง)
- **ตาราง = แน่นแต่สะอาด ในโทน minimal เดิม (T3 + เกลารอบ 2 จากฟีดแบ็ก "รก/ตัวเล็ก/ไม่เป็นระเบียบ" 2026-07-20):** คอลัมน์น้อย (# · รุ่น · ราคาเริ่มต้น · ประเภท · ขุมพลัง · รุ่นย่อย▾) · **ราคาในแถวสรุป = "เริ่มต้น" ตัวเดียว** (ช่วง min–max ไม่เป็นระเบียบ — ช่วงเต็มเห็นตอนกาง/หน้ารุ่น) · ตัวหนังสือเนื้อหาหลัก ≥14px, meta ≥13px · ข้อมูลซ้ำรายแถว (แบรนด์/ปี/วันที่ตรวจ/จุดสถานะ) ยกไปพูดครั้งเดียวเหนือตาราง — เบส reject: T1 (op.gg เต็มตัวตัด hero) · T2 (panel dashboard) · **หลอดราคาในตาราง (PriceBar — รกและซ้ำกับตัวเลข ตัดออก 2026-07-20 ห้ามใส่กลับ)** · ราคา min–max ในแถวสรุป · แบรนด์จางใต้ชื่อรายแถว
- **ตารางหน้าแรก = รุ่นรถล้วน ไม่มีรุ่นย่อย (เบสตัดสินใจ 2026-07-20 — แทนที่แบบกดกางที่ทำก่อนหน้า):** แถวรุ่นคลิก = เข้าหน้ารายละเอียด (`/cars/[slug]`) ซึ่งเป็นที่เดียวที่แสดงรุ่นย่อย (บันไดราคา) · คอลัมน์ท้าย "x รุ่นย่อย ›" บอกความลึก+ affordance คลิก · การค้นหายังครอบชื่อรุ่นย่อย (ค้น "GR Sport" เจอรุ่นที่มี — ใช้ variantRows เป็น haystack) · ระบบกางถูกลองแล้วเบสไม่เอา — อย่าทำกลับมาโดยไม่ถาม

- **โครงเว็บ = sidebar หมวด (prydwen model — เบสสั่ง + ให้ไปดู `/star-rail/characters` จริง · M22):** ยึด mental model ของ prydwen เป๊ะ →
  - **หน้าแรก `/` = landing เต็มจอ ไม่มี sidebar** (มี top header `LandingHeader`: โลโก้ + ลิงก์ รุ่นรถทั้งหมด/แบรนด์ + theme toggle) · route group `(home)` มี layout ของตัวเอง
  - **Sidebar = เมนู "หมวด" ล้วน** (route group `(app)`: หน้าแรก · **ฐานข้อมูล** > รุ่นรถทั้งหมด, แบรนด์ · icon + section header + active by startsWith) — **ห้ามเอาชื่อรุ่นมาไว้ใน sidebar** (เบส reject รอบแรก: "ชื่อรุ่นไม่ต้องไว้ sidebar รุ่นเราเหมือน character")
  - **รุ่นรถ = "character"** → แสดงเป็น **grid การ์ด (`ModelCard`) ในหน้า** (`/cars` = หน้า Characters: ค้นหา + ฟิลเตอร์ชิปตัวถัง/ขุมพลัง + "แสดง N รุ่น" · และหน้า `/brands/[slug]`) ไม่ใช่ list ใน sidebar
  - ตามธีมเว็บ (`bg-background`/`border-r` ไม่เข้มถาวร) · content column ต้อง `min-w-0` · `max-w-6xl` อยู่ที่ layout ของแต่ละ group · mobile = top bar + drawer (เมนูหมวดเดียวกัน · focus-trap/Esc/scroll-lock/ปิดเมื่อ navigate) · ไอคอนเมนูนำทาง ≠ ไอคอนประดับหัว section ที่ห้าม (คนละหน้าที่ — เบสอนุมัติ) · ไม่ลิสต์แบรนด์ upcoming ใน sidebar (เล่าที่หน้า `/brands`)
- **โครง "แบรนด์ = เกม" เต็มรูปแบบ (M23 — เบสสั่งจาก prydwen game-zone):** ยกระดับจาก M22 →
  - **Navbar บนสุด (global ทุกหน้าในโซน app):** โลโก้ + **BrandSwitcher** (dropdown สลับแบรนด์ แบบ game selector) + ลิงก์ "รุ่นรถทั้งหมด" + theme toggle · โลโก้/toggle ย้ายจาก sidebar มาที่นี่ (กันซ้ำ)
  - **Sidebar = เมนูประจำโซน:** โซน global (`/cars`,`/brands`) = หน้าแรก/รุ่นรถทั้งหมด/แบรนด์ · **โซนแบรนด์ (`/brands/[slug]/*`)** = หัวโลโก้แบรนด์ + หน้าหลัก · **ฐานข้อมูล** > รุ่นรถ, บันไดราคา, ไทม์ไลน์และประวัติ (gate ตามข้อมูลจริง — ห้ามหน้า thin)
  - **URL ใต้แบรนด์:** `/brands/[slug]` (Brand Home) · `/brands/[slug]/cars` (grid) · `/brands/[slug]/cars/[carSlug]` (หน้ารถ — **ย้ายจาก `/cars/[slug]` · ลิงก์เก่า 308 redirect ไป canonical**) · `/price-ladder` · `/timeline`
  - **Brand Home = การ์ดนำทาง 3 ใบ (พระเอก)** สรุปหน้าลูกด้วยตัวเลขจริง (รุ่นรถ/บันไดราคา/ไทม์ไลน์) + ทางลัดรุ่น (รูปย่อ+ชื่อ ไม่มีราคา กันซ้ำ) + ความเคลื่อนไหวล่าสุด 3 รายการ (teaser ไม่มี evidence) — Home ไม่เป็นเจ้าของข้อมูลก้อนไหน เป็นเจ้าของ "การนำทาง+ความสด"
  - route group: `(global)/brands/page` (/brands) อยู่ร่วมกับ `brands/[slug]/*` ได้ (คนละ path · build ยืนยันไม่ชน) · param ห้ามซ้ำ → `[carSlug]`
- **บันไดราคาแบรนด์ `/brands/[slug]/price-ladder` (M23 — แทน "tier list" ที่ทำตรงๆ ไม่ได้ตามกฎห้ามจัดอันดับ):** พระเอก = แกนราคาเดียวทั้งแบรนด์ (ช่วงราคา display + บันได 62 ขั้นเรียงราคาต่ำ→สูงทั้งแบรนด์) · **"หมุดราคา"** (เส้น+ตัวเลขจางทุก step กลม {100k/250k/500k/1M} ให้ได้ 3–8 อัน) = ตำแหน่งบอกด้วยตัวเลข+landmark **แทนหลอดราคาที่เบส reject** · delta ข้ามรุ่นแม่ตั้งใจ (คำถาม cross-shop จริง) · **ไม่มีคอลัมน์ # (เลี่ยงกลิ่นจัดอันดับ)** · เฉพาะรุ่น CURRENT/TRANSITION · กรองแล้ว delta+หมุดคำนวณใหม่
- **หน้าแบรนด์ = model grid ไม่ใช่ตาราง (M22 · ตอนนี้ = `/brands/[slug]/cars`):** การ์ดรูปรถต่อรุ่น (รูป/ชื่อ/สถานะ/สเปกบรรทัดเดียว/**ราคาเริ่มต้นตัวเดียว** ไม่ min–max/หลอดราคา) เรียงราคาต่ำ→สูง · **เลิกใช้ CarDatabaseExplorer** (ลบไฟล์แล้ว)

## Component ที่คาดว่าใช้ซ้ำ (สร้างเมื่อถึงตา — อย่าสร้างล่วงหน้า)
- `EntityBreadcrumb` (Brand › Nameplate › Generation › Trim › Variant)
- `PriceCard` (จำนวน + ชนิดราคา + source + วันที่)
- `EvidenceBadge` / `ConfidenceBadge` / `FreshnessTag` / `SampleTag`
- `SpecTable` (label/value + สถานะข้อมูล) · `ChangeTimeline` · `CompareTable` (exact entity)
- `DataStatusValue` (แสดงค่า หรือ "ไม่มีข้อมูล" ตาม DataStatus)

## กติกา
- ไม่ใส่กราฟ/ภาพประกอบเกินจำเป็น — ข้อมูลนำ ภาพเสริม
- responsive · เข้าถึงได้ (contrast ผ่าน · aria สำหรับ table/badge)
- อย่า over-engineer ตอนต้น — วาง token + component เท่าที่หน้าใช้จริง

## ⚠️ บทเรียนเครื่องมือตรวจภาพ (กันวินิจฉัยผิดซ้ำ — เจ็บมาแล้ว 2026-07-20)
- **Chrome headless บังคับความกว้างขั้นต่ำ 500px** — `--window-size=390` ได้ viewport 500 จริง (`innerWidth=500`) แล้ว crop ภาพเหลือ 390 → ทุกอย่างดู "เบ้ซ้าย-ตัดขวา" เหมือน layout พังทั้งที่ไม่พัง · ตรวจ mobile < 500px ต้องใช้ **iframe harness** (หน้า HTML กว้าง ≥500 มี `<iframe width=390>` ชี้ localhost แล้ว screenshot ทั้งหน้า) หรือ CDP `Emulation.setDeviceMetricsOverride`
- ก่อนสรุปว่า "layout พัง" จาก screenshot: เช็ค `innerWidth` จริงก่อนเสมอ (inject script วัดในหน้า repro)

## ⚠️ บทเรียนเทคนิค (M23 — กันพลาดซ้ำ)
- **`backdrop-filter`/`filter`/`transform` สร้าง containing block ให้ `position: fixed` ลูก** — วาง drawer/overlay ที่เป็น `fixed` ไว้ใน navbar ที่มี `backdrop-blur` → drawer ถูกบีบอยู่ในกล่อง navbar (h-14=56px) เมนูไม่โผล่ (bug จริง M23 · headless screenshot จับได้) · **แก้: `createPortal` overlay ไป `document.body`** (หนี containing block) + guard `mounted` (SSR ไม่มี body) · drawer/modal ทุกตัวควร portal ไป body เป็นหลัก
- **ห้ามส่ง component (function) เป็น prop ข้าม server→client** (เช่น icon ใน nav config) — build error "Functions cannot be passed to Client Components" → ใช้ `iconKey: string` + registry map ฝั่ง client (`NAV_ICONS`)
- **route group อยู่ร่วม segment เดียวกันได้** ถ้าคนละ path จริง: `(global)/brands/page.tsx` (/brands) + `brands/[slug]/` (/brands/[slug]) build ผ่าน — ให้ layout ต่างกันต่อโซนโดยไม่ double sidebar
- **legacy URL redirect ที่ต้อง lookup DB** ทำใน `next.config` ไม่ได้ (static เท่านั้น) → ทำ page redirect-only: `permanentRedirect()` (308) · ไม่รู้จัก slug → `notFound()` · **ห้ามครอบ permanentRedirect ด้วย try/catch** (มัน throw `NEXT_REDIRECT` ภายใน)
