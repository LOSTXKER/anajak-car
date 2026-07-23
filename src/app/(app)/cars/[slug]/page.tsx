import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNameplateDetail, getNameplateTree } from "@/lib/queries";
import { SEGMENT_LABEL } from "@/lib/labels";
import { formatTHB } from "@/lib/format";
import { nameplateImage } from "@/lib/images";
import { LifecycleBadge, ptDotClass } from "@/components/badges";
import { StatBar } from "@/components/panel";
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

      {/* hero banner — แท่งสีเฉียงหลังรูป (ภาษา prydwen) */}
      <header className="relative mt-5 overflow-hidden rounded-2xl border border-border bg-background">
        <div
          aria-hidden
          className="absolute inset-y-0 right-0 hidden w-[46%] bg-accent-soft sm:block"
          style={{ clipPath: "polygon(22% 0, 100% 0, 100% 100%, 0 100%)" }}
        />
        <div
          aria-hidden
          className="absolute inset-y-0 right-0 hidden w-[12%] bg-accent/15 sm:block"
          style={{ clipPath: "polygon(55% 0, 100% 0, 100% 100%, 0 100%)" }}
        />
        <div className="relative grid gap-5 p-6 sm:grid-cols-[1fr_320px] sm:p-8">
          <div className="min-w-0">
            <p className="text-[13px] font-semibold tracking-[0.2em] text-accent uppercase">{detail.brand}</p>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{detail.name}</h1>
              <LifecycleBadge status={detail.lifecycleStatus} />
            </div>
            <p className="mt-2.5 text-sm text-muted">
              {[
                detail.segment ? (SEGMENT_LABEL[detail.segment] ?? detail.segment) : null,
                detail.generationCode ?? detail.generationName,
                detail.launchYear != null ? `เปิดตัวในไทย ${detail.launchYear}` : null,
              ].filter(Boolean).join(" · ")}
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {powertrains.map((p) => (
                <span key={p} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-[12px] font-medium">
                  <span aria-hidden className={`inline-block size-2 rounded-full ${ptDotClass(p)}`} />
                  {p}
                </span>
              ))}
            </div>

            <div className="mt-6 grid max-w-md grid-cols-3 gap-2.5">
              <StatBar label="เริ่มต้น" value={detail.priceMin != null ? formatTHB(detail.priceMin) : "—"} />
              <StatBar label="สูงสุด" value={detail.priceMax != null ? formatTHB(detail.priceMax) : "—"} />
              <StatBar label="รุ่นย่อย" value={variantCount} sub={`${gen?.derivatives.length ?? 0} ตัวถัง`} />
            </div>
          </div>
          {heroImage && (
            <div className="relative flex items-center justify-center">
              <Image src={heroImage.src} alt={heroImage.alt} width={320} height={180} priority className="h-auto w-full max-w-[320px] object-contain drop-shadow-md" />
            </div>
          )}
        </div>
      </header>

      <SkuTable tree={tree} latestChecked={detail.latestChecked} />
      <NameplateAbout detail={detail} tree={tree} />
    </div>
  );
}
