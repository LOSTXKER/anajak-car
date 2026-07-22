import { AppShell } from "@/components/app-shell";

// โซน plain (หน้า /brands index) — navbar + footer เต็มกว้าง ไม่มี sidebar
// (ไม่มีแบรนด์เดียวให้ผูก sidebar · เนื้อหาหน้า = ตัวเลือกแบรนด์อยู่แล้ว ไม่ต้องซ้อน nav ใน nav)
export default function PlainLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
