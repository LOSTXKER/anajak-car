"use client";

import { useState } from "react";
import Link from "next/link";
import type { NameplateDetail, NameplateTree } from "@/lib/queries";
import { BODY_TYPE_LABEL, CHANGE_TYPE_LABEL, CHASSIS_TYPE_LABEL, DRIVETRAIN_LABEL } from "@/lib/labels";
import { formatDateTH, formatPriceRange, formatTHB } from "@/lib/format";
import {
  Chip,
  DataStatusValue,
  EvidenceLink,
  PendingBlock,
  SpecRow,
  ptDotClass,
} from "@/components/badges";

// ── หน้ารุ่น (nameplate) แบบ TAB — ระดับ nameplate เท่านั้น (M25e: สเปก/ADAS ย้ายไปหน้า SKU /cars/[slug]/[sku]) ──
type TabKey = "overview" | "compare" | "timeline";

function TabIcon({ k, className }: { k: TabKey; className?: string }) {
  const c = className ?? "size-[18px]";
  const p = { viewBox: "0 0 24 24", className: c, fill: "none" as const, stroke: "currentColor", strokeWidth: "1.7", strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  if (k === "overview") return <svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" /></svg>;
  if (k === "compare") return <svg {...p}><path d="M4 19.5h4.5v-4h4.5v-4h4.5v-4H22" /></svg>;
  return <svg {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3.2 1.8" /></svg>;
}

export function NameplateTabs({ detail, tree }: { detail: NameplateDetail; tree: NameplateTree }) {
  const gen = tree.generations[0] ?? null;

  const hasTimeline = detail.changeEvents.length > 0;

  const TABS: { key: TabKey; label: string }[] = [
    { key: "overview", label: "ภาพรวม" },
    { key: "compare", label: "เทียบรุ่นย่อย" },
    { key: "timeline", label: "ไทม์ไลน์" },
  ];
  const [tab, setTab] = useState<TabKey>("overview");

  return (
    <div className="mt-10">
      {/* tab bar */}
      <div role="tablist" aria-label="ข้อมูลรุ่น" className="flex gap-1 overflow-x-auto border-b border-border">
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.key)}
              className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm transition-colors ${
                active ? "border-accent font-medium text-accent" : "border-transparent text-muted hover:text-foreground"
              }`}
            >
              <TabIcon k={t.key} />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="pt-8">
        {/* ── ภาพรวม ── */}
        {tab === "overview" && (
          <div className="space-y-8">
            {detail.summary && <p className="max-w-2xl text-[15px] leading-7 text-muted">{detail.summary}</p>}
            {gen && (
              <section>
                <h2 className="text-lg font-semibold tracking-tight">โครงสร้างรุ่น</h2>
                <dl className="mt-3 max-w-2xl">
                  <SpecRow label="เจเนอเรชัน">{gen.launchYear ? `เปิดตัว ${gen.launchYear}` : "—"}{gen.code ? ` · ${gen.code}` : ""}</SpecRow>
                  <SpecRow label="แพลตฟอร์ม"><DataStatusValue value={gen.platformName} /></SpecRow>
                  <SpecRow label="โครงสร้างตัวถัง"><DataStatusValue value={gen.chassisType ? CHASSIS_TYPE_LABEL[gen.chassisType] : null} /></SpecRow>
                  <SpecRow label="ตัวถัง / รุ่นย่อย"><span className="tnum">{gen.derivatives.length} ตัวถัง · {gen.variantCount} รุ่นย่อย</span></SpecRow>
                </dl>
                <div className="mt-4 flex flex-wrap gap-2">
                  {gen.derivatives.map((d) => (
                    <button key={d.key} onClick={() => setTab("compare")} className="rounded-full border border-border px-3.5 py-1.5 text-sm text-muted transition-colors hover:border-accent hover:text-foreground">
                      {d.name || (BODY_TYPE_LABEL[d.bodyType] ?? d.bodyType)}
                    </button>
                  ))}
                </div>
              </section>
            )}
            {gen?.summary && <p className="max-w-2xl border-t border-border pt-6 text-sm leading-6 text-faint">{gen.summary}</p>}
          </div>
        )}

        {/* ── เทียบรุ่นย่อย (ตารางราคาข้าม SKU — สเปกเต็มรายคันอยู่ในหน้า SKU) ── */}
        {tab === "compare" && gen && (
          <div className="space-y-8">
            {gen.derivatives.map((d) => (
              <section key={d.key}>
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-[15px] font-semibold">{d.name || (BODY_TYPE_LABEL[d.bodyType] ?? d.bodyType)}</h3>
                  <span className="text-sm text-faint tnum">{formatPriceRange(d.priceMin, d.priceMax)}</span>
                </div>
                <div className="mt-2 overflow-x-auto">
                  <table className="w-full min-w-[640px] text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-[13px] text-faint">
                        <th className="py-2 pr-3 font-medium">รุ่นย่อย</th>
                        <th className="px-3 py-2 font-medium">ขุมพลัง</th>
                        <th className="px-3 py-2 font-medium">กำลัง</th>
                        <th className="px-3 py-2 font-medium">เกียร์ · ขับ</th>
                        <th className="px-3 py-2 text-right font-medium">ราคาป้าย</th>
                      </tr>
                    </thead>
                    <tbody>
                      {d.trims.flatMap((t) => t.variants).map((v) => (
                        <tr key={v.id} className="border-b border-border last:border-b-0">
                          <td className="py-2.5 pr-3 font-medium">
                            <Link href={`/cars/${tree.slug}/${v.skuKey}`} className="hover:text-accent hover:underline">{v.name}</Link>
                          </td>
                          <td className="px-3 py-2.5"><span className="inline-flex items-center gap-1.5"><span aria-hidden className={`inline-block size-2 rounded-full ${ptDotClass(v.powertrainText)}`} />{v.powertrainText}</span></td>
                          <td className="px-3 py-2.5 tnum text-muted">{v.powerText ?? "—"}</td>
                          <td className="px-3 py-2.5 text-muted">{[v.transmissionText, v.drivetrain ? (DRIVETRAIN_LABEL[v.drivetrain] ?? v.drivetrain) : null].filter(Boolean).join(" · ") || "—"}</td>
                          <td className="px-3 py-2.5 text-right">{v.price != null ? <span className="font-semibold tnum">{formatTHB(v.price)}</span> : <span className="text-faint">ไม่มีข้อมูล</span>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}
            <p className="text-[13px] text-faint">ราคาป้ายทางการ ไม่ใช่ราคาซื้อขายจริง · กดชื่อรุ่นย่อยเพื่อดูสเปกเต็มและหลักฐานราคา</p>
          </div>
        )}

        {/* ── ไทม์ไลน์ ── */}
        {tab === "timeline" && (
          hasTimeline ? (
            <ol className="max-w-3xl border-l border-border">
              {detail.changeEvents.map((e) => (
                <li key={e.id} className="relative pb-8 pl-6 last:pb-0">
                  <span aria-hidden className="absolute top-1.5 -left-[5px] size-2.5 rounded-full bg-accent ring-4 ring-background" />
                  <div className="flex flex-wrap items-center gap-2"><span className="tnum text-xs text-faint">{formatDateTH(e.effectiveDate) ?? "ไม่ระบุวันที่"}</span><Chip>{CHANGE_TYPE_LABEL[e.changeType] ?? e.changeType}</Chip></div>
                  <p className="mt-1.5 font-medium">{e.title}</p>
                  {e.summary && <p className="mt-1 text-sm text-muted">{e.summary}</p>}
                  {(e.beforeValue || e.afterValue) && <p className="mt-1 text-sm text-muted tnum">{e.beforeValue ?? "—"} → {e.afterValue ?? "—"}</p>}
                  {e.evidence && <div className="mt-2"><EvidenceLink evidence={e.evidence} /></div>}
                </li>
              ))}
            </ol>
          ) : (
            <div className="max-w-xl"><PendingBlock title="ยังไม่มีบันทึกการเปลี่ยนแปลง" reason="จะเพิ่มเมื่อมีเหตุการณ์ที่มีหลักฐาน (เปิดตัว/ปรับราคา/เฟซลิฟต์/เรียกคืน)" /></div>
          )
        )}
      </div>

      {/* sources — ท้ายหน้า ทุกแท็บ */}
      <section aria-labelledby="sources-heading" className="mt-12 border-t border-border pt-8">
        <h2 id="sources-heading" className="scroll-mt-20 text-lg font-semibold tracking-tight">แหล่งอ้างอิง</h2>
        <p className="mt-1.5 text-sm text-faint">{detail.sources.length} แหล่ง — หลักฐานราคาและข้อมูลในหน้านี้</p>
        <ul className="mt-3 max-w-3xl divide-y divide-border">
          {detail.sources.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center gap-2 py-3 text-sm">
              <span className="font-medium">{s.publisher ?? "ไม่ระบุผู้เผยแพร่"}</span>
              {s.title && <span className="text-muted">{s.url ? <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent hover:underline">{s.title} ↗</a> : s.title}</span>}
              {s.checkedDate && <span className="ml-auto text-xs text-faint tnum">ตรวจ {formatDateTH(s.checkedDate)}</span>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
