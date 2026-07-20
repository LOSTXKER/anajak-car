// Phase 0 (VOCABULARY.md §2.0 + คำถามค้างเดิม "เพิ่ม enum MEDIA?"):
// คืนความหมาย EDITORIAL — แถวสื่อภายนอกที่เคย map เป็น EDITORIAL ชั่วคราว (seed notes ยอมรับเองว่า schema ไม่มีค่า MEDIA)
// ตรวจแล้วทั้ง 9 แถว EDITORIAL ปัจจุบันเป็นสื่อ/แหล่งอ้างอิงภายนอกทั้งหมด → ย้ายเป็น MEDIA ทั้งชุด
import "dotenv/config";
import { prisma } from "../../src/lib/prisma";

async function main() {
  const moved = await prisma.evidenceSource.updateMany({
    where: { sourceType: "EDITORIAL" },
    data: { sourceType: "MEDIA" },
  });
  console.log(`ย้าย EDITORIAL → MEDIA: ${moved.count} แถว`);
  const byType = await prisma.evidenceSource.groupBy({ by: ["sourceType"], _count: true });
  console.log("สรุป sourceType:", JSON.stringify(byType));
}
main().finally(() => prisma.$disconnect());
