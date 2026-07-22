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

// ── หน้ารุ่นย่อย (1 SKU ขายจริง) — สเปกเต็ม + ประวัติราคา + ADAS ของ trim นี้ ──
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
  const statusText = (has: boolean | null) => (has === true ? "มี" : has === false ? "ไม่มี" : "ยังไม่ยืนยัน");
  const statusClass = (has: boolean | null) =>
    has === true ? "text-success font-medium" : has === false ? "text-faint" : "text-faint italic";

  const bodyLabel = derivative.name || (BODY_TYPE_LABEL[derivative.bodyType] ?? derivative.bodyType);

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

      {/* hero */}
      <header className="pt-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            <span className="mr-2 font-normal text-muted">{tree.brand} {tree.name}</span>{v.name}
          </h1>
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

        <div className="mt-5">
          {v.price != null ? (
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-semibold tnum sm:text-4xl">{formatTHB(v.price)}</span>
              <span className="text-sm text-faint">ราคาป้ายทางการ{v.priceAsOf ? ` · ณ ${formatDateTH(v.priceAsOf)}` : ""}</span>
            </div>
          ) : (
            <span className="text-lg text-faint">ไม่มีข้อมูลราคา</span>
          )}
          {v.price != null && detail.priceMin != null && detail.priceMax != null && detail.priceMin !== detail.priceMax && (
            <div className="mt-3 max-w-md">
              <PricePositionBar min={detail.priceMin} max={detail.priceMax} value={v.price} />
              <p className="mt-1 text-[11px] text-faint">ตำแหน่งราคาในช่วงรุ่นย่อยทั้งหมดของ {tree.name}</p>
            </div>
          )}
        </div>

        <div className="mt-6 border-t border-border pt-5">
          <SkuSwitcher tree={tree} currentSkuKey={v.skuKey} />
        </div>
      </header>

      {/* สเปก */}
      <section aria-labelledby="spec-heading" className="mt-10">
        <h2 id="spec-heading" className="scroll-mt-20 text-lg font-semibold tracking-tight text-accent">สเปก</h2>
        <dl className="mt-3 max-w-2xl">
          <SpecRow label="ขุมพลัง">{v.powertrainText}</SpecRow>
          {v.engineText && <SpecRow label="เครื่องยนต์"><span className="text-[13px]">{v.engineText}</span></SpecRow>}
          {v.powerText && <SpecRow label="กำลัง"><span className="tnum">{v.powerText}</span></SpecRow>}
          <SpecRow label="เกียร์"><DataStatusValue value={v.transmissionText} /></SpecRow>
          <SpecRow label="ระบบขับเคลื่อน"><DataStatusValue value={v.drivetrain ? (DRIVETRAIN_LABEL[v.drivetrain] ?? v.drivetrain) : null} /></SpecRow>
          <SpecRow label="ที่นั่ง"><span className="tnum"><DataStatusValue value={v.seatCount} /></span></SpecRow>
          <SpecRow label="รหัสเกรด"><span className="tnum text-xs"><DataStatusValue value={v.gradeCode} /></span></SpecRow>
        </dl>
        {(v.motorKw != null || v.batteryKwh != null || v.rangeKm != null || v.acKw != null || v.dcKw != null) && (
          <div className="mt-5 grid max-w-2xl grid-cols-2 gap-2 sm:grid-cols-3">
            {v.motorKw != null && (
              <div className="rounded-xl border border-border bg-surface-muted px-3 py-2.5">
                <div className="text-[11px] text-faint">กำลังมอเตอร์</div>
                <div className="mt-0.5 text-sm font-semibold tnum">{v.motorKw} kW</div>
              </div>
            )}
            {v.batteryKwh != null && (
              <div className="rounded-xl border border-border bg-surface-muted px-3 py-2.5">
                <div className="text-[11px] text-faint">ความจุแบตเตอรี่</div>
                <div className="mt-0.5 text-sm font-semibold tnum">{v.batteryKwh} kWh</div>
              </div>
            )}
            {v.rangeKm != null && (
              <div className="rounded-xl border border-border bg-surface-muted px-3 py-2.5">
                <div className="text-[11px] text-faint">ระยะทางต่อชาร์จ</div>
                <div className="mt-0.5 text-sm font-semibold tnum">{v.rangeKm} กม.{v.rangeStandard ? ` (${v.rangeStandard})` : ""}</div>
              </div>
            )}
            {(v.acKw != null || v.dcKw != null) && (
              <div className="rounded-xl border border-border bg-surface-muted px-3 py-2.5">
                <div className="text-[11px] text-faint">การชาร์จ</div>
                <div className="mt-0.5 text-sm font-semibold tnum">
                  {[v.acKw != null ? `AC ${v.acKw} kW` : null, v.dcKw != null ? `DC ${v.dcKw} kW` : null].filter(Boolean).join(" · ")}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ประวัติราคา (append-only — โชว์ทุก observation ไม่ทับอดีต) */}
      <section aria-labelledby="price-history-heading" className="mt-10">
        <h2 id="price-history-heading" className="scroll-mt-20 text-lg font-semibold tracking-tight text-accent">ประวัติราคา</h2>
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

      {/* ADAS ของ trim นี้ */}
      <section aria-labelledby="adas-heading" className="mt-10">
        <h2 id="adas-heading" className="scroll-mt-20 text-lg font-semibold tracking-tight text-accent">ระบบช่วยขับขี่</h2>
        {adasRow ? (
          <>
            <ul className="mt-3 max-w-3xl space-y-2">
              {adasFeatures.map((f) => {
                const val = adasRow.values.find((x) => x.key === f.key);
                const has = val?.has ?? null;
                return (
                  <li key={f.key} className="flex items-baseline gap-3 text-[15px]">
                    <span className={statusClass(has)}>{statusText(has)}</span>
                    <span title={f.definition ?? undefined}>
                      {f.nameTh} <span className="text-faint">({f.key})</span>
                      {val?.marketing && <span className="ml-1 text-[13px] text-faint">— {val.marketing}</span>}
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 text-[13px] text-faint">ตามตารางสเปกทางการของรุ่นย่อยนี้ — ค่าที่สเปกไม่ระบุ = &ldquo;ยังไม่ยืนยัน&rdquo; (ไม่ใช่ &ldquo;ไม่มี&rdquo;)</p>
          </>
        ) : (
          <div className="mt-3 max-w-xl"><PendingBlock title="ยังไม่มีข้อมูลระบบช่วยขับขี่ที่ยืนยัน" reason="สเปกทางการยังไม่ระบุ AEB/ACC/LKA ของรุ่นย่อยนี้" /></div>
        )}
      </section>

      {/* แหล่งอ้างอิง (ระดับรุ่น — หลักฐานเฉพาะราคา SKU นี้อยู่ในตารางประวัติราคา) */}
      <section aria-labelledby="sku-sources-heading" className="mt-12 border-t border-border pt-8">
        <h2 id="sku-sources-heading" className="scroll-mt-20 text-lg font-semibold tracking-tight text-accent">แหล่งอ้างอิง</h2>
        <p className="mt-1.5 text-sm text-faint">{detail.sources.length} แหล่ง — หลักฐานราคาและข้อมูลของ {tree.brand} {tree.name}</p>
        <ul className="mt-3 max-w-3xl divide-y divide-border">
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
