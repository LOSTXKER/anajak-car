import { getNavIndex } from "@/lib/queries";
import { GlobalNavbar } from "@/components/global-navbar";

// โซน app — navbar เครื่องมือกลางเต็มกว้างบนสุด (ใช้ร่วมทั้งเว็บ) + {children}
// sidebar ประจำแบรนด์อยู่ที่ zone layout (brand/car) ที่รู้ว่าแบรนด์ไหน · โซนที่ไม่เกี่ยวแบรนด์ไม่มี sidebar
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const navIndex = await getNavIndex();
  return (
    <div className="flex min-h-svh flex-col">
      <GlobalNavbar navIndex={navIndex} />
      {children}
    </div>
  );
}
