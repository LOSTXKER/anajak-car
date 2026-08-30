// ── ชุดข้อมูลตายตัวสำหรับหน้าลอง (ไม่ยิง DB) ──────────────────────────────
// ตัวเลขทุกตัวคัดจากข้อมูลจริงในระบบ: prisma/seed-data.ts (Toyota · ตรวจ 19 ก.ค. 2026),
// prisma/ops/phase7-seed-tesla-benz.ts (Tesla/Mercedes-Benz · ตรวจ 22 ก.ค. 2026)
// และ prisma/ops/data/adas-classified-20260720.json (ADAS)
// — จงใจ "แช่แข็ง" ไว้ในไฟล์นี้ เพื่อให้หน้าลองเปิดได้แม้ฐานข้อมูลจะล่ม และไม่ไปกวนของจริง

export type ProtoNameplate = {
  slug: string;
  brand: string;
  brandSlug: string;
  name: string;
  segmentLabel: string;
  bodyLabel: string;
  /** ป้ายขุมพลังตาม labels.ts (ดีเซล/เบนซิน/ไฮบริด/ปลั๊กอินไฮบริด/EV) */
  powertrains: string[];
  launchYear: number | null;
  lifecycle: "CURRENT" | "DISCONTINUED" | "UPCOMING" | "TRANSITION";
  priceMin: number | null;
  priceMax: number | null;
  variantCount: number;
  /** รูปรถทางการ (มีเฉพาะ Toyota — Tesla/Benz ยังไม่มีสิทธิ์ใช้ภาพ) */
  image: string | null;
  checkedDate: string;
  summary: string;
};

export const NAMEPLATES: ProtoNameplate[] = [
  {
    slug: "hilux-travo",
    brand: "Toyota",
    brandSlug: "toyota",
    name: "Hilux Travo",
    segmentLabel: "กระบะ",
    bodyLabel: "กระบะ",
    powertrains: ["ดีเซล", "EV"],
    launchYear: 2025,
    lifecycle: "CURRENT",
    priceMin: 767000,
    priceMax: 1491000,
    variantCount: 18,
    image: "/cars/hilux-travo.webp",
    checkedDate: "2026-07-19",
    summary:
      "กระบะไลน์บนตัวใหม่ของตระกูล Hilux เปิดตัวครั้งแรกในโลกที่กรุงเทพฯ พ.ย. 2025 — ครบ 3 ตัวถัง Standard/Smart/Double Cab และมีรุ่นไฟฟ้า Travo-e",
  },
  {
    slug: "fortuner",
    brand: "Toyota",
    brandSlug: "toyota",
    name: "Fortuner",
    segmentLabel: "PPV",
    bodyLabel: "PPV",
    powertrains: ["ดีเซล"],
    launchYear: 2015,
    lifecycle: "CURRENT",
    priceMin: 1239000,
    priceMax: 1969000,
    variantCount: 10,
    image: "/cars/fortuner.webp",
    checkedDate: "2026-07-19",
    summary:
      "PPV 7 ที่นั่งบนพื้นฐานโครงสร้าง Hilux · ไลน์อัปไทยแบ่ง 3 ไลน์: Leader / Legender / GR Sport รวม 10 รุ่นย่อย",
  },
  {
    slug: "yaris-ativ",
    brand: "Toyota",
    brandSlug: "toyota",
    name: "Yaris Ativ",
    segmentLabel: "Eco car",
    bodyLabel: "ซีดาน",
    powertrains: ["เบนซิน", "ไฮบริด"],
    launchYear: 2022,
    lifecycle: "CURRENT",
    priceMin: 569000,
    priceMax: 779000,
    variantCount: 7,
    image: "/cars/yaris-ativ.webp",
    checkedDate: "2026-07-19",
    summary:
      "อีโคเซดาน 5 ที่นั่ง ขับเคลื่อนล้อหน้า · ไลน์อัปปัจจุบัน (MY 01/2026) แบ่ง 3 ไลน์: รุ่นหลัก / Nightshade / GR Sport",
  },
  {
    slug: "corolla-altis",
    brand: "Toyota",
    brandSlug: "toyota",
    name: "Corolla Altis",
    segmentLabel: "C-segment",
    bodyLabel: "ซีดาน",
    powertrains: ["เบนซิน", "ไฮบริด"],
    launchYear: 2019,
    lifecycle: "CURRENT",
    priceMin: 909000,
    priceMax: 1129000,
    variantCount: 4,
    image: "/cars/corolla-altis.webp",
    checkedDate: "2026-07-19",
    summary:
      "ซีดาน C-segment · ไลน์อัปปัจจุบันแยก 2 ไลน์: Corolla Altis (1.8G / HEV Smart / HEV Premium) และ Altis GR Sport",
  },
  {
    slug: "bz4x",
    brand: "Toyota",
    brandSlug: "toyota",
    name: "bZ4X",
    segmentLabel: "SUV กลาง",
    bodyLabel: "SUV",
    powertrains: ["EV"],
    launchYear: 2022,
    lifecycle: "CURRENT",
    priceMin: 1529000,
    priceMax: 1649000,
    variantCount: 2,
    image: "/cars/bz4x.webp",
    checkedDate: "2026-07-19",
    summary:
      "SUV ไฟฟ้าล้วน 5 ที่นั่ง — รถนั่ง BEV รุ่นเดียวในไลน์อัป Toyota ไทยปัจจุบัน · โฉม Minorchange (พ.ย. 2025) นำเข้า CBU จากญี่ปุ่น",
  },
  {
    slug: "model-3",
    brand: "Tesla",
    brandSlug: "tesla",
    name: "Model 3",
    segmentLabel: "C-segment",
    bodyLabel: "ซีดาน",
    powertrains: ["EV"],
    launchYear: null,
    lifecycle: "CURRENT",
    priceMin: 1149000,
    priceMax: 2099000,
    variantCount: 4,
    image: null,
    checkedDate: "2026-07-22",
    summary: "ซีดานไฟฟ้า — ราคาจากที่สื่อยานยนต์ไทยรายงานตรงกันหลายสำนัก (tesla.com บล็อกการดึงข้อมูล)",
  },
  {
    slug: "model-y",
    brand: "Tesla",
    brandSlug: "tesla",
    name: "Model Y",
    segmentLabel: "SUV ใหญ่",
    bodyLabel: "SUV",
    powertrains: ["EV"],
    launchYear: null,
    lifecycle: "CURRENT",
    priceMin: 1719000,
    priceMax: 1999000,
    variantCount: 3,
    image: null,
    checkedDate: "2026-07-22",
    summary: "SUV ไฟฟ้า โฉม Juniper · มีรุ่นฐานล้อยาว 6 ที่นั่ง (Model Y L)",
  },
  {
    slug: "c-class",
    brand: "Mercedes-Benz",
    brandSlug: "mercedes-benz",
    name: "C-Class",
    segmentLabel: "C-segment",
    bodyLabel: "ซีดาน",
    powertrains: ["ดีเซล", "ปลั๊กอินไฮบริด"],
    launchYear: null,
    lifecycle: "CURRENT",
    priceMin: 2690000,
    priceMax: 3290000,
    variantCount: 5,
    image: null,
    checkedDate: "2026-07-22",
    summary: "ซีดานหรู W206 ประกอบไทย · ราคาจาก price list ทางการ",
  },
  {
    slug: "e-class",
    brand: "Mercedes-Benz",
    brandSlug: "mercedes-benz",
    name: "E-Class",
    segmentLabel: "D-segment",
    bodyLabel: "ซีดาน",
    powertrains: ["ดีเซล", "ปลั๊กอินไฮบริด"],
    launchYear: null,
    lifecycle: "CURRENT",
    priceMin: 3650000,
    priceMax: 4080000,
    variantCount: 3,
    image: null,
    checkedDate: "2026-07-22",
    summary: "ซีดานผู้บริหาร W214 ประกอบไทย",
  },
  {
    slug: "glc",
    brand: "Mercedes-Benz",
    brandSlug: "mercedes-benz",
    name: "GLC",
    segmentLabel: "SUV ใหญ่",
    bodyLabel: "SUV",
    powertrains: ["ดีเซล", "ปลั๊กอินไฮบริด"],
    launchYear: null,
    lifecycle: "CURRENT",
    priceMin: 3490000,
    priceMax: 4340000,
    variantCount: 5,
    image: null,
    checkedDate: "2026-07-22",
    summary: "SUV X254 · มีทั้งตัวถัง SUV และ Coupé",
  },
  {
    slug: "s-class",
    brand: "Mercedes-Benz",
    brandSlug: "mercedes-benz",
    name: "S-Class",
    segmentLabel: "Luxury",
    bodyLabel: "ซีดาน",
    powertrains: ["ดีเซล", "ปลั๊กอินไฮบริด"],
    launchYear: null,
    lifecycle: "CURRENT",
    priceMin: 7050000,
    priceMax: 7580000,
    variantCount: 2,
    image: null,
    checkedDate: "2026-07-22",
    summary: "เรือธง W223 ฐานล้อยาว",
  },
  {
    slug: "eqs",
    brand: "Mercedes-Benz",
    brandSlug: "mercedes-benz",
    name: "EQS",
    segmentLabel: "Luxury",
    bodyLabel: "ซีดาน",
    powertrains: ["EV"],
    launchYear: null,
    lifecycle: "CURRENT",
    priceMin: 7200000,
    priceMax: 7200000,
    variantCount: 1,
    image: null,
    checkedDate: "2026-07-22",
    summary: "ซีดานไฟฟ้าเรือธง V297 · ในลิสต์ราคาทางการล่าสุดเหลือรุ่นเดียว",
  },
];

export type ProtoBrand = { slug: string; name: string; nameplateCount: number; logo: string | null };

export const BRANDS: ProtoBrand[] = [
  { slug: "toyota", name: "Toyota", nameplateCount: 5, logo: "/logos/toyota.svg" },
  { slug: "tesla", name: "Tesla", nameplateCount: 2, logo: null },
  { slug: "mercedes-benz", name: "Mercedes-Benz", nameplateCount: 5, logo: null },
];

/** แบรนด์ที่วางแผนเก็บข้อมูลถัดไป — ยังไม่เปิดหน้า (ตรงกับ brand-shortcuts.tsx ของจริง) */
export const UPCOMING_BRANDS = ["Honda", "Isuzu", "BYD", "Mitsubishi", "Nissan", "MG", "Mazda", "Ford"];

// ── รุ่นย่อยของ Hilux Travo (18 SKU · ราคาจริงทั้งหมด) ────────────────────
export type ProtoSku = {
  key: string;
  group: string;
  name: string;
  /** ชื่อสั้นสำหรับตาราง (ตัดคำซ้ำ "Hilux Travo <ตัวถัง>" ออก) */
  shortName: string;
  price: number | null;
  powertrainText: string;
  powerText: string;
  transmission: string;
  drivetrain: string;
  seats: number;
  /** ADAS ที่ยืนยันแล้ว (null = สเปกทางการไม่ระบุ) */
  adas: { aeb: boolean | null; acc: boolean | null; lka: boolean | null };
};

export const HILUX_SKUS: ProtoSku[] = [
  { key: "standard-4trex-2-8-mt", group: "Travo Standard Cab", name: "Hilux Travo Standard Cab 4TREX 2.8 MT", shortName: "4TREX 2.8 MT", price: 767000, powertrainText: "ดีเซล", powerText: "204 PS", transmission: "ธรรมดา 6 สปีด", drivetrain: "4WD", seats: 2, adas: { aeb: false, acc: null, lka: false } },
  { key: "standard-4trex-2-8-at", group: "Travo Standard Cab", name: "Hilux Travo Standard Cab 4TREX 2.8 AT", shortName: "4TREX 2.8 AT", price: 819000, powertrainText: "ดีเซล", powerText: "204 PS", transmission: "อัตโนมัติ 6 สปีด", drivetrain: "4WD", seats: 2, adas: { aeb: false, acc: null, lka: false } },
  { key: "smart-prerunner-2-8-smart-mt", group: "Travo Smart Cab", name: "Hilux Travo Smart Cab Prerunner 2.8 Smart MT", shortName: "Prerunner 2.8 Smart MT", price: 789000, powertrainText: "ดีเซล", powerText: "204 PS", transmission: "ธรรมดา 6 สปีด", drivetrain: "ขับหลัง", seats: 2, adas: { aeb: false, acc: null, lka: false } },
  { key: "smart-prerunner-2-8-smart-at", group: "Travo Smart Cab", name: "Hilux Travo Smart Cab Prerunner 2.8 Smart AT", shortName: "Prerunner 2.8 Smart AT", price: 839000, powertrainText: "ดีเซล", powerText: "204 PS", transmission: "อัตโนมัติ 6 สปีด", drivetrain: "ขับหลัง", seats: 2, adas: { aeb: false, acc: null, lka: false } },
  { key: "smart-prerunner-2-8-premium-mt", group: "Travo Smart Cab", name: "Hilux Travo Smart Cab Prerunner 2.8 Premium MT", shortName: "Prerunner 2.8 Premium MT", price: 859000, powertrainText: "ดีเซล", powerText: "204 PS", transmission: "ธรรมดา 6 สปีด", drivetrain: "ขับหลัง", seats: 2, adas: { aeb: false, acc: null, lka: false } },
  { key: "smart-prerunner-2-8-premium-at", group: "Travo Smart Cab", name: "Hilux Travo Smart Cab Prerunner 2.8 Premium AT", shortName: "Prerunner 2.8 Premium AT", price: 909000, powertrainText: "ดีเซล", powerText: "204 PS", transmission: "อัตโนมัติ 6 สปีด", drivetrain: "ขับหลัง", seats: 2, adas: { aeb: false, acc: null, lka: false } },
  { key: "smart-4trex-2-8-premium-mt", group: "Travo Smart Cab", name: "Hilux Travo Smart Cab 4TREX 2.8 Premium MT", shortName: "4TREX 2.8 Premium MT", price: 984000, powertrainText: "ดีเซล", powerText: "204 PS", transmission: "ธรรมดา 6 สปีด", drivetrain: "4WD", seats: 2, adas: { aeb: false, acc: null, lka: false } },
  { key: "smart-4trex-2-8-premium-at", group: "Travo Smart Cab", name: "Hilux Travo Smart Cab 4TREX 2.8 Premium AT", shortName: "4TREX 2.8 Premium AT", price: 1029000, powertrainText: "ดีเซล", powerText: "204 PS", transmission: "อัตโนมัติ 6 สปีด", drivetrain: "4WD", seats: 2, adas: { aeb: false, acc: null, lka: false } },
  { key: "double-prerunner-2-8-smart-mt", group: "Travo Double Cab", name: "Hilux Travo Double Cab Prerunner 2.8 Smart MT", shortName: "Prerunner 2.8 Smart MT", price: 895000, powertrainText: "ดีเซล", powerText: "204 PS", transmission: "ธรรมดา 6 สปีด", drivetrain: "ขับหลัง", seats: 5, adas: { aeb: false, acc: null, lka: false } },
  { key: "double-prerunner-2-8-smart-at", group: "Travo Double Cab", name: "Hilux Travo Double Cab Prerunner 2.8 Smart AT", shortName: "Prerunner 2.8 Smart AT", price: 945000, powertrainText: "ดีเซล", powerText: "204 PS", transmission: "อัตโนมัติ 6 สปีด", drivetrain: "ขับหลัง", seats: 5, adas: { aeb: false, acc: null, lka: false } },
  { key: "double-prerunner-2-8-premium-mt", group: "Travo Double Cab", name: "Hilux Travo Double Cab Prerunner 2.8 Premium MT", shortName: "Prerunner 2.8 Premium MT", price: 949000, powertrainText: "ดีเซล", powerText: "204 PS", transmission: "ธรรมดา 6 สปีด", drivetrain: "ขับหลัง", seats: 5, adas: { aeb: false, acc: null, lka: false } },
  { key: "double-prerunner-2-8-premium-at", group: "Travo Double Cab", name: "Hilux Travo Double Cab Prerunner 2.8 Premium AT", shortName: "Prerunner 2.8 Premium AT", price: 999000, powertrainText: "ดีเซล", powerText: "204 PS", transmission: "อัตโนมัติ 6 สปีด", drivetrain: "ขับหลัง", seats: 5, adas: { aeb: false, acc: null, lka: false } },
  { key: "double-4trex-2-8-premium-mt", group: "Travo Double Cab", name: "Hilux Travo Double Cab 4TREX 2.8 Premium MT", shortName: "4TREX 2.8 Premium MT", price: 1090000, powertrainText: "ดีเซล", powerText: "204 PS", transmission: "ธรรมดา 6 สปีด", drivetrain: "4WD", seats: 5, adas: { aeb: false, acc: null, lka: false } },
  { key: "double-prerunner-2-8-overland-at", group: "Travo Double Cab", name: "Hilux Travo Double Cab Prerunner 2.8 Overland AT", shortName: "Prerunner 2.8 Overland AT", price: 1102000, powertrainText: "ดีเซล", powerText: "204 PS", transmission: "อัตโนมัติ 6 สปีด", drivetrain: "ขับหลัง", seats: 5, adas: { aeb: false, acc: null, lka: false } },
  { key: "double-prerunner-2-8-overland-plus-at", group: "Travo Double Cab", name: "Hilux Travo Double Cab Prerunner 2.8 Overland Plus AT", shortName: "Prerunner 2.8 Overland Plus AT", price: 1176000, powertrainText: "ดีเซล", powerText: "204 PS", transmission: "อัตโนมัติ 6 สปีด", drivetrain: "ขับหลัง", seats: 5, adas: { aeb: true, acc: true, lka: true } },
  { key: "double-4trex-2-8-overland-at", group: "Travo Double Cab", name: "Hilux Travo Double Cab 4TREX 2.8 Overland AT", shortName: "4TREX 2.8 Overland AT", price: 1292000, powertrainText: "ดีเซล", powerText: "204 PS", transmission: "อัตโนมัติ 6 สปีด", drivetrain: "4WD", seats: 5, adas: { aeb: false, acc: null, lka: false } },
  { key: "double-4trex-2-8-overland-plus-at", group: "Travo Double Cab", name: "Hilux Travo Double Cab 4TREX 2.8 Overland Plus AT", shortName: "4TREX 2.8 Overland Plus AT", price: 1366000, powertrainText: "ดีเซล", powerText: "204 PS", transmission: "อัตโนมัติ 6 สปีด", drivetrain: "4WD", seats: 5, adas: { aeb: true, acc: true, lka: true } },
  { key: "travo-e-double-4trex", group: "Travo Double Cab (ไฟฟ้า)", name: "Hilux Travo-e Double Cab 4TREX", shortName: "Travo-e 4TREX", price: 1491000, powertrainText: "EV", powerText: "144 kW", transmission: "เกียร์เดียว", drivetrain: "AWD", seats: 5, adas: { aeb: null, acc: null, lka: null } },
];

export const HILUX_GROUPS = ["Travo Standard Cab", "Travo Smart Cab", "Travo Double Cab", "Travo Double Cab (ไฟฟ้า)"] as const;

/** SKU ที่ใช้เป็นตัวอย่างหน้ารุ่นย่อย — เลือกตัวที่ข้อมูลรวยสุด (ADAS ครบ) */
export const FOCUS_SKU_KEY = "double-4trex-2-8-overland-plus-at";

export const ADAS_FEATURES = [
  { key: "AEB", nameTh: "ระบบเบรกฉุกเฉินอัตโนมัติ (PCS)", marketing: "Pre-Collision System" },
  { key: "ACC", nameTh: "ระบบควบคุมความเร็วอัตโนมัติ", marketing: "Dynamic Radar Cruise Control แบบ All Speed" },
  { key: "LKA", nameTh: "ระบบช่วยควบคุมรถให้อยู่กลางเลน (LTA)", marketing: "Lane Tracing Assist" },
] as const;

/** ประวัติราคาแบบ append-only ของ SKU ตัวอย่าง — ปัจจุบันมีบันทึกเดียว (ตรงกับของจริง) */
export const PRICE_HISTORY = [
  {
    date: "2026-07-19",
    amount: 1366000,
    publisher: "Toyota Motor Thailand",
    url: "https://www.toyota.co.th/model/hilux_travo/grade",
    confidence: "HIGH" as const,
  },
];

export const SOURCES = [
  {
    id: "s1",
    publisher: "Toyota Motor Thailand",
    title: "Hilux Travo — เกรดและราคา (หน้าทางการ)",
    url: "https://www.toyota.co.th/model/hilux_travo/grade",
    checkedDate: "2026-07-19",
    confidence: "HIGH" as const,
  },
  {
    id: "s2",
    publisher: "Toyota Motor Thailand",
    title: "Toyota TH official model API — Hilux Travo",
    url: "https://www.toyota.co.th/model/api/car/?series_code=hilux_travo",
    checkedDate: "2026-07-19",
    confidence: "HIGH" as const,
  },
  {
    id: "s3",
    publisher: "HeadlightMag",
    title: "เปิดตัว Toyota Hilux Travo ใหม่ในไทย พร้อมราคาทุกรุ่นย่อย",
    url: "https://www.headlightmag.com/",
    checkedDate: "2026-07-19",
    confidence: "MEDIUM" as const,
  },
];

/** แหล่งอ้างอิงของ Tesla Model 3 — ต่างจาก Toyota จริงๆ: หน้าทางการดึงไม่ได้ (403) จึงอ้างสื่อไทยที่ตรงกันหลายสำนัก */
export const SOURCES_MODEL3 = [
  {
    id: "m1",
    publisher: "Autospinn",
    title: "ราคาและสเปกอย่างเป็นทางการ Tesla Model 3 ในไทย",
    url: "https://www.autospinn.com/2026/06/tesla-model-3-official-price-and-specification-thailand-149771",
    checkedDate: "2026-07-22",
    confidence: "MEDIUM" as const,
  },
  {
    id: "m2",
    publisher: "HeadlightMag",
    title: "ราคาอย่างเป็นทางการ Tesla Model 3 MY2026",
    url: "https://www.headlightmag.com/official-price-tesla-model-3-my2026/",
    checkedDate: "2026-07-22",
    confidence: "MEDIUM" as const,
  },
];

/** แหล่งอ้างอิงตามรุ่น — กันหน้ารุ่นหนึ่งไปโชว์แหล่งของอีกแบรนด์ */
export function sourcesFor(slug: string) {
  return slug === "model-3" ? SOURCES_MODEL3 : SOURCES;
}

/** ไทม์ไลน์การเปลี่ยนแปลงของรุ่น (จากตารางเหตุการณ์จริงในระบบ) */
export const TIMELINE = [
  { date: "2025-11-10", type: "เปิดตัว", text: "Toyota เปิดตัว Hilux Travo ครั้งแรกในโลกที่กรุงเทพฯ พร้อมราคา 18 รุ่นย่อย" },
  { date: "2025-11-10", type: "เพิ่มรุ่นย่อย", text: "เพิ่มรุ่นไฟฟ้า Travo-e Double Cab 4TREX (144 kW · AWD)" },
  { date: "2026-07-19", type: "ตรวจสอบราคา", text: "ตรวจราคาป้ายทั้ง 18 รุ่นย่อยกับหน้าทางการ — ยังไม่พบการปรับราคา" },
];

// ── ตัวช่วยคำนวณที่หลายทิศใช้ร่วมกัน ─────────────────────────────────────
export const ALL_SKU_PRICES = HILUX_SKUS.map((s) => s.price).filter((p): p is number => p != null);
export const HILUX_MIN = Math.min(...ALL_SKU_PRICES);
export const HILUX_MAX = Math.max(...ALL_SKU_PRICES);

export function skuByKey(key: string): ProtoSku {
  return HILUX_SKUS.find((s) => s.key === key) ?? HILUX_SKUS[0];
}

/** จำนวนรุ่น/รุ่นย่อยรวมทั้งฐานข้อมูล (ตรงกับที่หน้าแรกของจริงนับ) */
export const TOTALS = {
  brands: BRANDS.length,
  nameplates: NAMEPLATES.length,
  variants: NAMEPLATES.reduce((n, r) => n + r.variantCount, 0),
  latestChecked: "2026-07-22",
};
