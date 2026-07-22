"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { NameplateRow, VariantIndexRow } from "@/lib/queries";
import { BODY_TYPE_LABEL, LIFECYCLE_LABEL, SEGMENT_LABEL } from "@/lib/labels";
import { formatDateTH, formatTHB } from "@/lib/format";
import { nameplateImage } from "@/lib/images";

type SortKey = "name" | "price" | "year" | "variants";
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

// ป้ายสถานะการขาย (เบสสั่ง 2026-07-20) — ขายอยู่/เลิกจำหน่าย ท้ายชื่อรุ่น
const LIFECYCLE_BADGE_CLASS: Record<string, string> = {
  CURRENT: "bg-success-soft text-success",
  DISCONTINUED: "bg-surface-muted text-faint",
  TRANSITION: "bg-warning-soft text-warning",
  UPCOMING: "bg-accent-soft text-accent",
};

function LifecycleBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${LIFECYCLE_BADGE_CLASS[status] ?? "bg-surface-muted text-faint"}`}
    >
      {LIFECYCLE_LABEL[status] ?? status}
    </span>
  );
}

// เซกเมนต์กับตัวถังมักซ้ำความหมายกัน (เช่น PPV/PPV, กระบะ/กระบะ) — แสดงครั้งเดียวเมื่อข้อความตรงกัน
function CategoryCell({ row }: { row: NameplateRow }) {
  const segmentLabel = row.segment ? (SEGMENT_LABEL[row.segment] ?? row.segment) : null;
  const bodyLabel = row.bodyTypes.map((bt) => BODY_TYPE_LABEL[bt] ?? bt).join(" · ");
  if (!segmentLabel && !bodyLabel) {
    return <span className="text-faint">ไม่มีข้อมูล</span>;
  }
  // บรรทัดเดียวจบ — บรรทัดย่อย (เช่น "SUV กลาง/SUV") ซ้ำความหมาย รกโดยไม่จำเป็น (ฟีดแบ็กเบส 2026-07-20)
  return <span>{segmentLabel ?? bodyLabel}</span>;
}

// จุดสีตามหมวดขุมพลัง (สแกนไว) — คู่กับข้อความเสมอ ไม่พึ่งสีอย่างเดียว (a11y) · สีสื่อ "หมวด" ไม่ใช่คะแนนรถ
function ptDotClass(label: string): string {
  if (label.includes("EV") || label.includes("ไฟฟ้า") || label.includes("ไฮโดรเจน")) return "bg-pt-ev";
  if (label.includes("ไฮบริด")) return "bg-pt-hybrid";
  if (label.includes("ดีเซล")) return "bg-pt-diesel";
  if (label.includes("เบนซิน") || label.includes("สันดาป")) return "bg-pt-petrol";
  return "bg-faint";
}

function PowertrainCell({ labels }: { labels: string[] }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-x-1 gap-y-1">
      {labels.map((l, i) => (
        <span key={l} className="inline-flex items-center whitespace-nowrap">
          {i > 0 && <span className="mx-1 text-faint">·</span>}
          <span aria-hidden className={`mr-1.5 inline-block size-2 rounded-full ${ptDotClass(l)}`} />
          {l}
        </span>
      ))}
    </span>
  );
}

export function CarDatabaseExplorer({
  rows,
  variantRows,
  hideSearch = false,
}: {
  rows: NameplateRow[];
  variantRows: VariantIndexRow[];
  // หน้าแรกมีช่องค้นหาใหญ่ใน hero แล้ว (hero-search.tsx) — ซ่อนช่องซ้ำในตาราง (หลัก: อย่าใส่ข้อมูลซ้ำ)
  // หน้าอื่น (/brands/[slug]) ไม่มี hero ยังใช้ช่องนี้ตามเดิม
  hideSearch?: boolean;
}) {
  const router = useRouter();
  // เงื่อนไขจากช่องค้นหา hero มาทาง URL (?q=/&body=/&pt=/&cap= — ดู hero-search.tsx)
  // ค่าเริ่มต้นของ filter derive จาก URL ตรงๆ (รองรับเข้าหน้าพร้อม param/แชร์ลิงก์)
  const searchParams = useSearchParams();
  const initCap = searchParams.get("cap");
  const [isNavigating, startNavigation] = useTransition();
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [bodyType, setBodyType] = useState<string | null>(searchParams.get("body"));
  const [powertrain, setPowertrain] = useState<string | null>(searchParams.get("pt"));
  const [status, setStatus] = useState<StatusFilter>("all");
  const [priceCapText, setPriceCapText] = useState(
    initCap && Number.isFinite(Number(initCap)) ? Number(initCap).toLocaleString("en-US") : "",
  );
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);

  // เมื่อ URL เปลี่ยนภายหลัง (กดค้นหา/ชิปจาก hero ขณะอยู่บนหน้า): ตั้ง filter ทั้งชุดตาม URL
  // ใช้ render-phase adjustment (แพตเทิร์น "adjusting state when props change" ของ React)
  // — การพิมพ์ในตารางไม่แตะ URL จึงไม่ถูกทับ
  const paramsKey = searchParams.toString();
  const [prevParamsKey, setPrevParamsKey] = useState(paramsKey);
  if (paramsKey !== prevParamsKey) {
    setPrevParamsKey(paramsKey);
    setQ(searchParams.get("q") ?? "");
    setBodyType(searchParams.get("body"));
    setPowertrain(searchParams.get("pt"));
    const cap = searchParams.get("cap");
    setPriceCapText(cap && Number.isFinite(Number(cap)) ? Number(cap).toLocaleString("en-US") : "");
  }

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

  // รุ่นย่อยต่อรุ่น (เรียงราคาต่ำ→สูงแบบบันไดราคา) — ใช้ตอนกางแถว
  const variantsBySlug = useMemo(() => {
    const map = new Map<string, VariantIndexRow[]>();
    for (const v of variantRows) {
      if (!map.has(v.nameplateSlug)) map.set(v.nameplateSlug, []);
      map.get(v.nameplateSlug)!.push(v);
    }
    for (const list of map.values()) {
      list.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    }
    return map;
  }, [variantRows]);

  const filteredNameplates = useMemo(() => {
    const query = q.trim().toLowerCase();
    const result = rows.filter((row) => {
      if (query) {
        // ค้นได้ทั้งชื่อรุ่นและชื่อรุ่นย่อยข้างใน (รวมตารางแล้ว — ค้น "GR Sport" ต้องเจอรุ่นที่มี)
        const variantNames = (variantsBySlug.get(row.slug) ?? [])
          .map((v) => `${v.name} ${v.trimName}`)
          .join(" ");
        const haystack =
          `${row.brand} ${row.name} ${row.generationCode ?? ""} ${variantNames}`.toLowerCase();
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

    // ค่าที่ไม่มี (null) อยู่ท้ายเสมอ ไม่ว่าจะเรียงทิศไหน
    const numSort = (av: number | null, bv: number | null) => {
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      return sortAsc ? av - bv : bv - av;
    };
    result.sort((a, b) => {
      if (sortKey === "price") return numSort(a.priceMin, b.priceMin);
      if (sortKey === "year") return numSort(a.launchYear, b.launchYear);
      if (sortKey === "variants") return sortAsc ? a.variantCount - b.variantCount : b.variantCount - a.variantCount;
      const cmp = `${a.brand} ${a.name}`.localeCompare(`${b.brand} ${b.name}`, "th");
      return sortAsc ? cmp : -cmp;
    });
    return result;
  }, [rows, variantsBySlug, q, bodyType, powertrain, status, priceCap, sortKey, sortAsc]);

  const hasActiveFilter =
    q.trim() !== "" || bodyType || powertrain || status !== "all" || priceCap != null;

  // วันที่ตรวจล่าสุดของทั้งชุด — แสดงครั้งเดียวเหนือตาราง แทนที่จะซ้ำทุกแถว
  const latestCheckedAll = useMemo(
    () =>
      rows.reduce<string | null>(
        (max, r) =>
          r.latestChecked && (!max || r.latestChecked > max) ? r.latestChecked : max,
        null,
      ),
    [rows],
  );

  const shownCount = filteredNameplates.length;
  const totalCount = rows.length;
  const shownVariantCount = filteredNameplates.reduce((n, r) => n + r.variantCount, 0);
  const isEmptyResult = shownCount === 0;

  function resetFilters() {
    setQ("");
    setBodyType(null);
    setPowertrain(null);
    setStatus("all");
    setPriceCapText("");
    // ล้างเงื่อนไขที่มาจาก hero ใน URL ด้วย — กัน state กับ URL ไม่ตรงกัน
    if (paramsKey !== "") {
      router.replace(window.location.pathname, { scroll: false });
    }
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
    if (sortKey !== key)
      return <span aria-hidden className="ml-0.5 text-faint opacity-50">⇅</span>;
    return <span aria-hidden className="ml-0.5 text-accent">{sortAsc ? "↑" : "↓"}</span>;
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
        {!hideSearch && (
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
        )}

        <div className="flex flex-wrap items-center gap-2">
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

      <p aria-live="polite" className="mt-5 mb-1 flex flex-wrap items-center gap-2 text-[13px] text-faint">
        {shownCount} จาก {totalCount} รุ่น · {shownVariantCount} รุ่นย่อย
        <span aria-hidden>·</span>
        <span>ราคาป้ายทางการ</span>
        {latestCheckedAll && (
          <>
            <span aria-hidden>·</span>
            <span>ตรวจล่าสุด {formatDateTH(latestCheckedAll)}</span>
          </>
        )}
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
      ) : (
        <div
          tabIndex={0}
          role="region"
          aria-label="ตารางรุ่นรถ — กดแถวเพื่อกางรุ่นย่อย (เลื่อนแนวนอนได้)"
          className="overflow-x-auto rounded-2xl"
        >
          <table className="w-full min-w-[620px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[13px] text-faint">
                <th scope="col" className="py-2 pr-1 pl-2 text-right font-medium">
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
                    ราคาเริ่มต้น (บาท){sortIndicator("price")}
                  </button>
                </th>
                <th scope="col" className="px-3 py-2 font-medium">ประเภท</th>
                <th scope="col" className="px-3 py-2 font-medium">ขุมพลัง</th>
                <th scope="col" aria-sort={ariaSort("year")} className="px-3 py-2 text-right font-medium">
                  <button
                    type="button"
                    onClick={() => toggleSort("year")}
                    className="-mx-1 rounded px-1 py-2 font-medium hover:text-foreground"
                  >
                    ปี{sortIndicator("year")}
                  </button>
                </th>
                <th scope="col" aria-sort={ariaSort("variants")} className="py-2 pr-3 pl-3 text-right font-medium">
                  <button
                    type="button"
                    onClick={() => toggleSort("variants")}
                    className="-mx-1 rounded px-1 py-2 font-medium hover:text-foreground"
                  >
                    รุ่นย่อย{sortIndicator("variants")}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredNameplates.map((row, i) => (
                <tr key={row.slug} onClick={() => goTo(row.slug)} className={rowClass}>
                  <td className="py-2.5 pr-1 pl-2 text-right text-[13px] text-faint tabular-nums">
                    {i + 1}
                  </td>
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
                      <span className="tnum text-base font-semibold">
                        {formatTHB(row.priceMin)}
                      </span>
                    ) : (
                      <span className="text-sm text-faint">ไม่มีข้อมูล</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-sm text-muted">
                    <CategoryCell row={row} />
                  </td>
                  <td className="px-3 py-2.5 text-sm text-muted">
                    <PowertrainCell labels={row.powertrainLabels} />
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
      )}
    </section>
  );
}
