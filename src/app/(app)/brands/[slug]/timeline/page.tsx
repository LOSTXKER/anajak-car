import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrandDetail, getBrandTimeline, type SourceRow, type BrandTimelineEvent } from "@/lib/queries";
import { formatDateTH } from "@/lib/format";
import { CHANGE_TYPE_LABEL } from "@/lib/labels";
import { Chip, DataStatusValue, EvidenceLink } from "@/components/badges";
import { SourcesSection } from "@/components/sources-section";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getBrandDetail(slug);
  if (!detail) notFound();
  return {
    title: `ไทม์ไลน์และประวัติ ${detail.name} ในไทย`,
    description: `เหตุการณ์สำคัญของรุ่นใน coverage ${detail.name} (เปิดตัว ปรับราคา ไมเนอร์เชนจ์) พร้อมหลักฐาน และประวัติแบรนด์ในไทย`,
  };
}

// จัดกลุ่มเหตุการณ์ตามปี (ค.ศ.) เรียงใหม่→เก่า — event เรียง desc มาแล้ว
function groupByYear(events: BrandTimelineEvent[]) {
  const groups: { year: string; events: BrandTimelineEvent[] }[] = [];
  for (const ev of events) {
    const year = ev.effectiveDate ? String(new Date(ev.effectiveDate).getUTCFullYear()) : "ไม่ระบุปี";
    const last = groups[groups.length - 1];
    if (last && last.year === year) last.events.push(ev);
    else groups.push({ year, events: [ev] });
  }
  return groups;
}

export default async function BrandTimelinePage({ params }: Props) {
  const { slug } = await params;
  const [detail, timeline] = await Promise.all([getBrandDetail(slug), getBrandTimeline(slug)]);
  if (!detail) notFound();

  const operationDate = detail.operationFrom ? formatDateTH(detail.operationFrom) : null;
  const operationYear = detail.operationFrom ? new Date(detail.operationFrom).getUTCFullYear() : null;
  const groups = groupByYear(timeline.events);
  const hasEvents = timeline.events.length > 0;

  // รวมแหล่งอ้างอิง: ระดับแบรนด์ + ของทุกเหตุการณ์ (dedupe)
  const sourceMap = new Map<string, SourceRow>();
  for (const s of [...detail.sources, ...timeline.sources]) if (!sourceMap.has(s.id)) sourceMap.set(s.id, s);
  const allSources = [...sourceMap.values()];

  const base = `/brands/${detail.slug}`;

  return (
    <>
      <nav aria-label="breadcrumb" className="pt-8 text-sm text-faint">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="transition-colors hover:text-foreground">ฐานข้อมูลรถ</Link></li>
          <li aria-hidden>›</li>
          <li><Link href={base} className="text-muted transition-colors hover:text-foreground">{detail.name}</Link></li>
          <li aria-hidden>›</li>
          <li aria-current="page" className="font-medium text-foreground">ไทม์ไลน์และประวัติ</li>
        </ol>
      </nav>

      <header className="pt-6 pb-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">ไทม์ไลน์และประวัติ</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          {hasEvents
            ? `${timeline.events.length} เหตุการณ์ที่บันทึกพร้อมหลักฐาน · ครอบคลุมเฉพาะรุ่นใน coverage — ไม่ใช่ประวัติครบทุกเหตุการณ์ของแบรนด์`
            : `ประวัติ ${detail.name} ในไทยพร้อมแหล่งอ้างอิง`}
        </p>
      </header>

      {/* พระเอก: ไทม์ไลน์การเปลี่ยนแปลง */}
      {hasEvents ? (
        <section aria-labelledby="brand-timeline-h" className="pb-12">
          <h2 id="brand-timeline-h" className="text-lg font-semibold tracking-tight">การเปลี่ยนแปลง</h2>
          <div className="mt-4 space-y-6">
            {groups.map((group) => (
              <div key={group.year}>
                <p className="text-sm font-semibold text-faint tabular-nums">{group.year}</p>
                <ul className="mt-1 divide-y divide-border border-t border-border">
                  {group.events.map((ev) => (
                    <li key={ev.id} className="py-4">
                      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Chip>{CHANGE_TYPE_LABEL[ev.changeType] ?? ev.changeType}</Chip>
                          {ev.nameplateSlug && ev.nameplateName && (
                            <Link href={`${base}/cars/${ev.nameplateSlug}`} className="text-sm font-medium text-accent hover:underline">
                              {ev.nameplateName}
                            </Link>
                          )}
                        </div>
                        <span className="text-xs whitespace-nowrap text-faint">
                          {formatDateTH(ev.effectiveDate) ?? "ไม่ระบุวันที่"}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[15px] font-medium">{ev.title}</p>
                      {ev.summary && <p className="mt-1 text-sm text-muted">{ev.summary}</p>}
                      {(ev.beforeValue || ev.afterValue) && (
                        <p className="mt-1 text-sm tabular-nums">
                          <span className="text-faint">{ev.beforeValue ?? "—"}</span>
                          <span className="mx-1.5 text-faint" aria-hidden>→</span>
                          <span className="font-medium">{ev.afterValue ?? "—"}</span>
                        </p>
                      )}
                      {ev.evidence && (
                        <div className="mt-1.5">
                          <EvidenceLink evidence={ev.evidence} />
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {operationYear != null && (
            <p className="mt-6 text-sm text-faint">
              {detail.name} ดำเนินงานในไทยตั้งแต่ {operationYear} — อ่านประวัติแบรนด์ด้านล่าง
            </p>
          )}
        </section>
      ) : (
        <p className="pb-8 text-sm text-muted">ยังไม่มีเหตุการณ์ที่บันทึก — เหตุการณ์จะเพิ่มเมื่อมีหลักฐานทางการ</p>
      )}

      {/* ประวัติแบรนด์ในไทย */}
      <section aria-labelledby="brand-history-h" className="border-t border-border pt-8 pb-4">
        <h2 id="brand-history-h" className="text-lg font-semibold tracking-tight">ประวัติแบรนด์ในไทย</h2>
        <dl className="mt-5 grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4">
          <div>
            <dt className="text-xs text-faint">ดำเนินงานในไทยตั้งแต่</dt>
            <dd className="mt-1 text-[15px] font-semibold">
              <DataStatusValue value={operationDate ?? (operationYear != null ? String(operationYear) : null)} />
            </dd>
          </div>
          <div>
            <dt className="text-xs text-faint">ผู้ผลิต/จัดจำหน่าย</dt>
            <dd className="mt-1 text-[15px] font-semibold"><DataStatusValue value={detail.distributorName} /></dd>
          </div>
          <div>
            <dt className="text-xs text-faint">บริษัทแม่</dt>
            <dd className="mt-1 text-[15px] font-semibold"><DataStatusValue value={detail.parentCompany} /></dd>
          </div>
          <div>
            <dt className="text-xs text-faint">ประเทศต้นทาง</dt>
            <dd className="mt-1 text-[15px] font-semibold"><DataStatusValue value={detail.countryOrigin} /></dd>
          </div>
        </dl>
        {detail.channel && <p className="mt-5 max-w-2xl text-sm text-muted">{detail.channel}</p>}
      </section>

      <SourcesSection
        sources={allSources}
        subtitle="หลักฐานข้อมูลบริษัทและเหตุการณ์ในหน้านี้ — แหล่งของราคาแต่ละรุ่นอยู่ในหน้าของรุ่นนั้น ๆ"
      />
    </>
  );
}
