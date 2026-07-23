import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNameplateDetail, getNameplateTree, selectVariant } from "@/lib/queries";
import { BODY_TYPE_LABEL, DRIVETRAIN_LABEL } from "@/lib/labels";
import { formatDateTH, formatTHB } from "@/lib/format";
import {
  ConfidenceBadge,
  DataStatusValue,
  EvidenceLink,
  LifecycleBadge,
  PendingBlock,
  PricePositionBar,
  SpecRow,
  ptDotClass,
} from "@/components/badges";
import { SectionHeader, StatBar, TagCard } from "@/components/panel";
import { SkuSwitcher } from "@/components/sku-switcher";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string; sku: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, sku } = await params;
  const tree = await getNameplateTree(slug);
  const found = tree ? selectVariant(tree, sku) : null;
  if (!tree || !found) notFound();
  return {
    title: `${tree.brand} ${tree.name} ${found.variant.name} — ราคาและสเปก`,
    description: `ราคาป้ายทางการ สเปก และประวัติราคาของ ${tree.brand} ${tree.name} รุ่นย่อย ${found.variant.name} พร้อมแหล่งอ้างอิงที่ตรวจสอบได้`,
  };
}

// ── หน้ารุ่นย่อย (1 SKU) — ภาษา "คู่มือ" เดียวกับหน้ารุ่น: banner + SectionHeader + StatBar/TagCard ──
export default async function SkuPage({ params }: Props) {
  const { slug, sku } = await params;
  const [detail, tree] = await Promise.all([getNameplateDetail(slug), getNameplateTree(slug)]);
  if (!detail || !tree) notFound();
  const found = selectVariant(tree, sku);
  if (!found) notFound();
  const { variant: v, trim, derivative } = found;

  // แถว ADAS ของ trim นี้ — label ใน detail.adas อาจต่อชื่อตัวถังเมื่อชื่อ trim ซ้ำข้ามแค็บ
  const adasRow =
    detail.adas?.trims.find(
      (t) => t.label === trim.name || t.label === `${trim.name} — ${derivative.name ?? ""}`,
    ) ?? null;
  const adasFeatures = detail.adas?.features ?? [];

  const bodyLabel = derivative.name || (BODY_TYPE_LABEL[derivative.bodyType] ?? derivative.bodyType);
  const evSpecs: [string, string][] = [];
  if (v.motorKw != null) evSpecs.push(["กำลังมอเตอร์", `${v.motorKw} kW`]);
  if (v.batteryKwh != null) evSpecs.push(["ความจุแบตเตอรี่", `${v.batteryKwh} kWh`]);
  if (v.rangeKm != null) evSpecs.push(["ระยะทางต่อชาร์จ", `${v.rangeKm} กม.${v.rangeStandard ? ` (${v.rangeStandard})` : ""}`]);
  const charge = [v.acKw != null ? `AC ${v.acKw} kW` : null, v.dcKw != null ? `DC ${v.dcKw} kW` : null].filter(Boolean).join(" · ");
  if (charge) evSpecs.push(["การชาร์จ", charge]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
      <nav aria-label="breadcrumb" className="pt-6 text-sm text-faint">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-foreground">ฐานข้อมูลรถ</Link></li>
          <li aria-hidden>›</li>
          <li><Link href={`/brands/${tree.brandSlug}`} className="text-muted hover:text-foreground">{tree.brand}</Link></li>
          <li aria-hidden>›</li>
          <li><Link href={`/cars/${tree.slug}`} className="text-muted hover:text-foreground">{tree.name}</Link></li>
          <li aria-hidden>›</li>
          <li aria-current="page" className="font-medium text-foreground">{v.name}</li>
        </ol>
      </nav>

      {/* hero banner — ภาษาเดียวกับหน้ารุ่น */}
      <header className="relative mt-5 overflow-hidden rounded-2xl border border-border bg-background">
        <div
          aria-hidden
          className="absolute inset-y-0 right-0 hidden w-[38%] bg-accent-soft sm:block"
          style={{ clipPath: "polygon(24% 0, 100% 0, 100% 100%, 0 100%)" }}
        />
        <div className="relative p-6 sm:p-8">
          <p className="text-[13px] font-semibold tracking-[0.2em] text-accent uppercase">{tree.brand} {tree.name}</p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{v.name}</h1>
            <LifecycleBadge status={detail.lifecycleStatus} />
          </div>
          <p className="mt-2 flex flex-wrap items-center gap-x-2 text-sm text-muted">
            <span>{bodyLabel}</span>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden className={`inline-block size-2 rounded-full ${ptDotClass(v.powertrainText)}`} />
              {v.powertrainText}
            </span>
          </p>

          <div className="mt-5 flex flex-wrap items-end gap-x-8 gap-y-4">
            <div className="w-full max-w-[13rem]">
              <StatBar
                label="ราคาป้ายทางการ"
                value={v.price != null ? formatTHB(v.price) : "ไม่มีข้อมูล"}
                sub={v.priceAsOf ? `ณ ${formatDateTH(v.priceAsOf)}` : undefined}
              />
            </div>
            {v.price != null && detail.priceMin != null && detail.priceMax != null && detail.priceMin !== detail.priceMax && (
              <div className="w-full max-w-xs pb-1">
                <PricePositionBar min={detail.priceMin} max={detail.priceMax} value={v.price} />
                <p className="mt-1 text-[11px] text-faint">ตำแหน่งราคาในรุ่นย่อยทั้งหมดของ {tree.name}</p>
              </div>
            )}
          </div>

          <div className="mt-6 border-t border-border pt-4">
            <SkuSwitcher tree={tree} currentSkuKey={v.skuKey} />
          </div>
        </div>
      </header>

      {/* สเปก | ADAS — 2 คอลัมน์บนจอกว้าง */}
      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <section aria-label="สเปก">
          <SectionHeader id="spec-heading" title="สเปก" />
          <dl className="mt-3">
            <SpecRow label="ขุมพลัง">{v.powertrainText}</SpecRow>
            {v.engineText && <SpecRow label="เครื่องยนต์"><span className="text-[13px]">{v.engineText}</span></SpecRow>}
            {v.powerText && <SpecRow label="กำลัง"><span className="tnum">{v.powerText}</span></SpecRow>}
            <SpecRow label="เกียร์"><DataStatusValue value={v.transmissionText} /></SpecRow>
            <SpecRow label="ระบบขับเคลื่อน"><DataStatusValue value={v.drivetrain ? (DRIVETRAIN_LABEL[v.drivetrain] ?? v.drivetrain) : null} /></SpecRow>
            <SpecRow label="ที่นั่ง"><span className="tnum"><DataStatusValue value={v.seatCount} /></span></SpecRow>
            <SpecRow label="รหัสเกรด"><span className="tnum text-xs"><DataStatusValue value={v.gradeCode} /></span></SpecRow>
          </dl>
          {evSpecs.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              {evSpecs.map(([k, val]) => (
                <StatBar key={k} label={k} value={<span className="text-sm">{val}</span>} />
              ))}
            </div>
          )}
        </section>

        <section aria-label="ระบบช่วยขับขี่">
          <SectionHeader id="adas-heading" title="ระบบช่วยขับขี่" />
          {adasRow ? (
            <div className="mt-3 space-y-2.5">
              {adasFeatures.map((f) => {
                const val = adasRow.values.find((x) => x.key === f.key);
                const has = val?.has ?? null;
                return (
                  <TagCard
                    key={f.key}
                    tag={has === true ? "มี" : has === false ? "ไม่มี" : "ยังไม่ยืนยัน"}
                    tone={has === true ? "success" : has === false ? "muted" : "faint"}
                    title={<span title={f.definition ?? undefined}>{f.nameTh} <span className="font-normal text-faint">({f.key})</span></span>}
                  >
                    {val?.marketing ?? undefined}
                  </TagCard>
                );
              })}
              <p className="pt-1 text-[13px] text-faint">ตามตารางสเปกทางการ — สเปกไม่ระบุ = &ldquo;ยังไม่ยืนยัน&rdquo; (ไม่ใช่ &ldquo;ไม่มี&rdquo;)</p>
            </div>
          ) : (
            <div className="mt-3"><PendingBlock title="ยังไม่มีข้อมูลระบบช่วยขับขี่ที่ยืนยัน" reason="สเปกทางการยังไม่ระบุ AEB/ACC/LKA ของรุ่นย่อยนี้" /></div>
          )}
        </section>
      </div>

      {/* ประวัติราคา */}
      <section aria-label="ประวัติราคา" className="mt-12">
        <SectionHeader id="price-history-heading" title="ประวัติราคา" sub="append-only — บันทึกทุกครั้งที่พบ ไม่เขียนทับอดีต" />
        {v.priceHistory.length > 0 ? (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full max-w-2xl min-w-[480px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[13px] text-faint">
                  <th className="py-2 pr-3 font-medium">มีผล / บันทึก</th>
                  <th className="px-3 py-2 text-right font-medium">ราคาป้าย</th>
                  <th className="px-3 py-2 font-medium">แหล่งอ้างอิง</th>
                  <th className="px-3 py-2 font-medium">ความเชื่อมั่น</th>
                </tr>
              </thead>
              <tbody>
                {v.priceHistory.map((h, i) => (
                  <tr key={`${h.observedDate}-${i}`} className="border-b border-border last:border-b-0">
                    <td className="py-2.5 pr-3 tnum">{formatDateTH(h.effectiveFrom ?? h.observedDate)}</td>
                    <td className="px-3 py-2.5 text-right">
                      {h.amount != null ? <span className="font-semibold tnum">{formatTHB(h.amount)}</span> : <span className="text-faint">ไม่มีข้อมูล</span>}
                    </td>
                    <td className="px-3 py-2.5"><EvidenceLink evidence={h.evidence} /></td>
                    <td className="px-3 py-2.5"><ConfidenceBadge level={h.evidence.confidence} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-3 max-w-xl"><PendingBlock title="ยังไม่มีบันทึกราคา" reason="จะเพิ่มเมื่อพบราคาป้ายทางการพร้อมหลักฐาน" /></div>
        )}
        <p className="mt-2 text-[13px] text-faint">ราคาป้ายทางการ ไม่ใช่ราคาซื้อขายจริง</p>
      </section>

      {/* แหล่งอ้างอิง */}
      <section aria-label="แหล่งอ้างอิง" className="mt-12">
        <SectionHeader id="sku-sources-heading" title="แหล่งอ้างอิง" sub={<><span className="tnum">{detail.sources.length}</span> แหล่ง — ของ {tree.brand} {tree.name}</>} />
        <ul className="mt-2 max-w-3xl divide-y divide-border">
          {detail.sources.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center gap-2 py-3 text-sm">
              <span className="font-medium">{s.publisher ?? "ไม่ระบุผู้เผยแพร่"}</span>
              {s.title && <span className="text-muted">{s.url ? <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent hover:underline">{s.title} ↗</a> : s.title}</span>}
              {s.checkedDate && <span className="ml-auto text-xs text-faint tnum">ตรวจ {formatDateTH(s.checkedDate)}</span>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
