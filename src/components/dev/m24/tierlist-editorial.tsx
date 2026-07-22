import Link from "next/link";
import Image from "next/image";
import { nameplateImage } from "@/lib/images";

// ── MOCKUP (M24) — Tierlist ทิศ "Editorial S/A/B/C" (เบสจัดเอง · ความเห็น ไม่ใช่ Fact) ──
// ข้อมูล tier ด้านล่างเป็น "ตัวอย่าง" hardcode เพื่อดูหน้าตา — ของจริง Phase B เก็บใน EditorialTierList/Entry
type Entry = { slug: string; name: string; reason: string; evidence: string };
type Tier = { label: string; note: string; color: string; entries: Entry[] };

const SAMPLE_TIERS: Tier[] = [
  {
    label: "S", note: "ตัวเลือกแรกที่เบสแนะนำในกลุ่มนี้", color: "bg-accent text-white",
    entries: [
      { slug: "hilux-revo", name: "Hilux Revo", reason: "กระบะขายดีสุด อะไหล่/ศูนย์ทั่วไทย ขายต่อง่ายสุดในกลุ่ม", evidence: "ยอดขาย ต.ค.–ธ.ค. 2025 (สื่อยานยนต์)" },
      { slug: "fortuner", name: "Fortuner", reason: "PPV ตัวเลือกแรกของครอบครัวสายลุย ฐานลูกค้าใหญ่", evidence: "สเปก+ราคาทางการ toyota.co.th" },
    ],
  },
  {
    label: "A", note: "คุ้มและครบ แนะนำถ้าโจทย์ตรง", color: "bg-success text-white",
    entries: [
      { slug: "hilux-travo", name: "Hilux Travo", reason: "ไลน์อัปกว้างสุด ตั้งแต่ตัวงานถึงท็อป + มีตัว BEV", evidence: "สเปก 4 ตัวถังทางการ" },
      { slug: "corolla-altis", name: "Corolla Altis", reason: "เก๋งไฮบริดออปชั่น ADAS ครบในกลุ่มราคา", evidence: "ตาราง ADAS ทางการต่อเกรด" },
    ],
  },
  {
    label: "B", note: "ดีในบริบทเฉพาะ", color: "bg-warning text-white",
    entries: [
      { slug: "yaris-ativ", name: "Yaris Ativ", reason: "อีโคคาร์คุ้มค่าตัว เหมาะเมือง/มือใหม่", evidence: "ราคา+เกรดทางการ" },
      { slug: "bz4x", name: "bZ4X", reason: "EV ศูนย์ Toyota อุ่นใจ แต่ราคายังสูงเทียบคู่แข่ง EV", evidence: "ราคาทางการ + สเปก NEDC" },
    ],
  },
  {
    label: "C", note: "เหมาะงานเฉพาะทาง", color: "bg-surface-muted text-faint",
    entries: [
      { slug: "hilux-champ", name: "Hilux Champ", reason: "กระบะพาณิชย์คุ้มงานหนัก/ดัดแปลง แต่ออปชั่นน้อย ไม่เน้นในบ้าน", evidence: "สเปกตัวถัง Cab & Chassis ทางการ" },
    ],
  },
];

export function TierlistEditorial() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-20 sm:px-6 pt-8">
      {/* editorial banner — persistent */}
      <div className="rounded-2xl border border-warning/40 bg-warning-soft px-4 py-3">
        <p className="text-sm font-semibold text-warning">ความเห็นบรรณาธิการ (Editorial opinion)</p>
        <p className="mt-0.5 text-[13px] text-muted">ไม่ใช่ข้อเท็จจริงที่วัดได้ — แยกจากข้อมูลราคา/สเปกที่ยืนยันในหน้ารุ่น</p>
      </div>

      <h1 className="mt-5 text-3xl font-semibold tracking-tight">Toyota น่าซื้อ 2026 — มุมมองเบส</h1>
      <p className="mt-2 text-sm text-muted">จัดโดย <span className="font-medium text-foreground">เบส</span> · บรรณาธิการ CARMETA</p>

      <div className="mt-4 space-y-1.5 rounded-2xl border border-border bg-surface-muted/50 p-4 text-[13px] leading-6">
        <p><span className="font-semibold text-foreground">กลุ่ม:</span> รถ Toyota ที่ขายในไทยปี 2026 (ทุกเซกเมนต์)</p>
        <p><span className="font-semibold text-foreground">เกณฑ์การจัด:</span> ความเหมาะกับผู้ซื้อทั่วไป — ชั่งจากความคุ้ม, ความง่ายในการดูแล/ขายต่อ, ความครบของออปชั่น และฐานลูกค้า (เป็นการชั่งน้ำหนักแบบความเห็น ไม่ใช่คะแนนสูตรเดียว)</p>
      </div>

      {/* tiers */}
      <div className="mt-6 space-y-3">
        {SAMPLE_TIERS.map((tier) => (
          <div key={tier.label} className="flex flex-col gap-3 rounded-2xl border border-border p-3 sm:flex-row">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl font-bold sm:h-auto sm:w-16 ${tier.color}`}>
              {tier.label}
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <p className="text-xs text-faint">{tier.note}</p>
              {tier.entries.map((e) => {
                const img = nameplateImage(e.slug);
                return (
                  <div key={e.slug} className="flex gap-3 rounded-xl bg-surface-muted/40 p-3">
                    <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg bg-background">
                      {img ? <Image src={img.src} alt={img.alt} width={72} height={40} className="h-auto w-auto max-h-[48px] object-contain" /> : null}
                    </div>
                    <div className="min-w-0">
                      <Link href={`/cars/${e.slug}`} className="font-semibold hover:text-accent">{e.name}</Link>
                      <p className="mt-0.5 text-[13px] leading-5 text-muted">{e.reason}</p>
                      <p className="mt-1 text-[11px] text-faint">อ้างอิง: {e.evidence} ↗</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-xs text-faint">
        ความเห็น ไม่ใช่ข้อเท็จจริงที่วัดได้ · เบสเป็นคนกำหนด tier + เหตุผล + แนบหลักฐานต่ออันดับ · อันดับนี้ไม่ได้ถูกซื้อด้วยค่าโฆษณาหรือสปอนเซอร์
      </p>
    </div>
  );
}
