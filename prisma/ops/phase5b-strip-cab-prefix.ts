// Phase 5 fixup: ตัด prefix แค็บออกจากชื่อ variant ของ Revo Z Edition — ซ้ำกับหัวกลุ่ม derivative บนหน้าเว็บ
// (บทเรียนเดิม M11: ชื่อรุ่นย่อยห้ามทวนชื่อ derivative — grade title เต็มยังอยู่ครบใน gradeCode + evidence)
import "dotenv/config";
import { prisma } from "../../src/lib/prisma";

async function main() {
  const variants = await prisma.variantRevision.findMany({
    where: {
      name: { startsWith: "Double Cab " },
      trim: { phase: { derivative: { generation: { nameplate: { slug: "hilux-revo" } } } } },
    },
  });
  const smart = await prisma.variantRevision.findMany({
    where: {
      name: { startsWith: "Smart Cab " },
      trim: { phase: { derivative: { generation: { nameplate: { slug: "hilux-revo" } } } } },
    },
  });
  for (const v of [...variants, ...smart]) {
    const newName = v.name!.replace(/^(Double|Smart) Cab\s+/, "");
    await prisma.variantRevision.update({ where: { id: v.id }, data: { name: newName } });
    console.log(`"${v.name}" → "${newName}"`);
  }
  console.log(`แก้ ${variants.length + smart.length} แถว`);
}
main().finally(() => prisma.$disconnect());
