"use client";

// หน้าเทียบทิศ UX/UI ของ CARMETA — เลือกทิศ, เลือกหน้าจอ, ดูคอมกับมือถือพร้อมกัน
// กรอบทั้งสองโหลดหน้าเดียวกันจริง (/proto/redesign-2026/view) — ในกรอบเดินต่อได้เอง กดเข้าหน้ารุ่น/รุ่นย่อยได้
import { useProtoFlag, useProtoVariant } from "../_kit/use-proto-variant";
import { DIRS, SCREENS, protoHref, type Dir, type Screen } from "./_screens/kit";

const DIR_VALUES = DIRS.map((d) => d.value);
const SCREEN_VALUES = SCREENS.map((s) => s.value);

const COPY: Record<Dir, { name: string; idea: string; flow: string; tradeoff: string; seo: string }> = {
  current: {
    name: "ปัจจุบัน — เว็บวันนี้",
    idea: "หน้าแรกเป็นหน้าต้อนรับ: พาดหัวพิมพ์วน + ช่องค้นหาใหญ่ + โลโก้แบรนด์ แล้วค่อยเจอตารางเมื่อเลื่อนลง · หน้ารุ่นมีแบนเนอร์ใหญ่ก่อนถึงตารางรุ่นย่อย",
    flow: "หน้าแรก → เลื่อนหาตาราง → หน้ารุ่น → ตารางรุ่นย่อย → หน้ารุ่นย่อย (4 จังหวะกว่าจะเห็นราคาที่เทียบได้)",
    tradeoff: "สวยและไม่ข่มคนมาใหม่ แต่คนที่มาเพื่อ “เช็กราคา” ต้องเลื่อนผ่านของที่ไม่ได้ตอบคำถามเขาก่อนเสมอ",
    seo: "มีหน้าเดียวต่อรุ่น/รุ่นย่อย — ไม่มีหน้ารวมแบบ “กระบะไม่เกิน 1 ล้าน” ที่คนค้นจริงใน Google",
  },
  filter: {
    name: "A · ตารางคือหน้าแรก",
    idea: "เว็บเป็นเครื่องมือ ไม่ใช่แผ่นพับ — เปิดมาเจอข้อมูลทั้งฐานทันที มีแถบกรองเกาะอยู่ด้านบนตลอด (ประเภท ขุมพลัง งบ) หน้ารุ่นก็เข้าตาราง 18 รุ่นย่อยทันที กรองต่อได้ในนั้น",
    flow: "หน้าแรก = ตาราง → กรองจนเหลือไม่กี่ตัว → หน้ารุ่น (ตารางรุ่นย่อยกรองได้) → หน้ารุ่นย่อย (2 จังหวะ)",
    tradeoff: "เปิดมาแล้วดู “เครื่องมือ” ไม่ต้อนรับ คนที่ไม่รู้จะเริ่มยังไงอาจเคว้ง · ต้องลงแรงทำหน้ารวมตามตัวกรองจริงๆ ไม่งั้นได้แค่ครึ่งเดียว",
    seo: "ดีที่สุดในสามทาง: ทุกชุดตัวกรองยอดนิยมกลายเป็นหน้าจริงของตัวเอง (เช่น /รถ/pickup-diesel-ไม่เกิน-1ล้าน) ตรงกับคำที่คนพิมพ์ค้น",
  },
  answer: {
    name: "B · ถามแล้วตอบ",
    idea: "คนเปิดเว็บรถมีคำถามในหัวอยู่แล้ว — หน้าแรกจึงเป็นช่องถามที่ตอบทันทีขณะพิมพ์ (ลึกถึงรุ่นย่อย) + การ์ดคำถามยอดฮิตที่ตอบมาให้แล้วในใบ · หน้ารุ่น/รุ่นย่อยขึ้นต้นด้วยกล่อง “คำตอบสั้น” แล้วค่อยกางตารางเป็นหลักฐาน",
    flow: "พิมพ์คำถาม → เห็นคำตอบ/รุ่นย่อยในลิสต์เลย → กดเข้าไปอ่านหลักฐาน (1–2 จังหวะ)",
    tradeoff: "ต้องเขียน “คำตอบ” ให้ถูกต้องทุกรุ่นโดยไม่หลุดไปตัดสินแทนผู้ใช้ (กฎเว็บ: ไม่จัดอันดับว่ารุ่นไหนดีที่สุด) · ข้อมูลบางรุ่นยังบางเกินจะตอบได้ ต้องกล้าเขียนว่ายังไม่รู้",
    seo: "ดีเรื่องคำถาม: หัวข้อหน้าเป็นประโยคที่คนค้นจริง (“Hilux Travo ราคาเท่าไหร่”) + FAQ ต่อรุ่นที่ Google หยิบไปโชว์ได้",
  },
  guide: {
    name: "C · คู่มือรถ",
    idea: "ต่อยอดหน้าตาที่เบสเลือกไว้แล้ว (แถบสีเฉียง + หัวข้อ ■ + แถบสถิติ) ให้เป็นคู่มือเต็มตัว — สารบัญเกาะซ้ายทุกหน้า สารบัญย่อย “ในหน้านี้” อยู่ขวา อ่านต่อเนื่องได้ไม่ต้องย้อนหน้าแรก",
    flow: "เข้าหน้าไหนก็เดินต่อจากสารบัญได้เลย ไม่ต้องย้อน (จังหวะพอกับปัจจุบัน แต่ไม่หลงทาง)",
    tradeoff: "หน้าตาแน่นและ “วิชาการ” ที่สุดในสามทาง · บนมือถือสารบัญซ้ายต้องยุบเป็นปุ่ม ทำให้จุดแข็งหายไปครึ่งหนึ่ง · เนื้อหาต้องเยอะพอถึงจะดูเต็ม ไม่งั้นโล่ง",
    seo: "ดีเรื่องโครงสร้าง: ลิงก์ภายในแน่น หน้าลึกถูกเก็บครบ แต่ไม่มีหน้ารวมตามคำค้นแบบทาง A",
  },
};

const NOTES = [
  "ตัวเลข ราคา ชื่อรุ่นทั้งหมดในหน้าลองเป็นของจริงจากฐานข้อมูล (Toyota ตรวจ 19 ก.ค. · Tesla/Benz 22 ก.ค. 2026) แต่แช่แข็งไว้ในไฟล์ ไม่ได้ยิงฐานข้อมูลจริง",
  "รูปรถมีเฉพาะ Toyota 5 รุ่น — Tesla/Mercedes-Benz ยังไม่มีสิทธิ์ใช้ภาพ ทุกทิศจึงต้องออกแบบเผื่อ “ไม่มีรูป”",
  "สวิตช์ “ดูรุ่นที่ข้อมูลไม่ครบ” ใช้ดูว่าแต่ละทิศรับมือข้อมูลขาดยังไง (ไม่มีรูป · ไม่มีปีเปิดตัว · สเปกไม่ระบุ ADAS · กรองแล้วไม่เจอ)",
  "เจอบั๊กของเว็บจริงระหว่างทำ: ทิศ “ปัจจุบัน” บนมือถือ ราคาในแถบสถิติหัวหน้ารุ่นถูกตัดท้าย (฿767,00 / ฿1,491,) — หน้าลองคงไว้ตามของจริง ไม่แอบแก้ · จะแก้ตอนลงของจริงทิศที่เลือก",
  "ยังไม่ได้ทำในหน้าลองนี้: หน้าแบรนด์ · หน้าจัดอันดับ · เมนูมือถือแบบกดเปิดจริง — ทั้งสามจะตามภาษาของทิศที่เบสเลือก",
];

export default function RedesignProtoPage() {
  const [dir, setDir] = useProtoVariant<Dir>("v", DIR_VALUES, "current");
  const [screen, setScreen] = useProtoVariant<Screen>("s", SCREEN_VALUES, "home");
  const [thin, toggleThin] = useProtoFlag("thin");
  const copy = COPY[dir];
  const src = protoHref(dir, screen, thin);

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6">
      <div className="mx-auto max-w-[1360px]">
        <p className="text-xs font-medium tracking-[0.18em] text-faint uppercase">หน้าลอง · 30 ส.ค. 2026</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          คนเข้า CARMETA ควรเดินยังไงถึงได้คำตอบเร็วที่สุด — และหน้าตาแบบไหนที่ใช้ง่ายจริง
        </h1>
        <p className="mt-2 max-w-4xl text-[15px] leading-7 text-muted">
          สามทางข้างล่างไม่ได้ต่างกันแค่สีหรือระยะ แต่ต่างกันที่ <strong>ลำดับการเดินของคนใช้</strong> —
          จะให้เจอ “ข้อมูลทั้งฐาน” ก่อน, ให้ “ถามแล้วตอบ” ก่อน, หรือให้ “อ่านเป็นคู่มือ” · เลือกได้ทางเดียว
          เพราะทั้งเว็บต้องพูดภาษาเดียวกัน
        </p>

        {/* แถวควบคุม */}
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Segmented
            label="ทิศ"
            options={DIRS}
            value={dir}
            onChange={setDir}
          />
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

        {/* คอมกับมือถือในสายตาเดียวกัน */}
        <section className="mt-6 flex flex-wrap gap-6">
          <div className="min-w-0 flex-1">
            <p className="mb-2 text-xs font-medium tracking-[0.18em] text-faint uppercase">
              บนคอม (ย่อจากจอ 1280px)
            </p>
            <div className="h-[700px] w-full max-w-[896px] overflow-hidden rounded-2xl border border-border bg-surface">
              <iframe
                key={`d-${src}`}
                src={src}
                title="ตัวอย่างบนคอม"
                className="origin-top-left border-0"
                style={{ width: 1280, height: 1000, transform: "scale(0.7)" }}
              />
            </div>
          </div>
          <div className="shrink-0">
            <p className="mb-2 text-xs font-medium tracking-[0.18em] text-faint uppercase">
              บนมือถือ (390px)
            </p>
            <div className="h-[700px] w-[390px] overflow-hidden rounded-[2rem] border-[6px] border-surface-muted bg-surface">
              <iframe
                key={`m-${src}`}
                src={src}
                title="ตัวอย่างบนมือถือ"
                className="size-full border-0"
              />
            </div>
          </div>
        </section>

        {/* คำอธิบายทิศ + ข้อแลก */}
        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="border-l-2 border-accent pl-4">
            <h2 className="text-xl font-bold">{copy.name}</h2>
            <p className="mt-2 text-[15px] leading-7">{copy.idea}</p>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 text-faint">การเดิน</dt>
                <dd>{copy.flow}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 text-faint">ข้อแลก</dt>
                <dd className="text-warning">{copy.tradeoff}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 text-faint">Google</dt>
                <dd>{copy.seo}</dd>
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

        {/* ตารางเทียบสั้นๆ ให้ตัดสินใจได้ในสายตาเดียว */}
        <section className="mt-8 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-surface-muted/60">
              <tr className="border-b border-border text-left text-[12px] text-faint">
                <th className="px-4 py-2.5 font-medium">ทิศ</th>
                <th className="px-4 py-2.5 font-medium">เห็นราคาที่เทียบได้ในกี่จังหวะ</th>
                <th className="px-4 py-2.5 font-medium">คนมาใหม่รู้สึกยังไง</th>
                <th className="px-4 py-2.5 font-medium">แรงที่ต้องลง</th>
                <th className="px-4 py-2.5 font-medium">ได้อะไรกับ Google</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["ปัจจุบัน", "4 จังหวะ", "อบอุ่น ไม่ข่ม", "—", "พอใช้ (หน้าละรุ่น)"],
                ["A · ตารางคือหน้าแรก", "2 จังหวะ", "เหมือนเครื่องมือ อาจเคว้ง", "มาก (ต้องทำหน้ารวมตามตัวกรอง)", "ดีที่สุด (หน้ารวมตามคำค้น)"],
                ["B · ถามแล้วตอบ", "1–2 จังหวะ", "เข้าใจง่ายที่สุด", "กลาง (ต้องเขียนคำตอบให้ถูกทุกรุ่น)", "ดี (หัวข้อ+FAQ ตรงคำถาม)"],
                ["C · คู่มือรถ", "3 จังหวะ", "เหมือนคู่มือ/สารานุกรม", "กลาง (ต่อยอดของเดิม)", "ดี (โครงสร้าง+ลิงก์ภายใน)"],
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
          เลือกแล้วส่งกลับมาแค่ตัวอักษรก็พอ (“เอา B”) — หรือก๊อปลิงก์บนแถบที่อยู่ตอนที่ดูอยู่ ลิงก์จำทิศ/หน้าจอที่เลือกไว้ให้
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
