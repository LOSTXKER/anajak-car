import Image from "next/image";
import Link from "next/link";
import type { BrandDetail } from "@/lib/queries";
import { formatDateTH, formatPriceRange } from "@/lib/format";
import { nameplateImage } from "@/lib/images";
import { BrandMark } from "@/components/brand-shortcuts";
import { DataStatusValue, LifecycleBadge, PowertrainDots } from "@/components/badges";
import { StatTile } from "@/components/dev/m24/primitives";

// ── MOCKUP (M24) — Brand Hub ทิศ "Cards" (KPI row + การ์ดรุ่น · ตารางค้นหาคงเดิมด้านล่าง) ──
export function BrandCards({ detail }: { detail: BrandDetail }) {
  const operationYear = detail.operationFrom ? new Date(detail.operationFrom).getUTCFullYear() : null;
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
      <nav aria-label="breadcrumb" className="pt-8 text-sm text-faint">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-foreground">ฐานข้อมูลรถ</Link></li>
          <li aria-hidden>›</li>
          <li aria-current="page" className="font-medium text-foreground">{detail.name}</li>
        </ol>
      </nav>

      <header className="pt-6 pb-8">
        <div className="flex items-center gap-4">
          <span className="flex size-16 items-center justify-center rounded-2xl bg-surface-muted p-3">
            <BrandMark name={detail.name} size={44} />
          </span>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{detail.name}</h1>
            {detail.officialName && <p className="mt-1 text-sm text-muted">{detail.officialName}</p>}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          <StatTile label="รุ่นใน coverage" value={<span className="tnum">{detail.stats.nameplates}</span>} />
          <StatTile label="รุ่นย่อย" value={<span className="tnum">{detail.stats.variants}</span>} />
          <StatTile label="ช่วงราคาป้าย" value={<span className="tnum text-sm">{formatPriceRange(detail.stats.priceMin, detail.stats.priceMax) ?? "—"}</span>} />
          <StatTile label="ดำเนินงานตั้งแต่" value={<span className="tnum"><DataStatusValue value={operationYear} /></span>} sub={detail.distributorName ?? undefined} />
          <StatTile label="ตรวจสอบล่าสุด" value={<span className="tnum text-sm">{formatDateTH(detail.stats.latestChecked) ?? "—"}</span>} />
        </div>
      </header>

      <section aria-labelledby="lineup" className="border-t border-border pt-8">
        <h2 id="lineup" className="text-xl font-semibold tracking-tight">ไลน์อัปใน coverage</h2>
        <p className="mt-1 text-sm text-faint">เฉพาะรุ่นที่มีข้อมูลตรวจสอบแล้ว — กดเข้าดูราคาและรุ่นย่อย</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {detail.rows.map((r) => {
            const img = nameplateImage(r.slug);
            return (
              <Link key={r.slug} href={`/cars/${r.slug}`} className="group rounded-2xl border border-border bg-surface p-4 transition-all hover:border-accent hover:shadow-sm">
                <div className="flex h-24 items-center justify-center rounded-xl bg-surface-muted/50">
                  {img ? <Image src={img.src} alt={img.alt} width={160} height={90} className="h-auto w-auto max-h-[84px] object-contain" /> : <span className="text-faint">—</span>}
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="font-semibold">{r.name}</span>
                  <LifecycleBadge status={r.lifecycleStatus} />
                </div>
                <div className="mt-1.5 text-lg font-semibold tnum">
                  <DataStatusValue value={formatPriceRange(r.priceMin, r.priceMax)} />
                </div>
                <div className="mt-2 flex items-center justify-between gap-2 text-xs text-faint">
                  <PowertrainDots labels={r.powertrainLabels} />
                  <span className="tnum shrink-0">{r.variantCount} รุ่นย่อย</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-dashed border-border bg-surface-muted/40 px-5 py-4 text-sm text-muted">
        ↓ ด้านล่างนี้คือ <span className="font-medium text-foreground">ตารางค้นหา/กรอง (CarDatabaseExplorer)</span> ตัวเดิม — คงไว้ไม่แตะ (สัญญา filter URL เดิม)
      </section>
    </div>
  );
}
