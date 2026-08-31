import type { Metadata } from 'next'
import { Inter, Noto_Sans_Thai } from 'next/font/google'
import './globals.css'
import { เก็บเมื่อ, สรุปทุกรุ่น, ชื่อสวย } from '@/lib/data'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--f-latin' })
const thai = Noto_Sans_Thai({ subsets: ['thai'], weight: ['400', '500', '600', '700'], display: 'swap', variable: '--f-thai' })

export const metadata: Metadata = {
  title: 'anajak-car — ฐานข้อมูลรถยนต์ไทย',
  description: 'ข้อมูลรถ ราคา และค่าเสื่อมจริงจากตลาดมือสองไทย แยกตามรุ่นและโฉม',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const รุ่นยอดนิยม = สรุปทุกรุ่น().slice(0, 8)

  return (
    <html lang="th">
      <body className={`${thai.variable} ${inter.variable}`} style={{ fontFamily: 'var(--f-thai), var(--f-latin), ui-sans-serif, system-ui, sans-serif' }}>
        <div className="shell">
          <nav className="side">
            <a href="/" className="side-brand"><span className="mark">ก</span> anajak-car</a>

            <a href="/" className="item"><span className="ico">📊</span> ภาพรวม</a>
            <a href="/benz" className="item"><span className="ico">🚘</span> รุ่นทั้งหมด</a>

            <div className="side-label">รุ่นที่มีของขายมาก</div>
            {รุ่นยอดนิยม.map(m => (
              <a key={m.slug} href={`/benz/${m.slug}`} className="item">
                <span className="ico">›</span> {ชื่อสวย(m.ชื่อ)}
                <span className="count">{m.ประกาศ}</span>
              </a>
            ))}

            <div className="stamp">ข้อมูลอัปเดต {เก็บเมื่อ}</div>
          </nav>

          <div className="page">
            <div className="page-inner">
              {children}
              <div className="pagefoot">
                ราคาทั้งหมดคือ<b> ราคาที่ผู้ขายตั้งไว้ในประกาศ</b> ไม่ใช่ราคาที่ปิดการขายจริง ·
                ราคาป้ายแดงเป็นราคาวันนี้จากเว็บ Mercedes-Benz ไม่ใช่ราคาตอนรถคันนั้นออกจากโชว์รูม ·
                ตัวเลขที่คิดจากรถไม่ถึง 10 คัน ยังสรุปอะไรไม่ได้แน่
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
