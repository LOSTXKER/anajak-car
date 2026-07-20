import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNameplateDetail } from "@/lib/queries";
import {
  BODY_TYPE_LABEL,
  CHANGE_TYPE_LABEL,
  DRIVETRAIN_LABEL,
  SEGMENT_LABEL,
} from "@/lib/labels";
import { SourcesSection } from "@/components/sources-section";
import { nameplateImage } from "@/lib/images";
import { formatDateTH, formatPriceRange, formatTHB } from "@/lib/format";
import { Chip, DataStatusValue, EvidenceLink, LifecycleBadge } from "@/components/badges";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getNameplateDetail(slug);
  // โยน 404 ตั้งแต่ชั้น metadata — ถ้ารอโยนใน page ตอน stream ไปแล้ว status จะค้างเป็น 200
  if (!detail) notFound();
  return {
    title: `${detail.brand} ${detail.name} — ราคาและสเปก`,
    description: `ราคาป้ายทางการ สเปก และรุ่นย่อยทั้งหมดของ ${detail.brand} ${detail.name} พร้อมแหล่งอ้างอิงที่ตรวจสอบได้`,
  };
}

export default async function NameplatePage({ params }: Props) {
  const { slug } = await params;
  const detail = await getNameplateDetail(slug);
  if (!detail) notFound();

  const priceRange = formatPriceRange(detail.priceMin, detail.priceMax);
  const heroImage = nameplateImage(detail.slug);
  const variantCount = detail.groups.reduce((n, g) => n + g.rows.length, 0);

  // meta ประจำรุ่น — บรรทัดเดียว เงียบๆ ใต้ชื่อ
  const metaParts = [
    detail.segment ? (SEGMENT_LABEL[detail.segment] ?? detail.segment) : null,
    detail.generationCode ?? detail.generationName,
    detail.launchYear != null ? `เปิดตัวในไทย ${detail.launchYear}` : null,
  ].filter(Boolean);

  // ความเชื่อมั่นพูดครั้งเดียว: ถ้าหลักฐานราคาทั้งหมดมาจากผู้เผยแพร่เดียว/ระดับเดียว ให้สรุปเป็นประโยค
  // แทนการติดป้าย HIGH ซ้ำทุกแถว (แหล่งรายรุ่นเปิดดูได้ที่ท้ายหน้าเสมอ)
  const priceEvidences = detail.groups.flatMap((g) =>
    g.rows.map((r) => r.evidence).filter(Boolean),
  );
  const publishers = [
    ...new Set(priceEvidences.map((e) => e!.publisher).filter(Boolean)),
  ] as string[];
  const allOfficialHigh = priceEvidences.every(
    (e) => e!.sourceType === "MANUFACTURER_OFFICIAL" && e!.confidence === "HIGH",
  );
  const trustLine =
    publishers.length === 1
      ? `ทุกราคาอ้างอิง ${publishers[0]}${allOfficialHigh ? " (แหล่งทางการ)" : ""}`
      : publishers.length > 1
        ? `อ้างอิง ${publishers.length} แหล่ง${allOfficialHigh ? " (ทางการทั้งหมด)" : " — ดูรายแหล่งท้ายหน้า"}`
        : null;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <nav aria-label="breadcrumb" className="pt-8 text-sm text-faint">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="transition-colors hover:text-foreground">
              ฐานข้อมูลรถ
            </Link>
          </li>
          <li aria-hidden>›</li>
          <li>
            <Link
              href={`/brands/${detail.brandSlug}`}
              className="text-muted transition-colors hover:text-foreground"
            >
              {detail.brand}
            </Link>
          </li>
          <li aria-hidden>›</li>
          <li aria-current="page" className="font-medium text-foreground">
            {detail.name}
          </li>
        </ol>
      </nav>

      <header className="flex flex-col-reverse gap-8 pt-8 pb-12 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 max-w-2xl">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              <span className="mr-2 font-normal text-muted">{detail.brand}</span>
              {detail.name}
            </h1>
            <LifecycleBadge status={detail.lifecycleStatus} />
          </div>
          {metaParts.length > 0 && (
            <p className="mt-2.5 text-sm text-muted">{metaParts.join(" · ")}</p>
          )}
          {detail.summary && (
            <p className="mt-4 text-[15px] leading-7 text-muted">{detail.summary}</p>
          )}
        </div>
        {heroImage && (
          <Image
            src={heroImage.src}
            alt={heroImage.alt}
            width={360}
            height={203}
            priority
            className="h-auto w-full max-w-[360px] shrink-0 self-center object-contain sm:self-start"
          />
        )}
      </header>

      {/* บันไดราคา — ราคาเป็นพระเอกหนึ่งเดียวของหน้า */}
      <section aria-labelledby="variants-heading" className="border-t border-border pt-10 pb-14">
        <h2 id="variants-heading" className="text-sm font-medium text-muted">
          ราคาป้ายทางการ
        </h2>
        <p className="mt-2 text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl">
          <DataStatusValue value={priceRange} />
        </p>
        <p className="mt-3 text-sm text-faint">
          {variantCount} รุ่นย่อย
          {trustLine && <> · {trustLine}</>}
          {detail.latestChecked && <> · ตรวจสอบล่าสุด {formatDateTH(detail.latestChecked)}</>}
          {" · "}
          <a href="#sources-heading" className="text-accent hover:underline">
            แหล่งอ้างอิง
          </a>
          {" · "}
          <span>ไม่ใช่ราคาซื้อขายจริง</span>
        </p>

        {detail.groups.length === 0 ? (
          <p className="mt-10 text-sm text-muted">ยังไม่มีข้อมูลรุ่นย่อยของรุ่นนี้</p>
        ) : (
          detail.groups.map((group) => (
            <div key={group.key} className="mt-10">
              <h3 className="text-[15px] font-semibold">
                {group.label || (BODY_TYPE_LABEL[group.bodyType] ?? group.bodyType)}
              </h3>
              <ol className="mt-1 max-w-3xl divide-y divide-border">
                {group.rows.map((row, i) => {
                  const specLine = [
                    row.powertrainText,
                    row.powerText,
                    row.transmissionText,
                    row.drivetrain
                      ? (DRIVETRAIN_LABEL[row.drivetrain] ?? row.drivetrain)
                      : null,
                  ]
                    .filter(Boolean)
                    .join(" · ");
                  const prev = i > 0 ? group.rows[i - 1] : null;
                  const delta =
                    row.price != null && prev?.price != null
                      ? row.price - prev.price
                      : null;
                  return (
                    <li
                      key={row.id}
                      className="flex items-baseline justify-between gap-6 py-4"
                    >
                      <div className="min-w-0">
                        <div className="text-[15px] font-medium">{row.name}</div>
                        {specLine && (
                          <div
                            className="mt-1 text-[13px] text-faint"
                            title={row.engineText ?? undefined}
                          >
                            {specLine}
                          </div>
                        )}
                      </div>
                      <div className="shrink-0 text-right">
                        {row.price != null ? (
                          <>
                            <div className="text-lg font-semibold tabular-nums">
                              {formatTHB(row.price)}
                            </div>
                            {delta != null && delta > 0 && (
                              /* ส่วนต่างจากขั้นก่อนหน้า — ตอบคำถามจริงของคนเลือกrรุ่น: จ่ายเพิ่มเท่าไหร่ */
                              <div className="mt-0.5 text-xs text-faint tabular-nums">
                                +{formatTHB(delta)}
                              </div>
                            )}
                          </>
                        ) : (
                          <span className="text-sm text-faint">ไม่มีข้อมูล</span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))
        )}
      </section>

      {detail.changeEvents.length > 0 && (
        <section aria-labelledby="timeline-heading" className="border-t border-border pt-10 pb-14">
          <h2 id="timeline-heading" className="text-xl font-semibold tracking-tight">
            ไทม์ไลน์การเปลี่ยนแปลง
          </h2>
          <ol className="mt-2 max-w-3xl divide-y divide-border">
            {detail.changeEvents.map((event) => (
              <li key={event.id} className="py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Chip>{CHANGE_TYPE_LABEL[event.changeType] ?? event.changeType}</Chip>
                  <span className="font-medium">{event.title}</span>
                  <span className="ml-auto text-xs whitespace-nowrap text-faint">
                    {formatDateTH(event.effectiveDate) ?? "ไม่ระบุวันที่"}
                  </span>
                </div>
                {event.summary && (
                  <p className="mt-1.5 text-sm text-muted">{event.summary}</p>
                )}
                {(event.beforeValue || event.afterValue) && (
                  <p className="mt-1 text-sm text-muted tabular-nums">
                    {event.beforeValue ?? "—"} → {event.afterValue ?? "—"}
                  </p>
                )}
                {event.evidence && (
                  <div className="mt-2">
                    <EvidenceLink evidence={event.evidence} />
                  </div>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      <div className="border-t border-border pt-10">
        <SourcesSection sources={detail.sources} />
      </div>

      {detail.generationSummary && (
        <p className="max-w-3xl border-t border-border pt-6 pb-14 text-sm leading-6 text-faint">
          {detail.generationSummary}
        </p>
      )}
    </div>
  );
}
