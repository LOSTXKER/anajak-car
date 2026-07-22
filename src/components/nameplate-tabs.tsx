"use client";

import { useState } from "react";
import type { NameplateDetail, NameplateTree, TreeVariant } from "@/lib/queries";
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

// ── หน้ารุ่น (nameplate) แบบ TAB (ยุบ เจน/ตัวถัง/รุ่นย่อย/ไทม์ไลน์ เข้าแท็บเดียว · แบบ prydwen) ──
type TabKey = "overview" | "prices" | "specs" | "adas" | "timeline";

function TabIcon({ k, className }: { k: TabKey; className?: string }) {
  const c = className ?? "size-[18px]";
  const p = { viewBox: "0 0 24 24", className: c, fill: "none" as const, stroke: "currentColor", strokeWidth: "1.7", strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  if (k === "overview") return <svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" /></svg>;
  if (k === "prices") return <svg {...p}><path d="M4 19.5h4.5v-4h4.5v-4h4.5v-4H22" /></svg>;
  if (k === "specs") return <svg {...p}><path d="M4 6h16M4 12h16M4 18h10" /></svg>;
  if (k === "adas") return <svg {...p}><path d="M12 3l7 3v6c0 4-3 6.5-7 9-4-2.5-7-5-7-9V6z" /></svg>;
  return <svg {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3.2 1.8" /></svg>;
}

const bevSpecs = (variants: TreeVariant[]): [string, string][] | null => {
  const bev = variants.filter((v) => v.powertrainType === "BEV" || v.motorKw != null);
  if (bev.length === 0) return null;
  const uniq = (xs: (string | null)[]) => [...new Set(xs.filter((x): x is string => !!x))];
  const rows: [string, string][] = [];
  const motors = uniq(bev.map((v) => (v.motorKw != null ? `${v.motorKw} kW` : null)));
  const batts = uniq(bev.map((v) => (v.batteryKwh != null ? `${v.batteryKwh} kWh` : null)));
  const ranges = uniq(bev.map((v) => (v.rangeKm != null ? `${v.rangeKm} กม.${v.rangeStandard ? ` (${v.rangeStandard})` : ""}` : null)));
  const charge = [...uniq(bev.map((v) => (v.acKw != null ? `AC ${v.acKw} kW` : null))), ...uniq(bev.map((v) => (v.dcKw != null ? `DC ${v.dcKw} kW` : null)))].join(" · ");
  if (motors.length) rows.push(["กำลังมอเตอร์", motors.join(" · ")]);
  if (batts.length) rows.push(["ความจุแบตเตอรี่", batts.join(" · ")]);
  if (ranges.length) rows.push(["ระยะทางต่อชาร์จ", ranges.join(" · ")]);
  if (charge) rows.push(["การชาร์จ", charge]);
  return rows.length ? rows : null;
};

export function NameplateTabs({ detail, tree }: { detail: NameplateDetail; tree: NameplateTree }) {
  const gen = tree.generations[0] ?? null;
  const allVariants = gen ? gen.derivatives.flatMap((d) => d.trims.flatMap((t) => t.variants)) : [];
  const bev = bevSpecs(allVariants);

  const hasTimeline = detail.changeEvents.length > 0;
  const hasAdas = Boolean(detail.adas && detail.adas.trims.length > 0);

  const TABS: { key: TabKey; label: string }[] = [
    { key: "overview", label: "ภาพรวม" },
    { key: "prices", label: "ราคา · รุ่นย่อย" },
    { key: "specs", label: "สเปก" },
    { key: "adas", label: "ระบบช่วยขับขี่" },
    { key: "timeline", label: "ไทม์ไลน์" },
  ];
  const [tab, setTab] = useState<TabKey>("overview");

  return (
    <div className="mt-8">
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
                    <button key={d.key} onClick={() => setTab("prices")} className="rounded-full border border-border px-3.5 py-1.5 text-sm text-muted transition-colors hover:border-accent hover:text-foreground">
                      {d.name || (BODY_TYPE_LABEL[d.bodyType] ?? d.bodyType)}
                    </button>
                  ))}
                </div>
              </section>
            )}
            {gen?.summary && <p className="max-w-2xl border-t border-border pt-6 text-sm leading-6 text-faint">{gen.summary}</p>}
          </div>
        )}

        {/* ── ราคา · รุ่นย่อย ── */}
        {tab === "prices" && gen && (
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
                          <td className="py-2.5 pr-3 font-medium">{v.name}</td>
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
            <p className="text-[13px] text-faint">ราคาป้ายทางการ ไม่ใช่ราคาซื้อขายจริง · แหล่งอ้างอิงต่อรุ่นอยู่ในแท็บสเปก/ท้ายหน้า</p>
          </div>
        )}

        {/* ── สเปก ── */}
        {tab === "specs" && (
          <div className="space-y-8">
            {bev && (
              <section>
                <h2 className="text-lg font-semibold tracking-tight">ขุมพลังไฟฟ้า</h2>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {bev.map(([k, v]) => (
                    <div key={k} className="rounded-xl border border-border bg-surface-muted px-3 py-2.5">
                      <div className="text-[11px] text-faint">{k}</div>
                      <div className="mt-0.5 text-sm font-semibold text-foreground tnum">{v}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {gen && (
              <section>
                <h2 className="text-lg font-semibold tracking-tight">สเปกรุ่นย่อย</h2>
                <div className="mt-3 space-y-4">
                  {gen.derivatives.flatMap((d) => d.trims.flatMap((t) => t.variants)).map((v) => (
                    <div key={v.id} className="rounded-2xl border border-border p-4">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="font-semibold">{v.name}</span>
                        <span className="text-lg font-semibold tnum">{v.price != null ? formatTHB(v.price) : <span className="text-sm text-faint">ไม่มีข้อมูล</span>}</span>
                      </div>
                      <dl className="mt-3 max-w-2xl">
                        <SpecRow label="ขุมพลัง">{v.powertrainText}</SpecRow>
                        {v.engineText && <SpecRow label="เครื่องยนต์"><span className="text-[13px]">{v.engineText}</span></SpecRow>}
                        {v.powerText && <SpecRow label="กำลัง"><span className="tnum">{v.powerText}</span></SpecRow>}
                        <SpecRow label="เกียร์"><DataStatusValue value={v.transmissionText} /></SpecRow>
                        <SpecRow label="ระบบขับเคลื่อน"><DataStatusValue value={v.drivetrain ? (DRIVETRAIN_LABEL[v.drivetrain] ?? v.drivetrain) : null} /></SpecRow>
                        <SpecRow label="ที่นั่ง"><span className="tnum"><DataStatusValue value={v.seatCount} /></span></SpecRow>
                        <SpecRow label="รหัสเกรด"><span className="tnum text-xs"><DataStatusValue value={v.gradeCode} /></span></SpecRow>
                      </dl>
                      {v.evidence && <div className="mt-2 flex items-center gap-2 text-xs text-faint"><span>ที่มาราคา:</span> <EvidenceLink evidence={v.evidence} />{v.priceAsOf && <span className="tnum">· ณ {formatDateTH(v.priceAsOf)}</span>}</div>}
                    </div>
                  ))}
                </div>
              </section>
            )}
            <div className="max-w-xl"><PendingBlock title="รอข้อมูลมิติตัวถังและน้ำหนัก" reason="ยาว × กว้าง × สูง · ระยะฐานล้อ · น้ำหนัก — จะเพิ่มพร้อมแหล่งอ้างอิง" /></div>
          </div>
        )}

        {/* ── ADAS ── */}
        {tab === "adas" && (
          hasAdas ? (() => {
            const { features, trims } = detail.adas!;
            const uniform = features.every((f) => new Set(trims.map((t) => String(t.values.find((v) => v.key === f.key)?.has))).size === 1);
            const statusText = (has: boolean | null) => (has === true ? "มี" : has === false ? "ไม่มี" : "ยังไม่ยืนยัน");
            const statusClass = (has: boolean | null) => (has === true ? "text-success font-medium" : has === false ? "text-faint" : "text-faint italic");
            return (
              <div>
                {uniform ? (
                  <ul className="max-w-3xl space-y-2">
                    {features.map((f) => {
                      const v = trims[0].values.find((x) => x.key === f.key)!;
                      return <li key={f.key} className="flex items-baseline gap-3 text-[15px]"><span className={statusClass(v.has)}>{statusText(v.has)}</span><span title={f.definition ?? undefined}>{f.nameTh} <span className="text-faint">({f.key})</span></span></li>;
                    })}
                    <li className="pt-1 text-[13px] text-faint">ทุกรุ่นย่อยเหมือนกันทั้งรุ่น</li>
                  </ul>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full max-w-3xl text-sm">
                      <thead><tr className="border-b border-border text-left text-[13px] text-faint"><th className="py-2 pr-3 font-medium">รุ่นย่อย/เกรด</th>{features.map((f) => <th key={f.key} className="px-3 py-2 font-medium" title={f.definition ?? undefined}>{f.nameTh} <span className="font-normal">({f.key})</span></th>)}</tr></thead>
                      <tbody>{trims.map((t) => <tr key={t.label} className="border-b border-border last:border-b-0"><td className="py-2.5 pr-3 font-medium">{t.label}</td>{t.values.map((v) => <td key={v.key} className="px-3 py-2.5" title={v.marketing ?? undefined}><span className={statusClass(v.has)}>{statusText(v.has)}</span></td>)}</tr>)}</tbody>
                    </table>
                  </div>
                )}
                <p className="mt-3 text-[13px] text-faint">ตามตารางสเปกทางการต่อรุ่นย่อย — ค่าที่สเปกไม่ระบุ = &ldquo;ยังไม่ยืนยัน&rdquo; (ไม่ใช่ &ldquo;ไม่มี&rdquo;)</p>
              </div>
            );
          })() : (
            <div className="max-w-xl"><PendingBlock title="ยังไม่มีข้อมูลระบบช่วยขับขี่ที่ยืนยัน" reason="สเปกทางการของรุ่นนี้ยังไม่ระบุ AEB/ACC/LKA ต่อรุ่นย่อย" /></div>
          )
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
