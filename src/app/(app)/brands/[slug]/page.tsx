import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrandDetail, getBrandTimeline } from "@/lib/queries";
import { formatDateTH, formatPriceRange } from "@/lib/format";
import { CHANGE_TYPE_LABEL } from "@/lib/labels";
import { Chip } from "@/components/badges";
import { BrandMark } from "@/components/brand-shortcuts";
import { CarSilhouette } from "@/components/model-card";
import { nameplateImage } from "@/lib/images";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getBrandDetail(slug);
  if (!detail) notFound();
  return {
    title: `${detail.name} — ราคารถ รุ่นย่อย และประวัติในไทย`,
    description: `ภาพรวม ${detail.name} ใน coverage ของ CARMETA — รุ่นรถ บันไดราคา และไทม์ไลน์การเปลี่ยนแปลง พร้อมแหล่งอ้างอิง`,
  };
}

// รูปย่อรุ่นในแถวทางลัด (fallback เงารถเมื่อไม่มีภาพ)
function ModelThumb({ slug }: { slug: string }) {
  const image = nameplateImage(slug);
  if (!image) {
    return (
      <span aria-hidden className="flex h-8 w-12 shrink-0 items-center justify-center rounded-md bg-background text-border-strong">
        <CarSilhouette className="h-3.5 w-7" />
      </span>
    );
  }
  return (
    <Image src={image.src} alt="" width={48} height={32} className="h-8 w-12 shrink-0 rounded-md bg-background object-contain" />
  );
}

export default async function BrandHomePage({ params }: Props) {
  const { slug } = await params;
  const [detail, timeline] = await Promise.all([getBrandDetail(slug), getBrandTimeline(slug)]);
  if (!detail) notFound();

  const operationYear = detail.operationFrom ? new Date(detail.operationFrom).getUTCFullYear() : null;
  const priceRange = formatPriceRange(detail.stats.priceMin, detail.stats.priceMax);
  // gate ให้ตรงกับ getBrandShell (sidebar) — กันการ์ด/เมนูไม่ตรงกัน
  const hasPriceLadder = detail.stats.priceMin != null;
  const hasTimeline = timeline.events.length > 0 || operationYear != null;
  const recentEvents = timeline.events.slice(0, 3);

  // เรียงรุ่นราคาต่ำ→สูงสำหรับแถวทางลัด
  const models = [...detail.rows].sort((a, b) => {
    if (a.priceMin == null) return b.priceMin == null ? 0 : 1;
    if (b.priceMin == null) return -1;
    return a.priceMin - b.priceMin;
  });

  const base = `/brands/${detail.slug}`;

  return (
    <>
      {/* Hero band เตี้ย — identity ล้วน (ตัวเลขเป็นของการ์ดนำทาง กันซ้ำ) */}
      <header className="flex items-center gap-4 pt-10 pb-10">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-surface-muted p-3">
          <BrandMark name={detail.name} size={44} />
        </span>
        <div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{detail.name}</h1>
          {detail.officialName && <p className="mt-1.5 text-sm text-muted">{detail.officialName}</p>}
        </div>
      </header>

      {/* การ์ดนำทาง — พระเอกของหน้า (แต่ละใบสรุปหน้าลูกด้วยตัวเลขจริง) */}
      <section aria-label="เมนูของแบรนด์" className="grid gap-5 sm:grid-cols-3 lg:gap-6">
        <Link
          href={`${base}/cars`}
          className="group flex flex-col rounded-2xl bg-surface-muted p-6 transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <span className="flex items-center gap-1 text-base font-semibold group-hover:text-accent">
            รุ่นรถ <span aria-hidden className="text-faint">›</span>
          </span>
          <span className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">
            {detail.stats.nameplates} รุ่น
          </span>
          <span className="mt-0.5 text-sm text-faint tabular-nums">{detail.stats.variants} รุ่นย่อย</span>
        </Link>

        {hasPriceLadder && (
          <Link
            href={`${base}/price-ladder`}
            className="group flex flex-col rounded-2xl bg-surface-muted p-6 transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="flex items-center gap-1 text-base font-semibold group-hover:text-accent">
              บันไดราคา <span aria-hidden className="text-faint">›</span>
            </span>
            <span className="mt-3 text-lg font-semibold tracking-tight tabular-nums">{priceRange}</span>
          </Link>
        )}

        {hasTimeline && (
          <Link
            href={`${base}/timeline`}
            className="group flex flex-col rounded-2xl bg-surface-muted p-6 transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="flex items-center gap-1 text-base font-semibold group-hover:text-accent">
              ไทม์ไลน์และประวัติ <span aria-hidden className="text-faint">›</span>
            </span>
            <span className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">
              {timeline.events.length > 0 ? `${timeline.events.length} เหตุการณ์` : "ประวัติแบรนด์"}
            </span>
          </Link>
        )}
      </section>

      {/* ทางลัดรุ่น (wayfinding — ไม่ใส่ราคา/สถานะ กันซ้ำกับหน้ารุ่นรถ) */}
      {models.length > 0 && (
        <section aria-label="ทางลัดเข้ารุ่น" className="mt-12">
          <ul className="flex flex-wrap gap-2.5">
            {models.map((row) => (
              <li key={row.slug}>
                <Link
                  href={`${base}/cars/${row.slug}`}
                  className="flex items-center gap-2.5 rounded-full bg-surface-muted py-1.5 pr-4 pl-1.5 text-sm transition-colors hover:bg-accent-soft hover:text-accent"
                >
                  <ModelThumb slug={row.slug} />
                  <span className="font-medium">{row.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ความเคลื่อนไหวล่าสุด (freshness — teaser 3 รายการ ไม่มี evidence/before-after) */}
      {recentEvents.length > 0 && (
        <section aria-labelledby="brand-recent-h" className="mt-14 pb-4">
          <h2 id="brand-recent-h" className="text-xl font-semibold tracking-tight sm:text-2xl">
            ความเคลื่อนไหวล่าสุด
          </h2>
          <ul className="mt-6 divide-y divide-border">
            {recentEvents.map((ev) => (
              <li key={ev.id} className="flex items-start justify-between gap-4 py-4">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <Chip>{CHANGE_TYPE_LABEL[ev.changeType] ?? ev.changeType}</Chip>
                  <span className="text-base font-medium">{ev.title}</span>
                </div>
                <span className="shrink-0 pt-0.5 text-[13px] whitespace-nowrap text-faint">
                  {formatDateTH(ev.effectiveDate) ?? "ไม่ระบุวันที่"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
