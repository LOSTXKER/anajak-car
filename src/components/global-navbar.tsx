"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { NavBrand } from "@/lib/queries";
import { SiteLogo } from "@/components/site-logo";
import { MobileNavDrawer } from "@/components/mobile-nav-drawer";

// Navbar บนสุด (ทุกหน้าในโซน app) — เรียบ แบบ prydwen: hamburger(mobile) + logo + ค้นหา
// เมนูหมวด + ตัวสลับแบรนด์ ย้ายไปอยู่ sidebar หลักแล้ว
export function GlobalNavbar({ navIndex }: { navIndex: NavBrand[] }) {
  return (
    <header className="sticky top-0 z-40 h-14 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between gap-2 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <MobileNavDrawer navIndex={navIndex} />
          <Link href="/" aria-label="CARMETA — กลับหน้าแรก" className="shrink-0">
            <SiteLogo />
          </Link>
        </div>
        <NavSearch />
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
      className="flex items-center"
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
          className="w-40 rounded-full border border-border bg-surface-muted py-1.5 pr-3 pl-9 text-sm text-foreground transition-all placeholder:text-faint focus:w-56 focus:border-accent focus:bg-background focus:outline-none sm:w-52"
        />
      </label>
    </form>
  );
}
