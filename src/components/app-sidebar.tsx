"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavBrand } from "@/lib/queries";
import { BrandSwitcher } from "@/components/brand-switcher";

// Sidebar หลักอันเดียว (global · desktop ≥lg) — หมวดกลาง ใช้เหมือนกันทุกหน้าในโซน app
// หัว = ตัวสลับแบรนด์ (แบบ game switcher ของ prydwen) · sticky ลอดใต้ navbar (top-14)
type IconType = (p: { className?: string }) => React.ReactElement;

const svgProps = (c?: string) => ({ viewBox: "0 0 24 24", className: c ?? "size-[18px]", fill: "none" as const, stroke: "currentColor", strokeWidth: "1.7", strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true });

function IconHome({ className }: { className?: string }) {
  return <svg {...svgProps(className)}><path d="M4 10.5 12 4l8 6.5M5.5 9.5V20h13V9.5M10 20v-5h4v5" /></svg>;
}
function IconCars({ className }: { className?: string }) {
  return <svg {...svgProps(className)}><path d="M3 13.5h18M5 13.5l1.8-4.2A2 2 0 0 1 8.6 8h6.8a2 2 0 0 1 1.8 1.3l1.8 4.2M3 13.5V17h1.5M21 13.5V17h-1.5" /><circle cx="7.5" cy="17" r="1.6" /><circle cx="16.5" cy="17" r="1.6" /></svg>;
}
function IconBrands({ className }: { className?: string }) {
  return <svg {...svgProps(className)}><rect x="3.5" y="3.5" width="7" height="7" rx="1.8" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.8" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.8" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.8" /></svg>;
}

function IconRank({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className ?? "size-[18px]"} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 20V10M12 20V4M18 20v-7" />
    </svg>
  );
}
function IconCompare({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className ?? "size-[18px]"} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 4v16M15 4v16M4 8l5-4 5 4M20 16l-5 4-5-4" />
    </svg>
  );
}

type NavItem = { href: string; label: string; icon: IconType; match: "exact" | "prefix"; disabled?: boolean };
type NavGroup = { header?: string; items: NavItem[] };

const NAV: NavGroup[] = [
  { items: [{ href: "/", label: "หน้าแรก", icon: IconHome, match: "exact" }] },
  {
    header: "ฐานข้อมูล",
    items: [
      { href: "/#database", label: "รุ่นรถทั้งหมด", icon: IconCars, match: "exact" },
      { href: "/brands", label: "แบรนด์", icon: IconBrands, match: "prefix" },
    ],
  },
  {
    header: "จัดอันดับ",
    items: [{ href: "/tierlist", label: "จัดอันดับ", icon: IconRank, match: "prefix" }],
  },
  {
    header: "เครื่องมือ",
    items: [{ href: "#", label: "เทียบรุ่น", icon: IconCompare, match: "exact", disabled: true }],
  },
];

function isActive(pathname: string, item: NavItem): boolean {
  const base = item.href.split("#")[0] || "/";
  if (item.match === "exact") return pathname === base;
  return pathname === base || pathname.startsWith(base + "/");
}

export function AppSidebar({ navIndex }: { navIndex: NavBrand[] }) {
  const pathname = usePathname();
  return (
    <aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] w-60 shrink-0 flex-col overflow-y-auto border-r border-border bg-background px-3 py-3 lg:flex">
      <div className="pb-1">
        <BrandSwitcher navIndex={navIndex} />
      </div>
      <nav aria-label="เมนูหลัก" className="mt-3 flex flex-col gap-4">
        {NAV.map((group, gi) => (
          <div key={group.header ?? gi} className="flex flex-col gap-0.5">
            {group.header && (
              <p className="px-3 pb-1 text-[11px] font-semibold tracking-wider text-faint uppercase">{group.header}</p>
            )}
            {group.items.map((item) => {
              const active = !item.disabled && isActive(pathname, item);
              const Icon = item.icon;
              const cls = `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                item.disabled
                  ? "cursor-not-allowed text-faint"
                  : active
                    ? "bg-accent-soft font-medium text-accent"
                    : "text-muted hover:bg-surface-muted hover:text-foreground"
              }`;
              if (item.disabled) {
                return (
                  <span key={item.label} title="กำลังพัฒนา — เร็วๆ นี้" className={cls}>
                    <Icon className="size-[18px] shrink-0" />
                    <span>{item.label}</span>
                    <span className="ml-auto rounded-full bg-surface-muted px-1.5 py-0.5 text-[10px] font-medium">เร็วๆ นี้</span>
                  </span>
                );
              }
              return (
                <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={cls}>
                  <Icon className="size-[18px] shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
