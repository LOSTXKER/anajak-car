// เมนูนำทาง (pure data) — แยกจาก component เพื่อส่ง server→client ได้
// icon เป็น "iconKey" (string) ไม่ใช่ component ref — ห้ามส่ง function ข้าม server/client boundary
// (component จริงอยู่ NAV_ICONS ใน nav-icons.tsx, map ฝั่ง client)

export type NavIconKey = "home" | "cars" | "brands" | "ladder" | "timeline";

export type NavItem = {
  href: string;
  label: string;
  iconKey: NavIconKey;
  match: "exact" | "prefix";
};

export type NavGroup = { header?: string; items: NavItem[] };

// เมนู global (นอกโซนแบรนด์ + หน้าแรก + mobile drawer เมื่อไม่ได้อยู่โซนแบรนด์)
export const GLOBAL_NAV: NavGroup[] = [
  { items: [{ href: "/", label: "หน้าแรก", iconKey: "home", match: "exact" }] },
  {
    items: [
      { href: "/cars", label: "รุ่นรถทั้งหมด", iconKey: "cars", match: "prefix" },
      // exact — ไม่งั้น prefix จะ active ตอนอยู่โซนแบรนด์ (/brands/[slug]/*) ซ้อนกับเมนูแบรนด์
      { href: "/brands", label: "แบรนด์", iconKey: "brands", match: "exact" },
    ],
  },
];

// เมนูประจำแบรนด์ (โซน /brands/[slug]/*) — หน้าที่ทุกแบรนด์มีเหมือนกัน
// gate หน้าที่ข้อมูลไม่พอ (กฎห้ามหน้า thin): ไม่มีราคา → ซ่อนบันไดราคา · ไม่มี event/ประวัติ → ซ่อนไทม์ไลน์
export function brandNav(
  slug: string,
  flags?: { hasPriceLadder?: boolean; hasTimeline?: boolean },
): NavGroup[] {
  const items: NavItem[] = [
    { href: `/brands/${slug}/cars`, label: "รุ่นรถ", iconKey: "cars", match: "prefix" },
  ];
  if (flags?.hasPriceLadder !== false) {
    items.push({
      href: `/brands/${slug}/price-ladder`,
      label: "บันไดราคา",
      iconKey: "ladder",
      match: "prefix",
    });
  }
  if (flags?.hasTimeline !== false) {
    items.push({
      href: `/brands/${slug}/timeline`,
      label: "ไทม์ไลน์และประวัติ",
      iconKey: "timeline",
      match: "prefix",
    });
  }
  return [
    { items: [{ href: `/brands/${slug}`, label: "หน้าหลัก", iconKey: "home", match: "exact" }] },
    { items },
  ];
}
