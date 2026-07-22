import BrandPage from "@/app/brands/[slug]/page";

export const dynamic = "force-dynamic";

// mockup: ห่อเนื้อหาหน้าแบรนด์จริงไว้ในเปลือก shell (variant B) — เนื้อหาไม่แตะ
export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <BrandPage params={params} />;
}
