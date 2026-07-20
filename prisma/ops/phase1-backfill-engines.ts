// Phase 1 (VOCABULARY.md §2.1/§4): backfill Engine.fuelType/aspiration canonical จาก *Raw
// ทุกค่า canonical ที่ตั้ง ต้องมี EvidenceLink คู่ (กฎ §4) — ชี้ evidence MANUFACTURER_OFFICIAL
// ที่รองรับ variant ของเครื่องนั้นอยู่แล้ว (หน้า spec เดียวกับที่มาของราคา/สเปกดิบ)
import "dotenv/config";
import { prisma } from "../../src/lib/prisma";
import { aspirationFromRaw, fuelTypeFromRaw } from "../vocab";

async function evidenceForEngine(engineId: string): Promise<string | null> {
  // เลือก evidence ที่ถูกใช้บ่อยสุดในกลุ่ม price observation ของ variant ที่ใช้เครื่องนี้ (ทางการเท่านั้น)
  const obs = await prisma.officialPriceObservation.findMany({
    where: {
      variantRevision: { engineId },
      evidenceSource: { sourceType: "MANUFACTURER_OFFICIAL" },
    },
    select: { evidenceSourceId: true },
  });
  if (obs.length === 0) return null;
  const counts = new Map<string, number>();
  for (const o of obs) counts.set(o.evidenceSourceId, (counts.get(o.evidenceSourceId) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

async function linkOnce(engineId: string, field: string, evidenceSourceId: string, note: string) {
  const existing = await prisma.evidenceLink.findFirst({
    where: { entityType: "ENGINE", entityId: engineId, field },
  });
  if (existing) return false;
  await prisma.evidenceLink.create({
    data: { entityType: "ENGINE", entityId: engineId, field, note, evidenceSourceId },
  });
  return true;
}

async function main() {
  const engines = await prisma.engine.findMany();
  for (const e of engines) {
    const fuel = fuelTypeFromRaw(e.fuelTypeRaw);
    const asp = aspirationFromRaw(e.aspirationRaw);
    const evidenceId = await evidenceForEngine(e.id);

    // ตั้ง known เฉพาะเมื่อ map ได้ + มี evidence จริงให้ผูก — ไม่งั้นคง unknown (no false precision)
    const fuelKnown = fuel != null && evidenceId != null;
    const aspKnown = asp != null && evidenceId != null;

    await prisma.engine.update({
      where: { id: e.id },
      data: {
        fuelType: fuel,
        fuelTypeStatus: fuelKnown ? "known" : "unknown",
        aspiration: asp,
        aspirationStatus: aspKnown ? "known" : "unknown",
      },
    });
    if (fuelKnown) {
      await linkOnce(e.id, "fuelType", evidenceId, `map ศัพท์กลางจากสเปกหน้าทางการ: "${e.fuelTypeRaw}" → ${fuel}`);
    }
    if (aspKnown) {
      await linkOnce(e.id, "aspiration", evidenceId, `map ศัพท์กลางจากสเปกหน้าทางการ: "${e.aspirationRaw}" → ${asp}`);
    }
    console.log(
      `${e.code ?? e.id.slice(-6)}: fuel ${e.fuelTypeRaw} → ${fuel ?? "-"} (${fuelKnown ? "known" : "unknown"}) · asp ${e.aspirationRaw ?? "-"} → ${asp ?? "-"} (${aspKnown ? "known" : "unknown"})`,
    );
  }
  const links = await prisma.evidenceLink.count({ where: { entityType: "ENGINE" } });
  console.log(`EvidenceLink(ENGINE) รวม: ${links}`);
}
main().finally(() => prisma.$disconnect());
