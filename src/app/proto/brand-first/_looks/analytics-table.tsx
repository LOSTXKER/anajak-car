"use client";

// ตาราง leaderboard ของลุค ANALYTICS — กดหัวคอลัมน์เรียงได้จริง (แพตเทิร์นเดียวกับ arena/artificialanalysis)
// เรียงได้เฉพาะค่าที่ "วัดได้จริง" (ราคา · จำนวนรุ่นย่อย · ปีเปิดตัว) — ไม่มีคะแนนรวมของรถ ตามกฎผลิตภัณฑ์
import { useMemo, useState } from "react";
import Image from "next/image";

import { formatDateTH, formatTHB } from "@/lib/format";

import { NAMEPLATES } from "../../_kit/data";
import { BfLink, PtDot, shortTHB } from "./kit";

type SortKey = "price" | "top" | "variants" | "year" | "name";

const COLS: { key: SortKey; label: string; align: "left" | "right" }[] = [
  { key: "name", label: "รุ่น", align: "left" },
  { key: "price", label: "ราคาเริ่มต้น", align: "right" },
  { key: "top", label: "ราคาสูงสุด", align: "right" },
  { key: "variants", label: "รุ่นย่อย", align: "right" },
  { key: "year", label: "ปีเปิดตัว", align: "right" },
];

const SCALE = Math.max(...NAMEPLATES.map((n) => n.priceMax ?? 0));

export function AnalyticsTable({ thin, brandSlug }: { thin: boolean; brandSlug?: string }) {
  const [sort, setSort] = useState<SortKey>("price");
  const [asc, setAsc] = useState(true);

  const rows = useMemo(() => {
    const base = brandSlug ? NAMEPLATES.filter((n) => n.brandSlug === brandSlug) : NAMEPLATES;
    const list = thin && !brandSlug ? [] : [...base];
    const num = (a: number | null, b: number | null) =>
      a == null && b == null ? 0 : a == null ? 1 : b == null ? -1 : asc ? a - b : b - a;
    list.sort((a, b) => {
      if (sort === "price") return num(a.priceMin, b.priceMin);
      if (sort === "top") return num(a.priceMax, b.priceMax);
      if (sort === "variants") return asc ? a.variantCount - b.variantCount : b.variantCount - a.variantCount;
      if (sort === "year") return num(a.launchYear, b.launchYear);
      const cmp = `${a.brand} ${a.name}`.localeCompare(`${b.brand} ${b.name}`, "th");
      return asc ? cmp : -cmp;
    });
    return list;
  }, [sort, asc, thin, brandSlug]);

  function toggle(k: SortKey) {
    if (k === sort) setAsc((v) => !v);
    else {
      setSort(k);
      setAsc(k === "name" || k === "price");
    }
  }

  if (rows.length === 0) {
    return (
      <div className="lk-panel rounded-2xl px-6 py-14 text-center">
        <p className="font-semibold">ยังไม่มีรุ่นที่ตรงเงื่อนไขนี้</p>
        <p className="lk-muted mt-1 text-[13px]">
          ฐานข้อมูลเก็บลึกทีละแบรนด์ — เราไม่เติมรุ่นที่ยังไม่มีหลักฐานราคาเข้ามาให้ดูเยอะไว้ก่อน
        </p>
      </div>
    );
  }

  return (
    <>
      {/* desktop */}
      <div className="lk-panel hidden overflow-x-auto rounded-2xl sm:block">
        <table className="lk-table min-w-[880px] text-[13px]">
          <thead>
            <tr>
              <th className="w-12 text-right">อันดับ</th>
              {COLS.map((c) => (
                <th key={c.key} className={c.align === "right" ? "text-right" : ""}>
                  <button
                    type="button"
                    onClick={() => toggle(c.key)}
                    className="inline-flex items-center gap-1 hover:text-[color:var(--lk-text)]"
                  >
                    {c.label}
                    <span aria-hidden style={{ color: sort === c.key ? "var(--lk-accent)" : "var(--lk-faint)" }}>
                      {sort === c.key ? (asc ? "↑" : "↓") : "⇅"}
                    </span>
                  </button>
                </th>
              ))}
              <th className="w-[190px]">ช่วงราคาเทียบทั้งฐาน</th>
              <th>ขุมพลัง</th>
              <th className="text-right">ตรวจล่าสุด</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((n, i) => (
              <tr key={n.slug} className="group relative">
                <td className="text-right">
                  <span className={`an-rank ${i < 3 && sort === "price" && asc ? "top" : ""}`}>{i + 1}</span>
                </td>
                <td>
                  <span className="flex items-center gap-3">
                    {n.image ? (
                      <Image src={n.image} alt="" width={52} height={30} className="h-[30px] w-[52px] shrink-0 object-contain" />
                    ) : (
                      <span
                        aria-hidden
                        className="lk-faint grid h-[30px] w-[52px] shrink-0 place-items-center rounded text-[10px]"
                        style={{ background: "var(--lk-panel-2)" }}
                      >
                        ไม่มีรูป
                      </span>
                    )}
                    <span className="min-w-0">
                      <BfLink
                        look="analytics"
                        screen="model"
                        thin={thin}
                        className="block font-semibold after:absolute after:inset-0 group-hover:text-[color:var(--lk-accent)]"
                      >
                        {n.name}
                      </BfLink>
                      <span className="lk-faint block text-[11px]">
                        {n.brand} · {n.segmentLabel}
                      </span>
                    </span>
                  </span>
                </td>
                <td className="text-right text-[15px] font-bold tnum">
                  {n.priceMin != null ? formatTHB(n.priceMin) : <span className="lk-faint text-[13px]">ไม่มีข้อมูล</span>}
                </td>
                <td className="lk-muted text-right tnum">{n.priceMax != null ? formatTHB(n.priceMax) : "—"}</td>
                <td className="text-right tnum">{n.variantCount}</td>
                <td className="lk-muted text-right tnum">{n.launchYear ?? <span className="lk-faint">—</span>}</td>
                <td>
                  {n.priceMin != null && n.priceMax != null ? (
                    <span className="block">
                      <span className="an-bar-track">
                        <span
                          className="an-bar-fill"
                          style={{
                            left: `${(n.priceMin / SCALE) * 100}%`,
                            width: `${Math.max(((n.priceMax - n.priceMin) / SCALE) * 100, 2)}%`,
                          }}
                        />
                      </span>
                    </span>
                  ) : (
                    <span className="lk-faint text-[12px]">ไม่มีข้อมูล</span>
                  )}
                </td>
                <td className="lk-muted">
                  <span className="flex flex-wrap gap-x-3 gap-y-1">
                    {n.powertrains.map((p) => (
                      <PtDot key={p} label={p} />
                    ))}
                  </span>
                </td>
                <td className="lk-faint text-right text-[12px] tnum">{formatDateTH(n.checkedDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* mobile */}
      <div className="sm:hidden">
        {rows.map((n, i) => (
          <BfLink
            key={n.slug}
            look="analytics"
            screen="model"
            thin={thin}
            className="lk-line flex items-center gap-3 border-b py-3"
          >
            <span className="an-rank shrink-0">{i + 1}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-semibold">{n.name}</span>
              <span className="lk-faint block truncate text-[11px]">
                {n.brand} · {n.segmentLabel} · {n.variantCount} รุ่นย่อย
              </span>
            </span>
            <span className="shrink-0 text-right">
              <span className="block font-bold tnum">{n.priceMin != null ? shortTHB(n.priceMin) : "—"}</span>
              <span className="lk-faint block text-[11px] tnum">
                ถึง {n.priceMax != null ? shortTHB(n.priceMax) : "—"}
              </span>
            </span>
          </BfLink>
        ))}
      </div>
    </>
  );
}
