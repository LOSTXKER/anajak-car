import Link from "next/link";
import { SiteLogo } from "@/components/site-logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="CARMETA — กลับหน้าแรก">
          <SiteLogo />
        </Link>
        <nav aria-label="เมนูหลัก" className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-muted transition-colors hover:text-foreground">
            ฐานข้อมูลรถ
          </Link>
          <Link
            href="/brands"
            className="text-muted transition-colors hover:text-foreground"
          >
            แบรนด์
          </Link>
          <span
            className="hidden rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent sm:inline"
            title="ทุกตัวเลขในระบบผูกแหล่งอ้างอิงที่ตรวจสอบได้"
          >
            evidence-first
          </span>
        </nav>
      </div>
    </header>
  );
}
