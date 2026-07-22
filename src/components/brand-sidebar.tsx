"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/brand-shortcuts";

// Sidebar ประจำแบรนด์ (desktop ≥lg) — เมนูเนื้อหาของแบรนด์ "1 หน้า 1 เรื่อง" (แบบหมวดใน prydwen)
// ไม่ใช่ลิสต์ชื่อรุ่น · เครื่องมือกลาง (ค้นหา/สลับแบรนด์/จัดอันดับ) อยู่ navbar
const svg = (c?: string) => ({ viewBox: "0 0 24 24", className: c ?? "size-[18px] shrink-0", fill: "none" as const, stroke: "currentColor", strokeWidth: "1.7", strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true });

type Item = { href: string; label: string; icon: React.ReactElement; match: "exact" | "prefix" };

export function BrandSidebar({ brand }: { brand: { slug: string; name: string } }) {
  const pathname = usePathname();
  const base = `/brands/${brand.slug}`;
  const items: Item[] = [
    { href: base, label: "ภาพรวมและรุ่นรถ", match: "exact", icon: <svg {...svg()}><path d="M3 13.5h18M5 13.5l1.8-4.2A2 2 0 0 1 8.6 8h6.8a2 2 0 0 1 1.8 1.3l1.8 4.2" /><circle cx="7.5" cy="17" r="1.6" /><circle cx="16.5" cy="17" r="1.6" /></svg> },
    { href: `${base}/timeline`, label: "ไทม์ไลน์และประวัติ", match: "prefix", icon: <svg {...svg()}><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3.2 1.8" /></svg> },
    { href: `${base}/sources`, label: "แหล่งอ้างอิง", match: "prefix", icon: <svg {...svg()}><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H18a2 2 0 0 1 2 2v12.5a1.5 1.5 0 0 1-1.5 1.5H6a2 2 0 0 1-2-2z" /><path d="M8 8h8M8 12h8M8 16h5" /></svg> },
  ];

  const rowBase = "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors";
  const rowIdle = "text-muted hover:bg-surface-muted hover:text-foreground";
  const rowActive = "bg-accent-soft font-medium text-accent";
  const isActive = (it: Item) => (it.match === "exact" ? pathname === it.href : pathname === it.href || pathname.startsWith(it.href + "/"));

  return (
    <aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] w-60 shrink-0 flex-col overflow-y-auto border-r border-border bg-background px-3 py-4 lg:flex">
      <div className="mb-3 flex items-center gap-2.5 px-3">
        <BrandMark name={brand.name} size={22} />
        <span className="truncate text-[13px] font-semibold tracking-wide text-foreground uppercase">{brand.name}</span>
      </div>
      <nav aria-label={`เมนู ${brand.name}`} className="flex flex-col gap-0.5">
        {items.map((it) => {
          const active = isActive(it);
          return (
            <Link key={it.href} href={it.href} aria-current={active ? "page" : undefined} className={`${rowBase} ${active ? rowActive : rowIdle}`}>
              {it.icon}
              <span>{it.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
