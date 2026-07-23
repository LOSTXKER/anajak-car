"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavBrand } from "@/lib/queries";
import { BrandMark } from "@/components/brand-shortcuts";

// ตัวสลับแบรนด์บน navbar — dropdown ทำมือ (ไม่เพิ่ม dependency)
// รู้แบรนด์ปัจจุบันจาก pathname: /brands/[slug] ตรงๆ · /cars/[slug] หาแบรนด์จาก slug รุ่นใน navIndex
function resolveCurrentSlug(pathname: string, navIndex: NavBrand[]): string | null {
  const brandMatch = pathname.match(/^\/brands\/([^/]+)(?:\/|$)/);
  if (brandMatch) return decodeURIComponent(brandMatch[1]);
  const carMatch = pathname.match(/^\/cars\/([^/]+)(?:\/|$)/);
  if (carMatch) {
    const carSlug = decodeURIComponent(carMatch[1]);
    return navIndex.find((b) => b.nameplates.some((n) => n.slug === carSlug))?.slug ?? null;
  }
  return null;
}

export function BrandSwitcher({ navIndex }: { navIndex: NavBrand[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const currentSlug = resolveCurrentSlug(pathname, navIndex);
  const current = currentSlug ? (navIndex.find((b) => b.slug === currentSlug) ?? null) : null;

  // eslint-disable-next-line react-hooks/set-state-in-effect -- ปิด dropdown เมื่อเปลี่ยนหน้า (pattern มาตรฐาน)
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative min-w-0">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        className="flex min-w-0 items-center gap-2 rounded-full bg-surface-muted py-1.5 pr-2 pl-2.5 text-sm text-foreground transition-colors hover:bg-accent-soft"
      >
        {current ? (
          <>
            <BrandMark name={current.name} size={18} />
            <span className="truncate font-medium">{current.name}</span>
          </>
        ) : (
          <span className="text-muted">เลือกแบรนด์</span>
        )}
        <svg viewBox="0 0 12 12" aria-hidden className="size-3 shrink-0 text-faint" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m2.5 4.5 3.5 3.5 3.5-3.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 z-50 mt-1.5 w-56 rounded-2xl border border-border bg-background p-1.5 shadow-lg">
          {navIndex.map((b) => {
            const active = b.slug === currentSlug;
            return (
              <Link
                key={b.slug}
                href={`/brands/${b.slug}`}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${active ? "bg-accent-soft font-medium text-accent" : "text-foreground hover:bg-surface-muted"}`}
              >
                <BrandMark name={b.name} size={20} />
                <span>{b.name}</span>
              </Link>
            );
          })}
          <Link
            href="/brands"
            onClick={() => setOpen(false)}
            className="mt-1 flex items-center justify-between rounded-lg border-t border-border px-2.5 py-2 text-sm text-muted transition-colors hover:text-foreground"
          >
            แบรนด์ทั้งหมด <span aria-hidden>→</span>
          </Link>
        </div>
      )}
    </div>
  );
}
