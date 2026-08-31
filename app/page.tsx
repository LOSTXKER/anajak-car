import { สรุปทุกโฉม, สรุปทุกรุ่น, รถที่ลดราคา, listings, taxonomy, เก็บเมื่อ, ล้าน, บาท, modelSlug } from '@/lib/data'
import { แถบมูลค่า, คิดจาก } from '@/components/bits'

export default function หน้าแรก() {
  const โฉม = สรุปทุกโฉม()
  const รุ่น = สรุปทุกรุ่น()
  const ลดราคา = รถที่ลดราคา()

  // อันดับค่าเสื่อม — เอาเฉพาะโฉมที่ยังขายป้ายแดง และมีตัวอย่างพอ (เรียงเสื่อมหนักขึ้นก่อน)
  const อันดับเสื่อม = โฉม.filter(g => g.ค่าเสื่อม).sort((a, b) => a.ค่าเสื่อม!.เหลือกี่เปอร์เซ็นต์ - b.ค่าเสื่อม!.เหลือกี่เปอร์เซ็นต์)

  return (
    <>
      <h1>รถเบนซ์ในตลาดไทย — ราคาและค่าเสื่อมจากของที่ประกาศขายจริง</h1>
      <p className="sub">
        ไม่ใช่ราคาประเมิน ไม่ใช่ความรู้สึก — นับจากประกาศขายที่มีอยู่จริงในตลาด ณ วันที่เก็บ
      </p>

      <div className="panel">
        <div className="stats">
          <div className="stat"><div className="k">ประกาศที่นับ</div><div className="v num">{listings.length.toLocaleString()}</div></div>
          <div className="stat"><div className="k">รุ่น</div><div className="v num">{taxonomy._meta.นับได้.รุ่น}</div></div>
          <div className="stat"><div className="k">โฉม</div><div className="v num">{taxonomy._meta.นับได้.โฉม}</div></div>
          <div className="stat"><div className="k">รุ่นย่อย</div><div className="v num">{taxonomy._meta.นับได้.รุ่นย่อย}</div></div>
          <div className="stat"><div className="k">เพิ่งลดราคา</div><div className="v num" style={{ color: 'var(--down)' }}>{ลดราคา.length}</div></div>
        </div>
      </div>

      <div className="grid2">
        <section className="panel">
          <div className="panel-head">
            <h2>ค่าเสื่อมหนักสุด</h2>
            <span className="note">รถอายุ 2–4 ปี เทียบราคาป้ายแดงวันนี้</span>
          </div>
          <div className="tablewrap">
            <table>
              <thead>
                <tr><th>รุ่น / โฉม</th><th className="r">ป้ายแดง</th><th className="r">มือสอง</th><th>เหลือ</th></tr>
              </thead>
              <tbody>
                {อันดับเสื่อม.map(g => (
                  <tr key={g.รุ่น + g.slug}>
                    <td>
                      <a href={`/benz/${modelSlug(g.รุ่น)}/${g.slug}`}>
                        <span className="model">{g.รุ่น}</span> <span className="gen">{g.โฉม.replace(/ ปี.*/, '')}</span>
                      </a>
                      <div><คิดจาก n={g.ค่าเสื่อม!.คิดจากกี่คัน} /></div>
                    </td>
                    <td className="r num thin">{ล้าน(g.ค่าเสื่อม!.ป้ายแดง)}</td>
                    <td className="r num">{ล้าน(g.ค่าเสื่อม!.มือสองกลาง)}</td>
                    <td><แถบมูลค่า เปอร์เซ็นต์={g.ค่าเสื่อม!.เหลือกี่เปอร์เซ็นต์} คิดจากกี่คัน={g.ค่าเสื่อม!.คิดจากกี่คัน} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="footnote">แถบยาว = ยังเหลือมูลค่ามาก · เทียบเฉพาะโฉมเดียวกันเท่านั้น ไม่เอาโฉมเก่ามาปน</div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>เพิ่งลดราคา</h2>
            <span className="note">{ลดราคา.length} คันที่ผู้ขายหั่นราคาลง</span>
          </div>
          <div className="tablewrap">
            <table>
              <thead>
                <tr><th>คัน</th><th className="r">จาก</th><th className="r">เหลือ</th><th className="r">ลด</th></tr>
              </thead>
              <tbody>
                {ลดราคา.slice(0, 12).map(c => (
                  <tr key={c.id}>
                    <td>
                      <span className="num thin">{c.ปี}</span> <span className="model">{c.รุ่น}</span>
                      <div className="gen">{c.รุ่นย่อย} · {c.โฉม.replace(/ ปี.*/, '')}</div>
                    </td>
                    <td className="r num thin" style={{ textDecoration: 'line-through' }}>{บาท(c.ราคาก่อนลด)}</td>
                    <td className="r num">{บาท(c.ราคา)}</td>
                    <td className="r num" style={{ color: 'var(--down)' }}>−{บาท(c.ราคาก่อนลด! - c.ราคา!)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="footnote">ราคาที่ผู้ขายเคยตั้งไว้ เทียบกับที่ตั้งอยู่ตอนนี้ · เก็บ {เก็บเมื่อ}</div>
        </section>
      </div>

      <section className="panel">
        <div className="panel-head">
          <h2>รุ่นที่มีของขายมากที่สุด</h2>
          <span className="note">ยิ่งเยอะ ยิ่งเทียบราคาได้แม่น</span>
        </div>
        <div className="tablewrap">
          <table>
            <thead>
              <tr><th>รุ่น</th><th className="r">ประกาศ</th><th className="r">โฉม</th><th className="r">ถูกสุด</th><th className="r">ราคากลาง</th><th className="r">แพงสุด</th><th className="r">ป้ายแดงวันนี้</th></tr>
            </thead>
            <tbody>
              {รุ่น.slice(0, 14).map(m => (
                <tr key={m.slug}>
                  <td><a href={`/benz/${m.slug}`} className="model">{m.ชื่อ}</a></td>
                  <td className="r num">{m.ประกาศ}</td>
                  <td className="r num thin">{m.โฉม}</td>
                  <td className="r num thin">{ล้าน(m.ราคาต่ำสุด)}</td>
                  <td className="r num">{ล้าน(m.ราคากลาง)}</td>
                  <td className="r num thin">{ล้าน(m.ราคาสูงสุด)}</td>
                  <td className="r num thin">{m.ป้ายแดง ? ล้าน(m.ป้ายแดง) : <span className="tag weak">เลิกขายแล้ว</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="footnote"><a href="/benz" style={{ color: 'var(--accent)' }}>ดูรุ่นทั้งหมด {รุ่น.length} รุ่น →</a></div>
      </section>
    </>
  )
}
