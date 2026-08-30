import Link from "next/link";
import { PROTOS, type ProtoStatus } from "./_registry";

const ORDER: ProtoStatus[] = ["รอเคาะ", "เคาะแล้ว", "เก็บอ้างอิง", "พับ"];
const TONE: Record<ProtoStatus, string> = {
  รอเคาะ: "bg-accent-soft text-accent",
  เคาะแล้ว: "bg-success-soft text-success",
  เก็บอ้างอิง: "bg-surface-muted text-muted",
  พับ: "bg-surface-muted text-faint line-through",
};

export default function ProtoIndexPage() {
  const groups = ORDER.map((s) => [s, PROTOS.filter((p) => p.status === s)] as const).filter(
    ([, list]) => list.length > 0,
  );

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground sm:px-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight">หน้าลองทั้งหมด</h1>
        <p className="mt-2 text-[15px] leading-7 text-muted">
          หน้าเทียบทางเลือกก่อนแก้ของจริง — ตัวเลขและราคาในนี้เป็นชุดข้อมูลตายตัวที่คัดมาจากฐานข้อมูลจริง
          แต่ไม่ได้อัปเดตตามระบบ · หน้าลองไม่ขึ้น Google
        </p>

        {groups.map(([status, list]) => (
          <section key={status} className="mt-8">
            <p className="mb-3 text-xs font-medium tracking-[0.18em] text-faint uppercase">
              {status}
            </p>
            <ul className="space-y-2">
              {list.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/proto/${p.slug}`}
                    className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-4 transition-colors hover:bg-surface-muted"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">{p.title}</span>
                      <span className="mt-0.5 block text-sm text-muted">{p.question}</span>
                      {p.verdict && (
                        <span className="mt-1 block text-[13px] text-faint">→ {p.verdict}</span>
                      )}
                    </span>
                    <span className="shrink-0 text-right">
                      <span className={`rounded-full px-2 py-0.5 text-[11px] ${TONE[p.status]}`}>
                        {p.status}
                      </span>
                      <span className="mt-1 block text-[11px] text-faint tnum">{p.date}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
