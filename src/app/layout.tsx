import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-thai",
  subsets: ["thai", "latin"],
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

// ตั้ง data-theme ก่อน paint กันธีมกะพริบ (FOUC) — ต้องเป็น inline script เท่านั้น
// + ถอน service worker แปลกปลอมบน origin นี้ (CARMETA ไม่ใช้ SW · public/sw.js เป็น kill-switch คู่กัน)
const themeInitScript = `try{var t=localStorage.getItem("carmeta-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}
try{if("serviceWorker"in navigator)navigator.serviceWorker.getRegistrations().then(function(rs){rs.forEach(function(r){r.unregister()})}).catch(function(){})}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansThai.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
