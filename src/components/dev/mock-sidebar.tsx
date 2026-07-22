"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/brand-shortcuts";
import { LifecycleDot } from "@/components/badges";

// ── MOCKUP (M23 shell compare) — ทิ้งได้หลังเบสเลือก ──
// sidebar ประจำแบรนด์ 3 ทิศ (A เมนู · B รายชื่อรุ่น · C ไฮบริด) วางในไฟล์เดียวเทียบง่าย
// ทิศที่ชนะจะถูกเขียนใหม่สะอาดใน Phase B (แยกไฟล์ + nav.ts) — ไฟล์นี้ไม่ใช่ของจริง

export type SidebarVariant = "a" | "b" | "c";

export type NavNameplate = {
  slug: string;
  name: string;
  lifecycleStatus: string;
  priceMin: number | null;
};

export type BrandNav = {
  slug: string;
  name: string;
  officialName: string | null;
  nameplates: NavNameplate[];
  stats: {
    nameplates: number;
    variants: number;
    priceMin: number | null;
    priceMax: number | null;
    latestChecked: string | null;
  };
};

// ราคาแบบย่อสำหรับป้ายนำทาง (ตัวเลขเต็มอยู่ในหน้ารุ่น) — แสน/ล้าน ปัดสองตำแหน่ง
function priceShort(n: number | null): string | null {
  if (n == null) return null;
  const trim = (s: string) => s.replace(/\.?0+$/, "");
  if (n >= 1_000_000) return `${trim((n / 1_000_000).toFixed(2))} ล้าน`;
  if (n >= 100_000) return `${trim((n / 100_000).toFixed(2))} แสน`;
  return n.toLocaleString("th-TH");
}

function fmtDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("th-TH-u-ca-gregory", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}

const rowBase =
  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors";
const rowIdle = "text-muted hover:bg-surface-muted hover:text-foreground";
const rowActive = "bg-accent-soft font-medium text-accent";

// ── Variant A — เมนูแบรนด์ + จุดยึดในหน้า ──
function SidebarA({ brand, basePath, pathname }: { brand: BrandNav; basePath: string; pathname: string }) {
  const brandHref = `${basePath}/brands/${brand.slug}`;
  const onBrandPage = pathname === brandHref;
  const carMatch = pathname.startsWith(`${basePath}/cars/`);

  return (
    <nav aria-label={`เมนู ${brand.name}`} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <Link href={brandHref} aria-current={onBrandPage ? "page" : undefined} className={`${rowBase} ${onBrandPage ? rowActive : rowIdle}`}>
          ภาพรวมแบรนด์
        </Link>
        {onBrandPage ? (
          <>
            <a href="#brand-nameplates" className={`${rowBase} ${rowIdle}`}>รุ่นรถทั้งหมด</a>
            <a href="#sources-heading" className={`${rowBase} ${rowIdle}`}>แหล่งอ้างอิง</a>
          </>
        ) : (
          <Link href={`${brandHref}#brand-nameplates`} className={`${rowBase} ${rowIdle}`}>รุ่นรถทั้งหมด</Link>
        )}
      </div>

      {carMatch && (
        <div className="flex flex-col gap-1">
          <p className="px-3 pb-1 text-[11px] font-semibold tracking-wider text-faint uppercase">ในหน้านี้</p>
          <a href="#variants-heading" className={`${rowBase} ${rowIdle}`}>บันไดราคา</a>
          <a href="#adas-heading" className={`${rowBase} ${rowIdle}`}>ระบบช่วยขับขี่</a>
          <a href="#timeline-heading" className={`${rowBase} ${rowIdle}`}>ไทม์ไลน์</a>
          <a href="#sources-heading" className={`${rowBase} ${rowIdle}`}>แหล่งอ้างอิง</a>
        </div>
      )}
    </nav>
  );
}

// ── Variant B — รายชื่อรุ่น (สลับรุ่นคลิกเดียว) ──
function SidebarB({ brand, basePath, pathname }: { brand: BrandNav; basePath: string; pathname: string }) {
  const brandHref = `${basePath}/brands/${brand.slug}`;
  const onBrandPage = pathname === brandHref;

  return (
    <nav aria-label={`รุ่นรถ ${brand.name}`} className="flex h-full flex-col">
      <Link href={brandHref} aria-current={onBrandPage ? "page" : undefined} className={`${rowBase} ${onBrandPage ? rowActive : rowIdle}`}>
        <BrandMark name={brand.name} size={20} />
        <span className="font-medium">ภาพรวม {brand.name}</span>
      </Link>
      <div className="my-2 border-t border-border" />
      <ul className="flex flex-col gap-0.5">
        {brand.nameplates.map((np) => {
          const href = `${basePath}/cars/${np.slug}`;
          const active = pathname === href;
          const p = priceShort(np.priceMin);
          return (
            <li key={np.slug}>
              <Link href={href} aria-current={active ? "page" : undefined} className={`${rowBase} justify-between ${active ? rowActive : rowIdle}`}>
                <span className="flex min-w-0 items-center gap-2">
                  <LifecycleDot status={np.lifecycleStatus} />
                  <span className="truncate">{np.name}</span>
                </span>
                {p && <span className="tnum shrink-0 text-[13px] text-faint">{p}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-auto pt-3">
        <Link href="/brands" className={`${rowBase} ${rowIdle} text-[13px]`}>
          ดูแบรนด์อื่น <span aria-hidden>→</span>
        </Link>
      </div>
    </nav>
  );
}

// ── Variant C — ไฮบริด: ตัวตนแบรนด์ + รุ่น + หลักฐาน ──
function SidebarC({ brand, basePath, pathname }: { brand: BrandNav; basePath: string; pathname: string }) {
  const brandHref = `${basePath}/brands/${brand.slug}`;
  const onBrandPage = pathname === brandHref;
  const range =
    brand.stats.priceMin != null && brand.stats.priceMax != null
      ? `${priceShort(brand.stats.priceMin)} – ${priceShort(brand.stats.priceMax)}`
      : null;
  const checked = fmtDate(brand.stats.latestChecked);

  return (
    <nav aria-label={`แบรนด์ ${brand.name}`} className="flex h-full flex-col">
      <Link
        href={brandHref}
        aria-current={onBrandPage ? "page" : undefined}
        className={`flex flex-col gap-2 rounded-lg px-3 py-3 transition-colors ${onBrandPage ? "bg-accent-soft" : "hover:bg-surface-muted"}`}
      >
        <BrandMark name={brand.name} size={28} />
        <span className={`text-[15px] font-semibold ${onBrandPage ? "text-accent" : "text-foreground"}`}>{brand.name}</span>
        {brand.officialName && <span className="text-xs text-faint">{brand.officialName}</span>}
      </Link>
      <dl className="mt-2 space-y-1 px-3 text-xs text-faint">
        {range && (
          <div className="flex justify-between gap-2">
            <dt>ช่วงราคา</dt>
            <dd className="tnum text-muted">{range}</dd>
          </div>
        )}
        <div className="flex justify-between gap-2">
          <dt>ใน coverage</dt>
          <dd className="tnum text-muted">{brand.stats.nameplates} รุ่น · {brand.stats.variants} ย่อย</dd>
        </div>
      </dl>

      <div className="my-3 border-t border-border" />
      <ul className="flex flex-col gap-0.5">
        {brand.nameplates.map((np) => {
          const href = `${basePath}/cars/${np.slug}`;
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

      <div className="mt-auto space-y-0.5 border-t border-border px-3 pt-3 text-[11px] text-faint">
        {checked && <p className="tnum">ตรวจล่าสุด {checked}</p>}
        <a href="#sources-heading" className="inline-block hover:text-accent">แหล่งอ้างอิงทั้งหมด →</a>
      </div>
    </nav>
  );
}

export function MockSidebar({
  variant,
  brand,
  basePath,
}: {
  variant: SidebarVariant;
  brand: BrandNav;
  basePath: string;
}) {
  const pathname = usePathname();
  const inner =
    variant === "a" ? <SidebarA brand={brand} basePath={basePath} pathname={pathname} />
    : variant === "b" ? <SidebarB brand={brand} basePath={basePath} pathname={pathname} />
    : <SidebarC brand={brand} basePath={basePath} pathname={pathname} />;

  return (
    <aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] w-64 shrink-0 flex-col overflow-y-auto border-r border-border bg-background px-3 py-4 lg:flex">
      {inner}
    </aside>
  );
}
