import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrandDetail } from "@/lib/queries";
import { formatPriceRange } from "@/lib/format";
import { nameplateImage } from "@/lib/images";
import { DataStatusValue, LifecycleBadge, PowertrainDots } from "@/components/badges";
import { CarDatabaseExplorer } from "@/components/car-database-explorer";
import { SectionHeader } from "@/components/panel";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getBrandDetail(slug);
  if (!detail) notFound();
  return { title: `รุ่นรถ ${detail.name} — ราคาป้ายและรุ่นย่อย` };
}

export default async function BrandModelsPage({ params }: Props) {
  const { slug } = await params;
  const detail = await getBrandDetail(slug);
  if (!detail) notFound();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
      <nav aria-label="breadcrumb" className="pt-8 text-sm text-faint">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-foreground">ฐานข้อมูลรถ</Link></li>
          <li aria-hidden>›</li>
          <li><Link href={`/brands/${slug}`} className="text-muted hover:text-foreground">{detail.name}</Link></li>
          <li aria-hidden>›</li>
          <li aria-current="page" className="font-medium text-foreground">รุ่นรถ</li>
        </ol>
      </nav>

      <div className="pt-6">
        <p className="text-[13px] font-semibold tracking-[0.2em] text-accent uppercase">{detail.name}</p>
        <h1 className="mt-0.5 text-3xl font-bold tracking-tight">รุ่นรถ</h1>
        <p className="mt-1 text-sm text-faint">เฉพาะรุ่นที่มีข้อมูลตรวจสอบแล้ว — กดเข้าดูราคาและรุ่นย่อย · รุ่นอื่นจะทยอยเพิ่มพร้อมหลักฐาน</p>
        <div aria-hidden className="mt-3 h-0.5 w-full rounded-full bg-accent" />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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

      <section aria-label="ค้นหาและกรอง" className="mt-10">
        <SectionHeader id="search-heading" title="ค้นหาและกรอง" sub="กรองตามตัวถัง ขุมพลัง สถานะ และงบ — แชร์ลิงก์ผลกรองได้" />
        <div className="mb-4" />
        <CarDatabaseExplorer rows={detail.rows} variantRows={detail.variantRows} />
      </section>
    </div>
  );
}
