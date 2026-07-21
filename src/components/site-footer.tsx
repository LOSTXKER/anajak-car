import { SiteLogo } from "@/components/site-logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6">
        <SiteLogo iconSize={22} />
        <div className="flex flex-col gap-2 text-xs text-faint">
          <p>
            ราคาที่แสดงเป็น &ldquo;ราคาป้ายทางการ&rdquo; จากผู้ผลิต ไม่ใช่ราคาซื้อขายจริง
            และอาจเปลี่ยนแปลงได้ — ตรวจสอบกับผู้จำหน่ายก่อนตัดสินใจ
          </p>
          <p className="pt-2">© 2026 CARMETA · Thailand Car Database &amp; Market Intelligence</p>
        </div>
      </div>
    </footer>
  );
}
