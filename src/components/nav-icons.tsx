// ไอคอนนำทาง — วาด inline SVG เอง (ไม่เพิ่ม dependency) สไตล์เดียวกับ theme-toggle.tsx
// stroke 1.7 · currentColor → ได้สี active/hover ฟรีจากคลาสตัวหนังสือ
// หมายเหตุ: ไอคอนนำทาง (affordance กวาดตาหาเมนู) คนละหน้าที่กับ "ไอคอนประดับหัว section"
// ในเนื้อหาที่ DESIGN.md ห้าม — เบสอนุมัติให้เมนูมีไอคอนแล้ว

type IconProps = { className?: string };

const BASE = "size-[18px]";

export function IconHome({ className }: IconProps) {
  // บ้าน — หน้าแรกเป็น landing/ภาพรวม
  return (
    <svg viewBox="0 0 24 24" className={className ?? BASE} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 10.5 12 4l8 6.5" />
      <path d="M5.5 9.5V20h13V9.5" />
      <path d="M10 20v-5h4v5" />
    </svg>
  );
}

export function IconCars({ className }: IconProps) {
  // รถ side-profile — หน้า "รุ่นรถทั้งหมด" (= character grid)
  return (
    <svg viewBox="0 0 24 24" className={className ?? BASE} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 13.5h18M5 13.5l1.8-4.2A2 2 0 0 1 8.6 8h6.8a2 2 0 0 1 1.8 1.3l1.8 4.2" />
      <path d="M3 13.5V17h1.5M21 13.5V17h-1.5" />
      <circle cx="7.5" cy="17" r="1.6" />
      <circle cx="16.5" cy="17" r="1.6" />
    </svg>
  );
}

export function IconBrands({ className }: IconProps) {
  // กริด 2×2 — สื่อ "ชุดโลโก้แบรนด์"
  return (
    <svg viewBox="0 0 24 24" className={className ?? BASE} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.8" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.8" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.8" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.8" />
    </svg>
  );
}

export function IconMenu({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className ?? "size-5"} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function IconClose({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className ?? "size-5"} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}
