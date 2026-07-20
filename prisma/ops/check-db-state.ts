// ตรวจสถานะ DB จริงก่อน apply Phase 0 (VOCABULARY.md)
import "dotenv/config";
import { prisma } from "../../src/lib/prisma";

async function main() {
  const links = await prisma.evidenceLink.groupBy({ by: ["entityType"], _count: true });
  console.log("EvidenceLink entityType:", JSON.stringify(links));
  console.log("AliasMapping rows:", await prisma.aliasMapping.count());
  const sources = await prisma.evidenceSource.findMany({ select: { sourceType: true, publisher: true } });
  console.log("EvidenceSource:", sources.length);
  const byType: Record<string, string[]> = {};
  for (const s of sources) (byType[s.sourceType] ??= []).push(s.publisher ?? "?");
  for (const [t, pubs] of Object.entries(byType)) console.log(` ${t} (${pubs.length}):`, [...new Set(pubs)].join(" | "));
  console.log("PromotionObservation rows:", await prisma.promotionObservation.count());
  const trans = await prisma.transmission.findMany({ include: { variantRevisions: { select: { powertrainType: true } } } });
  for (const t of trans) {
    const pts = [...new Set(t.variantRevisions.map((v) => v.powertrainType))];
    console.log(`Transmission ${t.id.slice(-6)} type=${t.type} gears=${t.gears} name=${t.name ?? "-"} → ${t.variantRevisions.length} variants [${pts.join(",")}]`);
  }
  const engines = await prisma.engine.findMany({ select: { id: true, code: true, fuelType: true, aspiration: true, variantRevisions: { select: { id: true } } } });
  console.log("Engines:", engines.length);
  for (const e of engines) console.log(` ${e.id.slice(-6)} ${e.code} fuel=${e.fuelType} asp=${e.aspiration} → ${e.variantRevisions.length} variants`);
}
main().finally(() => prisma.$disconnect());
