// CARMETA seed data — ข้อมูลจริง Toyota 5 nameplate (research + adversarial verify 2026-07-19)
// ทุกราคา verified 100% กับหน้า/ API ทางการของ toyota.co.th ณ วันที่ตรวจ · generate จาก workflow wf_827f82de-ed0
// ห้ามแก้ตัวเลขในไฟล์นี้โดยไม่มีหลักฐานใหม่ (evidence-first)

import type { SeedData } from "./seed-types";

export const seedData: SeedData = {
  "brand": {
    "slug": "toyota",
    "name": "Toyota",
    "officialName": "บริษัท โตโยต้า มอเตอร์ ประเทศไทย จำกัด (Toyota Motor Thailand Co., Ltd.)",
    "countryOrigin": "Japan",
    "parentCompany": "Toyota Motor Corporation"
  },
  "marketPresence": {
    "market": "TH",
    "distributorName": "Toyota Motor Thailand Co., Ltd.",
    "channel": "เครือข่ายผู้แทนจำหน่ายอย่างเป็นทางการ (authorized dealer network) — 152 ราย, โชว์รูม 447 แห่งทั่วประเทศ (ตามหน้า company profile ของ toyota.co.th ณ วันที่เข้าถึง)",
    "operationFrom": "1962-10-05",
    "notes": "TMT ก่อตั้ง 5 ตุลาคม 2505 (1962) โดย Toyota Motor Co., Ltd. และ Toyota Motor Sales Co., Ltd. ลงทุนเท่ากัน เพื่อประกอบรถแบบ knockdown · ก่อนหน้านั้น Toyota Motor Sales เปิดสาขากรุงเทพฯ เพื่อนำเข้า/จำหน่ายตั้งแต่ 16 มิ.ย. 1957 และควบรวมเข้า TMT ปี 1967 · สถานะปัจจุบัน: บริษัทลูกด้านผลิต+จัดจำหน่ายของ Toyota Motor Corporation ในไทย · ทุนจดทะเบียน 7,520 ล้านบาท · พนักงาน 13,271 คน · โรงงาน 3 แห่ง: Samrong (240,000 คัน/ปี), Gateway (300,000 คัน/ปี), Ban Pho (230,000 คัน/ปี) · importerName = null เพรา"
  },
  "brandEvidenceKeys": [
    "ev25",
    "ev26",
    "ev27",
    "ev28"
  ],
  "evidences": [
    {
      "key": "ev01",
      "sourceType": "MANUFACTURER_OFFICIAL",
      "publisher": "Toyota Motor Thailand",
      "title": "Toyota bZ4X — เกรดและราคา (หน้าทางการ)",
      "url": "https://www.toyota.co.th/model/bz4x/grade",
      "checkedDate": "2026-07-19",
      "confidence": "HIGH",
      "notes": "ราคาทั้ง 2 รุ่นย่อย (FWD 1,529,000 / AWD 1,649,000) + ตารางสเปกเต็มต่อเกรด (มอเตอร์ 165/252 kW, แรงบิด 269/170 Nm, แบต 73.11 kWh 384.8V 26 โมดูล, NEDC 600/570 กม., AC 22 kW / DC 150 kW, 5 ที่นั่ง, eAxle, grade_code) — อ่านจาก __NUXT_DATA__ payload ที่ฝังในหน้า (fetch สด 2026-07-19)"
    },
    {
      "key": "ev02",
      "sourceType": "MEDIA",
      "publisher": "HeadlightMag",
      "title": "ราคาอย่างเป็นทางการ Toyota bZ4X Minorchange : 1,529,000 – 1,649,000 บาท | วิ่งไกลสุด 600 km. (NEDC)",
      "url": "https://www.headlightmag.com/official-price-toyota-bz4x-minorchange-2025-2/",
      "checkedDate": "2026-07-19",
      "confidence": "MEDIUM",
      "publishedDate": "2025-11-07",
      "notes": "สื่อภายนอก (mapping ชั่วคราวเป็น EDITORIAL — schema ยังไม่มีค่า enum MEDIA) · วันที่เปิดราคารุ่น Minorchange ในไทย (7 พ.ย. 2025) · ยืนยันราคาตรงกับหน้าเว็บทางการ · นำเข้า CBU ญี่ปุ่น เข้ามาตรการ EV3.5 · FWD 165 kW / NEDC 600 กม. · AWD 252 kW / NEDC 570 กม."
    },
    {
      "key": "ev03",
      "sourceType": "MEDIA",
      "publisher": "AutoLifeThailand",
      "title": "ราคาอย่างเป็นทางการ Toyota bZ4X 4WD รถไฟฟ้า100% : 1,836,000 บาท* แบต 71.4 kWh วิ่งไกล 411 km.",
      "url": "https://autolifethailand.tv/official-price-toyota-bz4x-thailand-repost/",
      "checkedDate": "2026-07-19",
      "confidence": "MEDIUM",
      "publishedDate": "2023-06-28",
      "notes": "สื่อภายนอก (mapping ชั่วคราวเป็น EDITORIAL — schema ยังไม่มีค่า enum MEDIA) · เจนแรกเปิดขายในไทย 9 พ.ย. 2022 เวลา 20:00 ราคา 1,836,000 บาท (จากราคาเต็ม 1,996,500 หลังส่วนลดมาตรการ EV) · สเปกเจนแรก: AWD อย่างเดียว แบต 71.4 kWh WLTP 411 กม. 218 แรงม้า 337 Nm · ล็อตแรก ~40 คัน ธ.ค. 2022"
    },
    {
      "key": "ev04",
      "sourceType": "MANUFACTURER_OFFICIAL",
      "publisher": "Toyota Motor Thailand (toyota.co.th)",
      "title": "Toyota TH official model API — Fortuner Leader (ข้อมูลชุดเดียวกับหน้า /model/fortuner_leader/grade)",
      "url": "https://www.toyota.co.th/model/api/car/?series_code=fortuner_leader",
      "checkedDate": "2026-07-19",
      "confidence": "HIGH",
      "notes": "ราคา + สเปกเต็ม (เครื่องยนต์/เกียร์/ขับเคลื่อน/ที่นั่ง/grade_code) ทั้ง 5 รุ่นย่อยของไลน์ Leader · model_year 102025 · schema_vehicle_type \"D-segment SUV\""
    },
    {
      "key": "ev05",
      "sourceType": "MANUFACTURER_OFFICIAL",
      "publisher": "Toyota Motor Thailand (toyota.co.th)",
      "title": "Toyota TH official model API — Fortuner Legender",
      "url": "https://www.toyota.co.th/model/api/car/?series_code=fortuner_legender",
      "checkedDate": "2026-07-19",
      "confidence": "HIGH",
      "notes": "ราคา + สเปกเต็มทั้ง 4 รุ่นย่อยของไลน์ Legender · model_year 032024"
    },
    {
      "key": "ev06",
      "sourceType": "MANUFACTURER_OFFICIAL",
      "publisher": "Toyota Motor Thailand (toyota.co.th)",
      "title": "Toyota TH official model API — Fortuner GR Sport",
      "url": "https://www.toyota.co.th/model/api/car/?series_code=fortuner_grsport",
      "checkedDate": "2026-07-19",
      "confidence": "HIGH",
      "notes": "ราคา + สเปกเต็มของ 2.8 GR Sport 4WD (224 PS/550 Nm) · remark สีพิเศษ +20,000 บาท"
    },
    {
      "key": "ev07",
      "sourceType": "MEDIA",
      "publisher": "HeadlightMag",
      "title": "All New 2015 Toyota Fortuner เปิดโล่งโจ้งเพื่อโชว์ศักดิ์ศรีครั้งใหม่",
      "url": "https://www.headlightmag.com/all-new-2015-toyota-fortuner-unveiled-at-thailand/",
      "checkedDate": "2026-07-19",
      "confidence": "MEDIUM",
      "publishedDate": "2015-07-16",
      "notes": "สื่อภายนอก (mapping ชั่วคราวเป็น EDITORIAL — schema ยังไม่มีค่า enum MEDIA) · วันเปิดตัวเจน 2 ในไทย = 16 กรกฎาคม 2015 · ราคาเปิดตัวแรก 1,199,000–1,599,000 บาท · พัฒนาบนพื้นฐาน Hilux"
    },
    {
      "key": "ev08",
      "sourceType": "MEDIA",
      "publisher": "Wikipedia (ใช้ corroborate รหัสเจนเท่านั้น ไม่ใช้เป็นแหล่งราคา/สเปก)",
      "title": "Toyota Fortuner — Wikipedia",
      "url": "https://en.wikipedia.org/wiki/Toyota_Fortuner",
      "checkedDate": "2026-07-19",
      "confidence": "LOW",
      "notes": "สื่อภายนอก (mapping ชั่วคราวเป็น EDITORIAL — schema ยังไม่มีค่า enum MEDIA) · ชื่อรหัสเจเนอเรชัน 2 = AN150/AN160 และการเปิดตัวพร้อมกันไทย-ออสเตรเลีย 16 ก.ค. 2015 (สอดคล้อง HeadlightMag และ prefix GUN15x/16x ใน grade_code ทางการ)"
    },
    {
      "key": "ev09",
      "sourceType": "MANUFACTURER_OFFICIAL",
      "publisher": "Toyota Motor Thailand",
      "title": "Yaris ATIV — หน้าเกรด/ราคา/สเปกทางการ (สเปกเต็มฝังใน Nuxt payload ของหน้า)",
      "url": "https://www.toyota.co.th/model/yarisativ/grade",
      "checkedDate": "2026-07-19",
      "confidence": "HIGH",
      "notes": "ราคา + สเปกเต็มต่อเกรดของไลน์หลัก 6 เกรด: เครื่อง 3NR-VE 1,197cc 94PS/110Nm · 2NR-VEX 1,496cc 91PS/121Nm + มอเตอร์ 59kW/141Nm ระบบรวม 82kW(111PS) · แบต Li-ion 0.76kWh 177.6V · เกียร์ Super CVT-i / E-CVT · FWD · 5 ที่นั่ง · มิติตัวถัง"
    },
    {
      "key": "ev10",
      "sourceType": "MANUFACTURER_OFFICIAL",
      "publisher": "Toyota Motor Thailand",
      "title": "Yaris ATIV GR Sport — หน้าเกรด/ราคา/สเปกทางการ",
      "url": "https://www.toyota.co.th/model/yarisativ_grsport/grade",
      "checkedDate": "2026-07-19",
      "confidence": "HIGH",
      "notes": "HEV GR Sport 779,000 บาท + สเปกเต็ม (ขุมพลัง HEV เดียวกับ HEV Premium, ล้อ 17 นิ้ว, ช่วงล่าง/พวงมาลัยจูนพิเศษ, ตัวถังยาว 4,440 มม.)"
    },
    {
      "key": "ev11",
      "sourceType": "MEDIA",
      "publisher": "HeadLight Magazine",
      "title": "ราคาอย่างเป็นทางการ All NEW Toyota Yaris ATIV : 549,000 - 699,000 บาท",
      "url": "https://www.headlightmag.com/2022-08-09-price-toyota-yaris-ativ-02/",
      "checkedDate": "2026-07-19",
      "confidence": "MEDIUM",
      "publishedDate": "2022-08-09",
      "notes": "สื่อภายนอก (mapping ชั่วคราวเป็น EDITORIAL — schema ยังไม่มีค่า enum MEDIA) · เจนปัจจุบันเปิดตัวในไทย 9 ส.ค. 2022 · ราคาเปิดตัว 4 เกรด 549,000–699,000 · เครื่อง 3NR-VE 94 PS ตั้งแต่เปิดตัว"
    },
    {
      "key": "ev12",
      "sourceType": "MEDIA",
      "publisher": "HeadLight Magazine",
      "title": "Full Review ทดลองขับ Toyota YARIS ATIV HEV",
      "url": "https://www.headlightmag.com/full-review-2025-toyota-yaris-ativ-hev-hybrid/",
      "checkedDate": "2026-07-19",
      "confidence": "MEDIUM",
      "publishedDate": "2025-09-26",
      "notes": "สื่อภายนอก (mapping ชั่วคราวเป็น EDITORIAL — schema ยังไม่มีค่า enum MEDIA) · รหัสรุ่น NYC100R (HEV) / NGC100R (เบนซิน 1.2) · HEV เปิดตัวในไทย 21 ส.ค. 2025 · แพลตฟอร์ม DNGA ร่วมกับ Yaris Cross · เจนนี้เปิดตัว 9 ส.ค. 2022"
    },
    {
      "key": "ev13",
      "sourceType": "MEDIA",
      "publisher": "AutoLifeThailand",
      "title": "Toyota Yaris ATIV HEV ราคาอย่างเป็นทางการ : 729,000 - 779,000 บาท | ปรับเพิ่ม 10,000 มีผล 1 มกราคม 2569",
      "url": "https://autolifethailand.tv/official-price-toyota-yaris-ativ-hev-2026/",
      "checkedDate": "2026-07-19",
      "confidence": "MEDIUM",
      "publishedDate": "2026-01-02",
      "notes": "สื่อภายนอก (mapping ชั่วคราวเป็น EDITORIAL — schema ยังไม่มีค่า enum MEDIA) · ยืนยันราคา HEV Premium 729,000 / HEV GR Sport 779,000 มีผล 1 ม.ค. 2026 (ตรงกับ API ทางการ) + สเปกไฮบริด 111 PS แบต Li-ion เกียร์ e-CVT"
    },
    {
      "key": "ev14",
      "sourceType": "MANUFACTURER_OFFICIAL",
      "publisher": "Toyota Motor Thailand",
      "title": "Hilux Travo Standard Cab 4TREX | Specification — toyota.co.th",
      "url": "https://www.toyota.co.th/model/hilux_travo_standard_4trex/specification",
      "checkedDate": "2026-07-19",
      "confidence": "HIGH",
      "notes": "ราคา + สเปก 2 variant ของ Standard Cab 4TREX (MT 767,000 / AT 819,000) · ขับเคลื่อน 4 ล้อพร้อม Differential Lock ทั้งคู่"
    },
    {
      "key": "ev15",
      "sourceType": "MANUFACTURER_OFFICIAL",
      "publisher": "Toyota Motor Thailand",
      "title": "Hilux Travo Prerunner & 4TREX | Specification — toyota.co.th",
      "url": "https://www.toyota.co.th/model/hilux_travo_prerunner_4trex/specification",
      "checkedDate": "2026-07-19",
      "confidence": "HIGH",
      "notes": "ราคา + สเปกครบ 11 variant ของไลน์ Prerunner & 4TREX (Smart Cab / Double Cab): เครื่อง 1GD-FTV 2,755 ซีซี 150 kW (204 PS), AT 500 Nm @1,600–2,800 / MT 420 Nm @1,400–3,400, ระบบขับเคลื่อน (Prerunner = ล้อหลัง / 4TREX = 4 ล้อ + diff lock), เกียร์, จำนวนที่นั่ง, รหัสรุ่น GUN226R/GUN236R"
    },
    {
      "key": "ev16",
      "sourceType": "MANUFACTURER_OFFICIAL",
      "publisher": "Toyota Motor Thailand",
      "title": "Hilux Travo Overland | Specification — toyota.co.th",
      "url": "https://www.toyota.co.th/model/hilux_travo_overland/specification",
      "checkedDate": "2026-07-19",
      "confidence": "HIGH",
      "notes": "ราคา + สเปก 4 variant ของไลน์ Overland (Double Cab AT ทั้งหมด · Prerunner 1,102,000/1,176,000 · 4TREX 1,292,000/1,366,000)"
    },
    {
      "key": "ev17",
      "sourceType": "MANUFACTURER_OFFICIAL",
      "publisher": "Toyota Motor Thailand",
      "title": "Hilux Travo-e | Specification — toyota.co.th",
      "url": "https://www.toyota.co.th/model/hilux_travo_e/specification",
      "checkedDate": "2026-07-19",
      "confidence": "HIGH",
      "notes": "ราคา (1,491,000) + สเปก BEV: มอเตอร์คู่หน้า/หลัง 144 kW (196 PS) รวม, หน้า 82.2 kW/205.5 Nm, หลัง 129.3 kW/268.6 Nm, AWD, eAxle, แบตลิเธียมไอออน 59.2 kWh, ชาร์จ AC 11 kW / DC 125 kW, 5 ที่นั่ง, รหัสรุ่น XPN225R-DTDHST/A1"
    },
    {
      "key": "ev18",
      "sourceType": "MANUFACTURER_OFFICIAL",
      "publisher": "Toyota Motor Corporation",
      "title": "World Premiere of the New Hilux in Asia — Toyota Global Newsroom",
      "url": "https://global.toyota/en/newsroom/toyota/43512628.html",
      "checkedDate": "2026-07-19",
      "confidence": "HIGH",
      "publishedDate": "2025-11-10",
      "notes": "ยืนยัน generation: world premiere Hilux ใหม่ (รวมรุ่น BEV) 10 พ.ย. 2025 ที่กรุงเทพฯ โดย Toyota Motor Asia · สเปก BEV ตรงกับหน้า showroom ไทย (แบต 59.2 kWh, eAxle หน้า+หลัง, ระบบรวม 144 kW, ระยะ 300+ กม.) · แผนทยอยเปิดตัวในเอเชียตั้งแต่ 2026 และ FCEV ในยุโรป/โอเชียเนียตั้งแต่ 2028"
    },
    {
      "key": "ev19",
      "sourceType": "MEDIA",
      "publisher": "paultan.org",
      "title": "2026 Toyota Hilux Travo – heavy facelift, 2.8L diesel standard, EV…",
      "url": "https://paultan.org/2025/11/10/2026-toyota-hilux-travo-heavy-facelift-2-8l-diesel-standard-ev-with-240-km-wltp-range-rm99k-rm192k/",
      "checkedDate": "2026-07-19",
      "confidence": "MEDIUM",
      "publishedDate": "2025-11-10",
      "notes": "สื่อภายนอก (mapping ชั่วคราวเป็น EDITORIAL — schema ยังไม่มีค่า enum MEDIA) · cross-check: เรียกเป็น ninth-generation Hilux บน IMV platform (พร้อมมุมมองว่าเป็น heavy facelift) · เปิดตัว 10 พ.ย. 2025 ก่อน Thai Motor Expo · ช่วงราคาไทย 767,000–1,366,000 + Travo-e 1,491,000 ตรงกับราคาทางการทุกตัว · โครงสร้างไลน์ (Standard/Smart/Double Cab · Prerunner/4TREX/Overland/Travo-e) ตรงก"
    },
    {
      "key": "ev20",
      "sourceType": "MANUFACTURER_OFFICIAL",
      "publisher": "Toyota Motor Thailand (toyota.co.th)",
      "title": "Toyota Corolla Altis | โคโรลล่า อัลติส | รุ่นย่อยและราคา",
      "url": "https://www.toyota.co.th/model/altis/grade",
      "checkedDate": "2026-07-19",
      "confidence": "HIGH",
      "notes": "ราคาไลน์หลัก 3 เกรดเห็นจริงใน HTML ที่ fetch: 1.8G ฿909,000 / HEV Smart ฿949,000 / HEV Premium ฿1,009,000 · ทุกเกรด 5 ที่นั่ง · จำนวนเกรดทั้งหมด 3 เกรด"
    },
    {
      "key": "ev21",
      "sourceType": "MANUFACTURER_OFFICIAL",
      "publisher": "Toyota Motor Thailand (toyota.co.th)",
      "title": "Toyota Corolla Altis GR Sport | รุ่นย่อยและราคา",
      "url": "https://www.toyota.co.th/model/altis_grsport/grade",
      "checkedDate": "2026-07-19",
      "confidence": "HIGH",
      "notes": "ราคา HEV GR Sport ฿1,129,000 เห็นจริงใน HTML ที่ fetch · ไลน์นี้มี 1 เกรด · 5 ที่นั่ง"
    },
    {
      "key": "ev22",
      "sourceType": "MEDIA",
      "publisher": "HeadlightMag",
      "title": "ราคาอย่างเป็นทางการ Toyota Corolla ALTIS (TNGA) 1.6 / 1.8 / 1.8 Hybrid : 829,000 - 1,099,000 บาท",
      "url": "https://www.headlightmag.com/official-price-toyota-corolla-altis-tnga/",
      "checkedDate": "2026-07-19",
      "confidence": "MEDIUM",
      "publishedDate": "2019-09-03",
      "notes": "สื่อภายนอก (mapping ชั่วคราวเป็น EDITORIAL — schema ยังไม่มีค่า enum MEDIA) · เจนปัจจุบัน (TNGA) ประกาศราคาทางการในไทยเมื่อ 3 ก.ย. 2019 → launchYearTH = 2019 · เปิดตัวด้วยเครื่อง 1.6 (125 แรงม้า) / 1.8 (140 แรงม้า) / 1.8 Hybrid (122 แรงม้ารวม) ช่วงราคา 829,000–1,099,000 บาท"
    },
    {
      "key": "ev23",
      "sourceType": "MANUFACTURER_OFFICIAL",
      "publisher": "Toyota Motor Thailand",
      "title": "ข้อมูลรุ่นและราคา — toyota.co.th",
      "url": "https://www.toyota.co.th/model/api/car/?series_code=altis",
      "checkedDate": "2026-07-19",
      "confidence": "HIGH"
    },
    {
      "key": "ev24",
      "sourceType": "MANUFACTURER_OFFICIAL",
      "publisher": "Toyota Motor Thailand (toyota.co.th)",
      "title": "Toyota Corolla Altis | Specification (ข้อมูลเรนเดอร์จาก API ของเว็บเอง: https://www.toyota.co.th/model/api/car/?series_code=altis)",
      "url": "https://www.toyota.co.th/model/altis/specification",
      "checkedDate": "2026-07-19",
      "confidence": "HIGH",
      "notes": "สเปกเต็มทั้ง 3 เกรดไลน์หลัก: 1.8G = 2ZR-FE 1,798cc 103kW(140PS)/6,400 · 172Nm/4,000 · E20 · FWD · 'Automatic E-CVT' · HEV = 2ZR-FXE 1,798cc 72kW(98PS)/5,200 · 142Nm/3,600 + มอเตอร์ 53kW/163Nm/600V + แบตฯ Li-ion 207.2V 56 โมดูล 0.83kWh · กำลังรวม 90kW(122PS) · grade_code ZRE211R/ZWE211R · มิติ 4,630x"
    },
    {
      "key": "ev25",
      "sourceType": "MANUFACTURER_OFFICIAL",
      "publisher": "Toyota Motor Thailand Co., Ltd.",
      "title": "Company Information - Toyota Motor Thailand Co., Ltd.",
      "url": "https://www.toyota.co.th/en/corporate/company_profile",
      "checkedDate": "2026-07-19",
      "confidence": "HIGH",
      "notes": "ชื่อบริษัททางการ (EN) Toyota Motor Thailand Co., Ltd. · ก่อตั้ง 5 October 1962 · ทุนจดทะเบียน 7,520 ล้านบาท · dealer 152 ราย / โชว์รูม 447 แห่ง · พนักงาน 13,271 คน · กำลังผลิต 3 โรงงาน (Samrong/Gateway/Ban Pho)"
    },
    {
      "key": "ev26",
      "sourceType": "MANUFACTURER_OFFICIAL",
      "publisher": "Toyota Motor Thailand Co., Ltd.",
      "title": "ข้อมูลบริษัท - บริษัท โตโยต้า มอเตอร์ ประเทศไทย จำกัด",
      "url": "https://www.toyota.co.th/corporate/company_profile",
      "checkedDate": "2026-07-19",
      "confidence": "HIGH",
      "notes": "ชื่อบริษัททางการภาษาไทย 'บริษัท โตโยต้า มอเตอร์ ประเทศไทย จำกัด' · ก่อตั้ง 5 ตุลาคม 2505 · ทุนจดทะเบียน 7,520 ล้านบาท · ผู้แทนจำหน่าย 152 ราย / โชว์รูม 447 แห่ง"
    },
    {
      "key": "ev27",
      "sourceType": "MANUFACTURER_OFFICIAL",
      "publisher": "Toyota Motor Corporation (Global Newsroom)",
      "title": "Toyota Motor Thailand Marks 60th Anniversary",
      "url": "https://global.toyota/en/newsroom/corporate/38421226.html",
      "checkedDate": "2026-07-19",
      "confidence": "HIGH",
      "publishedDate": "2022-12-14",
      "notes": "บริษัทแม่ = Toyota Motor Corporation (ญี่ปุ่น) — ข้อความตรง: 'Toyota Motor Thailand Co., Ltd. (TMT), its vehicle manufacturing and distribution subsidiary in Thailand' · ยืนยันบทบาท TMT เป็นผู้ผลิต+จัดจำหน่ายในไทย และครบรอบ 60 ปีในปี 2022 (สอดคล้องก่อตั้ง 1962)"
    },
    {
      "key": "ev28",
      "sourceType": "MANUFACTURER_OFFICIAL",
      "publisher": "Toyota Motor Corporation (75 Years of Toyota, official history)",
      "title": "75 Years of TOYOTA — Item 4. Toyota Motor Thailand established",
      "url": "https://www.toyota-global.com/company/history_of_toyota/75years/text/taking_on_the_automotive_business/chapter2/section9/item4_a.html",
      "checkedDate": "2026-07-19",
      "confidence": "HIGH",
      "notes": "TMT ก่อตั้ง October 1962 โดย Toyota Motor Co., Ltd. + Toyota Motor Sales Co., Ltd. ลงทุนเท่ากัน เพื่อทำ knockdown production · Toyota Motor Sales เปิดสาขากรุงเทพฯ 16 June 1957 (นำเข้า/ขาย) และควบรวมกับ TMT ปี 1967 · เริ่มประกอบ Corolla ปี 1969"
    },
    {
      "key": "ev29",
      "sourceType": "MANUFACTURER_OFFICIAL",
      "publisher": "Toyota Motor Corporation",
      "title": "ข้อมูลรุ่นและราคา — toyota.co.th",
      "url": "https://global.toyota/en/newsroom/toyota/42658933.html",
      "checkedDate": "2026-07-19",
      "confidence": "HIGH"
    }
  ],
  "nameplates": [
    {
      "slug": "bz4x",
      "name": "bZ4X",
      "segment": "SUV_COMPACT",
      "lifecycleStatus": "CURRENT",
      "summary": "SUV ไฟฟ้าล้วน (BEV) 5 ที่นั่ง — รถนั่ง BEV รุ่นเดียวในไลน์อัป Toyota ไทยปัจจุบัน · โฉม Minorchange (พ.ย. 2025) นำเข้า CBU จากญี่ปุ่น เข้ามาตรการ EV3.5 · มี 2 รุ่นย่อย: FWD และ AWD",
      "generations": [
        {
          "code": "XEAM11R/XEAM15R",
          "name": "เจนแรก · แพลตฟอร์ม e-TNGA",
          "launchYear": 2022,
          "summary": "เจนแรกเปิดตัวในไทย 9 พ.ย. 2022 ราคา 1,836,000 บาท (AWD เท่านั้น, แบต 71.4 kWh, WLTP 411 กม.) · รุ่น Minorchange เปิดราคาไทย 7 พ.ย. 2025: แบตใหม่ 73.11 kWh, เพิ่มรุ่น FWD (165 kW, NEDC 600 กม.) และ AWD (252 kW, NEDC 570 กม.), นำเข้า CBU ญี่ปุ่น เข้ามาตรการ EV3.5 · แพลตฟอร์ม e-TNGA มอเตอร์ PMSM เกียร์ eAxle",
          "evidenceKeys": [
            "ev01",
            "ev02",
            "ev03"
          ],
          "derivatives": [
            {
              "bodyType": "SUV",
              "phases": [
                {
                  "phaseType": "FACELIFT",
                  "name": "Minorchange (MY 11/2025)",
                  "effectiveFrom": "2025-11-07",
                  "trims": [
                    {
                      "name": "FWD",
                      "variants": [
                        {
                          "name": "bZ4X FWD",
                          "powertrainType": "BEV",
                          "modelYear": 2025,
                          "seatCount": 5,
                          "motor": {
                            "count": 1,
                            "location": "หน้า (front eAxle, PMSM)",
                            "maxPowerKw": 165,
                            "maxTorqueNm": 269
                          },
                          "battery": {
                            "capacityKwh": 73.11,
                            "chemistry": "ลิเธียมไอออน"
                          },
                          "transmission": {
                            "type": "SINGLE_SPEED",
                            "gears": 1
                          },
                          "drivetrain": {
                            "type": "FWD"
                          },
                          "notes": "grade_code ทางการ XEAM11R-MWDHQW/N4 · MY 11/2025 · สเปกทางการระบุมอเตอร์หน้า rated 167 kW (227 PS) แต่กำลังสูงสุดรวมของระบบ = 165 kW (224 PS) — บันทึก 165 ตามค่า Max Output · NEDC 600 กม. · ชาร์จ AC Type 2 สูงสุด 22 kW / DC CCS2 สูงสุด 150 kW · ล้อ 20 นิ้ว ยาง 235/50 R20 · ลำโพง 6 ตำแหน่ง · ราคาเท่ากับตอนเปิดตัว 7 พ.ย. 2025 (ยังไม่เปลี่ยน)",
                          "price": {
                            "amount": 1529000,
                            "observedDate": "2026-07-19",
                            "evidenceKey": "ev01"
                          }
                        }
                      ]
                    },
                    {
                      "name": "AWD",
                      "variants": [
                        {
                          "name": "bZ4X AWD",
                          "powertrainType": "BEV",
                          "modelYear": 2025,
                          "seatCount": 5,
                          "motor": {
                            "count": 2,
                            "location": "หน้า + หลัง (dual eAxle, PMSM)",
                            "maxPowerKw": 252
                          },
                          "battery": {
                            "capacityKwh": 73.11,
                            "chemistry": "ลิเธียมไอออน"
                          },
                          "transmission": {
                            "type": "SINGLE_SPEED",
                            "gears": 1
                          },
                          "drivetrain": {
                            "type": "AWD"
                          },
                          "notes": "grade_code ทางการ XEAM15R-MWDHQW/A4 · MY 11/2025 · กำลังรวม 252 kW (343 PS) — มอเตอร์หน้า 167 kW / 269 Nm + มอเตอร์หลัง 88 kW / 170 Nm (หน้าเว็บไม่ระบุแรงบิดรวม จึงไม่บันทึก) · NEDC 570 กม. · AC 22 kW / DC 150 kW · เพิ่มจาก FWD: X-Mode with Grip Control, Downhill Assist Control, ลำโพง JBL 9 ตำแหน่ง · ราคาเท่ากับตอนเปิดตัว 7 พ.ย. 2025",
                          "price": {
                            "amount": 1649000,
                            "observedDate": "2026-07-19",
                            "evidenceKey": "ev01"
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "slug": "fortuner",
      "name": "Fortuner",
      "segment": "PPV",
      "lifecycleStatus": "CURRENT",
      "summary": "PPV 7 ที่นั่งบนพื้นฐานโครงสร้าง Hilux · ไลน์อัปไทยแบ่ง 3 ไลน์: Leader / Legender / GR Sport รวม 10 รุ่นย่อย · เครื่องดีเซล 2.4 และ 2.8 เกียร์อัตโนมัติ 6 จังหวะทุกรุ่น",
      "generations": [
        {
          "code": "AN150/AN160 (GUN15xR/16xR)",
          "name": "เจเนอเรชัน 2",
          "launchYear": 2015,
          "summary": "เจน 2 เปิดตัวในไทย 16 กรกฎาคม 2015 (HeadlightMag รายงานวันเปิดตัวจริง ราคาเริ่มแรก 1,199,000–1,599,000) พัฒนาบนแชสซีตระกูล Hilux · ผ่าน facelift/ปรับไลน์หลายรอบ ล่าสุดโครงสร้างไลน์อัปไทยแตกเป็น 3 ไลน์: GR Sport + Legender ปรับ MY 03/2024 และ Leader ปรับ MY 10/2025 · รหัสตัวถังปัจจุบันเห็นตรงจาก grade_code ทางการ: GUN165R=2.4 2WD, GUN155R=2.4 4WD, GUN166R=2.8 2WD, GUN156R=2.8 4WD",
          "evidenceKeys": [
            "ev07",
            "ev04",
            "ev08"
          ],
          "derivatives": [
            {
              "bodyType": "PPV",
              "phases": [
                {
                  "phaseType": "FACELIFT",
                  "name": "ไลน์อัปปัจจุบัน (Legender/GR Sport MY 03/2024 · Leader MY 10/2025)",
                  "trims": [
                    {
                      "name": "Leader S",
                      "variants": [
                        {
                          "name": "2.4 Leader S",
                          "powertrainType": "ICE",
                          "modelYear": 2025,
                          "seatCount": 7,
                          "engine": {
                            "code": "2GD-FTV (High)",
                            "displacementCc": 2393,
                            "cylinders": 4,
                            "aspiration": "VN Turbo + Intercooler",
                            "fuelType": "ดีเซล",
                            "maxPowerPs": 150,
                            "maxTorqueNm": 400
                          },
                          "transmission": {
                            "type": "AUTOMATIC",
                            "gears": 6
                          },
                          "drivetrain": {
                            "type": "RWD"
                          },
                          "notes": "grade_code GUN165R-STTLXT/A5 · MY 10/2025 · กำลังสูงสุดตามสเปกทางการ 110 kW (150 PS)/3,400 rpm · แรงบิด 400 Nm/1,600–2,000 rpm · เกียร์ 6AT Sequential Shift (รุ่นเดียวของ Leader ที่ไม่มี Paddle Shift) · ล้ออัลลอย 265/65R17 · สเปกทางการระบุ \"2 Wheel Drive\"",
                          "price": {
                            "amount": 1239000,
                            "observedDate": "2026-07-19",
                            "evidenceKey": "ev04"
                          }
                        }
                      ]
                    },
                    {
                      "name": "Leader G",
                      "variants": [
                        {
                          "name": "2.4 Leader G",
                          "powertrainType": "ICE",
                          "modelYear": 2025,
                          "seatCount": 7,
                          "engine": {
                            "code": "2GD-FTV (High)",
                            "displacementCc": 2393,
                            "cylinders": 4,
                            "aspiration": "VN Turbo + Intercooler",
                            "fuelType": "ดีเซล",
                            "maxPowerPs": 150,
                            "maxTorqueNm": 400
                          },
                          "transmission": {
                            "type": "AUTOMATIC",
                            "gears": 6
                          },
                          "drivetrain": {
                            "type": "RWD"
                          },
                          "notes": "grade_code GUN165R-STTSXT/A5 · MY 10/2025 · 110 kW (150 PS)/3,400 rpm · 400 Nm/1,600–2,000 rpm · 6AT Sequential Shift + Paddle Shift · ล้ออัลลอย 265/60R18",
                          "price": {
                            "amount": 1400000,
                            "observedDate": "2026-07-19",
                            "evidenceKey": "ev04"
                          }
                        }
                      ]
                    },
                    {
                      "name": "Leader G+",
                      "variants": [
                        {
                          "name": "2.4 Leader G+",
                          "powertrainType": "ICE",
                          "modelYear": 2025,
                          "seatCount": 7,
                          "engine": {
                            "code": "2GD-FTV (High)",
                            "displacementCc": 2393,
                            "cylinders": 4,
                            "aspiration": "VN Turbo + Intercooler",
                            "fuelType": "ดีเซล",
                            "maxPowerPs": 150,
                            "maxTorqueNm": 400
                          },
                          "transmission": {
                            "type": "AUTOMATIC",
                            "gears": 6
                          },
                          "drivetrain": {
                            "type": "RWD"
                          },
                          "notes": "grade_code GUN165R-STTSXT/XT · MY 10/2025 · 110 kW (150 PS)/3,400 rpm · 400 Nm/1,600–2,000 rpm · 6AT Sequential Shift + Paddle Shift · ล้ออัลลอย 265/60R18 สีเทา (Grey Color)",
                          "price": {
                            "amount": 1439000,
                            "observedDate": "2026-07-19",
                            "evidenceKey": "ev04"
                          }
                        }
                      ]
                    },
                    {
                      "name": "Leader V",
                      "variants": [
                        {
                          "name": "2.4 Leader V",
                          "powertrainType": "ICE",
                          "modelYear": 2025,
                          "seatCount": 7,
                          "engine": {
                            "code": "2GD-FTV (High)",
                            "displacementCc": 2393,
                            "cylinders": 4,
                            "aspiration": "VN Turbo + Intercooler",
                            "fuelType": "ดีเซล",
                            "maxPowerPs": 150,
                            "maxTorqueNm": 400
                          },
                          "transmission": {
                            "type": "AUTOMATIC",
                            "gears": 6
                          },
                          "drivetrain": {
                            "type": "RWD"
                          },
                          "notes": "grade_code GUN165R-STTHXT/A5 · MY 10/2025 · 110 kW (150 PS)/3,400 rpm · 400 Nm/1,600–2,000 rpm · 6AT Sequential Shift + Paddle Shift · ไฟหน้า Bi-Beam LED · เบาะหนัง ปรับไฟฟ้า 8 ทิศทางคู่หน้า · ล้ออัลลอย 265/60R18",
                          "price": {
                            "amount": 1530000,
                            "observedDate": "2026-07-19",
                            "evidenceKey": "ev04"
                          }
                        },
                        {
                          "name": "2.4 Leader V 4WD",
                          "powertrainType": "ICE",
                          "modelYear": 2025,
                          "seatCount": 7,
                          "engine": {
                            "code": "2GD-FTV (High)",
                            "displacementCc": 2393,
                            "cylinders": 4,
                            "aspiration": "VN Turbo + Intercooler",
                            "fuelType": "ดีเซล",
                            "maxPowerPs": 150,
                            "maxTorqueNm": 400
                          },
                          "transmission": {
                            "type": "AUTOMATIC",
                            "gears": 6
                          },
                          "drivetrain": {
                            "type": "FOUR_WD"
                          },
                          "notes": "grade_code GUN155R-STTHXT/A5 · MY 10/2025 · 110 kW (150 PS)/3,400 rpm · 400 Nm/1,600–2,000 rpm · 6AT Sequential Shift + Paddle Shift · สเปกทางการระบุ \"4 Wheel Drive\" · ล้ออัลลอย 265/60R18 · รุ่นเดียวของไลน์ Leader ที่เป็น 4WD",
                          "price": {
                            "amount": 1600000,
                            "observedDate": "2026-07-19",
                            "evidenceKey": "ev04"
                          }
                        }
                      ]
                    },
                    {
                      "name": "Legender",
                      "variants": [
                        {
                          "name": "2.4 Legender",
                          "powertrainType": "ICE",
                          "modelYear": 2024,
                          "seatCount": 7,
                          "engine": {
                            "code": "2GD-FTV (High)",
                            "displacementCc": 2393,
                            "cylinders": 4,
                            "aspiration": "VN Turbo + Intercooler",
                            "fuelType": "ดีเซล",
                            "maxPowerPs": 150,
                            "maxTorqueNm": 400
                          },
                          "transmission": {
                            "type": "AUTOMATIC",
                            "gears": 6
                          },
                          "drivetrain": {
                            "type": "RWD"
                          },
                          "notes": "grade_code GUN165R-STTHXT/B5 · MY 03/2024 · 110 kW (150 PS)/3,400 rpm · 400 Nm/1,600–2,000 rpm · 6AT Sequential Shift + Paddle Shift · ช่วงล่างมี Shock absorber เฉพาะ Legender · ล้ออัลลอย 265/50R20",
                          "price": {
                            "amount": 1643000,
                            "observedDate": "2026-07-19",
                            "evidenceKey": "ev05"
                          }
                        },
                        {
                          "name": "2.4 Legender 4WD",
                          "powertrainType": "ICE",
                          "modelYear": 2024,
                          "seatCount": 7,
                          "engine": {
                            "code": "2GD-FTV (High)",
                            "displacementCc": 2393,
                            "cylinders": 4,
                            "aspiration": "VN Turbo + Intercooler",
                            "fuelType": "ดีเซล",
                            "maxPowerPs": 150,
                            "maxTorqueNm": 400
                          },
                          "transmission": {
                            "type": "AUTOMATIC",
                            "gears": 6
                          },
                          "drivetrain": {
                            "type": "FOUR_WD"
                          },
                          "notes": "grade_code GUN155R-STTHXT/B5 · MY 03/2024 · 110 kW (150 PS)/3,400 rpm · 400 Nm/1,600–2,000 rpm · 6AT Sequential Shift + Paddle Shift · ล้ออัลลอย 265/50R20",
                          "price": {
                            "amount": 1713000,
                            "observedDate": "2026-07-19",
                            "evidenceKey": "ev05"
                          }
                        },
                        {
                          "name": "2.8 Legender",
                          "powertrainType": "ICE",
                          "modelYear": 2024,
                          "seatCount": 7,
                          "engine": {
                            "code": "1GD-FTV (High)",
                            "displacementCc": 2755,
                            "cylinders": 4,
                            "aspiration": "VN Turbo + Intercooler",
                            "fuelType": "ดีเซล",
                            "maxPowerPs": 204,
                            "maxTorqueNm": 500
                          },
                          "transmission": {
                            "type": "AUTOMATIC",
                            "gears": 6
                          },
                          "drivetrain": {
                            "type": "RWD"
                          },
                          "notes": "grade_code GUN166R-STTHXT/B5 · MY 03/2024 · 150 kW (204 PS)/3,000–3,400 rpm · 500 Nm/1,600–2,800 rpm · 6AT Sequential Shift + Paddle Shift · ล้ออัลลอย 265/50R20",
                          "price": {
                            "amount": 1835000,
                            "observedDate": "2026-07-19",
                            "evidenceKey": "ev05"
                          }
                        },
                        {
                          "name": "2.8 Legender 4WD",
                          "powertrainType": "ICE",
                          "modelYear": 2024,
                          "seatCount": 7,
                          "engine": {
                            "code": "1GD-FTV (High)",
                            "displacementCc": 2755,
                            "cylinders": 4,
                            "aspiration": "VN Turbo + Intercooler",
                            "fuelType": "ดีเซล",
                            "maxPowerPs": 204,
                            "maxTorqueNm": 500
                          },
                          "transmission": {
                            "type": "AUTOMATIC",
                            "gears": 6
                          },
                          "drivetrain": {
                            "type": "FOUR_WD"
                          },
                          "notes": "grade_code GUN156R-STTHXT/B5 · MY 03/2024 · 150 kW (204 PS)/3,000–3,400 rpm · 500 Nm/1,600–2,800 rpm · 6AT Sequential Shift + Paddle Shift · ล้ออัลลอย 265/50R20 · ตัวท็อปของไลน์ Legender",
                          "price": {
                            "amount": 1904000,
                            "observedDate": "2026-07-19",
                            "evidenceKey": "ev05"
                          }
                        }
                      ]
                    },
                    {
                      "name": "GR Sport",
                      "variants": [
                        {
                          "name": "2.8 GR Sport 4WD",
                          "powertrainType": "ICE",
                          "modelYear": 2024,
                          "seatCount": 7,
                          "engine": {
                            "code": "1GD-FTV (High)",
                            "displacementCc": 2755,
                            "cylinders": 4,
                            "aspiration": "VN Turbo + Intercooler",
                            "fuelType": "ดีเซล",
                            "maxPowerPs": 224,
                            "maxTorqueNm": 550
                          },
                          "transmission": {
                            "type": "AUTOMATIC",
                            "gears": 6
                          },
                          "drivetrain": {
                            "type": "FOUR_WD"
                          },
                          "notes": "grade_code GUN156R-STTHXT/C5 · MY 03/2024 · เครื่อง 1GD-FTV จูนพิเศษ 165 kW (224 PS)/3,000–3,400 rpm · 550 Nm/1,600–2,800 rpm (แรงกว่า Legender 2.8) · 6AT Sequential Shift + Paddle Shift · ช่วงล่าง Monotube Shock absorber เฉพาะ GR Sport · ล้ออัลลอย 20 นิ้ว · สีพิเศษ White Pearl CS Black Top และ Emotional Red Black Top เพิ่ม 20,000 บาท (remark ทางการ)",
                          "price": {
                            "amount": 1969000,
                            "observedDate": "2026-07-19",
                            "evidenceKey": "ev06"
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "slug": "yaris-ativ",
      "name": "Yaris Ativ",
      "segment": "ECO_CAR",
      "lifecycleStatus": "CURRENT",
      "summary": "อีโคเซดาน 5 ที่นั่ง ขับเคลื่อนล้อหน้า · ไลน์อัปปัจจุบัน (MY 01/2026) แบ่ง 3 ไลน์: รุ่นหลัก / Nightshade / GR Sport รวม 7 รุ่นย่อย · 2 ขุมพลัง: เบนซิน 1.2L และไฮบริด 1.5L",
      "generations": [
        {
          "code": "NGC100R/NYC100R",
          "name": "เจนปัจจุบัน · แพลตฟอร์ม DNGA",
          "launchYear": 2022,
          "summary": "เจนปัจจุบันเปิดตัวในไทย 9 ส.ค. 2022 (แทนตัวถังเดิมตระกูล Vios/XP150) ราคาเปิดตัว 549,000–699,000 บาท · ใช้แพลตฟอร์ม DNGA (Daihatsu New Global Architecture) ร่วมกับ Yaris Cross · รหัสรุ่นตาม grade_code ทางการ: NGC100R (1.2 เบนซิน) และ NYC100R (1.5 HEV) · รุ่น HEV เพิ่มเข้าไลน์อัป 21 ส.ค. 2025 และปรับราคาขึ้น 10,000 บาทเป็น 729,000/779,000 มีผล 1 ม.ค. 2026 · ไลน์อัปปัจจุบัน MY 01/2026",
          "evidenceKeys": [
            "ev11",
            "ev12",
            "ev13",
            "ev09"
          ],
          "derivatives": [
            {
              "bodyType": "SEDAN",
              "name": "Sedan",
              "phases": [
                {
                  "phaseType": "INITIAL",
                  "name": "ไลน์อัปปัจจุบัน (MY 01/2026)",
                  "trims": [
                    {
                      "name": "Sport",
                      "variants": [
                        {
                          "name": "Sport",
                          "powertrainType": "ICE",
                          "modelYear": 2026,
                          "seatCount": 5,
                          "engine": {
                            "code": "3NR-VE",
                            "displacementCc": 1197,
                            "cylinders": 4,
                            "fuelType": "เบนซิน",
                            "maxPowerPs": 94,
                            "maxTorqueNm": 110
                          },
                          "transmission": {
                            "type": "CVT"
                          },
                          "drivetrain": {
                            "type": "FWD"
                          },
                          "notes": "grade_code NGC100R-TEXMKT/A2 · เกียร์ Super CVT-i with Sequential Shift · กำลัง 69 kW (94 PS)/6,000 rpm · แรงบิด 110 Nm/4,400 rpm (EEC net) · มิติ 4,425x1,740x1,480 มม. ฐานล้อ 2,620 มม.",
                          "price": {
                            "amount": 569000,
                            "observedDate": "2026-07-19",
                            "evidenceKey": "ev09"
                          }
                        }
                      ]
                    },
                    {
                      "name": "Smart",
                      "variants": [
                        {
                          "name": "Smart",
                          "powertrainType": "ICE",
                          "modelYear": 2026,
                          "seatCount": 5,
                          "engine": {
                            "code": "3NR-VE",
                            "displacementCc": 1197,
                            "cylinders": 4,
                            "fuelType": "เบนซิน",
                            "maxPowerPs": 94,
                            "maxTorqueNm": 110
                          },
                          "transmission": {
                            "type": "CVT"
                          },
                          "drivetrain": {
                            "type": "FWD"
                          },
                          "notes": "grade_code NGC100R-TEXMKT/B2 · เกียร์ Super CVT-i with Sequential Shift · 69 kW (94 PS)/6,000 rpm · 110 Nm/4,400 rpm",
                          "price": {
                            "amount": 599000,
                            "observedDate": "2026-07-19",
                            "evidenceKey": "ev09"
                          }
                        }
                      ]
                    },
                    {
                      "name": "Premium",
                      "variants": [
                        {
                          "name": "Premium",
                          "powertrainType": "ICE",
                          "modelYear": 2026,
                          "seatCount": 5,
                          "engine": {
                            "code": "3NR-VE",
                            "displacementCc": 1197,
                            "cylinders": 4,
                            "fuelType": "เบนซิน",
                            "maxPowerPs": 94,
                            "maxTorqueNm": 110
                          },
                          "transmission": {
                            "type": "CVT"
                          },
                          "drivetrain": {
                            "type": "FWD"
                          },
                          "notes": "grade_code NGC100R-TEXMKT/C2 · เกียร์ Super CVT-i with Sequential Shift · 69 kW (94 PS)/6,000 rpm · 110 Nm/4,400 rpm",
                          "price": {
                            "amount": 679000,
                            "observedDate": "2026-07-19",
                            "evidenceKey": "ev09"
                          }
                        }
                      ]
                    },
                    {
                      "name": "Nightshade",
                      "variants": [
                        {
                          "name": "NIGHTSHADE",
                          "powertrainType": "ICE",
                          "modelYear": 2026,
                          "seatCount": 5,
                          "engine": {
                            "code": "3NR-VE",
                            "displacementCc": 1197,
                            "cylinders": 4,
                            "fuelType": "เบนซิน",
                            "maxPowerPs": 94,
                            "maxTorqueNm": 110
                          },
                          "transmission": {
                            "type": "CVT"
                          },
                          "drivetrain": {
                            "type": "FWD"
                          },
                          "notes": "grade_code NGC100R-TEXMKT/CB · variant เดียวกันถูกแสดง 2 ที่บนเว็บทางการ: ในหน้า Yaris ATIV หลัก และเป็นไลน์แยก https://www.toyota.co.th/model/yarisativ_nightshade (grade_code + ราคาตรงกัน ยืนยันจาก API เดียวกัน) — บันทึกเป็น variant เดียว · เกียร์ Super CVT-i with Sequential Shift",
                          "price": {
                            "amount": 709000,
                            "observedDate": "2026-07-19",
                            "evidenceKey": "ev09"
                          }
                        }
                      ]
                    },
                    {
                      "name": "Premium Luxury",
                      "variants": [
                        {
                          "name": "Premium Luxury",
                          "powertrainType": "ICE",
                          "modelYear": 2026,
                          "seatCount": 5,
                          "engine": {
                            "code": "3NR-VE",
                            "displacementCc": 1197,
                            "cylinders": 4,
                            "fuelType": "เบนซิน",
                            "maxPowerPs": 94,
                            "maxTorqueNm": 110
                          },
                          "transmission": {
                            "type": "CVT"
                          },
                          "drivetrain": {
                            "type": "FWD"
                          },
                          "notes": "grade_code NGC100R-TEXMKT/D2 · ท็อปของฝั่งเบนซิน · เกียร์ Super CVT-i with Sequential Shift · 69 kW (94 PS)/6,000 rpm · 110 Nm/4,400 rpm",
                          "price": {
                            "amount": 709000,
                            "observedDate": "2026-07-19",
                            "evidenceKey": "ev09"
                          }
                        }
                      ]
                    },
                    {
                      "name": "HEV Premium",
                      "variants": [
                        {
                          "name": "HEV Premium",
                          "powertrainType": "HEV",
                          "modelYear": 2026,
                          "seatCount": 5,
                          "engine": {
                            "code": "2NR-VEX",
                            "displacementCc": 1496,
                            "cylinders": 4,
                            "fuelType": "เบนซิน",
                            "maxPowerPs": 91,
                            "maxTorqueNm": 121
                          },
                          "motor": {
                            "maxPowerKw": 59,
                            "maxTorqueNm": 141
                          },
                          "battery": {
                            "capacityKwh": 0.76,
                            "chemistry": "ลิเธียมไอออน"
                          },
                          "transmission": {
                            "type": "CVT"
                          },
                          "drivetrain": {
                            "type": "FWD"
                          },
                          "notes": "grade_code NYC100R-TEXHBT/A1 · Full Hybrid 1.5L: เครื่อง 67 kW (91 PS)/5,500 + มอเตอร์ 59 kW (80 PS)/141 Nm · กำลังระบบรวม 82 kW (111 PS) · เกียร์ E-CVT · แบต Li-ion 177.6 V ความจุ 0.76 kWh · ราคา 729,000 มีผลตั้งแต่ 1 ม.ค. 2026 (ขึ้นจากราคาเปิดตัว 10,000 ยืนยันโดย AutoLifeThailand)",
                          "price": {
                            "amount": 729000,
                            "observedDate": "2026-07-19",
                            "evidenceKey": "ev09"
                          }
                        }
                      ]
                    },
                    {
                      "name": "GR Sport",
                      "variants": [
                        {
                          "name": "HEV GR Sport",
                          "powertrainType": "HEV",
                          "modelYear": 2026,
                          "seatCount": 5,
                          "engine": {
                            "code": "2NR-VEX",
                            "displacementCc": 1496,
                            "cylinders": 4,
                            "fuelType": "เบนซิน",
                            "maxPowerPs": 91,
                            "maxTorqueNm": 121
                          },
                          "motor": {
                            "maxPowerKw": 59,
                            "maxTorqueNm": 141
                          },
                          "battery": {
                            "capacityKwh": 0.76,
                            "chemistry": "ลิเธียมไอออน"
                          },
                          "transmission": {
                            "type": "CVT"
                          },
                          "drivetrain": {
                            "type": "FWD"
                          },
                          "notes": "grade_code NYC100R-TEXGBT/A1 · ไลน์แยก 'Yaris ATIV GR Sport' บนเว็บทางการ · ขุมพลัง Full Hybrid เดียวกับ HEV Premium (ระบบรวม 82 kW/111 PS) · ช่วงล่าง+พวงมาลัยจูนพิเศษ GR Sport · ล้อ 17 นิ้ว 205/50 R17 · ยาวกว่ารุ่นปกติ (4,440 มม. จากชุดแต่ง) · ราคามีผล 1 ม.ค. 2026",
                          "price": {
                            "amount": 779000,
                            "observedDate": "2026-07-19",
                            "evidenceKey": "ev10"
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "slug": "hilux-travo",
      "name": "Hilux Travo",
      "segment": "PICKUP",
      "lifecycleStatus": "CURRENT",
      "summary": "กระบะไลน์บนตัวใหม่ของตระกูล Hilux เปิดตัวครั้งแรกในโลกที่กรุงเทพฯ พ.ย. 2025 — ครบ 3 ตัวถัง Standard/Smart/Double Cab และมีรุ่นไฟฟ้า Travo-e · หมายเหตุ: ตระกูล Hilux ในไทยยังมีไลน์ Hilux Champ และ Hilux Revo ขายคู่กัน (ยังไม่อยู่ใน coverage ชุดนี้)",
      "generations": [
        {
          "code": "GUN226R/GUN236R · XPN225R (BEV)",
          "name": "เจนใหม่ของตระกูล Hilux (IMV)",
          "launchYear": 2025,
          "summary": "เปิดตัวแบบ world premiere ครั้งแรกในโลกที่กรุงเทพฯ 10 พ.ย. 2025 (ยืนยันโดย press release ของ Toyota Motor Corporation) · ขายจริงบน showroom ไทยเป็นรุ่นปี 11/2025 · Toyota ไม่ระบุเลขเจนอย่างเป็นทางการ — สื่อบางรายเรียกเจน 9 แต่ยังอยู่บน IMV platform ต่อเนื่องจาก Revo · รหัสรุ่นทางการ: GUN226R (4TREX 4x4), GUN236R (Prerunner 4x2), XPN225R (Travo-e BEV)",
          "evidenceKeys": [
            "ev18",
            "ev15",
            "ev19"
          ],
          "derivatives": [
            {
              "bodyType": "PICKUP",
              "name": "Travo Standard Cab",
              "phases": [
                {
                  "phaseType": "INITIAL",
                  "name": "เปิดตัวเจนแรกของไลน์ (MY 11/2025)",
                  "effectiveFrom": "2025-11-10",
                  "trims": [
                    {
                      "name": "4TREX 2.8",
                      "variants": [
                        {
                          "name": "Hilux Travo Standard Cab 4TREX 2.8 MT",
                          "powertrainType": "ICE",
                          "modelYear": 2025,
                          "seatCount": 2,
                          "engine": {
                            "code": "1GD-FTV",
                            "displacementCc": 2755,
                            "cylinders": 4,
                            "aspiration": "VN Turbo + Intercooler",
                            "fuelType": "ดีเซล",
                            "maxPowerPs": 204,
                            "maxTorqueNm": 420
                          },
                          "transmission": {
                            "type": "MANUAL",
                            "gears": 6
                          },
                          "drivetrain": {
                            "type": "FOUR_WD"
                          },
                          "notes": "รหัสรุ่น GUN226R-BTFXXT/A1 · 204 PS @3,400 rpm · 420 Nm @1,400–3,400 rpm · ขับเคลื่อน 4 ล้อพร้อม Differential Lock เฟืองท้าย",
                          "price": {
                            "amount": 767000,
                            "observedDate": "2026-07-19",
                            "evidenceKey": "ev14"
                          }
                        },
                        {
                          "name": "Hilux Travo Standard Cab 4TREX 2.8 AT",
                          "powertrainType": "ICE",
                          "modelYear": 2025,
                          "seatCount": 2,
                          "engine": {
                            "code": "1GD-FTV",
                            "displacementCc": 2755,
                            "cylinders": 4,
                            "aspiration": "VN Turbo + Intercooler",
                            "fuelType": "ดีเซล",
                            "maxPowerPs": 204,
                            "maxTorqueNm": 500
                          },
                          "transmission": {
                            "type": "AUTOMATIC",
                            "gears": 6
                          },
                          "drivetrain": {
                            "type": "FOUR_WD"
                          },
                          "notes": "รหัสรุ่น GUN226R-BTTLXT/A1 · 204 PS @3,000–3,400 rpm · 500 Nm @1,600–2,800 rpm · 6AT Sequential Shift · ขับเคลื่อน 4 ล้อพร้อม Differential Lock",
                          "price": {
                            "amount": 819000,
                            "observedDate": "2026-07-19",
                            "evidenceKey": "ev14"
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "bodyType": "PICKUP",
              "name": "Travo Smart Cab",
              "phases": [
                {
                  "phaseType": "INITIAL",
                  "name": "เปิดตัวเจนแรกของไลน์ (MY 11/2025)",
                  "effectiveFrom": "2025-11-10",
                  "trims": [
                    {
                      "name": "Prerunner 2.8 Smart",
                      "variants": [
                        {
                          "name": "Hilux Travo Smart Cab Prerunner 2.8 Smart MT",
                          "powertrainType": "ICE",
                          "modelYear": 2025,
                          "seatCount": 2,
                          "engine": {
                            "code": "1GD-FTV",
                            "displacementCc": 2755,
                            "cylinders": 4,
                            "aspiration": "VN Turbo + Intercooler",
                            "fuelType": "ดีเซล",
                            "maxPowerPs": 204,
                            "maxTorqueNm": 420
                          },
                          "transmission": {
                            "type": "MANUAL",
                            "gears": 6
                          },
                          "drivetrain": {
                            "type": "RWD"
                          },
                          "notes": "รหัสรุ่น GUN236R-CTFLXT/A1 · Prerunner = ยกสูงขับเคลื่อนล้อหลัง · 420 Nm @1,400–3,400 rpm",
                          "price": {
                            "amount": 789000,
                            "observedDate": "2026-07-19",
                            "evidenceKey": "ev15"
                          }
                        },
                        {
                          "name": "Hilux Travo Smart Cab Prerunner 2.8 Smart AT",
                          "powertrainType": "ICE",
                          "modelYear": 2025,
                          "seatCount": 2,
                          "engine": {
                            "code": "1GD-FTV",
                            "displacementCc": 2755,
                            "cylinders": 4,
                            "aspiration": "VN Turbo + Intercooler",
                            "fuelType": "ดีเซล",
                            "maxPowerPs": 204,
                            "maxTorqueNm": 500
                          },
                          "transmission": {
                            "type": "AUTOMATIC",
                            "gears": 6
                          },
                          "drivetrain": {
                            "type": "RWD"
                          },
                          "notes": "รหัสรุ่น GUN236R-CTTLXT/A1 · 500 Nm @1,600–2,800 rpm · 6AT Sequential Shift",
                          "price": {
                            "amount": 839000,
                            "observedDate": "2026-07-19",
                            "evidenceKey": "ev15"
                          }
                        }
                      ]
                    },
                    {
                      "name": "Prerunner 2.8 Premium",
                      "variants": [
                        {
                          "name": "Hilux Travo Smart Cab Prerunner 2.8 Premium MT",
                          "powertrainType": "ICE",
                          "modelYear": 2025,
                          "seatCount": 2,
                          "engine": {
                            "code": "1GD-FTV",
                            "displacementCc": 2755,
                            "cylinders": 4,
                            "aspiration": "VN Turbo + Intercooler",
                            "fuelType": "ดีเซล",
                            "maxPowerPs": 204,
                            "maxTorqueNm": 420
                          },
                          "transmission": {
                            "type": "MANUAL",
                            "gears": 6
                          },
                          "drivetrain": {
                            "type": "RWD"
                          },
                          "notes": "รหัสรุ่น GUN236R-CTFMXT/A1",
                          "price": {
                            "amount": 859000,
                            "observedDate": "2026-07-19",
                            "evidenceKey": "ev15"
                          }
                        },
                        {
                          "name": "Hilux Travo Smart Cab Prerunner 2.8 Premium AT",
                          "powertrainType": "ICE",
                          "modelYear": 2025,
                          "seatCount": 2,
                          "engine": {
                            "code": "1GD-FTV",
                            "displacementCc": 2755,
                            "cylinders": 4,
                            "aspiration": "VN Turbo + Intercooler",
                            "fuelType": "ดีเซล",
                            "maxPowerPs": 204,
                            "maxTorqueNm": 500
                          },
                          "transmission": {
                            "type": "AUTOMATIC",
                            "gears": 6
                          },
                          "drivetrain": {
                            "type": "RWD"
                          },
                          "notes": "รหัสรุ่น GUN236R-CTTMXT/A1",
                          "price": {
                            "amount": 909000,
                            "observedDate": "2026-07-19",
                            "evidenceKey": "ev15"
                          }
                        }
                      ]
                    },
                    {
                      "name": "4TREX 2.8 Premium",
                      "variants": [
                        {
                          "name": "Hilux Travo Smart Cab 4TREX 2.8 Premium MT",
                          "powertrainType": "ICE",
                          "modelYear": 2025,
                          "seatCount": 2,
                          "engine": {
                            "code": "1GD-FTV",
                            "displacementCc": 2755,
                            "cylinders": 4,
                            "aspiration": "VN Turbo + Intercooler",
                            "fuelType": "ดีเซล",
                            "maxPowerPs": 204,
                            "maxTorqueNm": 420
                          },
                          "transmission": {
                            "type": "MANUAL",
                            "gears": 6
                          },
                          "drivetrain": {
                            "type": "FOUR_WD"
                          },
                          "notes": "รหัสรุ่น GUN226R-CTFMXT/A1 · ขับเคลื่อน 4 ล้อพร้อม Differential Lock เฟืองท้าย",
                          "price": {
                            "amount": 984000,
                            "observedDate": "2026-07-19",
                            "evidenceKey": "ev15"
                          }
                        },
                        {
                          "name": "Hilux Travo Smart Cab 4TREX 2.8 Premium AT",
                          "powertrainType": "ICE",
                          "modelYear": 2025,
                          "seatCount": 2,
                          "engine": {
                            "code": "1GD-FTV",
                            "displacementCc": 2755,
                            "cylinders": 4,
                            "aspiration": "VN Turbo + Intercooler",
                            "fuelType": "ดีเซล",
                            "maxPowerPs": 204,
                            "maxTorqueNm": 500
                          },
                          "transmission": {
                            "type": "AUTOMATIC",
                            "gears": 6
                          },
                          "drivetrain": {
                            "type": "FOUR_WD"
                          },
                          "notes": "รหัสรุ่น GUN226R-CTTMXT/A1 · ขับเคลื่อน 4 ล้อพร้อม Differential Lock เฟืองท้าย",
                          "price": {
                            "amount": 1029000,
                            "observedDate": "2026-07-19",
                            "evidenceKey": "ev15"
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "bodyType": "PICKUP",
              "name": "Travo Double Cab",
              "phases": [
                {
                  "phaseType": "INITIAL",
                  "name": "เปิดตัวเจนแรกของไลน์ (MY 11/2025)",
                  "effectiveFrom": "2025-11-10",
                  "trims": [
                    {
                      "name": "Prerunner 2.8 Smart",
                      "variants": [
                        {
                          "name": "Hilux Travo Double Cab Prerunner 2.8 Smart MT",
                          "powertrainType": "ICE",
                          "modelYear": 2025,
                          "seatCount": 5,
                          "engine": {
                            "code": "1GD-FTV",
                            "displacementCc": 2755,
                            "cylinders": 4,
                            "aspiration": "VN Turbo + Intercooler",
                            "fuelType": "ดีเซล",
                            "maxPowerPs": 204,
                            "maxTorqueNm": 420
                          },
                          "transmission": {
                            "type": "MANUAL",
                            "gears": 6
                          },
                          "drivetrain": {
                            "type": "RWD"
                          },
                          "notes": "รหัสรุ่น GUN236R-DTFLXT/A1",
                          "price": {
                            "amount": 895000,
                            "observedDate": "2026-07-19",
                            "evidenceKey": "ev15"
                          }
                        },
                        {
                          "name": "Hilux Travo Double Cab Prerunner 2.8 Smart AT",
                          "powertrainType": "ICE",
                          "modelYear": 2025,
                          "seatCount": 5,
                          "engine": {
                            "code": "1GD-FTV",
                            "displacementCc": 2755,
                            "cylinders": 4,
                            "aspiration": "VN Turbo + Intercooler",
                            "fuelType": "ดีเซล",
                            "maxPowerPs": 204,
                            "maxTorqueNm": 500
                          },
                          "transmission": {
                            "type": "AUTOMATIC",
                            "gears": 6
                          },
                          "drivetrain": {
                            "type": "RWD"
                          },
                          "notes": "รหัสรุ่น GUN236R-DTTLXT/A1",
                          "price": {
                            "amount": 945000,
                            "observedDate": "2026-07-19",
                            "evidenceKey": "ev15"
                          }
                        }
                      ]
                    },
                    {
                      "name": "Prerunner 2.8 Premium",
                      "variants": [
                        {
                          "name": "Hilux Travo Double Cab Prerunner 2.8 Premium MT",
                          "powertrainType": "ICE",
                          "modelYear": 2025,
                          "seatCount": 5,
                          "engine": {
                            "code": "1GD-FTV",
                            "displacementCc": 2755,
                            "cylinders": 4,
                            "aspiration": "VN Turbo + Intercooler",
                            "fuelType": "ดีเซล",
                            "maxPowerPs": 204,
                            "maxTorqueNm": 420
                          },
                          "transmission": {
                            "type": "MANUAL",
                            "gears": 6
                          },
                          "drivetrain": {
                            "type": "RWD"
                          },
                          "notes": "รหัสรุ่น GUN236R-DTFMXT/A1",
                          "price": {
                            "amount": 949000,
                            "observedDate": "2026-07-19",
                            "evidenceKey": "ev15"
                          }
                        },
                        {
                          "name": "Hilux Travo Double Cab Prerunner 2.8 Premium AT",
                          "powertrainType": "ICE",
                          "modelYear": 2025,
                          "seatCount": 5,
                          "engine": {
                            "code": "1GD-FTV",
                            "displacementCc": 2755,
                            "cylinders": 4,
                            "aspiration": "VN Turbo + Intercooler",
                            "fuelType": "ดีเซล",
                            "maxPowerPs": 204,
                            "maxTorqueNm": 500
                          },
                          "transmission": {
                            "type": "AUTOMATIC",
                            "gears": 6
                          },
                          "drivetrain": {
                            "type": "RWD"
                          },
                          "notes": "รหัสรุ่น GUN236R-DTTMXT/A1",
                          "price": {
                            "amount": 999000,
                            "observedDate": "2026-07-19",
                            "evidenceKey": "ev15"
                          }
                        }
                      ]
                    },
                    {
                      "name": "4TREX 2.8 Premium",
                      "variants": [
                        {
                          "name": "Hilux Travo Double Cab 4TREX 2.8 Premium MT",
                          "powertrainType": "ICE",
                          "modelYear": 2025,
                          "seatCount": 5,
                          "engine": {
                            "code": "1GD-FTV",
                            "displacementCc": 2755,
                            "cylinders": 4,
                            "aspiration": "VN Turbo + Intercooler",
                            "fuelType": "ดีเซล",
                            "maxPowerPs": 204,
                            "maxTorqueNm": 420
                          },
                          "transmission": {
                            "type": "MANUAL",
                            "gears": 6
                          },
                          "drivetrain": {
                            "type": "FOUR_WD"
                          },
                          "notes": "รหัสรุ่น GUN226R-DTFMXT/A1 · ขับเคลื่อน 4 ล้อพร้อม Differential Lock เฟืองท้าย · Double Cab 4TREX มีเฉพาะ MT ในเกรด Premium",
                          "price": {
                            "amount": 1090000,
                            "observedDate": "2026-07-19",
                            "evidenceKey": "ev15"
                          }
                        }
                      ]
                    },
                    {
                      "name": "Prerunner 2.8 Overland",
                      "variants": [
                        {
                          "name": "Hilux Travo Double Cab Prerunner 2.8 Overland AT",
                          "powertrainType": "ICE",
                          "modelYear": 2025,
                          "seatCount": 5,
                          "engine": {
                            "code": "1GD-FTV",
                            "displacementCc": 2755,
                            "cylinders": 4,
                            "aspiration": "VN Turbo + Intercooler",
                            "fuelType": "ดีเซล",
                            "maxPowerPs": 204,
                            "maxTorqueNm": 500
                          },
                          "transmission": {
                            "type": "AUTOMATIC",
                            "gears": 6
                          },
                          "drivetrain": {
                            "type": "RWD"
                          },
                          "notes": "รหัสรุ่น GUN236R-DTTHXT/A1 · ไลน์ Overland ทุกรุ่นเป็น Double Cab AT",
                          "price": {
                            "amount": 1102000,
                            "observedDate": "2026-07-19",
                            "evidenceKey": "ev16"
                          }
                        }
                      ]
                    },
                    {
                      "name": "Prerunner 2.8 Overland Plus",
                      "variants": [
                        {
                          "name": "Hilux Travo Double Cab Prerunner 2.8 Overland Plus AT",
                          "powertrainType": "ICE",
                          "modelYear": 2025,
                          "seatCount": 5,
                          "engine": {
                            "code": "1GD-FTV",
                            "displacementCc": 2755,
                            "cylinders": 4,
                            "aspiration": "VN Turbo + Intercooler",
                            "fuelType": "ดีเซล",
                            "maxPowerPs": 204,
                            "maxTorqueNm": 500
                          },
                          "transmission": {
                            "type": "AUTOMATIC",
                            "gears": 6
                          },
                          "drivetrain": {
                            "type": "RWD"
                          },
                          "notes": "รหัสรุ่น GUN236R-DTTHXT/B1",
                          "price": {
                            "amount": 1176000,
                            "observedDate": "2026-07-19",
                            "evidenceKey": "ev16"
                          }
                        }
                      ]
                    },
                    {
                      "name": "4TREX 2.8 Overland",
                      "variants": [
                        {
                          "name": "Hilux Travo Double Cab 4TREX 2.8 Overland AT",
                          "powertrainType": "ICE",
                          "modelYear": 2025,
                          "seatCount": 5,
                          "engine": {
                            "code": "1GD-FTV",
                            "displacementCc": 2755,
                            "cylinders": 4,
                            "aspiration": "VN Turbo + Intercooler",
                            "fuelType": "ดีเซล",
                            "maxPowerPs": 204,
                            "maxTorqueNm": 500
                          },
                          "transmission": {
                            "type": "AUTOMATIC",
                            "gears": 6
                          },
                          "drivetrain": {
                            "type": "FOUR_WD"
                          },
                          "notes": "รหัสรุ่น GUN226R-DTTHXT/A1 · ขับเคลื่อน 4 ล้อพร้อม Differential Lock เฟืองท้าย",
                          "price": {
                            "amount": 1292000,
                            "observedDate": "2026-07-19",
                            "evidenceKey": "ev16"
                          }
                        }
                      ]
                    },
                    {
                      "name": "4TREX 2.8 Overland Plus",
                      "variants": [
                        {
                          "name": "Hilux Travo Double Cab 4TREX 2.8 Overland Plus AT",
                          "powertrainType": "ICE",
                          "modelYear": 2025,
                          "seatCount": 5,
                          "engine": {
                            "code": "1GD-FTV",
                            "displacementCc": 2755,
                            "cylinders": 4,
                            "aspiration": "VN Turbo + Intercooler",
                            "fuelType": "ดีเซล",
                            "maxPowerPs": 204,
                            "maxTorqueNm": 500
                          },
                          "transmission": {
                            "type": "AUTOMATIC",
                            "gears": 6
                          },
                          "drivetrain": {
                            "type": "FOUR_WD"
                          },
                          "notes": "รหัสรุ่น GUN226R-DTTHXT/B1 · ตัวท็อปฝั่งดีเซลของไลน์ Travo",
                          "price": {
                            "amount": 1366000,
                            "observedDate": "2026-07-19",
                            "evidenceKey": "ev16"
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "bodyType": "PICKUP",
              "name": "Travo Double Cab (BEV)",
              "phases": [
                {
                  "phaseType": "INITIAL",
                  "name": "เปิดตัวเจนแรกของไลน์ (MY 11/2025)",
                  "effectiveFrom": "2025-11-10",
                  "trims": [
                    {
                      "name": "Travo-e 4TREX",
                      "variants": [
                        {
                          "name": "Hilux Travo-e Double Cab 4TREX",
                          "powertrainType": "BEV",
                          "modelYear": 2025,
                          "seatCount": 5,
                          "motor": {
                            "count": 2,
                            "location": "หน้า + หลัง (dual eAxle)",
                            "maxPowerKw": 144
                          },
                          "battery": {
                            "capacityKwh": 59.2,
                            "chemistry": "ลิเธียมไอออน"
                          },
                          "transmission": {
                            "type": "SINGLE_SPEED",
                            "gears": 1
                          },
                          "drivetrain": {
                            "type": "AWD"
                          },
                          "notes": "รหัสรุ่น XPN225R-DTDHST/A1 · กระบะ BEV รุ่นแรกของตระกูล Hilux · กำลังรวมระบบ 144 kW (196 PS) · มอเตอร์หน้า 82.2 kW / 205.5 Nm · มอเตอร์หลัง 129.3 kW / 268.6 Nm (ไม่มีตัวเลขแรงบิดรวมทางการ จึงใส่ maxTorqueNm = null) · มอเตอร์ซิงโครนัสแม่เหล็กถาวร · ส่งกำลังแบบ eAxle · ชาร์จ AC Type 2 สูงสุด 11 kW (3-phase) / DC CCS2 สูงสุด 125 kW",
                          "price": {
                            "amount": 1491000,
                            "observedDate": "2026-07-19",
                            "evidenceKey": "ev17"
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "slug": "corolla-altis",
      "name": "Corolla Altis",
      "segment": "COMPACT",
      "lifecycleStatus": "CURRENT",
      "summary": "ซีดาน C-segment · ไลน์อัปปัจจุบันแยก 2 ไลน์: Corolla Altis (1.8G / HEV Smart / HEV Premium · MY 03/2026) และ Altis GR Sport (HEV · MY 11/2024) · มีทั้งเบนซิน 1.8 และไฮบริด 1.8 · ทุกรุ่น 5 ที่นั่ง ขับเคลื่อนล้อหน้า",
      "generations": [
        {
          "code": "E210 (ZRE211R/ZWE211R)",
          "name": "Corolla ตระกูล E210 · แพลตฟอร์ม TNGA",
          "launchYear": 2019,
          "summary": "เจนปัจจุบันคือ Corolla ตระกูล E210 บนแพลตฟอร์ม TNGA · ประกาศราคาทางการในไทย 3 ก.ย. 2019 (ช่วงราคาเปิดตัว 829,000–1,099,000 บาท เครื่อง 1.6/1.8/1.8 Hybrid) · รหัสรุ่นยืนยันจาก grade_code ทางการ: ZRE211R (1.8G เบนซิน) และ ZWE211R (HEV) · ปัจจุบันเป็นรุ่นปรับปรุง MY 03/2026 (ไลน์หลัก) และ MY 11/2024 (GR Sport)",
          "evidenceKeys": [
            "ev22",
            "ev23",
            "ev24"
          ],
          "derivatives": [
            {
              "bodyType": "SEDAN",
              "name": "Sedan",
              "phases": [
                {
                  "phaseType": "INITIAL",
                  "name": "ไลน์อัปปัจจุบัน (MY 03/2026 · GR Sport MY 11/2024)",
                  "trims": [
                    {
                      "name": "G",
                      "variants": [
                        {
                          "name": "1.8G",
                          "powertrainType": "ICE",
                          "modelYear": 2026,
                          "seatCount": 5,
                          "engine": {
                            "code": "2ZR-FE",
                            "displacementCc": 1798,
                            "cylinders": 4,
                            "fuelType": "เบนซิน",
                            "maxPowerPs": 140,
                            "maxTorqueNm": 172
                          },
                          "transmission": {
                            "type": "CVT"
                          },
                          "drivetrain": {
                            "type": "FWD"
                          },
                          "notes": "MY 03/2026 · grade_code ZRE211R-GEXGKT/C4 · กำลังสูงสุดตามหน้าทางการ 103 kW (140 PS) @6,400 rpm · แรงบิด 172 Nm @4,000 rpm · หน้าทางการระบุเกียร์ว่า 'Automatic E-CVT' แต่มี Forward Gear Ratio 2.480–0.396 (ลักษณะ CVT สายพาน) — บันทึกเป็น CVT · Dual VVT-i DOHC 16 วาล์ว · ขับเคลื่อนล้อหน้า (ระบุตรงในหน้าสเปก) · ถังน้ำมัน 50 ลิตร · ล้ออัลลอย 16 นิ้ว",
                          "price": {
                            "amount": 909000,
                            "observedDate": "2026-07-19",
                            "evidenceKey": "ev20"
                          }
                        }
                      ]
                    },
                    {
                      "name": "Smart",
                      "variants": [
                        {
                          "name": "HEV Smart",
                          "powertrainType": "HEV",
                          "modelYear": 2026,
                          "seatCount": 5,
                          "engine": {
                            "code": "2ZR-FXE",
                            "displacementCc": 1798,
                            "cylinders": 4,
                            "fuelType": "เบนซิน",
                            "maxPowerPs": 98,
                            "maxTorqueNm": 142
                          },
                          "motor": {
                            "maxPowerKw": 53,
                            "maxTorqueNm": 163
                          },
                          "battery": {
                            "chemistry": "ลิเธียมไอออน",
                            "capacityKwh": 0.83
                          },
                          "transmission": {
                            "type": "CVT"
                          },
                          "drivetrain": {
                            "type": "FWD"
                          },
                          "notes": "MY 03/2026 · grade_code ZWE211R-GEXDBT/B4 · เครื่องยนต์ 72 kW (98 PS) @5,200 rpm + มอเตอร์ 53 kW / 163 Nm (แรงดันสูงสุด 600V) · กำลังรวมระบบ 90 kW (122 PS) ตามหน้าทางการ · แบตฯ Li-ion 207.2V 56 โมดูล 0.83 kWh · เกียร์ตามหน้าทางการ 'Automatic E-CVT' · ล้ออัลลอย 16 นิ้ว",
                          "price": {
                            "amount": 949000,
                            "observedDate": "2026-07-19",
                            "evidenceKey": "ev20"
                          }
                        }
                      ]
                    },
                    {
                      "name": "Premium",
                      "variants": [
                        {
                          "name": "HEV Premium",
                          "powertrainType": "HEV",
                          "modelYear": 2026,
                          "seatCount": 5,
                          "engine": {
                            "code": "2ZR-FXE",
                            "displacementCc": 1798,
                            "cylinders": 4,
                            "fuelType": "เบนซิน",
                            "maxPowerPs": 98,
                            "maxTorqueNm": 142
                          },
                          "motor": {
                            "maxPowerKw": 53,
                            "maxTorqueNm": 163
                          },
                          "battery": {
                            "chemistry": "ลิเธียมไอออน",
                            "capacityKwh": 0.83
                          },
                          "transmission": {
                            "type": "CVT"
                          },
                          "drivetrain": {
                            "type": "FWD"
                          },
                          "notes": "MY 03/2026 · grade_code ZWE211R-GEXGBT/B5 · พาวเวอร์เทรนเดียวกับ HEV Smart (72 kW เครื่อง + 53 kW มอเตอร์ รวม 90 kW / 122 PS · แบตฯ Li-ion 207.2V 0.83 kWh) · ต่างที่อุปกรณ์: ไฟหน้า LED, ล้ออัลลอย 17 นิ้ว, BSM+RCTA, All-speed Dynamic Radar Cruise Control",
                          "price": {
                            "amount": 1009000,
                            "observedDate": "2026-07-19",
                            "evidenceKey": "ev20"
                          }
                        }
                      ]
                    },
                    {
                      "name": "GR Sport",
                      "variants": [
                        {
                          "name": "HEV GR Sport",
                          "powertrainType": "HEV",
                          "modelYear": 2024,
                          "seatCount": 5,
                          "engine": {
                            "code": "2ZR-FXE",
                            "displacementCc": 1798,
                            "cylinders": 4,
                            "fuelType": "เบนซิน",
                            "maxPowerPs": 98,
                            "maxTorqueNm": 142
                          },
                          "motor": {
                            "maxTorqueNm": 163
                          },
                          "battery": {
                            "chemistry": "ลิเธียมไอออน"
                          },
                          "transmission": {
                            "type": "CVT"
                          },
                          "drivetrain": {
                            "type": "FWD"
                          },
                          "notes": "ไลน์แยก (series code 'altis_grsport') · MY 11/2024 · grade_code ZWE211R-GEXXBT/B1 · เครื่องยนต์เดียวกับ HEV อื่น (72 kW / 98 PS, 142 Nm) กำลังรวมระบบ 90 kW (122 PS) · มอเตอร์ซิงโครนัสแม่เหล็กถาวร แรงบิด 163 Nm — หน้าทางการแสดง Max Output มอเตอร์เป็น '207.2' kW(PS) และความจุแบตฯ '4' kWh ซึ่งขัดกับรุ่น ZWE211R เดียวกันในไลน์หลัก (53 kW / 0.83 kWh) จึงบันทึกเป็น null และ flag ไว้ใน uncertainties · ช่",
                          "price": {
                            "amount": 1129000,
                            "observedDate": "2026-07-19",
                            "evidenceKey": "ev21"
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  "changeEvents": [
    {
      "changeType": "LAUNCH",
      "title": "ประกาศราคา Corolla Altis เจน E210 (TNGA) ในไทย",
      "summary": "ช่วงราคาเปิดตัว 829,000–1,099,000 บาท (เครื่อง 1.6 / 1.8 / 1.8 Hybrid)",
      "effectiveDate": "2019-09-03",
      "nameplateSlug": "corolla-altis",
      "evidenceKey": "ev22"
    },
    {
      "changeType": "LAUNCH",
      "title": "เปิดตัว Yaris Ativ เจนปัจจุบัน (DNGA) ในไทย",
      "summary": "ราคาเปิดตัว 549,000–699,000 บาท",
      "effectiveDate": "2022-08-09",
      "nameplateSlug": "yaris-ativ",
      "evidenceKey": "ev11"
    },
    {
      "changeType": "TRIM_ADDED",
      "title": "เพิ่มรุ่น HEV (1.5 ไฮบริด) เข้าไลน์อัป",
      "summary": "Yaris Ativ HEV เข้าไลน์อัปไทย ส.ค. 2025 ตามรายงานราคาทางการ",
      "effectiveDate": "2025-08-21",
      "nameplateSlug": "yaris-ativ",
      "evidenceKey": "ev13"
    },
    {
      "changeType": "PRICE_CHANGE",
      "title": "ปรับราคารุ่น HEV ขึ้น 10,000 บาท",
      "summary": "HEV Premium/GR Sport ปรับเป็น 729,000 / 779,000 บาท มีผล 1 ม.ค. 2026 (ตามรายงานราคาทางการ)",
      "effectiveDate": "2026-01-01",
      "nameplateSlug": "yaris-ativ",
      "evidenceKey": "ev13"
    },
    {
      "changeType": "LAUNCH",
      "title": "World premiere Hilux Travo ที่กรุงเทพฯ",
      "summary": "เปิดตัวครั้งแรกในโลก 10 พ.ย. 2025 พร้อมรุ่นไฟฟ้า Travo-e",
      "effectiveDate": "2025-11-10",
      "nameplateSlug": "hilux-travo",
      "evidenceKey": "ev29"
    },
    {
      "changeType": "LAUNCH",
      "title": "เปิดตัว Fortuner เจเนอเรชัน 2 ในไทย",
      "summary": "เปิดตัว 16 ก.ค. 2015 ราคาเริ่มแรก 1,199,000–1,599,000 บาท",
      "effectiveDate": "2015-07-16",
      "nameplateSlug": "fortuner",
      "evidenceKey": "ev07"
    },
    {
      "changeType": "FACELIFT",
      "title": "bZ4X Minorchange — ประกาศราคาไทย",
      "summary": "แบตใหม่ 73.11 kWh เพิ่มรุ่น FWD · ประกาศราคา 7 พ.ย. 2025",
      "effectiveDate": "2025-11-07",
      "nameplateSlug": "bz4x",
      "evidenceKey": "ev02"
    }
  ]
};
