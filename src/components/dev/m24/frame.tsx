import { getNavIndex } from "@/lib/queries";
import { GlobalNavbar } from "@/components/global-navbar";
import { AppShell } from "@/components/app-shell";
import { BrandSidebar } from "@/components/brand-sidebar";

// ── MOCKUP (M24) — ครอบเนื้อหาด้วย shell จริงของ M23 (navbar + brand sidebar) ให้เห็นภาพจริง ──
// dev/ อยู่ใต้ root layout ที่สลิม (ไม่มี chrome) → frame นี้จ่าย chrome เองแบบเดียวกับโซน (app)
export async function MockAppFrame({
  children,
  sidebar = true,
}: {
  children: React.ReactNode;
  sidebar?: boolean;
}) {
  const navIndex = await getNavIndex();
  return (
    <div className="flex min-h-svh flex-col">
      <GlobalNavbar navIndex={navIndex} />
      {sidebar ? (
        <AppShell sidebar={<BrandSidebar brand={{ slug: "toyota", name: "Toyota" }} />}>
          {children}
        </AppShell>
      ) : (
        <AppShell>{children}</AppShell>
      )}
    </div>
  );
}
