// Phase 5 (VOCABULARY.md + PLAN M15): append Hilux Champ (6) + Hilux Revo Standard Cab/Z Edition (15)
// = 21 variant จาก API ทางการ toyota.co.th fetch สด 2026-07-20 (prisma/ops/data/hilux-3lines-20260720.json)
//
// หลักที่ยึด:
//  - append-only: ไม่แตะแถวเดิมใดๆ ยกเว้น (1) เติม globalModelFamilyId ที่เป็น null ของ hilux-travo
//  - exact entity: เครื่องยนต์/เกียร์ reuse เฉพาะเมื่อสเปกตรงเป๊ะ (code+cc+PS+Nm / type+gears) ไม่งั้นสร้างใหม่
//  - evidence-first: EvidenceSource ใหม่ 3 แถว (ต่อไลน์) + EvidenceLink ทุกค่า canonical ที่ตั้ง
//  - ภาษากลางครบตาม VOCABULARY.md: cabType/rideHeightClass(STANDARD ตัวแรกของระบบ)/fuelType/aspiration/
//    gradeCode/marketingLine/chassisType · drivetrain "ขับเคลื่อน 2 ล้อ" → RWD ตามกฎกระบะ §4
//  - กันรันซ้ำ: ถ้ามี nameplate slug ใดอยู่แล้ว จะ abort ทันที
import "dotenv/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { prisma } from "../../src/lib/prisma";

const TODAY = new Date("2026-07-20");
const DATA = JSON.parse(
  readFileSync(join(__dirname, "data", "hilux-3lines-20260720.json"), "utf8"),
) as Record<string, LineData>;

type GradeData = {
  title: string;
  price: number;
  grade_code: string | null;
  transmission_field: string | null;
  transmission_en: string | null;
  transmission_spec: string | null;
  total_seat: number | null;
  engine: {
    model: string | null;
    cc: number | null;
    kW: number | null;
    PS: number | null;
    torqueNm: number | null;
    powerRaw: string | null;
    torqueRaw: string | null;
    fuel: string | null;
  };
  dims: string | null;
  wheelbase: string | null;
  seats_spec: string | null;
  drive: string | null;
};
type LineData = { title: string; model_year: string; grades: GradeData[] };

// ── โครง nameplate ที่จะสร้าง ────────────────────────────────
const PLAN = [
  {
    slug: "hilux-champ",
    name: "Hilux Champ",
    lines: ["hilux_champ"],
    summary:
      "กระบะพาณิชย์ไลน์ประหยัดของตระกูล Hilux — ตอนเดียว (Single Cab) ดีเซล 2.4 ขับหลังทั้งหมด มีช่วงล้อสั้น/ยาว (SWB/LWB) และแบบไม่มีกระบะท้าย (Cab & Chassis) สำหรับต่อตัวถังเอง · ขายคู่กับ Hilux Revo และ Hilux Travo",
    genName: "Hilux Champ",
    genCode: "GUN1xx",
    genSummary:
      "เจนแรกของไลน์ Champ — รหัสรุ่นทางการขึ้นต้น GUN100R/GUN110R/GUN120R/GUN122R (โครง IMV ร่วมตระกูล Hilux) · ปีเปิดตัวไลน์ไม่ได้ verify จากแหล่งที่ fetch รอบนี้ (ข้อมูลรุ่นปัจจุบัน MY 10/2025)",
    platformName: null as string | null,
  },
  {
    slug: "hilux-revo",
    name: "Hilux Revo",
    lines: ["hilux_revo_standard", "hilux_revo_zedition"],
    summary:
      "เจนก่อน Travo ของตระกูล Hilux (รหัส GUN12x) ที่ยังขายคู่กัน 2 ไลน์: Standard Cab (กระบะพาณิชย์ตอนเดียว) และ Z Edition (ตัวเตี้ยสไตล์สปอร์ต Smart Cab/Double Cab รวม GR Sport) — ดีเซล 4x2 ทั้งหมด",
    genName: "Revo",
    genCode: "GUN12x",
    genSummary:
      "เจน Revo (ก่อน Travo GUN226R/236R) — รหัสรุ่นทางการขึ้นต้น GUN11xR/GUN12xR บนแพลตฟอร์ม IMV · ปีเปิดตัวเจน (2015 ตามข้อมูลสาธารณะ) ไม่ได้ verify จากแหล่งที่ fetch รอบนี้จึงไม่บันทึก",
    platformName: "IMV",
  },
];

// ── helpers ─────────────────────────────────────────────────
function engineSig(g: GradeData): string {
  const code = (g.engine.model ?? "").split("/")[0].trim().replace(/\s+/g, " ");
  return `${code}|${g.engine.cc}|${g.engine.PS}|${g.engine.torqueNm}`;
}

function transSpecOf(g: GradeData): { type: "MANUAL" | "AUTOMATIC"; gears: number } {
  // ยึดตารางสเปกทางการ (transmission_spec) เป็นหลัก — field EN เคยย่อผิด (2.8 Entry: TH=6 จังหวะ, EN=5MT)
  const t = g.transmission_spec ?? g.transmission_field ?? "";
  const gears = parseInt(t.match(/(\d+)\s*จังหวะ/)?.[1] ?? "0", 10);
  const type = t.includes("อัตโนมัติ") ? "AUTOMATIC" : "MANUAL";
  if (!gears) throw new Error(`อ่านจำนวนเกียร์ไม่ได้: "${t}" (${g.title})`);
  return { type, gears };
}

function trimNameOf(gradeTitle: string): string {
  // ตัด MT/AT (ตัวแยก variant ไม่ใช่ trim) + ตัด prefix แค็บ (ซ้ำกับชื่อ derivative — บทเรียน M11)
  return gradeTitle
    .replace(/^((Double|Smart|Standard) Cab)\s+/i, "")
    .replace(/\s+(MT|AT)(\s+|$)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function marketingLineOf(gradeTitle: string): string | null {
  if (/GR Sport/i.test(gradeTitle)) return "GR Sport";
  if (/Z Edition/i.test(gradeTitle)) return "Z Edition";
  if (/Attractive Package/i.test(gradeTitle)) return "Attractive Package";
  return null;
}

async function linkOnce(
  entityType:
    | "NAMEPLATE"
    | "GENERATION"
    | "DERIVATIVE"
    | "TRIM"
    | "ENGINE"
    | "TRANSMISSION"
    | "VARIANT_REVISION",
  entityId: string,
  field: string,
  evidenceSourceId: string,
  note: string,
) {
  const existing = await prisma.evidenceLink.findFirst({
    where: { entityType, entityId, field, evidenceSourceId },
  });
  if (existing) return;
  await prisma.evidenceLink.create({
    data: { entityType, entityId, field, note, evidenceSourceId },
  });
}

async function main() {
  // กันรันซ้ำ
  for (const p of PLAN) {
    if (await prisma.nameplate.findUnique({ where: { slug: p.slug } })) {
      throw new Error(`nameplate ${p.slug} มีอยู่แล้ว — abort (append-only, ห้าม seed ทับ)`);
    }
  }

  const brand = await prisma.brand.findFirstOrThrow({ where: { slug: "toyota" } });
  const presence = await prisma.marketPresence.findFirstOrThrow({ where: { brandId: brand.id } });
  const editorial = await prisma.evidenceSource.findFirstOrThrow({
    where: { sourceType: "EDITORIAL", documentRef: "VOCABULARY.md rev.1" },
  });

  // ── GlobalModelFamily "Hilux" — เชื่อม 3 nameplate ของตระกูล ──
  let family = await prisma.globalModelFamily.findUnique({ where: { slug: "hilux" } });
  if (!family) {
    family = await prisma.globalModelFamily.create({
      data: {
        slug: "hilux",
        name: "Hilux",
        brandId: brand.id,
        notes:
          "ตระกูลกระบะ Hilux ในไทยขายคู่กัน 3 nameplate: Hilux Champ / Hilux Revo / Hilux Travo (ยืนยันจากหน้า model-list ทางการ 2026-07-20)",
      },
    });
  }
  const travo = await prisma.nameplate.findUnique({ where: { slug: "hilux-travo" } });
  if (travo && !travo.globalModelFamilyId) {
    await prisma.nameplate.update({
      where: { id: travo.id },
      data: { globalModelFamilyId: family.id },
    });
    console.log("เชื่อม hilux-travo เข้า GlobalModelFamily hilux");
  }

  // ── EvidenceSource ต่อไลน์ (fetch สดวันนี้) ──
  const lineSources = new Map<string, string>();
  for (const [lineCode, line] of Object.entries(DATA)) {
    const src = await prisma.evidenceSource.create({
      data: {
        sourceType: "MANUFACTURER_OFFICIAL",
        publisher: "Toyota Motor Thailand",
        title: `${line.title} — ราคา/สเปกทางการ (หน้า grade + specification)`,
        url: `https://www.toyota.co.th/model/${lineCode}/grade`,
        documentRef: `API: /model/api/car/?series_code=${lineCode} + /api-service/car/series (version 739)`,
        publishedDate: null,
        checkedDate: TODAY,
        checkedBy: "AI session (fetch สดจาก API ทางการของเว็บ toyota.co.th)",
        confidence: "HIGH",
        notes: `ราคา/grade_code/สเปกทุก variant ของไลน์ ${line.title} เห็นจริงใน payload วันที่ 2026-07-20 · model_year=${line.model_year} · raw JSON เก็บที่ prisma/ops/data/hilux-3lines-20260720.json`,
      },
    });
    lineSources.set(lineCode, src.id);
  }

  // ── Engine: reuse เมื่อสเปกตรงเป๊ะ ไม่งั้นสร้างใหม่ ──
  const existingEngines = await prisma.engine.findMany();
  const engineIds = new Map<string, string>();
  const engineGrades = new Map<string, { g: GradeData; lineCode: string }[]>();
  for (const [lineCode, line] of Object.entries(DATA)) {
    for (const g of line.grades) {
      const sig = engineSig(g);
      if (!engineGrades.has(sig)) engineGrades.set(sig, []);
      engineGrades.get(sig)!.push({ g, lineCode });
    }
  }
  for (const [sig, users] of engineGrades) {
    const { g, lineCode } = users[0];
    const code = (g.engine.model ?? "").split("/")[0].trim();
    const match = existingEngines.find(
      (e) =>
        (e.code ?? "").replace(/\s+/g, "") === code.replace(/\s+/g, "") &&
        e.displacementCc === g.engine.cc &&
        e.maxPowerPs === g.engine.PS &&
        e.maxTorqueNm === g.engine.torqueNm,
    );
    if (match) {
      engineIds.set(sig, match.id);
      console.log(`engine reuse: ${sig} → ${match.id.slice(-6)} (สเปกตรงเป๊ะ)`);
      continue;
    }
    // สร้างใหม่ — desc ที่มี "VN Turbo" ใช้เป็น aspirationRaw (บาง grade ของเครื่องเดียวกัน desc ละคำ turbo)
    const descs = users.map((u) => u.g.engine.model ?? "");
    const turboDesc = descs.find((d) => /turbo/i.test(d));
    const asp = turboDesc ? "TURBO" : null;
    const note344 =
      g.engine.torqueNm === 344
        ? " · ทางการระบุแรงบิด 344 Nm สำหรับ grade นี้ (ไลน์อื่นระบุ 343 สำหรับเครื่องรหัสเดียวกัน — บันทึกตามแหล่งต่อไลน์ ไม่ปรับให้เท่ากันเอง)"
        : "";
    const created = await prisma.engine.create({
      data: {
        code,
        displacementCc: g.engine.cc,
        cylinders: 4,
        aspirationRaw: turboDesc ? "VN Turbo + Intercooler" : null,
        aspiration: asp,
        aspirationStatus: asp ? "known" : "unknown",
        fuelTypeRaw: g.engine.fuel ?? "ดีเซล",
        fuelType: "DIESEL",
        fuelTypeStatus: "known",
        maxPowerPs: g.engine.PS,
        maxTorqueNm: g.engine.torqueNm,
        powerStatus: "known",
        notes: `กำลังทางการ ${g.engine.powerRaw} · แรงบิด ${g.engine.torqueRaw}${note344}`,
      },
    });
    engineIds.set(sig, created.id);
    const ev = lineSources.get(lineCode)!;
    await linkOnce("ENGINE", created.id, "fuelType", ev, `สเปกทางการระบุ "${g.engine.fuel}" → DIESEL`);
    if (asp) await linkOnce("ENGINE", created.id, "aspiration", ev, `สเปกทางการระบุ VN Turbo → TURBO`);
    console.log(`engine create: ${sig} → ${created.id.slice(-6)}`);
  }

  // ── Transmission: reuse (type,gears) ตรง · สร้าง 5MT ใหม่ถ้าไม่มี ──
  const existingTrans = await prisma.transmission.findMany();
  async function transIdOf(g: GradeData, lineCode: string): Promise<string> {
    const spec = transSpecOf(g);
    const match = existingTrans.find((t) => t.type === spec.type && t.gears === spec.gears);
    if (match) return match.id;
    const conflictNote =
      g.transmission_en && !g.transmission_en.includes(String(spec.gears))
        ? ` · field EN ทางการระบุ "${g.transmission_en}" ขัดแย้งกับตารางสเปก ("${g.transmission_spec}") — ยึดตารางสเปก`
        : "";
    const created = await prisma.transmission.create({
      data: {
        type: spec.type,
        gears: spec.gears,
        notes: `จากตารางสเปกทางการ: "${g.transmission_spec}"${conflictNote}`,
      },
    });
    existingTrans.push(created);
    await linkOnce("TRANSMISSION", created.id, "type", lineSources.get(lineCode)!,
      `ตารางสเปกทางการระบุ "${g.transmission_spec}"`);
    console.log(`transmission create: ${spec.type} ${spec.gears} จังหวะ`);
    return created.id;
  }

  // ── Drivetrain RWD: reuse ──
  const rwd = await prisma.drivetrain.findFirstOrThrow({ where: { type: "RWD" } });

  // ── สร้างต้นไม้ต่อ nameplate ──
  let variantCount = 0;
  let priceCount = 0;
  for (const p of PLAN) {
    const nameplate = await prisma.nameplate.create({
      data: {
        slug: p.slug,
        name: p.name,
        marketPresenceId: presence.id,
        globalModelFamilyId: family.id,
        segment: "PICKUP",
        segmentStatus: "known",
        lifecycleStatus: "CURRENT",
        summary: p.summary,
      },
    });
    for (const lineCode of p.lines) {
      await linkOnce("NAMEPLATE", nameplate.id, "segment", lineSources.get(lineCode)!,
        'หมวดทางการบนเว็บ: "รถเพื่อการพาณิชย์ (กระบะ)" → Segment.PICKUP');
    }

    const generation = await prisma.generation.create({
      data: {
        nameplateId: nameplate.id,
        code: p.genCode,
        name: p.genName,
        summary: p.genSummary,
        lifecycleStatus: "CURRENT",
        chassisType: "BODY_ON_FRAME",
        chassisTypeStatus: "known",
        platformName: p.platformName,
      },
    });
    await linkOnce("GENERATION", generation.id, "chassisType", editorial.id,
      "กระบะตระกูล Hilux (โครง IMV) = ladder frame ตามนิยาม VOCABULARY.md §6");

    // จัด derivative ตามแค็บ (จากชื่อ grade/ไลน์) — Champ/Revo Standard = ตอนเดียวทั้งไลน์
    type DKey = "SINGLE" | "SMART" | "DOUBLE";
    const derivMap = new Map<DKey, { name: string; cab: "SINGLE_CAB" | "EXTENDED_CAB" | "DOUBLE_CAB"; grades: { g: GradeData; lineCode: string }[] }>();
    for (const lineCode of p.lines) {
      for (const g of DATA[lineCode].grades) {
        let key: DKey = "SINGLE";
        if (/^Smart Cab/i.test(g.title)) key = "SMART";
        else if (/^Double Cab/i.test(g.title)) key = "DOUBLE";
        if (!derivMap.has(key)) {
          const label = p.slug === "hilux-champ" ? "Champ Single Cab" :
            key === "SINGLE" ? "Revo Standard Cab" : key === "SMART" ? "Revo Smart Cab" : "Revo Double Cab";
          derivMap.set(key, {
            name: label,
            cab: key === "SINGLE" ? "SINGLE_CAB" : key === "SMART" ? "EXTENDED_CAB" : "DOUBLE_CAB",
            grades: [],
          });
        }
        derivMap.get(key)!.grades.push({ g, lineCode });
      }
    }

    for (const [, d] of derivMap) {
      const derivative = await prisma.derivative.create({
        data: {
          generationId: generation.id,
          bodyType: "PICKUP",
          name: d.name,
          cabType: d.cab,
          cabTypeStatus: "known",
        },
      });
      const ev0 = lineSources.get(d.grades[0].lineCode)!;
      await linkOnce("DERIVATIVE", derivative.id, "cabType", ev0,
        `ชื่อตัวถัง/จำนวนที่นั่งจากหน้าทางการ → ${d.cab}`);
      await linkOnce("DERIVATIVE", derivative.id, "cabType", editorial.id,
        "map ชื่อแค็บ → คำกลางตามตาราง VOCABULARY.md §6");

      const phase = await prisma.phase.create({
        data: {
          derivativeId: derivative.id,
          phaseType: "INITIAL",
          name: `ไลน์อัปปัจจุบัน (MY ${DATA[d.grades[0].lineCode].model_year.replace(/^(\d{2})(\d{4})$/, "$1/$2")})`,
        },
      });

      // จัด trim (ตัด MT/AT + prefix แค็บ)
      const trimMap = new Map<string, { g: GradeData; lineCode: string }[]>();
      for (const item of d.grades) {
        const tn = trimNameOf(item.g.title);
        if (!trimMap.has(tn)) trimMap.set(tn, []);
        trimMap.get(tn)!.push(item);
      }

      for (const [trimName, items] of trimMap) {
        const mLine = marketingLineOf(items[0].g.title);
        const trim = await prisma.trim.create({
          data: {
            phaseId: phase.id,
            name: trimName,
            marketingLine: mLine,
            // ตัวเตี้ย 4x2 ทั้งหมด — STANDARD ตัวแรกของระบบ (หลักฐาน: ขับเคลื่อน 2 ล้อ + มิติสูง ~1,690 มม. + positioning ทางการ)
            rideHeightClass: "STANDARD",
            rideHeightStatus: "known",
          },
        });
        const evT = lineSources.get(items[0].lineCode)!;
        await linkOnce("TRIM", trim.id, "rideHeightClass", evT,
          `สเปกทางการ: ขับเคลื่อน 2 ล้อ + มิติภายนอกสูง ~1,690 มม. (เทียบไลน์ยกสูง ~1,860) → กระบะตัวเตี้ย`);
        await linkOnce("TRIM", trim.id, "rideHeightClass", editorial.id,
          "STANDARD = กระบะเตี้ย 2WD ตามนิยาม VOCABULARY.md §6 — คนละ cohort กับ HIGH_RIDER/4WD");

        for (const { g, lineCode } of items) {
          const cnc = /ไม่มีกระบะ|C&C/i.test(g.title)
            ? " · Cab & Chassis (ไม่มีกระบะท้าย — สำหรับต่อตัวถังเอง)"
            : "";
          const variant = await prisma.variantRevision.create({
            data: {
              trimId: trim.id,
              name: g.title,
              powertrainType: "ICE",
              hybridArchitectureStatus: "not_applicable",
              gradeCode: g.grade_code,
              modelYear: 2025,
              modelYearStatus: "known",
              seatCount: g.total_seat,
              seatCountStatus: g.total_seat != null ? "known" : "unknown",
              engineId: engineIds.get(engineSig(g)),
              transmissionId: await transIdOf(g, lineCode),
              drivetrainId: rwd.id,
              notes:
                `กำลังทางการ ${g.engine.powerRaw} kW(PS)/rpm · แรงบิด ${g.engine.torqueRaw} · ` +
                `เกียร์ตามตารางสเปก "${g.transmission_spec}" · ขับเคลื่อนทางการ "${g.drive}" → RWD ตามสถาปัตยกรรมกระบะ (กฎ VOCABULARY.md §4) · ` +
                `มิติ ${g.dims ?? "-"} มม.${cnc} · model_year ${DATA[lineCode].model_year} (รอบข้อมูลรุ่น ไม่ใช่ปีจดทะเบียน)`,
            },
          });
          if (g.grade_code) {
            await linkOnce("VARIANT_REVISION", variant.id, "gradeCode", lineSources.get(lineCode)!,
              `รหัสรุ่นทางการ ${g.grade_code}`);
          }
          await prisma.officialPriceObservation.create({
            data: {
              variantRevisionId: variant.id,
              priceType: "OFFICIAL_LIST_PRICE",
              currency: "THB",
              amount: g.price,
              amountStatus: "known",
              observedDate: TODAY,
              evidenceSourceId: lineSources.get(lineCode)!,
              notes: "ราคาป้ายจาก API ทางการ (field price) fetch สด 2026-07-20 — ไม่ใช่ราคาซื้อขายจริง",
            },
          });
          variantCount++;
          priceCount++;
        }
      }
    }
    console.log(`✓ ${p.name}: สร้างครบ`);
  }

  console.log(`\nสรุป: +${variantCount} variant · +${priceCount} ราคา`);
  console.log("รวมทั้งระบบ:", {
    variants: await prisma.variantRevision.count(),
    prices: await prisma.officialPriceObservation.count(),
    nameplates: await prisma.nameplate.count(),
    engines: await prisma.engine.count(),
    transmissions: await prisma.transmission.count(),
    evidenceSources: await prisma.evidenceSource.count(),
    evidenceLinks: await prisma.evidenceLink.count(),
  });
}
main().finally(() => prisma.$disconnect());
