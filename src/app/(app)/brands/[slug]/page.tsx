import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrandDetail } from "@/lib/queries";
import { formatDateTH, formatPriceRange } from "@/lib/format";
import { DataStatusValue, StatTile } from "@/components/badges";
import { BrandMark } from "@/components/brand-shortcuts";
import { CarDatabaseExplorer } from "@/components/car-database-explorer";

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
  const detail = await getBrandDetail(slug);
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

      {/* ตารางรุ่น — เฉพาะแบรนด์นี้ (getBrandDetail คืนเฉพาะรุ่นของแบรนด์ · สัญญา filter URL) */}
      <section aria-labelledby="brand-nameplates" className="border-t border-border pt-8">
        <h2 id="brand-nameplates" className="text-xl font-semibold tracking-tight">รุ่นรถใน coverage</h2>
        <p className="mt-1 mb-4 text-sm text-faint">เฉพาะรุ่น {detail.name} ที่มีข้อมูลตรวจสอบแล้ว — กดเข้าดูราคาและรุ่นย่อย · กรอง/แชร์ลิงก์ผลกรองได้</p>
        <CarDatabaseExplorer rows={detail.rows} variantRows={detail.variantRows} />
      </section>
    </div>
  );
}
