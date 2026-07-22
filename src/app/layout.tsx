import type { Metadata } from "next";
import { Kanit, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

// ฟอนต์หลักทั้งเว็บ = Kanit (เบสเลือก · geometric ยุคใหม่ รองรับไทย+ละติน)
const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

// Geist Mono = ตัวเลข tabular (ราคา/ปี/จำนวน) ให้เรียงหลักตรง — Kanit ไม่มี tabular จริง
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CARMETA — ฐานข้อมูลรถไทยที่ตรวจสอบได้",
    template: "%s | CARMETA",
  },
  description:
    "ฐานข้อมูลรถยนต์ไทย: ราคาป้าย สเปก เจเนอเรชัน และประวัติการเปลี่ยนแปลง — ทุกตัวเลขผูกแหล่งอ้างอิงที่ตรวจสอบได้",
  openGraph: {
    title: "CARMETA — ฐานข้อมูลรถไทยที่ตรวจสอบได้",
    description:
      "ราคาป้าย สเปก เจเนอเรชัน และประวัติการเปลี่ยนแปลงของรถในไทย — ทุกตัวเลขผูกแหล่งอ้างอิงที่ตรวจสอบได้",
    images: ["/brand/og-image.png"],
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CARMETA — ฐานข้อมูลรถไทยที่ตรวจสอบได้",
    images: ["/brand/og-image.png"],
  },
};

// ถอน service worker แปลกปลอมบน origin นี้ (CARMETA ไม่ใช้ SW · public/sw.js เป็น kill-switch คู่กัน)
// (ตัด theme init ออก — เว็บเป็น light-only แล้ว)
const swKillScript = `try{if("serviceWorker"in navigator)navigator.serviceWorker.getRegistrations().then(function(rs){rs.forEach(function(r){r.unregister()})}).catch(function(){})}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${kanit.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <script dangerouslySetInnerHTML={{ __html: swKillScript }} />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
