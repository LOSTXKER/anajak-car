"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiteLogo } from "@/components/site-logo";
import { BrandMark } from "@/components/brand-shortcuts";
import { LifecycleDot } from "@/components/badges";
import type { BrandNav } from "@/components/dev/mock-sidebar";

// ── MOCKUP (M23 shell compare) — navbar เครื่องมือกลาง (app mode) ใช้ร่วมทุก variant ──
// ซ้าย: hamburger(mobile) + logo + สลับแบรนด์ · ขวา: ค้นหา + เทียบรุ่น(เร็วๆนี้) + แบรนด์
// ทิ้งได้หลังเบสเลือก — ของจริงเขียนใหม่ Phase B (ตัด ThemeToggle/ลิงก์ /cars ที่ไม่มีจริงทิ้ง)

type SwitchBrand = { slug: string; name: string };

export function MockNavbar({
  basePath,
  brands,
  currentBrand,
  nameplates,
}: {
  basePath: string;
  brands: SwitchBrand[];
  currentBrand: SwitchBrand | null;
  nameplates: BrandNav["nameplates"];
}) {
  return (
    <header className="sticky top-0 z-40 h-14 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between gap-2 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <MobileDrawer basePath={basePath} currentBrand={currentBrand} nameplates={nameplates} />
          <Link href="/" aria-label="CARMETA — กลับหน้าแรก" className="shrink-0">
            <SiteLogo />
          </Link>
          <BrandSwitcher basePath={basePath} brands={brands} currentBrand={currentBrand} />
        </div>

        <nav aria-label="เครื่องมือ" className="flex items-center gap-1 sm:gap-2">
          <NavSearch />
          <span
            title="กำลังพัฒนา — เทียบรุ่นย่อยระดับเดียวกัน (เร็วๆ นี้)"
            aria-disabled="true"
            className="hidden cursor-not-allowed items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-faint sm:inline-flex"
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

// ── ช่องค้นหากลาง — submit ไปหน้าแรก#database (reuse สัญญา URL เดิม ?q=) ──
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

// ── ตัวสลับแบรนด์ (dropdown ทำมือ ไม่เพิ่ม dependency) ──
function BrandSwitcher({
  basePath,
  brands,
  currentBrand,
}: {
  basePath: string;
  brands: SwitchBrand[];
  currentBrand: SwitchBrand | null;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

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
        {currentBrand ? (
          <>
            <BrandMark name={currentBrand.name} size={18} />
            <span className="truncate font-medium">{currentBrand.name}</span>
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
          {brands.map((b) => {
            const active = b.slug === currentBrand?.slug;
            return (
              <Link
                key={b.slug}
                href={`${basePath}/brands/${b.slug}`}
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

// ── mobile drawer (<lg) — โซนแบรนด์ปัจจุบัน (รายชื่อรุ่น) + เมนูกลาง ──
function MobileDrawer({
  basePath,
  currentBrand,
  nameplates,
}: {
  basePath: string;
  currentBrand: SwitchBrand | null;
  nameplates: BrandNav["nameplates"];
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- portal-after-mount (กัน SSR ไม่มี document.body)
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 64rem)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const f = panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (f.length === 0) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
      trigger?.focus();
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="เปิดเมนู"
        aria-expanded={open}
        aria-controls="mock-drawer"
        className="inline-flex size-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-muted hover:text-foreground lg:hidden"
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      {mounted &&
        createPortal(
          <>
            {open && <div onClick={close} className="fixed inset-0 z-50 bg-black/40 lg:hidden" aria-hidden />}
            <div
              id="mock-drawer"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="เมนูหลัก"
              inert={!open}
              className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-border bg-background transition-transform duration-200 lg:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}
            >
              <div className="flex h-14 shrink-0 items-center justify-end px-4">
                <button
                  ref={closeRef}
                  type="button"
                  onClick={close}
                  aria-label="ปิดเมนู"
                  className="inline-flex size-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
                >
                  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden>
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 space-y-4 overflow-y-auto px-3 pb-4">
                {currentBrand && (
                  <div>
                    <Link
                      href={`${basePath}/brands/${currentBrand.slug}`}
                      onClick={close}
                      className="mb-1 flex items-center gap-2.5 rounded-lg px-3 py-2 hover:bg-surface-muted"
                    >
                      <BrandMark name={currentBrand.name} size={20} />
                      <span className="text-[13px] font-semibold tracking-wide text-foreground uppercase">{currentBrand.name}</span>
                    </Link>
                    <ul className="flex flex-col gap-0.5">
                      {nameplates.map((np) => (
                        <li key={np.slug}>
                          <Link
                            href={`${basePath}/cars/${np.slug}`}
                            onClick={close}
                            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
                          >
                            <LifecycleDot status={np.lifecycleStatus} />
                            <span className="truncate">{np.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="border-t border-border" />
                <nav aria-label="เมนูหลัก" className="flex flex-col gap-0.5">
                  <Link href="/" onClick={close} className="rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-muted hover:text-foreground">หน้าแรก</Link>
                  <Link href="/brands" onClick={close} className="rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-muted hover:text-foreground">แบรนด์ทั้งหมด</Link>
                </nav>
              </div>
            </div>
          </>,
          document.body,
        )}
    </>
  );
}
