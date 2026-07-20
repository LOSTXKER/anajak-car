"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavGroup, NavItem } from "@/lib/nav";
import { NAV_ICONS } from "@/components/nav-icons";

function isActive(pathname: string, item: NavItem): boolean {
  if (item.match === "exact") return pathname === item.href;
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

// เมนู sidebar — รับ nav เป็น prop (GLOBAL_NAV หรือ brandNav(slug)) ใช้ร่วม desktop + mobile drawer
// label = ป้าย landmark (drawer มี 2 nav ต้องตั้งชื่อต่างกัน กัน landmark ซ้ำ)
export function SidebarNav({
  nav,
  onNavigate,
  label = "เมนูหลัก",
}: {
  nav: NavGroup[];
  onNavigate?: () => void;
  label?: string;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label={label} className="flex flex-col gap-5">
      {nav.map((group, gi) => (
        <div key={group.header ?? gi} className="flex flex-col gap-1">
          {group.header && (
            <p className="px-3 pb-1 text-[11px] font-semibold tracking-wider text-faint uppercase">
              {group.header}
            </p>
          )}
          {group.items.map((item) => {
            const active = isActive(pathname, item);
            const Icon = NAV_ICONS[item.iconKey];
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
