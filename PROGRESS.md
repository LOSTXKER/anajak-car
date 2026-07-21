# 📍 PROGRESS — สถานะสด

> เขียนทับทุกครั้ง ไม่สะสม log (log อยู่ git history) · hook โหลดไฟล์นี้ทุก session
อัปเดตล่าสุด: 2026-07-21 (M24: "สะอาดแต่แพงขึ้น" — copy diet + premium visual แบบ Apple · ลดความรก/text ทั้งเว็บ)

## ทำถึงไหน
**CARMETA v1 + ภาษากลาง Phase 0–4 + เว็บโครง "แบรนด์=เกม" (M22–M23) + declutter Apple-grade (M24)** — สเปกภาษากลางใน `VOCABULARY.md` · milestone ครบใน PLAN.md (M0–M24)

**M24 — ลดความรก/ฟิล Apple (เบสสั่ง "ทำเลย" 2026-07-21)** ทำบน branch `m24-apple-declutter` (ยังไม่ merge main):
- โจทย์: "UXUI ดูรกมาก · text เยอะเกินไป · อยากได้ฟิล Apple" → เลือก "สะอาดแต่แพงขึ้น" (ไม่ปลดล็อกกฎห้าม gradient/animation) · ทั้งเว็บรอบเดียว · ย่อ FAQ + ตัด link farm
- วิธีทำ: screenshot เว็บจริงทุกหน้า + audit 4 agents (file:line) + design 2 มุม (copy/visual) + adversarial critique → รวมเป็นแผนเดียว (`~/.claude/plans/uxui-tingly-dream.md`)
- **§0 ด่วน:** โน้ต ops ภายในหลุดขึ้นเว็บสาธารณะท้ายหน้ารถ ("…ไม่ได้ verify จากแหล่งที่ fetch รอบนี้จึงไม่บันทึก") → หยุด render `generationSummary` + ลบ field จาก `queries.ts` (ไม่แตะ DB)
- **พูดครั้งเดียว:** สารความเชื่อมั่นเคยพูดซ้ำ ≥9 ที่ → กำหนดบ้านเดียวต่อสาร (M1 หลักฐาน/M2 freshness/M3 ไม่ใช่ราคาซื้อขายจริง/M4 confidence) · ตัด: footer บรรทัด1 · pill "evidence-first" (sidebar) · 3 pillar ยาว · coverage link farm · badge HIGH ทุกแถว → uniform=1 บรรทัด · subtitle สอนใช้ UI ทุกหน้า · เลิกคำ "coverage" บนจอ
- **badge เฉพาะข้อยกเว้น:** `LifecycleBadge` CURRENT→null · `ConfidenceBadge` uniform/mixed (คำไทย) · ลบ dead `LifecycleDot`/`FreshnessTag`
- **spec hoist หน้ารถ:** spec ที่เท่ากันทุกแถวในกลุ่ม ยกขึ้นหัวกลุ่ม แถวเหลือเฉพาะส่วนต่าง (เช่น "Revo Standard Cab · ดีเซล · ขับหลัง" + แถว "150 PS · ธรรมดา 6 สปีด") — ไม่ทำข้อมูลหาย/ปน entity
- **premium visual:** type scale ใหญ่ขึ้น (h1 4xl→5xl · metric การ์ด Brand Home 2xl · ปีไทม์ไลน์ใหญ่ · ราคา display) · spacing กว้าง · `ModelCard` image-forward + `CarSilhouette` ร่วม · ตัดไอคอนประดับหัว section (landing 3 เสา + nav cards + แถบ accent /brands — ละเมิดกฎ LOCKED เดิม)
- **landing:** ~400 คำ → ~140 (ตัด eyebrow/coverage/link farm/upcoming "เร็วๆ นี้" 8 tiles · ย่อ FAQ ครึ่ง คง JSON-LD) · `(home)/loading.tsx` ตรงโครงใหม่
- ไฟล์แตะ 20 ไฟล์ · net −198 บรรทัด (357+/555−) · กฎใหม่บันทึกใน DESIGN.md §"สะอาดแต่แพงขึ้น (M24)" กัน drift

ระบบภาษากลาง (2026-07-20 · ไม่เปลี่ยนใน M24):
- ทุก attribute 2 ชั้น: คำกลาง (enum) + ชื่อการตลาดดิบ (tooltip) · ทุก map มี EvidenceLink · ไม่รู้=unknown
- ข้อมูลจริง: Toyota 7 nameplate = 62 variant/62 ราคา MANUFACTURER_OFFICIAL/HIGH · EvidenceSource 33 · EvidenceLink 169 · 0 orphan
- ADAS seed แล้ว (M21): Feature 3 (AEB/ACC/LKA) + TrimFeature 90 known
- ⚠️ prisma CLI: รันด้วย `PRISMA_CLI_DIRECT=1` · enum/rename ที่มีข้อมูลต้อง SQL มือก่อน push

## ตรวจแล้ว (M24)
- **lint + production build ผ่าน** (9 routes)
- **curl matrix:** 8×200 · `/cars/hilux-revo`→308 canonical · 404 ครบ · SSR landing มี `<a href="/cars">` (SEO ไม่เสีย) · FAQ JSON-LD valid · โน้ต ops หายจากหน้ารถ · "เร็วๆ นี้"/evidence-first/link farm หายจาก landing
- **screenshot จริง (localhost:3105) light+dark ทุกหน้า:** landing สะอาด (ไม่มี eyebrow · แบรนด์ live+ดูเพิ่มเติม · 3 เสาไม่มีไอคอน) · /cars การ์ด image-forward ไม่มี badge "ขายอยู่" · Brand Home metric ใหญ่ (7 รุ่น/62 รุ่นย่อย/฿519k–1.97M/7 เหตุการณ์) ไม่มี breadcrumb/ไอคอน · price-ladder meta 2 ชิ้น ไม่มี footnote · timeline ปีใหญ่ · หน้ารถ trust line 2 ชิ้น+anchor · spec hoist ทำงาน · ADAS ไม่มี (ACC)/footnote · "ทุกแหล่งความเชื่อมั่นสูง" บรรทัดเดียว
- **mobile 390px (iframe harness — เสิร์ฟผ่าน public ชั่วคราวแล้วลบ):** landing/หน้ารถ/timeline ไม่ overflow · h1 พอดี · trust line wrap สวย
- **adversarial review workflow (2 มุม → verify):** correctness = **0 finding** (spec hoist/uniform confidence/trust-line guard/ลบ generationSummary ผ่านหมด) · เหลือ 1 CONFIRMED (LOW): ตัด link farm ทำหน้ารถไม่มี SSR deep-link ตรงจาก landing (crawl ลึกขึ้น 1 hop · ยังเข้าถึงได้ผ่าน /brands) — เป็น trade-off ที่เบสสั่งตัดเอง · เสนอ follow-up: เพิ่ม `app/sitemap.ts` (ยังไม่ทำ — รอเบสเคาะ domain, prod domain ยังไม่ final)

## ค้าง / ติดอะไร
- **M24 ยังไม่ merge main** — branch `m24-apple-declutter` · รอเบสรีวิว screenshot แล้วค่อย merge + push (กฎห้าม push main ตรง)
- กันไว้ไม่ทำรอบนี้ (ให้เบสเคาะ/รอบหน้า): stat band ตัวเลขใหญ่ landing (=การ์ดสถิติที่เบสถอด M5) · identity แบรนด์ซ้อน navbar BrandSwitcher vs sidebar head (งาน layout) · รูป Champ/Revo จริง (ตอนนี้ CarSilhouette fallback) · loading.tsx ของ /cars (option)
- metadata description ยังมีคำ "coverage" (อยู่ `<head>` ไม่ใช่ text บนจอ — ตามแผนไม่แตะ metadata)
- dev server: อย่ารันบน 3000 (ชนงาน meecard) · verify ใช้ `PORT=3105 npm start` (kill 3105 เก่าก่อน)
- รูปรถ = ลิขสิทธิ์ Toyota (CREDITS.md) — ทบทวนก่อน production

## ▶ NEXT (ทำต่อทันที)
1. รอเบสรีวิว M24 (localhost:3105 หรือ screenshot): landing/cars/brand home/price-ladder/timeline/หน้ารถ — โอเคแล้ว merge `m24-apple-declutter` → main + push (Vercel auto-deploy)
2. ถ้าเบสอยาก push ธีมต่อ: identity แบรนด์ (ลด navbar switcher หรือ sidebar head ที่ซ้ำ) · การ์ด ModelCard เพิ่มรูป Champ/Revo จริง
3. งานต่อ (ค้างจาก M23): Compare exact entity (เพิ่มใน brandNav ได้) · ขยาย ADAS (BSM/AHB/LDW) · แบรนด์ที่ 2 (โครง multi-brand พร้อม)
4. VOCABULARY Phase 5 backlog (ดู PLAN.md ถัดไป)
