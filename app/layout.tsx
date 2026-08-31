import type { Metadata } from 'next'
import { Kanit } from 'next/font/google'
import './globals.css'
import { เก็บเมื่อ } from '@/lib/data'

const kanit = Kanit({ subsets: ['thai', 'latin'], weight: ['400', '500', '600'], display: 'swap' })

export const metadata: Metadata = {
  title: 'anajak-car — ฐานข้อมูลรถยนต์ไทย',
  description: 'ข้อมูลรถ ราคา และค่าเสื่อมจริงจากตลาดมือสองไทย แยกตามรุ่นและโฉม',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className={kanit.className}>
        <div className="topbar">
          <div className="wrap">
            <a href="/" className="brand">anajak<span>-car</span></a>
            <a href="/benz" className="navlink">รุ่นรถทั้งหมด</a>
            <div className="spacer" />
            <span className="stamp">ข้อมูล {เก็บเมื่อ}</span>
          </div>
        </div>
        <main className="wrap">{children}</main>
        <footer>
          <div className="wrap">
            ราคาทั้งหมดคือ<b>ราคาที่ผู้ขายตั้งไว้ในประกาศ</b> ไม่ใช่ราคาที่ปิดการขายจริง ·
            ราคาป้ายแดงเป็นราคาวันนี้จากเว็บ Mercedes-Benz ไม่ใช่ราคาตอนรถคันนั้นออกจากโชว์รูม ·
            ตัวเลขที่คิดจากรถไม่ถึง 10 คัน ยังสรุปอะไรไม่ได้แน่
          </div>
        </footer>
      </body>
    </html>
  )
}
