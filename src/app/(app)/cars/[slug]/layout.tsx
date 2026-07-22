import { notFound } from "next/navigation";
import { getNameplateDetail, getNavIndex } from "@/lib/queries";
import { AppShell } from "@/components/app-shell";
import { BrandSidebar } from "@/components/brand-sidebar";

// โซนรุ่นรถ — sidebar ทางลัดรุ่นของแบรนด์เจ้าของรุ่นนี้ (หาแบรนด์จาก detail.brandSlug ใน navIndex)
export default async function CarLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [detail, navIndex] = await Promise.all([getNameplateDetail(slug), getNavIndex()]);
  if (!detail) notFound();
  const brand = navIndex.find((b) => b.slug === detail.brandSlug);
  return (
    <AppShell sidebar={brand ? <BrandSidebar brand={{ slug: brand.slug, name: brand.name }} /> : undefined}>
      {children}
    </AppShell>
  );
}
