# CARMETA — PRODUCT (กลยุทธ์/positioning สำหรับตัดสินใจตอนสร้าง)

> ย่อจาก CARMETA_PRODUCT_OVERVIEW-3.md — ใช้เป็นเลนส์ตัดสินใจตอนออกแบบฟีเจอร์/UI
> แผนธุรกิจเต็ม (revenue/roadmap/coverage) อยู่ที่ bestos `records/projects/anajak-car/`

## คืออะไร (หนึ่งประโยค)
ฐานข้อมูลรถไทยที่ลึก ตรวจสอบได้ อัปเดตต่อเนื่อง → กลายเป็น "แหล่งอ้างอิงก่อนซื้อรถ"

## Positioning
- **เป็น data product** ไม่ใช่เว็บรีวิว / เว็บบทความ / เว็บประกาศขายรถ
- คำสัญญา: รถใน Coverage มีประวัติ/เจเนอเรชัน/การเปลี่ยนแปลง/ราคา ครบตามหลักฐานที่ตรวจสอบได้
- ลำดับผลิตภัณฑ์: (1) Car Database → (2) Price Tracker → (3) Compare/Research → (4) Ownership/Marketplace (ตามหลัง trust)

## หลักคิดจาก data-tracker (ยืม "แนวคิด" ไม่ลอกหน้าตา)
6 แกน: **Entity · Version · Cohort · History · Sample · Freshness**
| data tracker | CARMETA |
|---|---|
| Hero/Champion | Nameplate / Generation / รุ่นย่อย |
| Patch/Version | Generation, Facelift, ช่วงสเปก, การปรับราคา |
| Build | Trim, Powertrain, ชุดอุปกรณ์ |
| Match history | Price observation, Listing snapshot, Change event |

## Anti-references (แรงบันดาลใจโครงสร้าง — ห้ามลอก UI)
- dotabuff / dota2protracker / op.gg / tracker.gg — entity DB + history + cohort/sample/freshness + repeat-use loop
- JATO (automotive spec business) · KBB (price range + methodology)
- ⚠️ ยืม "วิธีจัดโครงข้อมูล + แสดง context/sample/freshness" ไม่ใช่หน้าตา · ธีมของเรา = minimal ทันสมัยแบบ apple/tesla (ดู DESIGN.md)

## กฎเหล็กของผลิตภัณฑ์ (ห้ามละเมิดตอนสร้าง)
- ไม่ประกาศ "รถคันไหนดีที่สุด" ด้วยคะแนนเดียว (รถไม่มี win rate เป็นกลาง)
- ไม่เรียกราคาประกาศว่า "ราคาซื้อขายจริง" · ไม่รวมรถคนละ cohort เพื่อเพิ่ม sample
- ไม่สร้างประวัติราคาย้อนหลังจากการเดา · ไม่ใช้ AI เติมข้อมูลที่ไม่มีหลักฐาน
- ไม่เปิดหน้า thin (ข้อมูลไม่ครบ) เพื่อเพิ่มจำนวนหน้า
- Depth before breadth — ลึกและเชื่อถือได้ก่อนขยาย

## เป้าหมายที่ prototype ต้องพิสูจน์
สร้าง canonical database ที่แยกรถไทยถูกถึง Variant Revision · ผู้ใช้แยก Generation/Phase/Trim/Powertrain + หาราคา/ประวัติ/source ได้ · แยกชนิดราคาได้ · รักษา completeness/accuracy/freshness/rights ภายใต้ต้นทุนที่ไหว
