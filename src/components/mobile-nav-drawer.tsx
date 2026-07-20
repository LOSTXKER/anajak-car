"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { BrandTile } from "@/lib/queries";
import { GLOBAL_NAV, brandNav } from "@/lib/nav";
import { BrandMark } from "@/components/brand-shortcuts";
import { SidebarNav } from "@/components/sidebar-nav";
import { IconMenu, IconClose } from "@/components/nav-icons";

// hamburger + drawer สำหรับ mobile (<lg) — เมนูตามโซนปัจจุบัน (brand zone → เมนูแบรนด์ + global)
// drawer เลื่อนด้วย transform (interaction ไม่ใช่ entrance animation) + a11y ครบ
export function MobileNavDrawer({ brands }: { brands: BrandTile[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // portal drawer ไป body — หนีจาก containing block ของ navbar (backdrop-blur ทำให้ fixed ถูกบีบใน 56px)
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- pattern มาตรฐาน portal-after-mount (กัน SSR ไม่มี document.body)
  useEffect(() => setMounted(true), []);

  const match = pathname.match(/^\/brands\/([^/]+)(?:\/|$)/);
  const brandSlug = match ? decodeURIComponent(match[1]) : null;
  const brand = brandSlug ? (brands.find((b) => b.slug === brandSlug) ?? null) : null;

  // eslint-disable-next-line react-hooks/set-state-in-effect -- ปิด drawer เมื่อเปลี่ยนหน้า (safety net back/forward)
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 64rem)");
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
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
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
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
        <IconMenu />
      </button>

      {mounted &&
        createPortal(
          <>
            {open && (
              <div onClick={close} className="fixed inset-0 z-50 bg-black/40 lg:hidden" aria-hidden />
            )}
            <div
              id="mobile-drawer"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="เมนูหลัก"
              inert={!open}
              className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-border bg-background transition-transform duration-200 lg:hidden ${
                open ? "translate-x-0" : "-translate-x-full"
              }`}
            >
        <div className="flex h-14 shrink-0 items-center justify-end px-4">
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="ปิดเมนู"
            className="inline-flex size-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
          >
            <IconClose />
          </button>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto px-3 pb-4">
          {brand && (
            <div>
              <Link
                href={`/brands/${brand.slug}`}
                onClick={close}
                className="mb-1 flex items-center gap-2.5 rounded-lg px-3 py-2 hover:bg-surface-muted"
              >
                <BrandMark name={brand.name} size={20} />
                <span className="text-[13px] font-semibold tracking-wide text-foreground uppercase">
                  {brand.name}
                </span>
              </Link>
              <SidebarNav nav={brandNav(brand.slug)} onNavigate={close} label={`เมนู ${brand.name}`} />
            </div>
          )}
          {brand && <div className="border-t border-border" />}
          <SidebarNav nav={GLOBAL_NAV} onNavigate={close} label="เมนูหลัก" />
            </div>
          </div>
          </>,
          document.body,
        )}
    </>
  );
}
