import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";

// เปลือกหน้าในโซน app (ใต้ GlobalNavbar) — sidebar (ถ้ามี) + คอลัมน์เนื้อหา + footer
// footer อยู่ในคอลัมน์เนื้อหา (ไม่กินใต้ sidebar) — เส้นขอบ sidebar จึงลากยาวคู่เนื้อหา
export function AppShell({
  sidebar,
  children,
}: {
  sidebar?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-1">
      {sidebar}
      {/* min-w-0 = กันตาราง/เนื้อหากว้าง (car-database-explorer) ดัน flex column จน layout ระเบิดแนวนอน */}
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </div>
  );
}
