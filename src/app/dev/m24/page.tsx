import Link from "next/link";

export const dynamic = "force-dynamic";

// ── MOCKUP index (M24) — ให้เบสเลือก 2 เรื่อง: ทิศหน้าสวย + แบบ Tierlist ──
function Card({ href, title, blurb, pro, con, primary }: {
  href: string; title: string; blurb: string; pro: string; con: string; primary?: boolean;
}) {
  return (
    <Link href={href} className={`block rounded-2xl border p-5 transition-all hover:shadow-sm ${primary ? "border-accent bg-accent-soft hover:border-accent" : "border-border hover:border-accent"}`}>
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        {primary && <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-medium text-white">เบสเอนทางนี้</span>}
        <span aria-hidden className="ml-auto text-accent">เปิดดู →</span>
      </div>
      <p className="mt-2 text-sm leading-6 text-muted">{blurb}</p>
      <dl className="mt-3 flex flex-col gap-1 text-[13px] sm:flex-row sm:gap-6">
        <div className="flex gap-1.5"><dt className="font-medium text-success">ดี:</dt><dd className="text-muted">{pro}</dd></div>
        <div className="flex gap-1.5"><dt className="font-medium text-warning">เสี่ยง:</dt><dd className="text-muted">{con}</dd></div>
      </dl>
    </Link>
  );
}

export default function M24Index() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-xs font-semibold tracking-wider text-accent uppercase">M24 · หน้าเทียบภายใน (mockup)</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">รื้อ UXUI: หน้าสวยขึ้น + Tierlist</h1>
      <p className="mt-3 text-[15px] leading-7 text-muted">
        โครง navbar+sidebar เดิม (M23) คงไว้ · รอบนี้เลือก 2 เรื่อง: <strong className="text-foreground">(1) ทิศหน้าตา</strong> ให้สวย/รวยขึ้น
        และ <strong className="text-foreground">(2) แบบ Tierlist</strong> · กดเข้าไปดูของจริงบนข้อมูล Toyota แล้วบอกฉัน
      </p>
      <div className="mt-4 rounded-xl border border-border bg-surface-muted p-4 text-[13px] leading-6 text-muted">
        <p>เคาะไปแล้ว: <strong className="text-foreground">แยกข้อมูลเป็นหลายหน้าตามลำดับชั้น</strong> (เจน/ตัวถัง/รุ่นย่อย/ไทม์ไลน์) — หน้าที่ข้อมูลยังตื้นจะ <strong className="text-foreground">ติดป้าย &ldquo;รอข้อมูล&rdquo; อย่างซื่อสัตย์ ไม่กรอกเลขปลอม</strong> (เห็นตัวอย่างในหน้า Nameplate ด้านล่าง)</p>
      </div>

      <h2 className="mt-9 text-sm font-semibold tracking-wider text-faint uppercase">1 · ทิศหน้ารุ่น (Nameplate) — เลือก 1</h2>
      <div className="mt-3 space-y-3">
        <Card href="/dev/m24/np-calm/bz4x" title="Calm — โปร่ง ต่อยอด M22"
          blurb="บันไดราคาเป็นพระเอก · stat strip เบาๆ · ขุมพลังเป็นรายการอ่านง่าย · เว้นวรรคเยอะ"
          pro="สงบ อ่านง่าย เข้าชุดของเดิม" con="ดูข้อมูลน้อยกว่าในหน้าจอเดียว" />
        <Card href="/dev/m24/np-dense/bz4x" title="Dense — แน่นแบบ tracker"
          blurb="stat tiles เด่นบนสุด · แถบตำแหน่งราคา · ตารางเทียบรุ่นย่อยแน่น · บล็อกสเปกเป็นการ์ด (ใกล้ dotabuff/coinmarketcap ที่เบสเคยส่ง)"
          pro="ดูเป็น data product · เห็นข้อมูลเยอะในจอเดียว" con="แน่นกว่า ถ้าเยอะไปอาจ 'รก'" />
        <p className="pl-1 text-xs text-faint">เทียบเพิ่ม: <Link href="/dev/m24/np-calm/hilux-travo" className="text-accent hover:underline">Travo Calm</Link> · <Link href="/dev/m24/np-dense/hilux-travo" className="text-accent hover:underline">Travo Dense</Link> (รุ่นหลายตัวถัง)</p>
      </div>

      <h2 className="mt-9 text-sm font-semibold tracking-wider text-faint uppercase">2 · ทิศหน้าแบรนด์ (Brand) — เลือก 1</h2>
      <div className="mt-3 space-y-3">
        <Card href="/dev/m24/brand-cards" title="Cards — การ์ดรุ่น"
          blurb="KPI แถวบน + การ์ดรุ่นมีรูป/ราคา/ขุมพลัง (ตารางค้นหาเต็มคงเดิมด้านล่าง)"
          pro="ดึงดูด เห็นไลน์อัปทั้งหมดไว" con="กินพื้นที่แนวตั้งมากกว่า" />
        <Card href="/dev/m24/brand-table" title="Table — ตารางไลน์อัป"
          blurb="KPI tiles + ตารางไลน์อัปแน่น (ก่อนถึงตารางค้นหาเต็ม)"
          pro="กระชับ สแกนไว" con="เรียบกว่า ไม่เด่นเท่าการ์ด" />
      </div>

      <h2 className="mt-9 text-sm font-semibold tracking-wider text-faint uppercase">3 · Tierlist — เลือก 1 หรือทั้งคู่</h2>
      <div className="mt-3 space-y-3">
        <Card href="/dev/m24/tier-editorial" title="Editorial S/A/B/C — เบสจัดเอง" primary
          blurb="หน้าตาแบบเกม (S/A/B/C) แต่ติดป้าย 'ความเห็นบรรณาธิการ' + เบสเป็นคนจัด + เขียนเหตุผล + แนบหลักฐานต่ออันดับ"
          pro="ยืดหยุ่นสุด ได้ลุคเกม" con="เป็นความเห็น (ต้องติดป้ายชัด) + Phase B ต้องเพิ่มตารางเก็บใน DB" />
        <Card href="/dev/m24/tier-data" title="Data-driven — จัดตามเกณฑ์"
          blurb="จัดในกลุ่มเดียวกันตามเกณฑ์เดียว (ราคา/ADAS/ระบบขับ) · ทุกแถวมีหลักฐาน · ไม่เคลม 'ดีที่สุด'"
          pro="เป็นกลาง ไม่ผิดกฎ ทำได้เลย" con="ไม่ใช่ 'อันดับรวม' แบบเกม" />
      </div>

      <p className="mt-8 text-sm text-muted">บอกฉันได้เลยว่า: หน้ารุ่น <strong className="text-foreground">Calm/Dense</strong> · หน้าแบรนด์ <strong className="text-foreground">Cards/Table</strong> · Tierlist <strong className="text-foreground">Editorial/Data/ทั้งคู่</strong> — แล้วฉันจะลงมือทำจริง</p>
    </div>
  );
}
