import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrandDetail, getBrandTimeline } from "@/lib/queries";
import { formatDateTH, formatPriceRange } from "@/lib/format";
import { CHANGE_TYPE_LABEL } from "@/lib/labels";
import { Chip } from "@/components/badges";
import { BrandMark } from "@/components/brand-shortcuts";
import { IconCars, IconPriceLadder, IconTimeline } from "@/components/nav-icons";
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
      <span aria-hidden className="flex h-8 w-12 shrink-0 items-center justify-center rounded-md bg-background text-faint">
        <svg viewBox="0 0 48 24" className="h-3.5 w-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 17h-2v-4l4-1 5-6h14l6 6h7a3 3 0 0 1 3 3v2h-3" />
          <circle cx="14" cy="17" r="3" />
          <circle cx="36" cy="17" r="3" />
          <path d="M17 17h16" />
        </svg>
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

  const latestChecked = formatDateTH(detail.stats.latestChecked);
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
      <nav aria-label="breadcrumb" className="pt-8 text-sm text-faint">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="transition-colors hover:text-foreground">ฐานข้อมูลรถ</Link>
          </li>
          <li aria-hidden>›</li>
          <li aria-current="page" className="font-medium text-foreground">{detail.name}</li>
        </ol>
      </nav>

      {/* Hero band เตี้ย — identity + coverage/ความเชื่อมั่นพูดครั้งเดียว */}
      <header className="pt-6 pb-8">
        <div className="flex items-center gap-4">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-surface-muted p-2.5">
            <BrandMark name={detail.name} size={40} />
          </span>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{detail.name}</h1>
            {detail.officialName && <p className="mt-1 text-sm text-muted">{detail.officialName}</p>}
          </div>
        </div>
        <p className="mt-5 text-sm text-faint">
          {detail.stats.nameplates} รุ่นใน coverage · {detail.stats.variants} รุ่นย่อย
          {operationYear != null && ` · ดำเนินงานในไทยตั้งแต่ ${operationYear}`}
          {latestChecked && ` · ตรวจสอบล่าสุด ${latestChecked}`}
        </p>
      </header>

      {/* การ์ดนำทาง — พระเอกของหน้า (แต่ละใบสรุปหน้าลูกด้วยตัวเลขจริง) */}
      <section aria-label="เมนูของแบรนด์" className="grid gap-4 sm:grid-cols-3">
        <Link
          href={`${base}/cars`}
          className="group flex flex-col gap-2 rounded-2xl bg-surface-muted p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-accent-soft text-accent">
            <IconCars />
          </span>
          <span className="mt-1 flex items-center gap-1 text-[15px] font-semibold group-hover:text-accent">
            รุ่นรถ <span aria-hidden className="text-faint">›</span>
          </span>
          <span className="text-sm font-medium tabular-nums">
            {detail.stats.nameplates} รุ่น · {detail.stats.variants} รุ่นย่อย
          </span>
          <span className="text-[13px] text-muted">ทุกรุ่นใน coverage พร้อมราคาเริ่มต้น</span>
        </Link>

        {hasPriceLadder && (
          <Link
            href={`${base}/price-ladder`}
            className="group flex flex-col gap-2 rounded-2xl bg-surface-muted p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-accent-soft text-accent">
              <IconPriceLadder />
            </span>
            <span className="mt-1 flex items-center gap-1 text-[15px] font-semibold group-hover:text-accent">
              บันไดราคา <span aria-hidden className="text-faint">›</span>
            </span>
            <span className="text-sm font-medium tabular-nums">{priceRange}</span>
            <span className="text-[13px] text-muted">รุ่นย่อยเรียงราคาต่ำ→สูง พร้อมส่วนต่างต่อขั้น</span>
          </Link>
        )}

        {hasTimeline && (
          <Link
            href={`${base}/timeline`}
            className="group flex flex-col gap-2 rounded-2xl bg-surface-muted p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-accent-soft text-accent">
              <IconTimeline />
            </span>
            <span className="mt-1 flex items-center gap-1 text-[15px] font-semibold group-hover:text-accent">
              ไทม์ไลน์และประวัติ <span aria-hidden className="text-faint">›</span>
            </span>
            <span className="text-sm font-medium tabular-nums">
              {timeline.events.length > 0
                ? `${timeline.events.length} เหตุการณ์`
                : "ประวัติแบรนด์"}
              {operationYear != null && ` · ตั้งแต่ ${operationYear}`}
            </span>
            <span className="text-[13px] text-muted">เปิดตัว ปรับราคา ไมเนอร์เชนจ์ และประวัติแบรนด์</span>
          </Link>
        )}
      </section>

      {/* ทางลัดรุ่น (wayfinding — ไม่ใส่ราคา/สถานะ กันซ้ำกับหน้ารุ่นรถ) */}
      {models.length > 0 && (
        <section aria-labelledby="brand-shortcuts-h" className="mt-12">
          <div className="flex items-center justify-between">
            <h2 id="brand-shortcuts-h" className="text-lg font-semibold tracking-tight">
              รุ่นใน coverage
            </h2>
            <Link href={`${base}/cars`} className="text-sm text-accent transition-colors hover:underline">
              ดูการ์ดทุกรุ่น ›
            </Link>
          </div>
          <ul className="mt-4 flex flex-wrap gap-2.5">
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
        <section aria-labelledby="brand-recent-h" className="mt-12 pb-4">
          <div className="flex items-center justify-between">
            <h2 id="brand-recent-h" className="text-lg font-semibold tracking-tight">
              ความเคลื่อนไหวล่าสุด
            </h2>
            <Link href={`${base}/timeline`} className="text-sm text-accent transition-colors hover:underline">
              ดูไทม์ไลน์ทั้งหมด ›
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-border">
            {recentEvents.map((ev) => (
              <li key={ev.id} className="flex items-start justify-between gap-4 py-3">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <Chip>{CHANGE_TYPE_LABEL[ev.changeType] ?? ev.changeType}</Chip>
                  <span className="text-[15px] font-medium">{ev.title}</span>
                </div>
                <span className="shrink-0 pt-0.5 text-xs whitespace-nowrap text-faint">
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
