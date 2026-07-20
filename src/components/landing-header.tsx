import Link from "next/link";
import { SiteLogo } from "@/components/site-logo";
import { ThemeToggle } from "@/components/theme-toggle";

// Top header ของหน้าแรก (landing เต็มจอ ไม่มี sidebar) — เข้าฐานข้อมูลผ่านลิงก์บนแถบ
export function LandingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="CARMETA — กลับหน้าแรก">
          <SiteLogo />
        </Link>
        <nav aria-label="เมนูหลัก" className="flex items-center gap-1 sm:gap-2 text-sm">
          <Link
            href="/cars"
            className="rounded-full px-3 py-1.5 text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
          >
            รุ่นรถทั้งหมด
          </Link>
          <Link
            href="/brands"
            className="rounded-full px-3 py-1.5 text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
          >
            แบรนด์
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
