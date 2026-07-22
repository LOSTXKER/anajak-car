import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNameplateTree, selectGeneration, selectDerivative } from "@/lib/queries";
import { BODY_TYPE_LABEL, CAB_TYPE_LABEL, DRIVETRAIN_LABEL } from "@/lib/labels";
import { formatPriceRange, formatTHB } from "@/lib/format";
import { DataStatusValue, PendingBlock, ptDotClass, StatTile } from "@/components/badges";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string; gen: string; deriv: string }> };

async function resolve(slug: string, gen: string, deriv: string) {
  const tree = await getNameplateTree(slug);
  if (!tree) return null;
  const g = selectGeneration(tree, gen);
  if (!g) return null;
  const d = selectDerivative(g, deriv);
  if (!d) return null;
  return { tree, g, d };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, gen, deriv } = await params;
  const r = await resolve(slug, gen, deriv);
  if (!r) notFound();
  const label = r.d.name || (BODY_TYPE_LABEL[r.d.bodyType] ?? r.d.bodyType);
  return { title: `${r.tree.brand} ${r.tree.name} ${label} — สเปกและราคา` };
}

export default async function DerivativePage({ params }: Props) {
  const { slug, gen, deriv } = await params;
  const r = await resolve(slug, gen, deriv);
  if (!r) notFound();
  const { tree, g, d } = r;
  const label = d.name || (BODY_TYPE_LABEL[d.bodyType] ?? d.bodyType);
  const singleDeriv = g.derivatives.length === 1;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-20 sm:px-6">
      <nav aria-label="breadcrumb" className="pt-8 text-sm text-faint">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-foreground">ฐานข้อมูลรถ</Link></li>
          <li aria-hidden>›</li>
          <li><Link href={`/brands/${tree.brandSlug}`} className="text-muted hover:text-foreground">{tree.brand}</Link></li>
          <li aria-hidden>›</li>
          <li><Link href={`/cars/${slug}`} className="text-muted hover:text-foreground">{tree.name}</Link></li>
          <li aria-hidden>›</li>
          <li><Link href={`/cars/${slug}/gen/${g.key}`} className="text-muted hover:text-foreground">เจน {g.launchYear ?? g.key}</Link></li>
          <li aria-hidden>›</li>
          <li aria-current="page" className="font-medium text-foreground">{label}</li>
        </ol>
      </nav>

      <header className="pt-6 pb-6">
        <h1 className="text-3xl font-semibold tracking-tight">{tree.name} <span className="font-normal text-muted">{label}</span></h1>
        <p className="mt-2 text-sm text-muted">{[BODY_TYPE_LABEL[d.bodyType] ?? d.bodyType, d.cabType ? CAB_TYPE_LABEL[d.cabType] : null, d.phaseName].filter(Boolean).join(" · ")}</p>
        {singleDeriv && <p className="mt-2 text-[13px] text-faint">รุ่นนี้มีตัวถังเดียว</p>}

        <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <StatTile label="เกรด" value={<span className="tnum">{d.trims.length}</span>} />
          <StatTile label="รุ่นย่อย" value={<span className="tnum">{d.variantCount}</span>} />
          <StatTile label="ช่วงราคาป้าย" value={<span className="tnum text-sm">{formatPriceRange(d.priceMin, d.priceMax) ?? "—"}</span>} />
          <StatTile label="จำนวนประตู" value={<span className="tnum"><DataStatusValue value={d.doors} /></span>} sub={d.wheelbaseMm ? `ฐานล้อ ${d.wheelbaseMm} มม.` : undefined} />
        </div>
      </header>

      {/* trims + variants (scoped price ladder) */}
      <section className="border-t border-border pt-8">
        <h2 className="text-xl font-semibold tracking-tight">เกรดและราคา</h2>
        <div className="mt-4 space-y-6">
          {d.trims.map((t) => (
            <div key={t.key}>
              <div className="flex items-baseline justify-between gap-3">
                <Link href={`/cars/${slug}/gen/${g.key}/${d.key}/${t.key}`} className="font-semibold hover:text-accent">{t.name} →</Link>
                <span className="text-sm text-faint tnum">{formatPriceRange(t.priceMin, t.priceMax)}</span>
              </div>
              <ol className="mt-1 divide-y divide-border">
                {t.variants.map((v) => (
                  <li key={v.id} className="flex items-baseline justify-between gap-6 py-3">
                    <div className="min-w-0">
                      <Link href={`/cars/${slug}/gen/${g.key}/${d.key}/${t.key}`} className="text-[15px] font-medium hover:text-accent">{v.name}</Link>
                      <div className="mt-1 flex items-center gap-1.5 text-[13px] text-faint">
                        <span aria-hidden className={`inline-block size-2 rounded-full ${ptDotClass(v.powertrainText)}`} />
                        {[v.powertrainText, v.powerText, v.transmissionText, v.drivetrain ? (DRIVETRAIN_LABEL[v.drivetrain] ?? v.drivetrain) : null].filter(Boolean).join(" · ")}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      {v.price != null ? <span className="text-lg font-semibold tnum">{formatTHB(v.price)}</span> : <span className="text-sm text-faint">ไม่มีข้อมูล</span>}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border pt-8 mt-10">
        <h2 className="text-xl font-semibold tracking-tight">เฟส (Facelift)</h2>
        <div className="mt-4 max-w-xl">
          {d.changeSummary ? (
            <p className="text-[15px] leading-7 text-muted">{d.changeSummary}</p>
          ) : (
            <PendingBlock title="เฟสเดียว (เปิดตัว)" reason="ยังไม่มีไมเนอร์เชนจ์/เฟซลิฟต์ที่บันทึกพร้อมหลักฐาน" />
          )}
        </div>
      </section>
    </div>
  );
}
