"use client";

// หน้าเทียบ "หน้าตา/บุคลิก" ของ CARMETA — รอบนี้เทียบลุค ไม่ใช่ลำดับการเดิน
// (รอบก่อน /proto/redesign-2026 เทียบลำดับการเดิน แต่ทุกทางใช้หน้าตาชุดเดียวกัน เลยยังไม่เห็นความต่าง)
import { useProtoFlag, useProtoVariant } from "../_kit/use-proto-variant";
import { LOOKS, SCREENS, lookHref, type Look, type Screen } from "./_looks/kit";

const LOOK_VALUES = LOOKS.map((l) => l.value);
const SCREEN_VALUES = SCREENS.map((s) => s.value);

const COPY: Record<
  Look,
  { name: string; feel: string; idea: string; strong: string; tradeoff: string; blue: string }
> = {
  current: {
    name: "ปัจจุบัน — เว็บวันนี้",
    feel: "สว่าง สะอาด เหมือนเว็บข้อมูลทั่วไป",
    idea: "พื้นขาว การ์ดมนๆ พาดหัวพิมพ์วน แล้วค่อยเจอตาราง — เรียบร้อยแต่ไม่มีอะไรให้จำ",
    strong: "อ่านง่าย ไม่ข่มใคร โลโก้แบรนด์ทุกยี่ห้อวางแล้วสวยแน่นอน",
    tradeoff: "หน้าตาเหมือนเว็บรถทั่วไป — คนที่เข้ามาแล้วออกไป จำไม่ได้ว่าเพิ่งดูเว็บอะไร",
    blue: "น้ำเงิน Royal #2f56c9 บนพื้นขาว (ของเดิม)",
  },
  meta: {
    name: "D · META — สายสถิติ",
    feel: "มืดกรมท่า ตัวเลขเป็นพระเอก (ฟีล dotabuff / op.gg)",
    idea: "ทุกแถวมีแท่งช่วงราคาวางบนสเกลเดียวกันทั้งตาราง — กวาดตาทีเดียวรู้เลยว่ารุ่นไหนอยู่ช่วงไหนของตลาด · หน้ารุ่นมี “บันไดราคา” ทั้ง 18 รุ่นย่อยเรียงเป็นแท่ง เห็นช่องว่างราคาและจุดที่ควรจ่ายเพิ่ม",
    strong: "เหมาะกับคนที่มาศึกษาจริงจัง เทียบเยอะ ๆ · ข้อมูลแน่นแต่ไม่รก เพราะแท่งช่วยอ่านแทนตัวเลข",
    tradeoff: "พื้นมืดทำให้โลโก้แบรนด์สีเข้ม (Ford/Mazda/Isuzu) จมหาย — ต้องมีชิปพื้นอ่อนรองทุกโลโก้ · คนทั่วไปที่แค่อยากเช็กราคาอาจรู้สึกว่า “จริงจังเกิน”",
    blue: "น้ำเงินสว่าง #4d8bff + ฟ้า #29d3ee บนกรมท่า #070b16",
  },
  pit: {
    name: "E · PIT — คู่มือแบบการ์ด",
    feel: "มืดน้ำเงินอมม่วง การ์ดรถเป็นพระเอก (ฟีล prydwen)",
    idea: "รถแต่ละรุ่นเป็นการ์ดที่จำหน้าได้ — ภาพเด่น แถบสีบอกหมวดขุมพลัง ราคาเริ่มต้นตัวใหญ่ · สารบัญเกาะซ้ายทุกหน้า เดินต่อได้ไม่ต้องย้อน · หน้ารุ่นจัดรุ่นย่อยเป็นการ์ดสองคอลัมน์ต่อตัวถัง",
    strong: "ดูแล้ว “ว้าว” เร็วที่สุดในสามทาง และเป็นมิตรกับคนที่ยังไม่รู้จะเริ่มตรงไหน",
    tradeoff: "การ์ดกินพื้นที่ — เห็นรุ่นต่อจอน้อยกว่าตาราง · พอรุ่นเยอะขึ้นเป็นร้อย จะเลื่อนยาว ต้องพึ่งตัวกรองหนักขึ้น · ต้องมีรูปรถทุกคัน (ตอนนี้มีแค่ Toyota 5 รุ่น)",
    blue: "น้ำเงินม่วง #6d8bff + เขียวมิ้นต์ #46e0d0 บนกรมท่าอมม่วง #0d1030",
  },
  blueprint: {
    name: "F · BLUEPRINT — แบบแปลนวิศวกรรม",
    feel: "สว่าง แต่เป็นน้ำเงินทั้งหน้า มีเส้นตารางแบบกระดาษไข",
    idea: "จัดหน้าเหมือนเอกสารเทคนิค: เลขข้อกำกับทุกหัวข้อ ตารางสเปกมีจุดไข่ปลา กรอบมุมตัด และ “ช่องรับรองข้อมูล” ปิดท้ายทุกหน้า (ที่มา · วันที่ตรวจ · ความเชื่อมั่น)",
    strong: "หน้าตาพูดแทนจุดยืนของเว็บได้เอง — “ตรวจสอบได้ทุกบรรทัด” โดยไม่ต้องเขียนโฆษณา · ไม่เหมือนเว็บรถเจ้าไหนในไทย และโลโก้แบรนด์ยังวางได้สวยเพราะพื้นสว่าง",
    tradeoff: "บุคลิกจริงจังแบบเอกสาร — ไม่หวือหวาเท่าสองทางมืด · ถ้าทำไม่ดีจะดู “แห้ง” ต้องใช้ภาพรถและช่องว่างช่วย",
    blue: "น้ำเงินหมึก #1345c4 บนกระดาษฟ้าจาง #eef3fc + เส้นตาราง 28px",
  },
};

const NOTES = [
  "ทั้งสามทางใช้ข้อมูลจริงชุดเดียวกัน (12 รุ่น · 64 รุ่นย่อย · Hilux Travo ครบ 18 รุ่นย่อย · ADAS จริง) — ต่างกันที่หน้าตาล้วนๆ ตัดสินได้ว่าชอบบุคลิกไหน",
  "สีน้ำเงินยังเป็นแกนทั้งสามทางตามที่เบสสั่ง แต่คนละอุณหภูมิ — เทียบโค้ดสีได้ในบรรทัด “สีน้ำเงินที่ใช้” ข้างล่าง",
  "ทางมืด (D/E) ต้องแก้เรื่องโลโก้แบรนด์สีเข้มจมพื้น — วิธีมาตรฐานคือวางโลโก้บนชิปพื้นอ่อน แบบที่ op.gg/prydwen ทำ ยังไม่ได้ทำในหน้าลองนี้",
  "ยังไม่ได้ทำ: หน้าแบรนด์ · หน้าจัดอันดับ · เมนูมือถือแบบกดเปิดจริง — จะตามลุคที่เบสเลือก",
  "เลือกลุคแล้วยังเลือก “ลำดับการเดิน” จากหน้าลองรอบก่อนได้อีกชั้น (/proto/redesign-2026) — สองเรื่องนี้ประกอบกันได้",
];

export default function LookProtoPage() {
  const [look, setLook] = useProtoVariant<Look>("v", LOOK_VALUES, "meta");
  const [screen, setScreen] = useProtoVariant<Screen>("s", SCREEN_VALUES, "home");
  const [thin, toggleThin] = useProtoFlag("thin");
  const copy = COPY[look];
  const src = lookHref(look, screen, thin);

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6">
      <div className="mx-auto max-w-[1360px]">
        <p className="text-xs font-medium tracking-[0.18em] text-faint uppercase">หน้าลอง · 30 ส.ค. 2026</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          CARMETA ควรมี “หน้าตา” แบบไหน สำหรับคนที่มาศึกษาข้อมูลรถก่อนตัดสินใจซื้อ
        </h1>
        <p className="mt-2 max-w-4xl text-[15px] leading-7 text-muted">
          รอบนี้เทียบ <strong>บุคลิกและหน้าตา</strong> ตรงๆ (รอบก่อนเทียบลำดับการเดิน แต่ทุกทางหน้าตาเหมือนกันหมด
          เลยยังไม่เห็นความต่าง) · ทั้งสามทางฉีกจากของเดิมคนละแบบ แต่ยังเป็นสีน้ำเงิน CI ตามที่สั่ง
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
            {thin ? "กำลังดู: รุ่นที่ข้อมูลไม่ครบ" : "ดูตอนข้อมูลไม่ครบ"}
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

        <section className="mt-8 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="bg-surface-muted/60">
              <tr className="border-b border-border text-left text-[12px] text-faint">
                <th className="px-4 py-2.5 font-medium">ลุค</th>
                <th className="px-4 py-2.5 font-medium">เหมาะกับใคร</th>
                <th className="px-4 py-2.5 font-medium">ข้อมูลต่อหน้าจอ</th>
                <th className="px-4 py-2.5 font-medium">ความจำได้/เอกลักษณ์</th>
                <th className="px-4 py-2.5 font-medium">ปัญหาที่ต้องแก้ถ้าเลือก</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["ปัจจุบัน", "คนทั่วไปที่แค่เช็กราคา", "ปานกลาง", "ต่ำ — เหมือนเว็บทั่วไป", "—"],
                ["D · META", "คนศึกษาจริงจัง เทียบหลายรุ่น", "สูงสุด", "สูง (สายสถิติ)", "โลโก้แบรนด์บนพื้นมืด · ต้องมีชิปรองโลโก้"],
                ["E · PIT", "คนเพิ่งเริ่มหา ยังไม่รู้จะดูรุ่นไหน", "ต่ำสุด (การ์ดกินที่)", "สูงสุด (จำการ์ดได้)", "ต้องมีรูปรถทุกคัน · รุ่นเยอะแล้วเลื่อนยาว"],
                ["F · BLUEPRINT", "คนที่ให้ค่ากับความน่าเชื่อถือ", "สูง", "สูง (ไม่เหมือนใครในไทย)", "ต้องคุมไม่ให้ดูแห้ง · ใช้ภาพช่วย"],
              ].map((r) => (
                <tr key={r[0]} className="border-b border-border last:border-b-0">
                  {r.map((c, i) => (
                    <td key={i} className={`px-4 py-2.5 ${i === 0 ? "font-medium" : "text-muted"}`}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <p className="mt-6 text-[13px] text-faint">
          ตอบกลับมาแค่ตัวอักษรก็พอ (“เอา D”) · ผสมได้ด้วย เช่น “เอา D แต่พื้นสว่างแบบ F” — บอกมาได้เลย
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
