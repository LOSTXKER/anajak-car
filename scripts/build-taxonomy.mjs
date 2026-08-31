// สร้างโครงสารานุกรม (รุ่น → โฉม → รุ่นย่อย) ของแบรนด์เดียว จากไฟล์รายชื่อสาธารณะของ taladrod
// ที่มา: https://www.taladrod.com/w40/_incFile/{MMT,MBD}.js — ไฟล์เดียวกับที่เบราว์เซอร์ผู้ใช้ทั่วไปโหลดทุกครั้ง
// ใช้: node scripts/build-taxonomy.mjs [ชื่อแบรนด์] > data/<brand>-taxonomy.json
import vm from 'node:vm'

const BRAND = (process.argv[2] || 'BENZ').toUpperCase()
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36'
const BASE = 'https://www.taladrod.com/w40/_incFile'

async function get(name) {
  const res = await fetch(`${BASE}/${name}.js`, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`โหลด ${name}.js ไม่ได้ (HTTP ${res.status})`)
  return res.text()
}

// 'id,ชื่อ,id,ชื่อ,...' → [{id, name}] · ตัดส่วนยอดนิยมที่ซ้ำอยู่หน้าตัวคั่น '0, '
function pairs(raw) {
  if (!raw) return []
  const parts = String(raw).split(',')
  const cut = parts.findIndex((p, i) => i % 2 === 0 && p === '0')
  const tail = cut >= 0 ? parts.slice(cut + 2) : parts
  const out = []
  for (let i = 0; i + 1 < tail.length; i += 2) out.push({ id: tail[i], name: tail[i + 1].trim() })
  return out.filter(x => x.id && x.name)
}

// BD: '<โฉมid>.<รุ่นย่อยid>.<...>,<ชื่อโฉม>,...' — เลขตัวแรกคือ id ของโฉม ที่เหลือคือรุ่นย่อยที่อยู่ในโฉมนั้น
function generations(raw, trimById) {
  if (!raw) return []
  const parts = String(raw).split(',')
  const out = []
  for (let i = 0; i + 1 < parts.length; i += 2) {
    const ids = parts[i].split('.')
    out.push({
      id: ids[0],
      name: parts[i + 1].trim(),
      trims: ids.slice(1).map(t => ({ id: t, name: trimById.get(t) })).filter(t => t.name),
    })
  }
  return out
}

const sandbox = {}
vm.createContext(sandbox)
new vm.Script((await get('MMT')) + '\n' + (await get('MBD'))).runInContext(sandbox)

const brand = pairs(sandbox.MK).find(b => b.name.toUpperCase() === BRAND)
if (!brand) throw new Error(`ไม่พบแบรนด์ ${BRAND}`)

const models = pairs(sandbox.MD[brand.id]).map(m => {
  const trimById = new Map(pairs(sandbox.TM[m.id]).map(t => [t.id, t.name]))
  return { ...m, generations: generations(sandbox.BD[m.id], trimById) }
})

const totalGens = models.reduce((n, m) => n + m.generations.length, 0)
const totalTrims = models.reduce((n, m) => n + m.generations.reduce((k, g) => k + g.trims.length, 0), 0)

console.log(JSON.stringify({
  _meta: {
    แบรนด์: brand.name,
    เก็บเมื่อ: new Date().toISOString().slice(0, 10),
    ที่มา: `${BASE}/MMT.js + MBD.js (ไฟล์สาธารณะของ taladrod.com)`,
    หมายเหตุ: 'โครงนี้คือ "โฉม/รุ่นย่อยที่ตลาดมือสองไทยใช้เรียกจริง" ไม่ใช่ชื่อทางการจากโรงงาน — ต้องเทียบกับข้อมูลทางการก่อนเผยแพร่',
    นับได้: { รุ่น: models.length, โฉม: totalGens, รุ่นย่อย: totalTrims },
  },
  รุ่น: models,
}, null, 2))
