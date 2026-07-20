"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { NameplateRow, VariantIndexRow } from "@/lib/queries";
import { BODY_TYPE_LABEL, SEGMENT_LABEL } from "@/lib/labels";
import { formatDateTH, formatPriceRange, formatTHB } from "@/lib/format";
import { LifecycleDot } from "@/components/badges";
import { nameplateImage } from "@/lib/images";

type ViewMode = "nameplates" | "variants";
type SortKey = "name" | "price";
type StatusFilter = "all" | "CURRENT" | "DISCONTINUED";

// ตัวกรองแบบ dropdown — แพตเทิร์นมาตรฐานของเว็บตารางข้อมูล (กะทัดรัด · state ที่เลือกเห็นชัดบนตัวปุ่ม)
function FilterSelect({
  label,
  value,
  onChange,
  options,
  allLabel,
}: {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  options: { value: string; label: string }[];
  allLabel: string;
}) {
  const active = value != null;
  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{label}</span>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? null : e.target.value)}
        className={`cursor-pointer appearance-none rounded-full py-1.5 pr-8 pl-3.5 text-sm transition-colors outline-none ${
          active
            ? "bg-accent-soft font-medium text-accent"
            : "bg-surface-muted text-muted hover:text-foreground"
        }`}
      >
        <option value="">{allLabel}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <svg
        viewBox="0 0 12 12"
        aria-hidden
        className={`pointer-events-none absolute right-3 size-3 ${active ? "text-accent" : "text-faint"}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m2.5 4.5 3.5 3.5 3.5-3.5" />
      </svg>
    </label>
  );
}

function CarThumb({ slug }: { slug: string }) {
  const image = nameplateImage(slug);
  if (!image) {
    return (
      <span
        aria-hidden
        className="flex h-10 w-[72px] shrink-0 items-center justify-center rounded-xl bg-surface-muted"
      >
        <svg viewBox="0 0 48 24" className="h-4 w-8 text-faint" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
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
      width={72}
      height={40}
      className="h-10 w-[72px] shrink-0 rounded-xl bg-surface-muted object-contain transition-transform duration-300 group-hover:scale-110"
    />
  );
}

// เซกเมนต์กับตัวถังมักซ้ำความหมายกัน (เช่น PPV/PPV, กระบะ/กระบะ) — แสดงครั้งเดียวเมื่อข้อความตรงกัน
function CategoryCell({ row }: { row: NameplateRow }) {
  const segmentLabel = row.segment ? (SEGMENT_LABEL[row.segment] ?? row.segment) : null;
  const bodyLabel = row.bodyTypes.map((bt) => BODY_TYPE_LABEL[bt] ?? bt).join(" · ");
  if (!segmentLabel && !bodyLabel) {
    return <span className="text-faint">ไม่มีข้อมูล</span>;
  }
  if (!segmentLabel) return <span>{bodyLabel}</span>;
  const showBody = bodyLabel && bodyLabel !== segmentLabel;
  return (
    <div>
      <div>{segmentLabel}</div>
      {showBody && <div className="text-xs text-faint">{bodyLabel}</div>}
    </div>
  );
}

export function CarDatabaseExplorer({
  rows,
  variantRows,
}: {
  rows: NameplateRow[];
  variantRows: VariantIndexRow[];
}) {
  const router = useRouter();
  const [isNavigating, startNavigation] = useTransition();
  const [view, setView] = useState<ViewMode>("nameplates");
  const [q, setQ] = useState("");
  const [bodyType, setBodyType] = useState<string | null>(null);
  const [powertrain, setPowertrain] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [priceCapText, setPriceCapText] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);

  const bodyTypeOptions = useMemo(
    () =>
      [...new Set(rows.flatMap((r) => r.bodyTypes))].map((bt) => ({
        value: bt,
        label: BODY_TYPE_LABEL[bt] ?? bt,
      })),
    [rows],
  );
  const powertrainOptions = useMemo(
    () =>
      [...new Set(rows.flatMap((r) => r.powertrainLabels))].map((pt) => ({
        value: pt,
        label: pt,
      })),
    [rows],
  );

  const priceCap = useMemo(() => {
    const n = Number(priceCapText.replaceAll(",", ""));
    return priceCapText.trim() !== "" && Number.isFinite(n) && n > 0 ? n : null;
  }, [priceCapText]);

  const filteredNameplates = useMemo(() => {
    const query = q.trim().toLowerCase();
    const result = rows.filter((row) => {
      if (query) {
        const haystack = `${row.brand} ${row.name} ${row.generationCode ?? ""}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      if (bodyType && !row.bodyTypes.includes(bodyType)) return false;
      if (powertrain && !row.powertrainLabels.includes(powertrain)) return false;
      if (status !== "all" && row.lifecycleStatus !== status) return false;
      if (priceCap != null && (row.priceMin == null || row.priceMin > priceCap)) {
        return false;
      }
      return true;
    });

    result.sort((a, b) => {
      // แถวไม่มีราคาต้องอยู่ท้ายเสมอ ไม่ว่าจะเรียงทิศไหน
      if (sortKey === "price") {
        if (a.priceMin == null && b.priceMin == null) return 0;
        if (a.priceMin == null) return 1;
        if (b.priceMin == null) return -1;
        return sortAsc ? a.priceMin - b.priceMin : b.priceMin - a.priceMin;
      }
      const cmp = `${a.brand} ${a.name}`.localeCompare(`${b.brand} ${b.name}`, "th");
      return sortAsc ? cmp : -cmp;
    });
    return result;
  }, [rows, q, bodyType, powertrain, status, priceCap, sortKey, sortAsc]);

  const filteredVariants = useMemo(() => {
    const query = q.trim().toLowerCase();
    const result = variantRows.filter((row) => {
      if (query) {
        const haystack =
          `${row.brand} ${row.nameplateName} ${row.name} ${row.trimName}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      if (bodyType && row.bodyType !== bodyType) return false;
      if (powertrain && row.powertrainLabel !== powertrain) return false;
      if (status !== "all" && row.lifecycleStatus !== status) return false;
      if (priceCap != null && (row.price == null || row.price > priceCap)) return false;
      return true;
    });

    result.sort((a, b) => {
      if (sortKey === "price") {
        if (a.price == null && b.price == null) return 0;
        if (a.price == null) return 1;
        if (b.price == null) return -1;
        return sortAsc ? a.price - b.price : b.price - a.price;
      }
      const cmp = `${a.brand} ${a.nameplateName} ${a.name}`.localeCompare(
        `${b.brand} ${b.nameplateName} ${b.name}`,
        "th",
      );
      return sortAsc ? cmp : -cmp;
    });
    return result;
  }, [variantRows, q, bodyType, powertrain, status, priceCap, sortKey, sortAsc]);

  const hasActiveFilter =
    q.trim() !== "" || bodyType || powertrain || status !== "all" || priceCap != null;

  const shownCount = view === "nameplates" ? filteredNameplates.length : filteredVariants.length;
  const totalCount = view === "nameplates" ? rows.length : variantRows.length;
  const isEmptyResult = shownCount === 0;

  function resetFilters() {
    setQ("");
    setBodyType(null);
    setPowertrain(null);
    setStatus("all");
    setPriceCapText("");
  }

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortAsc((asc) => !asc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  function sortIndicator(key: SortKey) {
    if (sortKey !== key) return null;
    return <span aria-hidden> {sortAsc ? "↑" : "↓"}</span>;
  }

  function ariaSort(key: SortKey): "ascending" | "descending" | undefined {
    if (sortKey !== key) return undefined;
    return sortAsc ? "ascending" : "descending";
  }

  function goTo(slug: string) {
    startNavigation(() => router.push(`/cars/${slug}`));
  }

  const rowClass = `group cursor-pointer border-b border-border transition-colors last:border-b-0 hover:bg-surface-muted ${
    isNavigating ? "opacity-60" : ""
  }`;

  return (
    <section aria-label="ตารางฐานข้อมูลรถ" className="pb-20">
      <div className="flex flex-col gap-4">
        <label className="relative mx-auto block w-full max-w-2xl">
          <span className="sr-only">ค้นหารุ่นรถ</span>
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 text-lg text-faint"
          >
            ⌕
          </span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ค้นหา เช่น Hilux, Corolla, bZ4X…"
            className="w-full rounded-full border border-border bg-surface py-3.5 pr-6 pl-12 text-[15px] shadow-sm transition-[border-color,box-shadow] outline-none placeholder:text-faint focus:border-accent focus:shadow-md"
          />
        </label>

        <div className="flex flex-wrap items-center gap-2">
          <div
            role="group"
            aria-label="เลือกมุมมองตาราง"
            className="mr-2 inline-flex rounded-full bg-surface-muted p-1"
          >
            <button
              type="button"
              aria-pressed={view === "nameplates"}
              onClick={() => setView("nameplates")}
              className={`rounded-full px-3.5 py-1 text-sm whitespace-nowrap transition-colors ${
                view === "nameplates"
                  ? "bg-accent font-medium text-background"
                  : "text-muted hover:text-foreground"
              }`}
            >
              รุ่นรถ ({rows.length})
            </button>
            <button
              type="button"
              aria-pressed={view === "variants"}
              onClick={() => setView("variants")}
              className={`rounded-full px-3.5 py-1 text-sm whitespace-nowrap transition-colors ${
                view === "variants"
                  ? "bg-accent font-medium text-background"
                  : "text-muted hover:text-foreground"
              }`}
            >
              รุ่นย่อยทั้งหมด ({variantRows.length})
            </button>
          </div>

          <FilterSelect
            label="กรองตามตัวถัง"
            value={bodyType}
            onChange={setBodyType}
            options={bodyTypeOptions}
            allLabel="ตัวถังทั้งหมด"
          />
          <FilterSelect
            label="กรองตามขุมพลัง"
            value={powertrain}
            onChange={setPowertrain}
            options={powertrainOptions}
            allLabel="ขุมพลังทั้งหมด"
          />
          <FilterSelect
            label="กรองตามสถานะการขาย"
            value={status === "all" ? null : status}
            onChange={(v) => setStatus((v as StatusFilter) ?? "all")}
            options={[
              { value: "CURRENT", label: "ขายอยู่" },
              { value: "DISCONTINUED", label: "เลิกจำหน่าย" },
            ]}
            allLabel="สถานะทั้งหมด"
          />

          {hasActiveFilter && (
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-full px-3 py-1.5 text-sm text-accent transition-colors hover:bg-accent-soft"
            >
              ล้างตัวกรอง
            </button>
          )}

          <label className="ml-auto flex items-center gap-2 text-sm text-muted">
            <span className="whitespace-nowrap">งบไม่เกิน</span>
            <input
              type="text"
              inputMode="numeric"
              value={priceCapText}
              onChange={(e) => setPriceCapText(e.target.value)}
              placeholder="เช่น 1,000,000"
              className="w-32 rounded-full bg-surface-muted px-3.5 py-1.5 text-right text-sm tabular-nums transition-colors outline-none placeholder:text-faint focus:bg-accent-soft"
            />
            <span>บาท</span>
          </label>
        </div>
      </div>

      <p aria-live="polite" className="mt-5 mb-1 flex flex-wrap items-center gap-2 text-xs text-faint">
        {shownCount} จาก {totalCount} {view === "nameplates" ? "รุ่น" : "รุ่นย่อย"}
        <span aria-hidden>·</span>
        <span>ราคาป้ายทางการ — หลักฐานทุกราคาอยู่ในหน้าแต่ละรุ่น</span>
        {isNavigating && (
          <span className="inline-flex items-center gap-1.5 text-accent">
            <span
              aria-hidden
              className="size-3 animate-spin rounded-full border-[1.5px] border-current border-t-transparent"
            />
            กำลังเปิดหน้ารุ่น…
          </span>
        )}
      </p>

      {isEmptyResult ? (
        <div className="px-6 py-20 text-center">
          <p className="text-[15px] font-medium">ไม่พบรุ่นที่ตรงเงื่อนไข</p>
          <p className="mt-1 text-sm text-muted">
            ลองปรับคำค้นหรือล้างตัวกรอง แล้วค้นใหม่อีกครั้ง
          </p>
          {hasActiveFilter && (
            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 rounded-full bg-surface-muted px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent-soft hover:text-accent"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          )}
        </div>
      ) : view === "nameplates" ? (
        <div
          tabIndex={0}
          role="region"
          aria-label="ตารางรุ่นรถ (เลื่อนแนวนอนได้)"
          className="overflow-x-auto rounded-2xl"
        >
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-faint">
                <th scope="col" className="py-3 pr-1 pl-2 text-right font-medium">
                  <span className="sr-only">ลำดับ</span>#
                </th>
                <th scope="col" aria-sort={ariaSort("name")} className="px-3 py-1.5 font-medium">
                  <button
                    type="button"
                    onClick={() => toggleSort("name")}
                    className="-mx-1 rounded px-1 py-2 font-medium hover:text-foreground"
                  >
                    รุ่น{sortIndicator("name")}
                  </button>
                </th>
                <th scope="col" aria-sort={ariaSort("price")} className="px-3 py-1.5 text-right font-medium">
                  <button
                    type="button"
                    onClick={() => toggleSort("price")}
                    className="-mx-1 rounded px-1 py-2 font-medium hover:text-foreground"
                  >
                    ราคาป้าย (บาท){sortIndicator("price")}
                  </button>
                </th>
                <th scope="col" className="px-3 py-3 font-medium">ประเภท</th>
                <th scope="col" className="px-3 py-3 font-medium">ขุมพลัง</th>
                <th scope="col" className="px-3 py-3 text-right font-medium">ปี</th>
                <th scope="col" className="px-3 py-3 text-right font-medium">รุ่นย่อย</th>
                <th scope="col" className="px-3 py-3 pr-2 font-medium">อัปเดต</th>
              </tr>
            </thead>
            <tbody>
              {filteredNameplates.map((row, i) => (
                <tr key={row.slug} onClick={() => goTo(row.slug)} className={rowClass}>
                  <td className="py-3 pr-1 pl-2 text-right text-xs text-faint tabular-nums">
                    {i + 1}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <CarThumb slug={row.slug} />
                      <Link
                        href={`/cars/${row.slug}`}
                        className="font-medium text-foreground group-hover:text-accent"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="mr-1.5 text-xs font-normal text-faint">
                          {row.brand}
                        </span>
                        {row.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right text-[15px] font-semibold whitespace-nowrap tabular-nums">
                    {formatPriceRange(row.priceMin, row.priceMax) ?? (
                      <span className="text-sm font-normal text-faint">ไม่มีข้อมูล</span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-muted">
                    <CategoryCell row={row} />
                  </td>
                  <td className="px-3 py-3 text-muted">
                    {row.powertrainLabels.join(" · ")}
                  </td>
                  <td
                    className="px-3 py-3 text-right text-muted tabular-nums"
                    title={row.generationCode ?? undefined}
                  >
                    {row.launchYear ?? <span className="text-faint">—</span>}
                  </td>
                  <td className="px-3 py-3 text-right">
                    <span className="inline-block rounded-full bg-surface-muted px-2 py-0.5 text-xs text-muted tabular-nums">
                      {row.variantCount}
                    </span>
                  </td>
                  <td className="px-3 py-3 pr-2">
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <LifecycleDot status={row.lifecycleStatus} />
                      <span className="text-xs text-faint">
                        {formatDateTH(row.latestChecked) ?? "—"}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          tabIndex={0}
          role="region"
          aria-label="ตารางรุ่นย่อยทั้งหมด (เลื่อนแนวนอนได้)"
          className="overflow-x-auto rounded-2xl"
        >
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-faint">
                <th scope="col" className="py-3 pr-1 pl-2 text-right font-medium">
                  <span className="sr-only">ลำดับ</span>#
                </th>
                <th scope="col" aria-sort={ariaSort("name")} className="px-3 py-1.5 font-medium">
                  <button
                    type="button"
                    onClick={() => toggleSort("name")}
                    className="-mx-1 rounded px-1 py-2 font-medium hover:text-foreground"
                  >
                    รุ่นย่อย{sortIndicator("name")}
                  </button>
                </th>
                <th scope="col" aria-sort={ariaSort("price")} className="px-3 py-1.5 text-right font-medium">
                  <button
                    type="button"
                    onClick={() => toggleSort("price")}
                    className="-mx-1 rounded px-1 py-2 font-medium hover:text-foreground"
                  >
                    ราคาป้าย (บาท){sortIndicator("price")}
                  </button>
                </th>
                <th scope="col" className="px-3 py-3 font-medium">ตัวถัง</th>
                <th scope="col" className="px-3 py-3 font-medium">ขุมพลัง</th>
                <th scope="col" className="px-3 py-3 font-medium">กำลัง</th>
                <th scope="col" className="px-3 py-3 pr-2 font-medium">เกียร์</th>
              </tr>
            </thead>
            <tbody>
              {filteredVariants.map((row, i) => (
                <tr
                  key={row.id}
                  onClick={() => goTo(row.nameplateSlug)}
                  className={rowClass}
                >
                  <td className="py-3 pr-1 pl-2 text-right text-xs text-faint tabular-nums">
                    {i + 1}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <CarThumb slug={row.nameplateSlug} />
                      <div className="min-w-0">
                        <div className="text-xs text-faint">
                          {row.brand} {row.nameplateName}
                        </div>
                        <Link
                          href={`/cars/${row.nameplateSlug}`}
                          className="font-medium text-foreground group-hover:text-accent"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {row.name}
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right text-[15px] font-semibold whitespace-nowrap tabular-nums">
                    {row.price != null ? (
                      formatTHB(row.price)
                    ) : (
                      <span className="text-sm font-normal text-faint">ไม่มีข้อมูล</span>
                    )}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-muted">
                    {BODY_TYPE_LABEL[row.bodyType] ?? row.bodyType}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-muted">
                    {row.powertrainLabel}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-muted tabular-nums">
                    {row.powerText ?? <span className="text-faint">ไม่มีข้อมูล</span>}
                  </td>
                  <td className="px-3 py-3 pr-2 whitespace-nowrap text-muted">
                    {row.transmissionText ?? <span className="text-faint">ไม่มีข้อมูล</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
