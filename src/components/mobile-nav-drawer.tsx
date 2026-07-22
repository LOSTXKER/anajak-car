"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavBrand } from "@/lib/queries";
import { BrandMark } from "@/components/brand-shortcuts";
import { LifecycleDot } from "@/components/badges";

// hamburger + drawer สำหรับ mobile (<lg) — แบรนด์ปัจจุบัน (รายชื่อรุ่น = ทางลัดข้ามรุ่น) + เมนูกลาง
// drawer เลื่อนด้วย transform (interaction ไม่ใช่ entrance animation) + a11y ครบ (portal/trap/esc)
function resolveCurrentBrand(pathname: string, navIndex: NavBrand[]): NavBrand | null {
  const brandMatch = pathname.match(/^\/brands\/([^/]+)(?:\/|$)/);
  if (brandMatch) {
    const slug = decodeURIComponent(brandMatch[1]);
    return navIndex.find((b) => b.slug === slug) ?? null;
  }
  const carMatch = pathname.match(/^\/cars\/([^/]+)(?:\/|$)/);
  if (carMatch) {
    const carSlug = decodeURIComponent(carMatch[1]);
    return navIndex.find((b) => b.nameplates.some((n) => n.slug === carSlug)) ?? null;
  }
  return null;
}

export function MobileNavDrawer({ navIndex }: { navIndex: NavBrand[] }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);

  const brand = resolveCurrentBrand(pathname, navIndex);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- portal-after-mount (กัน SSR ไม่มี document.body)
  useEffect(() => setMounted(true), []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- ปิด drawer เมื่อเปลี่ยนหน้า (safety net back/forward)
  useEffect(() => setOpen(false), [pathname]);

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
        aria-controls="mobile-drawer"
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
              id="mobile-drawer"
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
                {brand && (
                  <div>
                    <Link
                      href={`/brands/${brand.slug}`}
                      onClick={close}
                      className="mb-1 flex items-center gap-2.5 rounded-lg px-3 py-2 hover:bg-surface-muted"
                    >
                      <BrandMark name={brand.name} size={20} />
                      <span className="text-[13px] font-semibold tracking-wide text-foreground uppercase">{brand.name}</span>
                    </Link>
                    <ul className="flex flex-col gap-0.5">
                      {brand.nameplates.map((np) => {
                        const href = `/cars/${np.slug}`;
                        const active = pathname === href;
                        return (
                          <li key={np.slug}>
                            <Link
                              href={href}
                              onClick={close}
                              aria-current={active ? "page" : undefined}
                              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${active ? "bg-accent-soft font-medium text-accent" : "text-muted hover:bg-surface-muted hover:text-foreground"}`}
                            >
                              <LifecycleDot status={np.lifecycleStatus} />
                              <span className="truncate">{np.name}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                {brand && <div className="border-t border-border" />}
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
