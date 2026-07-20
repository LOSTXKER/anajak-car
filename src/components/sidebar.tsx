import Link from "next/link";
import { SiteLogo } from "@/components/site-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarNav } from "@/components/sidebar-nav";

// Sidebar หลัก (desktop ≥lg) — sticky เต็มความสูงจอ · เมนู "หมวด" ล้วน (ไม่ลิสต์ชื่อรุ่น)
// ตามธีมเว็บ (bg-background + border-r) · ซ่อนบน mobile → ใช้ MobileTopBar/drawer แทน
export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col border-r border-border bg-background lg:flex">
      <div className="flex h-14 shrink-0 items-center px-5">
        <Link href="/" aria-label="CARMETA — กลับหน้าแรก">
          <SiteLogo />
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-3">
        <SidebarNav />
      </div>
      <div className="flex shrink-0 items-center justify-between gap-2 border-t border-border px-4 py-3">
        <span
          className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent"
          title="ทุกตัวเลขในระบบผูกแหล่งอ้างอิงที่ตรวจสอบได้"
        >
          evidence-first
        </span>
        <ThemeToggle />
      </div>
    </aside>
  );
}
