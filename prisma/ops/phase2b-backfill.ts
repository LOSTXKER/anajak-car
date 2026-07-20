// Phase 2 ต่อ: backfill Motor.layout + Battery.chemistry (unknown โดยตั้งใจ) + เก็บตก Travo-e AWD
import "dotenv/config";
import { prisma } from "../../src/lib/prisma";
import { batteryChemistryFromRaw, motorLayoutFromRaw } from "../vocab";

async function main() {
  // Motor layout จาก locationRaw — fact กลาง (หน้า/หลัง/คู่) แยกจากศัพท์การตลาด (eAxle) และชนิดมอเตอร์ (PMSM — Phase 5)
  const motors = await prisma.motor.findMany();
  for (const m of motors) {
    const layout = motorLayoutFromRaw(m.locationRaw);
    // count=2 ต้องสอดคล้อง DUAL — ถ้าขัดกันคง unknown
    const consistent = layout !== null && (m.count == null || (m.count >= 2) === (layout === "DUAL"));
    await prisma.motor.update({
      where: { id: m.id },
      data: { layout, layoutStatus: consistent && layout ? "known" : "unknown" },
    });
    console.log(`motor ${m.id.slice(-6)}: "${m.locationRaw}" (count=${m.count}) → ${layout ?? "-"} (${consistent && layout ? "known" : "unknown"})`);
  }

  // Battery chemistry — "ลิเธียมไอออน" map ไม่ได้ → unknown โดยตั้งใจ (ถอยหลังอย่างซื่อสัตย์)
  const batteries = await prisma.battery.findMany();
  for (const b of batteries) {
    const chem = batteryChemistryFromRaw(b.chemistryRaw);
    await prisma.battery.update({
      where: { id: b.id },
      data: { chemistry: chem, chemistryStatus: chem ? "known" : "unknown" },
    });
    console.log(`battery ${b.id.slice(-6)}: "${b.chemistryRaw}" → ${chem ?? "unknown (หยาบเกิน map)"}`);
  }

  // เก็บตก: กระบะ AWD (Travo-e 4TREX มอเตอร์คู่) — แกน "ยกสูง 2WD" ไม่ครอบรถ AWD → NOT_APPLICABLE
  const awdPickupTrims = await prisma.trim.findMany({
    where: {
      rideHeightStatus: "unknown",
      phase: { derivative: { bodyType: "PICKUP" } },
      variantRevisions: { every: { drivetrain: { type: { in: ["AWD", "AWD_ON_DEMAND", "AWD_FULL_TIME"] } } } },
    },
  });
  for (const t of awdPickupTrims) {
    await prisma.trim.update({
      where: { id: t.id },
      data: { rideHeightClass: "NOT_APPLICABLE", rideHeightStatus: "not_applicable" },
    });
    console.log(`rideHeight เก็บตก: "${t.name}" (AWD) → NOT_APPLICABLE`);
  }

  console.log("เหลือ trim ที่ rideHeight ยัง unknown:", await prisma.trim.count({ where: { rideHeightStatus: "unknown" } }));
}
main().finally(() => prisma.$disconnect());
