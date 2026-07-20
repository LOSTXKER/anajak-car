"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteLogo } from "@/components/site-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarNav } from "@/components/sidebar-nav";
import { IconMenu, IconClose } from "@/components/nav-icons";

// Top bar + drawer สำหรับ mobile (<lg) — sidebar desktop ถูกซ่อน
// drawer เลื่อนด้วย transform (interaction จากการกดของผู้ใช้ ไม่ใช่ entrance animation) + a11y ครบ
export function MobileTopBar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // ปิดเมื่อเปลี่ยนหน้า — ครอบเคส back/forward ที่ layout persist ค้าง drawer เปิดข้ามหน้า
  // (ลิงก์ในตัว drawer ปิดเองผ่าน onNavigate แล้ว · นี่คือ safety net) — pattern close-modal-on-route มาตรฐาน
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setOpen(false), [pathname]);

  // resize ข้าม lg ขณะ drawer เปิด → CSS ซ่อน panel แต่ scroll-lock จะค้าง ต้องสั่งปิด
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
    // เก็บปุ่ม trigger ไว้ก่อน — ใช้คืน focus ตอน cleanup (ref อาจเปลี่ยนค่าเมื่อ cleanup รัน)
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
      // focus trap — วน Tab ภายใน panel
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
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-2 border-b border-border bg-background/80 px-4 backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-1">
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-label="เปิดเมนู"
            aria-expanded={open}
            aria-controls="mobile-drawer"
            className="inline-flex size-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
          >
            <IconMenu />
          </button>
          <Link href="/" aria-label="CARMETA — กลับหน้าแรก">
            <SiteLogo />
          </Link>
        </div>
        <ThemeToggle />
      </header>

      {open && (
        <div
          onClick={close}
          className="fixed inset-0 z-50 bg-black/40 lg:hidden"
          aria-hidden
        />
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
        <div className="flex h-14 shrink-0 items-center justify-between px-4">
          <Link href="/" aria-label="CARMETA — กลับหน้าแรก" onClick={close}>
            <SiteLogo />
          </Link>
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
        <div className="flex-1 overflow-y-auto px-3 py-3">
          <SidebarNav onNavigate={close} />
        </div>
        <div className="shrink-0 border-t border-border px-4 py-3">
          <span
            className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent"
            title="ทุกตัวเลขในระบบผูกแหล่งอ้างอิงที่ตรวจสอบได้"
          >
            evidence-first
          </span>
        </div>
      </div>
    </>
  );
}
