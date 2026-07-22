"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/brand-shortcuts";

// Sidebar ประจำแบรนด์ (desktop ≥lg) — ทิศ "เมนู" (Variant A ที่เบสเลือก)
// sticky ลอดใต้ navbar (top-14 = ความสูง navbar h-14) · เมนูแบรนด์ + จุดยึดในหน้า (หน้ารุ่น)
// จุดยึด (#adas/#timeline) โชว์เฉพาะที่หน้ามี section จริง (กฎห้ามลิงก์ไปที่ไม่มีข้อมูล)
export function BrandSidebar({
  brand,
  hasAdas = false,
  hasTimeline = false,
}: {
  brand: { slug: string; name: string };
  hasAdas?: boolean;
  hasTimeline?: boolean;
}) {
  const pathname = usePathname();
  const brandHref = `/brands/${brand.slug}`;
  const onBrandPage = pathname === brandHref;
  // "ในหน้านี้" (จุดยึด) โชว์เฉพาะหน้า hub รุ่น (/cars/[slug]) เท่านั้น — หน้าย่อย (gen/deriv/trim/timeline) anchor ไม่มี
  const onCarHub = /^\/cars\/[^/]+$/.test(pathname);
  const carMatch = pathname.match(/^\/cars\/([^/]+)/);
  const carSlug = carMatch ? carMatch[1] : null;

  const rowBase = "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors";
  const rowIdle = "text-muted hover:bg-surface-muted hover:text-foreground";
  const rowActive = "bg-accent-soft font-medium text-accent";

  return (
    <aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] w-64 shrink-0 flex-col overflow-y-auto border-r border-border bg-background px-3 py-4 lg:flex">
      <Link
        href={brandHref}
        className="mb-3 flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors hover:bg-surface-muted"
      >
        <BrandMark name={brand.name} size={20} />
        <span className="truncate text-[13px] font-semibold tracking-wide text-foreground uppercase">
          {brand.name}
        </span>
      </Link>

      <nav aria-label={`เมนู ${brand.name}`} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <Link
            href={brandHref}
            aria-current={onBrandPage ? "page" : undefined}
            className={`${rowBase} ${onBrandPage ? rowActive : rowIdle}`}
          >
            ภาพรวมแบรนด์
          </Link>
          {onBrandPage ? (
            <>
              <a href="#brand-nameplates" className={`${rowBase} ${rowIdle}`}>รุ่นรถทั้งหมด</a>
              <a href="#sources-heading" className={`${rowBase} ${rowIdle}`}>แหล่งอ้างอิง</a>
            </>
          ) : (
            <Link href={`${brandHref}#brand-nameplates`} className={`${rowBase} ${rowIdle}`}>
              รุ่นรถทั้งหมด
            </Link>
          )}
        </div>

        {onCarHub && (
          <div className="flex flex-col gap-1">
            <p className="px-3 pb-1 text-[11px] font-semibold tracking-wider text-faint uppercase">
              ในหน้านี้
            </p>
            <a href="#variants-heading" className={`${rowBase} ${rowIdle}`}>บันไดราคา</a>
            {hasAdas && <a href="#adas-heading" className={`${rowBase} ${rowIdle}`}>ระบบช่วยขับขี่</a>}
            {hasTimeline && <a href="#timeline-heading" className={`${rowBase} ${rowIdle}`}>ไทม์ไลน์</a>}
            <a href="#sources-heading" className={`${rowBase} ${rowIdle}`}>แหล่งอ้างอิง</a>
          </div>
        )}

        {/* หน้าย่อยของรุ่น (เจน/ตัวถัง/รุ่นย่อย/ไทม์ไลน์) — ลิงก์กลับหน้ารุ่น */}
        {carSlug && !onCarHub && (
          <div className="flex flex-col gap-1">
            <Link href={`/cars/${carSlug}`} className={`${rowBase} ${rowIdle}`}>← กลับหน้ารุ่น</Link>
            <Link href={`/cars/${carSlug}/timeline`} className={`${rowBase} ${rowIdle}`}>ไทม์ไลน์</Link>
          </div>
        )}
      </nav>
    </aside>
  );
}
