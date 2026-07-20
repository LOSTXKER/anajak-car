# CARMETA — สเปกระบบภาษากลาง (Canonical Vocabulary)

> สถานะ: **apply แล้ว Phase 0–4 (2026-07-20) — เบสอนุมัติ "ทำเลย" · verify ผ่าน 24 ข้อกับ DB จริง + เปิด 5 หน้าเว็บตรวจจริง**
> อ้างอิงหลักการ CARMETA ทั้ง 6 ข้อใน `AGENTS.md` ตลอดเอกสารนี้ — ไม่ทวนซ้ำในทุกหัวข้อ
> ผ่านกระบวนการ: 5 นักวิจัยศัพท์ตลาดไทยจริง → 3 ทีมออกแบบอิสระ → กรรมการ 3 มุมมอง → 2 นักวิจารณ์ adversarial (เจอ 7 blocker — แก้ครบ) → apply จริงพร้อม verify

## 🎯 สรุปสั้นสำหรับเบส (อ่านแค่นี้ก็พอ)

**ปัญหา:** แต่ละยี่ห้อเรียกของอย่างเดียวกันคนละชื่อ (เกียร์ออโต้ Isuzu เรียก "Rev Tronic", Ford เรียก "SelectShift") และบางทีชื่อเดียวกันเป็นของคนละอย่าง (Toyota กับ Honda ใช้คำว่า "E-CVT" ทั้งคู่ แต่ข้างในคนละระบบ) — ถ้าไม่จัดระเบียบ พอเพิ่มยี่ห้อที่ 2 ตัวกรองในเว็บจะพัง เทียบข้ามยี่ห้อไม่ได้

**ทางแก้ที่ทำแล้ว:** ทุกเรื่อง (เชื้อเพลิง เทอร์โบ เกียร์ ขับเคลื่อน แค็บกระบะ ฯลฯ) เก็บข้อมูล 2 ชั้น —
1. **คำกลาง** ที่เว็บใช้แสดง/กรอง/เทียบ (เช่น "ดีเซล", "E-CVT", "กระบะแค็บ") — มาจากรายการที่ล็อกไว้ ไม่ใช่ใครพิมพ์อะไรก็ได้
2. **ชื่อที่ยี่ห้อเรียกจริง** เก็บไว้ครบ ไม่ทิ้ง (เช่น "VN Turbo + Intercooler") — โชว์เป็นข้อมูลรอง (tooltip)
และทุกการจัดหมวดมี **หลักฐานแนบ** เหมือน fact อื่น · ไม่รู้ = บันทึกว่าไม่รู้ ไม่เดา

**สิ่งที่ได้ทันที:** ตัวกรองหน้าเว็บไม่พังเมื่อเพิ่มยี่ห้อใหม่ · แยก HEV ที่เคยบันทึกผิดเป็นเกียร์ CVT ธรรมดา 5 รุ่นให้ถูกต้อง · กรองกระบะข้ามยี่ห้อได้ (ตอนเดียว/แค็บ/4 ประตู · ยกสูง Prerunner ≠ 4WD) · รหัสรุ่นทางการ 23 ตัวถูกดึงจาก notes มาให้ค้นหาได้ · หน้าเว็บหน้าตาเหมือนเดิมทุกอย่าง (ตั้งใจ — ข้อมูลใต้พื้นดีขึ้น ไม่ใช่หน้าเปลี่ยน)

**ที่ยังไม่ทำ (รอรอบหน้า):** ข้อมูล ADAS (ระบบช่วยขับ) — โครงตารางพร้อมแล้วแต่ต้อง research หลักฐานจริงต่อรุ่นก่อนใส่ · ดูรายละเอียดที่ "สถานะการ apply" ท้ายไฟล์

---

## 1) ปัญหาและหลักคิด

**ปัญหา:** แต่ละแบรนด์ตั้งชื่อการตลาดของ "สิ่งเดียวกันโดยประมาณ" ไม่เหมือนกัน (เกียร์อัตโนมัติทอร์กคอนเวอร์เตอร์ของ Isuzu เรียก Rev Tronic, ของ Ford เรียก SelectShift) และในบางกรณี **ชื่อเดียวกันกลับหมายถึงกลไกคนละอย่าง** (Toyota "E-CVT" คือ power-split, Honda "e-CVT" คือ direct-drive แบบคลัตช์ล็อกเกียร์เดียว — ไม่ใช่ CVT สายพานทั้งคู่ และไม่ใช่กลไกเดียวกันด้วย) วันนี้ CARMETA มีแบรนด์เดียว (Toyota) ปัญหานี้ยังไม่ระเบิด แต่ฝังเป็นบั๊กรอวันแบรนด์ที่ 2 มาถึงแล้วในโค้ดที่มีอยู่แล้ว:

- `src/lib/queries.ts:218` — `engine.fuelType` (free text ดิบ) ไหลตรงเข้า `engineText`
- `src/lib/labels.ts:83` — `powertrainLabel()` กรณี ICE **คืนค่า `fuelType` ดิบตรงๆ** ไม่ผ่าน normalize ใดๆ
- `src/lib/queries.ts:219` — `aspiration !== "NA"` เทียบ string ตรงตัว — แบรนด์อื่นเขียน "N/A"/"ไม่มี" จะหลุดเงื่อนไข
- `src/lib/queries.ts:261` — `transmissionText = transmission.name ?? transmission.type` เคสเกียร์ที่ไม่ match enum ที่รู้จัก จะดึงชื่อการตลาดดิบเข้า specLine ตรงๆ อยู่แล้ว
- `src/components/car-database-explorer.tsx:140` — ตัวกรองขุมพลังสร้างจาก `[...new Set(rows.flatMap(r => r.powertrainLabels))]` คือ **สร้าง filter จาก free text โดยตรง** — พิมพ์ "ดีเซล" vs "Diesel" vs "ดีเซล เทอร์โบ" จะกลายเป็น 3 ตัวเลือกที่แยกกัน ทั้งที่ควรเป็นตัวเดียว
- `src/lib/queries.ts:589` + `src/app/brands/[slug]/page.tsx:111` — Brand Hub อ่าน `EvidenceLink` ด้วย `entityType: "Brand"` เป็น string ดิบ ไม่มี type safety กันพิมพ์ผิด

**หน้าเว็บที่มีอยู่จริงวันนี้ (5 หน้า ไม่ใช่ 4 — นับผิดจุดนี้ในร่างแรก แก้แล้ว):** หน้าแรก `/` (2 มุมมอง: รุ่นรถ/รุ่นย่อย) · `/cars/[slug]` (บันไดราคา) · `/brands` (เลือกยี่ห้อ) · `/brands/[slug]` (Brand Hub — **ใช้ `CarDatabaseExplorer` ตัวเดียวกับหน้าแรกเป๊ะ** จึงโดนบั๊ก free-text filter เดียวกันทุกจุด แต่มักถูกลืมตรวจเพราะไม่ใช่หน้าแรก)

**หลักคิด (ยึดตลอดเอกสาร):**

1. **ใช้ของเดิมก่อนสร้างใหม่** — `Transmission.type/name`, `Drivetrain.type/name`, `AliasMapping`, `EvidenceLink`, `Trim.standardName`, `DataStatus` มีอยู่แล้วและออกแบบมาถูกทางอยู่แล้ว งานนี้คือ "เปิดใช้งานจริง" ไม่ใช่ "คิดกลไกใหม่คู่ขนาน"
2. **แยกกลไกจริง (canonical) ออกจากชื่อการตลาด (marketing) เสมอ** — canonical ใช้กรอง/เทียบ/แสดงเป็นตัวหลัก · ชื่อการตลาดเก็บไว้เต็ม ไม่ทิ้ง แสดงเป็นข้อมูลรอง
3. **ห้ามยุบของไม่เหมือนกัน แม้ชื่อจะคล้ายกัน** — Toyota E-CVT ≠ Honda e-CVT · AWD full-time ≠ AWD on-demand · Prerunner (ยกสูง 2WD) ≠ 4WD — กฎนี้บังคับใช้กับตัว enum ที่ออกแบบเองด้วย ไม่ใช่แค่กับ input จากผู้ใช้ (ดู §2.1 กรณี E-CVT ที่ร่างแรกละเมิดกฎนี้เอง)
4. **ไม่รู้ = unknown เสมอ ห้ามเดา** — ทุกฟิลด์ canonical ใหม่มาคู่กับ `DataStatus` เป็นของตัวเอง **หนึ่งฟิลด์ค่าต่อหนึ่งฟิลด์สถานะ** ไม่ใช้ status ตัวเดียวคุมหลายฟิลด์ที่มาจากแหล่ง/เวลารู้ต่างกันได้ (เช่น NEDC/WLTP/CLTC ต้องมี status แยกคนละตัว ไม่ใช่ `rangeStatus` รวม)
5. **แก้แบบไม่ทำลายของเดิม** — ห้ามเขียนทับ free text ที่มีอยู่ (เปลี่ยนชื่อเป็น `*Raw` แล้วเติม enum ข้างๆ) ห้ามบังคับ reclassify แถวเก่าที่ยังไม่มีหลักฐานยืนยัน **ข้อยกเว้นเดียว:** การ rename คอลัมน์เดิม → `*Raw` (Phase 1) คือ "ย้ายชื่อ ไม่ใช่ทำลายข้อมูล" ต้องทำผ่าน SQL `RENAME COLUMN` มือ ไม่ใช่ปล่อยให้ `prisma migrate dev` เดา diff เอง (ดู §5 คำเตือนสำคัญ)
6. **ค่า enum ใหม่ทุกค่ามาคู่กับสคริปต์ backfill/reclassify ของแถวเก่าที่กระทบจริงในเฟสเดียวกันเสมอ** — ห้ามเพิ่มค่าเฉยๆ แล้วปล่อยแถวเก่าที่รู้อยู่แล้วว่าจัดผิดค้างต่อไป (กฎนี้ยึดทั้งกับ `TransmissionType` และ `Segment.ECO_CAR` — ร่างแรกใช้กฎนี้ไม่ครบ แก้แล้วใน §5)

---

## 2) โครงสร้างข้อมูล

แนวทาง: **2 ชั้น + จุดที่ยอมสร้างของใหม่จริงเท่าที่พิสูจน์ได้ว่าจำเป็น** (ไม่ใช่ตารางศัพท์กลางตัวเดียวครอบทุกโดเมนแบบ SKOS — ปัดตกเพราะงานนี้ยังไม่มีข้อมูลแบรนด์ที่ 2 พิสูจน์ความจำเป็น ดู §7)

### 2.0 ฐานราก (governance) — ทำก่อนสิ่งอื่นทั้งหมด

`AliasMapping.entityType` และ `EvidenceLink.entityType` เป็น `String` อิสระ พิมพ์ผิดแล้ว join เงียบหาย — ล็อกเป็น enum ก่อนเริ่มใช้งานจริงหนักขึ้น

**⚠️ ข้อมูลจริงที่ต้อง backfill ก่อน ALTER COLUMN (ตรวจกับ `prisma/seed.ts` แล้ว — ร่างแรกอ้างผิดว่า "risk ศูนย์"):** `EvidenceLink.entityType` มีค่าอยู่แล้วจริง **2 ค่า** ไม่ใช่ค่าเดียว — `"Brand"` (สร้างที่ `seed.ts:82` ต่อ key ใน `brandEvidenceKeys`) และ `"Generation"` (สร้างที่ `seed.ts:215` ต่อ key ใน `gen.evidenceKeys`) ทั้งคู่เป็น PascalCase ต่างจาก enum label ที่จะเป็น ALL-CAPS ตาม Prisma convention — ถ้า `ALTER COLUMN ... TYPE "EntityType"` โดยไม่ `UPDATE` ค่าเดิมก่อน migration จะ error ทันที และ `AliasMapping` มี 0 แถวจริง (ปลอดภัย ไม่ต้อง backfill)

```prisma
enum EntityType {
  BRAND
  MARKET_PRESENCE
  NAMEPLATE
  GENERATION
  DERIVATIVE
  PHASE
  TRIM
  TRIM_FEATURE          // เผื่อ §2.3 (Phase 4)
  VARIANT_REVISION
  ENGINE
  MOTOR
  BATTERY
  TRANSMISSION
  DRIVETRAIN
  PROMOTION_OBSERVATION
  ALIAS_MAPPING          // ใหม่ — ให้ AliasMapping ผูกหลักฐานผ่าน EvidenceLink แบบเดียวกับ entity อื่นทุกตัว (ดูเหตุผลด้านล่าง)
  OTHER
}

model AliasMapping {
  entityType EntityType   // เดิม: String
  entityId   String
}

model EvidenceLink {
  entityType EntityType   // เดิม: String
  entityId   String
}
```

**Migration step บังคับก่อน ALTER COLUMN (Phase 0):**
```sql
UPDATE "EvidenceLink" SET "entityType" = 'BRAND' WHERE "entityType" = 'Brand';
UPDATE "EvidenceLink" SET "entityType" = 'GENERATION' WHERE "entityType" = 'Generation';
-- แล้วค่อย ALTER COLUMN "entityType" TYPE "EntityType" USING ("entityType"::"EntityType")
```

`PromotionObservation.discountType` มี comment ระบุค่าไว้แล้ว ("เงินสด / ของแถม / ดอกเบี้ย") แสดงเจตนาเดิมคือ enum และตาราง `PromotionObservation` ยังไม่มีข้อมูลจริง — ล็อกตอนนี้ราคาถูก:

```prisma
enum DiscountType { CASH GIFT INTEREST_RATE OTHER }

model PromotionObservation {
  discountType DiscountType?   // เดิม: String?
}
```

**`AliasMapping` — ขยาย ไม่สร้างตารางใหม่ ไม่สร้าง FK หลักฐานคู่ขนาน:** เพิ่ม `brandId` (nullable FK→Brand — บันทึกว่า "แบรนด์ไหนเรียก alias นี้" เพื่อ query เร็วโดยไม่ต้องไล่ FK chain ทุกครั้ง) **แต่ไม่เพิ่ม `evidenceSourceId` แยกต่างหาก** — ร่างแรกทำแบบนั้นและเป็นการสร้างเส้นทาง "ผูกหลักฐานกับ entity" คู่ขนานกับ `EvidenceLink` ที่มีอยู่แล้วโดยไม่จำเป็น (ขัดหลักการข้อ 1) แก้แล้วโดยให้ `AliasMapping` ผูกหลักฐานผ่าน `EvidenceLink(entityType=ALIAS_MAPPING, entityId=<aliasMapping.id>, field="mapping")` เหมือน entity อื่นทุกตัว:

```prisma
model AliasMapping {
  id              String      @id @default(cuid())
  alias           String
  normalizedAlias String?
  language        String?
  sourceContext   String?
  entityType      EntityType
  entityId        String
  brandId         String?     // ใหม่ — บังคับกรอกทาง editorial เมื่อ alias คือชื่อการตลาด (ดู §4) — ⚠️ denormalized จาก FK chain จริง (Trim→Phase→Derivative→Generation→Nameplate→Brand) เพราะ entityId เป็น polymorphic pointer ที่ DB บังคับ FK ตรงไม่ได้ ต้อง validate ระดับ application ว่า brandId ที่กรอกตรงกับ brand จริงของ entity ที่ entityId ชี้ไป ก่อน save ทุกครั้ง (ไม่มีการบังคับระดับ DB)
  confidence      Confidence?
  note            String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  brand Brand? @relation(fields: [brandId], references: [id])

  @@index([entityType, entityId])
  @@index([normalizedAlias])
  @@index([brandId])
}

model Brand {
  // ... field เดิมทั้งหมดคงอยู่
  aliasMappings AliasMapping[]   // ใหม่ — back-relation บังคับของ Prisma (validate แล้วด้วย npx prisma validate)
}
```

### 2.1 ชั้น 1 — Attribute vocabulary (ค่าที่ไม่มี id เป็นของตัวเอง เทียบข้ามแบรนด์ด้วย "ประเภท")

หลักแพตเทิร์นเดียวใช้ซ้ำทุกจุด (ตามที่ `Transmission.type/name` และ `Drivetrain.type/name` ทำไว้แล้ว): **`xxxRaw` (ข้อความเดิม/การตลาด ไม่ทิ้ง) + `xxx` (enum canonical ใหม่) + `xxxStatus: DataStatus` แยกเป็นของตัวเอง**

| Model.field เดิม | เปลี่ยนเป็น | Enum ใหม่ |
|---|---|---|
| `Engine.fuelType` (String) | `fuelTypeRaw` + `fuelType: FuelType?` + `fuelTypeStatus` | `FuelType` |
| `Engine.aspiration` (String) | `aspirationRaw` + `aspiration: AspirationType?` + `aspirationStatus` | `AspirationType` |
| `Motor.location` (String) | `locationRaw` + `layout: MotorLayout?` + `layoutStatus` | `MotorLayout` |
| `Battery.chemistry` (String) | `chemistryRaw` + `chemistry: BatteryChemistry?` + `chemistryStatus` | `BatteryChemistry` |

```prisma
enum FuelType { DIESEL GASOLINE OTHER }

enum AspirationType { NA TURBO TWIN_TURBO SUPERCHARGED OTHER }

enum MotorLayout { FRONT REAR DUAL OTHER }
// หมายเหตุ deferred: ชนิดมอเตอร์ (PMSM/induction) ที่ปนอยู่ใน locationRaw วันนี้ ("front eAxle, PMSM")
// ยัง "ไม่" canonicalize รอบนี้ — จงใจเลื่อน ไม่ใช่หลุด (ดู §7)

enum BatteryChemistry { NMC LFP OTHER }   // Blade Battery ของ BYD = ชื่อแพ็ก LFP ไม่ใช่เคมีแยก — map เข้า LFP ผ่าน AliasMapping ไม่ใช่ enum ใหม่

model Engine {
  fuelTypeRaw    String?     // เดิมชื่อ fuelType
  fuelType       FuelType?
  fuelTypeStatus DataStatus  @default(unknown)
  fuelGradeNote  String?     // "รองรับ E20" ฯลฯ — สเปกเสริม คนละมิติกับชนิดเชื้อเพลิง ห้ามยุบรวม
  aspirationRaw    String?   // เดิมชื่อ aspiration — "VN Turbo + Intercooler"
  aspiration       AspirationType?
  aspirationStatus DataStatus @default(unknown)
}

model Motor {
  locationRaw  String?        // เดิมชื่อ location — "หน้า (front eAxle, PMSM)"
  layout       MotorLayout?
  layoutStatus DataStatus @default(unknown)
}

model Battery {
  chemistryRaw    String?     // เดิมชื่อ chemistry
  chemistry       BatteryChemistry?
  chemistryStatus DataStatus @default(unknown)
}
```

**เกียร์ — ขยาย `TransmissionType` (additive เท่านั้น) — ⚠️ แก้จุดที่ร่างแรกละเมิดหลักการข้อ 3 เอง:** ร่างแรกเสนอ `E_CVT` เป็นค่าเดียวสำหรับทั้ง Toyota "E-CVT" (power-split — ratio แปรผันจริงแบบไม่มีขั้นผ่านเฟืองดาวเคราะห์) และ Honda "e-CVT" (direct-drive — คลัตช์ล็อกเกียร์เดียว ไม่มีอัตราทดแปรผันจริง แม้การตลาดเรียกว่า CVT เหมือนกัน) — เป็นการยุบของสองกลไกที่ต่างกันโดยพื้นฐานเข้า enum เดียวกัน แล้วให้ filter ฝั่งผู้ใช้กรองรวมกันได้ ขัดหลักการข้อ 3 ที่เอกสารเองประกาศไว้ตรงๆ **แก้โดยแยกเป็น 2 ค่า:**

```prisma
enum TransmissionType {
  MANUAL
  AUTOMATIC
  CVT
  E_CVT_POWER_SPLIT     // Toyota/Lexus THS-style — planetary power-split, ratio แปรผันต่อเนื่องจริง
  E_CVT_DIRECT_DRIVE    // Honda e:HEV-style — คลัตช์ล็อกเกียร์เดียว ไม่มีอัตราทดแปรผันจริงตามนิยาม CVT
  DCT
  AMT
  SINGLE_SPEED
  OTHER
}
```
**Editorial rule บังคับ (ดู §4):** ห้ามตั้งค่าใดค่าหนึ่งใน 2 ค่านี้โดยไม่ทราบกลไกแน่ชัด — ถ้าเห็นแค่ชื่อการตลาด "E-CVT"/"e-CVT" โดยไม่รู้บริบทแบรนด์ ใช้ `OTHER` + `status=unknown` เสมอ ห้ามเดาจากชื่อ

`Transmission.name` (มีอยู่แล้ว แทบไม่ถูกใช้) เริ่มใช้จริงเป็นที่เก็บชื่อการตลาด (Rev Tronic, Super CVT-i, Direct Shift-CVT) — ไม่ต้องเพิ่มฟิลด์

**ระบบขับเคลื่อน — ขยาย `DrivetrainType` (additive, ไม่ลบ/ไม่บังคับ reclassify ค่าเดิม) + เพิ่ม capability field:**

```prisma
enum DrivetrainType {
  FWD
  RWD
  AWD                 // legacy — คงไว้ = "AWD, ยังไม่ verify subtype"
  AWD_ON_DEMAND        // ใหม่ — ปกติ 2WD ส่งกำลังอัตโนมัติเมื่อจำเป็น (Honda Real-Time AWD)
  AWD_FULL_TIME         // ใหม่ — มีเฟืองกลาง ใช้ถนนแห้งได้
  FOUR_WD               // legacy — คงไว้ = "4WD, ยังไม่ verify subtype"
  FOUR_WD_PART_TIME     // ใหม่ — 2H/4H/4L ห้ามใช้ 4H บนถนนแห้ง
  FOUR_WD_SELECTABLE    // ใหม่ — สลับ part-time/full-time ได้ (Super Select 4WD-II)
  OTHER
}

model Drivetrain {
  hasLowRange           Boolean?
  lowRangeStatus        DataStatus @default(unknown)
  hasRearDiffLock       Boolean?
  rearDiffLockStatus    DataStatus @default(unknown)
  torqueSplitNominal    String?    // "40:60" — ชื่อฟิลด์สื่อชัดว่าเป็นค่า nominal การตลาด ห้ามใช้คำนวณ/เทียบเป็นสเปกวัดจริง
  // name (เดิม) = ชื่อการตลาด: Super Select 4WD-II, Real Time AWD, Easy Select 4WD ฯลฯ — เริ่มใช้จริง
}
```

**สถาปัตยกรรมไฮบริด — จุดที่วิจัยชี้ว่าเป็นกับดักใหญ่สุด (Toyota THS power-split ≠ Honda e:HEV series-parallel ≠ BYD DM-i แม้บางเจ้าเรียก "E-CVT"/"e-CVT" เหมือนกัน):**

```prisma
enum HybridArchitecture {
  POWER_SPLIT                        // Toyota THS
  SERIES_PARALLEL                    // Honda e:HEV, Mitsubishi e:MOTION, BYD DM-i (EHS)
  SERIES                             // Nissan e-POWER, EREV ทุกยี่ห้อ (Deepal S05 ฯลฯ) — เครื่องยนต์ปั่นไฟอย่างเดียว ไม่ขับล้อ
  DEDICATED_HYBRID_TRANSMISSION      // GWM DHT — เฟือง 1-2 จังหวะเฉพาะทาง ไม่ใช่ DCT
  OTHER
}

model VariantRevision {
  hybridArchitecture       HybridArchitecture?
  hybridArchitectureStatus DataStatus @default(unknown)   // not_applicable สำหรับ ICE/BEV
}
```
ผูกที่ `VariantRevision` ไม่ใช่ `Engine`/`Motor` เดี่ยวๆ เพราะสถาปัตยกรรมนี้อธิบายความสัมพันธ์ของทั้งชุด (เครื่อง+มอเตอร์+เกียร์) ร่วมกัน — และเป็นตัวช่วยแยก `E_CVT_POWER_SPLIT`/`E_CVT_DIRECT_DRIVE` ข้างต้นเมื่อ `hybridArchitecture` ทราบค่าจริง (`POWER_SPLIT`↔`E_CVT_POWER_SPLIT`, `SERIES_PARALLEL`↔`E_CVT_DIRECT_DRIVE`)

**Powertrain — เพิ่มค่าเดียว:**
```prisma
enum PowertrainType {
  ICE
  MHEV
  HEV
  PHEV
  EREV   // ใหม่ — extended-range EV (Deepal S05) เสียบชาร์จได้+แบตใหญ่ แต่มีเครื่องปั่นไฟ — ไม่ใช่ series hybrid ธรรมดา (e-POWER เสียบชาร์จไม่ได้) และไม่ใช่ BEV (ยังมีถังน้ำมัน) — คนละแกนกับ HybridArchitecture: PowertrainType ตอบ "เสียบชาร์จได้ไหม" ส่วน HybridArchitecture ตอบ "เครื่องยนต์-มอเตอร์ต่อกันแบบไหน" แถว EREV ต้องตั้ง hybridArchitecture=SERIES เสมอเมื่อทราบ
  BEV
  FCEV
}
```

**กระบะ — cab type บน `Derivative` · ride height บน `Trim` (⚠️ แก้จากร่างเดิมที่วางทั้งคู่บน Derivative):**
ตอน apply จริงพบว่าข้อมูล Toyota จัดไลน์ Prerunner (ยกสูงขับหลัง) กับ 4TREX (4WD) **ปนกันใน derivative เดียว** ("Travo Double Cab" มีทั้งสองไลน์) — ride height เป็นคุณสมบัติระดับไลน์การขาย (trim) ไม่ใช่ระดับตัวถัง จึงย้ายลง `Trim`:
```prisma
enum CabType { SINGLE_CAB EXTENDED_CAB DOUBLE_CAB NOT_APPLICABLE }
enum RideHeightClass { STANDARD HIGH_RIDER NOT_APPLICABLE }   // แกนนี้ใช้กับกระบะ 2WD เท่านั้น — 4WD/AWD และรถไม่ใช่กระบะ = NOT_APPLICABLE (Prerunner-class ≠ 4WD เด็ดขาด แม้ยกสูงเท่ากัน)

model Derivative {
  cabType       CabType?
  cabTypeStatus DataStatus @default(unknown)
  // name (เดิม) ยังเก็บชื่อการตลาดของแบรนด์ (Smart Cab, Space Cab ฯลฯ) ตามปกติ ไม่ถูกแทนที่
}

model Trim {
  rideHeightClass  RideHeightClass?
  rideHeightStatus DataStatus @default(unknown)
}
```

**โครงตัวถัง/แพลตฟอร์ม บน `Generation`:**
```prisma
enum ChassisType { BODY_ON_FRAME UNIBODY }        // CR-V (unibody) ≠ Fortuner (ladder frame) แม้อยู่ BodyType.SUV เดียวกัน
enum EcoCarPhase { PHASE_1 PHASE_2 NOT_APPLICABLE } // ภาษี ≠ ขนาดตัวถัง (Honda City เป็นทั้ง B-segment และอีโคคาร์เฟส 2)

model Generation {
  chassisType       ChassisType?
  chassisTypeStatus DataStatus @default(unknown)
  platformName      String?      // "e-TNGA", "DNGA", "IMV" — จมอยู่ใน Generation.name วันนี้
  ecoCarPhase       EcoCarPhase?
  adasSuiteName     String?      // ใหม่ (เบา) — ชื่อชุด ADAS ระดับ generation เช่น "Toyota Safety Sense" free text ไม่ canonical ดู §2.3/§3
}
```
`Segment.ECO_CAR` เดิม **ไม่ลบ** (มีแถวใช้อยู่จริง — `prisma/seed-data.ts:776`) แต่ **ไม่ใช่แค่ประกาศ deprecated เฉยๆ** (ร่างแรกพลาดข้อนี้ ขัดกฎข้อ 6 ของตัวเอง) ต้องมีสคริปต์ backfill ให้แถวที่มีอยู่จริงในเฟสเดียวกับที่เพิ่ม `ecoCarPhase` — ดู §5 Phase 2

**VariantRevision — grade code + ระยะทาง (แยกตามมาตรฐานทดสอบ ห้ามแปลงข้ามมาตรฐานด้วยสูตร — และแยก status รายมาตรฐาน เพราะรถแต่ละคันมักมีแค่มาตรฐานเดียวประกาศ):**
```prisma
model VariantRevision {
  gradeCode   String?      // รหัสรุ่นทางการจากผู้ผลิต — ตัวจับคู่ประกาศมือสองที่แม่นสุด จมอยู่ใน notes วันนี้
  rangeKmNedc       Float?
  rangeKmNedcStatus DataStatus @default(not_applicable)
  rangeKmWltp       Float?
  rangeKmWltpStatus DataStatus @default(not_applicable)
  rangeKmCltc       Float?
  rangeKmCltcStatus DataStatus @default(not_applicable)
  // known เฉพาะ BEV/PHEV/EREV ที่มีค่าจริงจากแหล่งประกาศมาตรฐานนั้นตรงๆ — รถจีนมักมีแค่ CLTC, รถไทย/ยุโรปมักมีแค่ WLTP
  // แยก status รายมาตรฐาน (ไม่ใช่ rangeStatus ตัวเดียว) เพราะแหล่ง/เวลารู้ของแต่ละมาตรฐานต่างกันได้เสมอ
}
```

**Battery — สเปกชาร์จ (แยก AC/DC เสมอ ทั้งค่าและ status — kW ตู้ AC ไม่ใช่ความเร็วชาร์จจริง เพราะถูกจำกัดโดย on-board charger และมักมาจากแหล่งคนละชุดกับ DC):**
```prisma
enum ChargePortType { TYPE_2 CCS2 CHADEMO OTHER }

model Battery {
  acMaxKw      Float?
  acChargePort ChargePortType?
  acStatus     DataStatus @default(unknown)
  dcMaxKw      Float?
  dcChargePort ChargePortType?
  dcStatus     DataStatus @default(unknown)
}
```

### 2.2 ชั้น 2 — Entity naming (Trim ที่แบรนด์ตั้งชื่อเอง มี id จริง)

**`AliasMapping` (§2.0) คืองานนี้อยู่แล้ว — ยังไม่เคยถูกใช้เลยสักแถว** เปิดใช้งานจริงแทนสร้างของใหม่: ทุกครั้งที่เจอชื่อ trim สะกดต่างกัน (`"NIGHTSHADE"` / `"Nightshade"`) สร้างแถว `AliasMapping(entityType=TRIM, alias=ข้อความดิบ, brandId, confidence)` แล้วผูกหลักฐานผ่าน `EvidenceLink(entityType=ALIAS_MAPPING, entityId=<แถวนี้>)`

**`Trim.standardName`** (มีอยู่แล้ว) — นิยามให้แคบลง: **normalize การสะกดภายในแบรนด์+nameplate เดียวกันเท่านั้น เพื่อการแสดงผล** ไม่ใช่ตัวจัดหมวด/tier ข้ามแบรนด์ (ไม่มี ontology ยืนยันได้ว่า "top" ของ Toyota เทียบเท่า "top" ของ Honda — บังคับ tier ข้ามแบรนด์คือ false precision) — **ไม่มี schema change สำหรับข้อนี้**

**`Trim.marketingLine`** — ฟิลด์ใหม่เดียวของชั้นนี้ สำหรับ "ไลน์การขาย" (Leader/Legender/GR Sport/4TREX ของ Toyota, Raptor/Wildtrak ของ Ford) ที่ไม่มีที่เก็บเลยวันนี้ ถูก flatten ลง `Trim.name`:
```prisma
model Trim {
  standardName  String?   // นิยามใหม่ตาม editorial rule — ไม่เปลี่ยน type
  marketingLine String?   // ใหม่ — "Legender", "GR Sport" — free text จงใจ ประกาศชัดว่าไม่ใช่ canonical ห้ามใช้ filter
}
```
**เหตุผลที่ไม่ทำ `TrimTier` (enum ระดับ entry/mid/top) และไม่ทำ multi-value assignment สำหรับ tier:** ไม่มีแหล่งข้อมูลใดยืนยัน ontology ระดับเกรดข้ามแบรนด์ได้จริง การบังคับจัด tier คือ false precision โดยนิยาม — `marketingLine` (free text + editorial guardrail) พอสำหรับสถานะข้อมูลตอนนี้ ดู §7

### 2.3 จุดที่ยอมสร้างของใหม่จริง — Feature / ADAS (Phase 4, deferred)

ADAS ไม่มี field เก็บแม้แต่ช่องเดียวในสคีมาทั้งหมด เป็นหัวใจของโจทย์ "ภาษากลาง" เอง (Toyota Safety Sense/Honda SENSING = หมวดเดียวกัน แต่ฟีเจอร์ข้างในต่างกันตามรุ่น/ปีจริง) — เป็นจุดเดียวที่สร้างตารางใหม่จริง เพราะ 1 trim มีได้หลายฟีเจอร์พร้อมกัน (multi-value) เป็น optional และข้อมูลทยอยเข้าไม่ครบ (unknown ≠ ไม่มี):

```prisma
enum FeatureCategory {
  AEB
  FCW
  ACC
  LDW
  LKA
  HIGHWAY_ASSIST_L2
  BSM
  RCTA
  SURROUND_VIEW
  TRAFFIC_JAM_ASSIST
  TSR
  AUTO_HIGH_BEAM
  DRIVER_MONITORING
  OTHER
}

enum FeatureStatus { ACTIVE DEPRECATED MERGED }   // append-only: ถ้าพบว่า 2 concept ซ้ำ/ควรแยก → MERGED + mergedIntoId ห้ามลบแถว

model Feature {
  id              String @id @default(cuid())
  category        FeatureCategory
  canonicalNameTh String
  canonicalNameEn String
  definition      String?          // เกณฑ์แยกจากฟีเจอร์ใกล้เคียง เช่น "เบรกให้จริง ไม่ใช่แค่เตือน" (แยก AEB จาก FCW)
  status          FeatureStatus @default(ACTIVE)
  mergedIntoId    String?
  createdAt       DateTime @default(now())

  mergedInto   Feature? @relation("FeatureMerge", fields: [mergedIntoId], references: [id])
  mergedFrom   Feature[] @relation("FeatureMerge")
  trimFeatures TrimFeature[]
}

model TrimFeature {
  id             String     @id @default(cuid())
  trimId         String
  featureId      String
  status         DataStatus @default(unknown)
  hasFeature     Boolean?          // เติมเมื่อ status=known เท่านั้น
  hasStopAndGo   Boolean?          // เฉพาะ category=ACC — full-speed range หรือไม่ (ตัดสินใจแยกจากตัวถังกันดัก "ACC ธรรมดา ≠ full-speed Stop&Go" ที่ §4 เตือนไว้ — ตามแพตเทิร์น hasLowRange/hasRearDiffLock ของ Drivetrain)
  marketingName  String?           // ชื่อที่แบรนด์เรียกฟีเจอร์นี้ — "Pre-Collision System"
  operatingNote  String?           // ช่วงความเร็ว/เป้าตรวจจับอื่นๆ — free text จงใจ ไม่ over-structure
  effectiveFrom  DateTime?         // ⚠️ ไม่ nullable ในทางปฏิบัติ — ดู @@unique ด้านล่าง
  effectiveTo    DateTime?

  trim    Trim    @relation(fields: [trimId], references: [id])
  feature Feature @relation(fields: [featureId], references: [id])

  @@index([trimId])
}
// ⚠️ ไม่ใช้ @@unique([trimId, featureId, effectiveFrom]) ตรงๆ — Postgres ถือ NULL ≠ NULL เสมอ
// ดังนั้นสองแถว trimId+featureId เดียวกันที่ effectiveFrom เป็น null ทั้งคู่ (เคสส่วนใหญ่ที่จะเกิดจริงตอน seed Phase 4)
// จะ insert ซ้ำได้โดย DB ไม่ปฏิเสธ — ต้องใช้ partial unique index แทน (เขียน migration SQL มือ):
//   CREATE UNIQUE INDEX trim_feature_unique_no_date
//     ON "TrimFeature" ("trimId", "featureId") WHERE "effectiveFrom" IS NULL;
//   CREATE UNIQUE INDEX trim_feature_unique_dated
//     ON "TrimFeature" ("trimId", "featureId", "effectiveFrom") WHERE "effectiveFrom" IS NOT NULL;

model Trim {
  trimFeatures TrimFeature[]   // ใหม่ — back-relation บังคับของ Prisma
}
// EvidenceLink ผูกผ่านกลไกเดิม: entityType=TRIM_FEATURE, entityId=trimFeature.id, field="hasFeature"
```
`Generation.adasSuiteName` (§2.1) คือชั้น "หมวด" แบบเบา (free text, ไม่ relational) — ไม่ทำ self-relation parent/child เต็มรูปแบบ เพราะ `FeatureCategory` แบนพอสำหรับ 3 ฟีเจอร์แรกที่จะ seed จริง (ดู §5 Phase 4)

**⚠️ ก่อนใช้ Prisma sketch ในเอกสารนี้จริง:** ต้องเพิ่ม back-relation ที่ Prisma บังคับให้ครบ 2 จุด (ตรวจด้วย `npx prisma validate` แล้วพบว่าขาด) — `Brand.aliasMappings` (§2.0, เพิ่มไว้แล้วข้างบน) และ `Trim.trimFeatures` (ข้างบนนี้) — **ต้องรัน `npx prisma validate` ให้ผ่านจริงก่อนเริ่ม apply เฟสไหนก็ตาม** ไม่ใช่ก๊อป snippet ไปแปะตรงๆ

---

## 3) กฎการแสดงผล

1. **`specLine` (บรรทัดสเปกเดียวหน้า `/cars/[slug]`, `src/app/cars/[slug]/page.tsx:149-158`) ใช้เฉพาะคำกลาง (enum → labels.ts) เท่านั้น** ห้าม inject ข้อความ marketing/`*Raw` เข้าบรรทัดนี้เด็ดขาด — คงพฤติกรรมเดิมที่ตารางแน่น/สแกนไวไว้ (specLine ไม่มี truncate/overflow-hidden ใดๆ วันนี้ — ข้อความยาวขึ้นเสี่ยงตกบรรทัดมือถือ ต้องคงสั้นเท่าปัจจุบันหรือสั้นกว่า)
2. **แก้จุดรั่วที่มีอยู่แล้วพร้อมกับ Phase 1:** `queries.ts:261` (`transmissionText = transmission.name ?? transmission.type`) ต้องตกไปที่ `transmission.type` (canonical) เสมอเมื่อไม่ match เคสที่รู้จัก **ห้าม fallback ไปที่ `.name`** (ชื่อการตลาด) — นี่คือจุดรั่วเดิมที่ละเมิดกฎข้อ 1 อยู่แล้วก่อนงานนี้เริ่ม
3. ชื่อการตลาด (`*Raw`, `Transmission.name`, `Drivetrain.name`, `marketingLine`, `TrimFeature.marketingName`) แสดงเป็นข้อมูลรองเสมอ — ใช้ช่อง `title` tooltip ที่มีอยู่แล้ว (`row.engineText` บรรทัด 174) หรือบรรทัดย่อยตัวเล็ก/สีจาง ไม่เคยมาก่อนคำกลาง ไม่เคยแทนที่คำกลาง
4. รูปแบบมาตรฐานเมื่อต้องโชว์คู่กันในพื้นที่ที่มีที่พอ (แถวรายละเอียด ไม่ใช่ตารางแน่น): `"[คำกลางไทย] (ชื่อทางการค้า: [marketing name])"` เช่น `"4WD แบบสลับได้ (Super Select 4WD-II)"`
5. Filter/facet ทุกจุด (`car-database-explorer.tsx`, หน้า `/brands` **และ `/brands/[slug]` — ใช้ component เดียวกันเป๊ะ อย่าลืม**) ต้อง build ตัวเลือกจาก enum ผ่าน `labels.ts` เท่านั้น — **ห้าม `new Set()` จาก free-text field ใดๆ อีก** (แก้บั๊ก `car-database-explorer.tsx:140` ตรงจุด) ถ้าต้องการค้นด้วยคำการตลาด (พิมพ์ "Super CVT-i") ให้เป็น full-text search แยก ไม่ใช่ facet filter
6. ชื่อ `Trim.name` แสดงตามที่แบรนด์ขายจริงเสมอเป็นหัวเรื่องหลัก (ข้อเท็จจริงเชิงพาณิชย์) — `standardName`/`marketingLine` เป็นข้อมูลเสริม (badge เล็ก) ไม่ใช่ default state ที่ต้อง populate ทุกแถว
7. ฟีเจอร์ ADAS (เมื่อ Phase 4 ขึ้น UI): แสดงรายการแยกฟีเจอร์พร้อมคำกลาง+นิยามเป็นหลัก ("เบรกฉุกเฉินอัตโนมัติ (AEB)") ชื่อการตลาดเป็น tooltip รอง — **ห้ามแสดง badge รวม "มีชุด Toyota Safety Sense" เทียบน้ำหนักภาพเท่ากับแบรนด์อื่นที่มีชุดชื่ออื่น** เพราะทำให้เข้าใจผิดว่าชุดเท่ากัน (ขัด exact entity matching ที่ระดับ UI)
8. ทุกฟิลด์ใหม่ที่มี `DataStatus` กำกับ ต้อง render ผ่าน component `DataStatusValue` เดิม (unknown → "ยังไม่ยืนยัน", not_applicable → ซ่อนแถว) — ไม่เคยปล่อยว่างเปล่าหรือซ่อนเงียบจนดูเหมือนบั๊ก (โดยเฉพาะ `Battery.chemistry` ที่จะ "ถอยหลัง" จากดูเหมือนมีค่า เป็น unknown หลัง migrate — ต้องสื่อสารล่วงหน้าว่าตั้งใจ)
9. ค่า enum เก่าที่ยังไม่ verify (`Segment.ECO_CAR` ก่อน backfill, `DrivetrainType.AWD`/`FOUR_WD` แบบ legacy) ยังคงเรนเดอร์ปกติ ไม่ทำเว็บพัง แต่ flag ไว้ในรายการ "รอ reclassify" ระดับ admin เท่านั้น ไม่ใช่ user-facing

### ตัวอย่างก่อน–หลัง

| สถานการณ์ | ก่อน (ปัจจุบัน) | หลัง (canonical) |
|---|---|---|
| Hilux Revo 4x4 ดีเซลเทอร์โบ | `ดีเซล · 204 PS · อัตโนมัติ 6 สปีด · 4WD` | `ดีเซล · 204 PS · อัตโนมัติ 6 สปีด · 4WD` (ไม่เปลี่ยน specLine — ข้อมูลใหม่ที่ได้คือ tooltip: fuelTypeRaw="ดีเซล", aspirationRaw="VN Turbo + Intercooler" และ facet filter ที่แม่นขึ้น ไม่ใช่ข้อความยาวขึ้น — คงหลัก "ตารางแน่น/สแกนไว") |
| Yaris Cross HEV (บั๊กปัจจุบัน) | `ไฮบริด · 116 PS · CVT` ← **ผิด** เพราะ `TransmissionType.CVT` ไม่มีค่าไฮบริด ต้องยัดใส่ CVT สายพานธรรมดา | `ไฮบริด · 116 PS · E-CVT` (tooltip: transmission.name="E-CVT", hybridArchitecture=POWER_SPLIT, transmission.type=E_CVT_POWER_SPLIT) |
| ตัวกรองขุมพลังหน้าแรก+Brand Hub 2 แบรนด์ | ตัวเลือกแตกเป็น "ดีเซล" / "Diesel" / "ดีเซล เทอร์โบ" (3 ตัวเลือกจาก free text) ทั้งที่หน้าแรกและ `/brands/[slug]` | ตัวเลือกเดียว "ดีเซล" (จาก `FuelType.DIESEL` ผ่าน `labels.ts`) กรองได้ข้ามแบรนด์ ทุกหน้าที่ใช้ `CarDatabaseExplorer` |
| กระบะยกสูงขับสองล้อ | ไม่มี field แยก — ต้อง grep ชื่อ `Derivative.name` ว่ามีคำว่า "Prerunner" ไหม | filter facet ใหม่ "แค็บ: กระบะแค็บ (ตอนครึ่ง)" / "ระดับตัวถัง: ยกสูง 2WD" ทำงานข้ามแบรนด์ทันที (cabType, rideHeightClass) |

---

## 4) กฎ editorial การ map ศัพท์

**Map ได้เมื่อ** ครบทั้ง 3 ข้อ: (1) แหล่งเป็น `EvidenceSource` ที่ `sourceType=MANUFACTURER_OFFICIAL` หรือแหล่งรอง confidence HIGH/MEDIUM ที่อ้างอิงสเปกทางการชัดเจน (2) กลไกเบื้องหลังตรงกับนิยามค่า enum จริง ไม่ใช่แค่ "ชื่อฟังดูคล้าย" (3) ทุกครั้งที่ set ค่า canonical ต้องสร้าง `EvidenceLink` คู่กันเสมอ (รวมถึง `AliasMapping` เองผ่าน `entityType=ALIAS_MAPPING` — ดู §2.0) — **การ map คือ fact ต้องมีหลักฐานเหมือน fact อื่น**

**ห้าม map เมื่อ:**
- แหล่งเป็น aggregator/สื่อทั่วไปที่ขัดแย้งกับ spec sheet ทางการ (Isuzu Rev Tronic ถูกบางเว็บเรียกว่า AMT ทั้งที่เป็น 6AT ทอร์กคอนเวอร์เตอร์จริง) → ยึด official source เสมอ ถ้ามีแต่แหล่งขัดแย้งกันเอง → `status=unknown`
- ชื่อการตลาดเดี่ยวๆ ไม่รู้บริบทแบรนด์ ("E-CVT"/"e-CVT" หมายถึงคนละกลไกตามแบรนด์ — ดู §2.1) → ถ้าไม่รู้ว่าเป็นระบบไหนจริง ใส่ `E_CVT_POWER_SPLIT`/`E_CVT_DIRECT_DRIVE`/`TransmissionType=OTHER` ตามหลักฐานที่มี + `status=unknown` ถ้าไม่มีหลักฐานพอ เก็บชื่อดิบไว้ที่ `*Raw`/`Transmission.name`
- เจอกลไกใหม่ที่ไม่มีค่า enum รองรับ (เช่น GWM DHT/Hi4 ในอนาคต) → **ห้าม force-fit** เข้าค่าใกล้เคียงที่สุด ใช้ `OTHER` + raw text + `EvidenceLink` อธิบายว่าทำไมไม่เข้าค่าไหนเลย แล้วเปิดเรื่องขอเพิ่มค่า enum ใหม่ผ่านขั้นตอน "ถามก่อน" ของ `AGENTS.md`

**คู่ enum ที่ต้อง sync กันเสมอเมื่อทราบค่า:** `PowertrainType=EREV` ↔ `HybridArchitecture=SERIES` เสมอ (สองแกนคนละมิติ: PowertrainType ตอบ "เสียบชาร์จได้ไหม", HybridArchitecture ตอบ "เครื่องยนต์-มอเตอร์ต่อกันแบบไหน" — EREV ทุกคันคือ series hybrid ที่เสียบชาร์จได้) · `Transmission.type=E_CVT_POWER_SPLIT` ↔ `hybridArchitecture=POWER_SPLIT` · `Transmission.type=E_CVT_DIRECT_DRIVE` ↔ `hybridArchitecture=SERIES_PARALLEL`

**Fact เชิงลบต้องมีหลักฐานเข้มเท่าฝั่งบวก:** `TrimFeature.hasFeature=false` (ยืนยันว่าไม่มีจริง) ต้องมีหลักฐานเท่ากับ `hasFeature=true` — สเปกชีทไม่พูดถึงฟีเจอร์ **≠** ยืนยันว่าไม่มี (นั่นคือ `status=unknown` ไม่ใช่ known+false) ห้ามเดาจากความเงียบของแหล่งข้อมูล

**ไม่แน่ใจ (แหล่งขัดแย้งกัน หรือมีแค่ความรู้ทั่วไป):** `DataStatus=unknown` เสมอ — ห้ามใช้ความรู้ทั่วไป/ความมั่นใจส่วนตัวของผู้กรอกหรือโมเดล AI แทนหลักฐานจริง ต้องมีแถว `EvidenceSource` จริงถึงตั้ง `status=known` ได้

**ห้ามคำนวณ/แปลงเอง:** ไม่รวมกำลังเครื่อง+มอเตอร์เป็นกำลังรวมถ้าแบรนด์ไม่ประกาศเอง (peak ไม่เกิดพร้อมกันจริงเสมอไป) · ไม่แปลงระยะทาง NEDC↔WLTP↔CLTC ด้วยสูตรคงที่ — รับค่าเฉพาะจากแหล่งที่ประกาศมาตรฐานนั้นตรงๆ เท่านั้น ถ้าไม่มีให้เว้นว่าง

**Editorial gate ก่อน seed แบรนด์ใหม่ทุกครั้ง:** ต้องกลับมาตรวจก่อนว่า enum ที่มีอยู่ (โดยเฉพาะ `TransmissionType`, `DrivetrainType`, `HybridArchitecture`) ยังครอบกลไกของแบรนด์ใหม่ได้จริงไหม ห้าม seed ทับไปก่อนแล้วค่อยแก้ทีหลัง — **ค่า enum ใหม่ทุกค่าต้องมาคู่กับสคริปต์ backfill/reclassify ที่ระบุชัดในเฟสเดียวกันเสมอ** ห้ามเพิ่มค่าเฉยๆ แล้วปล่อยแถวเก่าที่รู้อยู่แล้วว่าจัดผิดค้างต่อไป (ดู §5 Phase 2 — ทั้ง `E_CVT` split และ `Segment.ECO_CAR` deprecation ต้องมี backfill คู่กันในเฟสเดียว)

**Publish gate สำหรับหลักฐานของ `AliasMapping`:** เพราะ `AliasMapping` ผูกหลักฐานผ่าน `EvidenceLink` (ไม่ใช่ FK ตรงบนตัวมันเอง — §2.0) การเช็ก "alias นี้มีหลักฐานหรือยัง" ต้อง join `EvidenceLink` เสมอ — **รวม logic นี้ไว้ที่จุดเดียว** (เช่น repository function `getPublishableAliases()` ที่ทุก query path ต้องเรียกผ่าน) แทนการกระจาย `WHERE` clause ไปทุกจุดที่อ่าน `AliasMapping` เพื่อลดความเสี่ยงลืม filter ในจุดใหม่ที่จะเพิ่มทีหลัง (API route ใหม่, export, admin tool)

### กับดัก false equivalence ต่อโดเมน (สรุปจากงานวิจัยศัพท์)

| โดเมน | กับดัก |
|---|---|
| เกียร์ | e-CVT ไม่ใช่ CVT สายพาน (ไม่มีจังหวะ ห้ามกรอกตัวเลขสปีด) · Toyota E-CVT (power-split) ≠ Honda e-CVT (direct-drive) ≠ BYD DM-i แม้ชื่อคล้าย — แยก enum แล้วตาม §2.1 · CVT ที่โฆษณา "7 speed" คือจังหวะจำลอง ไม่ใช่เฟืองจริง · Isuzu Rev Tronic เป็น 6AT ไม่ใช่ AMT ตามที่บางแหล่งเรียกผิด |
| ขับเคลื่อน | "2WD" กำกวม (เก๋ง=หน้า, กระบะ=หลัง) ต้อง normalize เป็น FWD/RWD เสมอ · Prerunner/Hi-Lander/Hi-Rider (ยกสูง 2WD) ห้าม map เข้า 4WD ใดๆ แม้หน้าตาเหมือน · "4H" ความหมายต่างกันข้ามแบรนด์ (Easy Select 4H=ล็อกกลาง ห้ามใช้ถนนแห้ง, Super Select 4H=ฟูลไทม์ ใช้ถนนแห้งได้) · Toyota "Auto LSD" คือระบบเบรกอิเล็กทรอนิกส์ ไม่ใช่ LSD กลไกจริง |
| ไฮบริด/EV | e-POWER (series hybrid) ≠ EV แม้การตลาดสื่อว่า "ขับเหมือน EV" — ยังใช้น้ำมันแหล่งเดียว · EREV ≠ PHEV (ไม่มี parallel mode) และ ≠ BEV (มีถังน้ำมัน) แต่ EREV = SERIES เสมอ (ดูกฎ sync ด้านบน) · Blade Battery = ชื่อแพ็ก LFP ของ BYD ไม่ใช่เคมีแยกชนิด · PS ≠ hp (~1.4%) ต้องเก็บหน่วยต้นทาง |
| ADAS | ชื่อชุดเดียวกัน ≠ ฟีเจอร์เดียวกัน (TSS ใน Yaris ≠ TSS ใน Camry คนละเวอร์ชัน) · Honda LaneWatch (กล้องฝั่งซ้าย) ≠ BSM เรดาร์สองฝั่ง แม้ถูกเรียกรวมว่า "เตือนจุดอับสายตา" · Mitsubishi FCM ชื่อเหมือนแค่เตือนแต่จริงๆ เบรกให้ (เหมือน AEB ไม่ใช่ FCW) · ACC ธรรมดา (ตัดใต้ ~30 กม./ชม.) ≠ full-speed Stop&Go — แยกด้วย `hasStopAndGo` ไม่ใช่ category แยก (ดู §2.3) — ตัดสินด้วยพฤติกรรมจริง ไม่ใช่ชื่อ |
| ตัวถัง | รถอเนกประสงค์/SUV เป็นคำรวมสื่อ ไม่ใช่หมวดหมู่จริง — ต้องแยกด้วย `chassisType` (unibody/body-on-frame) ไม่ใช่ชื่อการตลาด · PPV เป็นคำเฉพาะไทย ตลาดโลกเรียก SUV — ห้ามยุบ cohort ราคากับ crossover · MPV ≠ Van แม้คนไทยเรียก Alphard ว่า "รถตู้" |

---

## 5) แผน migration เป็นเฟส

หลักทุกเฟส: **additive เท่านั้น** (คอลัมน์ใหม่ nullable, ไม่ลบ/ไม่เขียนทับข้อมูลของเดิม) → ปลอดภัยต่อ **5 หน้าเว็บ** ที่มีอยู่ (`/`, `/cars/[slug]`, `/brands`, `/brands/[slug]`, และทุกหน้าที่ใช้ `CarDatabaseExplorer`) จนกว่าจะถึงเฟสที่ตั้งใจสลับ read-path (มีการ verify ชัดเจน) และทุกเฟสอยู่ในชั้น **"⚠️ ถามก่อน"** ของ `AGENTS.md` — เอกสารนี้คือ design รอเบสอนุมัติทีละเฟส ไม่ใช่แผนที่ลงมือ apply เองได้ทันที

**ข้อยกเว้นเดียวของ "ไม่ลบ/ไม่เขียนทับ": การ `RENAME COLUMN` ใน Phase 1** — เป็นการย้ายชื่อคอลัมน์ ไม่ใช่ลบข้อมูล แต่ **ต้องเขียน SQL มือ** (`ALTER TABLE "Engine" RENAME COLUMN "fuelType" TO "fuelTypeRaw";`) แล้วค่อย `ADD COLUMN` ใหม่แยกเป็นอีก step — **ห้ามปล่อยให้ `prisma migrate dev` auto-diff เดาเอง** เพราะ Prisma ไม่รู้ว่าคอลัมน์เก่ากับใหม่คือคอลัมน์เดียวกัน ถ้าไม่ตอบ interactive prompt ยืนยัน rename ให้ถูกต้อง มันจะสร้าง `DROP COLUMN fuelType` + `ADD COLUMN fuelTypeRaw` แทน ซึ่งลบข้อมูล free text ของ 41 variant ปัจจุบันทิ้งจริง

| เฟส | เนื้องาน | ความเสี่ยงต่อเว็บ | แตะโค้ด |
|---|---|---|---|
| **0 — Governance** | `EntityType`/`DiscountType` enum (พร้อม `UPDATE "Brand"→"BRAND"`, `"Generation"→"GENERATION"` ก่อน ALTER COLUMN — ดู §2.0), ขยาย `AliasMapping` (brandId), เพิ่ม back-relation `Brand.aliasMappings`/`Trim.trimFeatures`, รัน `npx prisma validate` ผ่านจริงก่อนไปเฟสถัดไป | **ต่ำ ไม่ใช่ศูนย์** — ต้องแก้ `src/lib/queries.ts:589` (`entityType: "Brand"` → `entityType: "BRAND"`) และ `prisma/seed.ts:82,215` ให้ตรงกับ enum member ใหม่ ไม่งั้น TypeScript คอมไพล์ไม่ผ่านหรือ Brand Hub โชว์ "ไม่มีแหล่งอ้างอิง" เงียบๆ | `queries.ts:589`, `seed.ts:82,215` — **ต้องเปิด `/brands/[slug]` ตรวจจริงหลังแก้** |
| **1 — Attribute วิกฤต** | `FuelType`/`AspirationType` + rename `Engine.fuelType/aspiration` → `*Raw` (SQL มือ ตามคำเตือนข้างบน) + backfill 41 variant Toyota ปัจจุบัน + แก้ `queries.ts:261` ไม่ fallback ไปที่ `transmission.name` | ปานกลาง — แก้ path จริง | `queries.ts` (`describePowertrain` ทั้งจุด fuelType/aspiration และจุด transmission fallback), `labels.ts` (`powertrainLabel`), `car-database-explorer.tsx` (filter set) → **ต้องเปิด 5 หน้าจริงตรวจก่อนเคลมเสร็จ: `/`, `/cars/[slug]` (อย่างน้อย 1 nameplate ต่อ powertrain type), `/brands`, `/brands/[slug]`** |
| **2 — โครงสร้าง/ขับเคลื่อน/กระบะ** | `MotorLayout`/`BatteryChemistry`, ขยาย `DrivetrainType` + capability field, `CabType`/`RideHeightClass` บน Derivative, `ChassisType`/`platformName`/`ecoCarPhase` บน Generation, **`TransmissionType.E_CVT_POWER_SPLIT`/`E_CVT_DIRECT_DRIVE`** (+ สคริปต์ reclassify แถว HEV/PHEV ปัจจุบันที่เคย seed เป็น `CVT` ผิดๆ) **+ backfill `Segment=ECO_CAR` ที่มีอยู่จริงวันนี้ (segment ตัวถังจริง + ecoCarPhase คู่กัน — บังคับตามกฎข้อ 6)** | ต่ำ (additive) แต่ `Battery.chemistry` ของ BEV Toyota จะ "ถอยหลัง" เป็น unknown โดยตั้งใจ — ต้องสื่อสารล่วงหน้า | เพิ่ม filter facet ใหม่ cab type ใน `car-database-explorer.tsx` |
| **3 — Charging/range/grade/hybrid** | `gradeCode`, `rangeKmNedc/Wltp/Cltc` (+ status แยกรายมาตรฐาน), `Battery` charging fields (+ acStatus/dcStatus แยก), `HybridArchitecture`, `PowertrainType.EREV` (คู่กับ editorial rule sync SERIES), `Generation.adasSuiteName` | ต่ำ — backfill จาก notes prose ที่มีข้อมูลอยู่แล้ว | ไม่บังคับทำ UI แสดงผลพร้อมกัน — ship field ก่อน |
| **4 — Feature/TrimFeature (deferred, ขอบเขตใหญ่สุด)** | `Feature` + `TrimFeature` (พร้อม partial unique index 2 ตัว — ดู §2.3) + `FeatureCategory`/`FeatureStatus` schema · seed เฉพาะ AEB/ACC/LKA ที่มีหลักฐานจริงจาก toyota.co.th/technology/safetysense เท่านั้น ที่เหลือไม่ insert (=unknown โดยปริยาย) | ต่ำต่อหน้าเว็บ — ไม่มีหน้าไหนอ่านอยู่แล้ว | UI badge เป็น follow-up แยก ไม่บล็อก phase นี้ว่า "เสร็จ" |
| **5 — Backlog (รอ input เบส/แบรนด์ที่ 2)** | reclassify แถว `AWD`/`FOUR_WD` legacy เป็น subtype ละเอียด (ต้องเช็ก spec ทีละรุ่นจริง) · ตัดสินใจ `maxPowerHp`→`maxPowerPs` (ค้างอยู่แล้ว) · backfill `Trim.marketingLine` ทั้งชุด · canonicalize motor type (PMSM/induction — deferred จาก §2.1) | — | ไม่ทำเดาไปก่อนตามหลัก "ตามข้อมูลใหม่" |

**Editorial gate ก่อนเริ่ม backfill แบรนด์ใหม่ทุกครั้ง (ผูกกับทุก phase ข้างบนที่เกี่ยวข้อง):** ตรวจ enum ที่มีอยู่ก่อนว่ายังครอบกลไกของแบรนด์ใหม่ได้จริง ห้าม seed ทับไปก่อนแล้วค่อยแก้

### ประมาณการภาระงานต่อแบรนด์ใหม่ (คร่าวๆ — ไม่ใช่คำมั่นสัญญา ขนาดใกล้เคียง Toyota ~41 variant)

| Phase | งานหลัก | เวลาโดยประมาณ (AI-session-assisted) |
|---|---|---|
| 1 | verify fuel/aspiration ต่อ engine ที่ไม่ซ้ำ (ไม่ใช่ต่อ variant — engine ใช้ร่วมหลาย variant ได้) | 1–2 ชม. |
| 2 | verify drivetrain subtype + cab type + chassis type ต่อ generation/derivative | 3–6 ชม. (กระบะ/PPV ใช้เวลามากกว่า ICE เก๋ง) |
| 3 | grade code + range + charging spec (เฉพาะ BEV/PHEV/EREV) | 2–5 ชม. ต่อ nameplate ที่มีปลั๊ก |
| 4 | ADAS ต่อ trim — **แพงสุด เพราะ scale ตามจำนวน trim ไม่ใช่ fixed cost** | 4–10 ชม. ต่อ nameplate (ขึ้นกับจำนวนเกรด) |
| ทั้งหมด | รวมทุก phase ต่อ 1 แบรนด์ขนาดใกล้เคียง Toyota | **ประมาณ 15–35 ชม.** กระจายตาม phase ที่เลือกทำ ไม่จำเป็นต้องทำครบทุก phase พร้อมกัน |

ตัวเลขนี้คือ range กว้างเพื่อให้เห็นสัดส่วนงาน (Phase 4 หนักสุด) ไม่ใช่ประมาณการที่แม่นยำ — จะแม่นขึ้นหลังทำแบรนด์ที่ 2 จริงรอบแรก

---

## 6) ชุดศัพท์ตั้งต้นต่อโดเมน

> **ตัวอย่างตั้งต้นจากงานวิจัย ยังไม่ verify เป็น evidence** — ก่อนใช้จริงต้องสร้างแถว `EvidenceSource` (สเปกชีท/โบรชัวร์ทางการ) แล้วผูก `EvidenceLink` ตาม §4 เท่านั้น ห้ามใช้ตารางนี้เป็นหลักฐานตรง

### เกียร์ (`TransmissionType`)

| คำกลาง | ตัวอย่างชื่อการตลาด | กับดัก |
|---|---|---|
| MANUAL | Isuzu 6MT, Toyota GR86 6MT | iMT (คลัตช์อัตโนมัติ+เลือกเกียร์เอง) ไม่ใช่ MT ปกติ |
| AUTOMATIC | Isuzu Rev Tronic (6AT), Ford 10-Speed SelectShift, Toyota Direct Shift-8AT | Rev Tronic ถูกเรียกผิดว่า AMT บ่อย |
| CVT | Toyota Super CVT-i, Direct Shift-CVT, Honda CVT, Mitsubishi CVT | ห้ามยุบรวมกับ E_CVT_* |
| E_CVT_POWER_SPLIT | Toyota "E-CVT" (Prius/Yaris Cross/Corolla Cross HEV) | ห้าม map ให้เหมือน Honda e-CVT — กลไกต่างกันจริง |
| E_CVT_DIRECT_DRIVE | Honda "e-CVT" (e:HEV) | ชื่อเหมือน Toyota แต่กลไกคนละแบบ — verify ก่อน map ทุกครั้ง |
| DCT | MG 7-Speed DCT | เปียก/แห้งต่างกันมากเรื่องความทนทาน |
| AMT | Suzuki AGS | คลัตช์เดียว ไม่ใช่ DCT |
| SINGLE_SPEED | BYD/Neta/MG/AION BEV ทั้งหมด, Nissan e-POWER | EV/e-POWER ห้ามกรอกเป็น CVT/AT |

### ขับเคลื่อน (`DrivetrainType`)

| คำกลาง | ตัวอย่างชื่อการตลาด | กับดัก |
|---|---|---|
| FOUR_WD_PART_TIME | Mitsubishi Easy Select 4WD, Toyota/Isuzu/Ford/Nissan 4x4 มาตรฐาน | ห้ามใช้ 4H บนถนนแห้ง |
| FOUR_WD_SELECTABLE | Mitsubishi Super Select 4WD-II | สลับ 2H/4H ฟูลไทม์/4LLc ได้ในระบบเดียว |
| AWD_ON_DEMAND | Honda Real Time AWD, Ford โหมด 4A | ไม่มี 4L ไม่ใช่ "ลุยได้เท่ากระบะ" |
| AWD_FULL_TIME | Subaru Symmetrical AWD (ยังไม่ verify) | ห้ามยุบกับ on-demand |
| RideHeightClass.HIGH_RIDER | Toyota Prerunner, Isuzu Hi-Lander, Ford Hi-Rider, Mazda Hi-Racer, Mitsubishi Plus | ไม่ใช่ 4WD แม้ยกสูงเท่ากัน — ราคามือสองคนละ cohort |

### ขุมพลัง Hybrid/EV + หน่วยวัด

| คำกลาง | ตัวอย่างชื่อการตลาด | กับดัก |
|---|---|---|
| HybridArchitecture.POWER_SPLIT | Toyota THS | ↔ Transmission.type=E_CVT_POWER_SPLIT เสมอ |
| HybridArchitecture.SERIES_PARALLEL | Honda e:HEV, Mitsubishi e:MOTION, BYD DM-i (EHS) | ชื่อ "E-CVT"/"e-CVT" ซ้ำกับ POWER_SPLIT ห้ามสับสน · ↔ Transmission.type=E_CVT_DIRECT_DRIVE เสมอ |
| HybridArchitecture.SERIES | Nissan e-POWER | ไม่ใช่ EV — เครื่องยนต์ไม่เคยขับล้อ |
| PowertrainType.EREV | Changan/Deepal REEV (S05) | ≠ PHEV (ไม่มี parallel mode) ≠ BEV (มีถังน้ำมัน) · ต้อง hybridArchitecture=SERIES เสมอ |
| BatteryChemistry.LFP | BYD Blade Battery | Blade = ชื่อแพ็ก ไม่ใช่เคมีแยกชนิด |
| rangeKmNedc/Wltp/Cltc (field แยก ไม่ใช่ enum เดียว) | NEDC / WLTP / CLTC | CLTC สูงกว่า WLTP ~20-30% ห้ามแปลงข้ามมาตรฐาน — status แยกรายมาตรฐาน |
| หน่วยกำลัง | PS (ญี่ปุ่น) vs kW (จีน/EV) | 1 PS = 0.7355 kW, 1 hp = 0.7457 kW — เก็บหน่วยต้นทางเสมอ |

### ADAS (`FeatureCategory`)

| คำกลาง | ตัวอย่างชื่อการตลาด | กับดัก |
|---|---|---|
| AEB | Toyota PCS, Honda CMBS, Isuzu AEB, Mitsubishi FCM | ห้ามยุบเป็น boolean เดียวไม่มีบริบท — ช่วงความเร็ว/เป้าตรวจจับต่างกันมาก |
| FCW | Isuzu FCW, Nissan IFCW | คนละฟีเจอร์จาก AEB (เตือนอย่างเดียว ไม่เบรก) |
| ACC | Toyota DRCC, Honda ACC/LSF, Mazda MRCC, Isuzu ACC with Stop&Go | ใช้ `hasStopAndGo` แยกเสมอ — ACC ธรรมดา (ตัดใต้ ~30 กม./ชม.) ≠ full-speed |
| LKA | Toyota LTA, Honda LKAS, Mazda LAS | "ดึงกลับเมื่อหลุด" ≠ "ประคองกลางเลนต่อเนื่อง" คนละพฤติกรรม |
| BSM | Toyota BSM, Honda BSI/LaneWatch, Mitsubishi BSW+LCA | Honda LaneWatch (กล้องฝั่งซ้าย) ≠ BSM เรดาร์สองฝั่ง |
| ADAS suite (ชื่อรวม, ไม่ canonical) | Toyota Safety Sense, Honda SENSING, Mazda i-Activsense, Ford Co-Pilot360 | ชื่อชุดเดียวกัน ≠ ฟีเจอร์เดียวกันข้ามรุ่น/ปี — ห้ามเทียบด้วยชื่อชุด |

### ตัวถัง/กระบะ

| คำกลาง | ตัวอย่างชื่อการตลาด | กับดัก |
|---|---|---|
| CabType.EXTENDED_CAB | Toyota Smart Cab, Isuzu Space Cab, Mitsubishi Mega Cab, Nissan King Cab, Ford Open Cab, Mazda Freestyle Cab, MG Giant Cab (ยังไม่ verify) | 7 ชื่อ = ตัวถังเดียวกัน (extended cab) |
| ChassisType.BODY_ON_FRAME | Fortuner, MU-X, Pajero Sport, Everest (PPV) | PPV เป็นคำเฉพาะไทย ตลาดโลกเรียก SUV — ห้ามยุบ cohort ราคา |
| ChassisType.UNIBODY | CR-V, HR-V, Corolla Cross | ห้าม assume จากชื่อ "SUV" อย่างเดียว |
| EcoCarPhase.PHASE_2 | Yaris Ativ, City/City Hatchback (Gen 2019+), Almera | ภาษี ≠ ขนาด — City เป็นทั้ง B-segment และอีโคคาร์เฟส 2 พร้อมกัน |

---

## 7) สิ่งที่ตัดสินใจแล้ว vs คำถามเหลือให้เจ้าของตัดสิน

### ตัดสินใจแล้ว (ในเอกสารนี้)

- ใช้แกน 2 ชั้น (attribute vocabulary ด้วย enum + entity naming ด้วย `AliasMapping`/`EvidenceLink` ที่มีอยู่แล้ว) **ไม่สร้างตารางศัพท์กลางตัวเดียว** (VocabConcept/BrandTerm) — ยังไม่มีข้อมูลแบรนด์ที่ 2 พิสูจน์ว่าจำเป็นต้องมี abstraction ระดับนั้น เทียบต้นทุน (schema surface ใหญ่, ต้อง join ทุก query) กับมูลค่าวันนี้ (1 แบรนด์ 41 variant) ยังไม่คุ้ม — ถ้าแบรนด์ที่ 2-3 มาแล้วพบว่า enum โตไม่ทัน ค่อยพิจารณาใหม่
- `HybridArchitecture` เป็น enum เดี่ยว (ไม่ใช่ dynamic lookup) แม้วิจัยชี้ว่าโดเมนนี้เสี่ยงโตเร็ว — ใช้ `OTHER` + raw text + editorial gate ก่อน seed แบรนด์ใหม่แทนการสร้างกลไก lookup คู่ขนาน
- ไม่ทำ `TrimTier`/tier ข้ามแบรนด์ในรูปแบบใดๆ — ไม่มี ontology ยืนยันได้ว่าระดับเกรดเทียบเท่ากันข้ามแบรนด์ `marketingLine` (free text) พอสำหรับสถานะข้อมูลตอนนี้
- ดัน `CabType`/`RideHeightClass` มาไว้ Phase 2 (ไม่รอ deferred ถึง Phase 4) เพราะเป็น additive ล้วน ความเสี่ยงต่ำ และเป็น pain point ใหญ่สุดของตลาดกระบะไทย
- `Feature`/`TrimFeature` ยัง defer ไป Phase 4 แม้เป็นหัวใจของโจทย์ เพราะขอบเขตงานใหญ่กว่าจุดอื่นชัดเจน — ship schema ก่อน ไม่ backfill เต็มทันที
- **motor type (PMSM/induction)** ที่ปนอยู่ใน `Motor.locationRaw` — จงใจ **ไม่** canonicalize รอบนี้ (deferred ไป Phase 5) เพราะยังไม่มีคำถามผลิตภัณฑ์ที่ต้องใช้มันกรอง/เทียบ ต่างจาก layout (front/rear/dual) ที่มีคำถามชัดแล้ว ("รถมอเตอร์คู่ทั้งหมด")

### คำถามเหลือให้เบสตัดสิน

1. **ลำดับ priority ถ้าเวลาจำกัด** — Phase 1 (fuel/aspiration, แก้บั๊ก filter จริง) ต้องทำก่อนเสมอ แต่ Phase 2 (cab type) กับ Phase 3 (charging/range) อยากได้อันไหนก่อนถ้าไม่สามารถทำพร้อมกัน
2. **เส้นตายสำหรับแถว `AWD`/`FOUR_WD` legacy** — ปล่อยให้ค้างเป็น "ยังไม่ verify" ไปเรื่อยๆ ได้ไหม หรือควรมี deadline ให้ไล่ verify ทีละคัน (งาน ops ไม่ใช่งาน schema)
3. **ขอบเขต ADAS master data เริ่มต้น (Phase 4)** — เริ่มแค่ AEB/ACC/LKA (3 concept ที่มีหลักฐาน Toyota Safety Sense ชัดสุด) พอไหม หรืออยากได้ครอบคลุมกว่านั้นตั้งแต่วันแรก (แลกกับต้องหาหลักฐานเพิ่ม)
4. **`AliasMapping.brandId` บังคับกรอกเมื่อไหร่** — ตอนนี้ nullable ใน DB (กันพังของเดิม, ยังไม่มี validation ระดับ DB ว่าตรงกับ FK chain จริง — ต้องพึ่ง validation ระดับ application เท่านั้น) แต่ทาง editorial บังคับกรอกเสมอเมื่อ entityType เกี่ยวกับชื่อการตลาด ควรมีเส้นตายเปลี่ยนเป็น NOT NULL จริงในระดับ DB ไหมเมื่อมีข้อมูลมากพอ
5. **`maxPowerHp` → `maxPowerPs`** — คำถามค้างเดิม (ค่าจริงเป็น PS ไม่ใช่ hp) เชื่อมกับปัญหาภาษากลางเรื่องหน่วยวัดโดยตรง (§6 หมวดหน่วยกำลัง) แต่เป็นคนละ scope จากเอกสารนี้ — ยังรอเบสตอบแยกต่างหาก
6. **ทีม/เวลาสำหรับงาน backfill/reclassify** — มีประมาณการคร่าวๆ แล้วใน §5 (15–35 ชม. ต่อแบรนด์ใหม่ขนาดใกล้เคียง Toyota) แต่ใครเป็นคนทำจริง (เบส/AI session/ทั้งคู่) ยังไม่ตัดสินใจ

---

---

## 8) สถานะการ apply (2026-07-20 — เบสอนุมัติ "ทำเลย")

ทุกเฟสทำจริงแล้วตามลำดับ พร้อม verify อัตโนมัติ 24 ข้อ (`prisma/ops/verify-vocab.ts` — รันซ้ำได้ทุกเมื่อ) + lint/tsc/build ผ่าน + เปิด 5 หน้าจริง (curl + screenshot):

| เฟส | สถานะ | ผลจริง |
|---|---|---|
| 0 Governance | ✅ | `EntityType`/`DiscountType` enum แปลงพร้อม UPDATE ค่าเดิม 20 แถว · `AliasMapping.brandId` · **เพิ่ม `MEDIA` ใน EvidenceSourceType** (คำถามค้างเดิม — ตอบแล้ว): แถวสื่อ 9 แถวที่เคย map ชั่วคราวเป็น EDITORIAL ย้ายเป็น MEDIA, EDITORIAL เหลือความหมายจริง "ทีมข้อมูลตรวจทาน" |
| 1 Attribute วิกฤต | ✅ | rename SQL มือ (`fuelType→fuelTypeRaw`, `aspiration→aspirationRaw`, **`maxPowerHp→maxPowerPs`** — คำถามค้างเดิมอีกข้อ ตอบแล้ว) · backfill 9 เครื่องยนต์ (ดีเซล 5 = DIESEL+TURBO known · เบนซิน 4 = GASOLINE known, aspiration=unknown เพราะ spec ไม่ระบุ — ไม่เดา) + EvidenceLink 14 · แก้จุดรั่ว specLine ทั้ง 3 จุด (`queries.ts` fuelType/aspiration/transmission-fallback) |
| 2 โครงสร้าง/ขับเคลื่อน/กระบะ | ✅ | E-CVT split: HEV 5 รุ่นย้ายจากแถว CVT (ที่แชร์กับ ICE — สร้างแถวใหม่ ไม่ทับ) → `E_CVT_POWER_SPLIT` · cabType 4 derivative · rideHeight 24 trim ครบ (Prerunner 6 = HIGH_RIDER · 4WD/AWD/ไม่ใช่กระบะ = NOT_APPLICABLE — รวม Travo-e ที่เป็น AWD มอเตอร์คู่) · Yaris Ativ `ECO_CAR→SUBCOMPACT` + EDITORIAL evidence (`ecoCarPhase` คง null รอหลักฐานภาษี) · chassisType/platformName ทุก generation (IMV/e-TNGA/TNGA/DNGA ดึงจากชื่อเดิม) · Motor.layout (FRONT/DUAL known 3 ตัว) · Battery.chemistry → **unknown โดยตั้งใจ** ("ลิเธียมไอออน" หยาบเกิน map) |
| 3 Charging/range/grade/hybrid | ✅ | gradeCode 23 ตัวดึงจาก notes · NEDC 2 รุ่น · สเปกชาร์จ 2 แบต (bZ4X AC22/DC150 · Travo-e AC11/DC125) · HEV 5 = `POWER_SPLIT` known · ICE/BEV = not_applicable |
| 4 Feature/ADAS | ✅ โครง | ตาราง `Feature`/`TrimFeature` + partial unique index 2 ตัว (SQL มือ — db push ไม่ลบ ตรวจแล้ว) · **ยังไม่ seed ข้อมูล ADAS — ต้อง research หลักฐานต่อ trim จาก toyota.co.th ก่อน (งานรอบหน้า)** |
| 5 Backlog | ⏳ | reclassify legacy AWD/FOUR_WD subtype · `Trim.marketingLine` เติมแล้วบางส่วน (7 ไลน์) · motor type (PMSM) · `ecoCarPhase` รอหลักฐาน · seed ADAS 3 ฟีเจอร์แรก |

จุดที่ต่างจากร่างสเปกเดิม (ตัดสินใจตอน apply พร้อมเหตุผลในเนื้อเอกสารแล้ว): (1) `rideHeightClass` อยู่ที่ `Trim` ไม่ใช่ `Derivative` — ข้อมูลจริง Prerunner/4TREX ปนใน derivative เดียว (2) rideHeight ของกระบะ AWD = NOT_APPLICABLE (แกนนี้ครอบเฉพาะ 2WD) (3) เพิ่ม `MEDIA` enum เกินร่างเดิม — ปิดคำถามค้างของเบสไปในตัว

**หมายเหตุเทคนิคสำหรับ AI session ถัดไป:** prisma CLI ต้องรันด้วย `PRISMA_CLI_DIRECT=1` (สลับไป DIRECT_URL 5432 ใน `prisma.config.ts` — pooler 6543 ทำ CLI ค้าง) · สคริปต์ migrate/backfill/verify ทั้งหมดอยู่ `prisma/ops/` (เก็บเป็น audit trail — อ่าน README ในโฟลเดอร์)

*อ้างอิงโค้ด/ข้อมูลจริงที่ตรวจสอบแล้ว: `src/lib/queries.ts`, `src/lib/labels.ts`, `src/components/car-database-explorer.tsx`, `src/app/cars/[slug]/page.tsx`, `src/app/brands/[slug]/page.tsx`, `prisma/schema.prisma`, `prisma/seed.ts`, `prisma/seed-data.ts`, `prisma/ops/*`*
