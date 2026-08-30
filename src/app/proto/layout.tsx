import type { Metadata } from "next";

/**
 * หน้าใต้ /proto = หน้าลอง — ตัวเลข/ราคาในนี้เป็นชุดข้อมูลตายตัว (ไม่ได้ยิง DB)
 * หลุดขึ้นสารบัญ Google เมื่อไหร่ = ข้อมูลเก่า/ครึ่งใบถูกอ้างว่าเป็นของเว็บจริง
 * → noindex ที่ชั้นนี้ ครอบทุกหน้าลูก (จงใจให้ crawl ได้ ห้ามบล็อกใน robots.txt
 *   เพราะบล็อกแล้ว Google จะไม่มีวันอ่าน noindex เจอ)
 */
export const metadata: Metadata = {
  title: "หน้าลอง (Prototype)",
  robots: { index: false, follow: false, nocache: true },
};

export default function ProtoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
