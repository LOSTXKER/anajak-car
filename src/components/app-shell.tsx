import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";

// เปลือกหน้าในโซน app (มี sidebar) — ใช้ร่วมโซน global กับโซนแบรนด์
// root เป็น flex-1 เพราะอยู่ใต้ navbar ใน (app)/layout ที่เป็น flex-col
export function AppShell({ sidebar, children }: { sidebar: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-1">
      {sidebar}
      {/* min-w-0 = กันตาราง/เนื้อห ากว้างดัน flex column จน layout ระเบิดแนวนอน (bug อันดับหนึ่งของ flex sidebar) */}
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">{children}</div>
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}
