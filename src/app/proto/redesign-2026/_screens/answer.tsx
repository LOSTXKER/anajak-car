// ── ทิศ B "ถามแล้วตอบ" ────────────────────────────────────────────────────
// วิธีคิด: คนเปิดเว็บรถมีคำถามในหัวอยู่แล้ว ("ตัวท็อปเท่าไร" "งบเท่านี้ได้รุ่นไหน")
// หน้าเว็บจึงเริ่มที่คำถาม แล้วตอบเป็นประโยคก่อน — ตารางเป็นหลักฐานที่ตามมาทีหลัง
// ทุกคำตอบคำนวณสดจากข้อมูลในฐาน (ไม่มีตัวเลขที่พิมพ์มือ) และเลี่ยงคำตัดสินแบบ "รุ่นนี้ดีที่สุด"
import Image from "next/image";

import { SiteLogo } from "@/components/site-logo";
import { SiteFooter } from "@/components/site-footer";
import { formatDateTH, formatTHB } from "@/lib/format";
import { ConfidenceBadge, PricePositionBar, SpecRow, ptDotClass } from "@/components/badges";

import {
  ADAS_FEATURES,
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
import { AnswerSearch } from "./answer-search";
import { ProtoLink, shortTHB } from "./kit";

function TopBar({ thin }: { thin: boolean }) {
  return (
    <header className="sticky top-0 z-40 h-14 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
        <ProtoLink dir="answer" screen="home" thin={thin}>
          <SiteLogo />
        </ProtoLink>
        <nav className="flex items-center gap-1 text-sm">
          <span className="rounded-full px-3 py-1.5 text-muted">รุ่นรถทั้งหมด</span>
          <span className="rounded-full px-3 py-1.5 text-muted">แบรนด์</span>
          <span className="hidden rounded-full bg-accent-soft px-3 py-1.5 font-medium text-accent sm:inline">
            ถามใหม่
          </span>
        </nav>
      </div>
    </header>
  );
}

/* ── คำตอบที่คำนวณจากข้อมูลจริง (ไม่ใช่เลขพิมพ์มือ) ── */
const under900k = HILUX_SKUS.filter((s) => (s.price ?? Infinity) <= 900000);
const adasConfirmed = HILUX_SKUS.filter((s) => s.adas.aeb === true);
const cheapest = HILUX_SKUS.reduce((a, b) => ((a.price ?? Infinity) < (b.price ?? Infinity) ? a : b));
const dearest = HILUX_SKUS.reduce((a, b) => ((a.price ?? 0) > (b.price ?? 0) ? a : b));
const cheapestEv = NAMEPLATES.filter((n) => n.powertrains.includes("EV")).reduce((a, b) =>
  (a.priceMin ?? Infinity) < (b.priceMin ?? Infinity) ? a : b,
);

const QUESTIONS: { q: string; a: string; screen: "model" | "sku" | "home" }[] = [
  {
    q: `กระบะงบไม่เกิน ${shortTHB(900000)} มีรุ่นย่อยไหนบ้าง?`,
    a: `มี ${under900k.length} รุ่นย่อยใน Hilux Travo เริ่มที่ ${formatTHB(cheapest.price!)} (${cheapest.shortName})`,
    screen: "model",
  },
  {
    q: "รถไฟฟ้าที่ถูกที่สุดในฐานข้อมูลคือรุ่นไหน?",
    a: `${cheapestEv.brand} ${cheapestEv.name} — เริ่ม ${formatTHB(cheapestEv.priceMin!)} (${cheapestEv.variantCount} รุ่นย่อย)`,
    screen: "model",
  },
  {
    q: "Hilux Travo 18 รุ่นย่อย ต่างกันตรงไหน?",
    a: `ห่างกัน ${formatTHB(dearest.price! - cheapest.price!)} จากตัวถัง เกียร์ ระบบขับ และชุดช่วยขับขี่`,
    screen: "model",
  },
  {
    q: "รุ่นย่อยไหนยืนยันแล้วว่ามีเบรกฉุกเฉิน (AEB)?",
    a: `ยืนยันแล้ว ${adasConfirmed.length} จาก ${HILUX_SKUS.length} รุ่นย่อย — ที่เหลือสเปกทางการไม่ระบุ`,
    screen: "sku",
  },
  {
    q: "ราคาชุดนี้ตรวจล่าสุดเมื่อไหร่?",
    a: `ตรวจกับหน้าทางการเมื่อ ${formatDateTH(TOTALS.latestChecked)} · เก็บประวัติแบบไม่เขียนทับ`,
    screen: "sku",
  },
  {
    q: "ฐานข้อมูลตอนนี้มีอะไรบ้าง?",
    a: `${TOTALS.nameplates} รุ่น · ${TOTALS.variants} รุ่นย่อย · ${TOTALS.brands} แบรนด์ (Toyota · Tesla · Mercedes-Benz)`,
    screen: "home",
  },
];

/* ───────────────────────────── หน้าแรก ───────────────────────────── */

export function AnswerHome({ thin }: { thin: boolean }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopBar thin={thin} />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
          <section className="pt-12 pb-8 text-center sm:pt-16">
            <h1 className="text-3xl font-bold tracking-tight sm:text-[40px]">
              อยากรู้อะไรเรื่องรถ <span className="text-accent">ถามตรงนี้</span>
            </h1>
            <p className="mx-auto mt-2 max-w-xl text-[15px] text-muted">
              พิมพ์ชื่อรุ่นหรือเกรด แล้วเห็นราคาป้ายทางการทันที — ลึกถึงรุ่นย่อย พร้อมวันที่ตรวจและแหล่งอ้างอิง
            </p>
            <div className="mt-7">
              <AnswerSearch thin={thin} />
            </div>
          </section>

          <section className="pb-12">
            <h2 className="text-sm font-semibold text-faint">คำถามที่คนถามบ่อย</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {QUESTIONS.map((item) => (
                <ProtoLink
                  key={item.q}
                  dir="answer"
                  screen={item.screen}
                  thin={thin}
                  className="group flex flex-col rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-accent hover:bg-accent-soft/40"
                >
                  <span className="text-[15px] font-semibold group-hover:text-accent">{item.q}</span>
                  <span className="mt-1.5 text-sm text-muted">{item.a}</span>
                  <span className="mt-3 text-[12px] text-accent">ดูคำตอบเต็ม ›</span>
                </ProtoLink>
              ))}
            </div>
          </section>

          <section className="border-t border-border py-10">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              {[
                { k: "รุ่นในระบบ", v: TOTALS.nameplates },
                { k: "รุ่นย่อย", v: TOTALS.variants },
                { k: "แบรนด์", v: TOTALS.brands },
              ].map((s) => (
                <div key={s.k}>
                  <p className="text-2xl font-bold tnum">{s.v}</p>
                  <p className="text-[12px] text-faint">{s.k}</p>
                </div>
              ))}
              <p className="ml-auto max-w-sm text-[13px] text-faint">
                ทุกตัวเลขผูกแหล่งอ้างอิงพร้อมวันที่ตรวจ · ค่าที่ยังไม่มีหลักฐานเขียนว่า “ไม่มีข้อมูล”
                ไม่เดาและไม่ใส่ 0
              </p>
            </div>

            <h2 className="mt-8 text-sm font-semibold text-faint">ทุกรุ่นในฐานข้อมูล</h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {NAMEPLATES.map((n) => (
                <li key={n.slug}>
                  <ProtoLink
                    dir="answer"
                    screen="model"
                    thin={thin}
                    className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-surface-muted"
                  >
                    {n.image ? (
                      <Image
                        src={n.image}
                        alt=""
                        width={48}
                        height={28}
                        className="h-7 w-12 shrink-0 rounded object-contain"
                      />
                    ) : (
                      <span aria-hidden className="h-7 w-12 shrink-0 rounded bg-surface-muted" />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {n.brand} {n.name}
                      </span>
                      <span className="block text-[12px] text-faint tnum">
                        {n.priceMin != null ? `เริ่ม ${formatTHB(n.priceMin)}` : "ไม่มีข้อมูลราคา"}
                      </span>
                    </span>
                  </ProtoLink>
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

/* ───────────────────────────── หน้ารุ่น ───────────────────────────── */

export function AnswerModel({ thin }: { thin: boolean }) {
  const np = NAMEPLATES.find((n) => n.slug === (thin ? "model-3" : "hilux-travo"))!;
  // แหล่งอ้างอิงต้องเป็นของรุ่นที่เปิดอยู่จริง — Model 3 อ้างสื่อไทย ไม่ใช่หน้า Toyota
  const sources = sourcesFor(np.slug);
  const full = !thin;
  const bodies = new Set(HILUX_SKUS.map((s) => s.group));

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopBar thin={thin} />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6">
          <nav className="pt-4 text-[13px] text-faint">
            <ProtoLink dir="answer" screen="home" thin={thin} className="hover:text-foreground">
              หน้าแรก
            </ProtoLink>
            <span aria-hidden> › </span>
            <span className="text-foreground">
              {np.brand} {np.name}
            </span>
          </nav>

          <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            {np.brand} {np.name} ราคาเท่าไหร่?
          </h1>

          {/* กล่องคำตอบ — ตอบเป็นประโยคก่อน แล้วค่อยกางหลักฐาน */}
          <section className="mt-4 overflow-hidden rounded-2xl border border-accent/30 bg-accent-soft/40">
            <div className="flex flex-wrap items-start justify-between gap-4 p-5">
              <div className="min-w-0">
                <p className="text-[13px] font-semibold tracking-wide text-accent">คำตอบสั้น</p>
                <p className="mt-1 text-[17px] leading-8 font-medium">
                  {np.priceMin != null && np.priceMax != null ? (
                    <>
                      ราคาป้ายทางการ{" "}
                      <span className="font-bold tnum">{formatTHB(np.priceMin)}</span> ถึง{" "}
                      <span className="font-bold tnum">{formatTHB(np.priceMax)}</span> — มีให้เลือก{" "}
                      <span className="tnum">{np.variantCount}</span> รุ่นย่อย
                      {full ? <> ใน {bodies.size} แบบตัวถัง</> : null}
                    </>
                  ) : (
                    <>ยังไม่มีราคาที่ยืนยันของรุ่นนี้ในระบบ</>
                  )}
                </p>
                <ul className="mt-3 space-y-1.5 text-sm text-muted">
                  {full ? (
                    <>
                      <li>
                        • ถูกสุด <span className="font-medium text-foreground">{cheapest.shortName}</span>{" "}
                        <span className="tnum">{formatTHB(cheapest.price!)}</span> · แพงสุด{" "}
                        <span className="font-medium text-foreground">{dearest.shortName}</span>{" "}
                        <span className="tnum">{formatTHB(dearest.price!)}</span> (ห่างกัน{" "}
                        <span className="tnum">{formatTHB(dearest.price! - cheapest.price!)}</span>)
                      </li>
                      <li>
                        • งบไม่เกิน <span className="tnum">{formatTHB(900000)}</span> เลือกได้{" "}
                        <span className="tnum">{under900k.length}</span> รุ่นย่อย
                      </li>
                      <li>
                        • เบรกฉุกเฉิน (AEB) ยืนยันแล้ว{" "}
                        <span className="tnum">{adasConfirmed.length}</span> รุ่นย่อย — ที่เหลือสเปกทางการไม่ระบุ
                        จึงยังไม่สรุปว่า “ไม่มี”
                      </li>
                      <li>• ตรวจกับหน้าทางการล่าสุด {formatDateTH(np.checkedDate)}</li>
                    </>
                  ) : (
                    <>
                      <li>• ปีเปิดตัวในไทย: ยังไม่มีหลักฐานทางการ จึงไม่บันทึก</li>
                      <li>• ยังไม่มีรูปของรุ่นนี้ (ต้องได้สิทธิ์ใช้ภาพจากผู้ผลิตก่อน)</li>
                      <li>• ราคามาจากที่สื่อยานยนต์ไทยรายงานตรงกัน ไม่ใช่หน้าทางการโดยตรง</li>
                    </>
                  )}
                </ul>
              </div>
              {np.image && (
                <Image
                  src={np.image}
                  alt={`${np.brand} ${np.name}`}
                  width={260}
                  height={150}
                  className="hidden h-auto w-[260px] object-contain drop-shadow-md sm:block"
                />
              )}
            </div>
            <p className="border-t border-accent/20 bg-background/60 px-5 py-2 text-[12px] text-muted">
              ราคาป้ายทางการ ไม่ใช่ราคาซื้อขายจริง ·{" "}
              <a
                href={sources[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                ที่มา: {sources[0].publisher} ↗
              </a>{" "}
              <ConfidenceBadge level={sources[0].confidence} />
            </p>
          </section>

          {/* หลักฐาน: ตารางรุ่นย่อยแบบพับได้ตามตัวถัง — เปิดกลุ่มที่คนดูบ่อยไว้ */}
          {full && (
            <section className="mt-8">
              <h2 className="text-lg font-bold">ตารางรุ่นย่อยทั้งหมด (หลักฐานของคำตอบด้านบน)</h2>
              <div className="mt-3 space-y-2">
                {HILUX_GROUPS.map((g) => {
                  const rows = HILUX_SKUS.filter((s) => s.group === g);
                  const gmin = Math.min(...rows.map((r) => r.price ?? Infinity));
                  return (
                    <details key={g} open={g === "Travo Double Cab"} className="rounded-xl border border-border">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
                        <span className="font-medium">{g}</span>
                        <span className="text-[13px] text-muted tnum">
                          {rows.length} รุ่นย่อย · เริ่ม {formatTHB(gmin)}
                        </span>
                      </summary>
                      <div className="border-t border-border">
                        {rows.map((v) => (
                          <ProtoLink
                            key={v.key}
                            dir="answer"
                            screen="sku"
                            thin={thin}
                            className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5 text-sm last:border-b-0 hover:bg-accent-soft"
                          >
                            <span className="min-w-0">
                              <span className="block font-medium">{v.shortName}</span>
                              <span className="block text-[12px] text-faint">
                                <span aria-hidden className={`mr-1.5 inline-block size-1.5 rounded-full ${ptDotClass(v.powertrainText)}`} />
                                {v.powertrainText} · {v.transmission} · {v.drivetrain} ·{" "}
                                {v.adas.aeb === true ? "มี AEB" : v.adas.aeb === false ? "ไม่มี AEB" : "AEB ไม่ระบุ"}
                              </span>
                            </span>
                            <span className="shrink-0 text-right">
                              <span className="block font-semibold tnum">{formatTHB(v.price!)}</span>
                              <span className="block text-[11px] text-faint tnum">
                                {v.price === HILUX_MIN ? "ถูกสุด" : `+${formatTHB(v.price! - HILUX_MIN)}`}
                              </span>
                            </span>
                          </ProtoLink>
                        ))}
                      </div>
                    </details>
                  );
                })}
              </div>
            </section>
          )}

          {/* คำถามย่อยของรุ่นนี้ — เป็นทั้ง UX และตัวที่ Google หยิบไปโชว์เป็น FAQ */}
          <section className="mt-10">
            <h2 className="text-lg font-bold">คำถามอื่นเกี่ยวกับรุ่นนี้</h2>
            <div className="mt-2 divide-y divide-border">
              {[
                {
                  q: `${np.name} รุ่นถูกสุดกับแพงสุดต่างกันเท่าไหร่?`,
                  a: full
                    ? `ต่างกัน ${formatTHB(dearest.price! - cheapest.price!)} — ${cheapest.shortName} ${formatTHB(cheapest.price!)} เทียบกับ ${dearest.shortName} ${formatTHB(dearest.price!)}`
                    : "ยังไม่ได้แตกรุ่นย่อยของรุ่นนี้ในหน้าลอง",
                },
                {
                  q: "ราคานี้รวมโปรโมชันหรือส่วนลดหรือยัง?",
                  a: "ไม่รวม — เป็นราคาป้ายทางการที่ผู้ผลิตประกาศ ราคาซื้อขายจริงขึ้นกับดีลเลอร์และช่วงเวลา",
                },
                {
                  q: "ข้อมูลนี้อัปเดตบ่อยแค่ไหน?",
                  a: `ตรวจซ้ำกับหน้าทางการเป็นรอบ ล่าสุด ${formatDateTH(np.checkedDate)} และเก็บประวัติราคาแบบไม่เขียนทับ`,
                },
              ].map((f) => (
                <details key={f.q} className="group py-3">
                  <summary className="flex cursor-pointer list-none items-center gap-3 text-[15px] font-medium">
                    <span className="text-accent" aria-hidden>
                      Q
                    </span>
                    <span className="flex-1">{f.q}</span>
                    <span aria-hidden className="text-faint group-open:rotate-180">
                      ⌄
                    </span>
                  </summary>
                  <p className="mt-2 pl-7 text-sm leading-6 text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          {full && (
            <section className="mt-10 grid gap-8 sm:grid-cols-2">
              <div>
                <h2 className="text-lg font-bold">ไทม์ไลน์</h2>
                <ol className="mt-2 space-y-2 text-sm">
                  {TIMELINE.map((e) => (
                    <li key={e.date + e.text} className="flex gap-3 border-b border-border pb-2">
                      <span className="w-24 shrink-0 text-[13px] text-faint tnum">{formatDateTH(e.date)}</span>
                      <span className="flex-1">{e.text}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <h2 className="text-lg font-bold">แหล่งอ้างอิง</h2>
                <ul className="mt-2 space-y-2 text-sm">
                  {sources.map((s) => (
                    <li key={s.id} className="border-b border-border pb-2">
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                        <span className="font-medium">{s.publisher}</span>{" "}
                        <span className="text-muted">{s.title} ↗</span>
                      </a>
                      <span className="mt-0.5 flex items-center gap-2 text-[11px] text-faint">
                        ตรวจ {formatDateTH(s.checkedDate)} <ConfidenceBadge level={s.confidence} />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

/* ─────────────────────────── หน้ารุ่นย่อย ─────────────────────────── */

export function AnswerSku({ thin }: { thin: boolean }) {
  const v = skuByKey(thin ? "travo-e-double-4trex" : "double-4trex-2-8-overland-plus-at");
  const np = NAMEPLATES.find((n) => n.slug === "hilux-travo")!;
  // รุ่นย่อยที่ราคาต่ำกว่าหนึ่งขั้น — ใช้ตอบว่า "จ่ายเพิ่มเท่านี้ ได้อะไรเพิ่ม"
  const cheaper = HILUX_SKUS.filter((s) => (s.price ?? 0) < (v.price ?? 0)).sort(
    (a, b) => (b.price ?? 0) - (a.price ?? 0),
  )[0];
  const gainedAdas = cheaper
    ? ADAS_FEATURES.filter(
        (f) =>
          v.adas[f.key.toLowerCase() as "aeb" | "acc" | "lka"] === true &&
          cheaper.adas[f.key.toLowerCase() as "aeb" | "acc" | "lka"] !== true,
      )
    : [];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopBar thin={thin} />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6">
          <nav className="pt-4 text-[13px] text-faint">
            <ProtoLink dir="answer" screen="home" thin={thin} className="hover:text-foreground">
              หน้าแรก
            </ProtoLink>
            <span aria-hidden> › </span>
            <ProtoLink dir="answer" screen="model" thin={thin} className="hover:text-foreground">
              {np.name}
            </ProtoLink>
            <span aria-hidden> › </span>
            <span className="text-foreground">{v.shortName}</span>
          </nav>

          <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-[28px]">{v.name} ราคาเท่าไหร่?</h1>

          <section className="mt-4 rounded-2xl border border-accent/30 bg-accent-soft/40 p-5">
            <p className="text-[13px] font-semibold tracking-wide text-accent">คำตอบสั้น</p>
            <p className="mt-1 text-[17px] leading-8 font-medium">
              ราคาป้ายทางการ <span className="text-2xl font-bold tnum">{formatTHB(v.price!)}</span> ·{" "}
              {v.powertrainText} {v.powerText} · {v.transmission} · {v.drivetrain} · {v.seats} ที่นั่ง
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-muted">
              {cheaper && (
                <li>
                  • จ่ายเพิ่ม{" "}
                  <span className="font-medium text-foreground tnum">
                    {formatTHB(v.price! - cheaper.price!)}
                  </span>{" "}
                  จาก {cheaper.shortName}{" "}
                  {gainedAdas.length > 0 ? (
                    <>
                      แล้วได้{" "}
                      <span className="text-foreground">
                        {gainedAdas.map((f) => f.key).join(" · ")}
                      </span>{" "}
                      เพิ่มตามสเปกทางการ
                    </>
                  ) : (
                    <>— ต่างกันที่ตัวถัง/ระบบขับเคลื่อน (ชุดช่วยขับขี่เท่ากันตามสเปก)</>
                  )}
                </li>
              )}
              <li>
                • ตำแหน่งราคาในรุ่นนี้:{" "}
                {v.price === HILUX_MAX ? (
                  <>แพงสุดของรุ่นนี้ — สูงกว่ารุ่นถูกสุด <span className="tnum">{formatTHB(v.price! - HILUX_MIN)}</span></>
                ) : v.price === HILUX_MIN ? (
                  <>ถูกสุดของรุ่นนี้ — ต่ำกว่ารุ่นแพงสุด <span className="tnum">{formatTHB(HILUX_MAX - v.price!)}</span></>
                ) : (
                  <>
                    สูงกว่ารุ่นถูกสุด <span className="tnum">{formatTHB(v.price! - HILUX_MIN)}</span> ·
                    ต่ำกว่ารุ่นแพงสุด <span className="tnum">{formatTHB(HILUX_MAX - v.price!)}</span>
                  </>
                )}
              </li>
              <li>
                • ระบบช่วยขับขี่:{" "}
                {ADAS_FEATURES.map((f) => {
                  const has = v.adas[f.key.toLowerCase() as "aeb" | "acc" | "lka"];
                  return `${f.key} ${has === true ? "มี" : has === false ? "ไม่มี" : "สเปกไม่ระบุ"}`;
                }).join(" · ")}
              </li>
              <li>• ตรวจกับหน้าทางการล่าสุด {formatDateTH(np.checkedDate)}</li>
            </ul>
            <div className="mt-4 max-w-md">
              <PricePositionBar min={HILUX_MIN} max={HILUX_MAX} value={v.price!} />
            </div>
          </section>

          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <section>
              <h2 className="border-b border-border pb-2 text-lg font-bold">สเปกเต็ม</h2>
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
                <SpecRow label="มิติตัวถัง">
                  <span className="text-faint">ไม่มีข้อมูล</span>
                </SpecRow>
              </dl>
            </section>
            <section>
              <h2 className="border-b border-border pb-2 text-lg font-bold">ประวัติราคา</h2>
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
              <p className="mt-2 text-[12px] text-faint">
                บันทึกแบบไม่เขียนทับ — ถ้าราคาขยับ จะเพิ่มแถวใหม่ ไม่ลบของเดิม
              </p>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
