import Image from "next/image";
import Link from "next/link";
import type { NameplateDetail } from "@/lib/queries";
import { BODY_TYPE_LABEL, DRIVETRAIN_LABEL, SEGMENT_LABEL } from "@/lib/labels";
import { formatDateTH, formatPriceRange, formatTHB } from "@/lib/format";
import { nameplateImage } from "@/lib/images";
import {
  Chip,
  DataStatusValue,
  FreshnessTag,
  LifecycleBadge,
  PowertrainDots,
} from "@/components/badges";
import { PendingBlock } from "@/components/dev/m24/primitives";
import { BevSpecBlock } from "@/components/dev/m24/bev-spec";

// ── MOCKUP (M24) — Nameplate Hub ทิศ "Calm" (โปร่ง · บันไดราคาเป็นพระเอก · ต่อยอด M22) ──
export function NameplateCalm({ detail }: { detail: NameplateDetail }) {
  const heroImage = nameplateImage(detail.slug);
  const variantCount = detail.groups.reduce((n, g) => n + g.rows.length, 0);
  const powertrains = [...new Set(detail.groups.flatMap((g) => g.rows.map((r) => r.powertrainText)))];
  const isBev = detail.slug === "bz4x";

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-20 sm:px-6">
      {/* breadcrumb */}
      <nav aria-label="breadcrumb" className="pt-8 text-sm text-faint">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-foreground">ฐานข้อมูลรถ</Link></li>
          <li aria-hidden>›</li>
          <li><Link href="/brands/toyota" className="text-muted hover:text-foreground">{detail.brand}</Link></li>
          <li aria-hidden>›</li>
          <li aria-current="page" className="font-medium text-foreground">{detail.name}</li>
        </ol>
      </nav>

      {/* hero */}
      <header className="flex flex-col-reverse gap-8 pt-8 pb-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 max-w-2xl">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              <span className="mr-2 font-normal text-muted">{detail.brand}</span>
              {detail.name}
            </h1>
            <LifecycleBadge status={detail.lifecycleStatus} />
          </div>
          <p className="mt-2.5 text-sm text-muted">
            {[
              detail.segment ? (SEGMENT_LABEL[detail.segment] ?? detail.segment) : null,
              detail.generationCode ?? detail.generationName,
              detail.launchYear != null ? `เปิดตัวในไทย ${detail.launchYear}` : null,
            ].filter(Boolean).join(" · ")}
          </p>
          {detail.summary && <p className="mt-4 text-[15px] leading-7 text-muted">{detail.summary}</p>}

          {/* key-facts strip — เบา */}
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-5">
            <div>
              <div className="text-xs text-faint">ราคาป้ายทางการ</div>
              <div className="mt-0.5 text-xl font-semibold tnum">
                <DataStatusValue value={formatPriceRange(detail.priceMin, detail.priceMax)} />
              </div>
            </div>
            <div>
              <div className="text-xs text-faint">รุ่นย่อย</div>
              <div className="mt-0.5 text-xl font-semibold tnum">{variantCount}</div>
            </div>
            <div className="min-w-0">
              <div className="text-xs text-faint">ขุมพลัง</div>
              <div className="mt-1"><PowertrainDots labels={powertrains} /></div>
            </div>
          </div>
          <div className="mt-3"><FreshnessTag date={detail.latestChecked} prefix="ตรวจสอบล่าสุด" /></div>
        </div>
        {heroImage && (
          <Image src={heroImage.src} alt={heroImage.alt} width={340} height={192} priority
            className="h-auto w-full max-w-[340px] shrink-0 self-center object-contain sm:self-start" />
        )}
      </header>

      {/* price ladder — พระเอก */}
      <section aria-labelledby="prices" className="border-t border-border pt-10">
        <h2 id="prices" className="text-sm font-medium text-muted">บันไดราคาป้ายทางการ</h2>
        {detail.groups.map((group) => (
          <div key={group.key} className="mt-8">
            <h3 className="text-[15px] font-semibold">{group.label || (BODY_TYPE_LABEL[group.bodyType] ?? group.bodyType)}</h3>
            <ol className="mt-1 max-w-3xl divide-y divide-border">
              {group.rows.map((row, i) => {
                const specLine = [row.powertrainText, row.powerText, row.transmissionText,
                  row.drivetrain ? (DRIVETRAIN_LABEL[row.drivetrain] ?? row.drivetrain) : null]
                  .filter(Boolean).join(" · ");
                const prev = i > 0 ? group.rows[i - 1] : null;
                const delta = row.price != null && prev?.price != null ? row.price - prev.price : null;
                return (
                  <li key={row.id} className="flex items-baseline justify-between gap-6 py-4">
                    <div className="min-w-0">
                      <div className="text-[15px] font-medium">{row.name}</div>
                      {specLine && <div className="mt-1 text-[13px] text-faint">{specLine}</div>}
                    </div>
                    <div className="shrink-0 text-right">
                      {row.price != null ? (
                        <>
                          <div className="text-lg font-semibold tnum">{formatTHB(row.price)}</div>
                          {delta != null && delta > 0 && <div className="mt-0.5 text-xs text-faint tnum">+{formatTHB(delta)}</div>}
                        </>
                      ) : <span className="text-sm text-faint">ไม่มีข้อมูล</span>}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
        <p className="mt-4 text-sm text-faint">ไม่ใช่ราคาซื้อขายจริง · แหล่งอ้างอิงต่อรุ่นอยู่ท้ายหน้า</p>
      </section>

      {/* powertrain block */}
      <section aria-labelledby="powertrain" className="border-t border-border pt-10 mt-10">
        <h2 id="powertrain" className="text-xl font-semibold tracking-tight">ขุมพลังและสมรรถนะ</h2>
        <div className="mt-4">
          {isBev ? <BevSpecBlock variant="calm" /> : (
            <p className="max-w-2xl text-[15px] leading-7 text-muted">
              {powertrains.join(" · ")} — รายละเอียดกำลัง/เกียร์/ระบบขับ ดูในบันไดราคาแต่ละรุ่นย่อยด้านบน
            </p>
          )}
        </div>
      </section>

      {/* generation strip — ทางเข้าหน้าย่อย */}
      <section aria-labelledby="gen" className="border-t border-border pt-10 mt-10">
        <h2 id="gen" className="text-xl font-semibold tracking-tight">โครงสร้างรุ่น</h2>
        <Link href="#" className="mt-4 flex items-center justify-between rounded-2xl border border-border bg-surface-muted/50 px-5 py-4 transition-colors hover:border-accent">
          <div>
            <div className="text-[15px] font-semibold">
              เจเนอเรชันปัจจุบัน {detail.launchYear && <span className="tnum text-muted">· {detail.launchYear}</span>}
            </div>
            <div className="mt-0.5 text-sm text-faint">
              {detail.generationCode ?? detail.generationName ?? "—"} · {detail.groups.length} ตัวถัง · {variantCount} รุ่นย่อย
            </div>
          </div>
          <span aria-hidden className="text-accent">ดูโครงสร้างรุ่น →</span>
        </Link>
      </section>

      {/* ADAS (compact) */}
      {detail.adas && detail.adas.trims.length > 0 && (
        <section aria-labelledby="adas" className="border-t border-border pt-10 mt-10">
          <h2 id="adas" className="text-xl font-semibold tracking-tight">ระบบช่วยขับขี่</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {detail.adas.features.map((f) => (
              <li key={f.key}><Chip>{f.nameTh} ({f.key})</Chip></li>
            ))}
          </ul>
          <p className="mt-3 text-[13px] text-faint">ความครบต่อรุ่นย่อยดูในหน้ารุ่นย่อย · ค่าที่สเปกไม่ระบุ = &ldquo;ยังไม่ยืนยัน&rdquo;</p>
        </section>
      )}

      {/* timeline preview */}
      <section aria-labelledby="timeline" className="border-t border-border pt-10 mt-10">
        <h2 id="timeline" className="text-xl font-semibold tracking-tight">ไทม์ไลน์การเปลี่ยนแปลง</h2>
        {detail.changeEvents.length > 0 ? (
          <>
            <ol className="mt-4 max-w-3xl space-y-3">
              {detail.changeEvents.slice(0, 3).map((e) => (
                <li key={e.id} className="flex items-baseline gap-3">
                  <span className="tnum shrink-0 text-xs text-faint">{formatDateTH(e.effectiveDate) ?? "—"}</span>
                  <span className="text-sm font-medium">{e.title}</span>
                </li>
              ))}
            </ol>
            <Link href="#" className="mt-4 inline-block text-sm text-accent hover:underline">ดูไทม์ไลน์ทั้งหมด →</Link>
          </>
        ) : (
          <div className="mt-4 max-w-xl"><PendingBlock title="ยังไม่มีบันทึกการเปลี่ยนแปลง" reason="จะเพิ่มเมื่อมีเหตุการณ์ที่มีหลักฐาน (เปิดตัว/ปรับราคา/เฟซลิฟต์)" /></div>
        )}
      </section>

      {/* dimensions placeholder — ซื่อสัตย์ */}
      <section className="border-t border-border pt-10 mt-10">
        <h2 className="text-xl font-semibold tracking-tight">มิติตัวถังและน้ำหนัก</h2>
        <div className="mt-4 max-w-xl"><PendingBlock title="รอข้อมูลมิติที่ตรวจสอบได้" reason="ยาว × กว้าง × สูง · ระยะฐานล้อ · น้ำหนัก — จะเพิ่มพร้อมแหล่งอ้างอิง" /></div>
      </section>

      {/* sources */}
      <section aria-labelledby="sources-heading" className="border-t border-border pt-10 mt-10">
        <h2 id="sources-heading" className="text-xl font-semibold tracking-tight">แหล่งอ้างอิง</h2>
        <p className="mt-1.5 text-sm text-faint">หลักฐานที่ใช้ยืนยันราคาและข้อมูลในหน้านี้ ({detail.sources.length} แหล่ง)</p>
      </section>
    </div>
  );
}
