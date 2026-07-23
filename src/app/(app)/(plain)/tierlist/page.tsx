import type { Metadata } from "next";
import Link from "next/link";
import { getEditorialTierIndex } from "@/lib/editorial-tiers";
import { formatDateTH } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "จัดอันดับรถ — ความเห็นบรรณาธิการ",
  description: "รายการจัดอันดับรถของ CARMETA — จัดในกลุ่มเดียวกันตามเกณฑ์ที่ประกาศชัด พร้อมเหตุผลและหลักฐาน",
};

export default function TierlistIndex() {
  const editorial = getEditorialTierIndex();
  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-20 sm:px-6 pt-8">
      <nav aria-label="breadcrumb" className="text-sm text-faint">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-foreground">ฐานข้อมูลรถ</Link></li>
          <li aria-hidden>›</li>
          <li aria-current="page" className="font-medium text-foreground">จัดอันดับ</li>
        </ol>
      </nav>

      <h1 className="pt-6 text-3xl font-semibold tracking-tight">จัดอันดับรถ</h1>
      <p className="mt-2 max-w-2xl text-[15px] leading-7 text-muted">
        CARMETA ไม่ฟันธง &ldquo;รถคันไหนดีที่สุด&rdquo; ด้วยคะแนนเดียว — การจัดอันดับที่นี่จะ <strong className="font-medium text-foreground">ระบุกลุ่มและเกณฑ์ชัดเจน</strong> เสมอ
      </p>

      <section className="mt-8">
        <h2 className="text-sm font-semibold tracking-wider text-faint uppercase">ความเห็นบรรณาธิการ (Editorial)</h2>
        <div className="mt-3 space-y-3">
          {editorial.map((l) => (
            <Link key={l.slug} href={`/tierlist/${l.slug}`} className="block rounded-2xl border border-border p-5 transition-all hover:border-accent hover:shadow-sm">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-warning-soft px-2 py-0.5 text-[11px] font-medium text-warning">ความเห็น</span>
                <span aria-hidden className="ml-auto text-accent">ดู →</span>
              </div>
              <h3 className="mt-2 text-lg font-semibold tracking-tight">{l.title}</h3>
              <p className="mt-1 text-sm text-muted">{l.cohortLabel}</p>
              <p className="mt-2 text-xs text-faint">จัดโดย {l.author} · {l.authorRole}{l.updated && <span className="tnum"> · {formatDateTH(l.updated)}</span>}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold tracking-wider text-faint uppercase">จัดตามเกณฑ์ข้อมูล (CARMETA Calculation)</h2>
        <div className="mt-3 rounded-2xl border border-dashed border-border bg-surface-muted/40 px-5 py-4 text-sm text-muted">
          การจัดอันดับตามเกณฑ์วัดได้ (เช่น ความครบ ADAS หรือราคาในเซกเมนต์) กำลังจะเพิ่ม — ทุกอันดับจะมีหลักฐานกำกับ
        </div>
      </section>
    </div>
  );
}
