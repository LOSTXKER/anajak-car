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

export function BrandShortcuts({ brands }: { brands: BrandTile[] }) {
  // แบรนด์ที่เข้า coverage แล้วต้องหายจากรายการ "เร็วๆ นี้" อัตโนมัติ
  const liveNames = new Set(brands.map((b) => b.name.toLowerCase()));
  const upcoming = UPCOMING_BRANDS.filter((name) => !liveNames.has(name.toLowerCase()));

  return (
    <nav aria-label="เลือกแบรนด์" className="flex flex-wrap justify-center gap-3">
      {brands.map((brand) => (
        <Link
          key={brand.slug}
          href={`/brands/${brand.slug}`}
          className="flex w-[96px] flex-col items-center gap-2.5 rounded-2xl bg-accent-soft px-2 py-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <BrandMark name={brand.name} />
          <span className="text-xs font-semibold text-foreground">{brand.name}</span>
        </Link>
      ))}
      {upcoming.map((name) => (
        <div
          key={name}
          title="ยังไม่อยู่ใน coverage — กำลังทยอยเก็บข้อมูลพร้อมหลักฐาน"
          className="flex w-[96px] flex-col items-center gap-2.5 rounded-2xl px-2 py-4"
        >
          {/* dim เฉพาะโลโก้ (decorative, alt="") — ไม่แตะ opacity ของ container กัน text-muted/text-faint หลุด AA (เคยแก้แล้ว) */}
          <span className="opacity-45">
            <BrandMark name={name} />
          </span>
          <span className="text-xs font-medium text-muted">{name}</span>
          {/* label ที่เห็นได้จริง ไม่ใช่แค่ title (mouse-only) — คีย์บอร์ด/touch/screen reader เข้าถึงได้ */}
          <span className="text-[10px] text-faint">เร็วๆ นี้</span>
        </div>
      ))}
      <Link
        href="/brands"
        className="flex w-[96px] flex-col items-center justify-center gap-2.5 rounded-2xl px-2 py-4 transition-all hover:-translate-y-0.5"
      >
        <span
          aria-hidden
          className="flex size-11 items-center justify-center rounded-full bg-accent-soft text-xl font-medium text-accent"
        >
          →
        </span>
        <span className="text-xs font-semibold text-accent">ดูเพิ่มเติม</span>
      </Link>
    </nav>
  );
}
