"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavNameplate } from "@/lib/queries";
import { BrandMark } from "@/components/brand-shortcuts";
import { LifecycleDot } from "@/components/badges";

// Sidebar ประจำแบรนด์ (desktop ≥lg) — ทางลัด "เฉพาะแบรนด์นี้" เท่านั้น: ภาพรวม + รายชื่อรุ่น (กระโดดไว)
// เครื่องมือกลาง (ค้นหา/สลับแบรนด์/จัดอันดับ/เทียบรุ่น) อยู่ navbar · sidebar ไม่ปน
export function BrandSidebar({
  brand,
  nameplates,
}: {
  brand: { slug: string; name: string };
  nameplates: NavNameplate[];
}) {
  const pathname = usePathname();
  const brandHref = `/brands/${brand.slug}`;
  const onBrandPage = pathname === brandHref;

  const rowBase = "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors";
  const rowIdle = "text-muted hover:bg-surface-muted hover:text-foreground";
  const rowActive = "bg-accent-soft font-medium text-accent";

  return (
    <aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] w-60 shrink-0 flex-col overflow-y-auto border-r border-border bg-background px-3 py-4 lg:flex">
      <Link href={brandHref} aria-current={onBrandPage ? "page" : undefined} className={`${rowBase} ${onBrandPage ? rowActive : rowIdle}`}>
        <BrandMark name={brand.name} size={22} />
        <span className="truncate font-semibold">ภาพรวม {brand.name}</span>
      </Link>

      <div className="my-2 border-t border-border" />
      <p className="px-3 pb-1 text-[11px] font-semibold tracking-wider text-faint uppercase">รุ่นใน coverage</p>
      <ul className="flex flex-col gap-0.5">
        {nameplates.map((np) => {
          const href = `/cars/${np.slug}`;
          const active = pathname === href;
          return (
            <li key={np.slug}>
              <Link href={href} aria-current={active ? "page" : undefined} className={`${rowBase} ${active ? rowActive : rowIdle}`}>
                <LifecycleDot status={np.lifecycleStatus} />
                <span className="truncate">{np.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
