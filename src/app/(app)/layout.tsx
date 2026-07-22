import { getNavIndex } from "@/lib/queries";
import { GlobalNavbar } from "@/components/global-navbar";

// โซน app (ทุกหน้าใน) — navbar เครื่องมือกลางเต็มกว้างบนสุด + {children} (= zone layout ที่ใส่ sidebar เอง)
// navIndex (เบา) ป้อนตัวสลับแบรนด์ + mobile drawer · cache() dedupe กับ zone layout ในรีเควสต์เดียว
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const navIndex = await getNavIndex();
  return (
    <div className="flex min-h-svh flex-col">
      <GlobalNavbar navIndex={navIndex} />
      {children}
    </div>
  );
}
