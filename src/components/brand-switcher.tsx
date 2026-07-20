"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { BrandTile } from "@/lib/queries";
import { BrandMark } from "@/components/brand-shortcuts";

// ตัวสลับแบรนด์บน navbar (แบบ game selector ของ prydwen) — dropdown ทำมือ ไม่เพิ่ม dependency
export function BrandSwitcher({ brands }: { brands: BrandTile[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const match = pathname.match(/^\/brands\/([^/]+)(?:\/|$)/);
  const currentSlug = match ? decodeURIComponent(match[1]) : null;
  const current = currentSlug ? (brands.find((b) => b.slug === currentSlug) ?? null) : null;

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
    <div ref={ref} className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full bg-surface-muted py-1.5 pr-2 pl-2.5 text-sm text-foreground transition-colors hover:bg-accent-soft"
      >
        {current ? (
          <>
            <BrandMark name={current.name} size={18} />
            <span className="font-medium">{current.name}</span>
          </>
        ) : (
          <span className="text-muted">เลือกแบรนด์</span>
        )}
        <svg viewBox="0 0 12 12" aria-hidden className="size-3 text-faint" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m2.5 4.5 3.5 3.5 3.5-3.5" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute top-full left-0 z-50 mt-1.5 w-56 rounded-2xl border border-border bg-background p-1.5 shadow-lg"
        >
          {brands.map((b) => (
            <Link
              key={b.slug}
              href={`/brands/${b.slug}`}
              onClick={() => setOpen(false)}
              aria-current={b.slug === currentSlug ? "page" : undefined}
              className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                b.slug === currentSlug
                  ? "bg-accent-soft font-medium text-accent"
                  : "text-foreground hover:bg-surface-muted"
              }`}
            >
              <BrandMark name={b.name} size={20} />
              <span>{b.name}</span>
            </Link>
          ))}
          <Link
            href="/brands"
            onClick={() => setOpen(false)}
            className="mt-1 flex items-center justify-between rounded-lg border-t border-border px-2.5 py-2 text-sm text-muted transition-colors hover:text-foreground"
          >
            แบรนด์ทั้งหมด
            <span aria-hidden>→</span>
          </Link>
        </div>
      )}
    </div>
  );
}
