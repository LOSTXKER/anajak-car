"use client";

// หน้าเทียบ: หน้าแรกแบบใหม่ vs หน้าแรกของเว็บวันนี้ — คอมกับมือถือในสายตาเดียวกัน
import { useProtoVariant } from "../_kit/use-proto-variant";

const VIEWS = [
  { value: "apple", label: "แบบที่ Apple น่าจะทำ (ใหม่ล่าสุด)" },
  { value: "lux", label: "แบบกระดานราคา (รอบก่อน)" },
  { value: "current", label: "หน้าแรกวันนี้" },
  { value: "data", label: "แบบข้อมูลจัด (รอบก่อน)" },
] as const;
type View = (typeof VIEWS)[number]["value"];
const VALUES = VIEWS.map((v) => v.value);

const SRC: Record<View, string> = {
  apple: "/proto/home-2026/apple",
  lux: "/proto/home-2026/lux",
  current: "/proto/redesign-2026/view?v=current&s=home",
  data: "/proto/home-2026/view",
};

export default function HomeComparePage() {
  const [view, setView] = useProtoVariant<View>("v", VALUES, "apple");
  const src = SRC[view];

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6">
      <div className="mx-auto max-w-[1360px]">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          ถ้า Apple ทำเว็บนี้ — เขาจะทำ “หน้าเทียบสเปก” ไม่ใช่หน้าโฆษณาโล่งๆ
        </h1>
        <p className="mt-2 max-w-4xl text-[15px] leading-7 text-muted">
          หน้าที่ข้อมูลแน่นที่สุดใน apple.com คือหน้าเทียบรุ่นกับหน้าสเปก ไม่ใช่หน้าโฆษณา —
          และนั่นคือหน้าที่ตรงกับ CARMETA พอดี เพราะสินค้าของเราคือ “ข้อมูล” ไม่ใช่รถ ·
          รอบนี้จึงยืมภาษาของหน้าสเปก Apple มาทั้งชุด: ระดับตัวอักษรห่างกันชัด เส้นผมบางแทนกล่อง
          แถบพื้นเทาสลับขาว ตารางเทียบเป็นพระเอก และ<strong className="text-foreground">เชิงอรรถมีเลขกำกับท้ายหน้า</strong>
          ซึ่งเป็นที่อยู่ของหลักฐานพอดีกับหลัก evidence-first ของเรา
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="flex gap-1 rounded-full bg-surface-muted p-1">
            {VIEWS.map((v) => (
              <button
                key={v.value}
                type="button"
                onClick={() => setView(v.value)}
                aria-pressed={view === v.value}
                className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                  view === v.value ? "bg-accent text-background" : "text-muted hover:text-foreground"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
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
            <div className="h-[760px] w-full max-w-[896px] overflow-hidden rounded-2xl border border-border bg-surface">
              <iframe
                key={`d-${src}`}
                src={src}
                title="หน้าแรกบนคอม"
                className="origin-top-left border-0"
                style={{ width: 1280, height: 1086, transform: "scale(0.7)" }}
              />
            </div>
          </div>
          <div className="shrink-0">
            <p className="mb-2 text-xs font-medium tracking-[0.18em] text-faint uppercase">บนมือถือ (390px)</p>
            <div className="h-[760px] w-[390px] overflow-hidden rounded-[2rem] border-[6px] border-surface-muted bg-surface">
              <iframe key={`m-${src}`} src={src} title="หน้าแรกบนมือถือ" className="size-full border-0" />
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="border-l-2 border-accent pl-4">
            <h2 className="text-lg font-bold">Apple จะทำอะไรกับหน้านี้</h2>
            <ul className="mt-2 space-y-2 text-sm leading-7 text-muted">
              <li>
                • <strong className="text-foreground">แน่น ไม่ใช่โล่ง</strong> — หน้า tech specs
                ของ Apple แน่นมาก ที่ดูโล่งคือหน้าขายของ · หน้านี้จึงมีครบทั้ง 64 เกรด บันได 18 เกรดจริง
                และตารางเทียบ 12 รุ่น (เบสเคยปัด “Apple minimal” เมื่อ 07-21 ว่าโล่งไป — รอบนี้ตั้งใจไม่ให้โล่ง)
              </li>
              <li>
                • <strong className="text-foreground">เชิงอรรถมีเลขกำกับ</strong> — ทุกตัวเลขสำคัญมีเลขยกเล็กๆ
                กดแล้วลงไปอ่านท้ายหน้าว่าราคานี้คือราคาอะไร ตรวจเมื่อไร ทำไม Tesla ความเชื่อมั่นต่างจาก Toyota
                นี่คือแพตเทิร์นที่ Apple ใช้กับข้อความกำกับสินค้าทุกหน้า และตรงกับกฎ evidence-first ของเรา
              </li>
              <li>
                • <strong className="text-foreground">หนึ่งหน้าจอหนึ่งประโยค</strong> — กลางหน้ามีตัวเลขใหญ่ตัวเดียว
                (ส่วนต่างราคาในรุ่นเดียวกัน) แล้วพิสูจน์ด้วยบันไดราคาจริงใต้ตัวเลขนั้นทันที
              </li>
              <li>
                • <strong className="text-foreground">ตารางเทียบคือพระเอก</strong> — แบบหน้า Compare ของ Apple:
                หัวตารางติดขอบบนตอนเลื่อน เส้นแบ่งเป็นเส้นผม ตัวเลขชิดขวาเรียงหลักตรง
              </li>
              <li>
                • <strong className="text-foreground">สามสถานะ ไม่ใช่สองสถานะ</strong> — คอลัมน์ระบบช่วยขับแยก
                “มี ✓ / ไม่มี — / ไม่ระบุ” ออกจากกัน เพราะเอกสารไม่ได้บอก ไม่เท่ากับไม่มี
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-surface-muted/40 p-4">
            <p className="text-sm font-semibold">ที่ต้องรู้</p>
            <ul className="mt-2 space-y-2 text-[13px] leading-6 text-muted">
              <li>
                • ตัวเลขทุกตัวคำนวณสดจากราคาจริง 64 รายการในฐาน (Toyota ตรวจ 19 ก.ค. · Tesla/Benz 22 ก.ค. 2026)
                ไม่มีเลขพิมพ์มือในหน้า
              </li>
              <li>
                • ฟอนต์ยังเป็น Kanit ตามระบบดีไซน์เดิม — ความเป็น Apple มาจากสเกล ช่องไฟ จังหวะแถบ
                และเส้นผม ไม่ได้มาจากการเปลี่ยนฟอนต์
              </li>
              <li>
                • ของที่เบสสั่งไว้รอบก่อนยังอยู่ครบ: พาดหัวพิมพ์วน · ช่องค้นหาใหญ่ · โลโก้แบรนด์เป็นทางลัดใน hero ·
                ไม่มีรูปรถ
              </li>
              <li>• ลิงก์ในหน้ายังไม่พาไปไหน — รอบนี้ทำหน้าแรกอย่างเดียว</li>
              <li>• ถ้าเคาะทางนี้ ฉันจะทำหน้าแบรนด์ / หน้ารุ่น / หน้ารุ่นย่อย ต่อด้วยภาษาเดียวกันค่ะ</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
