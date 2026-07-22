import Image from "next/image";
import Link from "next/link";
import type { NameplateDetail } from "@/lib/queries";
import { BODY_TYPE_LABEL, DRIVETRAIN_LABEL, SEGMENT_LABEL } from "@/lib/labels";
import { formatDateTH, formatTHB } from "@/lib/format";
import { nameplateImage } from "@/lib/images";
import { DataStatusValue, LifecycleBadge, PowertrainDots, ptDotClass } from "@/components/badges";
import { PendingBlock, PricePositionBar, StatTile } from "@/components/dev/m24/primitives";
import { BevSpecBlock } from "@/components/dev/m24/bev-spec";

// ── MOCKUP (M24) — Nameplate Hub ทิศ "Dense" (stat tiles เด่น · ตารางเทียบแน่น · แนว tracker) ──
export function NameplateDense({ detail }: { detail: NameplateDetail }) {
  const heroImage = nameplateImage(detail.slug);
  const rows = detail.groups.flatMap((g) =>
    g.rows.map((r) => ({ ...r, groupLabel: g.label || (BODY_TYPE_LABEL[g.bodyType] ?? g.bodyType) })),
  );
  const variantCount = rows.length;
  const powertrains = [...new Set(rows.map((r) => r.powertrainText))];
  const adasCount = detail.adas?.features.length ?? 0;
  const isBev = detail.slug === "bz4x";

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
      <nav aria-label="breadcrumb" className="pt-6 text-sm text-faint">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-foreground">ฐานข้อมูลรถ</Link></li>
          <li aria-hidden>›</li>
          <li><Link href="/brands/toyota" className="text-muted hover:text-foreground">{detail.brand}</Link></li>
          <li aria-hidden>›</li>
          <li aria-current="page" className="font-medium text-foreground">{detail.name}</li>
        </ol>
      </nav>

      {/* hero — compact + stat tiles */}
      <header className="grid gap-6 pt-6 pb-8 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight">
              <span className="mr-2 font-normal text-muted">{detail.brand}</span>{detail.name}
            </h1>
            <LifecycleBadge status={detail.lifecycleStatus} />
          </div>
          <p className="mt-2 text-sm text-muted">
            {[detail.segment ? (SEGMENT_LABEL[detail.segment] ?? detail.segment) : null,
              detail.generationCode ?? detail.generationName,
              detail.launchYear != null ? `เปิดตัวในไทย ${detail.launchYear}` : null].filter(Boolean).join(" · ")}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <StatTile label="ราคาป้าย (ต่ำสุด)" value={<span className="tnum">{detail.priceMin != null ? formatTHB(detail.priceMin) : "—"}</span>} />
            <StatTile label="ราคาป้าย (สูงสุด)" value={<span className="tnum">{detail.priceMax != null ? formatTHB(detail.priceMax) : "—"}</span>} />
            <StatTile label="รุ่นย่อย" value={<span className="tnum">{variantCount}</span>} sub={`${detail.groups.length} ตัวถัง`} />
            <StatTile label="ระบบช่วยขับขี่" value={<span className="tnum">{adasCount}</span>} sub="ฟีเจอร์ที่ติดตาม" />
          </div>
          {detail.priceMin != null && detail.priceMax != null && detail.priceMin !== detail.priceMax && (
            <div className="mt-4 max-w-md"><PricePositionBar min={detail.priceMin} max={detail.priceMax} value={detail.priceMin} /></div>
          )}
          <div className="mt-3 flex items-center gap-3 text-xs text-faint">
            <PowertrainDots labels={powertrains} />
            {detail.latestChecked && <span className="tnum">· ตรวจล่าสุด {formatDateTH(detail.latestChecked)}</span>}
          </div>
        </div>
        {heroImage && (
          <div className="flex items-center justify-center rounded-2xl border border-border bg-surface-muted/40 p-4">
            <Image src={heroImage.src} alt={heroImage.alt} width={300} height={169} priority className="h-auto w-full max-w-[300px] object-contain" />
          </div>
        )}
      </header>

      {/* variant comparison table — แน่น */}
      <section aria-labelledby="prices" className="border-t border-border pt-8">
        <h2 id="prices" className="text-xl font-semibold tracking-tight">เทียบรุ่นย่อยและราคา</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
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
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-b-0 hover:bg-surface-muted/50">
                  <td className="py-2.5 pr-3 font-medium">{r.name}</td>
                  <td className="px-3 py-2.5 text-muted">{r.groupLabel}</td>
                  <td className="px-3 py-2.5">
                    <span className="inline-flex items-center gap-1.5">
                      <span aria-hidden className={`inline-block size-2 rounded-full ${ptDotClass(r.powertrainText)}`} />
                      {r.powertrainText}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 tnum text-muted">{r.powerText ?? "—"}</td>
                  <td className="px-3 py-2.5 text-muted">
                    {[r.transmissionText, r.drivetrain ? (DRIVETRAIN_LABEL[r.drivetrain] ?? r.drivetrain) : null].filter(Boolean).join(" · ") || "—"}
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    {r.price != null ? <span className="font-semibold tnum">{formatTHB(r.price)}</span> : <span className="text-faint">ไม่มีข้อมูล</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[13px] text-faint">ราคาป้ายทางการ ไม่ใช่ราคาซื้อขายจริง · แหล่งอ้างอิงต่อรุ่นท้ายหน้า</p>
      </section>

      {/* powertrain tiles */}
      <section aria-labelledby="powertrain" className="border-t border-border pt-8 mt-10">
        <h2 id="powertrain" className="text-xl font-semibold tracking-tight">ขุมพลังและสมรรถนะ</h2>
        <div className="mt-4">
          {isBev ? <BevSpecBlock variant="dense" /> : (
            <p className="max-w-2xl text-[15px] leading-7 text-muted">{powertrains.join(" · ")} — กำลัง/เกียร์/ระบบขับ อยู่ในตารางด้านบน</p>
          )}
        </div>
      </section>

      {/* generation + derivatives */}
      <section aria-labelledby="gen" className="border-t border-border pt-8 mt-10">
        <h2 id="gen" className="text-xl font-semibold tracking-tight">โครงสร้างรุ่น</h2>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Link href="#" className="rounded-full bg-accent-soft px-3.5 py-1.5 text-sm font-medium text-accent hover:opacity-90">
            เจน {detail.launchYear} →
          </Link>
          {detail.groups.map((g) => (
            <Link key={g.key} href="#" className="rounded-full border border-border px-3.5 py-1.5 text-sm text-muted hover:border-accent hover:text-foreground">
              {g.label || (BODY_TYPE_LABEL[g.bodyType] ?? g.bodyType)}
            </Link>
          ))}
        </div>
      </section>

      {/* ADAS grid */}
      {detail.adas && detail.adas.trims.length > 0 && (
        <section aria-labelledby="adas" className="border-t border-border pt-8 mt-10">
          <h2 id="adas" className="text-xl font-semibold tracking-tight">ระบบช่วยขับขี่</h2>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {detail.adas.features.map((f) => (
              <div key={f.key} className="rounded-xl border border-border bg-surface-muted px-3 py-2.5">
                <div className="text-sm font-medium">{f.nameTh}</div>
                <div className="text-[11px] text-faint">{f.key} · {detail.adas!.trims.filter((t) => t.values.find((v) => v.key === f.key)?.has === true).length}/{detail.adas!.trims.length} รุ่นย่อยยืนยัน</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* timeline + dimensions placeholder */}
      <section aria-labelledby="timeline" className="border-t border-border pt-8 mt-10">
        <h2 id="timeline" className="text-xl font-semibold tracking-tight">ไทม์ไลน์การเปลี่ยนแปลง</h2>
        {detail.changeEvents.length > 0 ? (
          <ol className="mt-4 max-w-3xl space-y-2.5">
            {detail.changeEvents.slice(0, 3).map((e) => (
              <li key={e.id} className="flex items-baseline gap-3">
                <span className="tnum shrink-0 text-xs text-faint">{formatDateTH(e.effectiveDate) ?? "—"}</span>
                <span className="text-sm font-medium">{e.title}</span>
              </li>
            ))}
          </ol>
        ) : (
          <div className="mt-4 max-w-xl"><PendingBlock title="ยังไม่มีบันทึกการเปลี่ยนแปลง" reason="จะเพิ่มเมื่อมีเหตุการณ์ที่มีหลักฐาน" /></div>
        )}
        <div className="mt-6 max-w-xl"><PendingBlock title="รอข้อมูลมิติตัวถัง" reason="ยาว×กว้าง×สูง · ระยะฐานล้อ · น้ำหนัก" /></div>
      </section>

      <section aria-labelledby="sources-heading" className="border-t border-border pt-8 mt-10">
        <h2 id="sources-heading" className="text-xl font-semibold tracking-tight">แหล่งอ้างอิง</h2>
        <p className="mt-1.5 text-sm text-faint"><DataStatusValue value={detail.sources.length} /> แหล่ง — หลักฐานราคาและข้อมูลในหน้านี้</p>
      </section>
    </div>
  );
}
