import { getBrandDetail, getBrandTiles } from "@/lib/queries";
import { SiteFooter } from "@/components/site-footer";
import { MockNavbar } from "@/components/dev/mock-navbar";
import { MockSidebar, type BrandNav, type SidebarVariant } from "@/components/dev/mock-sidebar";

// ── MOCKUP (M23 shell compare) — ทิ้งทั้งโฟลเดอร์ dev/ หลังเบสเลือก ──
// เปลือกเต็มจอ (fixed inset-0 z-40) ครอบ SiteHeader/SiteFooter เดิมของ root layout
// จงใจใช้ overlay เพื่อไม่ต้องรื้อ root ตอน mockup (การรื้อจริงคือ Phase B) — เห็นภาพจริงได้โดยไม่กระทบหน้าอื่น

const byPriceAsc = (a: { priceMin: number | null }, b: { priceMin: number | null }) =>
  (a.priceMin ?? Infinity) - (b.priceMin ?? Infinity);

export async function MockShell({
  variant,
  basePath,
  children,
}: {
  variant: SidebarVariant;
  basePath: string;
  children: React.ReactNode;
}) {
  const [detail, tiles] = await Promise.all([getBrandDetail("toyota"), getBrandTiles()]);
  if (!detail) return <>{children}</>;

  const brand: BrandNav = {
    slug: detail.slug,
    name: detail.name,
    officialName: detail.officialName,
    nameplates: [...detail.rows].sort(byPriceAsc).map((r) => ({
      slug: r.slug,
      name: r.name,
      lifecycleStatus: r.lifecycleStatus,
      priceMin: r.priceMin,
    })),
    stats: detail.stats,
  };
  const brands = tiles.map((t) => ({ slug: t.slug, name: t.name }));
  const currentBrand = { slug: detail.slug, name: detail.name };

  return (
    <div className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-background">
      <MockNavbar
        basePath={basePath}
        brands={brands}
        currentBrand={currentBrand}
        nameplates={brand.nameplates}
      />
      <div className="flex flex-1">
        <MockSidebar variant={variant} brand={brand} basePath={basePath} />
        {/* min-w-0 = กันตาราง/เนื้อหากว้างดัน flex column จน layout ระเบิดแนวนอน */}
        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </div>
    </div>
  );
}
