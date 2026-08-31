import { สรุปทุกรุ่น, taxonomy, ล้าน } from '@/lib/data'
import { แถบมูลค่า, คิดจาก } from '@/components/bits'

export const metadata = { title: 'รุ่นรถ Mercedes-Benz ทั้งหมดในไทย — anajak-car' }

export default function หน้ารุ่นทั้งหมด() {
  const รุ่น = สรุปทุกรุ่น()
  const มีของขาย = รุ่น.filter(m => m.ประกาศ > 0)
  const ไม่มีของ = taxonomy.รุ่น.filter(t => !รุ่น.some(m => m.ชื่อ.toUpperCase() === t.name.toUpperCase()))

  return (
    <>
      <div className="crumb"><a href="/">หน้าแรก</a> / รุ่นทั้งหมด</div>
      <h1>Mercedes-Benz ในไทย — {มีของขาย.length} รุ่นที่มีของขายอยู่</h1>
      <p className="sub">เรียงตามจำนวนประกาศ · รุ่นที่มีของเยอะ = ราคาน่าเชื่อถือกว่า เพราะเทียบกันได้หลายคัน</p>

      <section className="panel">
        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th>รุ่น</th><th className="r">ประกาศ</th><th className="r">โฉม</th>
                <th className="r">ช่วงราคามือสอง</th><th className="r">ป้ายแดงวันนี้</th><th>ค่าเสื่อมโฉมล่าสุด</th>
              </tr>
            </thead>
            <tbody>
              {มีของขาย.map(m => (
                <tr key={m.slug}>
                  <td><a href={`/benz/${m.slug}`} className="model">{m.ชื่อ}</a></td>
                  <td className="r num">{m.ประกาศ}</td>
                  <td className="r num thin">{m.โฉม}</td>
                  <td className="r num thin">{ล้าน(m.ราคาต่ำสุด)} – {ล้าน(m.ราคาสูงสุด)}</td>
                  <td className="r num thin">{m.ป้ายแดง ? ล้าน(m.ป้ายแดง) : <span className="tag weak">เลิกขายแล้ว</span>}</td>
                  <td>
                    {m.ค่าเสื่อมเด่น
                      ? <><แถบมูลค่า เปอร์เซ็นต์={m.ค่าเสื่อมเด่น.เหลือกี่เปอร์เซ็นต์} คิดจากกี่คัน={m.ค่าเสื่อมเด่น.คิดจากกี่คัน} /> <คิดจาก n={m.ค่าเสื่อมเด่น.คิดจากกี่คัน} /></>
                      : <span className="sample">เทียบไม่ได้ — ไม่มีขายป้ายแดงแล้ว</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {ไม่มีของ.length > 0 && (
        <section className="panel">
          <div className="panel-head"><h2>รุ่นที่รู้จักแต่ยังไม่เจอประกาศขาย</h2><span className="note">{ไม่มีของ.length} รุ่น</span></div>
          <div className="footnote">{ไม่มีของ.map(t => t.name).join(' · ')}</div>
        </section>
      )}
    </>
  )
}
