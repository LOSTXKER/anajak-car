import Link from "next/link";
import type { NameplateRow } from "@/lib/queries";
import { formatDateTH, formatPriceRange, formatTHB } from "@/lib/format";
import { PowertrainDots } from "@/components/badges";

// ── MOCKUP (M24) — Tierlist ทิศ "Data-driven" (จัดในกลุ่มเดียวกันตามเกณฑ์เดียว · ไม่ใช่ "ดีที่สุด") ──
// guardrail labels ครบ: cohort · criterion · not-best-car · data-type tag · sample honesty · evidence
export function TierlistData({ rows, checked }: { rows: NameplateRow[]; checked: string | null }) {
  const ranked = [...rows].sort((a, b) => (a.priceMin ?? Infinity) - (b.priceMin ?? Infinity));

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-20 sm:px-6 pt-8">
      <p className="text-xs font-semibold tracking-wider text-accent uppercase">จัดอันดับ · CARMETA Calculation</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        จัดตามราคาป้ายทางการ — กลุ่มกระบะ
      </h1>
      <p className="mt-1 text-sm text-muted tnum">Toyota · {rows.length} รุ่นในกลุ่มนี้ · ณ {formatDateTH(checked) ?? "—"}</p>

      {/* guardrail banners */}
      <div className="mt-5 space-y-2 rounded-2xl border border-border bg-surface-muted/50 p-4 text-[13px] leading-6">
        <p><span className="font-semibold text-foreground">จัดในกลุ่มเดียว:</span> เฉพาะรถกระบะ (PICKUP) เท่านั้น — ไม่เทียบข้ามกลุ่ม (กระบะ ≠ SUV ≠ EV)</p>
        <p><span className="font-semibold text-foreground">เกณฑ์เดียวที่เลือก:</span> ราคาป้ายทางการ (ต่ำ → สูง)</p>
        <p className="text-muted">นี่คือการ <span className="font-medium">เรียงตามเกณฑ์ที่เลือก ไม่ใช่การชี้ว่ารถคันไหน &ldquo;ดีที่สุด&rdquo;</span> — รถคนละการใช้งานเทียบด้วยคะแนนเดียวไม่ได้</p>
      </div>

      {/* criterion selector (mockup: visual) */}
      <div className="mt-6 flex flex-wrap gap-2">
        <span className="rounded-full bg-accent px-3.5 py-1.5 text-sm font-medium text-white">ราคาป้าย ↑</span>
        <span className="rounded-full border border-border px-3.5 py-1.5 text-sm text-muted">ความครบ ADAS</span>
        <span className="rounded-full border border-border px-3.5 py-1.5 text-sm text-muted">ระบบขับเคลื่อน</span>
        <span className="ml-1 self-center text-xs text-faint">← เลือกเกณฑ์ (สลับได้)</span>
      </div>

      {/* ranked list */}
      <ol className="mt-5 space-y-2">
        {ranked.map((r, i) => (
          <li key={r.slug}>
            <Link href={`/cars/${r.slug}`} className="flex items-center gap-4 rounded-2xl border border-border bg-surface px-4 py-3.5 transition-colors hover:border-accent">
              <span className="tnum w-6 shrink-0 text-center text-lg font-semibold text-faint">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <div className="font-semibold">{r.name}</div>
                <div className="mt-1 flex items-center gap-2 text-xs text-faint">
                  <PowertrainDots labels={r.powertrainLabels} />
                  <span className="tnum">· {r.variantCount} รุ่นย่อย</span>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-lg font-semibold tnum">{formatPriceRange(r.priceMin, r.priceMax) ?? "—"}</div>
                <div className="mt-0.5 text-[11px] text-faint">
                  {r.priceMin != null ? `เริ่ม ${formatTHB(r.priceMin)}` : "ยังไม่มีราคายืนยัน"} · หลักฐาน {r.sourceCount} · ข้อมูล ณ {formatDateTH(r.latestChecked) ?? "—"}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ol>

      <p className="mt-6 text-xs text-faint">
        CARMETA Calculation — คำนวณจากราคาป้ายที่ยืนยันแล้ว · แต่ละแถวคลิกดูแหล่งอ้างอิงเต็มในหน้ารุ่น · อันดับนี้ไม่ได้ถูกซื้อด้วยค่าโฆษณาหรือสปอนเซอร์
      </p>
    </div>
  );
}
