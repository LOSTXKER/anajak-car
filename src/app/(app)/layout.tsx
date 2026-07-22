import { getNavIndex } from "@/lib/queries";
import { GlobalNavbar } from "@/components/global-navbar";
import { AppShell } from "@/components/app-shell";
import { AppSidebar } from "@/components/app-sidebar";

// โซน app (ทุกหน้าใน) — navbar บนสุด + sidebar หมวดกลางอันเดียว (ใช้เหมือนกันทุกหน้า · แบบ prydwen)
// navIndex (เบา) ป้อนตัวสลับแบรนด์ในหัว sidebar + mobile drawer
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const navIndex = await getNavIndex();
  return (
    <div className="flex min-h-svh flex-col">
      <GlobalNavbar navIndex={navIndex} />
      <AppShell sidebar={<AppSidebar navIndex={navIndex} />}>{children}</AppShell>
    </div>
  );
}
