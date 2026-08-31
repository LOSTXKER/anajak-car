import { ตัวอย่างพอเชื่อ } from '@/lib/data'

// แถบค่าเสื่อม: ยาว = ยังเหลือมูลค่ามาก · สีบอกทิศ ไม่ได้ใส่เพราะสวย (DESIGN.md)
export function แถบมูลค่า({ เปอร์เซ็นต์, คิดจากกี่คัน }: { เปอร์เซ็นต์: number; คิดจากกี่คัน: number }) {
  const น่าเชื่อ = คิดจากกี่คัน >= ตัวอย่างพอเชื่อ
  const สี = !น่าเชื่อ ? 'var(--dim)' : เปอร์เซ็นต์ < 60 ? 'var(--down)' : เปอร์เซ็นต์ < 75 ? 'var(--warn)' : 'var(--up)'
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span className="bar"><i style={{ width: Math.min(100, เปอร์เซ็นต์) + '%', background: สี }} /></span>
      <span className="num" style={{ color: สี, minWidth: 34, display: 'inline-block' }}>{เปอร์เซ็นต์}%</span>
    </span>
  )
}

// ทุกตัวเลขต้องบอกว่าคิดจากกี่คัน — น้อยเกินไปต้องเตือน ไม่ใช่ปล่อยให้เข้าใจผิด
export function คิดจาก({ n }: { n: number }) {
  return n >= ตัวอย่างพอเชื่อ
    ? <span className="sample">จาก {n} คัน</span>
    : <span className="sample" title="ตัวอย่างน้อย ยังสรุปไม่ได้แน่">จาก {n} คัน ⚠</span>
}
