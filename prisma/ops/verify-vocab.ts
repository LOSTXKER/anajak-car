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

  // Phase 1 — engine canonical
  const engines = await prisma.engine.findMany();
  ok(engines.every((e) => e.fuelType != null && e.fuelTypeStatus === "known"), `Engine ทุกตัวมี fuelType canonical known (${engines.length} ตัว)`);
  ok(engines.filter((e) => e.aspiration === "TURBO").length === 5, "เครื่องดีเซล 5 ตัว = TURBO");
  ok(engines.every((e) => e.fuelTypeRaw != null), "fuelTypeRaw (ข้อความเดิม) ไม่หาย");
  ok(engines.every((e) => e.maxPowerPs != null), "maxPowerPs ครบ (rename ไม่ทำข้อมูลหาย)");
  const engineLinks = await prisma.evidenceLink.count({ where: { entityType: "ENGINE" } });
  ok(engineLinks === 14, `EvidenceLink(ENGINE) = 14 (จริง: ${engineLinks})`);

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

  // Phase 3 — gradeCode / range / charging / hybrid arch
  const grade = await prisma.variantRevision.count({ where: { gradeCode: { not: null } } });
  ok(grade === 23, `gradeCode ดึงจาก notes = 23 (จริง: ${grade})`);
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
  // evidenceSourceId เป็น NOT NULL ใน schema — เช็คแค่จำนวนราคาไม่เปลี่ยน (งานนี้ไม่แตะราคา)
  const priceCount = await prisma.officialPriceObservation.count();
  ok(priceCount === 41, `ราคา official ยังครบ 41 แถว (จริง: ${priceCount})`);
  const totalLinks = await prisma.evidenceLink.count();
  console.log(`\nEvidenceLink รวมทั้งระบบ: ${totalLinks} · ${fail.length === 0 ? "ผ่านทุกข้อ ✅" : `ล้มเหลว ${fail.length} ข้อ ❌`}`);
  if (fail.length > 0) process.exit(1);
}
main().finally(() => prisma.$disconnect());
