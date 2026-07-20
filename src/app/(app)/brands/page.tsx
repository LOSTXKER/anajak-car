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
      <nav aria-label="breadcrumb" className="pt-8 text-sm text-faint">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="transition-colors hover:text-foreground">
              ฐานข้อมูลรถ
            </Link>
          </li>
          <li aria-hidden>›</li>
          <li aria-current="page" className="font-medium text-foreground">
            แบรนด์
          </li>
        </ol>
      </nav>

      <header className="pt-6 pb-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">เลือกยี่ห้อรถ</h1>
        <p className="mt-3 max-w-2xl text-[15px] text-muted">
          เราเก็บข้อมูลแบบ<span className="font-medium text-foreground">ลึกก่อนกว้าง</span> —
          แบรนด์ที่เปิดแล้วคือแบรนด์ที่ราคาและสเปกผ่านการตรวจสอบกับแหล่งทางการครบทุกตัวเลข
          ส่วนแบรนด์ที่เหลือกำลังทยอยเก็บข้อมูลพร้อมหลักฐาน
        </p>
      </header>

      <section aria-labelledby="live-brands" className="pb-10">
        <h2 id="live-brands" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <span aria-hidden className="h-4 w-1 rounded-full bg-accent" />
          เปิดให้ค้นหาแล้ว
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/brands/${brand.slug}`}
              className="group flex items-center gap-4 rounded-2xl bg-surface-muted p-5 transition-all hover:-translate-y-0.5 hover:bg-accent-soft hover:shadow-md"
            >
              <BrandMark name={brand.name} size={48} />
              <div>
                <p className="text-lg font-semibold group-hover:text-accent">{brand.name}</p>
                <p className="text-sm text-muted">
                  {brand.nameplateCount > 0
                    ? `${brand.nameplateCount} รุ่นใน coverage · ดูราคาและรุ่นย่อย`
                    : "ดูข้อมูลแบรนด์"}
                </p>
              </div>
              <span aria-hidden className="ml-auto text-faint transition-colors group-hover:text-accent">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="upcoming-brands" className="pb-20">
        <h2 id="upcoming-brands" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <span aria-hidden className="h-4 w-1 rounded-full bg-border-strong" />
          กำลังเก็บข้อมูล
        </h2>
        <p className="mt-1.5 text-sm text-faint">
          ยังไม่เปิดหน้าแบรนด์จนกว่าข้อมูลจะผ่านการตรวจสอบครบ — ไม่มีหน้าที่ข้อมูลบาง
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {upcoming.map((name) => (
            <div key={name} className="flex items-center gap-3 rounded-2xl px-5 py-4">
              <span className="opacity-45">
                <BrandMark name={name} size={36} />
              </span>
              <div>
                <p className="font-medium">{name}</p>
                <p className="text-xs text-faint">เร็วๆ นี้</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
