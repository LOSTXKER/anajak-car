import { notFound } from "next/navigation";
import { getNameplateDetail } from "@/lib/queries";
import { AppShell } from "@/components/app-shell";
import { BrandSidebar } from "@/components/brand-sidebar";

// โซนรุ่นรถ (/cars/[slug]) — sidebar ของแบรนด์เจ้าของรุ่น (แก้จาก detail.brandSlug)
// getNameplateDetail cache() dedupe กับ page + ใช้เช็คว่ามี section ADAS/ไทม์ไลน์ไหม (gate จุดยึด sidebar)
export default async function CarLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detail = await getNameplateDetail(slug);
  if (!detail) notFound();

  return (
    <AppShell
      sidebar={
        <BrandSidebar
          brand={{ slug: detail.brandSlug, name: detail.brand }}
          hasAdas={Boolean(detail.adas && detail.adas.trims.length > 0)}
          hasTimeline={detail.changeEvents.length > 0}
        />
      }
    >
      {children}
    </AppShell>
  );
}
