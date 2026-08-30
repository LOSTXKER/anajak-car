// ตัวช่วยร่วมของหน้าลอง "หน้าตา" (look-2026)
import Link from "next/link";

import { NAMEPLATES } from "../../_kit/data";

export type Look = "current" | "meta" | "pit" | "blueprint";
export type Screen = "home" | "model" | "sku";

export const LOOKS: { value: Look; label: string }[] = [
  { value: "current", label: "ปัจจุบัน" },
  { value: "meta", label: "D · META" },
  { value: "pit", label: "E · PIT" },
  { value: "blueprint", label: "F · BLUEPRINT" },
];

export const SCREENS: { value: Screen; label: string }[] = [
  { value: "home", label: "หน้าแรก" },
  { value: "model", label: "หน้ารุ่น" },
  { value: "sku", label: "หน้ารุ่นย่อย" },
];

export function lookHref(look: Look, screen: Screen, thin: boolean) {
  const p = new URLSearchParams({ v: look, s: screen });
  if (thin) p.set("thin", "1");
  return `/proto/look-2026/view?${p.toString()}`;
}

export function LookLink({
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
    <Link href={lookHref(look, screen, thin)} className={className}>
      {children}
    </Link>
  );
}

/** สเกลราคาสูงสุดของทั้งฐานข้อมูล — ใช้เป็นแกนร่วมของแท่งเทียบราคาในตาราง */
export const PRICE_SCALE_MAX = Math.max(...NAMEPLATES.map((n) => n.priceMax ?? 0));

/** ราคาย่อสำหรับที่แคบ — "1.4 ล้าน" / "767,000" */
export function shortTHB(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)} ล้าน`;
  return amount.toLocaleString("en-US");
}

/** สีจุดตามหมวดขุมพลัง — เวอร์ชันของหน้าลอง (สีคุมโทนตาม look ไม่ใช่ token เว็บจริง) */
export function ptColor(label: string): string {
  if (label.includes("EV")) return "var(--lk-cyan)";
  if (label.includes("ไฮบริด")) return "var(--lk-good)";
  if (label.includes("ดีเซล")) return "var(--lk-warn)";
  return "var(--lk-accent)";
}

/** จุดสี + ข้อความ (ห้ามสื่อด้วยสีอย่างเดียว — a11y) */
export function PtDot({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
      <span
        aria-hidden
        className="inline-block size-2 rounded-full"
        style={{ background: ptColor(label) }}
      />
      {label}
    </span>
  );
}

/** ป้ายสถานะข้อมูล ✓ / – / ? — "?" = สเปกทางการไม่ระบุ ไม่ใช่ "ไม่มี" */
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
