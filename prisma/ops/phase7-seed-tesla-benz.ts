// Phase 7: append Tesla (Model 3, Model Y) + Mercedes-Benz (C/E/S-Class, GLC, EQS)
// แหล่งข้อมูลเดียว: prisma/ops/data/research-tesla-benz-20260722.json (research verified 2026-07-22)
//
// หลักที่ยึด (ตาม AGENTS.md + แพตเทิร์น phase5):
//  - append-only: ไม่แตะแถวเดิมใดๆ · abort ถ้า brand/nameplate slug ใดมีอยู่แล้ว
//  - evidence-first: ทุกราคา = OfficialPriceObservation + EvidenceSource (dedupe ด้วย URL)
//    tesla.com / mercedes-benz.co.th → MANUFACTURER_OFFICIAL HIGH · สื่อไทย → MEDIA MEDIUM
//  - no false precision: ค่าที่แหล่งขัดแย้งกัน (battery/power ของ Tesla LR & Performance,
//    range Model Y RWD 466-vs-488) → เก็บ null + status unknown + note · ไม่เดา ไม่เฉลี่ย
//  - exact entity: Engine แยกแถวเว้นแต่ code+cc+PS ตรงเป๊ะ · ระบบ PHEV system output ไม่ใส่ใน Engine.maxPowerPs
//  - PS จากสื่อของมอเตอร์ EV → เก็บใน notes ไม่แปลงเป็น kW
import "dotenv/config";
import { prisma } from "../../src/lib/prisma";

const TODAY = new Date("2026-07-22");

type Tx = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

// ── EvidenceSource dedupe by URL ────────────────────────────
const OFFICIAL_HOSTS = ["tesla.com", "mercedes-benz.co.th"];
function publisherOf(url: string): string {
  if (url.includes("tesla.com")) return "Tesla (Thailand)";
  if (url.includes("mercedes-benz.co.th")) return "Mercedes-Benz (Thailand)";
  if (url.includes("autospinn.com")) return "Autospinn";
  if (url.includes("headlightmag.com")) return "HeadLight Magazine";
  if (url.includes("autolifethailand.tv")) return "AutoLife Thailand";
  if (url.includes("car250.com")) return "Car250";
  return new URL(url).hostname;
}

// ── ข้อมูลที่จะสร้าง (คัดจาก research JSON เท่านั้น) ─────────
type EngineDef = {
  code: string | null; name?: string; cc: number; ps: number | null; torqueNm?: number | null;
  fuel: "DIESEL" | "GASOLINE"; fuelRaw: string; notes?: string; evUrl: string;
};
type MotorDef = { kw: number | null; torqueNm?: number | null; count?: number; layout?: "FRONT" | "REAR" | "DUAL"; locationRaw?: string; notes: string };
type BatteryDef = { kwh: number | null; chem?: "LFP" | "NMC"; chemRaw?: string; notes: string };

const M3_PRICE = "https://www.autospinn.com/2026/06/tesla-model-3-official-price-and-specification-thailand-149771";
const MY_PRICE = "https://www.tesla.com/th_th/modely/design";
const GLC_CFG_X254 = "https://www.mercedes-benz.co.th/en/passengercars/mercedes-benz-cars/car-configurator.html/motorization/CCci/TH/en/tc/X254";
const GLC_CFG_C254 = "https://www.mercedes-benz.co.th/en/passengercars/mercedes-benz-cars/car-configurator.html/motorization/CCci/TH/en/tc/C254";
const MB_PRICELIST_JUL = "https://www.mercedes-benz.co.th/content/dam/thailand/brochure-specsheet/2026/pricelist/MB-EQ_Price%20list%20-%206JULY_EN.pdf";
const MB_PRICELIST_MAR = "https://www.mercedes-benz.co.th/content/dam/thailand/brochure-specsheet/2026/pricelist/MB-EQ_Price%20list%20-%2023%20MAR_TH.pdf";
const C_OVERVIEW = "https://www.mercedes-benz.co.th/en/passengercars/models/saloon/c-class/overview.html";
const S_OVERVIEW = "https://www.mercedes-benz.co.th/en/passengercars/models/saloon-long/s-class/overview.html";
const GLC_SPEC_PDF = "https://www.mercedes-benz.co.th/content/dam/thailand/brochure-specsheet/2026/spec-sheet/GLC_SUV_Specsheet_MAY26.pdf";
const GLC_COUPE_PDF = "https://www.mercedes-benz.co.th/content/dam/thailand/brochure-specsheet/2026/spec-sheet/glc-coupe_spec-sheet-may-26-en.pdf";
const E_SPEC_PDF = "https://www.mercedes-benz.co.th/content/dam/thailand/brochure-specsheet/2026/spec-sheet/e-class_spec-sheet-may-26-en.pdf";
const S_SPEC_PDF = "https://www.mercedes-benz.co.th/content/dam/thailand/brochure-specsheet/2025/s-class/s-class-spec-sheet-sep-2025.pdf";
const HLM_M3 = "https://www.headlightmag.com/official-price-tesla-model-3-my2026/";

const ENGINES: Record<string, EngineDef> = {
  c220d: { evUrl: C_OVERVIEW, code: "OM654", cc: 1993, ps: 197, fuel: "DIESEL", fuelRaw: "ดีเซล",
    notes: "OM654 2.0L 4-cyl turbodiesel · 145 kW (197 HP) จากหน้า official overview C-Class" },
  e220d: { evUrl: E_SPEC_PDF, code: null, cc: 1993, ps: 197, torqueNm: 440, fuel: "DIESEL", fuelRaw: "ดีเซล",
    notes: "1,993 cc diesel 4-cyl turbo w/ intercooler · 145 kW [197 hp] @3,600 · 440 Nm @1,800–2,800 (spec sheet E-Class MAY26) · spec sheet ไม่พิมพ์รหัสเครื่อง จึงไม่บันทึกรหัส (exact-entity: ไม่ยุบรวมกับ OM654 ของ C/GLC)" },
  glc220d: { evUrl: GLC_SPEC_PDF, code: "OM654M", cc: 1993, ps: 197, torqueNm: 440, fuel: "DIESEL", fuelRaw: "ดีเซล",
    notes: "OM654M 2.0L 4-cyl turbodiesel · 145 kW (197 HP)/3,600 · 440 Nm/1,800-2,800 (GLC SUV spec sheet MAY26)" },
  m254_350e: { evUrl: GLC_SPEC_PDF, code: "M254", cc: 1999, ps: 204, torqueNm: 320, fuel: "GASOLINE", fuelRaw: "เบนซิน (unleaded 95)",
    notes: "M254 2.0L turbo petrol · ICE 150 kW (204 PS) · ใช้ร่วม C 350 e / GLC 350 e (code+cc+PS ตรงเป๊ะ) · system output ของ PHEV อยู่ใน notes ของ variant ไม่ใช่ที่นี่" },
  e350e: { evUrl: E_SPEC_PDF, code: null, cc: 1999, ps: 204, fuel: "GASOLINE", fuelRaw: "เบนซิน",
    notes: "1,999 cc petrol 4-cyl turbo 150 kW [204 hp] @6,100 (E-Class spec sheet MAY26) · spec sheet ไม่พิมพ์รหัสเครื่อง จึงแยกแถวจาก M254 ของ C/GLC (exact-entity)" },
  s350d: { evUrl: S_SPEC_PDF, code: null, name: "OM656-family L6 turbodiesel", cc: 2989, ps: 313, torqueNm: 650, fuel: "DIESEL", fuelRaw: "ดีเซล",
    notes: "ยึดค่า spec-sheet PDF ทางการ (s-class-spec-sheet-sep-2025.pdf): 230 kW (313 hp) / 2,989 cc / 650 Nm · หมายเหตุ: widget หน้า overview ทางการแสดง 210 kW (286 HP)/2,925 cc ขัดแย้งกับ PDF — บันทึกตาม PDF และจดข้อขัดแย้งไว้ · research ระบุ 'OM656-family' ไม่ใช่รหัสเป๊ะ จึงไม่บันทึกใน code" },
  s580e_ice: { evUrl: S_SPEC_PDF, code: null, name: "M256-family L6 turbo petrol", cc: 2999, ps: 367, torqueNm: 500, fuel: "GASOLINE", fuelRaw: "เบนซิน (unleaded 95)",
    notes: "ICE ล้วน 270 kW (367 hp) @5,500-6,100 · 500 Nm (S-Class spec sheet) · system output 510 hp เป็นค่ารวมเครื่อง+มอเตอร์ อยู่ใน notes ของ variant" },
};

const MOTORS: Record<string, MotorDef> = {
  m3_std: { kw: null, layout: "REAR", locationRaw: "Single motor RWD",
    notes: "Tesla TH ไม่เผยแพร่กำลังมอเตอร์ · สื่อไทย (headlightmag/car250) รายงาน 283 PS — เก็บใน notes ไม่แปลงเป็น kW" },
  m3_prem: { kw: null, layout: "REAR", locationRaw: "Single motor RWD",
    notes: "สื่อไทยรายงาน 347 PS (headlightmag) — เก็บใน notes ไม่แปลงเป็น kW" },
  m3_lr: { kw: null, layout: "REAR", locationRaw: "Single motor RWD (Long Range)",
    notes: "กำลังขัดแย้งระหว่างแหล่ง: 347 PS (headlightmag) vs 320 hp (autolifethailand) — ไม่บันทึกตัวเลขเป็น fact" },
  m3_perf: { kw: null, count: 2, layout: "DUAL", locationRaw: "Dual Motor AWD (Performance)",
    notes: "กำลังขัดแย้งระหว่างแหล่ง: 510 PS/375 kW (headlightmag) vs 460 hp (autolifethailand/autospinn) — ไม่บันทึกตัวเลขเป็น fact" },
  my_rwd: { kw: null, layout: "REAR", locationRaw: "Single motor, rear",
    notes: "Tesla TH ไม่เผยแพร่กำลังมอเตอร์ Model Y — unknown" },
  my_lr: { kw: null, layout: "REAR", locationRaw: "Single motor, rear",
    notes: "Tesla TH ไม่เผยแพร่กำลังมอเตอร์ Model Y Long Range — unknown" },
  my_l: { kw: null, count: 2, layout: "DUAL", locationRaw: "Dual motor AWD",
    notes: "สื่อไทย (headlightmag) รายงาน 462 PS / 493 Nm — เป็น PS จากสื่อ เก็บใน notes ไม่แปลงเป็น kW" },
  glc350e: { kw: 100, torqueNm: 440,
    notes: "e-motor 100 kW (136 PS) / 440 Nm (GLC spec sheet ทางการ) — ใช้ร่วม GLC 350 e SUV/Coupé" },
  e350e: { kw: 95, torqueNm: 440,
    notes: "e-motor 95 kW / 440 Nm (E-Class spec sheet ทางการ MAY26)" },
  s580e: { kw: 110, torqueNm: 480,
    notes: "e-motor 110 kW (150 hp) / 480 Nm (S-Class spec sheet ทางการ)" },
  eqs500: { kw: null, count: 2, layout: "DUAL", locationRaw: "Dual permanent-magnet synchronous motors (4MATIC)",
    notes: "สื่อไทย (headlightmag/grandprix จากงานเปิดตัวทางการ) รายงาน 449 PS / 828 Nm — PS จากสื่อ เก็บใน notes ไม่แปลงเป็น kW" },
};

const BATTERIES: Record<string, BatteryDef> = {
  m3_lfp575: { kwh: 57.5, chem: "LFP", chemRaw: "LFP",
    notes: "57.5 kWh LFP — แหล่งสื่อไทยหลายแหล่งตรงกัน (headlightmag/car250) · Tesla ไม่เผยแพร่ kWh ทางการ" },
  m3_lr: { kwh: null,
    notes: "ความจุขัดแย้ง: 75 kWh NMC (headlightmag) vs 84.7 kWh (autolifethailand) — ไม่บันทึกตัวเลข (no false precision)" },
  m3_perf: { kwh: null,
    notes: "ความจุรายงานไม่ตรงกัน 75-79 kWh NMC — ไม่บันทึกตัวเลข (no false precision)" },
  my_rwd: { kwh: null, notes: "Tesla TH ไม่เผยแพร่ความจุแบตของรุ่น RWD และไม่มีแหล่งรองยืนยัน — unknown" },
  my_lr: { kwh: 84.7, notes: "84.7 kWh ตาม autolifethailand (สื่อ — Tesla TH ไม่ระบุเอง) · DC สูงสุด 250 kW ตามหน้า official" },
  my_l: { kwh: 82, notes: "82 kWh ตาม headlightmag (สื่อ — Tesla TH ไม่ระบุเอง)" },
  eqs500: { kwh: 108.4, notes: "108.4 kWh ตามสื่อไทยรายงานงานเปิดตัวทางการ (headlightmag/grandprix) — ไม่ได้ดึงตรงจาก spec sheet ทางการ · บ่งชี้ pre-facelift V297" },
  c350e: { kwh: null, notes: "หน้า official แสดง '-' สำหรับความจุแบต · ค่า ~25.4 kWh ที่สื่อทั่วไปอ้างไม่ verify จากแหล่งทางการไทย — unknown" },
  e350e: { kwh: null, notes: "spec sheet ทางการไม่ระบุความจุแบต · ~25.4 kWh usable ที่รายงานทั่วไปไม่ verify จากแหล่งทางการไทย — unknown" },
  glc350e_suv: { kwh: null, notes: "spec sheet SUV ทางการไม่ระบุ kWh/ระยะ EV (คาดว่าแพ็ก 31.2 kWh เดียวกับ Coupé แต่ไม่ verify) — unknown" },
  glc350e_coupe: { kwh: 31.2, notes: "31.2 kWh จาก autolifethailand (รายงานเปิดตัว — ไม่อยู่บนเว็บ official TH) · DC สูงสุด 60 kW" },
  s580e: { kwh: null, notes: "ไม่เผยแพร่บนเว็บ/spec sheet ทางการไทย (ค่า global ~28.6 kWh ไม่ใช่ Thai-official) — unknown" },
};

type VariantDef = {
  name: string;
  price: number;
  priceUrl: string;
  priceNote?: string;
  specUrl: string; // specSourceUrls[0]
  pt: "ICE" | "PHEV" | "BEV";
  engine?: keyof typeof ENGINES;
  motor?: keyof typeof MOTORS;
  battery?: keyof typeof BATTERIES;
  trans: "SS" | "9G";
  drive?: "RWD" | "AWD" | "AWD_4MATIC";
  rangeWltp?: number; // เก็บเฉพาะค่าไม่ขัดแย้ง
  rangeWltpStatus: "known" | "unknown" | "not_applicable";
  modelYear?: number;
  seatCount?: number;
  notes: string;
};
type DerivativeDef = { name: string; bodyType: "SEDAN" | "SUV" | "COUPE"; variants: VariantDef[] };
type NameplateDef = {
  slug: string; name: string; segment: string; summary: string; noteOnSegment?: string;
  mainUrl: string; // ลิงก์ identity ของ nameplate + generation
  genCode: string; genName: string; genLaunchYear: number | null; genSummary: string;
  derivatives: DerivativeDef[];
};
type BrandDef = {
  slug: string; name: string; officialName: string; countryOrigin: string; parentCompany?: string;
  presence: { distributorName?: string; notes: string };
  nameplates: NameplateDef[];
};

const BRANDS: BrandDef[] = [
  {
    slug: "tesla", name: "Tesla", officialName: "Tesla, Inc.", countryOrigin: "USA",
    presence: { notes: "ขายตรงผ่านเว็บ tesla.com/th_th (ไม่ผ่านดีลเลอร์อิสระ) · Model S/X/Cybertruck ไม่ขายใหม่ในไทย (research 2026-07-22)" },
    nameplates: [
      {
        slug: "model-3", name: "Model 3", segment: "COMPACT",
        summary: "ซีดานไฟฟ้าล้วนของ Tesla ในไทย — MY2026 มี 4 รุ่นย่อย (Standard/Premium/Premium Long Range RWD + Performance AWD) · CBU จีน",
        mainUrl: "https://www.tesla.com/th_th/model3",
        genCode: "Highland", genName: "Highland (facelift เจน 2)", genLaunchYear: null,
        genSummary: "เจน 2 facelift \"Highland\" — MY2026 refresh ประกาศในไทย ม.ค. 2026 และปรับไลน์อีกครั้ง ~มิ.ย. 2026 (ตัด Premium Long Range AWD) · ปีเข้าไทยของ Highland (~2024) ไม่ verify จากแหล่งทางการจึงไม่บันทึก · ราคาไม่ยืนยันตรงจาก tesla.com (เว็บ block fetch) — ใช้ราคาที่สื่อไทยหลายแหล่งรายงานตรงกันเป็นราคาป้ายทางการ",
        derivatives: [
          {
            name: "Model 3 Saloon", bodyType: "SEDAN",
            variants: [
              {
                name: "Standard RWD", price: 1149000, priceUrl: M3_PRICE, specUrl: HLM_M3,
                pt: "BEV", motor: "m3_std", battery: "m3_lfp575", trans: "SS", drive: "RWD",
                rangeWltp: 534, rangeWltpStatus: "known", modelYear: 2026,
                notes: "534 km WLTP (แหล่งส่วนใหญ่) — autolifethailand รายงาน 520 km ขัดแย้ง 1 แหล่ง จึงคงค่า 534 พร้อมจดข้อขัดแย้ง · 283 PS ตามสื่อ (ไม่ใช่ค่าทางการ Tesla) · 0-100 6.2s",
              },
              {
                name: "Premium RWD", price: 1439000, priceUrl: M3_PRICE, specUrl: HLM_M3,
                pt: "BEV", motor: "m3_prem", battery: "m3_lfp575", trans: "SS", drive: "RWD",
                rangeWltp: 534, rangeWltpStatus: "known", modelYear: 2026,
                notes: "534 km WLTP · 347 PS ตามสื่อ (ไม่ใช่ค่าทางการ Tesla) · 0-100 6.1s",
              },
              {
                name: "Premium Long Range RWD", price: 1599000, priceUrl: M3_PRICE, specUrl: HLM_M3,
                pt: "BEV", motor: "m3_lr", battery: "m3_lr", trans: "SS", drive: "RWD",
                rangeWltp: 750, rangeWltpStatus: "known", modelYear: 2026,
                notes: "750 km WLTP · กำลัง (347 vs 320 PS) และแบต (75 vs 84.7 kWh) ขัดแย้งระหว่างแหล่ง — ไม่บันทึกเป็น fact · 0-100 5.2s",
              },
              {
                name: "Performance AWD", price: 2099000, priceUrl: M3_PRICE, specUrl: HLM_M3,
                pt: "BEV", motor: "m3_perf", battery: "m3_perf", trans: "SS", drive: "AWD",
                rangeWltp: 571, rangeWltpStatus: "known", modelYear: 2026,
                notes: "571 km WLTP · กำลัง (510 vs 460 PS) และแบต (75-79 kWh) รายงานไม่ตรงกัน — ไม่บันทึกเป็น fact · 0-100 3.1s",
              },
            ],
          },
        ],
      },
      {
        slug: "model-y", name: "Model Y", segment: "SUV_MIDSIZE",
        summary: "SUV/crossover ไฟฟ้าล้วนของ Tesla ในไทย — ทำตลาดชื่อ \"Model Y Premium\" · รวมตัวฐานล้อยาว 6 ที่นั่ง Model Y L",
        noteOnSegment: "research ระบุ 'D-segment electric mid-size SUV' → SUV_MIDSIZE",
        mainUrl: "https://www.tesla.com/th_th/modely",
        genCode: "Juniper", genName: "Juniper (facelift เจน 2)", genLaunchYear: 2026,
        genSummary: "เจน 2 facelift \"Juniper\" MY2026 — เปิดตัวไทย 17 ม.ค. 2026 (research อ้างอิงงานเปิดตัว) · Model Y L ส่งมอบจาก Q2 2026 · Long Range AWD (2,019,000) หายจาก configurator ณ 2026-07-22 — สถานะไม่ยืนยัน",
        derivatives: [
          {
            name: "Model Y", bodyType: "SUV",
            variants: [
              {
                name: "Model Y Premium ขับเคลื่อนล้อหลัง (RWD)", price: 1719000, priceUrl: MY_PRICE, specUrl: MY_PRICE,
                pt: "BEV", motor: "my_rwd", battery: "my_rwd", trans: "SS", drive: "RWD",
                rangeWltpStatus: "unknown", modelYear: 2026,
                notes: "ระยะทางขัดแย้ง: 466 km WLTP (สื่อ) vs ~488 km est. บน configurator ทางการ — ไม่บันทึกตัวเลข (no false precision) · 0-100 5.9s · DC สูงสุด 175 kW · Tesla TH ไม่เผยแพร่กำลัง/แบต",
              },
              {
                name: "Model Y Premium ขับเคลื่อนล้อหลังรุ่น Long Range (Long Range RWD)", price: 1849000, priceUrl: MY_PRICE, specUrl: "https://www.tesla.com/th_th/modely",
                pt: "BEV", motor: "my_lr", battery: "my_lr", trans: "SS", drive: "RWD",
                rangeWltp: 661, rangeWltpStatus: "known", modelYear: 2026,
                notes: "661 km WLTP จากหน้า official tesla.com/th_th/modely · 0-100 5.6s · DC 250 kW (+267 km/15 นาที) · แบต 84.7 kWh ตามสื่อ",
              },
              {
                name: "Model Y L Premium ขับเคลื่อนสี่ล้อ (AWD, long wheelbase, 6 seats)", price: 1999000, priceUrl: MY_PRICE,
                specUrl: "https://www.headlightmag.com/official-price-tesla-model-y-l-long-wheelbase/",
                pt: "BEV", motor: "my_l", battery: "my_l", trans: "SS", drive: "AWD",
                rangeWltp: 681, rangeWltpStatus: "known", modelYear: 2026, seatCount: 6,
                notes: "ฐานล้อยาว 3,040 มม. 3 แถว 6 ที่นั่ง · 681 km WLTP / 462 PS / 82 kWh ตามสื่อ (headlightmag — Tesla TH ไม่ระบุเอง) · 0-100 5.0s · CBU จีน",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "mercedes-benz", name: "Mercedes-Benz", officialName: "Mercedes-Benz",
    countryOrigin: "Germany", parentCompany: "Mercedes-Benz Group AG",
    presence: {
      distributorName: "Mercedes-Benz (Thailand) Ltd.",
      notes: "ประกอบในประเทศ (CKD) ที่สมุทรปราการหลายรุ่น: C-Class W206 · E-Class W214 · GLC · EQS 450+/500 · S-Class (research 2026-07-22)",
    },
    nameplates: [
      {
        slug: "c-class", name: "C-Class", segment: "COMPACT",
        summary: "ซีดาน D-segment/compact executive — จุดเริ่มของไลน์ซีดานประกอบไทย (W206 สมุทรปราการ) · ดีเซล C 220 d + PHEV C 350 e",
        mainUrl: C_OVERVIEW,
        genCode: "W206", genName: "W206", genLaunchYear: null,
        genSummary: "W206 (ยืนยันจาก style id ในข้อมูลหน้า official) · ปีเปิดตัวไทย (รายงานทั่วไป 2022) ไม่ verify จากแหล่งทางการจึงไม่บันทึก · ราคาดึงจาก schema.org structured data ในหน้า official overview (2026-07-22)",
        derivatives: [
          {
            name: "C-Class Saloon", bodyType: "SEDAN",
            variants: [
              {
                name: "C 220 d (Night Edition)", price: 2690000, priceUrl: C_OVERVIEW, specUrl: C_OVERVIEW,
                priceNote: "verify: ไม่พบแหล่งรองยืนยันราคา list 2,690,000 ของรุ่นนี้ — พบเพียงราคาโปร (ต.ค. 2024) ของ C 220 d AMG Line ที่ตัวเลขเดียวกัน · อาจสับสนชื่อรุ่น/ราคาโปร — ใช้ด้วยความระวัง",
                pt: "ICE", engine: "c220d", trans: "9G",
                rangeWltpStatus: "not_applicable",
                notes: "ราคาจาก schema.org บนหน้า official แต่ไม่มีแหล่งรองยืนยัน (ดู note ของ observation) · 0-100 7.5s · top 245 km/h · drivetrain ไม่ระบุบนหน้า official ('Drive type: -') จึงไม่บันทึก",
              },
              {
                name: "C 220 d AMG Line (Night Edition)", price: 2800000, priceUrl: C_OVERVIEW, specUrl: C_OVERVIEW,
                pt: "ICE", engine: "c220d", trans: "9G", rangeWltpStatus: "not_applicable",
                notes: "ราคายืนยันโดย autolifethailand + checkraka (MY2026 ประกอบไทย) · drivetrain ไม่ระบุบนหน้า official จึงไม่บันทึก",
              },
              {
                name: "C 220 d AMG Line", price: 2880000, priceUrl: C_OVERVIEW, specUrl: C_OVERVIEW,
                pt: "ICE", engine: "c220d", trans: "9G", rangeWltpStatus: "not_applicable",
                notes: "ราคายืนยันโดย official schema + ZigWheels + autolifethailand (ประกอบไทย) · drivetrain ไม่ระบุบนหน้า official จึงไม่บันทึก",
              },
              {
                name: "C 350 e AMG Dynamic", price: 3190000, priceUrl: C_OVERVIEW, specUrl: C_OVERVIEW,
                priceNote: "verify: ยืนยันอ่อน — 3,190,000 ปรากฏเป็น 'ราคาแนะนำ' บนโพสต์ดีลเลอร์เท่านั้น ไม่มีสื่อหลักยืนยัน (launch price 2022 = 3,350,000) — ใช้ด้วยความระวัง",
                pt: "PHEV", engine: "m254_350e", battery: "c350e", trans: "9G",
                rangeWltpStatus: "unknown",
                notes: "หน้า official แสดง '-' สำหรับ system output/แบต/ระยะ EV — ไม่บันทึก · เครื่อง 204 HP คือกำลัง ICE ล้วน · 0-100 6.1s · drivetrain ไม่ระบุจึงไม่บันทึก",
              },
              {
                name: "C 350 e AMG Dynamic (Night Edition)", price: 3290000, priceUrl: C_OVERVIEW, specUrl: C_OVERVIEW,
                pt: "PHEV", engine: "m254_350e", battery: "c350e", trans: "9G",
                rangeWltpStatus: "unknown",
                notes: "ราคายืนยันโดย headlightmag + autolifethailand + checkraka · หน้า official ยังมี offer 2,990,000 (InStock/campaign) — ถือเป็นราคาแคมเปญ ไม่ใช่ list · system output/แบต/ระยะ EV ไม่ระบุ — ไม่บันทึก",
              },
            ],
          },
        ],
      },
      {
        slug: "e-class", name: "E-Class", segment: "MIDSIZE",
        summary: "ซีดาน executive E-segment ประกอบไทย (W214) — ไลน์ขายดีทางประวัติศาสตร์ของ Mercedes-Benz Thailand · ดีเซล E 220 d + PHEV E 350 e",
        mainUrl: "https://www.mercedes-benz.co.th/en/passengercars/models/saloon/e-class/overview.html",
        genCode: "W214", genName: "W214", genLaunchYear: null,
        genSummary: "W214 — เปิดตัวไทย มี.ค. 2024 ตามสื่อไทย (autolifethailand/autobuzz — ไม่ใช่แหล่งทางการ จึงไม่บันทึกเป็น launchYear) · ประกอบไทย · ราคาจาก price list PDF ทางการ 6 JULY 2026",
        derivatives: [
          {
            name: "E-Class Saloon", bodyType: "SEDAN",
            variants: [
              {
                name: "E 220 d AMG Line", price: 3930000, priceUrl: MB_PRICELIST_JUL, specUrl: E_SPEC_PDF,
                pt: "ICE", engine: "e220d", trans: "9G", rangeWltpStatus: "not_applicable",
                notes: "สถานะ MHEV 48V ไม่ยืนยันบน spec sheet ทางการไทย — บันทึกเป็น ICE · 0-100 7.6s · top 238 km/h · drivetrain ไม่ระบุบน spec sheet จึงไม่บันทึก · ราคายืนยันโดย headlightmag",
              },
              {
                name: "E 350 e Exclusive", price: 3650000, priceUrl: MB_PRICELIST_JUL, specUrl: E_SPEC_PDF,
                pt: "PHEV", engine: "e350e", motor: "e350e", battery: "e350e", trans: "9G",
                rangeWltpStatus: "unknown",
                notes: "system 313 hp / 550 Nm = ค่ารวมเครื่อง+มอเตอร์ (ไม่ใส่ใน Engine) · spec sheet อ้างมาตรฐาน WLTP แต่ไม่พิมพ์ตัวเลขระยะ EV — unknown · 0-100 6.4s · drivetrain ไม่ระบุจึงไม่บันทึก · ราคายืนยันโดย headlightmag",
              },
              {
                name: "E 350 e AMG Dynamic", price: 4080000, priceUrl: MB_PRICELIST_JUL, specUrl: E_SPEC_PDF,
                pt: "PHEV", engine: "e350e", motor: "e350e", battery: "e350e", trans: "9G",
                rangeWltpStatus: "unknown",
                notes: "system 313 hp / 550 Nm = ค่ารวมเครื่อง+มอเตอร์ (ไม่ใส่ใน Engine) · ล้อ 20\" AMG · ระยะ EV ไม่พิมพ์บน spec sheet — unknown · drivetrain ไม่ระบุจึงไม่บันทึก · ราคายืนยันโดย headlightmag",
              },
            ],
          },
        ],
      },
      {
        slug: "s-class", name: "S-Class", segment: "LUXURY",
        summary: "ซีดานธงหลวง F-segment ฐานล้อยาว (V223) ประกอบไทย — S 350 d ดีเซล + S 580 e PHEV · ผู้นำกลุ่ม full-size luxury saloon ในไทย",
        mainUrl: S_OVERVIEW,
        genCode: "W223", genName: "W223 (V223 ฐานล้อยาว)", genLaunchYear: null,
        genSummary: "W223/V223 — รหัสเจนเป็น industry knowledge ไม่พิมพ์บนหน้าทางการไทย · เข้าไทย 2021 ตามรายงานทั่วไป แต่ปีของ MY ปัจจุบันไม่ระบุทางการ จึงไม่บันทึก launchYear · spec sheet ไฟล์ชื่อ Sep 2025 แต่ภายในระบุ 01-04/2567 (MY804) — วันที่ภายในไม่สอดคล้อง",
        derivatives: [
          {
            name: "S-Class Saloon (Long)", bodyType: "SEDAN",
            variants: [
              {
                name: "S 350 d Exclusive", price: 7050000, priceUrl: S_OVERVIEW, specUrl: S_SPEC_PDF,
                priceNote: "ราคาแสดงบนหน้า overview ทางการ (Series tab: THB 7,050,000) — ไม่มี price list PDF แยก · ยืนยันโดย headlightmag (MY2023) + checkraka",
                pt: "ICE", engine: "s350d", trans: "9G", rangeWltpStatus: "not_applicable",
                notes: "ยึดค่า spec-sheet PDF: 230 kW (313 hp)/2,989 cc — ขัดแย้งกับ widget หน้า overview (210 kW/286 HP/2,925 cc) แก้ไม่ได้ว่าคันส่งมอบจริงเป็นค่าไหน · 0-100 5.6s · AIRMATIC + rear-axle steering 4.5° · drivetrain ไม่ระบุบน spec sheet จึงไม่บันทึก",
              },
              {
                name: "S 580 e AMG Premium", price: 7580000, priceUrl: S_OVERVIEW, specUrl: S_SPEC_PDF,
                priceNote: "ราคาแสดงบนหน้า overview ทางการ (AMG Line tab: THB 7,580,000) · ยืนยันโดย headlightmag (MY2023) + checkraka",
                pt: "PHEV", engine: "s580e_ice", motor: "s580e", battery: "s580e", trans: "9G",
                rangeWltpStatus: "unknown",
                notes: "system 375 kW (510 hp) / 750 Nm = ค่ารวมเครื่อง+มอเตอร์ (ไม่ใส่ใน Engine — Engine เก็บเฉพาะ ICE 367 hp ที่ spec sheet แยกไว้) · แบต/ระยะ EV ไม่เผยแพร่ทางการไทย — unknown · 0-100 5.2s · drivetrain ไม่ระบุจึงไม่บันทึก",
              },
            ],
          },
        ],
      },
      {
        slug: "glc", name: "GLC", segment: "SUV_MIDSIZE",
        summary: "SUV หรูขนาดกลางขายดีสุดของ Mercedes ในไทย — ประกอบไทยที่สมุทรปราการ · ตัวถัง SUV (X254) + Coupé (C254) · ดีเซล 220 d + PHEV 350 e",
        mainUrl: "https://www.mercedes-benz.co.th/en/passengercars/models/suv/glc/overview.html",
        genCode: "X254/C254", genName: "X254 (SUV) / C254 (Coupé)", genLaunchYear: null,
        genSummary: "SUV = X254 · Coupé = C254 (deeplink API ทางการ tag X254) · ปีเข้าไทย (SUV 2023 / Coupé 2024) เป็น general knowledge ไม่ re-verify รอบนี้จึงไม่บันทึก · spec sheet 2026 ระบุ MY806+056 — ไม่ชัดว่าเป็น facelift ใน X254 หรือไม่",
        derivatives: [
          {
            name: "GLC SUV", bodyType: "SUV",
            variants: [
              {
                name: "GLC 220 d 4MATIC", price: 3490000, priceUrl: GLC_CFG_X254, specUrl: "https://www.mercedes-benz.co.th/en/passengercars/models/suv/glc/overview.html",
                priceNote: "verify: ไม่มีแหล่งรองยืนยัน 3,490,000 เป็นราคา list ของตัว base — ตัวเลขนี้พบเป็นราคาโปร (ต.ค. 2024) ของรุ่น Avantgarde · อาจสับสนราคาโปร/ราคา list — ใช้ด้วยความระวัง (ราคาจาก configurator ทางการ 2026-07-22)",
                pt: "ICE", engine: "glc220d", trans: "9G", drive: "AWD_4MATIC", rangeWltpStatus: "not_applicable",
                notes: "base configurator ไม่มี trim suffix (trim 'AMG Dynamic' ของ 220 d ที่ aggregator อ้างไม่อยู่ใน configurator ทางการ) · 0-100 8.0s · boot 620-1,680 L",
              },
              {
                name: "GLC 220 d 4MATIC (MANUFAKTUR paint)", price: 3550000, priceUrl: GLC_CFG_X254, specUrl: GLC_CFG_X254,
                priceNote: "verify: ไม่พบสื่อไทยแหล่งใดกล่าวถึงรุ่นสี MANUFAKTUR ที่ 3,550,000 — unverified จากแหล่งรอง (ราคาจาก configurator ทางการ 2026-07-22)",
                pt: "ICE", engine: "glc220d", trans: "9G", drive: "AWD_4MATIC", rangeWltpStatus: "not_applicable",
                notes: "กลไกเดียวกับ GLC 220 d 4MATIC · รายการสี MANUFAKTUR ใน configurator",
              },
              {
                name: "GLC 220 d 4MATIC Avantgarde", price: 3720000, priceUrl: GLC_CFG_X254, specUrl: GLC_CFG_X254,
                pt: "ICE", engine: "glc220d", trans: "9G", drive: "AWD_4MATIC", rangeWltpStatus: "not_applicable",
                notes: "ราคายืนยันโดย autolifethailand + headlightmag (ประกอบไทย X254)",
              },
              {
                name: "GLC 350 e 4MATIC AMG Dynamic (SUV)", price: 4180000, priceUrl: GLC_CFG_X254, specUrl: GLC_SPEC_PDF,
                pt: "PHEV", engine: "m254_350e", motor: "glc350e", battery: "glc350e_suv", trans: "9G", drive: "AWD_4MATIC",
                rangeWltpStatus: "unknown",
                notes: "system 313 PS / 550 Nm = ค่ารวมเครื่อง+มอเตอร์ (ไม่ใส่ใน Engine) · แบต kWh/ระยะ EV ไม่ระบุบน spec sheet SUV ทางการ — unknown · 0-100 6.7s · ราคายืนยันโดย autolifethailand + headlightmag",
              },
            ],
          },
          {
            name: "GLC Coupé", bodyType: "COUPE",
            variants: [
              {
                name: "GLC 350 e 4MATIC Coupé AMG Dynamic", price: 4340000, priceUrl: GLC_CFG_C254, specUrl: GLC_COUPE_PDF,
                pt: "PHEV", engine: "m254_350e", motor: "glc350e", battery: "glc350e_coupe", trans: "9G", drive: "AWD_4MATIC",
                rangeWltp: 120, rangeWltpStatus: "known",
                notes: "system 313 PS / 550 Nm = ค่ารวมเครื่อง+มอเตอร์ (ไม่ใส่ใน Engine) · แบต 31.2 kWh / ระยะ EV ~120 km WLTP จาก autolifethailand (สื่อ — ไม่อยู่บนเว็บ official) · ประกอบไทย · 0-100 6.7s · ราคายืนยันโดย checkraka",
              },
            ],
          },
        ],
      },
      {
        slug: "eqs", name: "EQS", segment: "LUXURY",
        summary: "ซีดานไฟฟ้าธงหลวง (F-segment BEV) — EQS 500 4MATIC AMG Premium ประกอบไทย (CKD) รุ่นเดียวบน price list ทางการปัจจุบัน",
        mainUrl: "https://www.mercedes-benz.co.th/en/passengercars/models/saloon/eqs/overview.html",
        genCode: "V297", genName: "V297", genLaunchYear: null,
        genSummary: "V297 · เข้าไทย 2022 (ประกาศ CKD พ.ย. 2022 ตามสื่อ — ไม่ verify จากหน้าทางการซึ่ง fetch ไม่สำเร็จ จึงไม่บันทึก launchYear) · รายชื่อรุ่นดึงจาก price list PDF ทางการ 23 MAR 2026 — EQS 450+ หายจากลิสต์ คาดยุติแต่ไม่ยืนยัน",
        derivatives: [
          {
            name: "EQS Saloon", bodyType: "SEDAN",
            variants: [
              {
                name: "EQS 500 4MATIC AMG Premium", price: 7200000, priceUrl: MB_PRICELIST_MAR,
                specUrl: "https://www.headlightmag.com/2022-11-14-official-price-mercedes-eqs-500-4matic-ckd-thailand/",
                priceNote: "7,200,000 = ราคาบน price list ทางการ 23 MAR 2026 (เปิดตัว 7,900,000 พ.ย. 2022 แล้วลด 700,000) · verify note: มีการลดทางการภายหลัง (6,700,000 และโปร ~4.19M ปี 2024-2025) — 7.2M เป็นราคา list ยุค 2023",
                pt: "BEV", motor: "eqs500", battery: "eqs500", trans: "SS", drive: "AWD_4MATIC",
                rangeWltp: 702, rangeWltpStatus: "known",
                notes: "702 km WLTP / 449 PS / 828 Nm / 108.4 kWh ตามสื่อไทยรายงานงานเปิดตัวทางการ (headlightmag/grandprix — ไม่ดึงตรงจาก spec sheet ทางการ) · 0-100 4.8s · DC 10-80% ~31 นาที · CKD ไทย",
              },
            ],
          },
        ],
      },
    ],
  },
];

// ── main ────────────────────────────────────────────────────
async function main() {
  // กันรันซ้ำ (append-only)
  for (const b of BRANDS) {
    if (await prisma.brand.findUnique({ where: { slug: b.slug } })) {
      throw new Error(`brand ${b.slug} มีอยู่แล้ว — abort`);
    }
    for (const np of b.nameplates) {
      if (await prisma.nameplate.findUnique({ where: { slug: np.slug } })) {
        throw new Error(`nameplate ${np.slug} มีอยู่แล้ว — abort`);
      }
    }
  }

  await prisma.$transaction(
    async (tx) => {
      // EvidenceSource dedupe by URL
      const sources = new Map<string, string>();
      async function srcOf(url: string): Promise<string> {
        const hit = sources.get(url);
        if (hit) return hit;
        const official = OFFICIAL_HOSTS.some((h) => url.includes(h));
        const created = await tx.evidenceSource.create({
          data: {
            sourceType: official ? "MANUFACTURER_OFFICIAL" : "MEDIA",
            publisher: publisherOf(url),
            url,
            checkedDate: TODAY,
            checkedBy: "AI research session 2026-07-22 (prisma/ops/data/research-tesla-benz-20260722.json)",
            confidence: official ? "HIGH" : "MEDIUM",
          },
        });
        sources.set(url, created.id);
        return created.id;
      }
      async function link(
        entityType: "NAMEPLATE" | "GENERATION" | "VARIANT_REVISION",
        entityId: string, field: string, url: string, note?: string,
      ) {
        await tx.evidenceLink.create({
          data: { entityType, entityId, field, note, evidenceSourceId: await srcOf(url) },
        });
      }

      // shared powertrain rows (dedupe ภายในสคริปต์)
      const engineIds = new Map<string, string>();
      async function engineOf(key: keyof typeof ENGINES): Promise<string> {
        const hit = engineIds.get(key);
        if (hit) return hit;
        const e = ENGINES[key];
        const created = await tx.engine.create({
          data: {
            code: e.code, name: e.name, displacementCc: e.cc, cylinders: undefined,
            fuelTypeRaw: e.fuelRaw, fuelType: e.fuel, fuelTypeStatus: "known",
            maxPowerPs: e.ps, maxTorqueNm: e.torqueNm ?? null,
            powerStatus: e.ps != null ? "known" : "unknown",
            notes: e.notes,
          },
        });
        engineIds.set(key, created.id);
        await tx.evidenceLink.create({
          data: {
            entityType: "ENGINE", entityId: created.id, field: "fuelType",
            note: `สเปกทางการระบุเชื้อเพลิง "${e.fuelRaw}" → ${e.fuel}`,
            evidenceSourceId: await srcOf(e.evUrl),
          },
        });
        return created.id;
      }
      const motorIds = new Map<string, string>();
      async function motorOf(key: keyof typeof MOTORS): Promise<string> {
        const hit = motorIds.get(key);
        if (hit) return hit;
        const m = MOTORS[key];
        const created = await tx.motor.create({
          data: {
            count: m.count ?? 1, maxPowerKw: m.kw, maxTorqueNm: m.torqueNm ?? null,
            locationRaw: m.locationRaw, layout: m.layout,
            layoutStatus: m.layout ? "known" : "unknown",
            powerStatus: m.kw != null ? "known" : "unknown",
            notes: m.notes,
          },
        });
        motorIds.set(key, created.id);
        return created.id;
      }
      const batteryIds = new Map<string, string>();
      async function batteryOf(key: keyof typeof BATTERIES): Promise<string> {
        const hit = batteryIds.get(key);
        if (hit) return hit;
        const b = BATTERIES[key];
        const created = await tx.battery.create({
          data: {
            chemistryRaw: b.chemRaw, chemistry: b.chem,
            chemistryStatus: b.chem ? "known" : "unknown",
            capacityKwh: b.kwh, capacityStatus: b.kwh != null ? "known" : "unknown",
            notes: b.notes,
          },
        });
        batteryIds.set(key, created.id);
        return created.id;
      }

      // Transmission: reuse ทั้งระบบเมื่อ type+gears+name ตรง
      const allTrans = await tx.transmission.findMany();
      async function transOf(kind: "SS" | "9G"): Promise<string> {
        const spec = kind === "SS"
          ? { type: "SINGLE_SPEED" as const, gears: null as number | null, name: null as string | null,
              notes: "เกียร์ลดรอบจังหวะเดียวของรถไฟฟ้า (single-speed reduction gear)" }
          : { type: "AUTOMATIC" as const, gears: 9, name: "9G-TRONIC",
              notes: "9G-TRONIC อัตโนมัติ 9 จังหวะ — ชื่อ/จำนวนจังหวะตาม spec sheet ทางการ Mercedes-Benz TH (research 2026-07-22 ระบุ 9G-TRONIC ทุก variant ICE/PHEV)" };
        const match = allTrans.find((t) => t.type === spec.type && t.gears === spec.gears && (t.name ?? null) === spec.name);
        if (match) return match.id;
        const created = await tx.transmission.create({ data: spec });
        allTrans.push(created);
        return created.id;
      }

      // Drivetrain: reuse RWD/AWD เดิมถ้ามี · 4MATIC = AWD ชื่อ "4MATIC"
      const allDrive = await tx.drivetrain.findMany();
      async function driveOf(kind: "RWD" | "AWD" | "AWD_4MATIC"): Promise<string> {
        const want = kind === "AWD_4MATIC"
          ? { type: "AWD" as const, name: "4MATIC" as string | null }
          : { type: kind, name: null as string | null };
        const match = allDrive.find((d) => d.type === want.type && (d.name ?? null) === want.name);
        if (match) return match.id;
        const created = await tx.drivetrain.create({
          data: {
            type: want.type, name: want.name,
            notes: kind === "AWD_4MATIC"
              ? "ระบบขับสี่ล้อ 4MATIC ของ Mercedes-Benz — ชนิดย่อย (full-time/on-demand) ยังไม่ verify จึงใช้ AWD"
              : `${kind} ตามชื่อรุ่นทางการ — ชนิดย่อยยังไม่ verify`,
          },
        });
        allDrive.push(created);
        return created.id;
      }

      let variantCount = 0;
      for (const b of BRANDS) {
        const brand = await tx.brand.create({
          data: {
            slug: b.slug, name: b.name, officialName: b.officialName,
            countryOrigin: b.countryOrigin, parentCompany: b.parentCompany,
          },
        });
        const presence = await tx.marketPresence.create({
          data: {
            brandId: brand.id, market: "TH",
            distributorName: b.presence.distributorName,
            notes: b.presence.notes,
          },
        });

        for (const np of b.nameplates) {
          const nameplate = await tx.nameplate.create({
            data: {
              slug: np.slug, name: np.name, marketPresenceId: presence.id,
              segment: np.segment as never, segmentStatus: "known",
              lifecycleStatus: "CURRENT", summary: np.summary,
              notes: np.noteOnSegment,
            },
          });
          await link("NAMEPLATE", nameplate.id, "identity", np.mainUrl,
            "หน้า official ของรุ่น (แหล่งหลักจาก research 2026-07-22)");

          const generation = await tx.generation.create({
            data: {
              nameplateId: nameplate.id, code: np.genCode, name: np.genName,
              launchYear: np.genLaunchYear, lifecycleStatus: "CURRENT", summary: np.genSummary,
              chassisType: "UNIBODY", chassisTypeStatus: "known",
            },
          });
          await link("GENERATION", generation.id, "code", np.mainUrl,
            `รหัสเจน ${np.genCode} ตาม research 2026-07-22 (ที่มา/ข้อจำกัดดูใน summary)`);
          await link("GENERATION", generation.id, "chassisType", np.mainUrl,
            "ซีดาน/crossover สมัยใหม่ทุกเจนในชุดนี้ = โครงสร้าง monocoque (unibody) — จัดประเภทตามนิยาม VOCABULARY.md ไม่ใช่ SUV แบบ body-on-frame");

          for (const d of np.derivatives) {
            const derivative = await tx.derivative.create({
              data: {
                generationId: generation.id, bodyType: d.bodyType as never, name: d.name,
                cabType: "NOT_APPLICABLE", cabTypeStatus: "not_applicable",
              },
            });
            const phase = await tx.phase.create({
              data: { derivativeId: derivative.id, phaseType: "INITIAL", name: "ไลน์อัปปัจจุบัน (research 2026-07-22)" },
            });

            for (const v of d.variants) {
              const trim = await tx.trim.create({
                data: {
                  phaseId: phase.id, name: v.name,
                  rideHeightClass: "NOT_APPLICABLE", rideHeightStatus: "not_applicable",
                },
              });
              const variant = await tx.variantRevision.create({
                data: {
                  trimId: trim.id, name: v.name,
                  powertrainType: v.pt,
                  hybridArchitectureStatus: v.pt === "PHEV" ? "unknown" : "not_applicable",
                  rangeKmWltp: v.rangeWltp ?? null,
                  rangeKmWltpStatus: v.rangeWltpStatus,
                  modelYear: v.modelYear ?? null,
                  modelYearStatus: v.modelYear != null ? "known" : "unknown",
                  seatCount: v.seatCount ?? null,
                  seatCountStatus: v.seatCount != null ? "known" : "unknown",
                  engineId: v.engine ? await engineOf(v.engine) : null,
                  motorId: v.motor ? await motorOf(v.motor) : null,
                  batteryId: v.battery ? await batteryOf(v.battery) : null,
                  transmissionId: await transOf(v.trans),
                  drivetrainId: v.drive ? await driveOf(v.drive) : null,
                  notes: v.notes,
                },
              });
              await link("VARIANT_REVISION", variant.id, "specs", v.specUrl,
                "แหล่งสเปกหลักของ variant นี้ (specSourceUrls[0] จาก research 2026-07-22)");
              await tx.officialPriceObservation.create({
                data: {
                  variantRevisionId: variant.id,
                  priceType: "OFFICIAL_LIST_PRICE",
                  currency: "THB",
                  amount: v.price,
                  amountStatus: "known",
                  observedDate: TODAY,
                  evidenceSourceId: await srcOf(v.priceUrl),
                  notes: v.priceNote ?? "ราคาป้ายทางการ ณ 2026-07-22 (research verified — ไม่ใช่ราคาซื้อขายจริง)",
                },
              });
              variantCount++;
            }
          }
          console.log(`✓ ${b.name} ${np.name}`);
        }
      }
      console.log(`\nสร้างครบ: ${variantCount} variant · ${sources.size} evidence source ใหม่`);
    },
    { timeout: 300_000, maxWait: 30_000 },
  );

  console.log("รวมทั้งระบบ:", {
    brands: await prisma.brand.count(),
    nameplates: await prisma.nameplate.count(),
    variants: await prisma.variantRevision.count(),
    prices: await prisma.officialPriceObservation.count(),
    engines: await prisma.engine.count(),
    motors: await prisma.motor.count(),
    batteries: await prisma.battery.count(),
    transmissions: await prisma.transmission.count(),
    evidenceSources: await prisma.evidenceSource.count(),
    evidenceLinks: await prisma.evidenceLink.count(),
  });
}
main().finally(() => prisma.$disconnect());
