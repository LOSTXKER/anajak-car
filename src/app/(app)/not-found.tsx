import Link from "next/link";
import { AppShell } from "@/components/app-shell";

// 404 ในโซน app (แบรนด์/รุ่นที่ไม่มีจริง) — navbar มาจาก (app)/layout · ใส่ footer ผ่าน AppShell (ไม่มี sidebar)
export default function AppNotFound() {
  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-32 text-center sm:px-6">
        <p className="text-xs font-medium tracking-[0.22em] text-faint uppercase">404</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">ไม่พบหน้าที่ต้องการ</h1>
        <p className="mt-2 max-w-md text-sm text-muted">
          รุ่นรถหรือแบรนด์ที่คุณเปิดอาจยังไม่อยู่ใน coverage ของฐานข้อมูล
        </p>
        <Link
          href="/"
          className="mt-6 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-85"
        >
          กลับไปหน้าฐานข้อมูล
        </Link>
      </div>
    </AppShell>
  );
}
