// ตัวช่วยร่วมของหน้าลอง "แบรนด์เป็นทางเข้า" (brand-first)
// flow ของรอบนี้: หน้าแรก (เลือกแบรนด์) → หน้าแบรนด์ → หน้ารุ่น → หน้ารุ่นย่อย
import Link from "next/link";

export type Look = "current" | "analytics" | "blueprint";
export type Screen = "home" | "brand" | "model" | "sku";

export const LOOKS: { value: Look; label: string }[] = [
  { value: "current", label: "ปัจจุบัน" },
  { value: "analytics", label: "G · ANALYTICS" },
  { value: "blueprint", label: "H · BLUEPRINT" },
];

export const SCREENS: { value: Screen; label: string }[] = [
  { value: "home", label: "หน้าแรก" },
  { value: "brand", label: "หน้าแบรนด์" },
  { value: "model", label: "หน้ารุ่น" },
  { value: "sku", label: "หน้ารุ่นย่อย" },
];

export function bfHref(look: Look, screen: Screen, thin: boolean) {
  const p = new URLSearchParams({ v: look, s: screen });
  if (thin) p.set("thin", "1");
  return `/proto/brand-first/view?${p.toString()}`;
}

export function BfLink({
  look,
  screen,
  thin,
  className,
  children,
}: {
  look: Look;
  screen: Screen;
  thin: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={bfHref(look, screen, thin)} className={className}>
      {children}
    </Link>
  );
}

/** ราคาย่อสำหรับที่แคบ */
export function shortTHB(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)} ล้าน`;
  return amount.toLocaleString("en-US");
}

/** สีตามหมวดขุมพลัง (คู่กับข้อความเสมอ — ห้ามสื่อด้วยสีอย่างเดียว) */
export function ptColor(label: string): string {
  if (label.includes("EV")) return "var(--lk-cyan)";
  if (label.includes("ปลั๊กอิน")) return "var(--lk-violet, #7b5cff)";
  if (label.includes("ไฮบริด")) return "var(--lk-good)";
  if (label.includes("ดีเซล")) return "var(--lk-warn)";
  return "var(--lk-accent)";
}

export function PtDot({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
      <span aria-hidden className="inline-block size-2 rounded-full" style={{ background: ptColor(label) }} />
      {label}
    </span>
  );
}

/** ✓ / – / ? — "?" คือสเปกทางการไม่ระบุ ไม่ใช่ "ไม่มี" */
export function AdasMark({ value, label }: { value: boolean | null; label: string }) {
  const text = value === true ? "มี" : value === false ? "ไม่มี" : "ไม่ระบุ";
  const color = value === true ? "var(--lk-good)" : value === false ? "var(--lk-faint)" : "var(--lk-warn)";
  return (
    <span className="inline-flex items-center gap-1 text-[12px]" style={{ color }} title={`${label}: ${text}`}>
      <span aria-hidden>{value === true ? "✓" : value === false ? "–" : "?"}</span>
      <span>{label}</span>
      <span className="sr-only">{text}</span>
    </span>
  );
}

/** โลโก้แบรนด์ — ใช้ไฟล์จริงถ้ามี ไม่มีก็เป็นอักษรย่อ (ตรงกับข้อจำกัดจริงของ Tesla/Benz) */
export function BrandLogo({ name, logo, size = 40 }: { name: string; logo: string | null; size?: number }) {
  if (logo) {
    // eslint-disable-next-line @next/next/no-img-element -- โลโก้เป็น SVG local ที่ next/image ไม่ optimize อยู่แล้ว
    return <img src={logo} alt="" className="object-contain" // wordmark กว้าง (TOYOTA/MAZDA) ต้องคุมความกว้าง ไม่งั้นล้นออกนอกกล่องไปทับชื่อ
      style={{ height: size * 0.6, width: "auto", maxWidth: size * 1.5 }} />;
  }
  return (
    <span
      aria-hidden
      className="grid place-items-center rounded-full font-bold"
      style={{
        width: size * 0.86,
        height: size * 0.86,
        background: "var(--lk-panel-2)",
        color: "var(--lk-muted)",
        fontSize: size * 0.38,
      }}
    >
      {name[0]}
    </span>
  );
}
