// อ่านข้อมูลที่เก็บมา แล้วสรุปเป็น "ตัวเลขที่ใช้จัดอันดับได้" — ค่าเสื่อม, ของขายเยอะแค่ไหน, ราคาที่กำลังลด
// ใช้: node scripts/analyze.mjs [ไฟล์ประกาศ] [ไฟล์ราคาป้ายแดง]
import fs from 'node:fs'

const listings = JSON.parse(fs.readFileSync(process.argv[2] || 'data/benz-listings-2026-08-31.json', 'utf8'))
const newPrices = JSON.parse(fs.readFileSync(process.argv[3] || 'data/benz-newprice-2026-08-31.json', 'utf8'))

const median = xs => { const s = [...xs].sort((a, b) => a - b); return s.length ? s[Math.floor(s.length / 2)] : null }
const baht = n => n == null ? '-' : (n / 1e6).toFixed(2) + 'ล'

// จับคู่ชื่อรุ่นของสองแหล่ง (เว็บทางการเรียก "C-Class Saloon" · ตลาดมือสองเรียก "C-CLASS")
const key = s => s.toUpperCase().replace(/[^A-Z]/g, '').replace(/SALOON|MPV|ROADSTER|COUPE|CLASS/g, '')
const newByKey = new Map()
for (const m of newPrices.รุ่น) {
  if (/MAYBACH|AMG/.test(m.ชื่อ)) continue     // รุ่นพิเศษ ไม่เอามาเทียบกับรุ่นปกติ
  const k = key(m.ชื่อ)
  if (!newByKey.has(k) || m.ราคาเริ่มต้น < newByKey.get(k)) newByKey.set(k, m.ราคาเริ่มต้น)
}

const thisYear = new Date().getFullYear()
const byModel = new Map()
for (const c of listings.ประกาศ) {
  if (!c.ราคา) continue
  const k = key(c.รุ่น)
  if (!byModel.has(k)) byModel.set(k, { ชื่อ: c.รุ่น, คัน: [] })
  byModel.get(k).คัน.push(c)
}

// ⚠️ ต้องแยกตามโฉมเสมอ — รวมโฉมเก่ากับโฉมใหม่เข้าด้วยกันทำให้ตัวเลขโกหก
// (เคสจริง: E-Class อายุ 2-4 ปี รวมทุกโฉม = เหลือ 41% แต่ดูเฉพาะ W214 โฉมปัจจุบัน = เหลือ 86%)
const rows = []
for (const [k, g] of byModel) {
  const newPrice = newByKey.get(k)
  if (!newPrice) continue                       // ไม่มีขายป้ายแดงแล้ว = เทียบค่าเสื่อมไม่ได้

  const byGen = new Map()
  for (const c of g.คัน) {
    if (!c.ปี || !/ปัจจุบัน/.test(c.โฉม || '')) continue   // เทียบได้เฉพาะโฉมที่ยังขายป้ายแดงอยู่
    const age = thisYear - c.ปี
    if (age < 2 || age > 4) continue
    if (!byGen.has(c.โฉม)) byGen.set(c.โฉม, [])
    byGen.get(c.โฉม).push(c.ราคา)
  }

  for (const [gen, prices] of byGen) {
    if (prices.length < 3) continue             // ตัวอย่างน้อยเกินกว่าจะพูด
    const med = median(prices)
    rows.push({
      รุ่น: g.ชื่อ, โฉม: gen.replace(/ ปี.*/, ''), ป้ายแดงวันนี้: newPrice, มือสอง2ถึง4ปี: med,
      เหลือกี่เปอร์เซ็นต์: Math.round(med / newPrice * 100),
      จำนวนที่ใช้คิด: prices.length, ประกาศทั้งหมด: g.คัน.length,
    })
  }
}
rows.sort((a, b) => a.เหลือกี่เปอร์เซ็นต์ - b.เหลือกี่เปอร์เซ็นต์)

console.log('ค่าเสื่อม — เฉพาะโฉมที่ยังขายป้ายแดงอยู่ · รถอายุ 2-4 ปี (เรียงจากเสื่อมหนักสุด)')
console.log('รุ่น'.padEnd(12) + 'โฉม'.padEnd(8) + 'ป้ายแดง'.padStart(8) + 'มือสอง'.padStart(9) + 'เหลือ'.padStart(7) + '  ใช้กี่คัน')
for (const r of rows) {
  console.log(r.รุ่น.padEnd(12) + r.โฉม.padEnd(8) + baht(r.ป้ายแดงวันนี้).padStart(7) + baht(r.มือสอง2ถึง4ปี).padStart(9) + (r.เหลือกี่เปอร์เซ็นต์ + '%').padStart(7) + '   ' + r.จำนวนที่ใช้คิด + ' คัน')
}

const cut = listings.ประกาศ.filter(c => c.ราคาก่อนลด && c.ราคาก่อนลด > c.ราคา)
console.log('\nกำลังลดราคา ' + cut.length + ' คัน — ลดมากสุด 5 อันดับ:')
cut.sort((a, b) => (b.ราคาก่อนลด - b.ราคา) - (a.ราคาก่อนลด - a.ราคา)).slice(0, 5)
  .forEach(c => console.log(`  ${c.ปี} ${c.รุ่น} ${c.รุ่นย่อย || ''} : ${c.ราคาก่อนลด.toLocaleString()} → ${c.ราคา.toLocaleString()} (ลด ${(c.ราคาก่อนลด - c.ราคา).toLocaleString()})`))

console.log('\n⚠️ ราคาที่ใช้คือ "ราคาที่ผู้ขายตั้ง" ไม่ใช่ราคาปิดจริง · ป้ายแดงเป็นราคาวันนี้ ไม่ใช่ราคาตอนรถคันนั้นออกจากโชว์รูม · แถวที่ใช้ไม่ถึง 10 คัน ให้ถือว่ายังบอกอะไรไม่ได้แน่')
