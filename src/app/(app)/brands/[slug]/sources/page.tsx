import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrandDetail } from "@/lib/queries";
import { SourcesSection } from "@/components/sources-section";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getBrandDetail(slug);
  if (!detail) notFound();
  return { title: `แหล่งอ้างอิง ${detail.name}` };
}

export default async function BrandSourcesPage({ params }: Props) {
  const { slug } = await params;
  const detail = await getBrandDetail(slug);
  if (!detail) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-20 sm:px-6">
      <nav aria-label="breadcrumb" className="pt-8 text-sm text-faint">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-foreground">ฐานข้อมูลรถ</Link></li>
          <li aria-hidden>›</li>
          <li><Link href={`/brands/${slug}`} className="text-muted hover:text-foreground">{detail.name}</Link></li>
          <li aria-hidden>›</li>
          <li aria-current="page" className="font-medium text-foreground">แหล่งอ้างอิง</li>
        </ol>
      </nav>

      <div className="pt-6">
        <SourcesSection sources={detail.sources} subtitle="หลักฐานข้อมูลบริษัท/แบรนด์ (แหล่งของราคาแต่ละรุ่นอยู่ในหน้ารุ่นนั้นๆ)" />
      </div>
    </div>
  );
}
