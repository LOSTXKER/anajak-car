"use client";

import Image from "next/image";
import Link from "next/link";
import type { NameplateRow } from "@/lib/queries";
import { BODY_TYPE_LABEL, SEGMENT_LABEL } from "@/lib/labels";
import { formatTHB } from "@/lib/format";
import { nameplateImage } from "@/lib/images";
import { LifecycleBadge, PowertrainDots } from "@/components/badges";

// เกณฑ์เรียงตาราง — ใช้ร่วม parent (state/ตรรกะ sort) + ตารางนี้ (แสดง indicator)
export type SortKey = "name" | "price" | "year" | "variants";

function CarThumb({ slug }: { slug: string }) {
  const image = nameplateImage(slug);
  if (!image) {
    return (
      <span
        aria-hidden
        className="flex h-8 w-14 shrink-0 items-center justify-center rounded-lg bg-surface-muted"
      >
        <svg viewBox="0 0 48 24" className="h-3.5 w-7 text-faint" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 17h-2v-4l4-1 5-6h14l6 6h7a3 3 0 0 1 3 3v2h-3" />
          <circle cx="14" cy="17" r="3" />
          <circle cx="36" cy="17" r="3" />
          <path d="M17 17h16" />
        </svg>
      </span>
    );
  }
  return (
    <Image
      src={image.src}
      alt=""
      width={56}
      height={32}
      className="h-8 w-14 shrink-0 rounded-lg bg-surface-muted object-contain transition-transform duration-300 group-hover:scale-110"
    />
  );
}

// เซกเมนต์กับตัวถังมักซ้ำความหมายกัน — แสดงครั้งเดียวเมื่อข้อความตรงกัน
function CategoryCell({ row }: { row: NameplateRow }) {
  const segmentLabel = row.segment ? (SEGMENT_LABEL[row.segment] ?? row.segment) : null;
  const bodyLabel = row.bodyTypes.map((bt) => BODY_TYPE_LABEL[bt] ?? bt).join(" · ");
  if (!segmentLabel && !bodyLabel) {
    return <span className="text-faint">ไม่มีข้อมูล</span>;
  }
  return <span>{segmentLabel ?? bodyLabel}</span>;
}

// หัวคอลัมน์ที่กดเรียงได้ — ⇅ จางเมื่อยังไม่ active, ลูกศรทิศทางสี accent เมื่อ active
function SortHeader({
  label,
  className,
  k,
  sortKey,
  sortAsc,
  onToggle,
}: {
  label: string;
  className: string;
  k: SortKey;
  sortKey: SortKey;
  sortAsc: boolean;
  onToggle: (key: SortKey) => void;
}) {
  const active = sortKey === k;
  return (
    <th scope="col" aria-sort={active ? (sortAsc ? "ascending" : "descending") : undefined} className={className}>
      <button
        type="button"
        onClick={() => onToggle(k)}
        className="-mx-1 rounded px-1 py-2 font-medium hover:text-foreground"
      >
        {label}
        {active ? (
          <span aria-hidden className="ml-0.5 text-accent">{sortAsc ? "↑" : "↓"}</span>
        ) : (
          <span aria-hidden className="ml-0.5 text-faint opacity-50">⇅</span>
        )}
      </button>
    </th>
  );
}

// ตารางรุ่นรถ (presentational) — state/filter/sort อยู่ที่ parent (CarDatabaseExplorer)
export function NameplateTable({
  rows,
  sortKey,
  sortAsc,
  onToggleSort,
  onRowClick,
  isNavigating,
}: {
  rows: NameplateRow[];
  sortKey: SortKey;
  sortAsc: boolean;
  onToggleSort: (key: SortKey) => void;
  onRowClick: (slug: string) => void;
  isNavigating: boolean;
}) {
  const rowClass = `group cursor-pointer border-b border-border transition-colors last:border-b-0 hover:bg-surface-muted ${
    isNavigating ? "opacity-60" : ""
  }`;

  return (
    <div
      tabIndex={0}
      role="region"
      aria-label="ตารางรุ่นรถ — กดแถวเพื่อดูรายละเอียด (เลื่อนแนวนอนได้)"
      className="overflow-x-auto rounded-2xl"
    >
      <table className="w-full min-w-[620px] text-sm">
        <thead>
          <tr className="border-b border-border text-left text-[13px] text-faint">
            <th scope="col" className="py-2 pr-1 pl-2 text-right font-medium">
              <span className="sr-only">ลำดับ</span>#
            </th>
            <SortHeader label="รุ่น" k="name" className="px-3 py-1.5 font-medium" sortKey={sortKey} sortAsc={sortAsc} onToggle={onToggleSort} />
            <SortHeader label="ราคาเริ่มต้น (บาท)" k="price" className="px-3 py-1.5 text-right font-medium" sortKey={sortKey} sortAsc={sortAsc} onToggle={onToggleSort} />
            <th scope="col" className="px-3 py-2 font-medium">ประเภท</th>
            <th scope="col" className="px-3 py-2 font-medium">ขุมพลัง</th>
            <SortHeader label="ปี" k="year" className="px-3 py-2 text-right font-medium" sortKey={sortKey} sortAsc={sortAsc} onToggle={onToggleSort} />
            <SortHeader label="รุ่นย่อย" k="variants" className="py-2 pr-3 pl-3 text-right font-medium" sortKey={sortKey} sortAsc={sortAsc} onToggle={onToggleSort} />
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.slug} onClick={() => onRowClick(row.slug)} className={rowClass}>
              <td className="tnum py-2.5 pr-1 pl-2 text-right text-[13px] text-faint">{i + 1}</td>
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-3">
                  <CarThumb slug={row.slug} />
                  <Link
                    href={`/cars/${row.slug}`}
                    className="text-[15px] font-semibold text-foreground group-hover:text-accent"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {row.name}
                  </Link>
                  {/* ป้ายสถานะเฉพาะที่ต่างจากค่าปกติ (ขายอยู่ทั้งตาราง = noise) */}
                  {row.lifecycleStatus !== "CURRENT" && (
                    <LifecycleBadge status={row.lifecycleStatus} />
                  )}
                </div>
              </td>
              <td className="px-3 py-2.5 text-right whitespace-nowrap">
                {row.priceMin != null ? (
                  <span className="tnum text-base font-semibold">{formatTHB(row.priceMin)}</span>
                ) : (
                  <span className="text-sm text-faint">ไม่มีข้อมูล</span>
                )}
              </td>
              <td className="px-3 py-2.5 text-sm text-muted">
                <CategoryCell row={row} />
              </td>
              <td className="px-3 py-2.5 text-sm text-muted">
                <PowertrainDots labels={row.powertrainLabels} />
              </td>
              <td
                className="tnum px-3 py-2.5 text-right text-sm text-muted"
                title={row.generationCode ?? undefined}
              >
                {row.launchYear ?? <span className="text-faint">—</span>}
              </td>
              <td className="py-2.5 pr-3 pl-3 text-right whitespace-nowrap">
                <span className="tnum text-sm text-muted">{row.variantCount}</span>
                <span aria-hidden className="ml-1.5 text-faint transition-colors group-hover:text-accent">
                  ›
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
