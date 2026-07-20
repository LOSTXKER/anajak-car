import { notFound, permanentRedirect } from "next/navigation";
import { getNameplateBrandSlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

// Legacy redirect: /cars/[slug] (URL เก่าที่ deploy ไปแล้ว) → /brands/[brand]/cars/[slug] (canonical)
// 308 permanent เพื่อ SEO · slug ไม่รู้จัก → 404 · ห้ามครอบ permanentRedirect ด้วย try/catch (มัน throw ภายใน)
export default async function LegacyCarRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brandSlug = await getNameplateBrandSlug(slug);
  if (!brandSlug) notFound();
  permanentRedirect(`/brands/${brandSlug}/cars/${slug}`);
}
