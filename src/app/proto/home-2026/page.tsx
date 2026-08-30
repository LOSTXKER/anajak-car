"use client";

// หน้าเทียบ: หน้าแรกแบบใหม่ vs หน้าแรกของเว็บวันนี้ — คอมกับมือถือในสายตาเดียวกัน
import { useProtoVariant } from "../_kit/use-proto-variant";

const VIEWS = [
  { value: "new", label: "หน้าแรกแบบใหม่" },
  { value: "current", label: "หน้าแรกวันนี้" },
] as const;
type View = (typeof VIEWS)[number]["value"];
const VALUES = VIEWS.map((v) => v.value);

const SRC: Record<View, string> = {
  new: "/proto/home-2026/view",
  current: "/proto/redesign-2026/view?v=current&s=home",
};

export default function HomeComparePage() {
  const [view, setView] = useProtoVariant<View>("v", VALUES, "new");
  const src = SRC[view];

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6">
      <div className="mx-auto max-w-[1360px]">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          หน้าแรกที่พิสูจน์สองอย่าง: เราแยกรถถึงรุ่นย่อยจริง และทุกราคามีที่มา
        </h1>
        <p className="mt-2 max-w-4xl text-[15px] leading-7 text-muted">
          รอบนี้ไม่ยืมหน้าตาจากที่ไหน — หน้าเกิดจากข้อมูลที่เรามีจริง: ราคาป้ายของรุ่นย่อยครบทั้ง 64 รายการ
          วางบนแกนราคาเส้นเดียวกันทั้งหน้า · แบรนด์เป็นหัวข้อของแต่ละกลุ่ม กดเข้าได้ตรงจากหน้าแรก
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
            <h2 className="text-lg font-bold">อะไรเปลี่ยนไปจากเดิม</h2>
            <ul className="mt-2 space-y-2 text-sm leading-7 text-muted">
              <li>
                • <strong className="text-foreground">ความลึกกลายเป็นภาพ</strong> — แต่ละรุ่นไม่ได้มีแค่
                “ราคาเริ่มต้น” แต่มีจุดครบทุกรุ่นย่อยวางบนแกนราคาเดียวกัน เห็นทันทีว่า Hilux Travo มี 18
                เกรดกระจายเกือบเท่าตัว ส่วน bZ4X มีสองเกรดชิดกัน — ข้อมูลระดับนี้เว็บรถอื่นไม่มี
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
