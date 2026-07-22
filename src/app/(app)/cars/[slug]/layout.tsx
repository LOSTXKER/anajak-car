import { notFound } from "next/navigation";
import { getNameplateDetail } from "@/lib/queries";

// guard 404 สำหรับรุ่นที่ไม่มีจริง (ตั้งแต่ layout · status ถูก) — shell/sidebar อยู่ (app)/layout แล้ว
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
  return <>{children}</>;
}
