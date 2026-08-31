import { สรุปทุกโฉม, สรุปทุกรุ่น, รถที่ลดราคา, listings, taxonomy, เก็บเมื่อ, ล้าน, บาท, modelSlug, ชื่อสวย } from '@/lib/data'
import { แถบมูลค่า, คิดจาก } from '@/components/bits'

export default function หน้าแรก() {
  const โฉม = สรุปทุกโฉม()
  const รุ่น = สรุปทุกรุ่น()
  const ลดราคา = รถที่ลดราคา()
  const อันดับเสื่อม = โฉม.filter(g => g.ค่าเสื่อม).sort((a, b) => a.ค่าเสื่อม!.เหลือกี่เปอร์เซ็นต์ - b.ค่าเสื่อม!.เหลือกี่เปอร์เซ็นต์)

  return (
    <>
      <div className="emoji-title">🚗</div>
      <h1>ฐานข้อมูลรถเบนซ์ในตลาดไทย</h1>
      <p className="lede">ราคาและค่าเสื่อมที่นับจากประกาศขายจริง ไม่ใช่ราคาประเมิน</p>

      <div className="callout">
        <span className="ico">📌</span>
        <span className="body">
          ตัวเลขทุกตัวในหน้านี้มาจาก <b>ประกาศขายที่มีอยู่จริงในตลาด</b> ณ วันที่ {เก็บเมื่อ} —
          เป็นราคาที่ผู้ขายตั้งไว้ ยังไม่ต่อรอง จึงสูงกว่าราคาที่ปิดจริง ·
          ทุกแถวบอกด้วยว่า<b>คิดจากรถกี่คัน</b> ถ้าน้อยกว่า 10 คันแปลว่ายังสรุปไม่ได้
        </span>
      </div>

      <div className="props">
        <div className="prop"><div className="k">ประกาศที่นับ</div><div className="v num">{listings.length.toLocaleString()}</div></div>
        <div className="prop"><div className="k">รุ่น</div><div className="v num">{taxonomy._meta.นับได้.รุ่น}</div></div>
        <div className="prop"><div className="k">โฉม</div><div className="v num">{taxonomy._meta.นับได้.โฉม}</div></div>
        <div className="prop"><div className="k">รุ่นย่อย</div><div className="v num">{taxonomy._meta.นับได้.รุ่นย่อย}</div></div>
        <div className="prop"><div className="k">เพิ่งลดราคา</div><div className="v num" style={{ color: 'var(--red-fg)' }}>{ลดราคา.length}</div></div>
      </div>

      <h2>📉 ค่าเสื่อมหนักสุด <span className="h2note">รถอายุ 2–4 ปี เทียบราคาป้ายแดงวันนี้ · เทียบเฉพาะโฉมเดียวกัน</span></h2>
      <div className="tablewrap">
        <table>
          <thead>
            <tr><th>รุ่น / โฉม</th><th className="r">ป้ายแดง</th><th className="r">มือสอง</th><th>เหลือมูลค่า</th><th>คิดจาก</th></tr>
          </thead>
          <tbody>
            {อันดับเสื่อม.map(g => (
              <tr key={g.รุ่น + g.slug}>
                <td>
                  <a href={`/benz/${modelSlug(g.รุ่น)}/${g.slug}`} className="rowlink">{ชื่อสวย(g.รุ่น)}</a>
                  <span className="sub2"> · {g.โฉม.replace(/ ปี.*/, '')}</span>
                </td>
                <td className="r num thin">{ล้าน(g.ค่าเสื่อม!.ป้ายแดง)}</td>
                <td className="r num">{ล้าน(g.ค่าเสื่อม!.มือสองกลาง)}</td>
                <td><แถบมูลค่า เปอร์เซ็นต์={g.ค่าเสื่อม!.เหลือกี่เปอร์เซ็นต์} คิดจากกี่คัน={g.ค่าเสื่อม!.คิดจากกี่คัน} /></td>
                <td><คิดจาก n={g.ค่าเสื่อม!.คิดจากกี่คัน} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="note">แถบยาว = ยังเหลือมูลค่ามาก · แถวสีเทาคือตัวอย่างน้อยเกินกว่าจะเชื่อได้</div>

      <h2>🔻 เพิ่งลดราคา <span className="h2note">{ลดราคา.length} คันที่ผู้ขายหั่นราคาลงจากที่เคยตั้งไว้</span></h2>
      <div className="tablewrap">
        <table>
          <thead>
            <tr><th>คัน</th><th>รุ่นย่อย</th><th className="r">เคยตั้ง</th><th className="r">ตอนนี้</th><th className="r">ลดลง</th></tr>
          </thead>
          <tbody>
            {ลดราคา.slice(0, 10).map(c => (
              <tr key={c.id}>
                <td>
                  <span className="num thin">{c.ปี}</span> <span className="rowlink">{ชื่อสวย(c.รุ่น)}</span>
                  <span className="sub2"> · {c.โฉม.replace(/ ปี.*/, '')}</span>
                </td>
                <td className="sub2">{ชื่อสวย(c.รุ่นย่อย)}</td>
                <td className="r num sub2" style={{ textDecoration: 'line-through' }}>{บาท(c.ราคาก่อนลด)}</td>
                <td className="r num">{บาท(c.ราคา)}</td>
                <td className="r"><span className="chip red">−{บาท(c.ราคาก่อนลด! - c.ราคา!)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>🚘 รุ่นที่มีของขายมากที่สุด <span className="h2note">ยิ่งมีของเยอะ ราคายิ่งน่าเชื่อ เพราะเทียบได้หลายคัน</span></h2>
      <div className="tablewrap">
        <table>
          <thead>
            <tr><th>รุ่น</th><th className="r">ประกาศ</th><th className="r">โฉม</th><th className="r">ถูกสุด</th><th className="r">ราคากลาง</th><th className="r">แพงสุด</th><th className="r">ป้ายแดงวันนี้</th></tr>
          </thead>
          <tbody>
            {รุ่น.slice(0, 12).map(m => (
              <tr key={m.slug}>
                <td><a href={`/benz/${m.slug}`} className="rowlink">{ชื่อสวย(m.ชื่อ)}</a></td>
                <td className="r num">{m.ประกาศ}</td>
                <td className="r num thin">{m.โฉม}</td>
                <td className="r num thin">{ล้าน(m.ราคาต่ำสุด)}</td>
                <td className="r num">{ล้าน(m.ราคากลาง)}</td>
                <td className="r num thin">{ล้าน(m.ราคาสูงสุด)}</td>
                <td className="r">{m.ป้ายแดง ? <span className="num thin">{ล้าน(m.ป้ายแดง)}</span> : <span className="chip">เลิกขายแล้ว</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="note"><a href="/benz" style={{ color: 'var(--blue-fg)' }}>ดูรุ่นทั้งหมด {รุ่น.length} รุ่น →</a></div>
    </>
  )
}
