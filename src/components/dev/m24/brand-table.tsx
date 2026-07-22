import Link from "next/link";
import type { BrandDetail } from "@/lib/queries";
import { BODY_TYPE_LABEL } from "@/lib/labels";
import { formatDateTH, formatPriceRange } from "@/lib/format";
import { BrandMark } from "@/components/brand-shortcuts";
import { DataStatusValue, LifecycleDot, PowertrainDots } from "@/components/badges";
import { StatTile } from "@/components/dev/m24/primitives";

// ── MOCKUP (M24) — Brand Hub ทิศ "Table-forward" (KPI tiles + ตารางไลน์อัปแน่น · แนว tracker) ──
export function BrandTable({ detail }: { detail: BrandDetail }) {
  const operationYear = detail.operationFrom ? new Date(detail.operationFrom).getUTCFullYear() : null;
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
      <nav aria-label="breadcrumb" className="pt-6 text-sm text-faint">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-foreground">ฐานข้อมูลรถ</Link></li>
          <li aria-hidden>›</li>
          <li aria-current="page" className="font-medium text-foreground">{detail.name}</li>
        </ol>
      </nav>

      <header className="grid gap-6 pt-6 pb-6 lg:grid-cols-[1fr_auto]">
        <div className="flex items-center gap-4">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-surface-muted p-2.5">
            <BrandMark name={detail.name} size={40} />
          </span>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{detail.name}</h1>
            {detail.officialName && <p className="mt-0.5 text-sm text-muted">{detail.officialName}</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:w-[560px]">
          <StatTile label="รุ่น" value={<span className="tnum">{detail.stats.nameplates}</span>} />
          <StatTile label="รุ่นย่อย" value={<span className="tnum">{detail.stats.variants}</span>} />
          <StatTile label="ตั้งแต่" value={<span className="tnum"><DataStatusValue value={operationYear} /></span>} />
          <StatTile label="ตรวจล่าสุด" value={<span className="tnum text-sm">{formatDateTH(detail.stats.latestChecked) ?? "—"}</span>} />
        </div>
      </header>

      <section aria-labelledby="lineup" className="border-t border-border pt-6">
        <div className="flex items-baseline justify-between gap-3">
          <h2 id="lineup" className="text-xl font-semibold tracking-tight">ไลน์อัปใน coverage</h2>
          <span className="text-sm text-faint tnum">ช่วงราคา {formatPriceRange(detail.stats.priceMin, detail.stats.priceMax)}</span>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[13px] text-faint">
                <th className="py-2 pr-3 font-medium">รุ่น</th>
                <th className="px-3 py-2 font-medium">ประเภท</th>
                <th className="px-3 py-2 font-medium">ขุมพลัง</th>
                <th className="px-3 py-2 text-right font-medium">ราคาป้าย</th>
                <th className="px-3 py-2 text-right font-medium">รุ่นย่อย</th>
              </tr>
            </thead>
            <tbody>
              {detail.rows.map((r) => (
                <tr key={r.slug} className="border-b border-border last:border-b-0 hover:bg-surface-muted/50">
                  <td className="py-2.5 pr-3">
                    <Link href={`/cars/${r.slug}`} className="inline-flex items-center gap-2 font-medium hover:text-accent">
                      <LifecycleDot status={r.lifecycleStatus} />{r.name}
                    </Link>
                  </td>
                  <td className="px-3 py-2.5 text-muted">{r.bodyTypes.map((b) => BODY_TYPE_LABEL[b] ?? b).join(", ")}</td>
                  <td className="px-3 py-2.5"><PowertrainDots labels={r.powertrainLabels} /></td>
                  <td className="px-3 py-2.5 text-right"><span className="font-semibold tnum"><DataStatusValue value={formatPriceRange(r.priceMin, r.priceMax)} /></span></td>
                  <td className="px-3 py-2.5 text-right tnum text-muted">{r.variantCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-dashed border-border bg-surface-muted/40 px-5 py-4 text-sm text-muted">
        ↓ ตารางค้นหา/กรองเต็ม (CarDatabaseExplorer) ตัวเดิมต่อจากนี้ — คงไว้ไม่แตะ
      </section>
    </div>
  );
}
