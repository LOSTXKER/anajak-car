import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNameplateDetail, getNameplateTree, type TreeVariant } from "@/lib/queries";
import { BODY_TYPE_LABEL, CHANGE_TYPE_LABEL, DRIVETRAIN_LABEL, SEGMENT_LABEL } from "@/lib/labels";
import { SourcesSection } from "@/components/sources-section";
import { nameplateImage } from "@/lib/images";
import { formatDateTH, formatTHB } from "@/lib/format";
import {
  Chip,
  DataStatusValue,
  LifecycleBadge,
  PendingBlock,
  PowertrainDots,
  PricePositionBar,
  StatTile,
  ptDotClass,
} from "@/components/badges";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getNameplateDetail(slug);
  if (!detail) notFound();
  return {
    title: `${detail.brand} ${detail.name} — ราคาและสเปก`,
    description: `ราคาป้ายทางการ สเปก และรุ่นย่อยทั้งหมดของ ${detail.brand} ${detail.name} พร้อมแหล่งอ้างอิงที่ตรวจสอบได้`,
  };
}

// รวมสเปก BEV จากรุ่นย่อย (known เท่านั้น) — คืน null ถ้าไม่ใช่รถไฟฟ้า
function bevSpecRows(variants: TreeVariant[]): [string, string][] | null {
  const bev = variants.filter((v) => v.powertrainType === "BEV" || v.motorKw != null);
  if (bev.length === 0) return null;
  const uniq = (xs: (string | null)[]) => [...new Set(xs.filter((x): x is string => !!x))];
  const motors = uniq(bev.map((v) => (v.motorKw != null ? `${v.motorKw} kW` : null)));
  const batteries = uniq(bev.map((v) => (v.batteryKwh != null ? `${v.batteryKwh} kWh` : null)));
  const ranges = uniq(bev.map((v) => (v.rangeKm != null ? `${v.rangeKm} กม.${v.rangeStandard ? ` (${v.rangeStandard})` : ""}` : null)));
  const ac = uniq(bev.map((v) => (v.acKw != null ? `AC ${v.acKw} kW` : null)));
  const dc = uniq(bev.map((v) => (v.dcKw != null ? `DC ${v.dcKw} kW` : null)));
  const charge = [...ac, ...dc].join(" · ");
  const rows: [string, string][] = [];
  if (motors.length) rows.push(["กำลังมอเตอร์", motors.join(" · ")]);
  if (batteries.length) rows.push(["ความจุแบตเตอรี่", batteries.join(" · ")]);
  if (ranges.length) rows.push(["ระยะทางต่อชาร์จ", ranges.join(" · ")]);
  if (charge) rows.push(["การชาร์จ", charge]);
  return rows.length ? rows : null;
}

export default async function NameplatePage({ params }: Props) {
  const { slug } = await params;
  const [detail, tree] = await Promise.all([getNameplateDetail(slug), getNameplateTree(slug)]);
  if (!detail || !tree) notFound();

  const gen = tree.generations[0] ?? null;
  const heroImage = nameplateImage(detail.slug);
  const genKey = gen?.key;

  // แถวรุ่นย่อย (จาก tree — มีคีย์ลิงก์หน้ารุ่นย่อย) เรียงตามราคา
  const rows = gen
    ? gen.derivatives.flatMap((d) =>
        d.trims.flatMap((t) =>
          t.variants.map((v) => ({
            v,
            derivKey: d.key,
            trimKey: t.key,
            derivLabel: d.name || (BODY_TYPE_LABEL[d.bodyType] ?? d.bodyType),
          })),
        ),
      )
    : [];
  rows.sort((a, b) => (a.v.price ?? Infinity) - (b.v.price ?? Infinity));

  const variantCount = rows.length;
  const powertrains = [...new Set(rows.map((r) => r.v.powertrainText))];
  const adasCount = detail.adas?.features.length ?? 0;
  const bevRows = bevSpecRows(rows.map((r) => r.v));

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
      <nav aria-label="breadcrumb" className="pt-6 text-sm text-faint">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-foreground">ฐานข้อมูลรถ</Link></li>
          <li aria-hidden>›</li>
          <li><Link href={`/brands/${detail.brandSlug}`} className="text-muted hover:text-foreground">{detail.brand}</Link></li>
          <li aria-hidden>›</li>
          <li aria-current="page" className="font-medium text-foreground">{detail.name}</li>
        </ol>
      </nav>

      {/* hero — stat tiles */}
      <header className="grid gap-6 pt-6 pb-8 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              <span className="mr-2 font-normal text-muted">{detail.brand}</span>{detail.name}
            </h1>
            <LifecycleBadge status={detail.lifecycleStatus} />
          </div>
          <p className="mt-2 text-sm text-muted">
            {[
              detail.segment ? (SEGMENT_LABEL[detail.segment] ?? detail.segment) : null,
              detail.generationCode ?? detail.generationName,
              detail.launchYear != null ? `เปิดตัวในไทย ${detail.launchYear}` : null,
            ].filter(Boolean).join(" · ")}
          </p>
          {detail.summary && <p className="mt-4 max-w-2xl text-[15px] leading-7 text-muted">{detail.summary}</p>}

          <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <StatTile label="ราคาป้าย (ต่ำสุด)" value={<span className="tnum">{detail.priceMin != null ? formatTHB(detail.priceMin) : "—"}</span>} />
            <StatTile label="ราคาป้าย (สูงสุด)" value={<span className="tnum">{detail.priceMax != null ? formatTHB(detail.priceMax) : "—"}</span>} />
            <StatTile label="รุ่นย่อย" value={<span className="tnum">{variantCount}</span>} sub={`${gen?.derivatives.length ?? 0} ตัวถัง`} />
            <StatTile label="ระบบช่วยขับขี่" value={<span className="tnum">{adasCount}</span>} sub="ฟีเจอร์ที่ติดตาม" />
          </div>
          {detail.priceMin != null && detail.priceMax != null && detail.priceMin !== detail.priceMax && (
            <div className="mt-4 max-w-md"><PricePositionBar min={detail.priceMin} max={detail.priceMax} value={detail.priceMin} /></div>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-faint">
            <PowertrainDots labels={powertrains} />
            {detail.latestChecked && <span className="tnum">· ตรวจสอบล่าสุด {formatDateTH(detail.latestChecked)}</span>}
          </div>
        </div>
        {heroImage && (
          <div className="flex items-center justify-center rounded-2xl border border-border bg-surface-muted/40 p-4">
            <Image src={heroImage.src} alt={heroImage.alt} width={300} height={169} priority className="h-auto w-full max-w-[300px] object-contain" />
          </div>
        )}
      </header>

      {/* variant comparison table */}
      <section aria-labelledby="variants-heading" className="border-t border-border pt-8">
        <h2 id="variants-heading" className="scroll-mt-20 text-xl font-semibold tracking-tight">เทียบรุ่นย่อยและราคา</h2>
        <p className="mt-1 text-sm text-faint">ราคาป้ายทางการ · ไม่ใช่ราคาซื้อขายจริง · กดแถวเพื่อดูสเปกเต็มของรุ่นย่อย</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[13px] text-faint">
                <th className="py-2 pr-3 font-medium">รุ่นย่อย</th>
                <th className="px-3 py-2 font-medium">ตัวถัง</th>
                <th className="px-3 py-2 font-medium">ขุมพลัง</th>
                <th className="px-3 py-2 font-medium">กำลัง</th>
                <th className="px-3 py-2 font-medium">เกียร์ · ขับ</th>
                <th className="px-3 py-2 text-right font-medium">ราคาป้าย</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ v, derivKey, trimKey, derivLabel }) => {
                const href = genKey ? `/cars/${slug}/gen/${genKey}/${derivKey}/${trimKey}` : undefined;
                const Cell = href
                  ? ({ children, className }: { children: React.ReactNode; className?: string }) => (
                      <td className={className}><Link href={href} className="block">{children}</Link></td>
                    )
                  : ({ children, className }: { children: React.ReactNode; className?: string }) => <td className={className}>{children}</td>;
                return (
                  <tr key={v.id} className="border-b border-border last:border-b-0 hover:bg-surface-muted/50">
                    <Cell className="py-2.5 pr-3 font-medium">{v.name}</Cell>
                    <Cell className="px-3 py-2.5 text-muted">{derivLabel}</Cell>
                    <td className="px-3 py-2.5">
                      <span className="inline-flex items-center gap-1.5">
                        <span aria-hidden className={`inline-block size-2 rounded-full ${ptDotClass(v.powertrainText)}`} />{v.powertrainText}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 tnum text-muted">{v.powerText ?? "—"}</td>
                    <td className="px-3 py-2.5 text-muted">
                      {[v.transmissionText, v.drivetrain ? (DRIVETRAIN_LABEL[v.drivetrain] ?? v.drivetrain) : null].filter(Boolean).join(" · ") || "—"}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      {v.price != null ? <span className="font-semibold tnum">{formatTHB(v.price)}</span> : <span className="text-faint">ไม่มีข้อมูล</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* powertrain block */}
      <section aria-labelledby="powertrain-heading" className="border-t border-border pt-8 mt-10">
        <h2 id="powertrain-heading" className="text-xl font-semibold tracking-tight">ขุมพลังและสมรรถนะ</h2>
        {bevRows ? (
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {bevRows.map(([k, v]) => (
              <div key={k} className="rounded-xl border border-border bg-surface-muted px-3 py-2.5">
                <div className="text-[11px] text-faint">{k}</div>
                <div className="mt-0.5 text-sm font-semibold text-foreground tnum">{v}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-muted">{powertrains.join(" · ")} — กำลัง/เกียร์/ระบบขับ อยู่ในตารางด้านบน · รายละเอียดต่อรุ่นย่อยกดที่แถว</p>
        )}
      </section>

      {/* generation strip */}
      {gen && (
        <section aria-labelledby="gen-heading" className="border-t border-border pt-8 mt-10">
          <h2 id="gen-heading" className="text-xl font-semibold tracking-tight">โครงสร้างรุ่น</h2>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Link href={`/cars/${slug}/gen/${gen.key}`} className="rounded-full bg-accent-soft px-3.5 py-1.5 text-sm font-medium text-accent hover:opacity-90">
              เจน {gen.launchYear ?? gen.key} →
            </Link>
            {gen.derivatives.map((d) => (
              <Link key={d.key} href={`/cars/${slug}/gen/${gen.key}/${d.key}`} className="rounded-full border border-border px-3.5 py-1.5 text-sm text-muted hover:border-accent hover:text-foreground">
                {d.name || (BODY_TYPE_LABEL[d.bodyType] ?? d.bodyType)}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ADAS */}
      {detail.adas && detail.adas.trims.length > 0 && (() => {
        const { features, trims } = detail.adas;
        const uniform = features.every((f) => new Set(trims.map((t) => String(t.values.find((v) => v.key === f.key)?.has))).size === 1);
        const statusText = (has: boolean | null) => (has === true ? "มี" : has === false ? "ไม่มี" : "ยังไม่ยืนยัน");
        const statusClass = (has: boolean | null) => (has === true ? "text-success font-medium" : has === false ? "text-faint" : "text-faint italic");
        return (
          <section aria-labelledby="adas-heading" className="border-t border-border pt-8 mt-10">
            <h2 id="adas-heading" className="scroll-mt-20 text-xl font-semibold tracking-tight">ระบบช่วยขับขี่</h2>
            {uniform ? (
              <ul className="mt-4 max-w-3xl space-y-2">
                {features.map((f) => {
                  const v = trims[0].values.find((x) => x.key === f.key)!;
                  return (
                    <li key={f.key} className="flex items-baseline gap-3 text-[15px]">
                      <span className={statusClass(v.has)}>{statusText(v.has)}</span>
                      <span title={f.definition ?? undefined}>{f.nameTh} <span className="text-faint">({f.key})</span></span>
                    </li>
                  );
                })}
                <li className="pt-1 text-[13px] text-faint">ทุกรุ่นย่อยเหมือนกันทั้งรุ่น</li>
              </ul>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full max-w-3xl text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-[13px] text-faint">
                      <th scope="col" className="py-2 pr-3 font-medium">รุ่นย่อย/เกรด</th>
                      {features.map((f) => (
                        <th key={f.key} scope="col" className="px-3 py-2 font-medium" title={f.definition ?? undefined}>{f.nameTh} <span className="font-normal">({f.key})</span></th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {trims.map((t) => (
                      <tr key={t.label} className="border-b border-border last:border-b-0">
                        <td className="py-2.5 pr-3 font-medium">{t.label}</td>
                        {t.values.map((v) => <td key={v.key} className="px-3 py-2.5" title={v.marketing ?? undefined}><span className={statusClass(v.has)}>{statusText(v.has)}</span></td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <p className="mt-3 text-[13px] text-faint">ตามตารางสเปกทางการต่อรุ่นย่อย — ค่าที่สเปกไม่ระบุ = &ldquo;ยังไม่ยืนยัน&rdquo; (ไม่ใช่ &ldquo;ไม่มี&rdquo;)</p>
          </section>
        );
      })()}

      {/* timeline preview / dimensions placeholder */}
      <section aria-labelledby="timeline-heading" className="border-t border-border pt-8 mt-10">
        <h2 id="timeline-heading" className="scroll-mt-20 text-xl font-semibold tracking-tight">ไทม์ไลน์การเปลี่ยนแปลง</h2>
        {detail.changeEvents.length > 0 ? (
          <>
            <ol className="mt-4 max-w-3xl space-y-3">
              {detail.changeEvents.slice(0, 3).map((e) => (
                <li key={e.id} className="flex items-baseline gap-3">
                  <span className="tnum shrink-0 text-xs text-faint">{formatDateTH(e.effectiveDate) ?? "—"}</span>
                  <Chip>{CHANGE_TYPE_LABEL[e.changeType] ?? e.changeType}</Chip>
                  <span className="text-sm font-medium">{e.title}</span>
                </li>
              ))}
            </ol>
            <Link href={`/cars/${slug}/timeline`} className="mt-4 inline-block text-sm text-accent hover:underline">ดูไทม์ไลน์ทั้งหมด ({detail.changeEvents.length}) →</Link>
          </>
        ) : (
          <div className="mt-4 max-w-xl"><PendingBlock title="ยังไม่มีบันทึกการเปลี่ยนแปลง" reason="จะเพิ่มเมื่อมีเหตุการณ์ที่มีหลักฐาน (เปิดตัว/ปรับราคา/เฟซลิฟต์)" /></div>
        )}
        <div className="mt-6 max-w-xl"><PendingBlock title="รอข้อมูลมิติตัวถังและน้ำหนัก" reason="ยาว × กว้าง × สูง · ระยะฐานล้อ · น้ำหนัก — จะเพิ่มพร้อมแหล่งอ้างอิง" /></div>
      </section>

      <div className="border-t border-border pt-8 mt-10">
        <SourcesSection sources={detail.sources} />
      </div>

      {detail.generationSummary && (
        <p className="max-w-3xl border-t border-border pt-6 text-sm leading-6 text-faint"><DataStatusValue value={detail.generationSummary} /></p>
      )}
    </div>
  );
}
