import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrandDetail } from "@/lib/queries";
import { formatDateTH, formatPriceRange } from "@/lib/format";
import { DataStatusValue } from "@/components/badges";
import { BrandMark } from "@/components/brand-shortcuts";
import { CarDatabaseExplorer } from "@/components/car-database-explorer";
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

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
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

      <header className="pt-6 pb-10">
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

        <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-border pt-6 sm:grid-cols-4">
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
          <p className="mt-4 max-w-2xl text-sm text-muted">{detail.channel}</p>
        )}
        <p className="mt-2 text-xs text-faint">
          Coverage ปัจจุบัน: {detail.stats.nameplates} รุ่น · {detail.stats.variants} รุ่นย่อย
          {detail.stats.latestChecked &&
            ` · ตรวจสอบล่าสุด ${formatDateTH(detail.stats.latestChecked)}`}
        </p>
      </header>

      <section aria-labelledby="brand-nameplates" className="pb-4">
        <h2 id="brand-nameplates" className="text-xl font-semibold tracking-tight">
          รุ่นทั้งหมดใน coverage
        </h2>
        <p className="mt-1 mb-4 text-sm text-faint">
          เฉพาะรุ่นที่มีข้อมูลตรวจสอบแล้ว — รุ่นอื่นของ {detail.name} จะทยอยเพิ่มพร้อมหลักฐาน
        </p>
        <CarDatabaseExplorer rows={detail.rows} variantRows={detail.variantRows} />
      </section>

      <SourcesSection
        sources={detail.sources}
        subtitle="หลักฐานข้อมูลบริษัท/แบรนด์ (แหล่งของราคาแต่ละรุ่นอยู่ในหน้ารุ่นนั้นๆ)"
      />
    </div>
  );
}
