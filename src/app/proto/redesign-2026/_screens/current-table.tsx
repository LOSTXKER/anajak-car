"use client";

// ตารางฐานข้อมูลของทิศ "ปัจจุบัน" — ใช้ NameplateTable ตัวจริงของเว็บ (ไม่ได้วาดใหม่)
// ต่างจากของจริงจุดเดียว: กดแถวแล้วไปหน้ารุ่น "ในหน้าลอง" · ตัวกรอง/การเรียงเป็นตรรกะชุดเดียวกับ CarDatabaseExplorer
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { NameplateTable, type SortKey } from "@/components/nameplate-table";
import type { NameplateRow } from "@/lib/queries";
import { formatDateTH } from "@/lib/format";

import { NAMEPLATES, TOTALS } from "../../_kit/data";
import { protoHref } from "./kit";

const BODY_ENUM: Record<string, string> = {
  กระบะ: "PICKUP",
  PPV: "PPV",
  ซีดาน: "SEDAN",
  SUV: "SUV",
};

export const PROTO_ROWS: NameplateRow[] = NAMEPLATES.map((n) => ({
  slug: n.slug,
  name: n.name,
  brand: n.brand,
  brandSlug: n.brandSlug,
  segment: n.segmentLabel,
  lifecycleStatus: n.lifecycle,
  generationCode: null,
  launchYear: n.launchYear,
  bodyTypes: [BODY_ENUM[n.bodyLabel] ?? "OTHER"],
  powertrainLabels: n.powertrains,
  priceMin: n.priceMin,
  priceMax: n.priceMax,
  variantCount: n.variantCount,
  pricedVariantCount: n.variantCount,
  sourceCount: 3,
  latestChecked: n.checkedDate,
  confidence: "HIGH",
}));

export function CurrentTable({ thin }: { thin: boolean }) {
  const router = useRouter();
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);
  // สถานะขอบ: กรองแล้วไม่เจอรุ่นไหนเลย (เช่น "EV งบไม่เกิน 1 ล้าน" — ยังไม่มีในระบบ)
  const rows = useMemo(() => {
    const list = thin ? [] : [...PROTO_ROWS];
    const num = (a: number | null, b: number | null) =>
      a == null && b == null ? 0 : a == null ? 1 : b == null ? -1 : sortAsc ? a - b : b - a;
    list.sort((a, b) => {
      if (sortKey === "price") return num(a.priceMin, b.priceMin);
      if (sortKey === "year") return num(a.launchYear, b.launchYear);
      if (sortKey === "variants")
        return sortAsc ? a.variantCount - b.variantCount : b.variantCount - a.variantCount;
      const cmp = `${a.brand} ${a.name}`.localeCompare(`${b.brand} ${b.name}`, "th");
      return sortAsc ? cmp : -cmp;
    });
    return list;
  }, [sortKey, sortAsc, thin]);

  return (
    <section aria-label="ตารางฐานข้อมูลรถ" className="pb-20">
      <div className="flex flex-wrap items-center gap-2">
        {["ตัวถังทั้งหมด", "ขุมพลังทั้งหมด", "สถานะทั้งหมด"].map((label) => (
          <span
            key={label}
            className="rounded-full bg-surface-muted px-3.5 py-1.5 text-sm text-muted"
          >
            {label} ⌄
          </span>
        ))}
        {thin && (
          <span className="rounded-full bg-accent-soft px-3.5 py-1.5 text-sm font-medium text-accent">
            รถไฟฟ้า · งบไม่เกิน 1,000,000 ✕
          </span>
        )}
        <span className="ml-auto flex items-center gap-2 text-sm text-muted">
          งบไม่เกิน
          <span className="w-32 rounded-full bg-surface-muted px-3.5 py-1.5 text-right text-sm text-faint">
            {thin ? "1,000,000" : "เช่น 1,000,000"}
          </span>
          บาท
        </span>
      </div>

      <p className="mt-5 mb-1 flex flex-wrap items-center gap-2 text-[13px] text-faint">
        {rows.length} จาก {TOTALS.nameplates} รุ่น ·{" "}
        {rows.reduce((n, r) => n + r.variantCount, 0)} รุ่นย่อย · ราคาป้ายทางการ · ตรวจล่าสุด{" "}
        {formatDateTH(TOTALS.latestChecked)}
      </p>

      {rows.length === 0 ? (
        <div className="px-6 py-20 text-center">
          <p className="text-[15px] font-medium">ไม่พบรุ่นที่ตรงเงื่อนไข</p>
          <p className="mt-1 text-sm text-muted">ลองปรับคำค้นหรือล้างตัวกรอง แล้วค้นใหม่อีกครั้ง</p>
          <span className="mt-4 inline-block rounded-full bg-surface-muted px-4 py-2 text-sm">
            ล้างตัวกรองทั้งหมด
          </span>
        </div>
      ) : (
        <NameplateTable
          rows={rows}
          sortKey={sortKey}
          sortAsc={sortAsc}
          onToggleSort={(k) => {
            if (k === sortKey) setSortAsc((v) => !v);
            else {
              setSortKey(k);
              setSortAsc(true);
            }
          }}
          onRowClick={() => router.push(protoHref("current", "model", thin))}
          isNavigating={false}
        />
      )}
    </section>
  );
}
