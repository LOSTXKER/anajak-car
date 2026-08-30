// ── ทิศ A "ตารางคือหน้าแรก" ────────────────────────────────────────────────
// วิธีคิด: CARMETA เป็น "เครื่องมือ" ไม่ใช่แผ่นพับ — เปิดมาเจอข้อมูลทั้งฐานทันที
// กรองเพื่อตัดตัวเลือกทิ้ง แล้วทุกชุดตัวกรองยอดนิยม = หน้าเว็บของตัวเอง (Google เก็บได้)
import Image from "next/image";

import { SiteLogo } from "@/components/site-logo";
import { SiteFooter } from "@/components/site-footer";
import { formatDateTH, formatTHB } from "@/lib/format";
import { ConfidenceBadge, PricePositionBar, SpecRow, ptDotClass } from "@/components/badges";

import {
  ADAS_FEATURES,
  BRANDS,
  HILUX_MAX,
  HILUX_MIN,
  HILUX_SKUS,
  NAMEPLATES,
  PRICE_HISTORY,
  sourcesFor,
  TIMELINE,
  TOTALS,
  skuByKey,
} from "../../_kit/data";
import { FilterExplorer } from "./filter-explorer";
import { FilterSkuTable } from "./filter-sku-table";
import { ProtoLink, protoHref } from "./kit";

/* หัวเว็บของทิศนี้ — บาง เครื่องมืออยู่ครบในแถวเดียว ไม่มีพื้นที่ต้อนรับ */
function ToolNavbar({ thin }: { thin: boolean }) {
  return (
    <header className="sticky top-0 z-40 h-14 border-b border-border bg-background">
      <div className="mx-auto flex h-14 w-full max-w-[1240px] items-center gap-3 px-4 sm:px-6">
        <ProtoLink dir="filter" screen="home" thin={thin} className="shrink-0">
          <SiteLogo />
        </ProtoLink>
        <label className="relative hidden min-w-0 flex-1 sm:block">
          <span className="sr-only">ค้นหารุ่นรถหรือรุ่นย่อย</span>
          <span aria-hidden className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-faint">
            ⌕
          </span>
          <input
            type="search"
            placeholder="ค้นหารุ่นรถหรือรุ่นย่อย เช่น Hilux Travo, Overland Plus, bZ4X AWD"
            className="w-full rounded-full border border-border bg-surface-muted py-2 pr-4 pl-9 text-sm outline-none placeholder:text-faint focus:border-accent focus:bg-background"
          />
        </label>
        <nav className="ml-auto flex items-center gap-1 text-sm sm:ml-0">
          <span className="rounded-full px-3 py-1.5 text-muted">แบรนด์</span>
          <span className="hidden rounded-full px-3 py-1.5 text-muted sm:inline">จัดอันดับ</span>
          <span className="rounded-full bg-accent-soft px-3 py-1.5 font-medium text-accent">เทียบรุ่น</span>
        </nav>
      </div>
    </header>
  );
}

/* ───────────────────────────── หน้าแรก ───────────────────────────── */

const SEO_PAGES = [
  "กระบะ 4 ประตู ราคาไม่เกิน 1 ล้าน",
  "รถไฟฟ้าในไทย ทุกรุ่น",
  "PPV 7 ที่นั่ง",
  "ซีดานไฮบริด",
  "กระบะขับสี่ (4WD)",
  "รถราคาไม่เกิน 8 แสน",
];

export function FilterHome({ thin }: { thin: boolean }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ToolNavbar thin={thin} />
      <main className="flex-1">
        {/* ไม่มี hero — บรรทัดเดียวบอกว่านี่คืออะไร แล้วเข้าข้อมูลทันที */}
        <div className="mx-auto w-full max-w-[1240px] px-4 pt-5 pb-3 sm:px-6">
          <h1 className="text-[22px] font-bold tracking-tight sm:text-[26px]">
            ฐานข้อมูลรถยนต์ในไทย — ราคาป้ายทางการทุกรุ่นย่อย
          </h1>
          <p className="mt-1 text-sm text-muted">
            {TOTALS.nameplates} รุ่น · {TOTALS.variants} รุ่นย่อย · {TOTALS.brands} แบรนด์ ·
            ทุกตัวเลขผูกแหล่งอ้างอิงพร้อมวันที่ตรวจ
          </p>
        </div>

        <FilterExplorer thin={thin} />

        {/* หน้ารวมยอดนิยม = ทางเข้าจาก Google (ทุกอันเป็นหน้าจริง ไม่ใช่ตัวกรองที่หายไปกับหน้าจอ) */}
        <section className="border-t border-border">
          <div className="mx-auto w-full max-w-[1240px] px-4 py-10 sm:px-6">
            <h2 className="text-lg font-bold">หน้ารวมที่คนค้นบ่อย</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {SEO_PAGES.map((s) => (
                <li key={s}>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-3.5 py-1.5 text-sm text-muted">
                    {s}
                    <span aria-hidden className="text-faint">
                      ›
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            <h2 className="mt-8 text-lg font-bold">ทุกรุ่นในฐานข้อมูล แยกตามแบรนด์</h2>
            <div className="mt-3 grid gap-6 sm:grid-cols-3">
              {BRANDS.map((b) => (
                <div key={b.slug}>
                  <p className="text-sm font-semibold">
                    {b.name}
                    <span className="ml-1.5 font-normal text-faint tnum">({b.nameplateCount})</span>
                  </p>
                  <ul className="mt-1.5 space-y-1 text-sm">
                    {NAMEPLATES.filter((n) => n.brandSlug === b.slug).map((n) => (
                      <li key={n.slug}>
                        <ProtoLink dir="filter" screen="model" thin={thin} className="text-muted hover:text-accent">
                          ราคา {n.brand} {n.name} ทุกรุ่นย่อย
                        </ProtoLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <p className="mt-8 max-w-3xl text-[13px] leading-6 text-faint">
              ราคาที่แสดงคือราคาป้ายทางการจากผู้ผลิต ไม่ใช่ราคาซื้อขายจริงหรือราคาหลังโปรโมชัน ·
              ข้อมูลตรวจล่าสุด {formatDateTH(TOTALS.latestChecked)} · ค่าที่ยังไม่มีหลักฐานจะเขียนว่า
              “ไม่มีข้อมูล” ไม่เดาและไม่ใส่ 0
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

/* ───────────────────────────── หน้ารุ่น ───────────────────────────── */

export function FilterModel({ thin }: { thin: boolean }) {
  const np = NAMEPLATES.find((n) => n.slug === (thin ? "model-3" : "hilux-travo"))!;
  const sources = sourcesFor(np.slug);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ToolNavbar thin={thin} />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-[1240px] px-4 pb-16 sm:px-6">
          <nav className="pt-4 text-[13px] text-faint">
            <ProtoLink dir="filter" screen="home" thin={thin} className="hover:text-foreground">
              ฐานข้อมูลรถ
            </ProtoLink>
            <span aria-hidden> › </span>
            {np.brand}
            <span aria-hidden> › </span>
            <span className="text-foreground">{np.name}</span>
          </nav>

          {/* หัวหน้ารุ่นแบบ "แถบสรุป" — ไม่กินพื้นที่ ข้อมูลจริงอยู่ในตารางข้างล่างทันที */}
          <header className="mt-3 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {np.brand} {np.name} — ราคาทุกรุ่นย่อย
              </h1>
              <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-muted">
                <span>{np.segmentLabel}</span>
                <span aria-hidden>·</span>
                <span className="tnum">{np.variantCount} รุ่นย่อย</span>
                <span aria-hidden>·</span>
                <span className="inline-flex items-center gap-1.5">
                  {np.powertrains.map((p) => (
                    <span key={p} className="inline-flex items-center gap-1">
                      <span aria-hidden className={`inline-block size-2 rounded-full ${ptDotClass(p)}`} />
                      {p}
                    </span>
                  ))}
                </span>
                <span aria-hidden>·</span>
                <span>
                  {np.launchYear != null ? `เปิดตัวในไทย ${np.launchYear}` : "ปีเปิดตัว: ไม่มีข้อมูล"}
                </span>
                <span aria-hidden>·</span>
                <span>ตรวจล่าสุด {formatDateTH(np.checkedDate)}</span>
              </p>
            </div>
            <div className="flex items-end gap-6">
              <div>
                <p className="text-[11px] text-faint">ช่วงราคาป้าย</p>
                <p className="text-xl font-bold tnum">
                  {np.priceMin != null && np.priceMax != null
                    ? `${formatTHB(np.priceMin)} – ${formatTHB(np.priceMax)}`
                    : "ไม่มีข้อมูล"}
                </p>
              </div>
              {np.image && (
                <Image
                  src={np.image}
                  alt={`${np.brand} ${np.name}`}
                  width={180}
                  height={100}
                  className="hidden h-auto w-[180px] object-contain sm:block"
                />
              )}
            </div>
          </header>

          {thin ? (
            <div className="mt-8 rounded-xl border border-dashed border-border bg-surface-muted/40 px-4 py-10 text-center">
              <p className="text-sm font-medium text-muted">
                หน้าลองเก็บรุ่นย่อยละเอียดไว้เฉพาะ Hilux Travo
              </p>
              <p className="mt-1 text-xs text-faint">
                ปิดสวิตช์ “ดูรุ่นที่ข้อมูลไม่ครบ” เพื่อดูตารางกรองรุ่นย่อยเต็ม 18 แถว
              </p>
            </div>
          ) : (
            <FilterSkuTable />
          )}

          <p className="mt-3 text-[13px] text-faint">
            Δ = ส่วนต่างจากรุ่นย่อยถูกสุด · ✓ = สเปกทางการระบุว่ามี · – = ระบุว่าไม่มี · ? = สเปกไม่ระบุ
            (ไม่ใช่ “ไม่มี”)
          </p>

          {/* เนื้อหารองอยู่ใต้ตาราง — ยังครบ แต่ไม่มาขวางทางคนที่มาดูราคา */}
          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            <section className="lg:col-span-2">
              <h2 className="text-lg font-bold">เกี่ยวกับรุ่นนี้</h2>
              <p className="mt-2 text-[15px] leading-7 text-muted">{np.summary}</p>
              <h3 className="mt-6 text-sm font-semibold">ไทม์ไลน์การเปลี่ยนแปลง</h3>
              <ol className="mt-2 space-y-2 text-sm">
                {(thin ? [] : TIMELINE).map((e) => (
                  <li key={e.date + e.text} className="flex gap-3 border-b border-border pb-2">
                    <span className="w-24 shrink-0 text-[13px] text-faint tnum">{formatDateTH(e.date)}</span>
                    <span className="min-w-0 flex-1">
                      <span className="mr-2 rounded bg-surface-muted px-1.5 py-0.5 text-[11px] text-muted">
                        {e.type}
                      </span>
                      {e.text}
                    </span>
                  </li>
                ))}
                {thin && <li className="text-sm text-faint">ยังไม่มีเหตุการณ์ที่ยืนยัน</li>}
              </ol>
            </section>
            <section>
              <h2 className="text-lg font-bold">แหล่งอ้างอิง</h2>
              <ul className="mt-2 space-y-2 text-sm">
                {sources.map((s) => (
                  <li key={s.id} className="border-b border-border pb-2">
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                      <span className="font-medium">{s.publisher}</span>{" "}
                      <span className="text-muted">{s.title} ↗</span>
                    </a>
                    <span className="mt-0.5 flex items-center gap-2 text-[11px] text-faint">
                      ตรวจ {formatDateTH(s.checkedDate)}
                      <ConfidenceBadge level={s.confidence} />
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

/* ─────────────────────────── หน้ารุ่นย่อย ─────────────────────────── */

export function FilterSku({ thin }: { thin: boolean }) {
  const v = skuByKey(thin ? "travo-e-double-4trex" : "double-4trex-2-8-overland-plus-at");
  const np = NAMEPLATES.find((n) => n.slug === "hilux-travo")!;
  const siblings = HILUX_SKUS.filter((s) => s.group === v.group);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ToolNavbar thin={thin} />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-[1240px] px-4 pb-16 sm:px-6">
          <nav className="pt-4 text-[13px] text-faint">
            <ProtoLink dir="filter" screen="home" thin={thin} className="hover:text-foreground">
              ฐานข้อมูลรถ
            </ProtoLink>
            <span aria-hidden> › </span>
            <ProtoLink dir="filter" screen="model" thin={thin} className="hover:text-foreground">
              {np.name}
            </ProtoLink>
            <span aria-hidden> › </span>
            <span className="text-foreground">{v.shortName}</span>
          </nav>

          <header className="mt-3 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-[28px]">{v.name}</h1>
              <p className="mt-1 flex flex-wrap items-center gap-x-2 text-[13px] text-muted">
                <span>{v.group}</span>
                <span aria-hidden>·</span>
                <span className="inline-flex items-center gap-1.5">
                  <span aria-hidden className={`inline-block size-2 rounded-full ${ptDotClass(v.powertrainText)}`} />
                  {v.powertrainText}
                </span>
                <span aria-hidden>·</span>
                <span>{v.transmission}</span>
                <span aria-hidden>·</span>
                <span>{v.drivetrain}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-faint">ราคาป้ายทางการ · ณ {formatDateTH(np.checkedDate)}</p>
              <p className="text-3xl font-bold tnum">{formatTHB(v.price!)}</p>
              <p className="mt-1 text-[12px] text-muted tnum">
                {v.price === HILUX_MIN ? "ถูกสุดในรุ่นนี้" : `+${formatTHB(v.price! - HILUX_MIN)} จากรุ่นถูกสุด`}
              </p>
            </div>
          </header>

          <div className="mt-4 max-w-md">
            <PricePositionBar min={HILUX_MIN} max={HILUX_MAX} value={v.price!} />
            <p className="mt-1 text-[11px] text-faint">ตำแหน่งราคาในรุ่นย่อยทั้ง 18 แบบของ {np.name}</p>
          </div>

          {/* สเปกชีตแน่น 3 คอลัมน์ — งานหลักของหน้านี้คือ "อ่านเทียบ" */}
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            <section>
              <h2 className="border-b border-border pb-2 text-sm font-bold">ขุมพลังและระบบส่งกำลัง</h2>
              <dl className="mt-1">
                <SpecRow label="ขุมพลัง">{v.powertrainText}</SpecRow>
                <SpecRow label="กำลังสูงสุด">
                  <span className="tnum">{v.powerText}</span>
                </SpecRow>
                <SpecRow label="เกียร์">{v.transmission}</SpecRow>
                <SpecRow label="ระบบขับเคลื่อน">{v.drivetrain}</SpecRow>
                <SpecRow label="ที่นั่ง">
                  <span className="tnum">{v.seats}</span>
                </SpecRow>
              </dl>
            </section>

            <section>
              <h2 className="border-b border-border pb-2 text-sm font-bold">ระบบช่วยขับขี่</h2>
              <dl className="mt-1">
                {ADAS_FEATURES.map((f) => {
                  const has = v.adas[f.key.toLowerCase() as "aeb" | "acc" | "lka"];
                  return (
                    <SpecRow key={f.key} label={f.nameTh}>
                      <span
                        className={
                          has === true ? "text-success" : has === false ? "text-faint" : "text-warning"
                        }
                      >
                        {has === true ? "มี" : has === false ? "ไม่มี" : "สเปกไม่ระบุ"}
                      </span>
                    </SpecRow>
                  );
                })}
              </dl>
              <p className="mt-2 text-[12px] text-faint">
                “สเปกไม่ระบุ” ไม่เท่ากับ “ไม่มี” — เราไม่เดาแทนเอกสารทางการ
              </p>
            </section>

            <section>
              <h2 className="border-b border-border pb-2 text-sm font-bold">ประวัติราคา (ไม่เขียนทับ)</h2>
              <table className="mt-1 w-full text-sm">
                <tbody>
                  {PRICE_HISTORY.map((h) => (
                    <tr key={h.date} className="border-b border-border">
                      <td className="py-2 text-[13px] text-faint tnum">{formatDateTH(h.date)}</td>
                      <td className="py-2 text-right font-semibold tnum">{formatTHB(v.price ?? h.amount)}</td>
                      <td className="py-2 pl-3 text-right">
                        <ConfidenceBadge level={h.confidence} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <a
                href={PRICE_HISTORY[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs text-accent hover:underline"
              >
                {PRICE_HISTORY[0].publisher} — เปิดหน้าต้นทาง ↗
              </a>
            </section>
          </div>

          {/* รุ่นย่อยข้างเคียง — เทียบต่อได้โดยไม่ต้องย้อนกลับ */}
          <section className="mt-10">
            <h2 className="text-lg font-bold">รุ่นย่อยตัวถังเดียวกัน ({v.group})</h2>
            <div className="mt-3 overflow-x-auto rounded-2xl border border-border">
              <table className="w-full min-w-[560px] text-sm">
                <tbody>
                  {siblings.map((s) => (
                    <tr
                      key={s.key}
                      className={`group relative border-b border-border last:border-b-0 ${
                        s.key === v.key ? "bg-accent-soft" : "hover:bg-surface-muted"
                      }`}
                    >
                      <td className="py-2 pr-3 pl-4 font-medium">
                        <a
                          href={protoHref("filter", "sku", thin)}
                          className="after:absolute after:inset-0 group-hover:text-accent"
                        >
                          {s.shortName}
                        </a>
                      </td>
                      <td className="px-3 py-2 text-[13px] text-muted">
                        {s.transmission} · {s.drivetrain}
                      </td>
                      <td className="px-3 py-2 text-right font-semibold tnum">{formatTHB(s.price!)}</td>
                      <td className="px-3 py-2 text-right text-[13px] text-muted tnum">
                        {s.price === v.price ? "รุ่นนี้" : `${s.price! > v.price! ? "+" : "−"}${formatTHB(Math.abs(s.price! - v.price!))}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
