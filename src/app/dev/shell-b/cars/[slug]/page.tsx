import NameplatePage from "@/app/cars/[slug]/page";

export const dynamic = "force-dynamic";

// mockup: ห่อเนื้อหาหน้ารุ่นจริงไว้ในเปลือก shell (variant B) — เนื้อหาไม่แตะ
export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <NameplatePage params={params} />;
}
