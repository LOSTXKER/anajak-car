import "dotenv/config";
import { prisma } from "../../src/lib/prisma";
async function main() {
  const motors = await prisma.motor.findMany({
    include: { variantRevisions: { select: { name: true, trim: { select: { name: true, phase: { select: { derivative: { select: { name: true, generation: { select: { nameplate: { select: { slug: true } } } } } } } } } } } } },
  });
  for (const m of motors) {
    const users = m.variantRevisions.map((v) => `${v.trim.phase.derivative.generation.nameplate.slug}/${v.name ?? v.trim.name}`);
    console.log(`${m.id.slice(-6)} raw="${m.locationRaw}" layout=${m.layout} kW=${m.maxPowerKw} count=${m.count} → ${users.join(" · ")}`);
  }
}
main().finally(() => prisma.$disconnect());
