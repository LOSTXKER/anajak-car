import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNameplateTree, selectGeneration, selectDerivative, selectTrim } from "@/lib/queries";
import { BODY_TYPE_LABEL, DRIVETRAIN_LABEL, RIDE_HEIGHT_LABEL } from "@/lib/labels";
import { formatDateTH, formatTHB } from "@/lib/format";
import { DataStatusValue, EvidenceLink, PendingBlock, SpecRow } from "@/components/badges";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string; gen: string; deriv: string; trim: string }> };

async function resolve(slug: string, gen: string, deriv: string, trim: string) {
  const tree = await getNameplateTree(slug);
  if (!tree) return null;
  const g = selectGeneration(tree, gen);
  if (!g) return null;
  const d = selectDerivative(g, deriv);
  if (!d) return null;
  const t = selectTrim(d, trim);
  if (!t) return null;
  return { tree, g, d, t };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, gen, deriv, trim } = await params;
  const r = await resolve(slug, gen, deriv, trim);
  if (!r) notFound();
  return { title: `${r.tree.brand} ${r.tree.name} ${r.t.name} — สเปกและราคา` };
}

export default async function TrimPage({ params }: Props) {
  const { slug, gen, deriv, trim } = await params;
  const r = await resolve(slug, gen, deriv, trim);
  if (!r) notFound();
  const { tree, g, d, t } = r;
  const derivLabel = d.name || (BODY_TYPE_LABEL[d.bodyType] ?? d.bodyType);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-20 sm:px-6">
      <nav aria-label="breadcrumb" className="pt-8 text-sm text-faint">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-foreground">ฐานข้อมูลรถ</Link></li>
          <li aria-hidden>›</li>
          <li><Link href={`/brands/${tree.brandSlug}`} className="text-muted hover:text-foreground">{tree.brand}</Link></li>
          <li aria-hidden>›</li>
          <li><Link href={`/cars/${slug}`} className="text-muted hover:text-foreground">{tree.name}</Link></li>
          <li aria-hidden>›</li>
          <li><Link href={`/cars/${slug}/gen/${g.key}/${d.key}`} className="text-muted hover:text-foreground">{derivLabel}</Link></li>
          <li aria-hidden>›</li>
          <li aria-current="page" className="font-medium text-foreground">{t.name}</li>
        </ol>
      </nav>

      <header className="pt-6 pb-2">
        <h1 className="text-3xl font-semibold tracking-tight">{tree.name} {t.name}</h1>
        <p className="mt-2 text-sm text-muted">
          {[derivLabel, t.standardName && t.standardName !== t.name ? `เกรด ${t.standardName}` : null, t.rideHeightClass ? RIDE_HEIGHT_LABEL[t.rideHeightClass] : null].filter(Boolean).join(" · ")}
        </p>
        {t.marketingLine && <p className="mt-1 text-[13px] text-faint" title={t.marketingLine}>{t.marketingLine}</p>}
      </header>

      {/* variant(s) full spec */}
      <div className="mt-6 space-y-8">
        {t.variants.map((v) => {
          const rangeText = v.rangeKm != null ? `${v.rangeKm} กม.${v.rangeStandard ? ` (${v.rangeStandard})` : ""}` : null;
          const charge = [v.acKw != null ? `AC ${v.acKw} kW` : null, v.dcKw != null ? `DC ${v.dcKw} kW` : null].filter(Boolean).join(" · ");
          const isBev = v.powertrainType === "BEV" || v.motorKw != null;
          return (
            <section key={v.id} className="rounded-2xl border border-border p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="text-lg font-semibold">{v.name}</h2>
                <span className="text-xl font-semibold tnum">{v.price != null ? formatTHB(v.price) : <span className="text-sm text-faint">ไม่มีข้อมูลราคา</span>}</span>
              </div>

              <dl className="mt-4">
                <SpecRow label="ขุมพลัง">{v.powertrainText}</SpecRow>
                {v.engineText && <SpecRow label="เครื่องยนต์"><span title={v.engineText}>{v.engineText}</span></SpecRow>}
                {isBev && <SpecRow label="กำลังมอเตอร์"><span className="tnum"><DataStatusValue value={v.motorKw != null ? `${v.motorKw} kW` : null} /></span></SpecRow>}
                {isBev && <SpecRow label="แบตเตอรี่"><span className="tnum"><DataStatusValue value={v.batteryKwh != null ? `${v.batteryKwh} kWh` : null} /></span></SpecRow>}
                {isBev && <SpecRow label="ระยะทางต่อชาร์จ"><span className="tnum"><DataStatusValue value={rangeText} /></span></SpecRow>}
                {isBev && <SpecRow label="การชาร์จ"><span className="tnum"><DataStatusValue value={charge || null} /></span></SpecRow>}
                {!isBev && v.powerText && <SpecRow label="กำลัง"><span className="tnum">{v.powerText}</span></SpecRow>}
                <SpecRow label="เกียร์"><DataStatusValue value={v.transmissionText} /></SpecRow>
                <SpecRow label="ระบบขับเคลื่อน"><DataStatusValue value={v.drivetrain ? (DRIVETRAIN_LABEL[v.drivetrain] ?? v.drivetrain) : null} /></SpecRow>
                <SpecRow label="ที่นั่ง"><span className="tnum"><DataStatusValue value={v.seatCount} /></span></SpecRow>
                <SpecRow label="รหัสเกรด (ทางการ)"><span className="tnum text-xs"><DataStatusValue value={v.gradeCode} /></span></SpecRow>
                <SpecRow label="ปีรุ่น (Model year)"><span className="tnum"><DataStatusValue value={null} /></span></SpecRow>
              </dl>

              {v.evidence && (
                <div className="mt-3 flex items-center gap-2 text-xs text-faint">
                  <span>ที่มาราคา:</span> <EvidenceLink evidence={v.evidence} />
                  {v.priceAsOf && <span className="tnum">· ณ {formatDateTH(v.priceAsOf)}</span>}
                </div>
              )}
            </section>
          );
        })}
      </div>

      <section className="mt-8">
        <div className="max-w-xl"><PendingBlock title="ยังไม่มีประวัติการแก้ไข (Revision history)" reason="รุ่นย่อยนี้ยังมีสเปกชุดเดียว · เมื่อมีการปรับสเปก/ราคา จะบันทึกเป็นเวอร์ชันใหม่แบบไม่ทับของเก่า" /></div>
      </section>
    </div>
  );
}
