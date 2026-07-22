import Link from "next/link";

export const dynamic = "force-dynamic";

// ── MOCKUP index (M23 shell compare) — หน้าเลือกทิศ sidebar+navbar ให้เบสกดเทียบ ──

const VARIANTS = [
  {
    key: "a",
    title: "แบบ A — เมนูแบรนด์ + จุดยึดในหน้า",
    blurb: "sidebar เป็นเมนูเงียบๆ แบบเว็บคู่มือ: ภาพรวมแบรนด์ / รุ่นรถทั้งหมด / แหล่งอ้างอิง · พออยู่หน้ารุ่น เพิ่มจุดกระโดดในหน้า (บันไดราคา · ADAS · ไทม์ไลน์)",
    pro: "ไม่รกที่สุด ดูเป็นระบบ",
    con: "โล่ง + สลับรุ่นต้องกลับหน้าแบรนด์ก่อน",
  },
  {
    key: "b",
    title: "แบบ B — รายชื่อรุ่น (สลับคลิกเดียว)",
    blurb: "sidebar ลิสต์รุ่นทั้งหมดของแบรนด์ตรงๆ พร้อมจุดสถานะ + ราคาเริ่ม · กดสลับรุ่นได้ทันทีไม่ต้องย้อน",
    pro: "หาง่ายสุด ตรงกับคนเทียบรถ ดูมีชีวิต",
    con: "ชื่อรุ่นซ้ำกับตารางบนหน้าแบรนด์",
    recommend: true,
  },
  {
    key: "c",
    title: "แบบ C — ไฮบริด (ตัวตนแบรนด์ + รุ่น + หลักฐาน)",
    blurb: "sidebar เล่าเรื่องแบรนด์เอง: บล็อกตัวตน (โลโก้ + ช่วงราคา + จำนวนรุ่น) → รายชื่อรุ่น → ท้ายเป็นวันตรวจล่าสุด + ลิงก์แหล่งอ้างอิง",
    pro: "ครบเครื่อง ดูแพง",
    con: "แน่นสุด + กินความสูงเมื่อแบรนด์มีรุ่นเยอะ",
  },
];

export default function ShellCompareIndex() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-xs font-semibold tracking-wider text-accent uppercase">
        M23 · หน้าเทียบภายใน (mockup)
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        เลือกโครงหน้าใน: sidebar แบรนด์ + navbar เครื่องมือ
      </h1>
      <p className="mt-3 text-[15px] leading-7 text-muted">
        หน้าแรกคงเดิม · 3 แบบนี้ต่างกันแค่ <strong className="font-semibold text-foreground">sidebar ฝั่งซ้าย</strong>{" "}
        (navbar ด้านบนเหมือนกันทุกแบบ) · กดเข้าไปลองคลิกสลับรุ่นในแต่ละแบบได้จริง แล้วบอกฉันว่าเอาแบบไหน
      </p>

      <div className="mt-5 space-y-2 rounded-xl border border-border bg-surface-muted p-4 text-[13px] leading-6 text-muted">
        <p>
          <strong className="font-semibold text-foreground">navbar เครื่องมือ</strong> (ทุกแบบ): ค้นหารุ่นรถ ·
          ตัวสลับแบรนด์ · ปุ่ม &ldquo;เทียบรุ่น (เร็วๆ นี้)&rdquo; · ลิงก์แบรนด์
        </p>
        <p>
          หมายเหตุ: โครง sidebar+navbar นี้ <strong className="font-semibold text-foreground">เคยทำค้างไว้รอบ M22</strong>{" "}
          (ตอนนั้นพักเพราะเลือกทิศ Kanit/light ก่อน) — รอบนี้รื้อสี/ฟอนต์ให้เข้าชุดปัจจุบันแล้ว
        </p>
        <p className="text-faint">
          ลิงก์ breadcrumb ในหน้าจะพาไปหน้า &ldquo;เวอร์ชันปัจจุบัน&rdquo; (ยังไม่มี sidebar) — ใช้เทียบก่อน/หลังได้
        </p>
      </div>

      <div className="mt-8 space-y-4">
        {VARIANTS.map((v) => (
          <div
            key={v.key}
            className={`rounded-2xl border p-5 ${v.recommend ? "border-accent bg-accent-soft" : "border-border"}`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight">{v.title}</h2>
              {v.recommend && (
                <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-medium text-white">
                  ฉันแนะนำ
                </span>
              )}
            </div>
            <p className="mt-2 text-sm leading-6 text-muted">{v.blurb}</p>
            <dl className="mt-3 flex flex-col gap-1 text-[13px] sm:flex-row sm:gap-6">
              <div className="flex gap-1.5">
                <dt className="font-medium text-success">ดี:</dt>
                <dd className="text-muted">{v.pro}</dd>
              </div>
              <div className="flex gap-1.5">
                <dt className="font-medium text-warning">เสี่ยง:</dt>
                <dd className="text-muted">{v.con}</dd>
              </div>
            </dl>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={`/dev/shell-${v.key}/brands/toyota`}
                className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                ดูหน้าแบรนด์ →
              </Link>
              <Link
                href={`/dev/shell-${v.key}/cars/hilux-champ`}
                className="rounded-full border border-border-strong px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted"
              >
                ดูหน้ารุ่นรถ →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
