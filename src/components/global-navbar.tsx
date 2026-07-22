"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { NavBrand } from "@/lib/queries";
import { SiteLogo } from "@/components/site-logo";
import { BrandSwitcher } from "@/components/brand-switcher";
import { MobileNavDrawer } from "@/components/mobile-nav-drawer";

// Navbar เครื่องมือกลาง (ทุกหน้าในโซน app) — sticky top-0 z-40 h-14 · sync กับ sidebar top-14
// ซ้าย: hamburger(mobile) + logo + สลับแบรนด์ · ขวา: ค้นหา + เทียบรุ่น(เร็วๆนี้) + แบรนด์
// ไม่มี ThemeToggle (light-only) · ไม่มีลิงก์ /cars (ไม่มี route นั้น — หน้าแรกคือฐานข้อมูล)
export function GlobalNavbar({ navIndex }: { navIndex: NavBrand[] }) {
  return (
    <header className="sticky top-0 z-40 h-14 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between gap-2 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <MobileNavDrawer navIndex={navIndex} />
          <Link href="/" aria-label="CARMETA — กลับหน้าแรก" className="shrink-0">
            <SiteLogo />
          </Link>
          <BrandSwitcher navIndex={navIndex} />
        </div>

        <nav aria-label="เครื่องมือ" className="flex items-center gap-1 sm:gap-2">
          <NavSearch />
          <Link
            href="/tierlist"
            className="hidden rounded-full px-3 py-1.5 text-sm text-muted transition-colors hover:bg-surface-muted hover:text-foreground sm:inline-block"
          >
            จัดอันดับ
          </Link>
          <span
            title="กำลังพัฒนา — เทียบรุ่นย่อยระดับเดียวกัน (เร็วๆ นี้)"
            aria-disabled="true"
            className="hidden cursor-not-allowed items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-faint lg:inline-flex"
          >
            เทียบรุ่น
            <span className="rounded-full bg-surface-muted px-1.5 py-0.5 text-[10px] font-medium">เร็วๆ นี้</span>
          </span>
          <Link
            href="/brands"
            className="hidden rounded-full px-3 py-1.5 text-sm text-muted transition-colors hover:bg-surface-muted hover:text-foreground sm:inline-block"
          >
            แบรนด์
          </Link>
        </nav>
      </div>
    </header>
  );
}

// ช่องค้นหากลาง — submit ไปหน้าแรก#database (reuse สัญญา URL เดิม ?q= ที่ตารางอ่านอยู่แล้ว)
function NavSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const term = q.trim();
        router.push(term ? `/?q=${encodeURIComponent(term)}#database` : "/#database");
      }}
      className="hidden items-center md:flex"
    >
      <label className="relative">
        <span className="sr-only">ค้นหารุ่นรถ</span>
        <svg viewBox="0 0 24 24" aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.2-3.2" />
        </svg>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ค้นหารุ่นรถ…"
          className="w-44 rounded-full border border-border bg-surface-muted py-1.5 pr-3 pl-9 text-sm text-foreground transition-all placeholder:text-faint focus:w-56 focus:border-accent focus:bg-background focus:outline-none"
        />
      </label>
    </form>
  );
}
