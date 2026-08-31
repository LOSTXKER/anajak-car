// ── ชุดข้อมูล "ความสด" สำหรับหน้าลอง M33 ────────────────────────────────
// โจทย์รอบนี้: หน้าแรกต้องพิสูจน์ว่า "ข้อมูลที่นี่แม่น" ด้วยการโชว์งานตรวจสอบของเราเอง
// (เบสเคาะ 2026-08-31) — ไม่ใช่โชว์ของเยอะ ไม่ใช่หน้าโฆษณา
//
// ⚠️ กฎเหล็ก evidence-first: ทุกเหตุการณ์ในไฟล์นี้ต้องมีร่องรอยจริงในrepo
//    ห้ามแต่งเหตุการณ์ให้ฟีดดูสด — ที่มาของแต่ละแถวเขียนกำกับไว้ในฟิลด์ `trace`
//    (ตรวจย้อนได้: prisma/seed-data.ts · prisma/ops/*.ts · prisma/ops/data/*.json)

import { BRANDS, NAMEPLATES, TOTALS, brandStats } from "../../_kit/data";

/** วันที่แช่แข็งของหน้าลอง — ไม่ใช้ Date.now() เพราะหน้าลองต้องได้ภาพเดิมทุกครั้งที่เปิด */
export const TODAY = "2026-08-31";

/** สวิตช์ "ถ้าเงียบไป 3 เดือน" — ให้เบสเห็นด้านมืดของทิศนี้ก่อนเคาะ ไม่ใช่มาเจอตอนขึ้นจริง */
export const STALE_TODAY = "2026-11-30";

export function daysBetween(from: string, to: string) {
  return Math.round((Date.parse(to) - Date.parse(from)) / 86_400_000);
}

export type FreshLevel = "fresh" | "aging" | "stale";

/** เกณฑ์ความสด — ตั้งจากจังหวะจริงของตลาดรถ: ราคาป้ายขยับกันเป็นเดือน ไม่ใช่เป็นวัน */
export function freshLevel(days: number): FreshLevel {
  if (days <= 30) return "fresh";
  if (days <= 90) return "aging";
  return "stale";
}

export const FRESH_TEXT: Record<FreshLevel, { label: string; say: string }> = {
  fresh: { label: "ยังสด", say: "ตรวจล่าสุดภายในเดือนนี้" },
  aging: { label: "ควรตรวจซ้ำ", say: "เลยรอบตรวจรายเดือนมาแล้ว" },
  stale: { label: "ค้างนาน", say: "ไม่ได้ตรวจมาเกินหนึ่งไตรมาส" },
};

// ── บันทึกการตรวจสอบ (append-only) ───────────────────────────────────────
export type AuditKind =
  | "ตรวจสอบราคา"
  | "เพิ่มแบรนด์"
  | "เปิดตัวรุ่น"
  | "จำแนกอุปกรณ์"
  | "แก้โครงสร้าง";

export type AuditEvent = {
  id: string;
  date: string;
  kind: AuditKind;
  /** พาดหัวสั้น — ทิศ "ห้องข่าว" ใช้เป็นหัวข่าว */
  title: string;
  /** ประโยคขยาย 1 ประโยค */
  detail: string;
  /** ขอบเขตที่แตะ — ต้องบอกให้ชัดว่าเหตุการณ์นี้ครอบคลุมแค่ไหน (กันเข้าใจว่าตรวจทั้งฐาน) */
  scope: string;
  counts: { label: string; value: number }[];
  confidence: "HIGH" | "MEDIUM" | null;
  source: { publisher: string; url: string } | null;
  /** ข้อจำกัด/ความไม่สมบูรณ์ที่ต้องบอกตรงๆ (null = ไม่มีอะไรต้องแจ้ง) */
  caveat: string | null;
  /** ที่มาของแถวนี้ในrepo — สำหรับตรวจย้อนว่าไม่ได้แต่งขึ้น */
  trace: string;
};

const toyota = brandStats("toyota");
const tesla = brandStats("tesla");
const benz = brandStats("mercedes-benz");

/** เกรดของ Hilux Travo — ใช้หลายที่ ดึงจากรายการรุ่นจริงไม่พิมพ์มือ */
const hiluxVariants = NAMEPLATES.find((n) => n.slug === "hilux-travo")!.variantCount;

export const AUDIT_LOG: AuditEvent[] = [
  {
    id: "a9",
    date: "2026-07-22",
    kind: "เพิ่มแบรนด์",
    title: `เพิ่ม Mercedes-Benz เข้าฐานข้อมูล ${benz.nameplates} รุ่น ${benz.variants} เกรด`,
    detail:
      "เก็บราคาป้ายทางการรายเกรดของ C-Class / E-Class / GLC / S-Class / EQS ครบทุกเกรดที่ขายอยู่",
    scope: "Mercedes-Benz · ราคาป้ายอย่างเดียว",
    counts: [
      { label: "รุ่น", value: benz.nameplates },
      { label: "เกรด", value: benz.variants },
    ],
    confidence: "MEDIUM",
    source: { publisher: "HeadlightMag", url: "https://www.headlightmag.com/" },
    caveat: "ยังไม่มีสเปกรายเกรดและระบบช่วยขับ — รอบนี้เก็บเฉพาะราคา",
    trace: "prisma/ops/phase7-seed-tesla-benz.ts · prisma/ops/data/research-tesla-benz-20260722.json",
  },
  {
    id: "a8",
    date: "2026-07-22",
    kind: "เพิ่มแบรนด์",
    title: `เพิ่ม Tesla เข้าฐานข้อมูล ${tesla.nameplates} รุ่น ${tesla.variants} เกรด`,
    detail:
      "Model 3 และ Model Y ครบทุกเกรด — แต่ดึงหน้าทางการไม่ได้ จึงยืนยันด้วยสื่อไทย 2 สำนักที่ตัวเลขตรงกัน",
    scope: "Tesla · ราคาป้ายอย่างเดียว",
    counts: [
      { label: "รุ่น", value: tesla.nameplates },
      { label: "เกรด", value: tesla.variants },
    ],
    confidence: "MEDIUM",
    source: {
      publisher: "Autospinn",
      url: "https://www.autospinn.com/2026/06/tesla-model-3-official-price-and-specification-thailand-149771",
    },
    caveat:
      "หน้าทางการ tesla.com ตอบ 403 ดึงอัตโนมัติไม่ได้ → ความเชื่อมั่น “กลาง” ไม่ใช่ “สูง” เท่า Toyota",
    trace: "prisma/ops/phase7-seed-tesla-benz.ts (SOURCES_MODEL3 ใน _kit/data.ts)",
  },
  {
    id: "a7",
    date: "2026-07-20",
    kind: "จำแนกอุปกรณ์",
    title: `จำแนกระบบช่วยขับของ Hilux Travo ทีละเกรด ครบ ${hiluxVariants} เกรด`,
    detail:
      "แยกให้ได้ 3 สถานะจริง — ยืนยันว่ามี / ยืนยันว่าไม่มี / เอกสารทางการไม่ระบุ ไม่ยุบสองอย่างหลังเป็น “ไม่มี”",
    scope: "Toyota Hilux Travo · เบรกฉุกเฉิน · ครูซคุมระยะ · ช่วยคุมเลน",
    counts: [
      { label: "เกรดที่จำแนก", value: hiluxVariants },
      { label: "รายการอุปกรณ์", value: 3 },
    ],
    confidence: "HIGH",
    source: {
      publisher: "Toyota Motor Thailand",
      url: "https://www.toyota.co.th/model/hilux_travo/grade",
    },
    caveat: "เกรดไฟฟ้า Travo-e เอกสารไม่ระบุทั้ง 3 รายการ — บันทึกเป็น “ไม่ระบุ” ไม่ใช่ “ไม่มี”",
    trace: "prisma/ops/phase6-seed-adas.ts · prisma/ops/data/adas-classified-20260720.json",
  },
  {
    id: "a6",
    date: "2026-07-20",
    kind: "แก้โครงสร้าง",
    title: "แยกไลน์ Hilux Travo เป็น 3 ตัวถังตามที่ผู้ผลิตแบ่งจริง",
    detail:
      "Standard Cab / Smart Cab / Double Cab เคยถูกนับรวมเป็นรุ่นเดียว — แยกออกจากกันเพื่อไม่ให้เทียบข้ามตัวถัง",
    scope: "Toyota Hilux Travo · โครงสร้างรุ่นย่อย",
    counts: [{ label: "ตัวถังที่แยกออก", value: 3 }],
    confidence: "HIGH",
    source: {
      publisher: "Toyota Motor Thailand",
      url: "https://www.toyota.co.th/model/hilux_travo/grade",
    },
    caveat: null,
    trace: "prisma/ops/phase5-seed-hilux-lines.ts · prisma/ops/data/hilux-3lines-20260720.json",
  },
  {
    id: "a5",
    date: "2026-07-19",
    kind: "ตรวจสอบราคา",
    title: `ตรวจราคาป้าย Toyota ครบ ${toyota.nameplates} รุ่น ${toyota.variants} เกรด — ไม่พบการปรับราคา`,
    detail:
      "เทียบราคาทุกเกรดกับหน้าทางการและ API ของ Toyota ไทย ตรงกันทั้งหมด จึงบันทึกเป็นการยืนยัน ไม่ใช่การเปลี่ยนแปลง",
    scope: "Toyota · Hilux Travo · Fortuner · Yaris Ativ · Corolla Altis · bZ4X",
    counts: [
      { label: "รุ่นที่ตรวจ", value: toyota.nameplates },
      { label: "เกรดที่ตรวจ", value: toyota.variants },
      { label: "ราคาที่เปลี่ยน", value: 0 },
    ],
    confidence: "HIGH",
    source: {
      publisher: "Toyota Motor Thailand",
      url: "https://www.toyota.co.th/model/hilux_travo/grade",
    },
    caveat: null,
    trace: "prisma/seed-data.ts (checkedDate 2026-07-19) · SOURCES ใน _kit/data.ts",
  },
  {
    id: "a4",
    date: "2026-07-19",
    kind: "แก้โครงสร้าง",
    title: "เติมปีเปิดตัวของทุกรุ่นที่หาหลักฐานได้",
    detail: "รุ่นที่หาปีเปิดตัวในไทยไม่เจอ ปล่อยว่างไว้ตามเดิม ไม่เดาจากปีรุ่นสากล",
    scope: "ทุกรุ่นในฐานข้อมูล ณ ตอนนั้น",
    counts: [{ label: "รุ่นที่แตะ", value: toyota.nameplates }],
    confidence: "HIGH",
    source: null,
    caveat: "รุ่นที่ไม่มีหลักฐานปีเปิดตัวยังว่างอยู่ — แสดงเป็น “ไม่มีข้อมูล” ในหน้ารุ่น",
    trace: "prisma/ops/phase5c-launch-years.ts",
  },
  {
    id: "a3",
    date: "2025-11-10",
    kind: "เปิดตัวรุ่น",
    title: `Toyota เปิดตัว Hilux Travo ครั้งแรกในโลกที่กรุงเทพฯ พร้อมราคา ${hiluxVariants} เกรด`,
    detail: "รุ่นใหม่ทั้งคัน ไม่ใช่ไมเนอร์เชนจ์ — บันทึกเป็นจุดตั้งต้นของไทม์ไลน์รุ่นนี้",
    scope: "Toyota Hilux Travo",
    counts: [{ label: "เกรดตอนเปิดตัว", value: hiluxVariants }],
    confidence: "HIGH",
    source: { publisher: "HeadlightMag", url: "https://www.headlightmag.com/" },
    caveat: null,
    trace: "TIMELINE ใน _kit/data.ts (มาจากตารางเหตุการณ์จริงในระบบ)",
  },
  {
    id: "a2",
    date: "2025-11-10",
    kind: "เปิดตัวรุ่น",
    title: "เพิ่มเกรดไฟฟ้า Travo-e Double Cab 4TREX",
    detail: "กระบะไฟฟ้า 144 kW ขับสี่ — เกรดเดียวในรุ่นที่เป็นไฟฟ้าล้วน",
    scope: "Toyota Hilux Travo · เกรดไฟฟ้า",
    counts: [{ label: "เกรดที่เพิ่ม", value: 1 }],
    confidence: "HIGH",
    source: { publisher: "HeadlightMag", url: "https://www.headlightmag.com/" },
    caveat: "สเปกระบบช่วยขับของเกรดนี้ยังไม่มีเอกสารทางการระบุ",
    trace: "TIMELINE ใน _kit/data.ts",
  },
];

/** วันที่ตรวจล่าสุดในฐาน — ดึงจากบันทึก ไม่พิมพ์มือ */
export const LAST_AUDIT = AUDIT_LOG[0].date;

/** จัดกลุ่มบันทึกตามวัน (ทิศ "ห้องข่าว" เดินเป็นวันๆ) */
export function auditByDate() {
  const map = new Map<string, AuditEvent[]>();
  for (const e of AUDIT_LOG) {
    const list = map.get(e.date) ?? [];
    list.push(e);
    map.set(e.date, list);
  }
  return [...map.entries()];
}

// ── ตารางความครบถ้วน (coverage) ─────────────────────────────────────────
// นี่คือของที่ "ไม่มีเว็บไหนทำ" ตามที่เบสตอบ — เปิดให้เห็นเลยว่าอะไรเก็บแล้ว อะไรยังไม่เก็บ
export type CellState = "full" | "partial" | "none" | "empty";

export const CELL_TEXT: Record<CellState, { mark: string; label: string }> = {
  full: { mark: "✓", label: "เก็บครบแล้ว" },
  partial: { mark: "◐", label: "เก็บบางส่วน" },
  none: { mark: "—", label: "ยังไม่เก็บ" },
  empty: { mark: "○", label: "ยังไม่มีอะไรให้บันทึก" },
};

export const COVERAGE_COLUMNS = [
  { key: "price", label: "ราคาป้ายทางการ", hint: "ราคาตั้งของผู้ผลิต แยกทุกเกรด" },
  { key: "spec", label: "สเปกรายเกรด", hint: "เครื่อง เกียร์ ระบบขับ ที่นั่ง แยกทุกเกรด" },
  { key: "adas", label: "ระบบช่วยขับ", hint: "แยก 3 สถานะ: มี / ไม่มี / เอกสารไม่ระบุ" },
  { key: "history", label: "ประวัติการปรับราคา", hint: "ราคาเปลี่ยนเมื่อไร จากเท่าไรเป็นเท่าไร" },
  { key: "used", label: "ราคามือสอง", hint: "ราคาประกาศขาย พร้อมจำนวนประกาศที่นับได้" },
] as const;

export type CoverageRow = {
  brand: string;
  slug: string;
  nameplates: number;
  variants: number;
  checkedDate: string;
  cells: Record<(typeof COVERAGE_COLUMNS)[number]["key"], CellState>;
  note: string;
};

export const COVERAGE: CoverageRow[] = BRANDS.map((b) => {
  const st = brandStats(b.slug);
  const base = {
    brand: b.name,
    slug: b.slug,
    nameplates: st.nameplates,
    variants: st.variants,
    checkedDate: b.checkedDate,
  };
  if (b.slug === "toyota") {
    return {
      ...base,
      cells: { price: "full", spec: "partial", adas: "partial", history: "empty", used: "none" },
      note: `สเปกและระบบช่วยขับครบเฉพาะ Hilux Travo (${hiluxVariants} เกรด) — อีก ${st.nameplates - 1} รุ่นเก็บราคาไว้ก่อน`,
    } satisfies CoverageRow;
  }
  return {
    ...base,
    cells: { price: "full", spec: "none", adas: "none", history: "empty", used: "none" },
    note:
      b.slug === "tesla"
        ? "ราคาครบทุกเกรด แต่ยืนยันจากสื่อ ไม่ใช่หน้าทางการ — ความเชื่อมั่นกลาง"
        : "ราคาครบทุกเกรด · สเปกรายเกรดยังไม่ได้เก็บ",
  } satisfies CoverageRow;
});

// ── สิ่งที่ยังไม่มี (บอกตรงๆ ตามกฎ product) ──────────────────────────────
export const PENDING = [
  {
    title: "ประวัติการปรับราคา",
    why: "โครงเก็บพร้อมแล้ว (บันทึกเพิ่มแถวใหม่ ไม่ทับของเก่า) แต่ตรวจมาแค่รอบเดียว จึงยังไม่มีการเปลี่ยนแปลงให้บันทึก",
    when: "มีของให้ดูตั้งแต่การตรวจรอบที่สองเป็นต้นไป",
  },
  {
    title: "ราคามือสองและจำนวนประกาศ",
    why: "ยังไม่ได้เริ่มเก็บ — และเมื่อเก็บแล้วจะเรียกว่า “ราคาประกาศ” ไม่ใช่ “ราคาซื้อขายจริง”",
    when: "ยังไม่กำหนด",
  },
  {
    title: "โปรโมชั่นรายเดือน",
    why: "เป็นราคาคนละชนิดกับราคาป้าย ถ้าเก็บต้องแยกป้ายให้ชัดว่าเป็นโปร ไม่ใช่ราคาตั้ง",
    when: "ยังไม่กำหนด",
  },
  {
    title: `อีก ${8} แบรนด์ที่คนไทยหาบ่อย`,
    why: "Honda · Isuzu · BYD · Mitsubishi · Nissan · MG · Mazda · Ford ยังไม่เปิดหน้า เพราะยังเก็บไม่ครบพอ",
    when: "เปิดทีละแบรนด์เมื่อราคาครบทุกเกรด",
  },
];

/** ตัวเลขรวมของฐาน — ใช้ร่วมกับ TOTALS เดิม */
export const DB_STATS = {
  brands: TOTALS.brands,
  nameplates: TOTALS.nameplates,
  variants: TOTALS.variants,
  /** จำนวนแหล่งอ้างอิงที่ผูกอยู่จริงในหน้าลอง (Toyota 3 + Tesla 2) */
  sources: 5,
  audits: AUDIT_LOG.length,
};
