// ── ทิศ "ปัจจุบัน" — เว็บวันนี้ (ตัวตั้งสำหรับเทียบ) ────────────────────────
// เลียนหน้าจริงตามโค้ดใน src/app/(home)/page.tsx · (app)/cars/[slug]/page.tsx · [sku]/page.tsx
// ชิ้นที่ import ของจริงมาตรงๆ: SiteHeader · SiteFooter · HeroHeadline · HeroSearch · NameplateTable
//   · SectionHeader/StatBar/TagCard · badges ทั้งชุด
// ต่างจากของจริงจุดเดียว: ลิงก์/การกดแถว ชี้กลับเข้าหน้าลอง (ไม่งั้นกดแล้วหลุดออกไปเว็บจริง)
import Image from "next/image";
import Link from "next/link";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroHeadline } from "@/components/hero-headline";
import { HeroSearch } from "@/components/hero-search";
import { BrandMark } from "@/components/brand-shortcuts";
import { SectionHeader, StatBar, TagCard } from "@/components/panel";
import {
  ConfidenceBadge,
  LifecycleBadge,
  PendingBlock,
  PowertrainDots,
  PricePositionBar,
  SpecRow,
  ptDotClass,
} from "@/components/badges";
import { formatDateTH, formatTHB } from "@/lib/format";

import {
  ADAS_FEATURES,
  BRANDS,
  HILUX_GROUPS,
  HILUX_MAX,
  HILUX_MIN,
  HILUX_SKUS,
  NAMEPLATES,
  PRICE_HISTORY,
  SOURCES,
  TIMELINE,
  TOTALS,
  UPCOMING_BRANDS,
  skuByKey,
  type ProtoNameplate,
} from "../../_kit/data";
import { ProtoLink, protoHref, type Screen } from "./kit";
import { CurrentTable } from "./current-table";

const FAQ = [
  {
    q: "ราคาบน CARMETA คือราคาอะไร?",
    a: "เป็น “ราคาป้ายทางการ” (ราคาประกาศของผู้ผลิต) ไม่ใช่ราคาซื้อขายจริงหรือราคาหลังโปรโมชัน — เราแยกชนิดราคาชัดเจนและไม่นำมาปนกัน",
  },
  {
    q: "ข้อมูลมาจากไหน เชื่อถือได้แค่ไหน?",
    a: "ทุกราคาอ้างอิงหน้าเว็บ/เอกสารทางการของผู้ผลิตเป็นหลัก และผ่านการตรวจซ้ำทีละรายการ ทุกตัวเลขแสดงแหล่งที่มา วันที่ตรวจสอบ และระดับความเชื่อมั่นกำกับเสมอ",
  },
  {
    q: "รุ่นย่อย (variant) ต่างจากรุ่นรถยังไง?",
    a: "รุ่นรถ (เช่น Hilux Travo) คือชื่อรุ่นที่ขายในไทย ส่วนรุ่นย่อยคือแบบที่ซื้อได้จริงแต่ละแบบ (เกรด/เครื่องยนต์/เกียร์/ขับเคลื่อน) ซึ่งราคาต่างกัน",
  },
];

/* ───────────────────────────── หน้าแรก ───────────────────────────── */

export function CurrentHome({ thin }: { thin: boolean }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <section className="pt-14 pb-10 text-center sm:pt-20">
            <p className="text-xs font-medium tracking-[0.22em] text-faint uppercase">
              Thailand Car Database
            </p>
            <HeroHeadline />
            <div className="mt-8">
              <HeroSearch />
            </div>
          </section>

          {/* โลโก้แบรนด์ = ทางลัดเข้าหน้าแบรนด์ */}
          <section aria-label="แบรนด์ใน coverage" className="pb-14">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {BRANDS.map((b) => (
                <span
                  key={b.slug}
                  className="flex h-16 w-28 flex-col items-center justify-center gap-1 rounded-2xl border border-border bg-surface"
                >
                  <BrandMark name={b.name} size={40} />
                  <span className="text-[11px] text-faint tnum">{b.nameplateCount} รุ่น</span>
                </span>
              ))}
              {UPCOMING_BRANDS.map((name) => (
                <span
                  key={name}
                  className="flex h-16 w-28 flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-border bg-surface-muted/40 opacity-60"
                >
                  <BrandMark name={name} size={36} />
                  <span className="text-[10px] text-faint">เร็วๆ นี้</span>
                </span>
              ))}
            </div>
          </section>

          <CurrentTable thin={thin} />

          {/* จุดยืนของผลิตภัณฑ์ */}
          <section className="border-t border-border py-14">
            <h2 className="text-center text-2xl font-semibold tracking-tight">
              ฐานข้อมูลรถที่<span className="text-accent">ต้องเช็กก่อนซื้อ</span>
            </h2>
            <div className="mt-10 grid gap-10 sm:grid-cols-3 sm:gap-8">
              {[
                {
                  t: "ทุกราคามีหลักฐาน",
                  d: `ราคาป้ายทางการ ${TOTALS.variants} รายการในระบบ อ้างอิงแหล่งทางการของผู้ผลิต เปิดดูต้นทางได้ทุกตัวเลข`,
                },
                {
                  t: "ลึกถึงระดับรุ่นย่อย",
                  d: `แยกโครงสร้างตั้งแต่รุ่น เจเนอเรชัน ตัวถัง จนถึงรุ่นย่อย ${TOTALS.variants} แบบ — เทียบแบบตรงตัว ไม่ปนคนละโฉม`,
                },
                {
                  t: "สดใหม่ ตรวจสอบได้",
                  d: `ทุกข้อมูลระบุวันที่ตรวจสอบ (ล่าสุด ${formatDateTH(TOTALS.latestChecked)}) และเก็บประวัติแบบไม่เขียนทับ`,
                },
              ].map((c) => (
                <div key={c.t}>
                  <div className="flex size-10 items-center justify-center rounded-full bg-accent-soft text-accent">
                    ✓
                  </div>
                  <h3 className="mt-4 text-[15px] font-semibold">{c.t}</h3>
                  <p className="mt-1.5 text-sm text-muted">{c.d}</p>
                </div>
              ))}
            </div>
          </section>

          {/* coverage + internal links (SEO) */}
          <section className="border-t border-border py-14">
            <h2 className="text-2xl font-semibold tracking-tight">Coverage ปัจจุบัน</h2>
            <p className="mt-3 max-w-3xl text-[15px] leading-7 text-muted">
              CARMETA เก็บข้อมูลเชิงลึกทีละแบรนด์ ครอบคลุมรถเก๋ง กระบะ PPV และรถไฟฟ้า รวม{" "}
              {TOTALS.nameplates} รุ่น {TOTALS.variants} รุ่นย่อยในระบบขณะนี้
            </p>
            <div className="mt-6 flex flex-col gap-6">
              {BRANDS.map((brand) => (
                <div key={brand.slug}>
                  <span className="text-sm font-medium">
                    {brand.name}
                    <span className="ml-1.5 font-normal text-faint">
                      ({brand.nameplateCount} รุ่นใน coverage)
                    </span>
                  </span>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {NAMEPLATES.filter((n) => n.brandSlug === brand.slug).map((n) => (
                      <li key={n.slug}>
                        <ProtoLink
                          dir="current"
                          screen="model"
                          thin={thin}
                          className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-3.5 py-1.5 text-sm transition-colors hover:bg-accent-soft hover:text-accent"
                        >
                          ราคา {n.brand} {n.name}
                          <span aria-hidden className="text-faint">
                            ›
                          </span>
                        </ProtoLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="border-t border-border py-14 pb-20">
            <h2 className="text-2xl font-semibold tracking-tight">คำถามที่พบบ่อย</h2>
            <div className="mt-4 max-w-3xl divide-y divide-border">
              {FAQ.map((item) => (
                <details key={item.q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center gap-3 text-[15px] font-medium">
                    <span className="text-accent" aria-hidden>
                      Q
                    </span>
                    <span className="flex-1">{item.q}</span>
                    <span aria-hidden className="text-faint group-open:rotate-180">
                      ⌄
                    </span>
                  </summary>
                  <p className="mt-2.5 pl-7 text-sm leading-6 text-muted">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

/* ───────────────────────────── หน้ารุ่น ───────────────────────────── */

/** รุ่นที่ใช้โชว์: ปกติ = Hilux Travo (ข้อมูลครบ) · สถานะขอบ = Tesla Model 3 (ไม่มีรูป/ไม่มีปีเปิดตัว) */
export function focusNameplate(thin: boolean): ProtoNameplate {
  return NAMEPLATES.find((n) => n.slug === (thin ? "model-3" : "hilux-travo"))!;
}

function Breadcrumb({ trail }: { trail: { label: string; screen?: Screen; thin?: boolean }[] }) {
  return (
    <nav aria-label="breadcrumb" className="pt-6 text-sm text-faint">
      <ol className="flex flex-wrap items-center gap-1.5">
        {trail.map((t, i) => (
          <li key={t.label} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden>›</span>}
            {t.screen ? (
              <Link
                href={protoHref("current", t.screen, Boolean(t.thin))}
                className="text-muted hover:text-foreground"
              >
                {t.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-foreground">
                {t.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function CurrentModel({ thin }: { thin: boolean }) {
  const np = focusNameplate(thin);
  const skus = thin ? [] : HILUX_SKUS;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
          <Breadcrumb
            trail={[
              { label: "ฐานข้อมูลรถ", screen: "home", thin },
              { label: np.brand, screen: "home", thin },
              { label: np.name },
            ]}
          />

          {/* hero banner — แท่งสีเฉียงหลังรูป */}
          <header className="relative mt-5 overflow-hidden rounded-2xl border border-border bg-background">
            <div
              aria-hidden
              className="absolute inset-y-0 right-0 hidden w-[46%] bg-accent-soft sm:block"
              style={{ clipPath: "polygon(22% 0, 100% 0, 100% 100%, 0 100%)" }}
            />
            <div className="relative grid gap-5 p-6 sm:grid-cols-[1fr_320px] sm:p-8">
              <div className="min-w-0">
                <p className="text-[13px] font-semibold tracking-[0.2em] text-accent uppercase">
                  {np.brand}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-3">
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{np.name}</h1>
                  <LifecycleBadge status={np.lifecycle} />
                </div>
                <p className="mt-2.5 text-sm text-muted">
                  {[
                    np.segmentLabel,
                    np.launchYear != null ? `เปิดตัวในไทย ${np.launchYear}` : "ปีเปิดตัวในไทย: ไม่มีข้อมูล",
                  ].join(" · ")}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {np.powertrains.map((p) => (
                    <span
                      key={p}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-[12px] font-medium"
                    >
                      <span aria-hidden className={`inline-block size-2 rounded-full ${ptDotClass(p)}`} />
                      {p}
                    </span>
                  ))}
                </div>
                <div className="mt-6 grid max-w-md grid-cols-3 gap-2.5">
                  <StatBar label="เริ่มต้น" value={np.priceMin != null ? formatTHB(np.priceMin) : "—"} />
                  <StatBar label="สูงสุด" value={np.priceMax != null ? formatTHB(np.priceMax) : "—"} />
                  <StatBar label="รุ่นย่อย" value={np.variantCount} />
                </div>
              </div>
              {np.image ? (
                <div className="relative flex items-center justify-center">
                  <Image
                    src={np.image}
                    alt={`${np.brand} ${np.name}`}
                    width={320}
                    height={180}
                    className="h-auto w-full max-w-[320px] object-contain drop-shadow-md"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <p className="max-w-[220px] text-center text-[12px] text-faint">
                    ยังไม่มีรูปของรุ่นนี้ (ต้องได้สิทธิ์ใช้ภาพจากผู้ผลิตก่อน)
                  </p>
                </div>
              )}
            </div>
          </header>

          {/* ตารางรุ่นย่อย — จัดกลุ่มตามตัวถัง แถวกดเข้าหน้ารุ่นย่อย */}
          <section className="mt-10">
            <SectionHeader
              title="รุ่นย่อยและราคา"
              sub={
                <>
                  <span className="tnum">{np.variantCount}</span> รุ่น · แตะแถวเพื่อดูสเปกเต็ม
                </>
              }
            />
            {skus.length === 0 ? (
              <div className="mt-4 max-w-xl">
                <PendingBlock
                  title="ยังไม่ได้แตกรุ่นย่อยของรุ่นนี้ในหน้าลอง"
                  reason="หน้าลองเก็บรุ่นย่อยละเอียดไว้เฉพาะ Hilux Travo — ปิดสวิตช์ “ข้อมูลไม่ครบ” เพื่อดูตารางเต็ม"
                />
              </div>
            ) : (
              <div className="mt-4 space-y-6">
                {HILUX_GROUPS.map((group) => {
                  const rows = skus.filter((s) => s.group === group);
                  if (rows.length === 0) return null;
                  const gmin = Math.min(...rows.map((r) => r.price ?? Infinity));
                  const gmax = Math.max(...rows.map((r) => r.price ?? 0));
                  return (
                    <div key={group} className="overflow-hidden rounded-2xl border border-border">
                      <div className="flex items-baseline justify-between gap-3 bg-accent-soft px-4 py-2.5">
                        <h3 className="text-sm font-semibold text-accent">{group}</h3>
                        <span className="text-xs text-accent/80 tnum">
                          {formatTHB(gmin)} – {formatTHB(gmax)}
                        </span>
                      </div>
                      {/* mobile: การ์ดต่อรุ่นย่อย */}
                      <div className="sm:hidden">
                        {rows.map((v) => (
                          <ProtoLink
                            key={v.key}
                            dir="current"
                            screen="sku"
                            thin={thin}
                            className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 last:border-b-0 active:bg-accent-soft"
                          >
                            <span className="min-w-0">
                              <span className="block font-medium">{v.shortName}</span>
                              <span className="mt-0.5 flex items-center gap-1.5 text-[12px] text-faint">
                                <span aria-hidden className={`inline-block size-1.5 rounded-full ${ptDotClass(v.powertrainText)}`} />
                                <span className="truncate">
                                  {v.powertrainText} · {v.powerText} · {v.drivetrain}
                                </span>
                              </span>
                            </span>
                            <span className="shrink-0 text-right">
                              <span className="block font-semibold tnum">{formatTHB(v.price!)}</span>
                              <span className="block text-[11px] tnum">
                                {v.price === HILUX_MIN ? (
                                  <span className="text-success">ถูกสุด</span>
                                ) : (
                                  <span className="text-faint">+{formatTHB(v.price! - HILUX_MIN)}</span>
                                )}
                              </span>
                            </span>
                          </ProtoLink>
                        ))}
                      </div>
                      {/* desktop: ตารางเต็ม */}
                      <div className="hidden overflow-x-auto sm:block">
                        <table className="w-full min-w-[720px] text-sm">
                          <thead>
                            <tr className="border-b border-border text-left text-[12px] text-faint">
                              <th className="py-2 pr-3 pl-4 font-medium">รุ่นย่อย</th>
                              <th className="px-3 py-2 font-medium">ขุมพลัง</th>
                              <th className="px-3 py-2 font-medium">กำลัง · เกียร์ · ขับ</th>
                              <th className="px-3 py-2 text-right font-medium">ราคาป้าย</th>
                              <th className="px-3 py-2 text-right font-medium">Δ ถูกสุด</th>
                              <th className="w-8 px-2 py-2" />
                            </tr>
                          </thead>
                          <tbody>
                            {rows.map((v, i) => (
                              <tr
                                key={v.key}
                                className={`group relative ${i % 2 === 1 ? "bg-surface-muted/35" : ""} transition-colors hover:bg-accent-soft`}
                              >
                                <td className="py-2.5 pr-3 pl-4 font-medium">
                                  <ProtoLink
                                    dir="current"
                                    screen="sku"
                                    thin={thin}
                                    className="after:absolute after:inset-0 group-hover:text-accent"
                                  >
                                    {v.shortName}
                                  </ProtoLink>
                                </td>
                                <td className="px-3 py-2.5">
                                  <span className="inline-flex items-center gap-1.5 text-muted">
                                    <span aria-hidden className={`inline-block size-2 rounded-full ${ptDotClass(v.powertrainText)}`} />
                                    {v.powertrainText}
                                  </span>
                                </td>
                                <td className="px-3 py-2.5 text-muted">
                                  {v.powerText} · {v.transmission} · {v.drivetrain}
                                </td>
                                <td className="px-3 py-2.5 text-right font-semibold tnum">
                                  {formatTHB(v.price!)}
                                </td>
                                <td className="px-3 py-2.5 text-right text-[13px] tnum">
                                  {v.price === HILUX_MIN ? (
                                    <span className="text-success">ถูกสุด</span>
                                  ) : (
                                    <span className="text-muted">+{formatTHB(v.price! - HILUX_MIN)}</span>
                                  )}
                                </td>
                                <td className="px-2 py-2.5 text-faint group-hover:text-accent" aria-hidden>
                                  ›
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <p className="mt-3 text-[13px] text-faint">
              ราคาป้ายทางการ ไม่ใช่ราคาซื้อขายจริง · Δ = ส่วนต่างจากรุ่นย่อยถูกสุดของรุ่นนี้ · ตรวจสอบล่าสุด{" "}
              <span className="tnum">{formatDateTH(np.checkedDate)}</span>
            </p>
          </section>

          {/* เกี่ยวกับรุ่น + ไทม์ไลน์ */}
          <div className="mt-12 grid gap-10 lg:grid-cols-2">
            <section>
              <SectionHeader title={`เกี่ยวกับ ${np.name}`} />
              <p className="mt-3 text-[15px] leading-7 text-muted">{np.summary}</p>
            </section>
            <section>
              <SectionHeader title="ไทม์ไลน์การเปลี่ยนแปลง" />
              {thin ? (
                <div className="mt-3">
                  <PendingBlock
                    title="ยังไม่มีเหตุการณ์ที่ยืนยันของรุ่นนี้"
                    reason="ยังไม่พบประกาศทางการที่ระบุวันที่ชัดเจน"
                  />
                </div>
              ) : (
                <ol className="mt-3 space-y-3">
                  {TIMELINE.map((e) => (
                    <li key={e.date + e.text} className="flex gap-3 border-b border-border pb-3 last:border-b-0">
                      <span className="w-24 shrink-0 text-[13px] text-faint tnum">
                        {formatDateTH(e.date)}
                      </span>
                      <span className="min-w-0 flex-1 text-sm">
                        <span className="mr-2 rounded-full bg-surface-muted px-2 py-0.5 text-[11px] text-muted">
                          {e.type}
                        </span>
                        {e.text}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

/* ─────────────────────────── หน้ารุ่นย่อย ─────────────────────────── */

export function CurrentSku({ thin }: { thin: boolean }) {
  // สถานะขอบ = รุ่นไฟฟ้า Travo-e (มีราคา แต่ ADAS ยังไม่ยืนยันสักข้อ)
  const v = skuByKey(thin ? "travo-e-double-4trex" : "double-4trex-2-8-overland-plus-at");
  const np = NAMEPLATES.find((n) => n.slug === "hilux-travo")!;
  const siblings = HILUX_SKUS.filter((s) => s.group === v.group);
  const idx = siblings.findIndex((s) => s.key === v.key);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
          <Breadcrumb
            trail={[
              { label: "ฐานข้อมูลรถ", screen: "home", thin },
              { label: np.brand, screen: "home", thin },
              { label: np.name, screen: "model", thin },
              { label: v.shortName },
            ]}
          />

          <header className="relative mt-5 overflow-hidden rounded-2xl border border-border bg-background">
            <div
              aria-hidden
              className="absolute inset-y-0 right-0 hidden w-[38%] bg-accent-soft sm:block"
              style={{ clipPath: "polygon(24% 0, 100% 0, 100% 100%, 0 100%)" }}
            />
            <div className="relative p-6 sm:p-8">
              <p className="text-[13px] font-semibold tracking-[0.2em] text-accent uppercase">
                {np.brand} {np.name}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{v.name}</h1>
                <LifecycleBadge status={np.lifecycle} />
              </div>
              <p className="mt-2 flex flex-wrap items-center gap-x-2 text-sm text-muted">
                <span>{v.group}</span>
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
                    sub={`ณ ${formatDateTH(np.checkedDate)}`}
                  />
                </div>
                {v.price != null && (
                  <div className="w-full max-w-xs pb-1">
                    <PricePositionBar min={HILUX_MIN} max={HILUX_MAX} value={v.price} />
                    <p className="mt-1 text-[11px] text-faint">
                      ตำแหน่งราคาในรุ่นย่อยทั้งหมดของ {np.name}
                    </p>
                  </div>
                )}
              </div>

              {/* สลับรุ่นย่อยพี่น้อง */}
              <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-border pt-4 text-sm">
                <span className="text-faint">‹ ก่อนหน้า</span>
                <span className="tnum text-muted">
                  {idx + 1}/{siblings.length}
                </span>
                <span className="text-faint">ถัดไป ›</span>
                <ProtoLink dir="current" screen="model" thin={thin} className="ml-auto text-accent hover:underline">
                  กลับตารางรุ่นย่อยทั้งหมด
                </ProtoLink>
              </div>
            </div>
          </header>

          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            <section>
              <SectionHeader title="สเปก" />
              <dl className="mt-3">
                <SpecRow label="ขุมพลัง">{v.powertrainText}</SpecRow>
                <SpecRow label="กำลัง">
                  <span className="tnum">{v.powerText}</span>
                </SpecRow>
                <SpecRow label="เกียร์">{v.transmission}</SpecRow>
                <SpecRow label="ระบบขับเคลื่อน">{v.drivetrain}</SpecRow>
                <SpecRow label="ที่นั่ง">
                  <span className="tnum">{v.seats}</span>
                </SpecRow>
                <SpecRow label="มิติตัวถัง (ก×ย×ส)">
                  <span className="text-faint">ไม่มีข้อมูล</span>
                </SpecRow>
              </dl>
            </section>

            <section>
              <SectionHeader title="ระบบช่วยขับขี่" />
              <div className="mt-3 space-y-2.5">
                {ADAS_FEATURES.map((f) => {
                  const has = v.adas[f.key.toLowerCase() as "aeb" | "acc" | "lka"];
                  return (
                    <TagCard
                      key={f.key}
                      tag={has === true ? "มี" : has === false ? "ไม่มี" : "ยังไม่ยืนยัน"}
                      tone={has === true ? "success" : has === false ? "muted" : "faint"}
                      title={
                        <>
                          {f.nameTh} <span className="font-normal text-faint">({f.key})</span>
                        </>
                      }
                    >
                      {has === true ? f.marketing : undefined}
                    </TagCard>
                  );
                })}
                <p className="pt-1 text-[13px] text-faint">
                  ตามตารางสเปกทางการ — สเปกไม่ระบุ = “ยังไม่ยืนยัน” (ไม่ใช่ “ไม่มี”)
                </p>
              </div>
            </section>
          </div>

          <section className="mt-12">
            <SectionHeader title="ประวัติราคา" sub="append-only — บันทึกทุกครั้งที่พบ ไม่เขียนทับอดีต" />
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
                  {PRICE_HISTORY.map((h) => (
                    <tr key={h.date} className="border-b border-border last:border-b-0">
                      <td className="py-2.5 pr-3 tnum">{formatDateTH(h.date)}</td>
                      <td className="px-3 py-2.5 text-right font-semibold tnum">
                        {formatTHB(v.price ?? h.amount)}
                      </td>
                      <td className="px-3 py-2.5">
                        <a
                          href={h.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-accent hover:underline"
                        >
                          {h.publisher} ↗
                        </a>
                      </td>
                      <td className="px-3 py-2.5">
                        <ConfidenceBadge level={h.confidence} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-[13px] text-faint">ราคาป้ายทางการ ไม่ใช่ราคาซื้อขายจริง</p>
          </section>

          <section className="mt-12">
            <SectionHeader
              title="แหล่งอ้างอิง"
              sub={
                <>
                  <span className="tnum">{SOURCES.length}</span> แหล่ง — ของ {np.brand} {np.name}
                </>
              }
            />
            <ul className="mt-2 max-w-3xl divide-y divide-border">
              {SOURCES.map((s) => (
                <li key={s.id} className="flex flex-wrap items-center gap-2 py-3 text-sm">
                  <span className="font-medium">{s.publisher}</span>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-accent hover:underline"
                  >
                    {s.title} ↗
                  </a>
                  <span className="ml-auto text-xs text-faint tnum">
                    ตรวจ {formatDateTH(s.checkedDate)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

/** ใช้ในหน้าอื่นเพื่อบอกจำนวนขุมพลังของรุ่น (เลี่ยง import PowertrainDots ซ้ำ) */
export { PowertrainDots };
