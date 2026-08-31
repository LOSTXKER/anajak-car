import { notFound } from 'next/navigation'
import { ประกาศของโฉม, สรุปทุกโฉม, modelSlug, genSlug, listings, ล้าน, บาท, median } from '@/lib/data'
import { แถบมูลค่า, คิดจาก } from '@/components/bits'

export function generateStaticParams() {
  const seen = new Set<string>()
  return listings.flatMap(c => {
    const k = modelSlug(c.รุ่น) + '/' + genSlug(c.โฉม)
    if (seen.has(k)) return []
    seen.add(k)
    return [{ model: modelSlug(c.รุ่น), gen: genSlug(c.โฉม) }]
  })
}

export default async function หน้าโฉม({ params }: { params: Promise<{ model: string; gen: string }> }) {
  const { model, gen } = await params
  const คัน = ประกาศของโฉม(model, gen)
  if (คัน.length === 0) notFound()

  const สรุป = สรุปทุกโฉม().find(g => modelSlug(g.รุ่น) === model && g.slug === gen)!

  // แยกตามรุ่นย่อย — หน่วยที่คนเทียบกันจริงตอนจะซื้อ
  const รุ่นย่อย = new Map<string, typeof คัน>()
  for (const c of คัน) {
    const k = c.รุ่นย่อย || '(ไม่ระบุรุ่นย่อย)'
    if (!รุ่นย่อย.has(k)) รุ่นย่อย.set(k, [])
    รุ่นย่อย.get(k)!.push(c)
  }
  const ตารางรุ่นย่อย = [...รุ่นย่อย.entries()].map(([ชื่อ, cs]) => {
    const ราคา = cs.map(c => c.ราคา).filter((n): n is number => n != null).sort((a, b) => a - b)
    const ปี = cs.map(c => c.ปี).filter((n): n is number => n != null).sort((a, b) => a - b)
    return { ชื่อ, จำนวน: cs.length, กลาง: median(ราคา), ต่ำ: ราคา[0] ?? null, สูง: ราคา[ราคา.length - 1] ?? null, ปีแรก: ปี[0], ปีสุดท้าย: ปี[ปี.length - 1] }
  }).sort((a, b) => b.จำนวน - a.จำนวน)

  return (
    <>
      <div className="crumb">
        <a href="/">หน้าแรก</a> / <a href="/benz">รุ่นทั้งหมด</a> / <a href={`/benz/${model}`}>{สรุป.รุ่น}</a> / {สรุป.โฉม.split(' ')[0]}
      </div>
      <h1>{สรุป.รุ่น} โฉม {สรุป.โฉม}</h1>
      <p className="sub">
        มีประกาศขายอยู่ {สรุป.ประกาศ} คัน · ราคากลาง {ล้าน(สรุป.ราคากลาง)} · ช่วง {ล้าน(สรุป.ราคาต่ำสุด)}–{ล้าน(สรุป.ราคาสูงสุด)}
        {สรุป.ค่าเสื่อม && ` · รถอายุ 2–4 ปีเหลือมูลค่า ${สรุป.ค่าเสื่อม.เหลือกี่เปอร์เซ็นต์}% ของป้ายแดงวันนี้`}
      </p>

      {สรุป.ค่าเสื่อม && (
        <div className="panel">
          <div className="stats">
            <div className="stat"><div className="k">ป้ายแดงวันนี้</div><div className="v num">{ล้าน(สรุป.ค่าเสื่อม.ป้ายแดง)}</div></div>
            <div className="stat"><div className="k">มือสอง 2–4 ปี (กลาง)</div><div className="v num">{ล้าน(สรุป.ค่าเสื่อม.มือสองกลาง)}</div></div>
            <div className="stat">
              <div className="k">เหลือมูลค่า</div>
              <div className="v"><แถบมูลค่า เปอร์เซ็นต์={สรุป.ค่าเสื่อม.เหลือกี่เปอร์เซ็นต์} คิดจากกี่คัน={สรุป.ค่าเสื่อม.คิดจากกี่คัน} /></div>
              <คิดจาก n={สรุป.ค่าเสื่อม.คิดจากกี่คัน} />
            </div>
          </div>
        </div>
      )}

      <section className="panel">
        <div className="panel-head"><h2>รุ่นย่อยในโฉมนี้</h2><span className="note">{ตารางรุ่นย่อย.length} รุ่นย่อยที่เจอในตลาด</span></div>
        <div className="tablewrap">
          <table>
            <thead><tr><th>รุ่นย่อย</th><th className="r">มีขาย</th><th className="r">ปีที่เจอ</th><th className="r">ถูกสุด</th><th className="r">ราคากลาง</th><th className="r">แพงสุด</th></tr></thead>
            <tbody>
              {ตารางรุ่นย่อย.map(t => (
                <tr key={t.ชื่อ}>
                  <td className="model">{t.ชื่อ}</td>
                  <td className="r num">{t.จำนวน}</td>
                  <td className="r num thin">{t.ปีแรก === t.ปีสุดท้าย ? t.ปีแรก : `${t.ปีแรก}–${t.ปีสุดท้าย}`}</td>
                  <td className="r num thin">{ล้าน(t.ต่ำ)}</td>
                  <td className="r num">{ล้าน(t.กลาง)}</td>
                  <td className="r num thin">{ล้าน(t.สูง)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <div className="panel-head"><h2>ประกาศที่ขายอยู่ตอนนี้</h2><span className="note">เรียงราคาจากถูกไปแพง</span></div>
        <div className="tablewrap">
          <table>
            <thead><tr><th className="r">ปี</th><th>รุ่นย่อย</th><th>พาดหัวประกาศ</th><th className="r">ราคา</th><th className="r">คนดู</th></tr></thead>
            <tbody>
              {[...คัน].sort((a, b) => (a.ราคา ?? 0) - (b.ราคา ?? 0)).map(c => (
                <tr key={c.id}>
                  <td className="r num thin">{c.ปี}</td>
                  <td>{c.รุ่นย่อย}</td>
                  <td className="thin" style={{ maxWidth: 380, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.พาดหัวประกาศ || '—'}
                    {c.ราคาก่อนลด && c.ราคา && c.ราคาก่อนลด > c.ราคา && (
                      <span className="tag down" style={{ marginLeft: 8 }}>ลด {บาท(c.ราคาก่อนลด - c.ราคา)}</span>
                    )}
                  </td>
                  <td className="r num">{บาท(c.ราคา)}</td>
                  <td className="r num thin">{c.ยอดวิว.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="footnote">ยอดคนดูสะท้อนว่าประกาศลงมานานแค่ไหนด้วย ไม่ได้แปลว่ารุ่นนั้นฮิตกว่าเสมอไป</div>
      </section>
    </>
  )
}
