import type { ReactNode } from "react";
import type { NavGroup } from "@/lib/nav";
import { SidebarNav } from "@/components/sidebar-nav";

// Sidebar หลัก (desktop ≥lg) — sticky ลอดใต้ navbar (top-14 = ความสูง navbar h-14 · sync กันสองฝั่ง)
// รับ nav เป็น prop (GLOBAL_NAV หรือ brandNav) · topSlot = หัวโซน (โซนแบรนด์ใส่ BrandMark+ชื่อ) · โลโก้/ThemeToggle อยู่ที่ navbar แล้ว
export function Sidebar({ nav, topSlot }: { nav: NavGroup[]; topSlot?: ReactNode }) {
  return (
    <aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] w-64 shrink-0 flex-col border-r border-border bg-background lg:flex">
      {topSlot && <div className="shrink-0 border-b border-border px-3 py-3">{topSlot}</div>}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        <SidebarNav nav={nav} />
      </div>
    </aside>
  );
}
