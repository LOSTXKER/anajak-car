import { notFound } from "next/navigation";
import { getNavIndex } from "@/lib/queries";

// guard 404 สำหรับแบรนด์ที่ไม่มีจริง (ตั้งแต่ layout · status ถูก) — shell/sidebar อยู่ (app)/layout แล้ว
export default async function BrandLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const navIndex = await getNavIndex();
  if (!navIndex.find((b) => b.slug === slug)) notFound();
  return <>{children}</>;
}
