import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

// 404 ระดับราก (URL ที่ไม่ match โซนไหน) — root layout ไม่มี chrome แล้ว จึงใส่ SiteHeader/Footer เอง
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-32 text-center sm:px-6">
          <p className="text-xs font-medium tracking-[0.22em] text-faint uppercase">404</p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">ไม่พบหน้าที่ต้องการ</h1>
          <p className="mt-2 max-w-md text-sm text-muted">
            รุ่นรถหรือหน้าที่คุณเปิดอาจยังไม่อยู่ใน coverage ของฐานข้อมูล
          </p>
          <Link
            href="/"
            className="mt-6 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-85"
          >
            กลับไปหน้าฐานข้อมูล
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
