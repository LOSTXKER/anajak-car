import "dotenv/config";
import { prisma } from "../../src/lib/prisma";
async function main() {
  for (const slug of ["model-3","model-y","c-class","e-class","s-class","glc","eqs"]) {
    const np = await prisma.nameplate.findUniqueOrThrow({ where: { slug },
      include: { generations: { include: { derivatives: { include: { phases: { include: { trims: { include: { variantRevisions: { include: { officialPriceObservations: true } } } } } } } } } } } });
    const variants = np.generations.flatMap(g=>g.derivatives.flatMap(d=>d.phases.flatMap(p=>p.trims.flatMap(t=>t.variantRevisions))));
    const prices = variants.flatMap(v=>v.officialPriceObservations).map(o=>Number(o.amount));
    console.log(`${np.name}: ${variants.length} variants · price ${Math.min(...prices).toLocaleString()}–${Math.max(...prices).toLocaleString()} THB`);
  }
  const newObs = await prisma.officialPriceObservation.findMany({
    where: { observedDate: new Date("2026-07-22") }, include: { evidenceSource: true } });
  const noUrl = newObs.filter(o=>!o.evidenceSource.url);
  console.log(`\nOfficialPriceObservation ใหม่ (2026-07-22): ${newObs.length} · ไม่มี URL หลักฐาน: ${noUrl.length}`);
}
main().finally(()=>prisma.$disconnect());
