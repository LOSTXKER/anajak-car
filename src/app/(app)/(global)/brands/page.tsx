import type { Metadata } from "next";
import Link from "next/link";
import { getBrandTiles } from "@/lib/queries";
import { BrandMark, UPCOMING_BRANDS } from "@/components/brand-shortcuts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "แบรนด์รถทั้งหมด — เลือกยี่ห้อเพื่อดูราคาและข้อมูลรุ่น",
  description:
    "เลือกยี่ห้อรถเพื่อดูราคาป้ายทางการ รุ่นและรุ่นย่อยทั้งหมดใน coverage ของ CARMETA — เก็บข้อมูลลึกทีละแบรนด์ พร้อมแหล่งอ้างอิงทุกตัวเลข",
};

export default async function BrandsPage() {
  const brands = await getBrandTiles();
  const liveNames = new Set(brands.map((b) => b.name.toLowerCase()));
  const upcoming = UPCOMING_BRANDS.filter((name) => !liveNames.has(name.toLowerCase()));

  return (
    <>
      <header className="pt-8 pb-8">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">เลือกยี่ห้อรถ</h1>
      </header>

      <section aria-labelledby="live-brands" className="pb-12">
        <h2 id="live-brands" className="text-xl font-semibold tracking-tight sm:text-2xl">
          เปิดให้ค้นหาแล้ว
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {brands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/brands/${brand.slug}`}
              className="group flex items-center gap-4 rounded-2xl bg-surface-muted p-6 transition-all hover:-translate-y-0.5 hover:bg-accent-soft hover:shadow-md"
            >
              <BrandMark name={brand.name} size={48} />
              <div>
                <p className="text-lg font-semibold group-hover:text-accent">{brand.name}</p>
                {brand.nameplateCount > 0 && (
                  <p className="text-sm text-muted">{brand.nameplateCount} รุ่น</p>
                )}
              </div>
              <span aria-hidden className="ml-auto text-faint transition-colors group-hover:text-accent">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="upcoming-brands" className="pb-20">
        <h2 id="upcoming-brands" className="text-xl font-semibold tracking-tight sm:text-2xl">
          กำลังเก็บข้อมูล
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {upcoming.map((name) => (
            <div key={name} className="flex items-center gap-3 rounded-2xl px-5 py-4">
              <span className="opacity-45">
                <BrandMark name={name} size={36} />
              </span>
              <p className="font-medium text-muted">{name}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
