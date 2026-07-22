import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

// โซนหน้าแรก — คงหัวเว็บเดิม (SiteHeader) เป๊ะตามที่เบสสั่ง "หน้าแรกคงเดิม"
// (โครงนี้ = body เดิมของ root layout ก่อนแยกโซน — output หน้าแรกไม่เปลี่ยน)
export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
