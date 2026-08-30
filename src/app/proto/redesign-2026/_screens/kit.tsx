// ตัวช่วยร่วมของทุกทิศในหน้าลอง — ลิงก์ภายในหน้าลอง + ชิ้นเล็กที่ทุกทิศใช้เหมือนกัน
// (ชิ้นที่ "ไม่ได้กำลังเทียบ" import ของจริงจาก @/components เสมอ — ดู badges.tsx / panel.tsx)
import Link from "next/link";

export type Dir = "current" | "filter" | "answer" | "guide";
export type Screen = "home" | "model" | "sku";

export const DIRS: { value: Dir; label: string }[] = [
  { value: "current", label: "ปัจจุบัน" },
  { value: "filter", label: "A · ตารางคือหน้าแรก" },
  { value: "answer", label: "B · ถามแล้วตอบ" },
  { value: "guide", label: "C · คู่มือรถ" },
];

export const SCREENS: { value: Screen; label: string }[] = [
  { value: "home", label: "หน้าแรก" },
  { value: "model", label: "หน้ารุ่น" },
  { value: "sku", label: "หน้ารุ่นย่อย" },
];

/** ลิงก์ภายในหน้าลอง — เดินได้จริงในกรอบ ไม่หลุดออกไปเว็บจริง */
export function protoHref(dir: Dir, screen: Screen, thin: boolean, extra?: Record<string, string>) {
  const p = new URLSearchParams({ v: dir, s: screen });
  if (thin) p.set("thin", "1");
  for (const [k, v] of Object.entries(extra ?? {})) p.set(k, v);
  return `/proto/redesign-2026/view?${p.toString()}`;
}

export function ProtoLink({
  dir,
  screen,
  thin,
  className,
  children,
}: {
  dir: Dir;
  screen: Screen;
  thin: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={protoHref(dir, screen, thin)} className={className}>
      {children}
    </Link>
  );
}

/** ราคาแบบสั้น "1.37 ล้าน" — ใช้ในที่แคบ (ชิป/การ์ดมือถือ) ไม่ใช้แทนราคาเต็มในตาราง */
export function shortTHB(amount: number): string {
  if (amount >= 1_000_000) {
    const m = amount / 1_000_000;
    // 1.5 ล้าน / 2.1 ล้าน — ทศนิยมตำแหน่งเดียวพอ (สองตำแหน่งอ่านแล้วสะดุด)
    return `${m.toFixed(1)} ล้าน`;
  }
  return `${Math.round(amount / 1000).toLocaleString("en-US")},000`;
}

/** แถบเตือนบนสุดของทุกหน้าลอง — กันเข้าใจผิดว่าเป็นเว็บจริง */
export function ProtoRibbon({ dirLabel }: { dirLabel: string }) {
  return (
    <div className="bg-warning-soft px-4 py-1.5 text-center text-[11px] text-warning">
      หน้าลอง — {dirLabel} · ข้อมูลตายตัวจากฐานข้อมูลจริง (ไม่อัปเดตตามระบบ)
    </div>
  );
}
