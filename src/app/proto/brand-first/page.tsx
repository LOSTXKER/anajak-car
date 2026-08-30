"use client";

// หน้าเทียบรอบ 3 — หลังเบสบอกว่า "คนชอบเลือกหมวดหมู่มากกว่าค้นหา" + "ของปัจจุบันยังดีกว่า" + ขอพื้นสว่าง
// รอบนี้จึงเปลี่ยนสองอย่างพร้อมกัน: flow (แบรนด์เป็นทางเข้า) และหน้าตา (สว่างทั้งคู่ แต่ยังฉีก)
import { useProtoFlag, useProtoVariant } from "../_kit/use-proto-variant";
import { LOOKS, SCREENS, bfHref, type Look, type Screen } from "./_looks/kit";

const LOOK_VALUES = LOOKS.map((l) => l.value);
const SCREEN_VALUES = SCREENS.map((s) => s.value);

const COPY: Record<
  Look,
  { name: string; feel: string; idea: string; strong: string; tradeoff: string; blue: string }
> = {
  current: {
    name: "ปัจจุบัน — เว็บวันนี้",
    feel: "สว่าง สะอาด · หน้าแรกเป็นช่องค้นหา",
    idea: "พาดหัวพิมพ์วน + ช่องค้นหาใหญ่ + แถวโลโก้แบรนด์เล็กๆ แล้วค่อยเจอตาราง · หน้าแบรนด์เป็นหน้าสรุป + ทางเข้า 3 การ์ด",
    strong: "อ่านง่าย โลโก้ทุกยี่ห้อวางแล้วสวย · เป็นตัวตั้งให้เทียบว่าของใหม่ดีขึ้นจริงไหม",
    tradeoff: "ช่องค้นหาเป็นพระเอกทั้งที่คนส่วนใหญ่อยากไล่ดูตามแบรนด์ · โลโก้แบรนด์อยู่กลางหน้า ต้องเลื่อนถึงจะเจอ",
    blue: "Royal #2f56c9 บนพื้นขาว (ของเดิม)",
  },
  analytics: {
    name: "G · ANALYTICS — แดชบอร์ดเทียบข้อมูล",
    feel: "ขาวสะอาด กราฟเป็นเนื้อหา (ตาม ref ที่เบสส่ง: artificialanalysis / arena)",
    idea: "หน้าแรกเปิดด้วย **การ์ดแบรนด์ใหญ่ 3 ใบ** (โลโก้ + จำนวนรุ่น + ช่วงราคาเป็นแท่ง) แล้วตามด้วยกราฟแท่งราคาเริ่มต้นทุกรุ่นบนแกนเดียวกัน และตารางจัดอันดับที่กดหัวคอลัมน์เรียงได้ · หน้ารุ่นมีแผนภาพจุด “ราคา × ระบบช่วยขับขี่ที่ยืนยันแล้ว” + บันไดราคา 18 รุ่นย่อย",
    strong: "ตอบโจทย์คนมาศึกษาเพื่อตัดสินใจซื้อโดยตรง — เห็นภาพรวมตลาดในฐานได้ในหน้าจอเดียว และยังเลือกหมวดจากแบรนด์ได้ก่อนเสมอ",
    tradeoff: "กราฟจะมีค่าจริงก็ต่อเมื่อข้อมูลเยอะพอ — ตอนนี้ 12 รุ่น 3 แบรนด์ยังดูโล่งกว่าที่ควรเป็น · ต้องมีวินัยไม่ให้กราฟกลายเป็นของประดับที่ไม่มีใครอ่าน",
    blue: "Royal #2f56c9 (CI เดิม) + ฟ้า #0ac3fb ในกราฟ บนพื้นขาว",
  },
  blueprint: {
    name: "H · BLUEPRINT — เอกสารแบบแปลน",
    feel: "กระดาษฟ้าจางมีเส้นตาราง หมึกน้ำเงินเข้ม",
    idea: "จัดหน้าเหมือนเอกสารเทคนิค: เลขข้อกำกับทุกหัวข้อ ตารางจุดไข่ปลา กรอบมุมตัด และช่องรับรองข้อมูลปิดท้ายทุกหน้า · รอบนี้เปิดหน้าแรกด้วยการ์ดแบรนด์เช่นกัน แล้วค่อยเป็นดัชนีรุ่น",
    strong: "หน้าตาพูดแทนจุดยืนของเว็บเอง (“ตรวจสอบได้ทุกบรรทัด”) · ไม่เหมือนเว็บรถเจ้าไหนในไทย จำได้ทันที",
    tradeoff: "บุคลิกจริงจังแบบเอกสาร ไม่มีลูกเล่นกราฟ · ถ้าเนื้อหาน้อยจะดูแห้ง ต้องพึ่งรูปรถและช่องว่างช่วย",
    blue: "หมึก #1345c4 บนกระดาษ #eef3fc + เส้นตาราง 28px",
  },
};

const NOTES = [
  "รอบนี้แก้สองอย่างตามที่เบสบอก: หน้าแรกเปลี่ยนจาก “ค้นหา” เป็น “เลือกแบรนด์” และตัดลุคพื้นมืดออกทั้งหมด",
  "เพิ่มหน้าจอใหม่: หน้าแบรนด์ — เป็นชั้นที่ขาดไปในหน้าลองสองรอบก่อน (ตอนนี้ flow = แบรนด์ → รุ่น → รุ่นย่อย)",
  "ปุ่ม “ดูตอนข้อมูลไม่ครบ” ในหน้าแบรนด์จะสลับไป Tesla ซึ่งไม่มีโลโก้ ไม่มีปีดำเนินงาน ไม่มีชื่อผู้จำหน่าย — ดูได้ว่าแต่ละลุครับมือช่องว่างยังไง",
  "ตัวเลขทุกตัวมาจากฐานข้อมูลจริง · กราฟทุกอันคำนวณสด ไม่มีค่าที่พิมพ์มือ · แผนภาพจุดในหน้ารุ่นตัดรุ่นไฟฟ้าออกและเขียนบอกเหตุผล เพราะสเปกให้กำลังมาเป็น kW ไม่ใช่ PS",
  "ยังไม่ได้ทำ: หน้าจัดอันดับ · เมนูมือถือแบบกดเปิดจริง · ชิปกรองบนหน้าแรกยังเป็นภาพนิ่ง (ตารางกดเรียงได้จริงแล้ว)",
];

export default function BrandFirstProtoPage() {
  const [look, setLook] = useProtoVariant<Look>("v", LOOK_VALUES, "analytics");
  const [screen, setScreen] = useProtoVariant<Screen>("s", SCREEN_VALUES, "home");
  const [thin, toggleThin] = useProtoFlag("thin");
  const copy = COPY[look];
  const src = bfHref(look, screen, thin);

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6">
      <div className="mx-auto max-w-[1360px]">
        <p className="text-xs font-medium tracking-[0.18em] text-faint uppercase">หน้าลอง · 30 ส.ค. 2026 (รอบ 3)</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          หน้าแรกเริ่มที่ “เลือกแบรนด์” — แล้วหน้าตาเอาแบบไหน
        </h1>
        <p className="mt-2 max-w-4xl text-[15px] leading-7 text-muted">
          แก้ตามที่เบสบอก: คนชอบเลือกหมวดมากกว่าค้นหา → ทุกทางในรอบนี้ <strong>เปิดหน้าแรกด้วยแบรนด์</strong> ·
          และตัดพื้นมืดออกหมด เหลือแต่พื้นสว่าง · เพิ่ม <strong>หน้าแบรนด์</strong> เข้ามาในชุดหน้าจอที่ดูได้
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Segmented label="ลุค" options={LOOKS} value={look} onChange={setLook} />
          <Segmented label="หน้าจอ" options={SCREENS} value={screen} onChange={setScreen} />
          <button
            type="button"
            onClick={toggleThin}
            className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
              thin
                ? "border-warning bg-warning-soft font-medium text-warning"
                : "border-border text-muted hover:bg-surface-muted"
            }`}
          >
            {thin ? "กำลังดู: ข้อมูลไม่ครบ" : "ดูตอนข้อมูลไม่ครบ"}
          </button>
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto rounded-full bg-accent px-4 py-1.5 text-sm text-background hover:opacity-90"
          >
            เปิดเต็มจอ ↗
          </a>
        </div>

        <section className="mt-6 flex flex-wrap gap-6">
          <div className="min-w-0 flex-1">
            <p className="mb-2 text-xs font-medium tracking-[0.18em] text-faint uppercase">
              บนคอม (ย่อจากจอ 1280px)
            </p>
            <div className="h-[720px] w-full max-w-[896px] overflow-hidden rounded-2xl border border-border bg-surface">
              <iframe
                key={`d-${src}`}
                src={src}
                title="ตัวอย่างบนคอม"
                className="origin-top-left border-0"
                style={{ width: 1280, height: 1029, transform: "scale(0.7)" }}
              />
            </div>
          </div>
          <div className="shrink-0">
            <p className="mb-2 text-xs font-medium tracking-[0.18em] text-faint uppercase">บนมือถือ (390px)</p>
            <div className="h-[720px] w-[390px] overflow-hidden rounded-[2rem] border-[6px] border-surface-muted bg-surface">
              <iframe key={`m-${src}`} src={src} title="ตัวอย่างบนมือถือ" className="size-full border-0" />
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="border-l-2 border-accent pl-4">
            <h2 className="text-xl font-bold">{copy.name}</h2>
            <p className="mt-1 text-sm text-faint">{copy.feel}</p>
            <p className="mt-2 text-[15px] leading-7">{copy.idea}</p>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex gap-3">
                <dt className="w-28 shrink-0 text-faint">ได้อะไร</dt>
                <dd>{copy.strong}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-28 shrink-0 text-faint">ข้อแลก</dt>
                <dd className="text-warning">{copy.tradeoff}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-28 shrink-0 text-faint">สีน้ำเงินที่ใช้</dt>
                <dd className="tnum">{copy.blue}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-border bg-surface-muted/40 p-4">
            <p className="text-sm font-semibold">สิ่งที่ต้องรู้ก่อนเลือก</p>
            <ul className="mt-2 space-y-2 text-[13px] leading-6 text-muted">
              {NOTES.map((n) => (
                <li key={n}>• {n}</li>
              ))}
            </ul>
          </div>
        </section>

        <p className="mt-6 text-[13px] text-faint">
          ตอบกลับมาสั้นๆ ก็พอ (“เอา G”) · ผสมได้ เช่น “เอา G แต่เอาช่องรับรองข้อมูลของ H มาด้วย”
        </p>
      </div>
    </main>
  );
}

function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-faint">{label}</span>
      <div className="flex flex-wrap gap-1 rounded-full bg-surface-muted p-1">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={value === o.value}
            className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
              value === o.value ? "bg-accent text-background" : "text-muted hover:text-foreground"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
