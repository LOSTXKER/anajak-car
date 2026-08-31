import { สรุปทุกรุ่น, taxonomy, ล้าน, ชื่อสวย } from '@/lib/data'
import { แถบมูลค่า, คิดจาก } from '@/components/bits'

export const metadata = { title: 'รุ่นรถ Mercedes-Benz ทั้งหมดในไทย — anajak-car' }

export default function หน้ารุ่นทั้งหมด() {
  const รุ่น = สรุปทุกรุ่น()
  const ไม่มีของ = taxonomy.รุ่น.filter(t => !รุ่น.some(m => m.ชื่อ.toUpperCase() === t.name.toUpperCase()))

  return (
    <>
      <div className="crumb"><a href="/">ภาพรวม</a> / รุ่นทั้งหมด</div>
      <div className="emoji-title">🚘</div>
      <h1>Mercedes-Benz ในไทย</h1>
      <p className="lede">{รุ่น.length} รุ่นที่มีของขายอยู่ตอนนี้ · เรียงตามจำนวนประกาศ</p>

      <div className="tablewrap">
        <table>
          <thead>
            <tr>
              <th>รุ่น</th><th className="r">ประกาศ</th><th className="r">โฉม</th>
              <th className="r">ช่วงราคามือสอง</th><th className="r">ป้ายแดงวันนี้</th><th>ค่าเสื่อมโฉมล่าสุด</th>
            </tr>
          </thead>
          <tbody>
            {รุ่น.map(m => (
              <tr key={m.slug}>
                <td><a href={`/benz/${m.slug}`} className="rowlink">{ชื่อสวย(m.ชื่อ)}</a></td>
                <td className="r num">{m.ประกาศ}</td>
                <td className="r num thin">{m.โฉม}</td>
                <td className="r num thin">{ล้าน(m.ราคาต่ำสุด)} – {ล้าน(m.ราคาสูงสุด)}</td>
                <td className="r">{m.ป้ายแดง ? <span className="num thin">{ล้าน(m.ป้ายแดง)}</span> : <span className="chip">เลิกขายแล้ว</span>}</td>
                <td>
                  {m.ค่าเสื่อมเด่น
                    ? <span style={{ display: 'inline-flex', gap: 10, alignItems: 'center' }}>
                        <แถบมูลค่า เปอร์เซ็นต์={m.ค่าเสื่อมเด่น.เหลือกี่เปอร์เซ็นต์} คิดจากกี่คัน={m.ค่าเสื่อมเด่น.คิดจากกี่คัน} />
                        <คิดจาก n={m.ค่าเสื่อมเด่น.คิดจากกี่คัน} />
                      </span>
                    : <span className="sub2">เทียบไม่ได้ — ไม่มีขายป้ายแดงแล้ว</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {ไม่มีของ.length > 0 && (
        <>
          <h2>🗂 รุ่นที่รู้จักแต่ยังไม่เจอประกาศขาย <span className="h2note">{ไม่มีของ.length} รุ่น</span></h2>
          <p className="sub2">{ไม่มีของ.map(t => ชื่อสวย(t.name)).join(' · ')}</p>
        </>
      )}
    </>
  )
}
