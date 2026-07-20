// เติมปีเปิดตัวเจเนอเรชัน Hilux Champ (2023) + Hilux Revo (2015) — เบสสั่งเพิ่มคอลัมน์ปีในตารางหน้าแรก
// แหล่ง: สื่อยานยนต์ (MEDIA/MEDIUM) หลายแหล่งตรงกัน — ตามกฎ VOCABULARY.md §4 (แหล่งรองที่วันที่ชัดเจน)
import "dotenv/config";
import { prisma } from "../../src/lib/prisma";

const TODAY = new Date("2026-07-20");

async function main() {
  const champEv = await prisma.evidenceSource.create({
    data: {
      sourceType: "MEDIA",
      publisher: "AutoLifeThailand",
      title: "กระบะเล็ก Toyota Hilux CHAMP (IMV0) เปิดตัวในไทย 27 พฤศจิกายน 2023",
      url: "https://autolifethailand.tv/toyota-hilux-champ-imv0-coming-thailand-27nov-2023/",
      publishedDate: new Date("2023-11-01"),
      checkedDate: TODAY,
      checkedBy: "AI session (fetch ยืนยันเนื้อหาจริง 2026-07-20)",
      confidence: "MEDIUM",
      notes:
        "วันเปิดตัวไทย 27 พ.ย. 2023 — corroborate: grandprix.co.th, autostation.com, motorexpo.co.th รายงานตรงกัน · หน้า global.toyota (album 40145544) เข้าถึงไม่ได้ตอนตรวจ (403)",
    },
  });
  const revoEv = await prisma.evidenceSource.create({
    data: {
      sourceType: "MEDIA",
      publisher: "Wikipedia (corroborate: WardsAuto, Bangkok Post)",
      title: "Toyota Hilux (eighth generation) — world premiere ที่กรุงเทพฯ 21 พฤษภาคม 2015 ในชื่อ Hilux Revo",
      url: "https://en.wikipedia.org/wiki/Toyota_Hilux",
      checkedDate: TODAY,
      checkedBy: "AI session (ตรวจหลายแหล่งตรงกัน 2026-07-20)",
      confidence: "MEDIUM",
      notes:
        "เจน 8 เปิดตัวพร้อมกันที่กรุงเทพฯ/ซิดนีย์ 21 พ.ค. 2015 · ตลาดไทยใช้ชื่อ Hilux Revo · corroborate: wardsauto.com (world premiere Bangkok), bangkokpost.com/auto/news/568791 (ติด paywall gateway ตอนตรวจ)",
    },
  });

  const updates = [
    { slug: "hilux-champ", year: 2023, from: new Date("2023-11-27"), ev: champEv.id },
    { slug: "hilux-revo", year: 2015, from: new Date("2015-05-21"), ev: revoEv.id },
  ];
  for (const u of updates) {
    const gen = await prisma.generation.findFirstOrThrow({
      where: { nameplate: { slug: u.slug } },
    });
    await prisma.generation.update({
      where: { id: gen.id },
      data: { launchYear: u.year, generationFrom: u.from },
    });
    await prisma.evidenceLink.create({
      data: {
        entityType: "GENERATION",
        entityId: gen.id,
        field: "launchYear",
        note: `ปีเปิดตัว ${u.year} (วันเปิดตัว ${u.from.toISOString().slice(0, 10)})`,
        evidenceSourceId: u.ev,
      },
    });
    console.log(`${u.slug}: launchYear=${u.year} + evidence`);
  }

  const noYear = await prisma.generation.count({ where: { launchYear: null } });
  console.log(`generation ที่ยังไม่มีปี: ${noYear} (ควรเป็น 0)`);
}
main().finally(() => prisma.$disconnect());
