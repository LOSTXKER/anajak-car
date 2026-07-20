// Verify งานภาษากลางทั้งชุด (Phase 0-4) กับ DB จริง — รันซ้ำได้ทุกเมื่อ
import "dotenv/config";
import { prisma } from "../../src/lib/prisma";

async function main() {
  const fail: string[] = [];
  const ok = (cond: boolean, label: string) => {
    console.log(`${cond ? "✅" : "❌"} ${label}`);
    if (!cond) fail.push(label);
  };

  // Phase 0 — governance
  const linkTypes = await prisma.evidenceLink.groupBy({ by: ["entityType"], _count: true });
  ok(linkTypes.every((t) => /^[A-Z_]+$/.test(t.entityType)), `EvidenceLink.entityType เป็น enum ทั้งหมด: ${JSON.stringify(linkTypes.map((t) => `${t.entityType}:${t._count}`))}`);
  const mediaCount = await prisma.evidenceSource.count({ where: { sourceType: "MEDIA" } });
  const editorialCount = await prisma.evidenceSource.count({ where: { sourceType: "EDITORIAL" } });
  ok(mediaCount === 9, `MEDIA source = 9 (จริง: ${mediaCount})`);
  ok(editorialCount === 1, `EDITORIAL เหลือเฉพาะทีมข้อมูลจริง = 1 (จริง: ${editorialCount})`);

  // Phase 1 — engine canonical (นับแบบไม่ hardcode: ทุกตัวต้อง known + ตัวที่ระบุ VN Turbo ต้องเป็น TURBO)
  const engines = await prisma.engine.findMany();
  ok(engines.every((e) => e.fuelType != null && e.fuelTypeStatus === "known"), `Engine ทุกตัวมี fuelType canonical known (${engines.length} ตัว)`);
  ok(
    engines.every((e) => !/turbo/i.test(e.aspirationRaw ?? "") || e.aspiration === "TURBO"),
    "เครื่องที่ aspirationRaw ระบุ turbo ทุกตัว = TURBO canonical",
  );
  ok(engines.every((e) => e.fuelTypeRaw != null), "fuelTypeRaw (ข้อความเดิม) ไม่หาย");
  ok(engines.every((e) => e.maxPowerPs != null), "maxPowerPs ครบ (rename ไม่ทำข้อมูลหาย)");
  // ทุก engine ที่ fuelType known ต้องมี EvidenceLink field=fuelType (เช็คถ้วนด้านล่างแล้ว) — นับรวมเพื่อดู drift
  const engineLinks = await prisma.evidenceLink.count({ where: { entityType: "ENGINE" } });
  ok(engineLinks >= engines.length, `EvidenceLink(ENGINE) ≥ จำนวน engine (จริง: ${engineLinks}/${engines.length})`);

  // Phase 2 — E-CVT / cab / rideHeight / segment / chassis
  const hevWrong = await prisma.variantRevision.count({ where: { powertrainType: "HEV", transmission: { type: "CVT" } } });
  ok(hevWrong === 0, "ไม่มี HEV ค้างบนเกียร์ CVT สายพาน");
  const ecvt = await prisma.variantRevision.count({ where: { transmission: { type: "E_CVT_POWER_SPLIT" } } });
  ok(ecvt === 5, `HEV 5 ตัวอยู่บน E_CVT_POWER_SPLIT (จริง: ${ecvt})`);
  const iceCvt = await prisma.variantRevision.count({ where: { powertrainType: "ICE", transmission: { type: "CVT" } } });
  ok(iceCvt === 6, `ICE 6 ตัวยังอยู่บน CVT เดิม (จริง: ${iceCvt})`);
  const pickupNoCab = await prisma.derivative.count({ where: { bodyType: "PICKUP", cabType: null } });
  ok(pickupNoCab === 0, "กระบะทุก derivative มี cabType");
  const trimNoRide = await prisma.trim.count({ where: { rideHeightStatus: "unknown" } });
  ok(trimNoRide === 0, "ทุก trim มี rideHeightClass ตัดสินแล้ว (ไม่เหลือ unknown)");
  const prerunner = await prisma.trim.count({ where: { rideHeightClass: "HIGH_RIDER" } });
  ok(prerunner === 6, `Prerunner 6 trims = HIGH_RIDER (จริง: ${prerunner})`);
  const ativ = await prisma.nameplate.findUnique({ where: { slug: "yaris-ativ" } });
  ok(ativ?.segment === "SUBCOMPACT", `Yaris Ativ segment = SUBCOMPACT (จริง: ${ativ?.segment})`);
  const gensNoChassis = await prisma.generation.count({ where: { chassisType: null } });
  ok(gensNoChassis === 0, "ทุก generation มี chassisType");

  // Phase 3 — gradeCode / range / charging / hybrid arch (23 จาก notes เดิม + 21 จาก Hilux Champ/Revo)
  const grade = await prisma.variantRevision.count({ where: { gradeCode: { not: null } } });
  ok(grade === 44, `gradeCode = 44 (23 backfill + 21 Champ/Revo · จริง: ${grade})`);
  const hevArch = await prisma.variantRevision.count({ where: { powertrainType: "HEV", hybridArchitecture: "POWER_SPLIT", hybridArchitectureStatus: "known" } });
  ok(hevArch === 5, `HEV 5 ตัว hybridArchitecture=POWER_SPLIT known (จริง: ${hevArch})`);
  const archLeak = await prisma.variantRevision.count({ where: { powertrainType: { in: ["ICE", "BEV"] }, hybridArchitectureStatus: { not: "not_applicable" } } });
  ok(archLeak === 0, "ICE/BEV ทุกตัว hybridArchitectureStatus=not_applicable");
  const chargedBatteries = await prisma.battery.count({ where: { dcMaxKw: { not: null }, dcStatus: "known" } });
  ok(chargedBatteries === 2, `แบตที่มีสเปกชาร์จ DC known = 2 (จริง: ${chargedBatteries})`);

  // Phase 4 — โครง Feature พร้อม (ยังว่างโดยตั้งใจ)
  const featureCount = await prisma.feature.count();
  const trimFeatureCount = await prisma.trimFeature.count();
  ok(featureCount === 0 && trimFeatureCount === 0, "Feature/TrimFeature = โครงเปล่า (ยังไม่ seed ADAS — รอ research หลักฐานรอบหน้า)");

  // Integrity รวม — ทุกค่า canonical known ต้องมี EvidenceLink
  const knownEngines = await prisma.engine.findMany({ where: { fuelTypeStatus: "known" }, select: { id: true } });
  let missing = 0;
  for (const e of knownEngines) {
    const has = await prisma.evidenceLink.count({ where: { entityType: "ENGINE", entityId: e.id, field: "fuelType" } });
    if (has === 0) missing++;
  }
  ok(missing === 0, "engine fuelType known ทุกตัวมี EvidenceLink");
  // evidenceSourceId เป็น NOT NULL ใน schema — นับราคา = variant เสมอ (ทุก variant มีราคา)
  const priceCount = await prisma.officialPriceObservation.count();
  const variantCount = await prisma.variantRevision.count();
  ok(priceCount === 62 && variantCount === 62, `ราคา 62 = variant 62 (จริง: ${priceCount}/${variantCount})`);
  // Phase 5 — Hilux Champ/Revo (2026-07-20)
  const standardRide = await prisma.trim.count({ where: { rideHeightClass: "STANDARD", rideHeightStatus: "known" } });
  ok(standardRide === 14, `กระบะตัวเตี้ย STANDARD known = 14 trims (Champ 5 + Revo 9 · จริง: ${standardRide})`);
  const champ = await prisma.nameplate.findUnique({ where: { slug: "hilux-champ" }, include: { generations: { include: { derivatives: true } } } });
  const revo = await prisma.nameplate.findUnique({ where: { slug: "hilux-revo" }, include: { generations: { include: { derivatives: true } } } });
  ok(champ?.segment === "PICKUP" && revo?.segment === "PICKUP", "Champ/Revo segment = PICKUP known");
  const revoCabs = revo?.generations[0]?.derivatives.map((d) => d.cabType).sort() ?? [];
  ok(JSON.stringify(revoCabs) === JSON.stringify(["DOUBLE_CAB", "EXTENDED_CAB", "SINGLE_CAB"]), `Revo มี 3 derivative ครบ 3 แค็บ (จริง: ${revoCabs.join(",")})`);
  const familyCount = await prisma.nameplate.count({ where: { globalModelFamily: { slug: "hilux" } } });
  ok(familyCount === 3, `GlobalModelFamily hilux เชื่อม 3 nameplate (Travo/Champ/Revo · จริง: ${familyCount})`);
  const man5 = await prisma.variantRevision.count({ where: { transmission: { type: "MANUAL", gears: 5 } } });
  ok(man5 === 3, `เกียร์ 5MT ถูกใช้ 3 variant (Champ MT 2 + Revo 2.4 Entry ช่วงล้อสั้น · จริง: ${man5})`);
  const totalLinks = await prisma.evidenceLink.count();
  console.log(`\nEvidenceLink รวมทั้งระบบ: ${totalLinks} · ${fail.length === 0 ? "ผ่านทุกข้อ ✅" : `ล้มเหลว ${fail.length} ข้อ ❌`}`);
  if (fail.length > 0) process.exit(1);
}
main().finally(() => prisma.$disconnect());
