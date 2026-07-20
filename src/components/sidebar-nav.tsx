"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconHome, IconCars, IconBrands } from "@/components/nav-icons";

type NavItem = {
  href: string;
  label: string;
  icon: (p: { className?: string }) => React.ReactElement;
  match: "exact" | "prefix";
};
type NavGroup = { header?: string; items: NavItem[] };

// เมนู sidebar = "หมวด" ล้วน (แบบ prydwen: Home / DATABASE > …) — ไม่ลิสต์ชื่อรุ่น
// รุ่นรถ = "character" แสดงเป็น grid การ์ดในหน้า /cars ไม่ใช่ใน sidebar
const NAV: NavGroup[] = [
  { items: [{ href: "/", label: "หน้าแรก", icon: IconHome, match: "exact" }] },
  {
    header: "ฐานข้อมูล",
    items: [
      { href: "/cars", label: "รุ่นรถทั้งหมด", icon: IconCars, match: "prefix" },
      { href: "/brands", label: "แบรนด์", icon: IconBrands, match: "prefix" },
    ],
  },
];

function isActive(pathname: string, item: NavItem): boolean {
  if (item.match === "exact") return pathname === item.href;
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="เมนูหลัก" className="flex flex-col gap-5">
      {NAV.map((group, gi) => (
        <div key={group.header ?? gi} className="flex flex-col gap-1">
          {group.header && (
            <p className="px-3 pb-1 text-[11px] font-semibold tracking-wider text-faint uppercase">
              {group.header}
            </p>
          )}
          {group.items.map((item) => {
            const active = isActive(pathname, item);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-accent-soft font-medium text-accent"
                    : "text-muted hover:bg-surface-muted hover:text-foreground"
                }`}
              >
                <Icon className="size-[18px] shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
