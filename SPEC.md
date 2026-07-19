# CARMETA — SPEC (อะไรคือ "เสร็จ")

> เกณฑ์ที่ต้องจริงถึงเรียกว่าเสร็จ · AI verify ทุกข้อก่อนเคลม done · เปลี่ยน spec = แก้ที่นี่ก่อนเขียนโค้ด
> อ้างอิง: CARMETA_PRODUCT_OVERVIEW-3.md section 10 (MVP) + section 17 (เป้าหมาย Prototype)

## เป้าหมาย MVP (Public Database)
พิสูจน์ว่าสร้าง canonical database ที่แยกรถไทยถูกถึงระดับ Variant Revision, ผู้ใช้หาราคา/ประวัติ/หลักฐานได้ และเปรียบเทียบ exact entity ได้ — เริ่มจาก **1 แบรนด์ + 3–5 Nameplate** เชิงลึก

## เกณฑ์เสร็จ (acceptance — ติ๊กได้ ทดสอบได้)

### ข้อมูล (Data foundation)
- [ ] Schema ครอบ canonical taxonomy ครบ: Brand → MarketPresence → Nameplate → Generation → Derivative → Phase → Trim → VariantRevision (+ powertrain + evidence + price + change)
- [ ] Seed จริง 1 แบรนด์ + 3–5 Nameplate: ทุก Generation ระดับภาพรวม · Current + Previous generation ลึกถึง Phase/Trim/Variant Revision
- [ ] ครอบ 3 รูปแบบกัน schema overfit: ICE หลายตัวถัง · กระบะ/PPV · EV
- [ ] ราคามือหนึ่ง (OfficialPriceObservation) + Change event + Evidence source ครบทุก entity ที่เผยแพร่
- [ ] ทุก fact สำคัญ (ราคา/การเปลี่ยนแปลง) ผูก `EvidenceSource` ที่มี source/วันที่/confidence (evidence-first 100%)

### หน้าเว็บสาธารณะ (doc section 7)
- [ ] Car Market Database — ค้นหาจาก Brand/Nameplate/Generation/Trim/Powertrain/ช่วงราคา · แยกรถปัจจุบัน/เลิกจำหน่าย
- [ ] Brand Hub — ประวัติแบรนด์ในไทย + Nameplate + Generation tree
- [ ] Nameplate Hub — ทุก Generation + ช่วงเวลาจำหน่าย + ภาพรวมราคา
- [ ] Generation / Phase Profile — Phase/Trim/Variant Revision ในเจเนอเรชัน + การเปลี่ยนแปลงตามเวลา
- [ ] Trim / Variant Revision Profile — สเปก/powertrain/ราคา + ช่วงเวลาที่มีผล + Source & revision history
- [ ] Change Timeline — เปิดตัว/facelift/เปลี่ยนสเปก/ปรับราคา/recall/เลิกขาย พร้อมค่าก่อน–หลัง + วันที่ + source
- [ ] Compare ระดับ Exact entity (Generation/Phase/Trim/Variant Revision) — กันเทียบคนละตลาด/คนละชนิดราคาโดยไม่แจ้ง

### คุณภาพ / ความน่าเชื่อถือ (doc 7.9 + 10.3)
- [ ] ทุกหน้าข้อมูลแสดง Source / Effective date / Checked date / ขอบเขตหลักฐาน
- [ ] แยกชนิดราคาชัด (ป้ายมือหนึ่ง / โปร / ประกาศมือสอง / ซื้อขายจริง) — ไม่ปะปน
- [ ] ค่าที่ไม่มีข้อมูลแสดงเป็น "ไม่มีข้อมูล/ยังสรุปไม่ได้" (ไม่ใช้ 0 แทน)

## นอกขอบเขต (กัน scope creep — doc 10.1 / 16)
- Marketplace · Payment · Transaction ที่ไม่มีแหล่งข้อมูล
- AI Advisor · Fit Advisor · Decision report
- Account เต็มรูปแบบ · Watchlist alert · Digital Garage · Partner feed · Data API
- Derived intelligence เต็ม (Depreciation/TCO/Fair Price/Market index) — เริ่มเก็บ snapshot ได้ แต่ยังไม่คำนวณเผยแพร่
- ราคามือสองแบบสรุปตลาด (ต้องผ่าน sample/freshness gate ก่อน — ดู PhysicalVehicle/Listing = โครงพร้อม ยังไม่สรุปตลาด)
