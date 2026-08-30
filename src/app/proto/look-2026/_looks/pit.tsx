// ── E · PIT — หน้าตาคู่มือเกม (ฟีล prydwen ฉบับกลางคืน) ────────────────────
// บุคลิก: มืดน้ำเงินอมม่วง · รถถูกนำเสนอเป็น "การ์ด" ที่จำหน้าได้ · สารบัญเกาะซ้ายทุกหน้า
// ต่างจาก META ตรงที่: META ให้ตัวเลขดิบเป็นพระเอก · PIT ให้ภาพ+การ์ด+การจัดกลุ่มเป็นพระเอก
import Image from "next/image";

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
  TIMELINE,
  TOTALS,
  skuByKey,
  sourcesFor,
} from "../../_kit/data";
import { AdasMark, LookLink, PtDot, ptColor, shortTHB } from "./kit";

const LOOK = "pit" as const;

function Shell({
  thin,
  active,
  children,
}: {
  thin: boolean;
  active: "home" | "model" | "sku";
  children: React.ReactNode;
}) {
  return (
    <div className="look look-pit">
      <header className="lk-bar sticky top-0 z-40">
        <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
          <LookLink look={LOOK} screen="home" thin={thin} className="flex items-center gap-2">
            <span
              aria-hidden
              className="grid size-8 place-items-center rounded-xl text-[14px] font-bold text-white"
              style={{ background: "linear-gradient(135deg, var(--lk-accent), var(--lk-cyan))" }}
            >
              C
            </span>
            <span className="text-[15px] font-bold">CARMETA</span>
          </LookLink>
          <span className="lk-faint hidden text-[12px] sm:inline">คู่มือรถยนต์ไทย</span>
          <label className="relative ml-auto w-full max-w-[260px]">
            <span className="sr-only">ค้นหา</span>
            <span aria-hidden className="lk-faint pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
              ⌕
            </span>
            <input className="lk-input w-full rounded-full py-1.5 pr-3 pl-8 text-[13px] outline-none" placeholder="ค้นหารุ่น / เกรด" />
          </label>
        </div>
      </header>

      <div className="flex">
        <aside className="lk-line sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 overflow-y-auto border-r px-3 py-4 lg:block">
          {[
            {
              t: "เริ่มที่นี่",
              items: [
                { l: "หน้าแรก", on: active === "home" },
                { l: "อ่านข้อมูลยังไง" },
                { l: "ราคาป้าย ≠ ราคาซื้อขาย" },
              ],
            },
            { t: "แบรนด์", items: BRANDS.map((b) => ({ l: `${b.name} (${b.nameplateCount})` })) },
            {
              t: "ประเภทรถ",
              items: [{ l: "กระบะ" }, { l: "PPV" }, { l: "SUV" }, { l: "ซีดาน" }],
            },
          ].map((g) => (
            <div key={g.t} className="mb-5">
              <p className="lk-faint px-2 pb-1.5 text-[11px] font-semibold tracking-[0.14em] uppercase">{g.t}</p>
              <ul className="space-y-0.5">
                {g.items.map((it) => (
                  <li key={it.l}>
                    <span
                      className={`block truncate rounded-lg px-2.5 py-1.5 text-[13px] ${
                        "on" in it && it.on ? "lk-soft-bg lk-accent font-semibold" : "lk-muted"
                      }`}
                    >
                      {it.l}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>

        <div className="min-w-0 flex-1">
          {children}
          <footer className="lk-line mt-10 border-t">
            <p className="lk-faint px-4 py-6 text-[12px] leading-6 sm:px-6">
              ราคาป้ายทางการจากผู้ผลิต ไม่ใช่ราคาซื้อขายจริง · ค่าที่ยังไม่มีหลักฐานเขียนว่า “ไม่มีข้อมูล”
              · ตรวจล่าสุด {formatDateTH(TOTALS.latestChecked)}
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

/** การ์ดรุ่น — พระเอกของ look นี้ (ภาพ + แถบสีตามขุมพลัง + ราคาเริ่ม) */
function ModelCard({ n, thin }: { n: (typeof NAMEPLATES)[number]; thin: boolean }) {
  return (
    <LookLink
      look={LOOK}
      screen="model"
      thin={thin}
      className="lk-panel group overflow-hidden rounded-2xl transition-transform hover:-translate-y-0.5"
    >
      <span
        aria-hidden
        className="block h-1"
        style={{ background: `linear-gradient(90deg, ${ptColor(n.powertrains[0])}, transparent)` }}
      />
      <span
        className="flex h-28 items-center justify-center"
        style={{ background: "radial-gradient(90% 120% at 50% 20%, var(--lk-accent-soft), transparent 70%)" }}
      >
        {n.image ? (
          <Image src={n.image} alt="" width={190} height={106} className="h-auto w-[190px] object-contain transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <span className="lk-faint text-[12px]">ยังไม่มีรูป (รอสิทธิ์ใช้ภาพ)</span>
        )}
      </span>
      <span className="block px-4 pt-3 pb-4">
        <span className="lk-faint block text-[11px] tracking-[0.14em] uppercase">{n.brand}</span>
        <span className="mt-0.5 block text-[16px] font-bold">{n.name}</span>
        <span className="lk-muted mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px]">
          <span className="lk-soft-bg lk-accent rounded-full px-2 py-0.5 font-medium">{n.segmentLabel}</span>
          {n.powertrains.map((p) => (
            <PtDot key={p} label={p} />
          ))}
        </span>
        <span className="lk-line mt-3 flex items-end justify-between gap-2 border-t pt-2.5">
          <span>
            <span className="lk-faint block text-[11px]">เริ่มต้น</span>
            <span className="block text-[17px] font-bold tnum">
              {n.priceMin != null ? formatTHB(n.priceMin) : "ไม่มีข้อมูล"}
            </span>
          </span>
          <span className="lk-faint text-right text-[11px] tnum">
            ถึง {n.priceMax != null ? shortTHB(n.priceMax) : "—"}
            <br />
            {n.variantCount} รุ่นย่อย
          </span>
        </span>
      </span>
    </LookLink>
  );
}

/* ─────────────────────────── หน้าแรก ─────────────────────────── */

export function PitHome({ thin }: { thin: boolean }) {
  const rows = thin ? [] : NAMEPLATES;

  return (
    <Shell thin={thin} active="home">
      <main className="mx-auto max-w-[1120px] px-4 pt-6 sm:px-6">
        <section
          className="relative overflow-hidden rounded-3xl p-6 sm:p-8"
          style={{ background: "linear-gradient(120deg, var(--lk-panel-2) 0%, var(--lk-panel) 55%, var(--lk-bg) 100%)" }}
        >
          <div className="relative z-10 max-w-xl">
            <span className="lk-tag rounded-full">ฐานข้อมูลรถยนต์ไทย</span>
            <h1 className="mt-3 text-[30px] leading-tight font-bold sm:text-[38px]">
              เลือกรถให้จบ <span className="lk-accent">ที่หน้าเดียว</span>
            </h1>
            <p className="lk-muted mt-2 text-[14px] leading-7">
              ราคาป้ายทางการ สเปก และรุ่นย่อยทุกแบบ จัดเป็นการ์ดให้เทียบง่าย —
              ทุกตัวเลขบอกที่มาและวันที่ตรวจ
            </p>
            <div className="mt-5 flex flex-wrap gap-4">
              {[
                { k: "รุ่น", v: TOTALS.nameplates },
                { k: "รุ่นย่อย", v: TOTALS.variants },
                { k: "แบรนด์", v: TOTALS.brands },
              ].map((s) => (
                <div key={s.k}>
                  <p className="text-2xl font-bold tnum">{s.v}</p>
                  <p className="lk-faint text-[11px]">{s.k}</p>
                </div>
              ))}
            </div>
          </div>
          <Image
            src="/cars/hilux-travo.webp"
            alt=""
            width={360}
            height={200}
            priority
            className="pointer-events-none absolute -right-6 bottom-0 hidden h-auto w-[360px] object-contain opacity-90 sm:block"
          />
        </section>

        {/* หมวดแบบชิป (แพตเทิร์นคู่มือเกม: เลือกหมวดก่อน แล้วค่อยดูการ์ด) */}
        <div className="mt-7 flex flex-wrap items-center gap-2">
          {["ทั้งหมด", "กระบะ", "PPV", "SUV", "ซีดาน", "EV เท่านั้น"].map((t, i) => (
            <span
              key={t}
              className={`rounded-full px-3.5 py-1.5 text-[13px] ${i === 0 ? "lk-accent-bg font-semibold" : "lk-muted lk-panel"}`}
            >
              {t}
            </span>
          ))}
          <span className="lk-faint ml-auto text-[12px] tnum">{rows.length} รุ่น</span>
        </div>

        {rows.length === 0 ? (
          <p className="lk-panel lk-muted mt-4 rounded-2xl px-6 py-16 text-center text-[13px]">
            ยังไม่มีรุ่นที่ตรงหมวดนี้ — คู่มือจะบอกตรงๆ ว่ายังไม่มี ไม่แสดงการ์ดเปล่า
          </p>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((n) => (
              <ModelCard key={n.slug} n={n} thin={thin} />
            ))}
          </div>
        )}

        {/* แถวอัปเดตล่าสุด — ให้คนที่ตามข้อมูลรู้ว่ามีอะไรขยับ */}
        <section className="mt-10">
          <h2 className="text-[16px] font-bold">อัปเดตล่าสุดในฐานข้อมูล</h2>
          <div className="lk-panel mt-3 rounded-2xl">
            {TIMELINE.map((e) => (
              <div key={e.date + e.text} className="lk-line flex flex-wrap items-center gap-3 border-b px-4 py-3 text-[13px] last:border-b-0">
                <span className="lk-faint w-24 shrink-0 tnum">{formatDateTH(e.date)}</span>
                <span className="lk-soft-bg lk-accent rounded-full px-2 py-0.5 text-[11px] font-medium">{e.type}</span>
                <span className="lk-muted min-w-0 flex-1">{e.text}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </Shell>
  );
}

/* ─────────────────────────── หน้ารุ่น ─────────────────────────── */

export function PitModel({ thin }: { thin: boolean }) {
  const np = NAMEPLATES.find((n) => n.slug === (thin ? "model-3" : "hilux-travo"))!;
  const full = !thin;
  const sources = sourcesFor(np.slug);

  return (
    <Shell thin={thin} active="model">
      <main className="mx-auto max-w-[1120px] px-4 pt-5 sm:px-6">
        <nav className="lk-faint text-[12px]">
          <LookLink look={LOOK} screen="home" thin={thin}>
            คู่มือ
          </LookLink>
          <span aria-hidden> › </span>
          {np.brand}
          <span aria-hidden> › </span>
          <span style={{ color: "var(--lk-text)" }}>{np.name}</span>
        </nav>

        {/* การ์ดหัวรุ่น */}
        <header
          className="relative mt-3 overflow-hidden rounded-3xl p-5 sm:p-7"
          style={{ background: "linear-gradient(120deg, var(--lk-panel-2), var(--lk-panel) 60%)" }}
        >
          <div className="relative z-10 grid gap-4 sm:grid-cols-[1fr_280px]">
            <div className="min-w-0">
              <span className="lk-faint text-[12px] tracking-[0.2em] uppercase">{np.brand}</span>
              <h1 className="mt-1 text-[32px] leading-none font-bold sm:text-[42px]">{np.name}</h1>
              <p className="lk-muted mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px]">
                <span className="lk-soft-bg lk-accent rounded-full px-2.5 py-0.5 font-medium">{np.segmentLabel}</span>
                {np.powertrains.map((p) => (
                  <PtDot key={p} label={p} />
                ))}
                <span>{np.launchYear != null ? `เปิดตัวในไทย ${np.launchYear}` : "ปีเปิดตัว: ไม่มีข้อมูล"}</span>
              </p>

              {/* แถบค่าประจำรุ่น */}
              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {[
                  { k: "ราคาเริ่มต้น", v: np.priceMin != null ? formatTHB(np.priceMin) : "—" },
                  { k: "ราคาสูงสุด", v: np.priceMax != null ? formatTHB(np.priceMax) : "—" },
                  { k: "รุ่นย่อย", v: `${np.variantCount} แบบ` },
                ].map((s) => (
                  <div key={s.k} className="lk-panel rounded-xl px-3.5 py-2.5">
                    <p className="lk-faint text-[11px]">{s.k}</p>
                    <p className="mt-0.5 text-[17px] font-bold tnum">{s.v}</p>
                  </div>
                ))}
              </div>
            </div>
            {np.image ? (
              <div className="flex items-center justify-center">
                <Image src={np.image} alt={`${np.brand} ${np.name}`} width={280} height={158} priority className="h-auto w-full max-w-[280px] object-contain" />
              </div>
            ) : (
              <div className="lk-faint grid place-items-center text-center text-[12px]">
                ยังไม่มีรูปของรุ่นนี้ — รอสิทธิ์ใช้ภาพจากผู้ผลิต
              </div>
            )}
          </div>
        </header>

        <p className="lk-muted mt-5 text-[14px] leading-7">{np.summary}</p>

        {/* รุ่นย่อย จัดกลุ่มตามตัวถัง — การ์ดแถวแบบคู่มือ */}
        <section className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-[16px] font-bold">รุ่นย่อยและราคา</h2>
            <span className="lk-faint text-[12px] tnum">{np.variantCount} รุ่นย่อย</span>
          </div>

          {full ? (
            <div className="mt-3 space-y-4">
              {HILUX_GROUPS.map((g) => {
                const rows = HILUX_SKUS.filter((s) => s.group === g);
                const gmin = Math.min(...rows.map((r) => r.price ?? Infinity));
                const gmax = Math.max(...rows.map((r) => r.price ?? 0));
                return (
                  <div key={g} className="lk-panel overflow-hidden rounded-2xl">
                    <div className="lk-line flex items-center justify-between gap-3 border-b px-4 py-2.5" style={{ background: "var(--lk-panel-2)" }}>
                      <h3 className="text-[13px] font-bold">{g}</h3>
                      <span className="lk-faint text-[12px] tnum">
                        {rows.length} รุ่นย่อย · {formatTHB(gmin)} – {formatTHB(gmax)}
                      </span>
                    </div>
                    <div className="grid sm:grid-cols-2">
                      {rows.map((v) => (
                        <LookLink
                          key={v.key}
                          look={LOOK}
                          screen="sku"
                          thin={thin}
                          className="lk-line flex items-start justify-between gap-3 border-b border-r px-4 py-3 hover:bg-[color:var(--lk-accent-soft)]"
                        >
                          <span className="min-w-0">
                            <span className="block text-[14px] font-medium">{v.shortName}</span>
                            <span className="lk-faint mt-0.5 block text-[11px]">
                              {v.powerText} · {v.transmission} · {v.drivetrain} · {v.seats} ที่นั่ง
                            </span>
                            <span className="mt-1.5 flex flex-wrap gap-2">
                              <AdasMark value={v.adas.aeb} label="AEB" />
                              <AdasMark value={v.adas.acc} label="ACC" />
                              <AdasMark value={v.adas.lka} label="LKA" />
                            </span>
                          </span>
                          <span className="shrink-0 text-right">
                            <span className="block text-[15px] font-bold tnum">{formatTHB(v.price!)}</span>
                            <span className="lk-faint block text-[11px] tnum">
                              {v.price === HILUX_MIN ? "ถูกสุดของรุ่น" : `+${formatTHB(v.price! - HILUX_MIN)}`}
                            </span>
                          </span>
                        </LookLink>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="lk-panel lk-muted mt-3 rounded-2xl px-4 py-10 text-center text-[13px]">
              หน้าลองเก็บรุ่นย่อยละเอียดไว้เฉพาะ Hilux Travo
            </p>
          )}
          <p className="lk-faint mt-2 text-[12px]">
            ✓ = สเปกทางการระบุว่ามี · – = ระบุว่าไม่มี · ? = สเปกไม่ระบุ (ไม่ใช่ “ไม่มี”)
          </p>
        </section>

        {/* ไทม์ไลน์ + แหล่งอ้างอิง */}
        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="text-[16px] font-bold">ไทม์ไลน์</h2>
            <ol className="mt-3 space-y-3">
              {(full ? TIMELINE : []).map((e) => (
                <li key={e.date + e.text} className="flex gap-3">
                  <span className="lk-faint w-24 shrink-0 pt-0.5 text-[12px] tnum">{formatDateTH(e.date)}</span>
                  <span className="lk-line relative flex-1 border-l pb-3 pl-4 text-[13px]">
                    <span aria-hidden className="absolute top-1.5 -left-[5px] size-2.5 rounded-full" style={{ background: "var(--lk-accent)" }} />
                    <span className="lk-soft-bg lk-accent mr-2 rounded-full px-2 py-0.5 text-[11px]">{e.type}</span>
                    {e.text}
                  </span>
                </li>
              ))}
              {!full && <li className="lk-muted text-[13px]">ยังไม่มีเหตุการณ์ที่ยืนยันของรุ่นนี้</li>}
            </ol>
          </div>
          <div>
            <h2 className="text-[16px] font-bold">แหล่งอ้างอิง</h2>
            <ul className="mt-3 space-y-2">
              {sources.map((s) => (
                <li key={s.id} className="lk-panel rounded-xl px-3.5 py-2.5 text-[13px]">
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-[color:var(--lk-accent)]">
                    <span className="font-semibold">{s.publisher}</span>{" "}
                    <span className="lk-muted">{s.title} ↗</span>
                  </a>
                  <span className="lk-faint mt-1 block text-[11px]">
                    ตรวจ {formatDateTH(s.checkedDate)} · ความเชื่อมั่น{s.confidence === "HIGH" ? "สูง" : "ปานกลาง"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </Shell>
  );
}

/* ────────────────────────── หน้ารุ่นย่อย ────────────────────────── */

export function PitSku({ thin }: { thin: boolean }) {
  const v = skuByKey(thin ? "travo-e-double-4trex" : "double-4trex-2-8-overland-plus-at");
  const np = NAMEPLATES.find((n) => n.slug === "hilux-travo")!;
  const siblings = HILUX_SKUS.filter((s) => s.group === v.group);
  const pct = ((v.price! - HILUX_MIN) / (HILUX_MAX - HILUX_MIN)) * 100;

  return (
    <Shell thin={thin} active="sku">
      <main className="mx-auto max-w-[1120px] px-4 pt-5 sm:px-6">
        <nav className="lk-faint text-[12px]">
          <LookLink look={LOOK} screen="home" thin={thin}>
            คู่มือ
          </LookLink>
          <span aria-hidden> › </span>
          <LookLink look={LOOK} screen="model" thin={thin}>
            {np.name}
          </LookLink>
          <span aria-hidden> › </span>
          <span style={{ color: "var(--lk-text)" }}>{v.shortName}</span>
        </nav>

        <header
          className="mt-3 overflow-hidden rounded-3xl p-5 sm:p-7"
          style={{ background: "linear-gradient(120deg, var(--lk-panel-2), var(--lk-panel) 60%)" }}
        >
          <span className="lk-faint text-[12px] tracking-[0.18em] uppercase">
            {np.brand} {np.name}
          </span>
          <h1 className="mt-1 text-[24px] leading-tight font-bold sm:text-[32px]">{v.name}</h1>
          <p className="lk-muted mt-2 flex flex-wrap items-center gap-x-3 text-[13px]">
            <span className="lk-soft-bg lk-accent rounded-full px-2.5 py-0.5 font-medium">{v.group}</span>
            <PtDot label={v.powertrainText} />
            <span>{v.transmission}</span>
            <span>{v.drivetrain}</span>
          </p>

          <div className="mt-5 flex flex-wrap items-end gap-x-8 gap-y-4">
            <div>
              <p className="lk-faint text-[11px]">ราคาป้ายทางการ · ณ {formatDateTH(np.checkedDate)}</p>
              <p className="text-[32px] leading-none font-bold tnum">{formatTHB(v.price!)}</p>
            </div>
            <div className="min-w-[220px] flex-1">
              <div className="lk-meter">
                <span style={{ left: 0, width: `${Math.max(pct, 2)}%` }} />
              </div>
              <p className="lk-faint mt-1 flex justify-between text-[11px] tnum">
                <span>{formatTHB(HILUX_MIN)}</span>
                <span>ตำแหน่งราคาในรุ่นนี้</span>
                <span>{formatTHB(HILUX_MAX)}</span>
              </p>
            </div>
          </div>
        </header>

        <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <h2 className="text-[16px] font-bold">สเปก</h2>
            <div className="lk-panel mt-3 grid gap-x-6 rounded-2xl px-4 py-2 sm:grid-cols-2">
              {[
                ["ขุมพลัง", v.powertrainText],
                ["กำลังสูงสุด", v.powerText],
                ["เกียร์", v.transmission],
                ["ระบบขับเคลื่อน", v.drivetrain],
                ["ที่นั่ง", String(v.seats)],
                ["มิติตัวถัง", "ไม่มีข้อมูล"],
              ].map(([k, val]) => (
                <div key={k} className="lk-spec">
                  <dt>{k}</dt>
                  <span className="dots" aria-hidden />
                  <dd className={val === "ไม่มีข้อมูล" ? "lk-faint" : ""}>{val}</dd>
                </div>
              ))}
            </div>

            <h2 className="mt-7 text-[16px] font-bold">ระบบช่วยขับขี่</h2>
            <div className="mt-3 space-y-2">
              {ADAS_FEATURES.map((f) => {
                const has = v.adas[f.key.toLowerCase() as "aeb" | "acc" | "lka"];
                const color = has === true ? "var(--lk-good)" : has === false ? "var(--lk-faint)" : "var(--lk-warn)";
                return (
                  <div key={f.key} className="lk-panel flex items-center gap-3 rounded-xl px-3.5 py-3">
                    <span
                      aria-hidden
                      className="grid size-9 shrink-0 place-items-center rounded-lg text-[15px] font-bold"
                      style={{ background: "var(--lk-panel-2)", color }}
                    >
                      {has === true ? "✓" : has === false ? "–" : "?"}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-medium">{f.nameTh}</span>
                      <span className="lk-faint block text-[11px]">
                        {has === true ? f.marketing : has === false ? `${f.key} — สเปกระบุว่าไม่มี` : `${f.key} — สเปกทางการไม่ระบุ`}
                      </span>
                    </span>
                    <span className="shrink-0 text-[12px] font-semibold" style={{ color }}>
                      {has === true ? "มี" : has === false ? "ไม่มี" : "ไม่ระบุ"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-[16px] font-bold">ประวัติราคา</h2>
            <div className="lk-panel mt-3 rounded-2xl p-4">
              {PRICE_HISTORY.map((h) => (
                <div key={h.date} className="flex items-baseline justify-between gap-3 text-[13px]">
                  <span className="lk-faint tnum">{formatDateTH(h.date)}</span>
                  <span className="font-bold tnum">{formatTHB(v.price ?? h.amount)}</span>
                </div>
              ))}
              <a href={PRICE_HISTORY[0].url} target="_blank" rel="noopener noreferrer" className="lk-accent mt-3 block text-[12px]">
                {PRICE_HISTORY[0].publisher} — เปิดหน้าต้นทาง ↗
              </a>
              <p className="lk-faint mt-2 text-[11px]">บันทึกแบบไม่เขียนทับ ถ้าราคาขยับจะเพิ่มแถวใหม่</p>
            </div>

            <h2 className="mt-7 text-[16px] font-bold">รุ่นย่อยตัวถังเดียวกัน</h2>
            <div className="lk-panel mt-3 overflow-hidden rounded-2xl">
              {siblings.map((s) => (
                <LookLink
                  key={s.key}
                  look={LOOK}
                  screen="sku"
                  thin={thin}
                  className={`lk-line flex items-center justify-between gap-3 border-b px-3.5 py-2.5 text-[13px] last:border-b-0 ${
                    s.key === v.key ? "lk-soft-bg" : ""
                  }`}
                >
                  <span className={`truncate ${s.key === v.key ? "lk-accent font-bold" : "lk-muted"}`}>{s.shortName}</span>
                  <span className="shrink-0 tnum">{formatTHB(s.price!)}</span>
                </LookLink>
              ))}
            </div>
          </div>
        </div>
      </main>
    </Shell>
  );
}
