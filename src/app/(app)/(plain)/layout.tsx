import { AppShell } from "@/components/app-shell";

// โซนที่ไม่ผูกแบรนด์ (/brands index · /tierlist) — navbar + footer เต็มกว้าง ไม่มี sidebar แบรนด์
export default function PlainLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
