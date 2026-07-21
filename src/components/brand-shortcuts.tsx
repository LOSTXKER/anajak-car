import Link from "next/link";
import type { BrandTile } from "@/lib/queries";
import { brandLogo, brandLogoDark } from "@/lib/images";

// แบรนด์ที่วางแผนเก็บข้อมูลถัดไป — แสดงเป็น tile ปิดไว้ ไม่เปิดหน้า thin (กฎ product)
export const UPCOMING_BRANDS = [
  "Honda",
  "Isuzu",
  "BYD",
  "Mitsubishi",
  "Nissan",
  "MG",
  "Mazda",
  "Ford",
];

// โลโก้จริงสีเต็มเสมอ (ที่มาใน public/logos/CREDITS.md) · ไม่มีไฟล์ → monogram
// บางแบรนด์ (Nissan/Mazda/Mitsubishi) ใช้สีดำ/เทาเป็นหลัก จมหายบนพื้นมืด — สลับเป็นเวอร์ชัน dark-safe
// ด้วย CSS ล้วน (.theme-logo-light/dark เดียวกับไอคอน CARMETA เอง กัน hydration mismatch)
export function BrandMark({
  name,
  size = 44,
}: {
  name: string;
  size?: number;
}) {
  const logo = brandLogo(name);
  const logoDark = brandLogoDark(name);
  if (logo && logoDark) {
    return (
      <span className="relative inline-flex shrink-0" style={{ width: size, height: size }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- โลโก้เป็นไฟล์ local ที่ next/image ไม่ optimize อยู่แล้ว */}
        <img
          src={logo}
          alt=""
          width={size}
          height={size}
          className="theme-logo-light absolute inset-0 object-contain"
          style={{ width: size, height: size }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoDark}
          alt=""
          width={size}
          height={size}
          className="theme-logo-dark absolute inset-0 object-contain"
          style={{ width: size, height: size }}
        />
      </span>
    );
  }
  if (logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- โลโก้เป็น SVG local ที่ next/image ไม่ optimize อยู่แล้ว
      <img
        src={logo}
        alt=""
        width={size}
        height={size}
        className="object-contain"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      aria-hidden
      className="flex items-center justify-center rounded-full border border-border-strong bg-surface-muted text-lg font-bold text-foreground"
      style={{ width: size, height: size }}
    >
      {name.charAt(0)}
    </span>
  );
}

// landing โชว์เฉพาะแบรนด์ที่ใช้ได้จริง + "ดูเพิ่มเติม" — upcoming เล่าที่หน้า /brands ที่เดียว
export function BrandShortcuts({ brands }: { brands: BrandTile[] }) {
  return (
    <nav aria-label="เลือกแบรนด์" className="flex flex-wrap justify-center gap-3">
      {brands.map((brand) => (
        <Link
          key={brand.slug}
          href={`/brands/${brand.slug}`}
          className="flex w-[108px] flex-col items-center gap-3 rounded-2xl bg-surface-muted px-2 py-5 transition-all hover:-translate-y-0.5 hover:bg-accent-soft hover:shadow-md"
        >
          <BrandMark name={brand.name} size={52} />
          <span className="text-sm font-semibold text-foreground">{brand.name}</span>
        </Link>
      ))}
      <Link
        href="/brands"
        className="flex w-[108px] flex-col items-center justify-center gap-3 rounded-2xl px-2 py-5 transition-all hover:-translate-y-0.5"
      >
        <span
          aria-hidden
          className="flex size-[52px] items-center justify-center rounded-full bg-surface-muted text-xl font-medium text-accent"
        >
          →
        </span>
        <span className="text-sm font-semibold text-accent">ดูเพิ่มเติม</span>
      </Link>
    </nav>
  );
}
