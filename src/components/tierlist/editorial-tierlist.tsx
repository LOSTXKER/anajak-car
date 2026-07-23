import Link from "next/link";
import Image from "next/image";
import type { EditorialTierList } from "@/lib/editorial-tiers";
import { formatDateTH } from "@/lib/format";
import { nameplateImage } from "@/lib/images";

// ── Tier list "ความเห็นบรรณาธิการ" — ป้ายชัดว่าเป็นความเห็น แยกจาก Fact ──
const TIER_COLOR: Record<string, string> = {
  S: "bg-accent text-white",
  A: "bg-success text-white",
  B: "bg-warning text-white",
  C: "bg-surface-muted text-faint",
};

export function EditorialTierlist({ list }: { list: EditorialTierList }) {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-20 sm:px-6 pt-8">
      <nav aria-label="breadcrumb" className="text-sm text-faint">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-foreground">ฐานข้อมูลรถ</Link></li>
          <li aria-hidden>›</li>
          <li><Link href="/tierlist" className="text-muted hover:text-foreground">จัดอันดับ</Link></li>
          <li aria-hidden>›</li>
          <li aria-current="page" className="font-medium text-foreground">{list.title}</li>
        </ol>
      </nav>

      {/* editorial banner — persistent */}
      <div className="mt-5 rounded-2xl border border-warning/40 bg-warning-soft px-4 py-3">
        <p className="text-sm font-semibold text-warning">ความเห็นบรรณาธิการ (Editorial opinion)</p>
        <p className="mt-0.5 text-[13px] text-muted">ไม่ใช่ข้อเท็จจริงที่วัดได้ — แยกจากข้อมูลราคา/สเปกที่ยืนยันในหน้ารุ่น</p>
      </div>

      <h1 className="mt-5 text-3xl font-semibold tracking-tight">{list.title}</h1>
      <p className="mt-2 text-sm text-muted">
        จัดโดย <span className="font-medium text-foreground">{list.author}</span> · {list.authorRole}
        {list.updated && <span className="tnum"> · อัปเดต {formatDateTH(list.updated)}</span>}
      </p>

      <div className="mt-4 space-y-1.5 rounded-2xl border border-border bg-surface-muted/50 p-4 text-[13px] leading-6">
        <p><span className="font-semibold text-foreground">กลุ่ม:</span> {list.cohortLabel}</p>
        <p><span className="font-semibold text-foreground">เกณฑ์การจัด:</span> {list.criterion}</p>
      </div>

      <div className="mt-6 space-y-3">
        {list.tiers.map((tier) => (
          <div key={tier.label} className="flex flex-col gap-3 rounded-2xl border border-border p-3 sm:flex-row">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl font-bold sm:h-auto sm:w-16 ${TIER_COLOR[tier.label] ?? "bg-surface-muted text-faint"}`}>
              {tier.label}
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <p className="text-xs text-faint">{tier.note}</p>
              {tier.entries.map((e) => {
                const img = nameplateImage(e.slug);
                return (
                  <div key={e.slug} className="flex gap-3 rounded-xl bg-surface-muted/40 p-3">
                    <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg bg-background">
                      {img ? <Image src={img.src} alt={img.alt} width={72} height={40} className="h-auto w-auto max-h-[48px] object-contain" /> : <span className="text-faint">—</span>}
                    </div>
                    <div className="min-w-0">
                      <Link href={`/cars/${e.slug}`} className="font-semibold hover:text-accent">{e.name}</Link>
                      <p className="mt-0.5 text-[13px] leading-5 text-muted">{e.reason}</p>
                      <p className="mt-1 text-[11px] text-faint">
                        อ้างอิง: {e.evidence.url ? (
                          <a href={e.evidence.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">{e.evidence.label} ↗</a>
                        ) : e.evidence.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-xs text-faint">
        ความเห็น ไม่ใช่ข้อเท็จจริงที่วัดได้ · {list.author}เป็นคนกำหนด tier + เหตุผล + แนบหลักฐานต่ออันดับ · อันดับนี้ไม่ได้ถูกซื้อด้วยค่าโฆษณาหรือสปอนเซอร์
      </p>
    </div>
  );
}
