"use client";

// ทิศ A — ตารางฐานข้อมูลที่กรองได้จริง (พระเอกของหน้าแรก)
// กรองแล้วเปลี่ยน "ที่อยู่หน้า" ด้วย (โชว์เป็นแถบ URL จำลอง) — ประเด็นสำคัญของทิศนี้คือ
// ทุกชุดตัวกรองยอดนิยมกลายเป็นหน้าจริงที่ Google เก็บได้ ไม่ใช่ตัวกรองที่หายไปกับหน้าจอ
import { useMemo, useState } from "react";
import Image from "next/image";

import { formatDateTH, formatTHB } from "@/lib/format";
import { LifecycleBadge, PowertrainDots } from "@/components/badges";

import { NAMEPLATES, TOTALS, type ProtoNameplate } from "../../_kit/data";
import { ProtoLink, shortTHB } from "./kit";

const BODY_CHIPS = ["ทั้งหมด", "กระบะ", "SUV", "PPV", "ซีดาน"] as const;
const PT_CHIPS = ["ทั้งหมด", "ดีเซล", "เบนซิน", "ไฮบริด", "ปลั๊กอินไฮบริด", "EV"] as const;
const BUDGETS = [
  { label: "ทุกงบ", cap: null },
  { label: "ไม่เกิน 8 แสน", cap: 800000 },
  { label: "ไม่เกิน 1.2 ล้าน", cap: 1200000 },
  { label: "ไม่เกิน 2 ล้าน", cap: 2000000 },
] as const;
const SORTS = [
  { key: "price", label: "ราคาต่ำ→สูง" },
  { key: "priceDesc", label: "ราคาสูง→ต่ำ" },
  { key: "variants", label: "รุ่นย่อยมากสุด" },
  { key: "name", label: "ชื่อ ก→ฮ" },
] as const;

/** ที่อยู่หน้าที่ตัวกรองชุดนี้ "ควรจะเป็น" — ทิศ A ตั้งใจให้ทุกชุดยอดนิยมมีหน้าเป็นของตัวเอง */
function pathFor(body: string, pt: string, cap: number | null) {
  const parts: string[] = [];
  if (body !== "ทั้งหมด") parts.push({ กระบะ: "pickup", SUV: "suv", PPV: "ppv", ซีดาน: "sedan" }[body] ?? "");
  if (pt !== "ทั้งหมด")
    parts.push({ ดีเซล: "diesel", เบนซิน: "petrol", ไฮบริด: "hybrid", ปลั๊กอินไฮบริด: "phev", EV: "ev" }[pt] ?? "");
  if (cap) parts.push(`ไม่เกิน-${Math.round(cap / 100000) / 10}ล้าน`);
  return parts.length ? `carmeta.co/รถ/${parts.join("-")}` : "carmeta.co";
}

export function FilterExplorer({ thin }: { thin: boolean }) {
  const [body, setBody] = useState<string>(thin ? "กระบะ" : "ทั้งหมด");
  const [pt, setPt] = useState<string>(thin ? "EV" : "ทั้งหมด");
  const [cap, setCap] = useState<number | null>(thin ? 800000 : null);
  const [sort, setSort] = useState<string>("price");

  const rows = useMemo(() => {
    const list = NAMEPLATES.filter((n) => {
      if (body !== "ทั้งหมด" && n.bodyLabel !== body) return false;
      if (pt !== "ทั้งหมด" && !n.powertrains.includes(pt)) return false;
      if (cap != null && (n.priceMin == null || n.priceMin > cap)) return false;
      return true;
    });
    const num = (a: number | null, b: number | null, asc: boolean) =>
      a == null ? 1 : b == null ? -1 : asc ? a - b : b - a;
    return [...list].sort((a, b) => {
      if (sort === "price") return num(a.priceMin, b.priceMin, true);
      if (sort === "priceDesc") return num(a.priceMin, b.priceMin, false);
      if (sort === "variants") return b.variantCount - a.variantCount;
      return `${a.brand} ${a.name}`.localeCompare(`${b.brand} ${b.name}`, "th");
    });
  }, [body, pt, cap, sort]);

  const variantTotal = rows.reduce((n, r) => n + r.variantCount, 0);
  const active = body !== "ทั้งหมด" || pt !== "ทั้งหมด" || cap != null;

  return (
    <>
      {/* แถบตัวกรองเหนียว — อยู่ใต้ navbar ตลอดเวลาที่เลื่อน */}
      <div className="sticky top-14 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto w-full max-w-[1240px] px-4 py-3 sm:px-6">
          {/* มือถือ: เลื่อนแนวนอนแถวเดียว (ตกบรรทัดแล้วแถบสูงเป็นกำแพงกินครึ่งจอ) · จอกว้าง: ตกบรรทัดปกติ */}
          <div className="-mx-1 flex items-center gap-x-4 gap-y-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
            <ChipRow label="ประเภท" options={[...BODY_CHIPS]} value={body} onChange={setBody} />
            <ChipRow label="ขุมพลัง" options={[...PT_CHIPS]} value={pt} onChange={setPt} />
            <div className="flex shrink-0 items-center gap-1.5">
              <span className="text-[11px] text-faint">งบ</span>
              {BUDGETS.map((b) => (
                <button
                  key={b.label}
                  type="button"
                  onClick={() => setCap(b.cap)}
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[13px] whitespace-nowrap transition-colors ${
                    cap === b.cap ? "bg-accent text-background" : "bg-surface-muted text-muted hover:text-foreground"
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
            <label className="flex shrink-0 items-center gap-2 text-[13px] whitespace-nowrap text-muted sm:ml-auto">
              เรียงตาม
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="cursor-pointer rounded-full bg-surface-muted px-3 py-1 text-[13px] outline-none"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-faint">
            <span className="rounded bg-surface-muted px-1.5 py-0.5 font-mono text-[11px] text-muted">
              {pathFor(body, pt, cap)}
            </span>
            <span aria-hidden>·</span>
            <span className="tnum">
              {rows.length} รุ่น · {variantTotal} รุ่นย่อย
            </span>
            <span aria-hidden>·</span>
            <span>ราคาป้ายทางการ · ตรวจล่าสุด {formatDateTH(TOTALS.latestChecked)}</span>
            {active && (
              <button
                type="button"
                onClick={() => {
                  setBody("ทั้งหมด");
                  setPt("ทั้งหมด");
                  setCap(null);
                }}
                className="text-accent hover:underline"
              >
                ล้างตัวกรอง
              </button>
            )}
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1240px] px-4 pb-16 sm:px-6">
        {rows.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-[15px] font-medium">ยังไม่มีรุ่นที่ตรงเงื่อนไขนี้ในฐานข้อมูล</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              เราเก็บข้อมูลลึกทีละแบรนด์ — ตอนนี้มี {TOTALS.nameplates} รุ่นจาก {TOTALS.brands} แบรนด์
              และยังไม่มีรุ่นที่เข้าเงื่อนไข “{body} · {pt}
              {cap ? ` · ไม่เกิน ${shortTHB(cap)}` : ""}”
            </p>
            <button
              type="button"
              onClick={() => {
                setBody("ทั้งหมด");
                setPt("ทั้งหมด");
                setCap(null);
              }}
              className="mt-4 rounded-full bg-accent px-4 py-2 text-sm text-background"
            >
              ดูรุ่นทั้งหมด
            </button>
          </div>
        ) : (
          <>
            {/* desktop: ตารางแน่น */}
            <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-border sm:block">
              <table className="w-full min-w-[900px] text-sm">
                <thead className="bg-surface-muted/60">
                  <tr className="border-b border-border text-left text-[12px] text-faint">
                    <th className="py-2.5 pr-2 pl-3 text-right font-medium">#</th>
                    <th className="px-3 py-2.5 font-medium">รุ่น</th>
                    <th className="px-3 py-2.5 text-right font-medium">ราคาเริ่มต้น</th>
                    <th className="px-3 py-2.5 text-right font-medium">ถึง</th>
                    <th className="px-3 py-2.5 font-medium">ประเภท</th>
                    <th className="px-3 py-2.5 font-medium">ขุมพลัง</th>
                    <th className="px-3 py-2.5 text-right font-medium">รุ่นย่อย</th>
                    <th className="px-3 py-2.5 text-right font-medium">ตรวจล่าสุด</th>
                    <th className="w-10 px-2 py-2.5" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((n, i) => (
                    <Row key={n.slug} n={n} i={i} thin={thin} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* mobile: การ์ดแถวแน่น (ตารางกว้างเกินจอ) */}
            <div className="mt-4 space-y-2 sm:hidden">
              {rows.map((n) => (
                <ProtoLink
                  key={n.slug}
                  dir="filter"
                  screen="model"
                  thin={thin}
                  className="flex items-center gap-3 rounded-xl border border-border bg-surface px-3 py-2.5 active:bg-accent-soft"
                >
                  <Thumb n={n} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-semibold">
                      {n.brand} {n.name}
                    </span>
                    <span className="mt-0.5 block truncate text-[12px] text-faint">
                      {n.segmentLabel} · {n.powertrains.join("/")} · {n.variantCount} รุ่นย่อย
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block font-semibold tnum">
                      {n.priceMin != null ? shortTHB(n.priceMin) : "—"}
                    </span>
                    <span className="block text-[11px] text-faint tnum">
                      ถึง {n.priceMax != null ? shortTHB(n.priceMax) : "—"}
                    </span>
                  </span>
                </ProtoLink>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

function ChipRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <span className="text-[11px] whitespace-nowrap text-faint">{label}</span>
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={`shrink-0 rounded-full px-2.5 py-1 text-[13px] whitespace-nowrap transition-colors ${
            value === o ? "bg-accent text-background" : "bg-surface-muted text-muted hover:text-foreground"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function Thumb({ n }: { n: ProtoNameplate }) {
  if (!n.image) {
    return (
      <span
        aria-hidden
        className="flex h-8 w-14 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-[10px] text-faint"
      >
        ไม่มีรูป
      </span>
    );
  }
  return (
    <Image
      src={n.image}
      alt=""
      width={56}
      height={32}
      className="h-8 w-14 shrink-0 rounded-lg bg-surface-muted object-contain"
    />
  );
}

function Row({ n, i, thin }: { n: ProtoNameplate; i: number; thin: boolean }) {
  return (
    <tr className={`group relative border-b border-border last:border-b-0 hover:bg-accent-soft ${i % 2 ? "bg-surface-muted/30" : ""}`}>
      <td className="py-2 pr-2 pl-3 text-right text-[13px] text-faint tnum">{i + 1}</td>
      <td className="px-3 py-2">
        <span className="flex items-center gap-3">
          <Thumb n={n} />
          <span className="min-w-0">
            <ProtoLink
              dir="filter"
              screen="model"
              thin={thin}
              className="block text-[15px] font-semibold after:absolute after:inset-0 group-hover:text-accent"
            >
              {n.name}
            </ProtoLink>
            <span className="text-[12px] text-faint">{n.brand}</span>
          </span>
          {n.lifecycle !== "CURRENT" && <LifecycleBadge status={n.lifecycle} />}
        </span>
      </td>
      <td className="px-3 py-2 text-right">
        <span className="text-base font-semibold tnum">
          {n.priceMin != null ? formatTHB(n.priceMin) : <span className="text-sm text-faint">ไม่มีข้อมูล</span>}
        </span>
      </td>
      <td className="px-3 py-2 text-right text-muted tnum">
        {n.priceMax != null ? formatTHB(n.priceMax) : "—"}
      </td>
      <td className="px-3 py-2 text-muted">{n.segmentLabel}</td>
      <td className="px-3 py-2 text-muted">
        <PowertrainDots labels={n.powertrains} />
      </td>
      <td className="px-3 py-2 text-right text-muted tnum">{n.variantCount}</td>
      <td className="px-3 py-2 text-right text-[13px] text-faint tnum">
        {formatDateTH(n.checkedDate)}
      </td>
      <td className="px-2 py-2 text-right text-faint group-hover:text-accent" aria-hidden>
        ›
      </td>
    </tr>
  );
}
