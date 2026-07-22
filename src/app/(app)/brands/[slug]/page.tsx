import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrandDetail, getBrandTimeline } from "@/lib/queries";
import { formatDateTH, formatPriceRange } from "@/lib/format";
import { DataStatusValue, StatTile } from "@/components/badges";
import { BrandMark } from "@/components/brand-shortcuts";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getBrandDetail(slug);
  if (!detail) notFound();
  return {
    title: `${detail.name} — ภาพรวมแบรนด์และรุ่นใน coverage`,
    description: `ประวัติแบรนด์ ${detail.name} ในไทย รุ่นรถใน coverage ราคาป้ายและแหล่งอ้างอิงที่ตรวจสอบได้`,
  };
}

export default async function BrandOverviewPage({ params }: Props) {
  const { slug } = await params;
  const [detail, timeline] = await Promise.all([getBrandDetail(slug), getBrandTimeline(slug)]);
  if (!detail) notFound();
  const operationYear = detail.operationFrom ? new Date(detail.operationFrom).getUTCFullYear() : null;

  const entries = [
    { href: `/brands/${slug}/models`, title: "รุ่นรถ", sub: `${detail.stats.nameplates} รุ่น · ${detail.stats.variants} รุ่นย่อย` },
    { href: `/brands/${slug}/timeline`, title: "ไทม์ไลน์และประวัติ", sub: `${timeline.length} เหตุการณ์` },
    { href: `/brands/${slug}/sources`, title: "แหล่งอ้างอิง", sub: `${detail.sources.length} แหล่ง` },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-20 sm:px-6">
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

      {(detail.channel || detail.parentCompany) && (
        <section className="border-t border-border pt-6">
          <h2 className="text-lg font-semibold tracking-tight">เกี่ยวกับแบรนด์ในไทย</h2>
          <dl className="mt-3 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            <div><dt className="text-xs text-faint">ผู้ผลิต/จัดจำหน่าย</dt><dd className="mt-0.5 text-sm font-medium"><DataStatusValue value={detail.distributorName} /></dd></div>
            <div><dt className="text-xs text-faint">บริษัทแม่</dt><dd className="mt-0.5 text-sm font-medium"><DataStatusValue value={detail.parentCompany} /></dd></div>
          </dl>
          {detail.channel && <p className="mt-3 max-w-2xl text-sm text-muted">{detail.channel}</p>}
        </section>
      )}

      <section className="mt-8 border-t border-border pt-6">
        <div className="grid gap-3 sm:grid-cols-3">
          {entries.map((e) => (
            <Link key={e.href} href={e.href} className="rounded-2xl border border-border bg-surface p-5 transition-all hover:border-accent hover:shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold">{e.title}</span>
                <span aria-hidden className="text-accent">→</span>
              </div>
              <p className="mt-1 text-xs text-faint tnum">{e.sub}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
