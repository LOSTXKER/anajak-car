import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrandDetail } from "@/lib/queries";
import { formatDateTH, formatPriceRange } from "@/lib/format";
import { PriceLadder } from "@/components/price-ladder";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getBrandDetail(slug);
  if (!detail) notFound();
  return {
    title: `บันไดราคา ${detail.name} — ราคาป้ายทุกรุ่นย่อย`,
    description: `รุ่นย่อยของ ${detail.name} ทั้งแบรนด์เรียงราคาต่ำ→สูง พร้อมส่วนต่างต่อขั้น — ราคาป้ายทางการที่ตรวจสอบได้`,
  };
}

export default async function BrandPriceLadderPage({ params }: Props) {
  const { slug } = await params;
  const detail = await getBrandDetail(slug);
  if (!detail) notFound();

  const priceRange = formatPriceRange(detail.stats.priceMin, detail.stats.priceMax);
  const latestChecked = formatDateTH(detail.stats.latestChecked);
  const pricedCount = detail.variantRows.filter(
    (r) => r.price != null && (r.lifecycleStatus === "CURRENT" || r.lifecycleStatus === "TRANSITION"),
  ).length;

  return (
    <>
      <nav aria-label="breadcrumb" className="pt-8 text-sm text-faint">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="transition-colors hover:text-foreground">ฐานข้อมูลรถ</Link></li>
          <li aria-hidden>›</li>
          <li><Link href={`/brands/${detail.slug}`} className="text-muted transition-colors hover:text-foreground">{detail.name}</Link></li>
          <li aria-hidden>›</li>
          <li aria-current="page" className="font-medium text-foreground">บันไดราคา</li>
        </ol>
      </nav>

      {/* พระเอก: แกนราคาเดียวทั้งแบรนด์ */}
      <header className="pt-6 pb-8">
        <p className="text-sm text-muted">ราคาป้ายทางการทั้งแบรนด์ {detail.name}</p>
        <p className="mt-1 text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl">
          {priceRange ?? "ไม่มีข้อมูล"}
        </p>
        <p className="mt-3 max-w-3xl text-sm text-muted">
          {pricedCount} รุ่นย่อยจาก {detail.stats.nameplates} รุ่น · ราคาป้ายทางการ
          {latestChecked && ` · ตรวจสอบล่าสุด ${latestChecked}`} · ไม่ใช่ราคาซื้อขายจริง ·
          ตัวเลข + คือส่วนต่างจากขั้นก่อนหน้า
        </p>
      </header>

      {pricedCount === 0 ? (
        <p className="pb-16 text-sm text-muted">
          ยังไม่มีราคาทางการใน coverage ของแบรนด์นี้ — ดูรุ่นได้ที่หน้า{" "}
          <Link href={`/brands/${detail.slug}/cars`} className="text-accent hover:underline">รุ่นรถ</Link>
        </p>
      ) : (
        <div className="pb-8">
          <PriceLadder rows={detail.variantRows} brandSlug={detail.slug} />
        </div>
      )}

      <p className="border-t border-border pt-6 pb-12 text-xs text-faint">
        แหล่งอ้างอิงและวันที่ของแต่ละราคาอยู่ในหน้าของรุ่นนั้น ๆ · หลักฐานระดับแบรนด์อยู่ในหน้า{" "}
        <Link href={`/brands/${detail.slug}/timeline`} className="text-accent hover:underline">ไทม์ไลน์และประวัติ</Link>
      </p>
    </>
  );
}
