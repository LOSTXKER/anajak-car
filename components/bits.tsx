import { ตัวอย่างพอเชื่อ } from '@/lib/data'

// แถบมูลค่าคงเหลือ: ยาว = ยังเหลือมูลค่ามาก · สีบอกทิศ ไม่ได้ใส่เพราะสวย (DESIGN.md)
export function แถบมูลค่า({ เปอร์เซ็นต์, คิดจากกี่คัน }: { เปอร์เซ็นต์: number; คิดจากกี่คัน: number }) {
  const น่าเชื่อ = คิดจากกี่คัน >= ตัวอย่างพอเชื่อ
  const โทน = !น่าเชื่อ ? 'gray' : เปอร์เซ็นต์ < 60 ? 'red' : เปอร์เซ็นต์ < 75 ? 'yellow' : 'green'
  const สี = { red: 'var(--red-fg)', yellow: 'var(--yellow-fg)', green: 'var(--green-fg)', gray: 'var(--light)' }[โทน]
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span className="bar"><i style={{ width: Math.min(100, เปอร์เซ็นต์) + '%', background: สี }} /></span>
      <span className={`chip ${โทน}`}>{เปอร์เซ็นต์}%</span>
    </span>
  )
}

// ทุกตัวเลขต้องบอกว่าคิดจากกี่คัน — น้อยเกินไปต้องเตือน ไม่ใช่ปล่อยให้เข้าใจผิด
export function คิดจาก({ n }: { n: number }) {
  return n >= ตัวอย่างพอเชื่อ
    ? <span className="sub2">จาก {n} คัน</span>
    : <span className="sub2" title="ตัวอย่างน้อย ยังสรุปไม่ได้แน่">จาก {n} คัน · ยังน้อย</span>
}
