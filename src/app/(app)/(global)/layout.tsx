import { AppShell } from "@/components/app-shell";
import { Sidebar } from "@/components/sidebar";
import { GLOBAL_NAV } from "@/lib/nav";

// โซน global (/cars, /brands index) — sidebar เมนูหมวดข้ามแบรนด์
export default function GlobalLayout({ children }: { children: React.ReactNode }) {
  return <AppShell sidebar={<Sidebar nav={GLOBAL_NAV} />}>{children}</AppShell>;
}
