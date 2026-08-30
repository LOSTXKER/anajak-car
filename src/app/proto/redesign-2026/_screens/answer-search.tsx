"use client";

// ทิศ B — ช่องค้นหาที่ตอบทันทีขณะพิมพ์ ลึกถึง "รุ่นย่อย" ไม่ใช่แค่ชื่อรุ่น
// เหตุผล: คนที่มาเว็บฐานข้อมูลรถส่วนใหญ่มีคำถามในหัวอยู่แล้ว ("Travo ตัวท็อปเท่าไร")
// การให้พิมพ์แล้วเห็นคำตอบเลย = ตัดขั้นตอน "ไปหน้ารุ่น → เลื่อนหาตาราง → หาแถว"
import { useMemo, useState } from "react";

import { formatTHB } from "@/lib/format";
import { ptDotClass } from "@/components/badges";

import { HILUX_SKUS, NAMEPLATES } from "../../_kit/data";
import { protoHref } from "./kit";

type Hit =
  | { kind: "nameplate"; key: string; title: string; sub: string; price: string; screen: "model" }
  | { kind: "sku"; key: string; title: string; sub: string; price: string; screen: "sku" };

const NAMEPLATE_HITS: Hit[] = NAMEPLATES.map((n) => ({
  kind: "nameplate",
  key: n.slug,
  title: `${n.brand} ${n.name}`,
  sub: `${n.segmentLabel} · ${n.powertrains.join("/")} · ${n.variantCount} รุ่นย่อย`,
  price:
    n.priceMin != null && n.priceMax != null
      ? `${formatTHB(n.priceMin)} – ${formatTHB(n.priceMax)}`
      : "ไม่มีข้อมูล",
  screen: "model",
}));

// ชื่อในลิสต์ใช้ "ชื่อเกรด" ไม่ใช่ชื่อเต็ม — ชื่อเต็มขึ้นต้นเหมือนกันหมด พอจอแคบตัดท้ายแล้วแยกกันไม่ออก
const SKU_HITS: Hit[] = HILUX_SKUS.map((s) => ({
  kind: "sku",
  key: s.key,
  title: `${s.shortName} — Hilux Travo`,
  sub: `${s.group} · ${s.powertrainText} · ${s.transmission} · ${s.drivetrain}`,
  price: s.price != null ? formatTHB(s.price) : "ไม่มีข้อมูล",
  screen: "sku",
}));

const ALL_HITS = [...NAMEPLATE_HITS, ...SKU_HITS];

export function AnswerSearch({ thin }: { thin: boolean }) {
  const [q, setQ] = useState(thin ? "รถตู้" : "travo overland");

  const hits = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    const words = term.split(/\s+/);
    return ALL_HITS.filter((h) =>
      words.every((w) => `${h.title} ${h.sub}`.toLowerCase().includes(w)),
    ).slice(0, 8);
  }, [q]);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <label className="relative block">
        <span className="sr-only">พิมพ์คำถามหรือชื่อรุ่น</span>
        <span aria-hidden className="pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 text-lg text-faint">
          ⌕
        </span>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="พิมพ์ชื่อรุ่น เกรด หรือคำถาม เช่น “travo overland”"
          className="w-full rounded-2xl border border-border-strong bg-surface py-4 pr-5 pl-12 text-[16px] shadow-[0_10px_30px_-16px_rgba(20,30,60,0.28)] outline-none placeholder:text-faint focus:border-accent focus:shadow-[0_0_0_4px_var(--accent-soft)]"
        />
      </label>

      {q.trim() !== "" && (
        <div className="mt-2 overflow-hidden rounded-2xl border border-border bg-surface text-left shadow-sm">
          <p className="border-b border-border bg-surface-muted/60 px-4 py-2 text-[12px] text-faint">
            {hits.length > 0 ? (
              <>
                เจอ <span className="tnum">{hits.length}</span> รายการที่ตรง “{q}” — กดเพื่อดูคำตอบเต็ม
              </>
            ) : (
              <>ไม่เจอ “{q}” ในฐานข้อมูล</>
            )}
          </p>
          {hits.length === 0 ? (
            <div className="px-4 py-6 text-sm">
              <p className="font-medium">ยังไม่มีข้อมูลที่ตรงคำนี้</p>
              <p className="mt-1 text-muted">
                ตอนนี้ฐานข้อมูลมี {NAMEPLATES.length} รุ่นจาก 3 แบรนด์ (Toyota · Tesla · Mercedes-Benz)
                — เราเก็บลึกทีละแบรนด์ ไม่ใส่รุ่นที่ยังไม่มีหลักฐานราคา
              </p>
            </div>
          ) : (
            <ul className="max-h-[320px] overflow-y-auto">
              {hits.map((h) => (
                <li key={`${h.kind}-${h.key}`}>
                  <a
                    href={protoHref("answer", h.screen, thin)}
                    className="flex items-center gap-3 border-b border-border px-4 py-2.5 last:border-b-0 hover:bg-accent-soft"
                  >
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                        h.kind === "sku" ? "bg-accent-soft text-accent" : "bg-surface-muted text-muted"
                      }`}
                    >
                      {h.kind === "sku" ? "รุ่นย่อย" : "รุ่น"}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{h.title}</span>
                      <span className="block truncate text-[12px] text-faint">
                        <span
                          aria-hidden
                          className={`mr-1.5 inline-block size-1.5 rounded-full ${ptDotClass(h.sub)}`}
                        />
                        {h.sub}
                      </span>
                    </span>
                    <span className="shrink-0 text-right text-[13px] font-semibold tnum">{h.price}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
