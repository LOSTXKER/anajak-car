import { Sidebar } from "@/components/sidebar";
import { MobileTopBar } from "@/components/mobile-topbar";
import { SiteFooter } from "@/components/site-footer";

// Layout ของหน้าฐานข้อมูล (/cars, /brands …) = sidebar เมนูหมวด + content column
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh">
      <Sidebar />
      {/* min-w-0 = กันตาราง/เนื้อห ากว้างดัน flex column จน layout ระเบิดแนวนอน (bug อันดับหนึ่งของ flex sidebar) */}
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopBar />
        <main className="flex-1">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">{children}</div>
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}
