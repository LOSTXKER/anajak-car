// Phase 7b: เติมข้อมูลที่ phase7 รอบรันแรกยังไม่ได้ใส่ (เฉพาะแถวที่ phase7 เพิ่งสร้างเอง — ไม่แตะข้อมูล Toyota เดิม)
//  1) Generation ใหม่ 7 แถว (Tesla/Benz): chassisType = UNIBODY + EvidenceLink
//  2) Engine ใหม่ 7 แถว: EvidenceLink field=fuelType (invariant ของ verify-vocab.ts)
// idempotent: ข้ามแถวที่มีค่า/ลิงก์แล้ว
import "dotenv/config";
import { prisma } from "../../src/lib/prisma";

const NEW_SLUGS = ["model-3", "model-y", "c-class", "e-class", "s-class", "glc", "eqs"];

async function srcIdByUrl(url: string): Promise<string> {
  const src = await prisma.evidenceSource.findFirstOrThrow({ where: { url } });
  return src.id;
}

async function main() {
  // 1) chassisType ของ generation ใหม่
  for (const slug of NEW_SLUGS) {
    const np = await prisma.nameplate.findUniqueOrThrow({ where: { slug }, include: { generations: true } });
    for (const gen of np.generations) {
      if (gen.chassisType == null) {
        await prisma.generation.update({
          where: { id: gen.id },
          data: { chassisType: "UNIBODY", chassisTypeStatus: "known" },
        });
        const identityLink = await prisma.evidenceLink.findFirstOrThrow({
          where: { entityType: "NAMEPLATE", entityId: np.id, field: "identity" },
        });
        await prisma.evidenceLink.create({
          data: {
            entityType: "GENERATION", entityId: gen.id, field: "chassisType",
            note: "ซีดาน/crossover สมัยใหม่ทุกเจนในชุดนี้ = โครงสร้าง monocoque (unibody) — จัดประเภทตามนิยาม VOCABULARY.md ไม่ใช่ SUV แบบ body-on-frame",
            evidenceSourceId: identityLink.evidenceSourceId,
          },
        });
        console.log(`✓ chassisType UNIBODY: ${slug} / ${gen.code}`);
      }
    }
  }

  // 2) EvidenceLink fuelType ของ engine ใหม่ (จับด้วยลายเซ็นที่ phase7 สร้าง)
  const targets: { where: object; url: string }[] = [
    { where: { code: "OM654" }, url: "https://www.mercedes-benz.co.th/en/passengercars/models/saloon/c-class/overview.html" },
    { where: { code: "OM654M" }, url: "https://www.mercedes-benz.co.th/content/dam/thailand/brochure-specsheet/2026/spec-sheet/GLC_SUV_Specsheet_MAY26.pdf" },
    { where: { code: "M254" }, url: "https://www.mercedes-benz.co.th/content/dam/thailand/brochure-specsheet/2026/spec-sheet/GLC_SUV_Specsheet_MAY26.pdf" },
    { where: { code: null, name: null, displacementCc: 1993, fuelType: "DIESEL" }, url: "https://www.mercedes-benz.co.th/content/dam/thailand/brochure-specsheet/2026/spec-sheet/e-class_spec-sheet-may-26-en.pdf" },
    { where: { code: null, name: null, displacementCc: 1999, fuelType: "GASOLINE" }, url: "https://www.mercedes-benz.co.th/content/dam/thailand/brochure-specsheet/2026/spec-sheet/e-class_spec-sheet-may-26-en.pdf" },
    { where: { name: "OM656-family L6 turbodiesel" }, url: "https://www.mercedes-benz.co.th/content/dam/thailand/brochure-specsheet/2025/s-class/s-class-spec-sheet-sep-2025.pdf" },
    { where: { name: "M256-family L6 turbo petrol" }, url: "https://www.mercedes-benz.co.th/content/dam/thailand/brochure-specsheet/2025/s-class/s-class-spec-sheet-sep-2025.pdf" },
  ];
  for (const t of targets) {
    const engines = await prisma.engine.findMany({ where: t.where });
    if (engines.length !== 1) throw new Error(`ลายเซ็น engine ไม่เจอ/ไม่ unique: ${JSON.stringify(t.where)} → ${engines.length} แถว`);
    const e = engines[0];
    const exists = await prisma.evidenceLink.findFirst({
      where: { entityType: "ENGINE", entityId: e.id, field: "fuelType" },
    });
    if (exists) continue;
    await prisma.evidenceLink.create({
      data: {
        entityType: "ENGINE", entityId: e.id, field: "fuelType",
        note: `สเปกทางการระบุเชื้อเพลิง "${e.fuelTypeRaw}" → ${e.fuelType}`,
        evidenceSourceId: await srcIdByUrl(t.url),
      },
    });
    console.log(`✓ EvidenceLink fuelType: engine ${e.code ?? e.name}`);
  }
  console.log("phase7b เสร็จ");
}
main().finally(() => prisma.$disconnect());
