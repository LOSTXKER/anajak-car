import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBrandDetail } from "@/lib/queries";
import { ModelCard } from "@/components/model-card";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getBrandDetail(slug);
  if (!detail) notFound();
  return {
    title: `รุ่นรถ ${detail.name} — ราคาป้ายและรุ่นย่อย`,
    description: `รุ่นรถ ${detail.name} ทั้งหมดใน coverage ของ CARMETA พร้อมราคาป้ายทางการและรุ่นย่อย`,
  };
}

export default async function BrandCarsPage({ params }: Props) {
  const { slug } = await params;
  const detail = await getBrandDetail(slug);
  if (!detail) notFound();

  // เรียงราคาต่ำ→สูง (บันไดราคา) · รุ่นไม่มีราคาไปท้าย
  const models = [...detail.rows].sort((a, b) => {
    if (a.priceMin == null) return b.priceMin == null ? 0 : 1;
    if (b.priceMin == null) return -1;
    return a.priceMin - b.priceMin;
  });

  return (
    <>
      <header className="pt-8 pb-6">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          รุ่นรถ {detail.name}
        </h1>
        <p className="mt-3 text-sm text-muted tabular-nums">
          {detail.stats.nameplates} รุ่น · {detail.stats.variants} รุ่นย่อย
        </p>
      </header>

      {models.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted">ยังไม่มีรุ่นในฐานข้อมูล</p>
      ) : (
        <div className="grid gap-5 pb-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {models.map((row) => (
            <ModelCard key={row.slug} row={row} />
          ))}
        </div>
      )}
    </>
  );
}
