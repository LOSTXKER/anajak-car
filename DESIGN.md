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

## Tokens (baseline — ปรับผ่าน Tailwind v4 `@theme` ใน globals.css)
- **สี:** neutral scale (bg/surface/border/text) + accent 1 สี + semantic (success/warning/danger สำหรับ confidence/quality)
- **radius:** เล็ก–กลาง (เช่น 6–10px) สม่ำเสมอ
- **spacing:** สเกล 4px · card padding สม่ำเสมอ
- **font:** UI sans (เช่น Geist/Inter ที่ scaffold มา) · ตัวเลขใช้ `font-variant-numeric: tabular-nums`
- **dark mode:** รองรับตั้งแต่ต้น (neutral + accent ทำงานทั้ง 2 โหมด · ใช้ CSS variables / Tailwind dark:)

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
