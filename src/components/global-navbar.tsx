import Link from "next/link";
import type { BrandTile } from "@/lib/queries";
import { SiteLogo } from "@/components/site-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { BrandSwitcher } from "@/components/brand-switcher";
import { MobileNavDrawer } from "@/components/mobile-nav-drawer";

// Navbar บนสุด (global ทุกหน้า) — sticky top-0 z-40 h-14 · sync กับ sidebar top-14
// ซ้าย: hamburger(mobile) + โลโก้ + ตัวสลับแบรนด์ · ขวา: รุ่นรถทั้งหมด + สลับธีม
export function GlobalNavbar({ brands }: { brands: BrandTile[] }) {
  return (
    <header className="sticky top-0 z-40 h-14 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between gap-2 px-4 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <MobileNavDrawer brands={brands} />
          <Link href="/" aria-label="CARMETA — กลับหน้าแรก">
            <SiteLogo />
          </Link>
          <BrandSwitcher brands={brands} />
        </div>
        <nav aria-label="เมนูรอง" className="flex items-center gap-1 sm:gap-2 text-sm">
          <Link
            href="/cars"
            className="hidden rounded-full px-3 py-1.5 text-muted transition-colors hover:bg-surface-muted hover:text-foreground sm:inline-block"
          >
            รุ่นรถทั้งหมด
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
