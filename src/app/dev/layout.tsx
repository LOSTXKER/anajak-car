import type { Metadata } from "next";

// ── MOCKUP zone (M23 shell compare) — noindex · ลบทั้งโฟลเดอร์หลังเบสเลือก ──
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function DevLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
