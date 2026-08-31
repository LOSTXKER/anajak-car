"use client";

// หน้าเทียบ M33 — โจทย์ใหม่ที่เบสเคาะ 2026-08-31:
// "หน้าแรกมีหน้าที่ทำให้เชื่อว่าข้อมูลที่นี่แม่นกว่าที่อื่น และพิสูจน์ด้วยการโชว์สิ่งที่เพิ่งเปลี่ยน"
// สองทิศใหม่ต่างกันที่ "อะไรคือพระเอก" ไม่ใช่ต่างกันที่สี
import { useProtoFlag, useProtoVariant } from "../_kit/use-proto-variant";

const VIEWS = [
  { value: "lab", label: "A · ห้องแล็บ (ใหม่)" },
  { value: "news", label: "B · ห้องข่าว (ใหม่)" },
  { value: "current", label: "หน้าแรกวันนี้" },
  { value: "apple", label: "รอบก่อน (Apple)" },
] as const;
type View = (typeof VIEWS)[number]["value"];
const VALUES = VIEWS.map((v) => v.value);

const SRC: Record<View, string> = {
  lab: "/proto/home-2026/lab",
  news: "/proto/home-2026/news",
  current: "/proto/redesign-2026/view?v=current&s=home",
  apple: "/proto/home-2026/apple",
};

/** สวิตช์สถานะขอบใช้ได้เฉพาะสองทิศใหม่ — ทิศเก่าไม่ได้อ่านพารามิเตอร์นี้ */
const SUPPORTS_STALE: View[] = ["lab", "news"];

export default function HomeComparePage() {
  const [view, setView] = useProtoVariant<View>("v", VALUES, "lab");
  const [stale, toggleStale] = useProtoFlag("stale");

  const canStale = SUPPORTS_STALE.includes(view);
  const src = canStale && stale ? `${SRC[view]}?stale=1` : SRC[view];

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6">
      <div className="mx-auto max-w-[1360px]">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          หน้าแรกที่ทำหน้าที่ “พิสูจน์ว่าข้อมูลที่นี่แม่น” — ไม่ใช่หน้าต้อนรับ
        </h1>
        <p className="mt-2 max-w-4xl text-[15px] leading-7 text-muted">
          รอบนี้เริ่มจากคำตอบของเบสสามข้อ: คนที่เข้ามา<strong className="text-foreground">ไม่ได้เพิ่งออกจากเว็บไหน</strong>{" "}
          (ไม่มีใครรวมข้อมูลแบบนี้ไว้) · หน้าแรกมีเวลา 10 วินาทีเพื่อ
          <strong className="text-foreground">ทำให้เชื่อว่าข้อมูลที่นี่แม่นกว่าที่อื่น</strong> · และพิสูจน์ด้วย
          <strong className="text-foreground">การโชว์สิ่งที่เพิ่งเปลี่ยน</strong> · เมื่อไม่มีคู่แข่งให้เทียบผลลัพธ์
          การพิสูจน์จึงต้องทำด้วยการ<strong className="text-foreground">เปิดครัว</strong> — ให้เห็นว่าเราไปเอาข้อมูลมายังไง
          เมื่อไร จากไหน และตรงไหนที่ยังไม่มี · ทั้งสองทิศใช้เนื้อหาชุดเดียวกัน ต่างกันที่ว่า “อะไรคือพระเอก”
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-1 rounded-full bg-surface-muted p-1">
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

          <button
            type="button"
            onClick={toggleStale}
            disabled={!canStale}
            aria-pressed={stale && canStale}
            className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
              stale && canStale
                ? "border-danger bg-danger/10 text-danger"
                : "border-border text-muted hover:text-foreground"
            } ${canStale ? "" : "cursor-not-allowed opacity-40"}`}
          >
            {stale && canStale ? "✓ " : ""}สถานะขอบ: ถ้าเงียบไป 3 เดือน
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

        {canStale ? (
          <p className="mt-3 max-w-4xl text-[13px] leading-6 text-faint">
            ปุ่ม “ถ้าเงียบไป 3 เดือน” คือ<strong className="text-foreground">ด้านมืดของทิศนี้</strong> —
            หน้าแรกที่เอาความสดเป็นพระเอก จะป่าวประกาศเองเมื่อไม่มีใครอัปเดต · กดดูก่อนเคาะว่ารับได้ไหม
            เพราะถ้าเลือกทางนี้ ความสวยของหน้าแรก = ความสม่ำเสมอของงานเก็บข้อมูล 1:1
          </p>
        ) : null}

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
            <h2 className="text-lg font-bold">A · ห้องแล็บ — “สถานะเป็นพระเอก”</h2>
            <p className="mt-2 text-sm leading-7 text-muted">
              เปิดมาเจอ<strong className="text-foreground">รายงานสถานะฐานข้อมูล</strong>ก่อน: ตรวจล่าสุดกี่วันมาแล้ว ·
              มีกี่แบรนด์/รุ่น/เกรด · แล้วตามด้วย<strong className="text-foreground">ตารางความครบถ้วน</strong>{" "}
              ที่บอกทีละช่องว่าแบรนด์ไหนเก็บอะไรครบแล้ว อะไรยังไม่เก็บ · บันทึกการตรวจสอบอยู่ถัดลงไปเป็นตารางเงียบๆ
            </p>
            <p className="mt-3 text-sm leading-7 text-muted">
              <strong className="text-foreground">เหมาะกับ</strong> คนที่เพิ่งเจอเว็บนี้ครั้งแรกแล้วถามว่า “เชื่อได้ไหม”
            </p>
            <p className="mt-3 rounded-lg bg-surface-muted/60 p-3 text-sm leading-6 text-muted">
              <strong className="text-foreground">ข้อแลก:</strong> ตารางความครบถ้วนฟ้องตัวเองแรงมาก —
              คนเห็นทันทีว่าช่อง “ยังไม่เก็บ” เยอะกว่าช่อง “เก็บครบแล้ว” · ได้ความน่าเชื่อถือ
              แต่แลกด้วยการยอมรับต่อหน้าคนแปลกหน้าว่าเรายังเก็บได้ไม่เยอะ
            </p>
          </div>

          <div className="border-l-2 border-accent pl-4">
            <h2 className="text-lg font-bold">B · ห้องข่าว — “เหตุการณ์เป็นพระเอก”</h2>
            <p className="mt-2 text-sm leading-7 text-muted">
              เปิดมาเจอ<strong className="text-foreground">แถบอัปเดตล่าสุด</strong>ตั้งแต่ก่อนพาดหัว แล้ว
              <strong className="text-foreground">ข่าวเด่น</strong> = สิ่งที่เราเพิ่งทำล่าสุด พร้อมตัวเลขประกอบ ·
              ไล่ลงมาเป็น<strong className="text-foreground">เส้นเวลารายวัน</strong> · สถานะฐานถูกลดเหลือแถบเดียวไว้ท้ายๆ
            </p>
            <p className="mt-3 text-sm leading-7 text-muted">
              <strong className="text-foreground">เหมาะกับ</strong> คนที่กลับมาซ้ำแล้วถามว่า “มีอะไรใหม่”
            </p>
            <p className="mt-3 rounded-lg bg-surface-muted/60 p-3 text-sm leading-6 text-muted">
              <strong className="text-foreground">ข้อแลก:</strong> พึ่งความถี่ในการอัปเดตมากกว่าทิศ A —
              ถ้าเดือนหนึ่งไม่มีใครแตะข้อมูล หน้าแรกจะดูเหมือนสำนักข่าวที่ไม่มีข่าว (กดปุ่ม “ถ้าเงียบไป 3 เดือน” ดูได้)
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface-muted/40 p-4">
            <p className="text-sm font-semibold">ที่ต้องรู้ก่อนเคาะ</p>
            <ul className="mt-2 space-y-2 text-[13px] leading-6 text-muted">
              <li>
                • <strong className="text-foreground">ทุกเหตุการณ์ในฟีดเป็นเรื่องจริงที่ตรวจย้อนได้</strong> —
                ไม่ได้แต่งขึ้นให้ดูสด · แต่ละแถวมีที่มาในrepo กำกับไว้ในโค้ด (เช่น การเพิ่ม Tesla/Benz มาจาก
                <code className="mx-1 rounded bg-surface px-1">phase7-seed-tesla-benz.ts</code> เมื่อ 22 ก.ค.)
              </li>
              <li>
                • <strong className="text-foreground">ตัวเลข “40 วันที่แล้ว” คือของจริง</strong> —
                ข้อมูลตรวจล่าสุด 22 ก.ค. เทียบกับวันนี้ 31 ส.ค. · ฉันไม่ปรับให้ดูสวยกว่าความจริง
              </li>
              <li>
                • หน้าลองตรึงวันที่ไว้ (ไม่ใช้เวลาจริงของเครื่อง) เพื่อให้เปิดกี่ครั้งก็ได้ภาพเดิม —
                ของจริงจะนับวันจากวันที่เปิดหน้า
              </li>
              <li>
                • ของที่เบสสั่งไว้รอบก่อนยังอยู่ครบ: พาดหัวพิมพ์วน (component ตัวจริงของเว็บ) · ช่องค้นหาใหญ่ ·
                โลโก้แบรนด์เป็นทางลัด · ไม่มีรูปรถ
              </li>
              <li>
                • ธีมสว่างอย่างเดียวตามที่เคาะไว้ M22 — รอบนี้จึงไม่มีปุ่มสลับโหมดมืด
              </li>
              <li>• ลิงก์ในหน้ายังไม่พาไปไหน (ทำหน้าแรกอย่างเดียว) · ยังไม่แตะโค้ดของจริง</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-danger/30 bg-danger/5 p-4">
            <p className="text-sm font-semibold text-danger">สัญญาที่แนบมากับทิศนี้</p>
            <p className="mt-2 text-[13px] leading-6 text-muted">
              หน้าแรกที่เอาความสดเป็นพระเอกจะน่าเชื่อ<strong className="text-foreground">ก็ต่อเมื่อมีของใหม่ไหลเข้ามาเรื่อยๆ</strong>{" "}
              ถ้าไม่ตรวจราคาต่อ อีก 3 เดือนหน้าแรกจะเขียนเองว่า “ค้างนาน 131 วัน” ซึ่งแย่กว่าไม่ทำหน้านี้
              เพราะมันฟ้องความเงียบแทนที่จะซ่อนไว้
            </p>
            <p className="mt-2 text-[13px] leading-6 text-muted">
              ฉันจะไม่ปลอมข้อมูลให้ดูสด (ผิดหลัก evidence-first ที่เป็นจุดยืนของผลิตภัณฑ์) —
              ดังนั้นถ้าเคาะทางนี้ ต้องมีรอบตรวจราคาประจำด้วย · กดปุ่ม
              <strong className="text-foreground"> “ถ้าเงียบไป 3 เดือน” </strong>
              เพื่อดูว่าหน้าตาตอนนั้นเป็นยังไง แล้วค่อยตัดสิน
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-border p-4">
          <p className="text-sm font-semibold">คำถามเดียวที่ต้องเคาะ</p>
          <p className="mt-2 text-[15px] leading-7">
            หน้าแรกควรเปิดด้วย <strong>“ฐานข้อมูลนี้มีอะไรและครบแค่ไหน” (A · ห้องแล็บ)</strong> หรือ{" "}
            <strong>“ล่าสุดเราเพิ่งทำอะไร” (B · ห้องข่าว)</strong> ?
          </p>
          <p className="mt-2 text-[13px] leading-6 text-faint">
            ถ้ายังไม่ชอบทั้งสองทาง — ขอให้ชี้เป็นจุดว่าตรงไหนและเพราะอะไร (ตามที่ตกลงกันไว้ตอนเคาะโจทย์)
            จะได้ไม่ต้องวนเดาใหม่ทั้งหน้า
          </p>
        </section>
      </div>
    </main>
  );
}
