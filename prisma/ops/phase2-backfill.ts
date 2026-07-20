// Phase 2 (VOCABULARY.md §2.1/§5): backfill โครงสร้าง/ขับเคลื่อน/กระบะ/segment กับข้อมูล Toyota ที่มีจริง
// กติกา: ทุกค่า canonical ที่ตั้ง → มี EvidenceLink คู่เสมอ · ไม่มีหลักฐาน → คง unknown · ห้ามเขียนทับแถวที่ entity อื่นแชร์อยู่
import "dotenv/config";
import { prisma } from "../../src/lib/prisma";

const TODAY = new Date("2026-07-20");

// ── helpers ─────────────────────────────────────────────────

async function officialEvidenceFor(variantIds: string[]): Promise<string | null> {
  if (variantIds.length === 0) return null;
  const obs = await prisma.officialPriceObservation.findMany({
    where: {
      variantRevisionId: { in: variantIds },
      evidenceSource: { sourceType: "MANUFACTURER_OFFICIAL" },
    },
    select: { evidenceSourceId: true },
  });
  if (obs.length === 0) return null;
  const counts = new Map<string, number>();
  for (const o of obs) counts.set(o.evidenceSourceId, (counts.get(o.evidenceSourceId) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

type EntityTypeVal =
  | "TRANSMISSION"
  | "DERIVATIVE"
  | "TRIM"
  | "NAMEPLATE"
  | "GENERATION";

async function linkOnce(
  entityType: EntityTypeVal,
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
  // ── 0) EvidenceSource EDITORIAL แถวแรกจริงของระบบ: การจัดประเภทศัพท์กลาง ──
  let editorial = await prisma.evidenceSource.findFirst({
    where: { sourceType: "EDITORIAL", documentRef: "VOCABULARY.md rev.1" },
  });
  if (!editorial) {
    editorial = await prisma.evidenceSource.create({
      data: {
        sourceType: "EDITORIAL",
        publisher: "CARMETA Data Team",
        title: "การจัดประเภทศัพท์กลาง (canonical vocabulary) rev.1",
        documentRef: "VOCABULARY.md rev.1",
        checkedDate: TODAY,
        checkedBy: "AI session + สเปก VOCABULARY.md (ผ่าน adversarial review)",
        confidence: "MEDIUM",
        notes:
          "การ map ชื่อการตลาด/ข้อความดิบ → คำกลาง ตามกฎ §4 และตารางศัพท์ §6 ของ VOCABULARY.md — ใช้คู่กับหลักฐานทางการของ fact ดิบเสมอ",
      },
    });
    console.log("สร้าง EvidenceSource EDITORIAL rev.1");
  }

  // ── 1) E-CVT reclassify: HEV ที่ถูก seed เป็น CVT → E_CVT_POWER_SPLIT (สร้างแถวใหม่ ไม่ทับของ ICE) ──
  const hevOnCvt = await prisma.variantRevision.findMany({
    where: { powertrainType: { in: ["HEV", "PHEV"] }, transmission: { type: "CVT" } },
    select: { id: true, name: true, transmissionId: true },
  });
  if (hevOnCvt.length > 0) {
    const newTrans = await prisma.transmission.create({
      data: {
        type: "E_CVT_POWER_SPLIT",
        name: "E-CVT",
        notes:
          "reclassify จาก CVT (Phase 2 VOCABULARY.md) — หน้าสเปกทางการระบุ 'Automatic E-CVT' สำหรับรุ่น full hybrid · Toyota full hybrid = THS power-split (ไม่ใช่ CVT สายพาน)",
      },
    });
    const officialEv = await officialEvidenceFor(hevOnCvt.map((v) => v.id));
    if (officialEv) {
      await linkOnce("TRANSMISSION", newTrans.id, "type", officialEv,
        "หน้าสเปกทางการระบุชื่อเกียร์ 'Automatic E-CVT' สำหรับรุ่น HEV");
    }
    await linkOnce("TRANSMISSION", newTrans.id, "type", editorial.id,
      "จัดเป็น E_CVT_POWER_SPLIT ตามนิยาม §6 (Toyota THS = power-split) — ห้ามยุบรวมกับ CVT สายพาน/Honda e-CVT");
    for (const v of hevOnCvt) {
      await prisma.variantRevision.update({ where: { id: v.id }, data: { transmissionId: newTrans.id } });
    }
    console.log(`E-CVT: ย้าย ${hevOnCvt.length} variant HEV → Transmission ใหม่ E_CVT_POWER_SPLIT (แถว CVT เดิมของ ICE ไม่ถูกแตะ)`);
  } else {
    console.log("E-CVT: ไม่มี HEV ค้างบน CVT (ข้าม — อาจรันซ้ำ)");
  }

  // ── 2) cabType บน Derivative ──
  const derivatives = await prisma.derivative.findMany({
    include: { phases: { include: { trims: { include: { variantRevisions: { select: { id: true } } } } } } },
  });
  for (const d of derivatives) {
    const variantIds = d.phases.flatMap((p) => p.trims.flatMap((t) => t.variantRevisions.map((v) => v.id)));
    if (d.bodyType !== "PICKUP") {
      await prisma.derivative.update({
        where: { id: d.id },
        data: { cabType: "NOT_APPLICABLE", cabTypeStatus: "not_applicable" },
      });
      continue;
    }
    const name = d.name ?? "";
    let cab: "SINGLE_CAB" | "EXTENDED_CAB" | "DOUBLE_CAB" | null = null;
    if (/standard cab/i.test(name)) cab = "SINGLE_CAB";
    else if (/smart cab/i.test(name)) cab = "EXTENDED_CAB";
    else if (/double cab/i.test(name)) cab = "DOUBLE_CAB";
    if (!cab) {
      console.log(`cabType: ไม่รู้จักชื่อ derivative "${name}" — คง unknown`);
      continue;
    }
    const officialEv = await officialEvidenceFor(variantIds);
    await prisma.derivative.update({
      where: { id: d.id },
      data: { cabType: cab, cabTypeStatus: officialEv ? "known" : "unknown" },
    });
    if (officialEv) {
      await linkOnce("DERIVATIVE", d.id, "cabType", officialEv,
        `ชื่อตัวถังทางการ "${name}" → ${cab} (Smart Cab ของ Toyota = extended cab ตาม §6)`);
      await linkOnce("DERIVATIVE", d.id, "cabType", editorial.id,
        "map ชื่อแค็บการตลาด → คำกลางตามตาราง §6 (7 ชื่อการค้า = extended cab เดียวกัน)");
    }
    console.log(`cabType: "${name}" → ${cab}`);
  }

  // ── 3) rideHeightClass + marketingLine บน Trim ──
  const trims = await prisma.trim.findMany({
    include: {
      phase: { include: { derivative: true } },
      variantRevisions: { include: { drivetrain: true } },
    },
  });
  const LINES = ["Prerunner", "4TREX", "GR Sport", "Legender", "Leader", "NIGHTSHADE", "Z Edition"];
  for (const t of trims) {
    const isPickup = t.phase.derivative.bodyType === "PICKUP";
    const variantIds = t.variantRevisions.map((v) => v.id);
    const drivetrains = [...new Set(t.variantRevisions.map((v) => v.drivetrain?.type).filter(Boolean))];

    const line = LINES.find((l) => t.name.toLowerCase().includes(l.toLowerCase()));
    if (line && t.marketingLine !== line) {
      await prisma.trim.update({ where: { id: t.id }, data: { marketingLine: line } });
    }

    if (!isPickup) {
      await prisma.trim.update({
        where: { id: t.id },
        data: { rideHeightClass: "NOT_APPLICABLE", rideHeightStatus: "not_applicable" },
      });
      continue;
    }
    if (/prerunner/i.test(t.name)) {
      const officialEv = await officialEvidenceFor(variantIds);
      await prisma.trim.update({
        where: { id: t.id },
        data: { rideHeightClass: "HIGH_RIDER", rideHeightStatus: officialEv ? "known" : "unknown" },
      });
      if (officialEv) {
        await linkOnce("TRIM", t.id, "rideHeightClass", officialEv,
          `ไลน์ "Prerunner" บนหน้าทางการ = กระบะยกสูงขับหลังของ Toyota → HIGH_RIDER`);
        await linkOnce("TRIM", t.id, "rideHeightClass", editorial.id,
          "Prerunner-class (ยกสูง 2WD) ≠ 4WD — คนละ cohort ตาม §6");
      }
      console.log(`rideHeight: "${t.name}" [${drivetrains.join(",")}] → HIGH_RIDER`);
    } else if (drivetrains.length > 0 && drivetrains.every((d) => d === "FOUR_WD")) {
      // 4WD ไม่อยู่ในแกนยกสูง-2WD → not_applicable
      await prisma.trim.update({
        where: { id: t.id },
        data: { rideHeightClass: "NOT_APPLICABLE", rideHeightStatus: "not_applicable" },
      });
      console.log(`rideHeight: "${t.name}" [${drivetrains.join(",")}] → NOT_APPLICABLE (4WD)`);
    } else {
      console.log(`rideHeight: "${t.name}" [${drivetrains.join(",")}] → คง unknown (ไม่เข้าเงื่อนไขชัด)`);
    }
  }

  // ── 4) Segment: Yaris Ativ ECO_CAR → SUBCOMPACT (แกนภาษีแยกไป ecoCarPhase — ยังไม่ตั้งจนกว่ามีหลักฐานภาษี) ──
  const ativ = await prisma.nameplate.findUnique({ where: { slug: "yaris-ativ" } });
  if (ativ && ativ.segment === "ECO_CAR") {
    await prisma.nameplate.update({
      where: { id: ativ.id },
      data: { segment: "SUBCOMPACT", segmentStatus: "known" },
    });
    await linkOnce("NAMEPLATE", ativ.id, "segment", editorial.id,
      "reclassify ECO_CAR → SUBCOMPACT (B-segment ตามมิติตัวถังจากหน้าสเปกทางการ) — แกนภาษีอีโคคาร์แยกไป Generation.ecoCarPhase ซึ่งยังรอหลักฐานทางการ (unknown)");
    console.log("segment: Yaris Ativ ECO_CAR → SUBCOMPACT (ecoCarPhase คง null รอหลักฐานภาษี)");
  }

  // ── 5) chassisType + platformName บน Generation ──
  const gens = await prisma.generation.findMany({ include: { nameplate: true } });
  for (const g of gens) {
    const slug = g.nameplate.slug;
    const text = `${g.name ?? ""} ${g.summary ?? ""}`;
    let chassis: "BODY_ON_FRAME" | "UNIBODY" | null = null;
    let note = "";
    if (slug === "hilux-travo" || slug === "fortuner") {
      chassis = "BODY_ON_FRAME";
      note = "ตระกูล IMV (กระบะ/PPV) = ladder frame — จัดตามนิยาม §6 (PPV ห้ามยุบ cohort กับ crossover)";
    } else if (slug === "corolla-altis" || slug === "yaris-ativ" || slug === "bz4x") {
      chassis = "UNIBODY";
      note = "รถเก๋ง/EV แพลตฟอร์มโมโนค็อก — จัดตามนิยาม §6";
    }
    let platform: string | null = null;
    if (/IMV/i.test(text)) platform = "IMV";
    else if (/e-TNGA/i.test(text)) platform = "e-TNGA";
    else if (/DNGA/i.test(text)) platform = "DNGA";
    else if (/TNGA/i.test(text)) platform = "TNGA";
    if (chassis) {
      await prisma.generation.update({
        where: { id: g.id },
        data: { chassisType: chassis, chassisTypeStatus: "known", platformName: platform ?? undefined },
      });
      await linkOnce("GENERATION", g.id, "chassisType", editorial.id, note);
      console.log(`chassis: ${slug} → ${chassis}${platform ? ` · platform=${platform}` : ""}`);
    }
  }

  // ── สรุป ──
  const counts = {
    evidenceLinks: await prisma.evidenceLink.count(),
    transmissions: await prisma.transmission.count(),
    hevOnEcvt: await prisma.variantRevision.count({
      where: { transmission: { type: "E_CVT_POWER_SPLIT" } },
    }),
    iceOnCvt: await prisma.variantRevision.count({
      where: { transmission: { type: "CVT" } },
    }),
  };
  console.log("สรุป:", JSON.stringify(counts));
}
main().finally(() => prisma.$disconnect());
