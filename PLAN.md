# CARMETA — PLAN (แผนโค้ด · ไม่ใช่แผนธุรกิจ)

> แตก task ติ๊กได้ · ทำทีละอัน · ติ๊กเมื่อ verify แล้ว (รัน/เปิดดูจริง)
> แผนธุรกิจ/coverage strategy อยู่ที่ bestos `records/projects/anajak-car/`

## ✅ Milestone 0: Bootstrap (เสร็จ)
- [x] Scaffold Next.js (App Router + TS + Tailwind v4 + src/)
- [x] ติดตั้ง Prisma + Supabase client
- [x] เขียน `prisma/schema.prisma` (24 models ครอบ taxonomy + market + evidence)
- [x] `src/lib/prisma.ts` (singleton) + `src/lib/supabase.ts`
- [x] เอกสารมาตรฐาน repo (AGENTS/CLAUDE/SPEC/PLAN/PROGRESS/PRODUCT/DESIGN) + hook + settings

## ✅ Milestone 1: DB จริง + ข้อมูลจริง (เสร็จ 2026-07-19)
- [x] ตั้ง Supabase project + ใส่ `DATABASE_URL` (pooled) + `DIRECT_URL` (migrate) ใน `.env`
- [x] `prisma db push` สร้าง 24 ตาราง (DB ว่างหลัง reset ตามคำสั่งเบส)
- [x] Research ข้อมูลจริง Toyota 5 Nameplate (Corolla Altis · Yaris Ativ · Hilux Travo · Fortuner · bZ4X — ครอบ ICE/กระบะ-PPV/EV ตาม SPEC) จากแหล่งทางการ + adversarial verify **41/41 ราคาผ่าน** + critic ไม่มี BLOCKER
- [x] เขียน `prisma/seed.ts` + `seed-data.ts` (generate จาก workflow + normalize ตาม critic)
- [x] รัน seed + query ตรวจ: 41 ราคาอ้าง MANUFACTURER_OFFICIAL/HIGH ครบ · 0 orphan ทุกเช็ค

## ▶ Milestone 2: หน้าเว็บแรก (ปัจจุบัน)
- [x] Design tokens ตาม DESIGN.md (@theme · dark mode · tabular-nums · ฟอนต์ Noto Sans Thai)
- [x] Layout shell minimal (nav + footer แบบ apple/tesla) + metadata
- [x] หน้า Car Market Database (ค้นหา + filter ตัวถัง/ขุมพลัง/สถานะ/งบ + ตาราง data-dense + Source/Confidence/Freshness first-class)
- [x] Nameplate Hub `/cars/[slug]` (generation + trim/variant + ราคา + Change Timeline + evidence)
- [x] loading/error/empty/404 states (404 ตอบ status ถูกต้อง — ย้าย loading.tsx เข้า route group)
- [x] แก้ finding จาก review workflow ครบ (timezone/cache/contrast/aria/sort-null/effectiveTo/นับ source)
- [x] verify: lint + tsc + build ผ่าน + curl ตรวจเนื้อหา/status ทุก route
- [ ] เปิด browser ตรวจภาพจริง 390/1280/dark (Chrome extension ไม่เชื่อมต่อ — รอเบสเปิดดู localhost:3000)

## ✅ Milestone 3: Redesign หน้าแรก + ธีม + Brand Hub (เสร็จ 2026-07-19)
- [x] Theme toggle สว่าง/มืด/ตามระบบ (data-theme + localStorage + no-FOUC script + sync ข้าม tab)
- [x] หน้าแรกใหม่: หัวข้อใหญ่ตรงกลาง → แถว brand tile (Toyota active + upcoming ปิดไว้ ไม่เปิดหน้า thin) → สถิติ → ตาราง CMC-style + search แคปซูล
- [x] Brand Hub `/brands/[slug]` (ข้อมูลบริษัทจริง + ตาราง nameplate reuse explorer + แหล่งอ้างอิง)
- [x] Refactor: buildNameplateSummary ใช้ร่วม 2 หน้า · SourcesSection ใช้ร่วม 2 หน้า · breadcrumb ลิงก์ถึงกันครบ
- [x] verify: tsc/lint/build + curl ทุก route + review workflow 12 agents → แก้ 8 finding ที่ยืนยันครบ

## ✅ Milestone 4: โลโก้จริง + รูปรถ + มุมมองรุ่นย่อยแบบหุ้น (เสร็จ 2026-07-19)
- [x] โลโก้แบรนด์จริง 9 แบรนด์จาก Wikimedia Commons (ตรวจ SVG ไม่มี script · CREDITS.md บันทึก license/ที่มา)
- [x] รูปรถทางการ 5 รุ่นจาก toyota.co.th (webp ~18KB/รูป · CREDITS.md + ⚠️ ทบทวนสิทธิ์ก่อน production)
- [x] ตารางเพิ่มมุมมองสลับ "รุ่นรถ" ↔ "รุ่นย่อยทั้งหมด" (แถวละ 1 ราคาแบบตารางหุ้น CMC) + รูปรถทุกแถว
- [x] หน้ารุ่นมีภาพ hero · หน้าแบรนด์/tile ใช้โลโก้จริง (fallback monogram)
- [x] verify: tsc/lint/build + curl ตรวจ render ทุกหน้า

## ▶ Milestone 5: Landing + สี navy + หน้าเลือกยี่ห้อ (ตามสั่งเบส 2026-07-19)
- [x] ถอดแถบสถิติออกจากหน้าแรก · tile โลโก้ไม่โชว์จำนวนรุ่น · โลโก้สีเต็มไม่จาง
- [x] accent เปลี่ยนเป็นน้ำเงินเข้ม (#1e40af / dark #7da2ff) + จุดสี ≤10% (CTA, chip active, eyebrow, icon cards)
- [x] หน้าแรกกึ่ง landing เพื่อ SEO: CTA คู่ + 3 value cards + Coverage (internal links) + FAQ + FAQPage JSON-LD
- [x] หน้า `/brands` (เลือกยี่ห้อ) + ปุ่ม "ดูเพิ่มเติม" + nav แบรนด์ชี้ /brands
- [x] แก้ finding จาก review workflow รอบ landing (5 จุด: HIGH title เคลมเกิน "ทุกรุ่นในไทย" · MEDIUM meta description เคลมเกิน + Coverage hardcode ชื่อแบรนด์ · LOW FAQ chevron + upcoming tile label เข้าถึงได้)
- [x] verify: tsc/lint/build + curl ครบ

## ✅ Milestone 6: โลโก้จริง + สีตามโลโก้ทั้งเว็บ (เสร็จ 2026-07-19)
- [x] ประมวลผลไฟล์โลโก้จริงที่เบสส่งมา (1.png ไอคอน · 2.png full lockup) → crop/resize + สร้าง dark-mode variant (รีแมปสีกรมท่าเป็นสีอ่อนอัตโนมัติจาก luminance เพื่อให้อ่านออกบนพื้นมืด)
- [x] สุ่มค่าสีจริงจากไฟล์โลโก้ (ไม่เดา): #0b52fa ฟ้าเข้ม / #079bfd ฟ้ากลาง / #0ac3fb ฟ้าอ่อน / #081839 กรมท่า
- [x] ตั้ง accent ทั้งเว็บจากสีโลโก้จริง — light ใช้ฟ้าเข้ม (contrast 5.8:1) · dark ใช้ฟ้ากลาง (contrast 6.7:1) ผ่านการคำนวณ WCAG จริงก่อนเลือก
- [x] Header/Footer ใช้โลโก้จริง (ไอคอน + wordmark "carmeta" เป็น text จริงเพื่อความคมชัด/SEO ไม่ใช้ raster wordmark) สลับสีตามธีมด้วย CSS ล้วน (ไม่มี hydration mismatch)
- [x] favicon.ico + apple-icon.png (Next.js convention) + OG/Twitter image จากโลโก้จริง
- [x] hero glow ใช้ 2 โทนจากโลโก้ (ฟ้าเข้ม+ฟ้าอ่อน) แบบตกแต่งเบาๆ
- [x] verify: tsc/lint/build + curl ทุกหน้า + preview composite บนพื้นมืด/สว่างจริง

## ✅ Milestone 7: ปรับโทน accent — สีจากโลโก้แต่ไม่แข็ง (เสร็จ 2026-07-19)
- [x] เบสรู้สึกว่าสี Milestone 6 (#0b52fa) "แข็ง" — ทำ artifact เทียบ 14 ตัวเลือก (คำนวณ WCAG contrast จริงทุกตัวก่อนเสนอ)
- [x] รอบแรกเบสเลือก G "Soft Sky Blue" (#2a5fac/#8bbdf2) → ขอลองสลับเป็น **B "Royal Softened"** — light `#2f56c9` (6.1:1) / dark `#7c9dfa` (7.6:1) — ยังเป็นน้ำเงินโทนเดียวกับโลโก้ แค่ลดความอิ่มสี
- [x] อัปเดต `globals.css` ทั้ง 3 จุด (root/data-theme toggle/prefers-color-scheme) — ระหว่างทางเจอ+แก้บั๊กเดิม: `--accent-2-soft` หายไปจาก data-theme="dark" block (มีแต่ใน media query block) ทำให้ toggle มือไปมืดแล้ว hero glow จุดที่สองใช้ alpha ผิด
- [x] verify: tsc/lint/build ผ่าน + grep CSS bundle จริงยืนยันสีใหม่ขึ้นแทนสีเก่าครบ + curl ทุก route 200

## ✅ Milestone 8: ปรับปรุง UX/UI หน้าแรก — เน้นตาราง (เสร็จ 2026-07-19)
- [x] สร้าง headless-Chrome screenshot pipeline (Chrome extension ต่อไม่ได้ทั้ง session) เพื่อดู UI จริงแทนการเดา — เจอบั๊กจริง 3 อย่าง:
  1. ตารางล้นขอบจอที่ 1280px (คอลัมน์เจเนอเรชันมีรหัสแชสซียาวมาก เช่น "GUN226R/GUN236R · XPN225R (BEV) (2025)")
  2. 2/5 แถวโชว์ข้อความซ้ำกันเป๊ะในคอลัมน์ติดกัน (Fortuner: เซกเมนต์="PPV" ตัวถัง="PPV" · Hilux Travo: เซกเมนต์="กระบะ" ตัวถัง="กระบะ")
  3. โลโก้ Nissan/Mazda/Mitsubishi (wordmark) จมหายบนพื้นมืด (contrast ~1:1 เหมือนปัญหาเดิมของไอคอน CARMETA เอง)
- [x] Redesign ตาราง: เพิ่มคอลัมน์ # (ลำดับ) · ย้ายราคาป้ายมาอยู่ตำแหน่งที่ 2 (ตัวหนา/ใหญ่ขึ้น) · รวมเซกเมนต์+ตัวถัง dedup เมื่อข้อความซ้ำ · เจเนอเรชันเหลือแค่ปี (รหัสเต็มอยู่ใน title attribute) · รุ่นย่อยเป็น pill · สถานะย่อเป็นจุดสี + confidence + วันที่ในคอลัมน์เดียว → คอลัมน์แคบลง ไม่ล้นขอบที่ 1280px แล้ว (ยืนยันด้วย screenshot จริง ไม่ใช่แค่ประมาณ)
- [x] แก้โลโก้ 3 แบรนด์ด้วยเทคนิคเดียวกับไอคอน CARMETA: rasterize SVG ผ่าน headless Chrome → รีแมป pixel เฉพาะที่ saturation ต่ำ+มืด (หมึกดำ/เทา) เป็นสีอ่อน คงสีจริง (แดง/น้ำเงิน) ไว้ → ยืนยันด้วย composite preview ก่อนใช้จริง
- [x] Filter chips จัดกลุ่มด้วยพื้นเทาอ่อนร่วมกัน (แทนเส้นคั่นบางๆ) แยกกลุ่มตัวถัง/ขุมพลัง/สถานะชัดขึ้น
- [x] Brand tile: เพิ่ม hierarchy — tile ที่ใช้งานได้ (accent border+bg) เด่นกว่า tile "เร็วๆ นี้" (dim เฉพาะโลโก้ ไม่แตะ opacity ข้อความกัน regression ของ a11y fix เดิม)
- [x] verify: tsc/lint/build + screenshot จริงทั้ง light/dark/mobile(390px precise via CDP) + คลิกสลับมุมมองตารางจริงผ่าน CDP ยืนยัน "รุ่นย่อยทั้งหมด" ก็ไม่ล้นเหมือนกัน

## ✅ Milestone 9: Minimal redesign — ขาวล้วน/เทาเข้ม ลดการ์ด โค้งมน dropdown filters (เสร็จ 2026-07-19)
- [x] ธีมสว่าง = ขาวล้วน (#ffffff) · ธีมมืด = เทาเข้มแบบ GitHub/Linear (#17181c ไม่ดำสนิท) — ทุกคู่สีข้อความคำนวณ WCAG ผ่าน AA ก่อนตั้งค่า
- [x] ลดกล่องการ์ดทั้งเว็บ: ตาราง/value cards/FAQ/ไทม์ไลน์/แหล่งอ้างอิง/สถิติ dl ทุกหน้า → เส้นแบ่งบาง (divide-y/border-t) + whitespace แทนกรอบ · เหลือพื้น surface-muted เฉพาะ element ที่กดได้
- [x] โค้งมนทันสมัย: ปุ่ม/pill/filter = rounded-full · การ์ด/ตาราง/รูป = rounded-2xl (ทั้ง error/not-found/theme-toggle/header chip)
- [x] Refactor ตัวกรองเป็น dropdown select มาตรฐาน (ตัวถัง ▾ ขุมพลัง ▾ สถานะ ▾ + state ที่เลือกเป็นสี accent บนปุ่ม) แทนแถวชิปยาว + ปุ่ม "ล้างตัวกรอง" โผล่เมื่อมี filter
- [x] อัปเดต DESIGN.md tokens ให้ตรงทิศทางใหม่ (spec ต้องตามจริง)
- [x] verify: tsc/lint/build ผ่าน + screenshot จริง light/dark 1280px + mobile 390px แบบ precise CDP (นับ tile 10/10 จาก DOM จริง — ภาพแรกที่ tile ดูหายเป็น artifact ของ --window-size ไม่ใช่บั๊ก)

## ✅ Milestone 10: ฟอนต์ Anuphan + ชั้น "ความมีชีวิต" (เสร็จ 2026-07-19)
- [x] เปลี่ยนฟอนต์ไทย Noto Sans Thai → **Anuphan** (Cadson Demak · loopless ยุคใหม่) — ละติน/ตัวเลขยังเป็น Geist (อยู่หน้ากว่าใน stack ตัวเลข tabular คมกว่า)
- [x] Gradient สีแบรนด์ (น้ำเงิน→ฟ้า ทิศเดียวกับบาร์ในโลโก้) บนคำสำคัญพาดหัว — ตรวจ contrast large-text ≥3:1 ทั้งสองธีมก่อนใช้ (light #2f56c9→#0a7fc9 · dark #7c9dfa→#0ac3fb)
- [x] Aurora สีแบรนด์ลอยช้าๆ หลัง hero (2 blob เบลอ · ปิดอัตโนมัติเมื่อ prefers-reduced-motion + แก้ reduce rule ให้ฆ่า animation-delay ด้วย กัน content ค้างซ่อน)
- [x] จังหวะเปิดหน้า fade-up ทีละชิ้น (eyebrow → h1 → คำโปรย → CTA → แถวโลโก้)
- [x] Micro-interactions: รูปรถขยายนุ่มๆ ตอน hover แถวตาราง · CTA ยกตัว+เงาสี accent ตอน hover
- [x] เส้น hairline gradient สีแบรนด์ใต้ header + เหนือ footer (แทน border เรียบ)
- [x] verify: tsc/lint/build + screenshot จริงทั้งสองธีม

## ✅ Milestone 11: Fix Safari + Tracker DNA (dotabuff/op.gg) (เสร็จ 2026-07-19)
- [x] **Fix UI พังจริงจาก screenshot Safari ของเบส**: (1) aurora เป็นกล่องทึบขอบคม — Safari clip `filter: blur` ใหญ่เต็มกรอบ → เปลี่ยนเป็น radial-gradient นุ่มโดยธรรมชาติ ไม่พึ่ง filter (2) gradient text ไม่ขึ้น → เพิ่ม `-webkit-text-fill-color: transparent`
- [x] หน้ารายละเอียดรถแบบ tracker: **hero band** gradient มุมโค้งใหญ่ (รูปรถในกรอบ + ชื่อ/badges + summary) + แถว **stat capsule มีไอคอน** 5 ใบ (ราคาเริ่มต้น/รุ่นย่อย/เจน/ปีเปิดตัว/ตรวจสอบล่าสุด)
- [x] **แถบเทียบราคา (price bar)** สไตล์ win-rate bar: หน้า detail (ตำแหน่งราคาภายในรุ่น) + หน้าแรกทั้ง 2 มุมมอง (ช่วงราคา/ตำแหน่งราคาเทียบทั้งตาราง สเกลนิ่งไม่ขยับตาม filter) — เป็น data-viz จากราคาจริง ไม่ใช่ ranking (กฎ product: ห้ามจัดอันดับรถด้วยคะแนนเดียว)
- [x] ป้าย "เริ่มต้น" (ถูกสุด) / "ท็อปสุด" (แพงสุด) ในตารางรุ่นย่อย — ข้อเท็จจริงจากราคา ไม่ใช่ tier
- [x] ไอคอนหัว section ทุกอัน (รุ่นย่อย/ไทม์ไลน์/แหล่งอ้างอิง) — ลดความ minimal ลงตามสั่ง
- [x] แก้บั๊กข้อมูลค้าง: ชื่อรุ่นย่อย Hilux ใน DB มี prefix "Hilux Travo …Cab" ซ้ำกับหัวกลุ่ม (ตัวตัดคำใน transform เช็ค 'Hilux' แต่ค่าจริง 'Toyota Hilux' — ไม่เคยทำงาน) → UPDATE 18 แถว + แก้ transform
- [x] verify: tsc/lint/build + screenshot จริง (hero band/capsule/bar/ชื่อสั้น ครบ)

## ✅ Milestone 12: Information design rework — "บันไดราคา" (เสร็จ 2026-07-19)
- [x] ฟีดแบ็กเบส: "ข้อมูลวางไปงั้นๆ ไม่คำนึงถึงคนอ่าน อ่านยาก โฟกัสไม่มี" + สั่งตัด gradient/ไอคอน/ฟอนต์ใหม่ กลับ minimal เดิม + เปิดอิสระรื้อการแสดง confidence
- [x] Revert: ฟอนต์กลับ Noto Sans Thai · ตัด gradient ทุกจุด (text/aurora/hairline/price-bar) · ตัดแอนิเมชันเข้าฉาก · ตัดไอคอน section/capsule · header/footer กลับ border ปกติ
- [x] **หน้ารายละเอียดรถ = บันไดราคา:** ช่วงราคาแสดง display-size เป็นพระเอกเดียวของหน้า · รุ่นย่อยเรียงเป็นบันได แต่ละขั้นบอก "+ส่วนต่างจากขั้นก่อน" · สเปกเป็นประโยคเดียวใต้ชื่อ (ดีเซล · 204 PS · อัตโนมัติ 6 สปีด · 4WD)
- [x] **ความเชื่อมั่นพูดครั้งเดียว:** สรุป "ทุกราคาอ้างอิง Toyota Motor Thailand (แหล่งทางการ) · ตรวจสอบ..." บรรทัดเดียวต่อหน้า แทนป้าย HIGH ซ้ำ 18 แถว (per-source ยังครบใน section แหล่งอ้างอิง — evidence-first ไม่เสีย)
- [x] หน้าแรก declutter: ตัดป้าย HIGH รายแถว + ตัดวันที่ซ้ำใน variant view · คอลัมน์ "ข้อมูล" → "อัปเดต" (จุดสถานะ+วันที่)
- [x] บันทึกหลักการนำเสนอข้อมูลลง DESIGN.md (หนึ่งหน้าหนึ่งพระเอก/บันไดราคา/พูดครั้งเดียว/อย่าซ้ำ + รายการห้ามที่เบสตัดสินใจแล้ว)
- [x] verify: tsc/lint/build + screenshot จริง

## ✅ Milestone 13: ออกแบบระบบภาษากลาง (Canonical Vocabulary) — สเปกเสร็จ (2026-07-20)
- [x] Inventory ทุกจุดใน repo ที่มีศัพท์เกี่ยวกับรถ (schema/seed/UI) — พบ 15 surface ที่เป็น free-text/mixed/missing_concept
- [x] วิจัยศัพท์ตลาดไทยจริง 5 โดเมน (เกียร์/ระบบขับเคลื่อน/ไฮบริด-EV+หน่วยวัด/ADAS/ตัวถัง-กระบะ) พร้อมกับดัก false equivalence ต่อโดเมน
- [x] 3 ทีมออกแบบอิสระ (Pragmatist/SKOS-lite/Reader-first) → กรรมการ 3 มุมมองตัดสิน → ผู้ชนะ: Pragmatist (ใช้ของเดิม `AliasMapping`/`EvidenceLink`/`Transmission.type+name` pattern ให้สุดก่อนสร้างใหม่)
- [x] 2 นักวิจารณ์ adversarial ตรวจกับหลักการ CARMETA + ตรวจกับ DB จริง — เจอ 7 blocker จริง (E_CVT ยุบ Toyota/Honda ผิดหลักการเอง, AliasMapping.evidenceSourceId ซ้ำซ้อนกับ EvidenceLink, Phase 0 "risk ศูนย์" ที่จริงพัง Brand Hub, Prisma relation ขาด ฯลฯ) — แก้ครบในสเปกฉบับสุดท้าย
- [x] เขียน `VOCABULARY.md` (schema changes + display rules + editorial rules + 5-phase migration plan + ชุดศัพท์ตั้งต้น + คำถามเหลือให้เบสตัดสิน)
- [x] เบสอนุมัติ ("ถ้าคิดว่าดีแล้วก็ทำเลย ตรวจสอบอีกทีตามวิสัยทัศน์เว็บ")

## ✅ Milestone 14: Apply ภาษากลาง Phase 0–4 (เสร็จ 2026-07-20)
- [x] Vision check กับ PRODUCT.md ก่อนลงมือ — เจอจุดสเปกต้องแก้จริง: `rideHeightClass` ย้ายจาก Derivative → Trim (ข้อมูลจริง Prerunner/4TREX ปนใน derivative เดียว)
- [x] Phase 0: `EntityType`/`DiscountType` enum (UPDATE ค่าเดิม 20 แถวก่อน ALTER ด้วย SQL มือ) + `AliasMapping.brandId` + **`MEDIA` enum ตอบคำถามค้างเบส** (ย้ายสื่อ 9 แถวออกจาก EDITORIAL) + แก้ `queries.ts:589`/`seed.ts`
- [x] Phase 1: rename SQL มือ (`*Raw` + **`maxPowerHp→maxPowerPs` ตอบคำถามค้างอีกข้อ**) + `FuelType`/`AspirationType` + backfill 9 เครื่อง + EvidenceLink 14 + แก้จุดรั่ว specLine 3 จุด + filter canonical
- [x] Phase 2: E-CVT split (HEV 5 รุ่นแยกจากแถว CVT ที่แชร์กับ ICE — สร้างแถวใหม่) + `CabType`(Derivative)/`RideHeightClass`(Trim) + DrivetrainType 4 subtype + `ChassisType`/`platformName` + Yaris Ativ `ECO_CAR→SUBCOMPACT` + Motor.layout + Battery.chemistry (unknown โดยตั้งใจ)
- [x] Phase 3: `gradeCode` 23 ตัวจาก notes + NEDC + สเปกชาร์จ AC/DC 2 แบต + `HybridArchitecture` (HEV=POWER_SPLIT known)
- [x] Phase 4: ตาราง `Feature`/`TrimFeature` + partial unique index (SQL มือ — ยืนยัน db push ไม่ลบ) — โครงเปล่า ยังไม่ seed ADAS
- [x] Infra: `PRISMA_CLI_DIRECT=1` flag ใน prisma.config.ts (CLI ใช้สายตรง 5432 — pooler ค้าง) · สคริปต์ทั้งหมดเก็บที่ `prisma/ops/` เป็น audit trail
- [x] verify: `prisma/ops/verify-vocab.ts` ผ่าน 24/24 ข้อ + lint/tsc/build ผ่าน + curl 5 หน้า (specLine ยังเป็นคำกลางล้วน · marketing อยู่ tooltip เท่านั้น · Brand Hub แหล่งอ้างอิงครบ) + screenshot จริง 2 หน้า
- [x] อัปเดต VOCABULARY.md: TL;DR อ่านง่ายสำหรับเบส (ฟีดแบ็ก "อ่านยาก") + สถานะ apply + จุดที่ต่างจากร่าง

## ถัดไป (ยังไม่เริ่ม)
- [ ] Seed ADAS 3 ฟีเจอร์แรก (AEB/ACC/LKA) — ต้อง research หลักฐานต่อ trim จาก toyota.co.th ก่อน (Phase 4 ต่อ)
- [ ] VOCABULARY Phase 5 backlog: legacy AWD/FOUR_WD subtype · motor type (PMSM) · ecoCarPhase รอหลักฐานภาษี
- [ ] Nameplate Hub (Generation + ภาพรวมราคา)
- [ ] Generation/Phase Profile (Phase/Trim/Variant + timeline)
- [ ] Trim/Variant Revision Profile (สเปก + ราคา + source/revision)
- [ ] Price Timeline (ราคาป้าย + ประวัติปรับราคา · append-only)
- [ ] Compare exact entity (กันเทียบคนละตลาด/ชนิดราคา)
- [ ] UI แสดง Source/Confidence/Freshness/Sample เป็น first-class (ตาม DESIGN.md)
