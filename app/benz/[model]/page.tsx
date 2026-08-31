import { notFound } from 'next/navigation'
import { สรุปทุกโฉม, สรุปทุกรุ่น, listings, modelSlug, ล้าน, ชื่อสวย } from '@/lib/data'
import { แถบมูลค่า, คิดจาก } from '@/components/bits'

export function generateStaticParams() {
  return [...new Set(listings.map(c => modelSlug(c.รุ่น)))].map(model => ({ model }))
}

export default async function หน้ารุ่น({ params }: { params: Promise<{ model: string }> }) {
  const { model } = await params
  const ข้อมูลรุ่น = สรุปทุกรุ่น().find(m => m.slug === model)
  if (!ข้อมูลรุ่น) notFound()

  const โฉม = สรุปทุกโฉม().filter(g => modelSlug(g.รุ่น) === model)
    .sort((a, b) => Number(b.ยังขายป้ายแดง) - Number(a.ยังขายป้ายแดง) || b.โฉม.localeCompare(a.โฉม))

  return (
    <>
      <div className="crumb"><a href="/">ภาพรวม</a> / <a href="/benz">รุ่นทั้งหมด</a> / {ชื่อสวย(ข้อมูลรุ่น.ชื่อ)}</div>
      <div className="emoji-title">🚙</div>
      <h1>Mercedes-Benz {ชื่อสวย(ข้อมูลรุ่น.ชื่อ)}</h1>
      <p className="lede">
        {โฉม.length} โฉมที่เคยขายในไทย · มีประกาศขายอยู่ {ข้อมูลรุ่น.ประกาศ} คัน ·
        {ข้อมูลรุ่น.ป้ายแดง ? ` ป้ายแดงวันนี้เริ่มที่ ${ล้าน(ข้อมูลรุ่น.ป้ายแดง)}` : ' ไม่มีขายป้ายแดงแล้ว'}
      </p>

      <h2>🧬 แต่ละโฉม <span className="h2note">โฉมใหม่อยู่บน · กดเข้าไปดูรุ่นย่อยและประกาศจริงได้</span></h2>
      <div className="tablewrap">
        <table>
          <thead>
            <tr><th>โฉม</th><th className="r">ประกาศ</th><th className="r">ถูกสุด</th><th className="r">ราคากลาง</th><th className="r">แพงสุด</th><th>ค่าเสื่อม</th></tr>
          </thead>
          <tbody>
            {โฉม.map(g => (
              <tr key={g.slug}>
                <td>
                  <a href={`/benz/${model}/${g.slug}`} className="rowlink">{g.โฉม.split(' ')[0]}</a>
                  <span className="sub2"> {g.โฉม.replace(/^\S+\s*/, '')}</span>
                  {g.ยังขายป้ายแดง && <span className="chip green" style={{ marginLeft: 8 }}>ยังขายอยู่</span>}
                </td>
                <td className="r num">{g.ประกาศ}</td>
                <td className="r num thin">{ล้าน(g.ราคาต่ำสุด)}</td>
                <td className="r num">{ล้าน(g.ราคากลาง)}</td>
                <td className="r num thin">{ล้าน(g.ราคาสูงสุด)}</td>
                <td>
                  {g.ค่าเสื่อม
                    ? <span style={{ display: 'inline-flex', gap: 10, alignItems: 'center' }}>
                        <แถบมูลค่า เปอร์เซ็นต์={g.ค่าเสื่อม.เหลือกี่เปอร์เซ็นต์} คิดจากกี่คัน={g.ค่าเสื่อม.คิดจากกี่คัน} />
                        <คิดจาก n={g.ค่าเสื่อม.คิดจากกี่คัน} />
                      </span>
                    : <span className="sub2">{g.ยังขายป้ายแดง ? 'รถอายุ 2–4 ปียังน้อยเกินไป' : 'เทียบไม่ได้ — เลิกขายป้ายแดงแล้ว'}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="note">ค่าเสื่อมคิดจากรถอายุ 2–4 ปีในโฉมนั้น เทียบราคาป้ายแดงวันนี้ · โฉมที่เลิกขายแล้วเทียบไม่ได้ เพราะไม่มีราคาป้ายแดงให้อ้าง</div>
    </>
  )
}
