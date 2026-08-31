// เก็บประกาศขายรถมือสองของแบรนด์หนึ่ง ครบทุกโฉม จาก taladrod.com
// ดึงแบบสุภาพ: ขอทีละหน้า เว้นจังหวะ 1.2 วินาที เท่าที่หน้าเว็บสาธารณะให้มาอยู่แล้ว (ไม่ยิง API ภายใน ไม่เลี่ยงระบบกันบอท)
// ใช้: node scripts/collect-listings.mjs [ไฟล์ taxonomy] [ไฟล์ผลลัพธ์]
import fs from 'node:fs'

const TAXONOMY = process.argv[2] || 'data/benz-taxonomy.json'
const OUT = process.argv[3] || `data/benz-listings-${new Date().toISOString().slice(0, 10)}.json`
const DELAY_MS = Number(process.env.DELAY_MS || 15000)   // เว็บจำกัดความเร็ว: 1.2 วิ โดนกันบอทที่หน้า ~30 · 15 วิ ปลอดภัย
const COOLDOWN_MS = 5 * 60 * 1000                        // เว็บขอให้ถอย = พัก 5 นาทีแล้วค่อยลองใหม่ (ไม่หาทางหลบ)

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'th,en-US;q=0.9,en;q=0.8',
  'Sec-Fetch-Dest': 'document', 'Sec-Fetch-Mode': 'navigate', 'Sec-Fetch-Site': 'same-origin', 'Sec-Fetch-User': '?1',
  'Upgrade-Insecure-Requests': '1',
  Referer: 'https://www.taladrod.com/w40/isch/schc.aspx',
}

const sleep = ms => new Promise(r => setTimeout(r, ms))

// ข้อมูลรถฝังอยู่ในหน้าเป็น `var SchDataJSON={...};` — อ่านจนวงเล็บปิดครบ
function extractJson(html) {
  const key = 'var SchDataJSON='
  let i = html.indexOf(key)
  if (i < 0) return null
  i += key.length
  let depth = 0, inStr = false, esc = false
  for (let j = i; j < html.length; j++) {
    const c = html[j]
    if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === '"') inStr = false; continue }
    if (c === '"') inStr = true
    else if (c === '{') depth++
    else if (c === '}' && --depth === 0) { try { return JSON.parse(html.slice(i, j + 1)) } catch { return null } }
  }
  return null
}

const money = s => (s ? Number(String(s).replace(/[^\d]/g, '')) || null : null)

// เว็บใช้ AWS WAF — เมื่อขอเร็วเกินไปจะส่งหน้า "verify that you're not a robot" กลับมาแทนข้อมูล
// เจอแล้วต้องถอย ไม่ใช่หาทางผ่าน
const isBotChallenge = (res, html) => res.status === 202 || html.includes('awsWafCookieDomainList')

const tax = JSON.parse(fs.readFileSync(TAXONOMY, 'utf8'))
const jobs = tax.รุ่น.flatMap(m => m.generations.map(g => ({ md: m.id, bd: g.id, model: m.name, gen: g.name })))

console.error(`เก็บ ${jobs.length} โฉม (เว้นจังหวะ ${DELAY_MS}ms ต่อหน้า) — ใช้เวลาราว ${Math.ceil(jobs.length * DELAY_MS / 60000)} นาที`)

// เก็บต่อจากของเดิมได้ ถ้าไฟล์ผลลัพธ์มีอยู่แล้ว (โดนจำกัดความเร็วกลางทางแล้วมารันต่อ)
let cars = []
let done = new Set()
if (fs.existsSync(OUT)) {
  const prev = JSON.parse(fs.readFileSync(OUT, 'utf8'))
  cars = prev.ประกาศ || []
  for (const c of cars) done.add(`${c.รุ่น}|${c.โฉม}`)
  console.error(`มีของเดิม ${cars.length} ประกาศ (${done.size} โฉม) — เก็บเฉพาะที่ยังขาด`)
}

const todo = jobs.filter(j => !done.has(`${j.model}|${j.gen}`))
console.error(`ต้องเก็บอีก ${todo.length} โฉม`)

const failed = []
for (const [n, job] of todo.entries()) {
  const url = `https://www.taladrod.com/w40/isch/schc.aspx?fno:all+mk:5+md:${job.md}+bd:${job.bd}`
  let data = null, reason = null
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, { headers: HEADERS })
      const html = await res.text()
      if (isBotChallenge(res, html)) {
        reason = 'เว็บขอให้ชะลอ (bot challenge)'
        console.error(`  เว็บขอให้ชะลอที่ ${job.model} ${job.gen} — พัก ${COOLDOWN_MS / 60000} นาทีแล้วลองใหม่ (ครั้งที่ ${attempt})`)
        await sleep(COOLDOWN_MS)
        continue
      }
      if (!res.ok) { reason = `HTTP ${res.status}`; break }
      data = extractJson(html)
      reason = data ? null : 'ไม่มีรถขายในโฉมนี้'
      break
    } catch (e) { reason = e.message; await sleep(5000) }
  }

  if (!data) failed.push({ ...job, reason })
  else {
    for (const c of data.cars || []) {
      if (c.type !== 'car') continue
      cars.push({
        id: c.cid, ปี: Number(c.yr4) || null,
        รุ่น: c.amodel || job.model, โฉม: c.abody || job.gen, รุ่นย่อย: c.atrim || c.model || null,
        ราคา: money(c.prc), ราคาก่อนลด: money(c.prvprc),
        ยอดวิว: Number(c.ipgvw) || 0, อัปเดตล่าสุด: (c.upd || '').replace(/&nbsp;/g, '').trim() || null,
        ขายแล้ว: c.issold === 'Y', ป้ายแดง: c.isnew === 'Y',
        พาดหัวประกาศ: (c.title || '').trim() || null,
      })
    }
  }
  if ((n + 1) % 5 === 0) console.error(`  ...${n + 1}/${todo.length} โฉม · สะสม ${cars.length} คัน`)
  await sleep(DELAY_MS)
}

const jobsCount = jobs.length
fs.writeFileSync(OUT, JSON.stringify({
  _meta: {
    แบรนด์: tax._meta.แบรนด์,
    เก็บเมื่อ: new Date().toISOString().slice(0, 10),
    ที่มา: 'taladrod.com — ประกาศขายรถมือสอง (ราคาที่ผู้ขายตั้ง ไม่ใช่ราคาปิดจริง)',
    วิธีเก็บ: `ขอหน้าเว็บสาธารณะทีละหน้า เว้นจังหวะ ${DELAY_MS / 1000} วินาที · เจอหน้ากันบอทแล้วถอยพัก ${COOLDOWN_MS / 60000} นาที`,
    นับได้: { โฉมทั้งหมด: jobsCount, โฉมที่เก็บไม่ได้รอบนี้: failed.length, ประกาศ: cars.length },
    เก็บไม่ได้: failed,
  },
  ประกาศ: cars,
}, null, 1))

console.error(`เสร็จ: ${cars.length} ประกาศ · พลาด ${failed.length} โฉม → ${OUT}`)
