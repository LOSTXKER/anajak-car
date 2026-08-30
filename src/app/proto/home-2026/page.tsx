"use client";

// หน้าเทียบ: หน้าแรกแบบใหม่ vs หน้าแรกของเว็บวันนี้ — คอมกับมือถือในสายตาเดียวกัน
import { useProtoVariant } from "../_kit/use-proto-variant";

const VIEWS = [
  { value: "lux", label: "แบบพรีเมียม (ใหม่ล่าสุด)" },
  { value: "current", label: "หน้าแรกวันนี้" },
  { value: "data", label: "แบบข้อมูลจัด (รอบก่อน)" },
] as const;
type View = (typeof VIEWS)[number]["value"];
const VALUES = VIEWS.map((v) => v.value);

const SRC: Record<View, string> = {
  lux: "/proto/home-2026/lux",
  current: "/proto/redesign-2026/view?v=current&s=home",
  data: "/proto/home-2026/view",
};

export default function HomeComparePage() {
  const [view, setView] = useProtoVariant<View>("v", VALUES, "lux");
  const src = SRC[view];

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6">
      <div className="mx-auto max-w-[1360px]">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          หน้าแรกแบบพรีเมียม — เก็บพาดหัวพิมพ์วนกับช่องค้นหาใหญ่ไว้ แล้วยกภาพรถขึ้นเป็นพระเอก
        </h1>
        <p className="mt-2 max-w-4xl text-[15px] leading-7 text-muted">
          เบสบอกว่าของเดิมยังดีกว่าเพราะพาดหัวพิมพ์วนกับช่องค้นหาใหญ่หายไป และอยากได้ความรู้สึก
          “เว็บรถหรู” — รอบนี้จึงเก็บสองอย่างนั้นไว้ครบ แล้วยกระดับด้วยภาพรถขนาดใหญ่ ช่องไฟกว้าง
          และตัวอักษรคม โดยข้อมูล/หลักฐานยังอยู่ครบทุกจุด
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
            <h2 className="text-lg font-bold">แบบพรีเมียม — อะไรเปลี่ยนไป</h2>
            <ul className="mt-2 space-y-2 text-sm leading-7 text-muted">
              <li>
                • <strong className="text-foreground">เก็บของเดิมที่เบสชอบไว้ครบ</strong> — พาดหัวใหญ่ที่พิมพ์วนได้
                (คอมโพเนนต์ตัวเดียวกับเว็บจริง) และช่องค้นหาใหญ่กลางหน้า ยังอยู่ตำแหน่งเดิม แค่ทำให้เนี้ยบขึ้น
              </li>
              <li>
                • <strong className="text-foreground">ภาพรถเป็นพระเอก</strong> — ภาพเต็มเวทีใต้ช่องค้นหา
                และรุ่นเด่นวางภาพใหญ่สลับซ้ายขวาแบบเว็บผู้ผลิต ไม่ใช่การ์ดขนาดเท่ากันเรียงกริด
              </li>
              <li>
                • <strong className="text-foreground">หลักฐานอยู่ในสายตาเสมอ</strong> — วันที่ตรวจอยู่บนหัวแบรนด์
                ที่มาอยู่ท้ายทุกแถว และท้ายหน้าบอกตรงๆ ว่าอะไรที่ยังไม่มี
              </li>
              <li>
                • <strong className="text-foreground">แบรนด์เป็นหัวข้อ ไม่ใช่การ์ด</strong> — เลือกแบรนด์ได้จาก
                หน้าแรกโดยไม่ต้องมีกริดการ์ดหรือช่องค้นหาเป็นพระเอก
              </li>
              <li>
                • <strong className="text-foreground">ไม่มีของที่ทำให้ดูเหมือนงาน AI</strong> — ไม่มีการ์ดขนาดเท่ากัน
                เรียงสามใบ ไม่มีแถบสถิติสี่ช่อง ไม่มีไล่สี ไม่มีป้ายเล็กเหนือหัวข้อ
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-surface-muted/40 p-4">
            <p className="text-sm font-semibold">ที่ต้องรู้</p>
            <ul className="mt-2 space-y-2 text-[13px] leading-6 text-muted">
              <li>
                • ราคาทั้ง 64 จุดเป็นของจริงจากฐานข้อมูล (Toyota ตรวจ 19 ก.ค. · Tesla/Benz 22 ก.ค. 2026)
                แช่แข็งไว้ในไฟล์หน้าลอง
              </li>
              <li>
                • แกนราคาเป็นสเกลเท่าตัว (5 แสน · 1 · 2 · 4 · 8 ล้าน) เพราะรถถูกสุดกับแพงสุดห่างกัน 13 เท่า —
                เขียนกำกับไว้ท้ายหน้าแล้ว ไม่ปล่อยให้เข้าใจผิดว่าเป็นแกนตรง
              </li>
              <li>• ลิงก์ในหน้ายังไม่พาไปไหน — รอบนี้ทำหน้าแรกอย่างเดียวตามที่สั่ง</li>
              <li>• ถ้าเคาะหน้านี้ ผมจะทำหน้าแบรนด์ / หน้ารุ่น / หน้ารุ่นย่อย ต่อด้วยภาษาเดียวกัน</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
