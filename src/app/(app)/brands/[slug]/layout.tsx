import { notFound } from "next/navigation";
import { getNavIndex } from "@/lib/queries";
import { AppShell } from "@/components/app-shell";
import { BrandSidebar } from "@/components/brand-sidebar";

// โซนแบรนด์ — sidebar ทางลัดรุ่นของแบรนด์นี้ (จาก navIndex · cache dedupe กับ navbar)
export default async function BrandLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const navIndex = await getNavIndex();
  const brand = navIndex.find((b) => b.slug === slug);
  if (!brand) notFound();
  return (
    <AppShell sidebar={<BrandSidebar brand={{ slug: brand.slug, name: brand.name }} nameplates={brand.nameplates} />}>
      {children}
    </AppShell>
  );
}
