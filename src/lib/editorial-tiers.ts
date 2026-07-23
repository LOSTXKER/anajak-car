// ── Tier list แบบ "ความเห็นบรรณาธิการ" (Editorial) ──
// เก็บเป็น config แยกจากตาราง Fact (canonical entity) โดยตั้งใจ — กฎ "Separate data types":
// นี่คือ "ความเห็น" ไม่ใช่ข้อเท็จจริงที่วัดได้ · ห้ามหลุดเข้าตาราง /cars,/brands
// เบส (บรรณาธิการ) แก้ไฟล์นี้เพื่อจัด/ปรับ tier · แต่ละอันดับต้องมีเหตุผล + แหล่งอ้างอิง
// ถ้า tier list เยอะขึ้นมากในอนาคต ค่อยย้ายไป DB (EditorialTierList/Entry) — ตอนนี้ config พอ

export type EditorialEntry = {
  slug: string; // nameplate slug (ลิงก์ /cars/[slug])
  name: string;
  reason: string; // เหตุผลของอันดับ (บังคับ)
  evidence: { label: string; url?: string }; // หลักฐานประกอบความเห็น
};

export type EditorialTier = {
  label: string; // "S" / "A" / "B" / "C"
  note: string;
  entries: EditorialEntry[];
};

export type EditorialTierList = {
  slug: string; // URL: /tierlist/[slug]
  title: string;
  cohortLabel: string; // กลุ่มที่จัด (บริบท)
  criterion: string; // เกณฑ์การจัด (เปิดเผย)
  author: string;
  authorRole: string;
  updated: string; // วันที่ (ค.ศ.) — ISO string
  tiers: EditorialTier[];
};

const EDITORIAL_TIER_LISTS: EditorialTierList[] = [
  {
    slug: "toyota-2026",
    title: "Toyota น่าซื้อ 2026 — มุมมองเบส",
    cohortLabel: "รถ Toyota ที่ขายในไทยปี 2026 (ทุกเซกเมนต์)",
    criterion:
      "ความเหมาะกับผู้ซื้อทั่วไป — ชั่งจากความคุ้ม, ความง่ายในการดูแล/ขายต่อ, ความครบของออปชั่น และฐานลูกค้า (เป็นการชั่งน้ำหนักแบบความเห็น ไม่ใช่คะแนนสูตรเดียว)",
    author: "เบส",
    authorRole: "บรรณาธิการ CARMETA",
    updated: "2026-07-22",
    tiers: [
      {
        label: "S",
        note: "ตัวเลือกแรกที่แนะนำในกลุ่มนี้",
        entries: [
          { slug: "hilux-revo", name: "Hilux Revo", reason: "กระบะขายดีสุด อะไหล่/ศูนย์ทั่วไทย ขายต่อง่ายสุดในกลุ่ม", evidence: { label: "ราคา/สเปกทางการ toyota.co.th" } },
          { slug: "fortuner", name: "Fortuner", reason: "PPV ตัวเลือกแรกของครอบครัวสายลุย ฐานลูกค้าใหญ่", evidence: { label: "ราคา/สเปกทางการ toyota.co.th" } },
        ],
      },
      {
        label: "A",
        note: "คุ้มและครบ แนะนำถ้าโจทย์ตรง",
        entries: [
          { slug: "hilux-travo", name: "Hilux Travo", reason: "ไลน์อัปกว้างสุด ตั้งแต่ตัวงานถึงท็อป + มีตัว BEV", evidence: { label: "สเปก 4 ตัวถังทางการ" } },
          { slug: "corolla-altis", name: "Corolla Altis", reason: "เก๋งไฮบริดออปชั่น ADAS ครบในกลุ่มราคา", evidence: { label: "ตาราง ADAS ทางการต่อเกรด" } },
        ],
      },
      {
        label: "B",
        note: "ดีในบริบทเฉพาะ",
        entries: [
          { slug: "yaris-ativ", name: "Yaris Ativ", reason: "อีโคคาร์คุ้มค่าตัว เหมาะเมือง/มือใหม่", evidence: { label: "ราคา/เกรดทางการ" } },
          { slug: "bz4x", name: "bZ4X", reason: "EV ศูนย์ Toyota อุ่นใจ แต่ราคายังสูงเทียบคู่แข่ง EV", evidence: { label: "ราคาทางการ + สเปก NEDC" } },
        ],
      },
      {
        label: "C",
        note: "เหมาะงานเฉพาะทาง",
        entries: [
          { slug: "hilux-champ", name: "Hilux Champ", reason: "กระบะพาณิชย์คุ้มงานหนัก/ดัดแปลง แต่ออปชั่นน้อย ไม่เน้นในบ้าน", evidence: { label: "สเปกตัวถัง Cab & Chassis ทางการ" } },
        ],
      },
    ],
  },
];

export function getEditorialTierIndex(): EditorialTierList[] {
  return EDITORIAL_TIER_LISTS;
}

export function getEditorialTierList(slug: string): EditorialTierList | null {
  return EDITORIAL_TIER_LISTS.find((l) => l.slug === slug) ?? null;
}
