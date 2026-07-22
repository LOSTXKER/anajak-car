import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrandDetail, getBrandTimeline } from "@/lib/queries";
import { CHANGE_TYPE_LABEL } from "@/lib/labels";
import { formatDateTH, formatPriceRange } from "@/lib/format";
import { nameplateImage } from "@/lib/images";
import {
  Chip,
  DataStatusValue,
  EvidenceLink,
  LifecycleBadge,
  PowertrainDots,
  StatTile,
} from "@/components/badges";
import { BrandMark } from "@/components/brand-shortcuts";
import { CarDatabaseExplorer } from "@/components/car-database-explorer";
import { SourcesSection } from "@/components/sources-section";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getBrandDetail(slug);
  if (!detail) notFound();
  return {
    title: `${detail.name} — รุ่นใน coverage ราคาป้ายและข้อมูลที่ตรวจสอบได้`,
    description: `รุ่นรถ ${detail.name} ที่อยู่ใน coverage ของ CARMETA พร้อมราคาป้ายทางการและแหล่งอ้างอิง`,
  };
}

export default async function BrandPage({ params }: Props) {
  const { slug } = await params;
  const [detail, timeline] = await Promise.all([getBrandDetail(slug), getBrandTimeline(slug)]);
  if (!detail) notFound();

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
        {detail.channel && <p className="mt-4 max-w-2xl text-sm text-muted">{detail.channel}</p>}
      </header>

      {/* lineup cards */}
      <section aria-labelledby="brand-nameplates" className="border-t border-border pt-8">
        <h2 id="brand-nameplates" className="scroll-mt-20 text-xl font-semibold tracking-tight">ไลน์อัปใน coverage</h2>
        <p className="mt-1 text-sm text-faint">เฉพาะรุ่นที่มีข้อมูลตรวจสอบแล้ว — กดเข้าดูราคาและรุ่นย่อย · รุ่นอื่นของ {detail.name} จะทยอยเพิ่มพร้อมหลักฐาน</p>
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
                <div className="mt-1.5 text-lg font-semibold tnum"><DataStatusValue value={formatPriceRange(r.priceMin, r.priceMax)} /></div>
                <div className="mt-2 flex items-center justify-between gap-2 text-xs text-faint">
                  <PowertrainDots labels={r.powertrainLabels} />
                  <span className="tnum shrink-0">{r.variantCount} รุ่นย่อย</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* search / filter (คงเดิม — สัญญา filter URL) */}
      <section aria-labelledby="search-heading" className="border-t border-border pt-8 mt-10">
        <h2 id="search-heading" className="text-xl font-semibold tracking-tight">ค้นหาและกรอง</h2>
        <p className="mt-1 mb-4 text-sm text-faint">กรองตามตัวถัง ขุมพลัง สถานะ และงบ — แชร์ลิงก์ผลกรองได้</p>
        <CarDatabaseExplorer rows={detail.rows} variantRows={detail.variantRows} />
      </section>

      {/* brand change timeline */}
      {timeline.length > 0 && (
        <section aria-labelledby="brand-timeline" className="border-t border-border pt-8 mt-10">
          <h2 id="brand-timeline" className="text-xl font-semibold tracking-tight">ความเคลื่อนไหวล่าสุดของแบรนด์</h2>
          <ol className="mt-4 max-w-3xl divide-y divide-border">
            {timeline.slice(0, 6).map((e) => (
              <li key={e.id} className="flex flex-wrap items-baseline gap-2 py-3">
                <span className="tnum shrink-0 text-xs text-faint">{formatDateTH(e.effectiveDate) ?? "—"}</span>
                <Chip>{CHANGE_TYPE_LABEL[e.changeType] ?? e.changeType}</Chip>
                <Link href={`/cars/${e.nameplateSlug}`} className="text-sm font-medium hover:text-accent">{e.nameplateName}</Link>
                <span className="text-sm text-muted">{e.title}</span>
                {e.evidence?.url && <span className="ml-auto"><EvidenceLink evidence={e.evidence} /></span>}
              </li>
            ))}
          </ol>
        </section>
      )}

      <div className="border-t border-border pt-8 mt-10">
        <SourcesSection sources={detail.sources} subtitle="หลักฐานข้อมูลบริษัท/แบรนด์ (แหล่งของราคาแต่ละรุ่นอยู่ในหน้ารุ่นนั้นๆ)" />
      </div>
    </div>
  );
}
