// อ่านข้อมูลที่สคริปต์เก็บมา แล้วคำนวณตัวเลขที่หน้าเว็บต้องใช้
// กฎเหล็ก (DESIGN.md): ทุกตัวเลขต้องรู้ว่าคิดจากกี่คัน · ห้ามรวมคนละโฉม
import fs from 'node:fs'
import path from 'node:path'

const DATA_DIR = path.join(process.cwd(), 'data')
const read = <T,>(file: string): T => JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'))

export type Listing = {
  id: string
  ปี: number | null
  รุ่น: string
  โฉม: string
  รุ่นย่อย: string | null
  ราคา: number | null
  ราคาก่อนลด: number | null
  ยอดวิว: number
  อัปเดตล่าสุด: string | null
  ขายแล้ว: boolean
  ป้ายแดง: boolean
  พาดหัวประกาศ: string | null
}

type Taxonomy = {
  _meta: { แบรนด์: string; เก็บเมื่อ: string; นับได้: { รุ่น: number; โฉม: number; รุ่นย่อย: number } }
  รุ่น: { id: string; name: string; generations: { id: string; name: string; trims: { id: string; name: string }[] }[] }[]
}

type Listings = { _meta: { เก็บเมื่อ: string; ที่มา: string }; ประกาศ: Listing[] }
type NewPrices = { _meta: { เก็บเมื่อ: string }; รุ่น: { ชื่อ: string; ขุมพลัง: string; ราคาเริ่มต้น: number }[] }

export const taxonomy = read<Taxonomy>('benz-taxonomy.json')
export const listingsFile = read<Listings>('benz-listings-2026-08-31.json')
export const newPrices = read<NewPrices>('benz-newprice-2026-08-31.json')
export const listings = listingsFile.ประกาศ
export const เก็บเมื่อ = listingsFile._meta.เก็บเมื่อ

// ---- ชื่อ → slug ที่อ่านออกและเดาได้ ----
export const modelSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
export const genSlug = (name: string) => (name.split(' ')[0] || name).toLowerCase().replace(/[^a-z0-9]+/g, '-')

// ---- ชื่อให้คนอ่าน ----
// ข้อมูลดิบเป็นตัวใหญ่ล้วน ("C-CLASS", "C220d AVANTGARDE") ซึ่งอ่านยากและไม่เข้ากับหน้าตาแบบ Notion
// แปลงเฉพาะคำที่ยาว 4 ตัวอักษรขึ้นไปและเป็นตัวใหญ่ล้วน — ตัวย่อ (AMG, CDI, GT) และรหัส (W206, 4MATIC) คงไว้
const คำสวย = (w: string) => (/^[A-Z]{4,}$/.test(w) ? w[0] + w.slice(1).toLowerCase() : w)
export const ชื่อสวย = (s: string | null) => (s ? s.split(/([ \-])/).map(คำสวย).join('') : '')

// ---- เครื่องคิดเลขพื้นฐาน ----
export const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b)
  return s.length ? s[Math.floor(s.length / 2)] : null
}
export const ล้าน = (n: number | null) => (n == null ? '—' : (n / 1e6).toFixed(2) + ' ล.')
export const บาท = (n: number | null) => (n == null ? '—' : n.toLocaleString('th-TH'))

// จำนวนคันขั้นต่ำที่ยอมให้ "พูดเป็นข้อสรุป" ได้ — ต่ำกว่านี้แสดงได้แต่ต้องบอกว่ายังไม่แน่
export const ตัวอย่างพอเชื่อ = 10

const ปีนี้ = 2026

// ---- ราคาป้ายแดง: จับคู่ชื่อของสองแหล่ง (ทางการเรียก "C-Class Saloon" · ตลาดเรียก "C-CLASS") ----
const key = (s: string) => s.toUpperCase().replace(/[^A-Z]/g, '').replace(/SALOON|MPV|ROADSTER|COUPE|CLASS/g, '')
const newPriceByKey = new Map<string, number>()
for (const m of newPrices.รุ่น) {
  if (/MAYBACH|AMG/.test(m.ชื่อ)) continue // รุ่นพิเศษ ไม่เอามาเทียบกับรุ่นปกติ
  const k = key(m.ชื่อ)
  const cur = newPriceByKey.get(k)
  if (cur == null || m.ราคาเริ่มต้น < cur) newPriceByKey.set(k, m.ราคาเริ่มต้น)
}
export const ราคาป้ายแดงของรุ่น = (ชื่อรุ่น: string) => newPriceByKey.get(key(ชื่อรุ่น)) ?? null

// ---- สรุประดับ "โฉม" — หน่วยที่เล็กที่สุดที่เทียบกันได้อย่างซื่อสัตย์ ----
export type สรุปโฉม = {
  รุ่น: string
  โฉม: string
  slug: string
  ประกาศ: number
  ราคากลาง: number | null
  ราคาต่ำสุด: number | null
  ราคาสูงสุด: number | null
  ยังขายป้ายแดง: boolean
  ค่าเสื่อม: { เหลือกี่เปอร์เซ็นต์: number; ป้ายแดง: number; มือสองกลาง: number; คิดจากกี่คัน: number } | null
}

export function สรุปทุกโฉม(): สรุปโฉม[] {
  const กลุ่ม = new Map<string, Listing[]>()
  for (const c of listings) {
    const k = c.รุ่น + '|' + c.โฉม
    if (!กลุ่ม.has(k)) กลุ่ม.set(k, [])
    กลุ่ม.get(k)!.push(c)
  }

  const out: สรุปโฉม[] = []
  for (const [k, คัน] of กลุ่ม) {
    const [รุ่น, โฉม] = k.split('|')
    const ราคา = คัน.map(c => c.ราคา).filter((n): n is number => n != null).sort((a, b) => a - b)
    const ยังขายป้ายแดง = /ปัจจุบัน/.test(โฉม)
    const ป้ายแดง = ราคาป้ายแดงของรุ่น(รุ่น)

    // ค่าเสื่อมคิดได้เฉพาะโฉมที่ยังขายป้ายแดงอยู่ และดูเฉพาะรถอายุ 2-4 ปี (คนละโฉมห้ามปน)
    let ค่าเสื่อม: สรุปโฉม['ค่าเสื่อม'] = null
    if (ยังขายป้ายแดง && ป้ายแดง) {
      const อายุ2ถึง4 = คัน
        .filter(c => c.ปี && ปีนี้ - c.ปี >= 2 && ปีนี้ - c.ปี <= 4)
        .map(c => c.ราคา)
        .filter((n): n is number => n != null)
      const med = median(อายุ2ถึง4)
      if (med && อายุ2ถึง4.length >= 3) {
        ค่าเสื่อม = {
          เหลือกี่เปอร์เซ็นต์: Math.round((med / ป้ายแดง) * 100),
          ป้ายแดง, มือสองกลาง: med, คิดจากกี่คัน: อายุ2ถึง4.length,
        }
      }
    }

    out.push({
      รุ่น, โฉม, slug: genSlug(โฉม), ประกาศ: คัน.length,
      ราคากลาง: median(ราคา), ราคาต่ำสุด: ราคา[0] ?? null, ราคาสูงสุด: ราคา[ราคา.length - 1] ?? null,
      ยังขายป้ายแดง, ค่าเสื่อม,
    })
  }
  return out
}

// ---- ชีพจร: รถที่ผู้ขายเพิ่งลดราคา ----
export const รถที่ลดราคา = () =>
  listings
    .filter(c => c.ราคาก่อนลด && c.ราคา && c.ราคาก่อนลด > c.ราคา)
    .sort((a, b) => (b.ราคาก่อนลด! - b.ราคา!) - (a.ราคาก่อนลด! - a.ราคา!))

// ---- สรุประดับ "รุ่น" สำหรับหน้ารายการ ----
export function สรุปทุกรุ่น() {
  const โฉมทั้งหมด = สรุปทุกโฉม()
  const กลุ่ม = new Map<string, Listing[]>()
  for (const c of listings) {
    if (!กลุ่ม.has(c.รุ่น)) กลุ่ม.set(c.รุ่น, [])
    กลุ่ม.get(c.รุ่น)!.push(c)
  }
  return [...กลุ่ม.entries()].map(([ชื่อ, คัน]) => {
    const ราคา = คัน.map(c => c.ราคา).filter((n): n is number => n != null).sort((a, b) => a - b)
    const โฉม = โฉมทั้งหมด.filter(g => g.รุ่น === ชื่อ)
    const เสื่อมล่าสุด = โฉม.filter(g => g.ค่าเสื่อม).sort((a, b) => b.ค่าเสื่อม!.คิดจากกี่คัน - a.ค่าเสื่อม!.คิดจากกี่คัน)[0]
    return {
      ชื่อ, slug: modelSlug(ชื่อ), ประกาศ: คัน.length, โฉม: โฉม.length,
      ราคาต่ำสุด: ราคา[0] ?? null, ราคาสูงสุด: ราคา[ราคา.length - 1] ?? null, ราคากลาง: median(ราคา),
      ป้ายแดง: ราคาป้ายแดงของรุ่น(ชื่อ), ค่าเสื่อมเด่น: เสื่อมล่าสุด?.ค่าเสื่อม ?? null,
    }
  }).sort((a, b) => b.ประกาศ - a.ประกาศ)
}

export const ประกาศของโฉม = (modelSlugWanted: string, genSlugWanted: string) =>
  listings.filter(c => modelSlug(c.รุ่น) === modelSlugWanted && genSlug(c.โฉม) === genSlugWanted)
