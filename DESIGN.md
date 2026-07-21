# CARMETA — DESIGN (หลักการ + token + สถานะปัจจุบัน)

> AI ยึดก่อนงาน UI · เว็บ data-dense ที่ต้อง "อ่านง่าย เชื่อถือได้ ทันสมัย"
> ~~ธีม: minimal ทันสมัยแบบ apple / tesla · ยืมโครง data-tracker แต่ไม่ลอกหน้าตา~~ → **เบสเปิดทิศใหม่ 2026-07-21: อยากได้แนว data-tracker / market-data จริงๆ** (ดู §ทิศทางรอบใหม่ ล่างสุด — รอ mockup เทียบก่อน implement)

## ⚠️ กติกาของไฟล์นี้ (อ่านก่อนแก้ — กัน design space หดจนงานจืด)
- ไฟล์นี้เก็บ 3 อย่างเท่านั้น: **หลักการถาวร · token · สถานะปัจจุบัน** — ไม่ใช่สมุดจดคำห้าม
- ฟีดแบ็กรายรอบของเบส ("ไม่เอา X") = ปรับงานรอบนั้น + อัปเดต §สถานะปัจจุบัน เป็น "ตอนนี้ใช้ A (เลือกแทน B · วันที่)" — **ห้ามจดเป็นข้อห้ามถาวร** ("ห้าม…ตลอดกาล/ห้ามใส่กลับ") · ประวัติฟีดแบ็กละเอียด → PROGRESS.md/git log ไม่ใช่ที่นี่
- ทุกข้อใน §สถานะปัจจุบัน **ทบทวนได้เมื่อเบสเปิดทิศใหม่** · จะเสนอของที่เบสเคยปัดตก → เสนอได้ แต่บอกตรงๆ ว่าเคยปัดเมื่อไหร่ ให้เบสตัดสิน — ไม่เงียบใส่กลับ
- **งาน UI ทิศใหม่/redesign → ทำหน้าเทียบ 2-3 ทิศให้เบสเห็นภาพจริงก่อน แล้วค่อย implement ทิศที่เบสเลือก** (ห้าม implement ทิศเดียวจากคำบรรยาย)

## หลักการภาพ (ถาวร)
1. **Minimal + data-dense** — ข้อมูลแน่นแต่ไม่รก · ใช้ whitespace + ลำดับชั้น (hierarchy) แยกกลุ่มข้อมูล
2. **Neutral palette + accent เดียว** — พื้นเทา/ขาว-ดำเป็นหลัก · สีเน้น 1 สีสำหรับ action/ค่าเด่น (ไม่ใช้สีจัดหลายสีแข่งกัน)
3. **Typography คม อ่านง่าย** — sans-serif · ตัวเลข tabular (align ราคา/สเปกเป็นคอลัมน์) · น้ำหนักตัวอักษรแยก label/value ชัด
4. **ข้อมูลนำ ภาพเสริม** — ไม่ใส่กราฟ/ภาพประกอบเกินจำเป็น · ไม่ skeuomorphic ไม่ฉูดฉาด

## Evidence-first เป็น first-class UI (หัวใจ CARMETA — ต่างจากเว็บรถทั่วไป)
ทุกครั้งที่แสดงตัวเลข/ข้อเท็จจริงสำคัญ ต้องแสดง (หรือเข้าถึงได้ทันที):
- **Source** — มาจากไหน (ผู้ผลิต/รัฐ/marketplace) + ลิงก์/อ้างอิง
- **Freshness** — Checked date / Effective date ("ข้อมูล ณ วันที่…")
- **Confidence** — high/medium/low (แสดงเป็น badge/สีอ่อน)
- **Sample** — ราคามือสองต้องบอกจำนวนตัวอย่าง + cohort ("จาก N ประกาศ")
- **สถานะข้อมูล** — ค่าที่ไม่มี = "ไม่มีข้อมูล / ยังสรุปไม่ได้" (ไม่โชว์ 0 ปลอม · map จาก `DataStatus`)
- แยกชนิดราคาให้เห็นชัด (ป้ายมือหนึ่ง ≠ โปร ≠ ประกาศมือสอง ≠ ซื้อขายจริง) — ใช้ label/สี/ตำแหน่งต่างกัน

## Tokens (baseline — ground truth จริงอยู่ที่ Tailwind v4 `@theme` ใน globals.css)
- **สี:** light = พื้นขาวล้วน (#ffffff) · dark = เทาเข้มแบบ GitHub/Linear (#17181c ไม่ดำสนิท) + accent "Royal Softened" (#2f56c9 / dark #7c9dfa — จากตระกูลสีโลโก้) + semantic (success/warning/danger สำหรับ confidence/quality)
- **ลดกล่องการ์ด:** แยกชั้นข้อมูลด้วย whitespace + เส้นแบ่งบาง (`divide-y`/`border-t`) แทนกล่องมีกรอบ · ใช้พื้น `surface-muted` เฉพาะ element ที่ต้องการ affordance (ปุ่ม/pill/tile ที่กดได้)
- **radius:** ปุ่ม/pill/ตัวกรอง = `rounded-full` · การ์ด/ตาราง/รูป = `rounded-2xl` (16px)
- **ตัวกรอง:** dropdown select แบบมาตรฐานเว็บตารางข้อมูล — state ที่เลือกแสดงเป็นสี accent บนตัวปุ่ม
- **spacing:** สเกล 4px · padding สม่ำเสมอ
- **font:** UI sans (Geist + Noto Sans Thai) · ตัวเลขใช้ `font-variant-numeric: tabular-nums`
- **dark mode:** รองรับตั้งแต่ต้น (CSS variables + data-theme toggle)

## หลักการนำเสนอข้อมูล (สำคัญกว่าการตกแต่ง)
- **หนึ่งหน้า หนึ่งพระเอก:** หน้ารายละเอียดรถ พระเอกคือ "ราคา" — ช่วงราคาแสดงตัวใหญ่ระดับ display, อย่างอื่นถอยเป็นฉากหลัง
- **บันไดราคา:** รุ่นย่อยเรียงราคาต่ำ→สูง แต่ละขั้นแสดง **"+ส่วนต่างจากขั้นก่อน"** — ตอบคำถามจริงของคนซื้อ ("จ่ายเพิ่มเท่าไหร่ได้อะไร")
- **สเปกเป็นประโยคเดียว:** "ดีเซล · 204 PS · อัตโนมัติ 6 สปีด · 4WD" ในบรรทัดเงียบๆ ใต้ชื่อรุ่น ไม่แตกหลายคอลัมน์
- **ความเชื่อมั่นพูดครั้งเดียว:** ถ้าทุกราคาอ้างแหล่ง/ระดับเดียวกัน → สรุปประโยคเดียวต่อหน้า ไม่ติดป้ายซ้ำทุกแถว · ป้ายรายแถวเฉพาะเมื่อต่างกันจริง
- **อย่าใส่ข้อมูลซ้ำ:** ค่าที่ซ้ำทุกแถว (วันที่/แหล่งเดียวกัน) ยกขึ้นพูดที่ระดับ section

## สถานะปัจจุบัน (โครงที่เลือกแล้ว ณ 2026-07-20 — ทบทวนได้เมื่อเบสเปิดทิศใหม่)
- **ทิศ visual บนโค้ด main (M21):** minimal โทนเดิม T3 · ~~ทิศ M22-M24 (sidebar prydwen + Apple polish)~~ ถูกรื้อออกจาก main แล้ว (เก็บที่ branch `archive/m22-m24-sidebar-apple`) · ทิศที่ลองแล้วเบสไม่เอา (07-20): op.gg tracker เต็มตัว (T1) · panel dashboard (T2)
- **Hero หน้าแรก = search-first:** ช่องค้นหาใหญ่คือพระเอก + ใต้ช่อง = ชิปหมวดที่ผูก filter จริงเท่านั้น · hero จบที่ชิป (เบสตัดข้อความใต้ชิป — จำนวนรุ่น/คำเคลมแหล่ง/วันที่ตรวจ — ออก 07-20) · ส่งเงื่อนไขเข้าตารางผ่าน URL param (`?q=/&body=/&pt=/&cap=`) แชร์ลิงก์ผลกรองได้ · ช่องค้นหาในตารางซ่อนบนหน้าแรก
- **ตารางหน้าแรก = รุ่นรถล้วน:** แถวรุ่นคลิก = เข้า `/cars/[slug]` (ที่เดียวที่แสดงรุ่นย่อย/บันไดราคา) · คอลัมน์ท้าย "x รุ่นย่อย ›" บอกความลึก · ค้นหายังครอบชื่อรุ่นย่อย (variantRows เป็น haystack) · คอลัมน์น้อย (# · รุ่น · ราคาเริ่มต้น · ประเภท · ขุมพลัง · รุ่นย่อย▾) · ราคาแถวสรุป = "เริ่มต้น" ตัวเดียว · เนื้อหาหลัก ≥14px, meta ≥13px · ของที่ลองแล้วเบสไม่เอา: แถวกดกางรุ่นย่อย · PriceBar หลอดราคาในตาราง · ช่วง min–max ในแถวสรุป · แบรนด์จางใต้ชื่อรายแถว
- **ตอนนี้ไม่ใช้ (เบสเลือกทาง minimal 07-19):** gradient · aurora/เอฟเฟกต์พื้นหลัง · แอนิเมชันเข้าฉาก · ไอคอนประดับหัว section · ฟอนต์นอกจาก Geist+Noto Sans Thai

## Component ที่คาดว่าใช้ซ้ำ (สร้างเมื่อถึงตา — อย่าสร้างล่วงหน้า)
- `EntityBreadcrumb` (Brand › Nameplate › Generation › Trim › Variant)
- `PriceCard` (จำนวน + ชนิดราคา + source + วันที่)
- `EvidenceBadge` / `ConfidenceBadge` / `FreshnessTag` / `SampleTag`
- `SpecTable` (label/value + สถานะข้อมูล) · `ChangeTimeline` · `CompareTable` (exact entity)
- `DataStatusValue` (แสดงค่า หรือ "ไม่มีข้อมูล" ตาม DataStatus)

## กติกา
- responsive · เข้าถึงได้ (contrast ผ่าน · aria สำหรับ table/badge)
- อย่า over-engineer ตอนต้น — วาง token + component เท่าที่หน้าใช้จริง

## ⚠️ บทเรียนเครื่องมือตรวจภาพ (กันวินิจฉัยผิดซ้ำ — เจ็บมาแล้ว 2026-07-20)
- **Chrome headless บังคับความกว้างขั้นต่ำ 500px** — `--window-size=390` ได้ viewport 500 จริง (`innerWidth=500`) แล้ว crop ภาพเหลือ 390 → ทุกอย่างดู "เบ้ซ้าย-ตัดขวา" เหมือน layout พังทั้งที่ไม่พัง · ตรวจ mobile < 500px ต้องใช้ **iframe harness** (หน้า HTML กว้าง ≥500 มี `<iframe width=390>` ชี้ localhost แล้ว screenshot ทั้งหน้า) หรือ CDP `Emulation.setDeviceMetricsOverride`
- ก่อนสรุปว่า "layout พัง" จาก screenshot: เช็ค `innerWidth` จริงก่อนเสมอ (inject script วัดในหน้า repro)

## 🧭 ทิศทางรอบใหม่ (เบสชี้ 2026-07-21 — ยังไม่ implement · ต้องทำ mockup เทียบก่อน)
เบสส่ง reference 7 เว็บ "อยากได้ประมาณนี้":
- https://www.dotabuff.com · https://dota2protracker.com · https://op.gg/lol/champions · https://tracker.gg/lol (เกม stat-tracker)
- https://www.prydwen.gg/star-rail (game wiki/DB)
- https://www.coinbase.com/explore · https://coinmarketcap.com (ตารางตลาด: ราคา + %เปลี่ยนแปลง เขียว/แดง + sparkline)

**สิ่งที่ 7 เว็บมีร่วมกัน (observation — ให้ mockup รอบใหม่ใช้):** ตาราง/กริดข้อมูลแน่นเป็นพระเอกตั้งแต่ fold แรก · ตัวเลข + %change สีเขียว/แดง + sparkline ต่อแถว · dark theme เป็นหลัก · nav แบบ utilitarian (sidebar/top-bar เรียบ) · หน้า entity ลึกมี stat block ใหญ่
**นัยต่อของเดิม:** ทิศ "Apple minimal" และกฎ "ยืมโครงแต่ไม่ลอกหน้าตา tracker" = **superseded** · โครง sidebar แบบ prydwen เคยลองแล้ว (M22-M24 — ถูกรื้อออกจาก main ตอนตัดสินใจทำ car2 · เก็บกันหายที่ branch `archive/m22-m24-sidebar-apple`) — เบสยังชี้ prydwen ใน reference → ให้ mockup ตัดสินว่าฟื้นท่าไหน ไม่เดาเอง
**สถานะโค้ดบน main ตอนนี้ = M21** (hero search-first + ตารางรุ่นรถล้วน + ADAS) — §สถานะปัจจุบันด้านบนตรงกับโค้ดนี้
**ขั้นต่อไป (ตามกติกาหัวไฟล์):** ทำหน้าเทียบ 2-3 ทิศจาก reference จริง (เช่น A=op.gg/dotabuff stat-tracker · B=coinmarketcap market table · C=prydwen wiki hybrid) → เบสเลือก → ค่อย implement ทั้งเว็บ
