"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { NameplateRow, VariantIndexRow } from "@/lib/queries";
import { BODY_TYPE_LABEL } from "@/lib/labels";
import { formatTHB } from "@/lib/format";
import { ModelCard } from "@/components/model-card";

// ลำดับตัวถังที่อยากให้ชิปเรียง (เฉพาะที่มีในข้อมูลถึงจะโชว์)
const BODY_ORDER = ["PICKUP", "SUV", "PPV", "SEDAN", "HATCHBACK", "MPV", "VAN", "WAGON", "COUPE"];
const PT_ORDER = ["ดีเซล", "เบนซิน", "มายด์ไฮบริด", "ไฮบริด", "ปลั๊กอินไฮบริด", "EV", "ไฮโดรเจน"];

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-3.5 py-1.5 text-[13px] transition-colors ${
        active
          ? "bg-accent-soft font-medium text-accent"
          : "bg-surface-muted text-muted hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

// หน้า "รุ่นรถทั้งหมด" = grid การ์ดรุ่น (= character grid ของ prydwen) + ค้นหา + ฟิลเตอร์ตัวถัง/ขุมพลัง
export function CarGrid({
  rows,
  variantRows,
}: {
  rows: NameplateRow[];
  variantRows: VariantIndexRow[];
}) {
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get("q") ?? "");
  const [body, setBody] = useState<string | null>(sp.get("body"));
  const [pt, setPt] = useState<string | null>(sp.get("pt"));
  const [cap, setCap] = useState<number | null>(
    sp.get("cap") ? Number(sp.get("cap")) : null,
  );

  // haystack ค้นหาต่อรุ่น = ชื่อรุ่น + แบรนด์ + ชื่อรุ่นย่อยทั้งหมด (ค้น "GR Sport" เจอรุ่นที่มี)
  const haystack = useMemo(() => {
    const map = new Map<string, string>();
    for (const r of rows) map.set(r.slug, `${r.name} ${r.brand}`.toLowerCase());
    for (const v of variantRows) {
      const cur = map.get(v.nameplateSlug) ?? "";
      map.set(v.nameplateSlug, `${cur} ${v.name} ${v.trimName}`.toLowerCase());
    }
    return map;
  }, [rows, variantRows]);

  const bodyOptions = useMemo(() => {
    const present = new Set(rows.flatMap((r) => r.bodyTypes));
    return BODY_ORDER.filter((b) => present.has(b));
  }, [rows]);

  const ptOptions = useMemo(() => {
    const present = new Set(rows.flatMap((r) => r.powertrainLabels));
    const ordered = PT_ORDER.filter((p) => present.has(p));
    const rest = [...present].filter((p) => !PT_ORDER.includes(p));
    return [...ordered, ...rest];
  }, [rows]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows
      .filter((r) => {
        if (needle && !(haystack.get(r.slug) ?? "").includes(needle)) return false;
        if (body && !r.bodyTypes.includes(body)) return false;
        if (pt && !r.powertrainLabels.includes(pt)) return false;
        if (cap != null && !(r.priceMin != null && r.priceMin <= cap)) return false;
        return true;
      })
      .sort((a, b) => {
        // เรียงราคาต่ำ→สูง (บันไดราคา) · รุ่นไม่มีราคาไปท้าย
        if (a.priceMin == null) return b.priceMin == null ? 0 : 1;
        if (b.priceMin == null) return -1;
        return a.priceMin - b.priceMin;
      });
  }, [rows, haystack, q, body, pt, cap]);

  const hasFilter = q.trim() !== "" || body != null || pt != null || cap != null;
  function clearAll() {
    setQ("");
    setBody(null);
    setPt(null);
    setCap(null);
  }

  return (
    <div>
      {/* ค้นหา */}
      <div className="flex items-center gap-2 rounded-full border border-border-strong bg-surface py-2 pr-3 pl-5 transition-[border-color,box-shadow] focus-within:border-accent focus-within:shadow-sm">
        <span aria-hidden className="text-lg text-faint">
          ⌕
        </span>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ค้นหารุ่นรถ เช่น Hilux, Corolla Altis, GR Sport…"
          aria-label="ค้นหารุ่นรถ"
          className="w-full bg-transparent py-1 text-[15px] outline-none placeholder:text-faint"
        />
      </div>

      {/* ฟิลเตอร์ตัวถัง + ขุมพลัง */}
      <div className="mt-4 flex flex-col gap-2.5">
        <div className="flex flex-wrap gap-2">
          {bodyOptions.map((b) => (
            <FilterChip
              key={b}
              label={BODY_TYPE_LABEL[b] ?? b}
              active={body === b}
              onClick={() => setBody(body === b ? null : b)}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {ptOptions.map((p) => (
            <FilterChip key={p} label={p} active={pt === p} onClick={() => setPt(pt === p ? null : p)} />
          ))}
          {cap != null && (
            <FilterChip
              label={`งบ ≤ ${formatTHB(cap)}`}
              active
              onClick={() => setCap(null)}
            />
          )}
        </div>
      </div>

      {/* จำนวน + ล้างตัวกรอง */}
      <div className="mt-5 flex items-center justify-between">
        <p className="text-sm text-faint">
          แสดง <span className="font-medium text-foreground">{filtered.length}</span> รุ่น
        </p>
        {hasFilter && (
          <button
            type="button"
            onClick={clearAll}
            className="text-sm text-accent transition-colors hover:underline"
          >
            ล้างตัวกรอง
          </button>
        )}
      </div>

      {/* grid การ์ดรุ่น */}
      {filtered.length === 0 ? (
        <p className="mt-8 text-center text-sm text-muted">ไม่พบรุ่นที่ตรงกับตัวกรอง</p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((row) => (
            <ModelCard key={row.slug} row={row} />
          ))}
        </div>
      )}
    </div>
  );
}
