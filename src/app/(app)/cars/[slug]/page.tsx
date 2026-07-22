import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNameplateDetail, getNameplateTree } from "@/lib/queries";
import { SEGMENT_LABEL } from "@/lib/labels";
import { formatDateTH, formatTHB } from "@/lib/format";
import { nameplateImage } from "@/lib/images";
import { LifecycleBadge, PowertrainDots, PricePositionBar, StatTile } from "@/components/badges";
import { SkuTable } from "@/components/sku-table";
import { NameplateAbout } from "@/components/nameplate-about";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getNameplateDetail(slug);
  if (!detail) notFound();
  return {
    title: `${detail.brand} ${detail.name} — ราคาและสเปก`,
    description: `ราคาป้ายทางการ สเปก และรุ่นย่อยทั้งหมดของ ${detail.brand} ${detail.name} พร้อมแหล่งอ้างอิงที่ตรวจสอบได้`,
  };
}

export default async function NameplatePage({ params }: Props) {
  const { slug } = await params;
  const [detail, tree] = await Promise.all([getNameplateDetail(slug), getNameplateTree(slug)]);
  if (!detail || !tree) notFound();

  const gen = tree.generations[0] ?? null;
  const heroImage = nameplateImage(detail.slug);
  const variantCount = gen?.variantCount ?? 0;
  const powertrains = gen ? [...new Set(gen.derivatives.flatMap((d) => d.trims.flatMap((t) => t.variants.map((v) => v.powertrainText))))] : [];
  const adasCount = detail.adas?.features.length ?? 0;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
      <nav aria-label="breadcrumb" className="pt-6 text-sm text-faint">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-foreground">ฐานข้อมูลรถ</Link></li>
          <li aria-hidden>›</li>
          <li><Link href={`/brands/${detail.brandSlug}`} className="text-muted hover:text-foreground">{detail.brand}</Link></li>
          <li aria-hidden>›</li>
          <li aria-current="page" className="font-medium text-foreground">{detail.name}</li>
        </ol>
      </nav>

      {/* hero */}
      <header className="grid gap-6 pt-6 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              <span className="mr-2 font-normal text-muted">{detail.brand}</span><span className="text-accent">{detail.name}</span>
            </h1>
            <LifecycleBadge status={detail.lifecycleStatus} />
          </div>
          <p className="mt-2 text-sm text-muted">
            {[
              detail.segment ? (SEGMENT_LABEL[detail.segment] ?? detail.segment) : null,
              detail.generationCode ?? detail.generationName,
              detail.launchYear != null ? `เปิดตัวในไทย ${detail.launchYear}` : null,
            ].filter(Boolean).join(" · ")}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <StatTile accent label="ราคาป้าย (ต่ำสุด)" value={<span className="tnum">{detail.priceMin != null ? formatTHB(detail.priceMin) : "—"}</span>} />
            <StatTile accent label="ราคาป้าย (สูงสุด)" value={<span className="tnum">{detail.priceMax != null ? formatTHB(detail.priceMax) : "—"}</span>} />
            <StatTile label="รุ่นย่อย" value={<span className="tnum">{variantCount}</span>} sub={`${gen?.derivatives.length ?? 0} ตัวถัง`} />
            <StatTile label="ระบบช่วยขับขี่" value={adasCount > 0 ? <span className="tnum">{adasCount}</span> : <span className="text-faint">—</span>} sub={adasCount > 0 ? "ฟีเจอร์ที่ติดตาม" : "ยังไม่มีข้อมูล"} />
          </div>
          {detail.priceMin != null && detail.priceMax != null && detail.priceMin !== detail.priceMax && (
            <div className="mt-4 max-w-md"><PricePositionBar min={detail.priceMin} max={detail.priceMax} value={detail.priceMin} /></div>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-faint">
            <PowertrainDots labels={powertrains} />
            {detail.latestChecked && <span className="tnum">· ตรวจสอบล่าสุด {formatDateTH(detail.latestChecked)}</span>}
          </div>
        </div>
        {heroImage && (
          <div className="flex items-center justify-center rounded-2xl border border-border bg-surface-muted/40 p-4">
            <Image src={heroImage.src} alt={heroImage.alt} width={300} height={169} priority className="h-auto w-full max-w-[300px] object-contain" />
          </div>
        )}
      </header>

      <SkuTable tree={tree} />
      <NameplateAbout detail={detail} tree={tree} />
    </div>
  );
}
