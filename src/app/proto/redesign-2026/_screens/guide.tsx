// ── ทิศ C "คู่มือรถ" ──────────────────────────────────────────────────────
// วิธีคิด: ทำให้ CARMETA เป็น "คู่มือรถไทยที่เปิดค้างไว้ได้" แบบเว็บคู่มือเกม —
// สารบัญอยู่ซ้ายตลอดทั้งเว็บ (ไม่ต้องย้อนหน้าแรก) · หน้าเนื้อหาแน่นและมีลำดับ ·
// หัวหน้ามีภาพและแถบสีจัดจ้านเพื่อให้จำหน้าได้ · ใช้ภาษา UI เดิมของเว็บ (SectionHeader/StatBar/TagCard) เต็มที่
import Image from "next/image";

import { SiteLogo } from "@/components/site-logo";
import { SiteFooter } from "@/components/site-footer";
import { SectionHeader, StatBar, TagCard } from "@/components/panel";
import { ConfidenceBadge, PricePositionBar, SpecRow, ptDotClass } from "@/components/badges";
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
  sourcesFor,
  TIMELINE,
  TOTALS,
  skuByKey,
} from "../../_kit/data";
import { ProtoLink, shortTHB } from "./kit";

/* หัวเว็บ + สารบัญซ้าย (อยู่ทุกหน้าในทิศนี้) */
function GuideShell({
  thin,
  active,
  children,
}: {
  thin: boolean;
  active: "home" | "model" | "sku";
  children: React.ReactNode;
}) {
  const groups: { title: string; items: { label: string; note?: string; on?: boolean }[] }[] = [
    {
      title: "เริ่มที่นี่",
      items: [
        { label: "หน้าแรกคู่มือ", on: active === "home" },
        { label: "อ่านข้อมูลบนเว็บนี้ยังไง" },
        { label: "ราคาป้าย ≠ ราคาซื้อขายจริง" },
      ],
    },
    {
      title: "แบรนด์",
      items: BRANDS.map((b) => ({ label: b.name, note: `${b.nameplateCount} รุ่น` })),
    },
    {
      title: "ประเภทรถ",
      items: [
        { label: "กระบะ", note: "1 รุ่น" },
        { label: "PPV", note: "1 รุ่น" },
        { label: "SUV", note: "3 รุ่น" },
        { label: "ซีดาน", note: "7 รุ่น" },
      ],
    },
    {
      title: "ช่วงราคา",
      items: [
        { label: `ไม่เกิน ${shortTHB(800000)}` },
        { label: `${shortTHB(800000)} – ${shortTHB(1500000)}` },
        { label: `${shortTHB(1500000)} ขึ้นไป` },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 h-14 border-b border-border bg-background">
        <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
          <ProtoLink dir="guide" screen="home" thin={thin} className="shrink-0">
            <SiteLogo />
          </ProtoLink>
          <span className="hidden text-[13px] text-faint sm:inline">คู่มือรถยนต์ไทย</span>
          <label className="relative ml-auto w-full max-w-xs">
            <span className="sr-only">ค้นหาในคู่มือ</span>
            <span aria-hidden className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-faint">
              ⌕
            </span>
            <input
              type="search"
              placeholder="ค้นหาในคู่มือ…"
              className="w-full rounded-full border border-border bg-surface-muted py-1.5 pr-3 pl-9 text-sm outline-none placeholder:text-faint focus:border-accent focus:bg-background"
            />
          </label>
        </div>
      </header>

      <div className="flex flex-1">
        {/* สารบัญซ้าย — อยู่กับที่ทุกหน้า (desktop) */}
        <aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] w-60 shrink-0 overflow-y-auto border-r border-border px-3 py-4 lg:block">
          {groups.map((g) => (
            <div key={g.title} className="mb-5">
              <p className="px-3 pb-1.5 text-[11px] font-semibold tracking-[0.14em] text-faint uppercase">
                {g.title}
              </p>
              <ul className="flex flex-col gap-0.5">
                {g.items.map((it) => (
                  <li key={it.label}>
                    <span
                      className={`flex items-center justify-between gap-2 rounded-lg px-3 py-1.5 text-sm ${
                        it.on ? "bg-accent-soft font-medium text-accent" : "text-muted"
                      }`}
                    >
                      <span className="truncate">{it.label}</span>
                      {it.note && <span className="shrink-0 text-[11px] text-faint tnum">{it.note}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </div>
    </div>
  );
}

/** สารบัญ "ในหน้านี้" ด้านขวา — หน้าคู่มือยาว ต้องกระโดดได้ */
function OnThisPage({ items }: { items: string[] }) {
  return (
    <aside className="hidden w-52 shrink-0 xl:block">
      <div className="sticky top-20">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-faint uppercase">ในหน้านี้</p>
        <ul className="mt-2 space-y-1.5 border-l border-border pl-3 text-[13px]">
          {items.map((i, idx) => (
            <li key={i} className={idx === 0 ? "font-medium text-accent" : "text-muted"}>
              {i}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

/* ───────────────────────────── หน้าแรก ───────────────────────────── */

export function GuideHome({ thin }: { thin: boolean }) {
  const featured = NAMEPLATES.filter((n) => n.image).slice(0, 3);
  const rows = thin ? [] : NAMEPLATES;

  return (
    <GuideShell thin={thin} active="home">
      <div className="mx-auto w-full max-w-[1100px] px-4 pb-16 sm:px-6">
        {/* แบนเนอร์หัวคู่มือ — แถบสีเฉียง + รูปรถ (จำหน้าได้ทันที) */}
        <section className="relative mt-5 overflow-hidden rounded-2xl border border-border bg-background">
          <div
            aria-hidden
            className="absolute inset-y-0 right-0 hidden w-[52%] bg-accent-soft sm:block"
            style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0 100%)" }}
          />
          <div
            aria-hidden
            className="absolute inset-y-0 right-0 hidden w-[16%] bg-accent/15 sm:block"
            style={{ clipPath: "polygon(52% 0, 100% 0, 100% 100%, 0 100%)" }}
          />
          <div className="relative grid gap-5 p-6 sm:grid-cols-[1fr_320px] sm:p-8">
            <div className="min-w-0">
              <p className="text-[13px] font-semibold tracking-[0.2em] text-accent uppercase">
                Thailand Car Database
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-[40px]">
                คู่มือรถยนต์ไทย ฉบับตรวจสอบได้
              </h1>
              <p className="mt-2 max-w-lg text-[15px] leading-7 text-muted">
                ราคาป้ายทางการ สเปก และรุ่นย่อยทุกแบบ — เรียงเป็นคู่มืออ่านต่อเนื่อง
                ทุกตัวเลขบอกที่มาและวันที่ตรวจ
              </p>
              <div className="mt-5 grid max-w-lg grid-cols-2 gap-2.5 sm:grid-cols-3">
                <StatBar label="รุ่นในระบบ" value={TOTALS.nameplates} />
                <StatBar label="รุ่นย่อย" value={TOTALS.variants} />
                {/* วันที่ยาวกว่าตัวเลข — ย่อลงอีกขั้นไม่งั้นตกสามบรรทัดบนมือถือ */}
                <StatBar
                  label="ตรวจล่าสุด"
                  value={<span className="text-base">{formatDateTH(TOTALS.latestChecked)}</span>}
                />
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <Image
                src="/cars/hilux-travo.webp"
                alt="Toyota Hilux Travo"
                width={320}
                height={180}
                priority
                className="h-auto w-full max-w-[320px] object-contain drop-shadow-md"
              />
            </div>
          </div>
        </section>

        {/* ทางเข้าหลัก 3 ใบ — คู่มือต้องบอกว่า "เริ่มอ่านตรงไหน" */}
        <section className="mt-10">
          <SectionHeader title="เริ่มอ่านจากตรงนี้" />
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {featured.map((n) => (
              <ProtoLink
                key={n.slug}
                dir="guide"
                screen="model"
                thin={thin}
                className="group overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-accent"
              >
                <span className="flex h-28 items-center justify-center bg-surface-muted/60">
                  <Image
                    src={n.image!}
                    alt=""
                    width={200}
                    height={112}
                    className="h-auto w-[200px] object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </span>
                <span className="block px-4 py-3">
                  <span className="block text-[15px] font-semibold group-hover:text-accent">
                    {n.brand} {n.name}
                  </span>
                  <span className="mt-0.5 block text-[12px] text-faint">
                    {n.segmentLabel} · {n.variantCount} รุ่นย่อย ·{" "}
                    <span className="tnum">
                      {n.priceMin != null ? `เริ่ม ${formatTHB(n.priceMin)}` : "ไม่มีข้อมูลราคา"}
                    </span>
                  </span>
                </span>
              </ProtoLink>
            ))}
          </div>
        </section>

        {/* สารบัญรุ่นทั้งหมด */}
        <section className="mt-10">
          <SectionHeader
            title="สารบัญรุ่นรถทั้งหมด"
            sub={
              <>
                <span className="tnum">{rows.length}</span> รุ่น · เรียงตามแบรนด์
              </>
            }
          />
          {rows.length === 0 ? (
            <p className="mt-4 rounded-xl border border-dashed border-border bg-surface-muted/40 px-4 py-10 text-center text-sm text-muted">
              สถานะขอบ: ยังไม่มีรุ่นที่ตรงหมวดที่เลือก — คู่มือจะบอกตรงๆ ว่ายังไม่มี ไม่แสดงหน้าว่างเปล่า
            </p>
          ) : (
            <div className="mt-4 space-y-5">
              {BRANDS.map((b) => (
                <div key={b.slug} className="overflow-hidden rounded-2xl border border-border">
                  <div className="flex items-baseline justify-between bg-accent-soft px-4 py-2.5">
                    <h3 className="text-sm font-semibold text-accent">{b.name}</h3>
                    <span className="text-xs text-accent/80 tnum">{b.nameplateCount} รุ่น</span>
                  </div>
                  <ul>
                    {rows
                      .filter((n) => n.brandSlug === b.slug)
                      .map((n, i) => (
                        <li key={n.slug} className={i % 2 ? "bg-surface-muted/30" : ""}>
                          <ProtoLink
                            dir="guide"
                            screen="model"
                            thin={thin}
                            className="flex items-center gap-3 border-b border-border px-4 py-2.5 text-sm last:border-b-0 hover:bg-accent-soft"
                          >
                            <span className="min-w-0 flex-1">
                              <span className="font-medium">{n.name}</span>
                              <span className="ml-2 text-[12px] text-faint">
                                <span aria-hidden className={`mr-1.5 inline-block size-1.5 rounded-full ${ptDotClass(n.powertrains[0])}`} />
                                {n.segmentLabel} · {n.powertrains.join("/")}
                              </span>
                            </span>
                            <span className="shrink-0 text-right text-[13px] tnum">
                              {n.priceMin != null && n.priceMax != null ? (
                                <>
                                  {formatTHB(n.priceMin)} – {formatTHB(n.priceMax)}
                                </>
                              ) : (
                                <span className="text-faint">ไม่มีข้อมูล</span>
                              )}
                            </span>
                            <span className="w-16 shrink-0 text-right text-[12px] text-faint tnum">
                              {n.variantCount} ย่อย
                            </span>
                          </ProtoLink>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-10">
          <SectionHeader title="อ่านข้อมูลบนคู่มือนี้ยังไง" />
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <TagCard tag="ราคา" tone="accent" title="ราคาป้ายทางการเท่านั้น">
              ไม่ใช่ราคาซื้อขายจริงหรือราคาหลังโปรฯ
            </TagCard>
            <TagCard tag="หลักฐาน" tone="success" title="ทุกตัวเลขมีที่มา">
              เปิดลิงก์ต้นทางได้ พร้อมวันที่ตรวจและระดับความเชื่อมั่น
            </TagCard>
            <TagCard tag="ช่องว่าง" tone="faint" title="ไม่มีข้อมูล = เขียนว่าไม่มี">
              ไม่เดา ไม่ใส่ 0 แทนค่าที่ยังไม่ยืนยัน
            </TagCard>
          </div>
        </section>
      </div>
    </GuideShell>
  );
}

/* ───────────────────────────── หน้ารุ่น ───────────────────────────── */

export function GuideModel({ thin }: { thin: boolean }) {
  const np = NAMEPLATES.find((n) => n.slug === (thin ? "model-3" : "hilux-travo"))!;
  const sources = sourcesFor(np.slug);
  const full = !thin;

  return (
    <GuideShell thin={thin} active="model">
      <div className="mx-auto flex w-full max-w-[1180px] gap-8 px-4 pb-16 sm:px-6">
        <div className="min-w-0 flex-1">
          <nav className="pt-4 text-[13px] text-faint">
            <ProtoLink dir="guide" screen="home" thin={thin} className="hover:text-foreground">
              คู่มือ
            </ProtoLink>
            <span aria-hidden> › </span>
            {np.brand}
            <span aria-hidden> › </span>
            <span className="text-foreground">{np.name}</span>
          </nav>

          <header className="relative mt-3 overflow-hidden rounded-2xl border border-border bg-background">
            <div
              aria-hidden
              className="absolute inset-y-0 right-0 hidden w-[46%] bg-accent-soft sm:block"
              style={{ clipPath: "polygon(22% 0, 100% 0, 100% 100%, 0 100%)" }}
            />
            <div className="relative grid gap-5 p-6 sm:grid-cols-[1fr_300px] sm:p-8">
              <div className="min-w-0">
                <p className="text-[13px] font-semibold tracking-[0.2em] text-accent uppercase">
                  {np.brand}
                </p>
                <h1 className="mt-1 text-4xl font-bold tracking-tight sm:text-5xl">{np.name}</h1>
                <p className="mt-2 text-sm text-muted">
                  {np.segmentLabel} ·{" "}
                  {np.launchYear != null ? `เปิดตัวในไทย ${np.launchYear}` : "ปีเปิดตัว: ไม่มีข้อมูล"}
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
                {/* ราคาเต็มยาวกว่าช่อง 1 ใน 3 ของจอมือถือ — มือถือจึงวาง 2 คอลัมน์ก่อน แล้วค่อยเป็น 3 บนจอกว้าง */}
                <div className="mt-6 grid max-w-md grid-cols-2 gap-2.5 sm:grid-cols-3">
                  <StatBar
                    label="เริ่มต้น"
                    value={<span className="text-base">{np.priceMin != null ? formatTHB(np.priceMin) : "—"}</span>}
                  />
                  <StatBar
                    label="สูงสุด"
                    value={<span className="text-base">{np.priceMax != null ? formatTHB(np.priceMax) : "—"}</span>}
                  />
                  <StatBar label="รุ่นย่อย" value={np.variantCount} />
                </div>
              </div>
              {np.image ? (
                <div className="flex items-center justify-center">
                  <Image
                    src={np.image}
                    alt={`${np.brand} ${np.name}`}
                    width={300}
                    height={170}
                    className="h-auto w-full max-w-[300px] object-contain drop-shadow-md"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <p className="max-w-[200px] text-center text-[12px] text-faint">
                    ยังไม่มีรูปของรุ่นนี้ — คู่มือเว้นที่ไว้ ไม่ใส่ภาพแทนมั่ว
                  </p>
                </div>
              )}
            </div>
          </header>

          <section className="mt-10">
            <SectionHeader title="ภาพรวมรุ่นนี้" />
            <p className="mt-3 text-[15px] leading-8 text-muted">{np.summary}</p>
          </section>

          <section className="mt-10">
            <SectionHeader
              title="รุ่นย่อยและราคา"
              sub={
                <>
                  <span className="tnum">{np.variantCount}</span> รุ่น · แตะแถวเพื่อดูสเปกเต็ม
                </>
              }
            />
            {full ? (
              <div className="mt-4 space-y-5">
                {HILUX_GROUPS.map((g) => {
                  const rows = HILUX_SKUS.filter((s) => s.group === g);
                  const gmin = Math.min(...rows.map((r) => r.price ?? Infinity));
                  const gmax = Math.max(...rows.map((r) => r.price ?? 0));
                  return (
                    <div key={g} className="overflow-hidden rounded-2xl border border-border">
                      <div className="flex items-baseline justify-between bg-accent-soft px-4 py-2.5">
                        <h3 className="text-sm font-semibold text-accent">{g}</h3>
                        <span className="text-xs text-accent/80 tnum">
                          {formatTHB(gmin)} – {formatTHB(gmax)}
                        </span>
                      </div>
                      {rows.map((v, i) => (
                        <ProtoLink
                          key={v.key}
                          dir="guide"
                          screen="sku"
                          thin={thin}
                          className={`flex items-center gap-3 border-b border-border px-4 py-2.5 text-sm last:border-b-0 hover:bg-accent-soft ${i % 2 ? "bg-surface-muted/30" : ""}`}
                        >
                          <span className="min-w-0 flex-1">
                            <span className="font-medium">{v.shortName}</span>
                            <span className="mt-0.5 block text-[12px] text-faint">
                              {v.powertrainText} · {v.powerText} · {v.transmission} · {v.drivetrain}
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
                  );
                })}
              </div>
            ) : (
              <p className="mt-4 rounded-xl border border-dashed border-border bg-surface-muted/40 px-4 py-10 text-center text-sm text-muted">
                หน้าลองเก็บรุ่นย่อยละเอียดไว้เฉพาะ Hilux Travo
              </p>
            )}
          </section>

          <section className="mt-10">
            <SectionHeader title="ไทม์ไลน์การเปลี่ยนแปลง" />
            <ol className="mt-4 space-y-3">
              {(full ? TIMELINE : []).map((e) => (
                <li key={e.date + e.text} className="flex gap-4">
                  <span className="w-24 shrink-0 pt-0.5 text-[13px] text-faint tnum">
                    {formatDateTH(e.date)}
                  </span>
                  <span className="relative flex-1 border-l border-border pb-3 pl-4">
                    <span aria-hidden className="absolute top-1.5 -left-[5px] size-2.5 rounded-full bg-accent" />
                    <span className="mr-2 rounded-full bg-surface-muted px-2 py-0.5 text-[11px] text-muted">
                      {e.type}
                    </span>
                    <span className="text-sm">{e.text}</span>
                  </span>
                </li>
              ))}
              {!full && <li className="text-sm text-faint">ยังไม่มีเหตุการณ์ที่ยืนยันของรุ่นนี้</li>}
            </ol>
          </section>

          <section className="mt-10">
            <SectionHeader
              title="แหล่งอ้างอิง"
              sub={
                <>
                  <span className="tnum">{sources.length}</span> แหล่ง
                </>
              }
            />
            <ul className="mt-2 divide-y divide-border">
              {sources.map((s) => (
                <li key={s.id} className="flex flex-wrap items-center gap-2 py-3 text-sm">
                  <span className="font-medium">{s.publisher}</span>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent">
                    {s.title} ↗
                  </a>
                  <span className="ml-auto flex items-center gap-2 text-xs text-faint tnum">
                    ตรวจ {formatDateTH(s.checkedDate)}
                    <ConfidenceBadge level={s.confidence} />
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <OnThisPage items={["ภาพรวมรุ่นนี้", "รุ่นย่อยและราคา", "ไทม์ไลน์การเปลี่ยนแปลง", "แหล่งอ้างอิง"]} />
      </div>
    </GuideShell>
  );
}

/* ─────────────────────────── หน้ารุ่นย่อย ─────────────────────────── */

export function GuideSku({ thin }: { thin: boolean }) {
  const v = skuByKey(thin ? "travo-e-double-4trex" : "double-4trex-2-8-overland-plus-at");
  const np = NAMEPLATES.find((n) => n.slug === "hilux-travo")!;
  const siblings = HILUX_SKUS.filter((s) => s.group === v.group);
  const idx = siblings.findIndex((s) => s.key === v.key);

  return (
    <GuideShell thin={thin} active="sku">
      <div className="mx-auto flex w-full max-w-[1180px] gap-8 px-4 pb-16 sm:px-6">
        <div className="min-w-0 flex-1">
          <nav className="pt-4 text-[13px] text-faint">
            <ProtoLink dir="guide" screen="home" thin={thin} className="hover:text-foreground">
              คู่มือ
            </ProtoLink>
            <span aria-hidden> › </span>
            <ProtoLink dir="guide" screen="model" thin={thin} className="hover:text-foreground">
              {np.name}
            </ProtoLink>
            <span aria-hidden> › </span>
            <span className="text-foreground">{v.shortName}</span>
          </nav>

          <header className="relative mt-3 overflow-hidden rounded-2xl border border-border bg-background">
            <div
              aria-hidden
              className="absolute inset-y-0 right-0 hidden w-[38%] bg-accent-soft sm:block"
              style={{ clipPath: "polygon(24% 0, 100% 0, 100% 100%, 0 100%)" }}
            />
            <div className="relative p-6 sm:p-8">
              <p className="text-[13px] font-semibold tracking-[0.2em] text-accent uppercase">
                {np.brand} {np.name}
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{v.name}</h1>
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
                    value={formatTHB(v.price!)}
                    sub={`ณ ${formatDateTH(np.checkedDate)}`}
                  />
                </div>
                <div className="w-full max-w-xs pb-1">
                  <PricePositionBar min={HILUX_MIN} max={HILUX_MAX} value={v.price!} />
                  <p className="mt-1 text-[11px] text-faint">ตำแหน่งราคาในรุ่นย่อยทั้งหมดของ {np.name}</p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-4 text-sm">
                <span className="text-faint">‹ ก่อนหน้า</span>
                <span className="tnum text-muted">
                  {idx + 1}/{siblings.length} ใน {v.group}
                </span>
                <span className="text-faint">ถัดไป ›</span>
                <ProtoLink dir="guide" screen="model" thin={thin} className="ml-auto text-accent hover:underline">
                  กลับสารบัญรุ่นย่อย
                </ProtoLink>
              </div>
            </div>
          </header>

          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            <section>
              <SectionHeader title="สเปก" />
              <dl className="mt-3">
                <SpecRow label="ขุมพลัง">{v.powertrainText}</SpecRow>
                <SpecRow label="กำลังสูงสุด">
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
              </div>
            </section>
          </div>

          <section className="mt-12">
            <SectionHeader title="ประวัติราคา" sub="append-only — ไม่เขียนทับอดีต" />
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
          </section>
        </div>

        <OnThisPage items={["สเปก", "ระบบช่วยขับขี่", "ประวัติราคา"]} />
      </div>
    </GuideShell>
  );
}
