import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrandDetail } from "@/lib/queries";
import { formatDateTH, formatPriceRange } from "@/lib/format";
import { DataStatusValue } from "@/components/badges";
import { BrandMark } from "@/components/brand-shortcuts";
import { ModelCard } from "@/components/model-card";
import { SourcesSection } from "@/components/sources-section";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getBrandDetail(slug);
  // โยน 404 ตั้งแต่ชั้น metadata — ให้ status ตอบตรงก่อนเริ่ม stream
  if (!detail) notFound();
  return {
    // ห้ามเคลม "ทุกรุ่น" — coverage เป็นเซตย่อยของไลน์อัปจริงของแบรนด์เสมอ (evidence-first / no false precision)
    title: `${detail.name} — รุ่นใน coverage ราคาป้ายและข้อมูลที่ตรวจสอบได้`,
    description: `รุ่นรถ ${detail.name} ที่อยู่ใน coverage ของ CARMETA พร้อมราคาป้ายทางการและแหล่งอ้างอิง`,
  };
}

export default async function BrandPage({ params }: Props) {
  const { slug } = await params;
  const detail = await getBrandDetail(slug);
  if (!detail) notFound();

  const operationYear = detail.operationFrom
    ? new Date(detail.operationFrom).getUTCFullYear()
    : null;
  const latestChecked = formatDateTH(detail.stats.latestChecked);

  // เรียงรุ่นราคาต่ำ→สูง (บันไดราคา — ลำดับเดียวกับ sidebar) · รุ่นไม่มีราคาไปท้าย
  const models = [...detail.rows].sort((a, b) => {
    if (a.priceMin == null) return b.priceMin == null ? 0 : 1;
    if (b.priceMin == null) return -1;
    return a.priceMin - b.priceMin;
  });

  return (
    <>
      <nav aria-label="breadcrumb" className="pt-8 text-sm text-faint">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="transition-colors hover:text-foreground">
              ฐานข้อมูลรถ
            </Link>
          </li>
          <li aria-hidden>›</li>
          <li aria-current="page" className="font-medium text-foreground">
            {detail.name}
          </li>
        </ol>
      </nav>

      {/* Header ย่อ — ข้อมูลบริษัทละเอียดย้ายลงใต้ grid (คนเข้าหน้านี้อยากเลือกรุ่นก่อน) */}
      <header className="pt-6 pb-8">
        <div className="flex items-center gap-4">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-surface-muted p-2.5">
            <BrandMark name={detail.name} size={40} />
          </span>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {detail.name}
            </h1>
            {detail.officialName && (
              <p className="mt-1 text-sm text-muted">{detail.officialName}</p>
            )}
          </div>
        </div>
        {/* Coverage + ความเชื่อมั่นพูดครั้งเดียว บรรทัดเดียว (ยุบจากที่เคยกระจายหลายบรรทัด) */}
        <p className="mt-5 text-sm text-faint">
          {detail.stats.nameplates} รุ่นใน coverage · {detail.stats.variants} รุ่นย่อย
          {latestChecked && ` · ตรวจสอบล่าสุด ${latestChecked}`}
        </p>
      </header>

      <section aria-labelledby="brand-nameplates" className="pb-12">
        <h2 id="brand-nameplates" className="text-xl font-semibold tracking-tight">
          รุ่นทั้งหมดใน coverage
        </h2>
        <p className="mt-1 mb-5 text-sm text-faint">
          เฉพาะรุ่นที่มีข้อมูลตรวจสอบแล้ว — รุ่นอื่นของ {detail.name} จะทยอยเพิ่มพร้อมหลักฐาน
        </p>
        {models.length === 0 ? (
          <p className="text-sm text-muted">ยังไม่มีรุ่นใน coverage</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {models.map((row) => (
              <ModelCard key={row.slug} row={row} />
            ))}
          </div>
        )}
      </section>

      {/* ข้อมูลแบรนด์ในไทย — evidence-first fact ที่มีหลักฐาน (จุดต่างของ CARMETA) แต่เป็นรอง ไม่ใช่สิ่งแรกที่คนอยากเห็น */}
      <section aria-labelledby="brand-info" className="border-t border-border pt-8 pb-4">
        <h2 id="brand-info" className="text-lg font-semibold tracking-tight">
          ข้อมูลแบรนด์ในไทย
        </h2>
        <dl className="mt-5 grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4">
          <div>
            <dt className="text-xs text-faint">ดำเนินงานในไทยตั้งแต่</dt>
            <dd className="mt-1 text-[15px] font-semibold tabular-nums">
              <DataStatusValue value={operationYear} />
            </dd>
          </div>
          <div>
            <dt className="text-xs text-faint">ผู้ผลิต/จัดจำหน่าย</dt>
            <dd className="mt-1 text-[15px] font-semibold">
              <DataStatusValue value={detail.distributorName} />
            </dd>
          </div>
          <div>
            <dt className="text-xs text-faint">บริษัทแม่</dt>
            <dd className="mt-1 text-[15px] font-semibold">
              <DataStatusValue value={detail.parentCompany} />
            </dd>
          </div>
          <div>
            <dt className="text-xs text-faint">ช่วงราคาใน coverage</dt>
            <dd className="mt-1 text-[15px] font-semibold whitespace-nowrap tabular-nums">
              <DataStatusValue value={formatPriceRange(detail.stats.priceMin, detail.stats.priceMax)} />
            </dd>
          </div>
        </dl>
        {detail.channel && (
          <p className="mt-5 max-w-2xl text-sm text-muted">{detail.channel}</p>
        )}
      </section>

      <SourcesSection
        sources={detail.sources}
        subtitle="หลักฐานข้อมูลบริษัท/แบรนด์ (แหล่งของราคาแต่ละรุ่นอยู่ในหน้ารุ่นนั้นๆ)"
      />
    </>
  );
}
