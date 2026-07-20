"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { VariantIndexRow } from "@/lib/queries";
import { BODY_TYPE_LABEL } from "@/lib/labels";
import { formatTHB } from "@/lib/format";

const BODY_ORDER = ["PICKUP", "SUV", "PPV", "SEDAN", "HATCHBACK", "MPV", "VAN", "WAGON", "COUPE"];
const PT_ORDER = ["ดีเซล", "เบนซิน", "มายด์ไฮบริด", "ไฮบริด", "ปลั๊กอินไฮบริด", "EV", "ไฮโดรเจน"];
const STEP_CANDIDATES = [100_000, 250_000, 500_000, 1_000_000];

// เลือกช่วง "หมุดราคา" ให้ได้ landmark ≤8 อัน (ละเอียดสุดที่ยังไม่เกิน) — 0 อันถ้าช่วงกว้างเกิน
function priceMarks(min: number, max: number): number[] {
  for (const step of STEP_CANDIDATES) {
    const first = Math.ceil((min + 1) / step) * step;
    const marks: number[] = [];
    for (let v = first; v < max; v += step) marks.push(v);
    if (marks.length <= 8) return marks;
  }
  return [];
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-3.5 py-1.5 text-[13px] transition-colors ${
        active ? "bg-accent-soft font-medium text-accent" : "bg-surface-muted text-muted hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

export function PriceLadder({
  rows,
  brandSlug,
}: {
  rows: VariantIndexRow[];
  brandSlug: string;
}) {
  const [body, setBody] = useState<string | null>(null);
  const [pt, setPt] = useState<string | null>(null);

  // เฉพาะรุ่นย่อยที่ "ซื้อได้ตอนนี้" + มีราคา
  const priced = useMemo(
    () =>
      rows.filter(
        (r) =>
          r.price != null &&
          (r.lifecycleStatus === "CURRENT" || r.lifecycleStatus === "TRANSITION"),
      ),
    [rows],
  );

  const bodyOptions = useMemo(() => {
    const present = new Set(priced.map((r) => r.bodyType));
    return BODY_ORDER.filter((b) => present.has(b));
  }, [priced]);
  const ptOptions = useMemo(() => {
    const present = new Set(priced.map((r) => r.powertrainLabel));
    const ordered = PT_ORDER.filter((p) => present.has(p));
    return [...ordered, ...[...present].filter((p) => !PT_ORDER.includes(p))];
  }, [priced]);

  const filtered = useMemo(() => {
    return priced
      .filter((r) => (body ? r.bodyType === body : true) && (pt ? r.powertrainLabel === pt : true))
      .sort((a, b) => (a.price as number) - (b.price as number));
  }, [priced, body, pt]);

  const marks =
    filtered.length > 1
      ? priceMarks(filtered[0].price as number, filtered[filtered.length - 1].price as number)
      : [];

  const hasFilter = body != null || pt != null;

  // เดินลิสต์ + แทรกหมุดราคาเมื่อข้ามระดับ (delta คำนวณจากลิสต์ที่เห็นจริง)
  const items: React.ReactNode[] = [];
  let markPtr = 0;
  filtered.forEach((r, i) => {
    while (markPtr < marks.length && (r.price as number) >= marks[markPtr]) {
      items.push(
        <li key={`mark-${marks[markPtr]}`} className="flex items-center gap-2 py-1.5" aria-hidden>
          <span className="text-[11px] font-medium tracking-wide text-faint tabular-nums">
            {formatTHB(marks[markPtr])}
          </span>
          <span className="h-px flex-1 bg-border" />
        </li>,
      );
      markPtr++;
    }
    const prev = i > 0 ? (filtered[i - 1].price as number) : null;
    const delta = prev != null ? (r.price as number) - prev : 0;
    const specLine = [
      BODY_TYPE_LABEL[r.bodyType] ?? r.bodyType,
      r.powertrainLabel,
      r.powerText,
      r.transmissionText,
    ]
      .filter(Boolean)
      .join(" · ");
    items.push(
      <li key={r.id}>
        <Link
          href={`/brands/${brandSlug}/cars/${r.nameplateSlug}`}
          className="flex items-start justify-between gap-4 py-3 transition-colors hover:bg-surface-muted"
        >
          <div className="min-w-0">
            <p className="truncate text-[15px]">
              <span className="font-medium">{r.nameplateName}</span>
              <span className="text-muted"> · {r.name}</span>
            </p>
            <p className="mt-0.5 text-[13px] text-faint">{specLine}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[15px] font-semibold tabular-nums">{formatTHB(r.price as number)}</p>
            {delta > 0 && (
              <p className="text-xs text-faint tabular-nums">+{formatTHB(delta)}</p>
            )}
          </div>
        </Link>
      </li>,
    );
  });

  return (
    <div>
      {/* ฟิลเตอร์ */}
      <div className="flex flex-col gap-2.5">
        {bodyOptions.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {bodyOptions.map((b) => (
              <FilterChip key={b} label={BODY_TYPE_LABEL[b] ?? b} active={body === b} onClick={() => setBody(body === b ? null : b)} />
            ))}
          </div>
        )}
        {ptOptions.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {ptOptions.map((p) => (
              <FilterChip key={p} label={p} active={pt === p} onClick={() => setPt(pt === p ? null : p)} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <p className="text-sm text-faint">
          แสดง <span className="font-medium text-foreground">{filtered.length}</span> จาก {priced.length} รุ่นย่อย
        </p>
        {hasFilter && (
          <button
            type="button"
            onClick={() => {
              setBody(null);
              setPt(null);
            }}
            className="text-sm text-accent transition-colors hover:underline"
          >
            ล้างตัวกรอง
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 text-center text-sm text-muted">ไม่มีรุ่นย่อยตรงตามตัวกรอง</p>
      ) : (
        <ol className="mt-3 max-w-3xl divide-y divide-border">{items}</ol>
      )}
    </div>
  );
}
