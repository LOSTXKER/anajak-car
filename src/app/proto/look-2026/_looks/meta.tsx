// ── D · META — หน้าตาสายสถิติ (ฟีล dotabuff / op.gg) ───────────────────────
// บุคลิก: มืด แน่น ตัวเลขเป็นพระเอก · "อ่านด้วยตา" ได้ก่อนอ่านตัวหนังสือ (แท่งเทียบราคาในทุกแถว)
// สีน้ำเงิน CI ยังเป็นแกน แต่เป็นน้ำเงินสว่างบนพื้นกรมท่า (contrast สูงแบบเว็บสถิติ)
import Image from "next/image";

import { formatDateTH, formatTHB } from "@/lib/format";

import {
  ADAS_FEATURES,
  BRANDS,
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
import { AdasMark, LookLink, PRICE_SCALE_MAX, PtDot, ptColor, shortTHB } from "./kit";

const LOOK = "meta" as const;

function Shell({ thin, children }: { thin: boolean; children: React.ReactNode }) {
  return (
    <div className="look look-meta">
      <header className="lk-bar sticky top-0 z-40">
        <div className="mx-auto flex h-14 max-w-[1280px] items-center gap-4 px-4 sm:px-6">
          <LookLink look={LOOK} screen="home" thin={thin} className="flex items-center gap-2">
            <span
              aria-hidden
              className="grid size-7 place-items-center text-[13px] font-bold text-white"
              style={{ background: "var(--lk-accent)", clipPath: "polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%)" }}
            >
              C
            </span>
            <span className="text-[15px] font-bold tracking-[0.14em]">CARMETA</span>
          </LookLink>
          <nav className="hidden items-center gap-1 text-[13px] sm:flex">
            {["ฐานข้อมูล", "จัดอันดับ", "เทียบรุ่น"].map((t, i) => (
              <span
                key={t}
                className={`px-3 py-1.5 ${i === 0 ? "lk-accent font-semibold" : "lk-muted"}`}
              >
                {t}
              </span>
            ))}
          </nav>
          <label className="relative ml-auto w-full max-w-xs">
            <span className="sr-only">ค้นหารุ่นรถหรือรุ่นย่อย</span>
            <span aria-hidden className="lk-faint pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
              ⌕
            </span>
            <input
              className="lk-input w-full rounded-sm py-1.5 pr-3 pl-8 text-[13px] outline-none"
              placeholder="ค้นรุ่น / เกรด / รหัสรุ่น"
            />
          </label>
        </div>
      </header>
      {children}
      <footer className="lk-line mt-10 border-t">
        <div className="lk-faint mx-auto max-w-[1280px] px-4 py-6 text-[12px] leading-6 sm:px-6">
          ราคาป้ายทางการจากผู้ผลิต ไม่ใช่ราคาซื้อขายจริง · ค่าที่ยังไม่มีหลักฐานแสดงว่า “ไม่มีข้อมูล”
          ไม่เดาและไม่ใส่ 0 · ตรวจล่าสุด {formatDateTH(TOTALS.latestChecked)}
        </div>
      </footer>
    </div>
  );
}

/** แท่งช่วงราคาบนสเกลร่วมของทั้งฐาน — เห็นทันทีว่ารุ่นนี้อยู่ช่วงไหนของตลาดในระบบ */
function RangeBar({ min, max }: { min: number | null; max: number | null }) {
  if (min == null || max == null) return <span className="lk-faint text-[12px]">ไม่มีข้อมูล</span>;
  const left = (min / PRICE_SCALE_MAX) * 100;
  const width = Math.max(((max - min) / PRICE_SCALE_MAX) * 100, 1.5);
  return (
    <span className="block">
      <span className="lk-meter block">
        <span style={{ left: `${left}%`, width: `${width}%` }} />
      </span>
      <span className="lk-faint mt-1 block text-[11px] tnum">
        {shortTHB(min)} – {shortTHB(max)}
      </span>
    </span>
  );
}

function StatCell({ k, v, sub }: { k: string; v: React.ReactNode; sub?: string }) {
  return (
    <div className="lk-panel px-4 py-3">
      <div className="lk-faint text-[11px] tracking-[0.1em] uppercase">{k}</div>
      <div className="mt-1 text-2xl font-bold tnum">{v}</div>
      {sub && <div className="lk-faint mt-0.5 text-[11px]">{sub}</div>}
    </div>
  );
}

/* ─────────────────────────── หน้าแรก ─────────────────────────── */

export function MetaHome({ thin }: { thin: boolean }) {
  const rows = thin ? [] : [...NAMEPLATES].sort((a, b) => (a.priceMin ?? 0) - (b.priceMin ?? 0));

  return (
    <Shell thin={thin}>
      <main className="mx-auto max-w-[1280px] px-4 pt-6 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="lk-tag">ฐานข้อมูลรถยนต์ไทย</span>
            <h1 className="mt-2 text-[26px] leading-tight font-bold sm:text-[32px]">
              ราคาป้ายทางการ <span className="lk-accent">ทุกรุ่นย่อย</span> ที่ตรวจสอบได้
            </h1>
          </div>
          <p className="lk-muted max-w-sm text-[13px] leading-6">
            ทุกตัวเลขบนหน้านี้ผูกแหล่งอ้างอิงพร้อมวันที่ตรวจ — กดเข้าไปดูต้นทางได้ทุกค่า
          </p>
        </div>

        {/* แถวสถิติของทั้งฐาน */}
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <StatCell k="รุ่นในระบบ" v={TOTALS.nameplates} sub={`${TOTALS.brands} แบรนด์`} />
          <StatCell k="รุ่นย่อย" v={TOTALS.variants} sub="ราคาป้ายครบทุกแถว" />
          {/* ช่วงราคาเขียนติดกันแล้วตกบรรทัดบนมือถือ — แยกค่าต่ำไว้บรรทัดหลัก ค่าสูงเป็นบรรทัดรอง */}
          <StatCell
            k="ช่วงราคาในระบบ"
            v={<span className="text-lg">{formatTHB(569000)}</span>}
            sub={`ถึง ${shortTHB(PRICE_SCALE_MAX)}`}
          />
          <StatCell k="ตรวจล่าสุด" v={<span className="text-lg">{formatDateTH(TOTALS.latestChecked)}</span>} sub="ตรวจซ้ำเป็นรอบ" />
        </div>

        {/* แถบกรองแบบ tab (แพตเทิร์นเว็บสถิติ: หมวดอยู่บนหัวตาราง ไม่ใช่ dropdown ซ่อน) */}
        <div className="lk-line mt-6 flex flex-wrap items-center gap-x-1 gap-y-2 border-b pb-2">
          {["ทั้งหมด", "กระบะ", "PPV", "SUV", "ซีดาน"].map((t, i) => (
            <span
              key={t}
              className={`px-3 py-1.5 text-[13px] ${
                i === 0 ? "lk-accent border-b-2 font-semibold" : "lk-muted"
              }`}
              style={i === 0 ? { borderColor: "var(--lk-accent)" } : undefined}
            >
              {t}
            </span>
          ))}
          <span className="lk-faint mx-2 hidden sm:inline">|</span>
          {["ดีเซล", "เบนซิน", "ไฮบริด", "EV"].map((t) => (
            <span key={t} className="lk-muted rounded-sm px-2.5 py-1 text-[12px]" style={{ background: "var(--lk-panel-2)" }}>
              <PtDot label={t} />
            </span>
          ))}
          <span className="lk-faint ml-auto text-[12px] tnum">
            {rows.length} รุ่น · {rows.reduce((n, r) => n + r.variantCount, 0)} รุ่นย่อย
          </span>
        </div>

        {/* ตารางหลัก */}
        {rows.length === 0 ? (
          <div className="lk-panel mt-4 px-6 py-16 text-center">
            <p className="font-semibold">ยังไม่มีรุ่นที่ตรงเงื่อนไขนี้</p>
            <p className="lk-muted mt-1 text-[13px]">
              ฐานข้อมูลเก็บลึกทีละแบรนด์ — ตอนนี้มี {TOTALS.nameplates} รุ่นจาก {TOTALS.brands} แบรนด์
            </p>
          </div>
        ) : (
          <>
            <div className="mt-4 hidden overflow-x-auto sm:block">
              <table className="lk-table min-w-[940px] text-[13px]">
                <thead>
                  <tr>
                    <th className="w-10 text-right">#</th>
                    <th>รุ่น</th>
                    <th className="text-right">ราคาเริ่มต้น</th>
                    <th className="w-[240px]">ช่วงราคาเทียบทั้งฐาน</th>
                    <th>ขุมพลัง</th>
                    <th className="text-right">รุ่นย่อย</th>
                    <th className="text-right">ปีเปิดตัว</th>
                    <th className="text-right">ตรวจล่าสุด</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((n, i) => (
                    <tr key={n.slug} className="group relative">
                      <td className="lk-faint text-right tnum">{i + 1}</td>
                      <td>
                        <span className="flex items-center gap-3">
                          {n.image ? (
                            <Image
                              src={n.image}
                              alt=""
                              width={52}
                              height={30}
                              className="h-[30px] w-[52px] shrink-0 object-contain"
                            />
                          ) : (
                            <span
                              aria-hidden
                              className="lk-faint grid h-[30px] w-[52px] shrink-0 place-items-center text-[10px]"
                              style={{ background: "var(--lk-panel-2)" }}
                            >
                              ไม่มีรูป
                            </span>
                          )}
                          <span className="min-w-0">
                            <LookLink
                              look={LOOK}
                              screen="model"
                              thin={thin}
                              className="block font-semibold after:absolute after:inset-0 group-hover:text-[color:var(--lk-accent)]"
                            >
                              {n.name}
                            </LookLink>
                            <span className="lk-faint block text-[11px] tracking-wide uppercase">
                              {n.brand} · {n.segmentLabel}
                            </span>
                          </span>
                        </span>
                      </td>
                      <td className="text-right text-[15px] font-bold tnum">
                        {n.priceMin != null ? formatTHB(n.priceMin) : <span className="lk-faint text-[13px]">ไม่มีข้อมูล</span>}
                      </td>
                      <td>
                        <RangeBar min={n.priceMin} max={n.priceMax} />
                      </td>
                      <td className="lk-muted">
                        <span className="flex flex-wrap gap-x-3 gap-y-1">
                          {n.powertrains.map((p) => (
                            <PtDot key={p} label={p} />
                          ))}
                        </span>
                      </td>
                      <td className="text-right tnum">{n.variantCount}</td>
                      <td className="lk-muted text-right tnum">
                        {n.launchYear ?? <span className="lk-faint">—</span>}
                      </td>
                      <td className="lk-faint text-right text-[12px] tnum">{formatDateTH(n.checkedDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* มือถือ: แถวแน่นแบบเดียวกัน แต่ซ้อนสองบรรทัด */}
            <div className="mt-4 sm:hidden">
              {rows.map((n, i) => (
                <LookLink
                  key={n.slug}
                  look={LOOK}
                  screen="model"
                  thin={thin}
                  className="lk-line flex items-center gap-3 border-b py-2.5"
                >
                  <span className="lk-faint w-4 text-right text-[12px] tnum">{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{n.name}</span>
                    <span className="lk-faint block truncate text-[11px]">
                      {n.brand} · {n.segmentLabel} · {n.variantCount} รุ่นย่อย
                    </span>
                    <span className="mt-1 block max-w-[160px]">
                      <RangeBar min={n.priceMin} max={n.priceMax} />
                    </span>
                  </span>
                  <span className="shrink-0 text-right text-[15px] font-bold tnum">
                    {n.priceMin != null ? shortTHB(n.priceMin) : "—"}
                  </span>
                </LookLink>
              ))}
            </div>
          </>
        )}

        {/* อธิบายวิธีอ่าน + ลิงก์ภายใน (SEO) */}
        <section className="mt-10 grid gap-6 sm:grid-cols-[1fr_1fr]">
          <div className="lk-panel p-4">
            <h2 className="text-[15px] font-bold">อ่านตัวเลขบนหน้านี้ยังไง</h2>
            <ul className="lk-muted mt-2 space-y-1.5 text-[13px] leading-6">
              <li>• แท่งสีคือ “ช่วงราคาของรุ่นนั้น” วางบนสเกลเดียวกันทั้งตาราง (สูงสุด {shortTHB(PRICE_SCALE_MAX)})</li>
              <li>• ราคาเริ่มต้น = รุ่นย่อยถูกสุดที่ยังขายอยู่ ไม่ใช่ราคาหลังส่วนลด</li>
              <li>• ปีเปิดตัวที่ยังไม่มีหลักฐานทางการ แสดงเป็น — ไม่เดา</li>
            </ul>
          </div>
          <div className="lk-panel p-4">
            <h2 className="text-[15px] font-bold">ทุกรุ่นในฐานข้อมูล</h2>
            <div className="mt-2 grid gap-3 sm:grid-cols-3">
              {BRANDS.map((b) => (
                <div key={b.slug}>
                  <p className="lk-accent text-[12px] font-semibold tracking-wide uppercase">{b.name}</p>
                  <ul className="mt-1 space-y-0.5 text-[13px]">
                    {NAMEPLATES.filter((n) => n.brandSlug === b.slug).map((n) => (
                      <li key={n.slug}>
                        <LookLink look={LOOK} screen="model" thin={thin} className="lk-muted hover:text-[color:var(--lk-accent)]">
                          {n.name}
                        </LookLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Shell>
  );
}

/* ─────────────────────────── หน้ารุ่น ─────────────────────────── */

export function MetaModel({ thin }: { thin: boolean }) {
  const np = NAMEPLATES.find((n) => n.slug === (thin ? "model-3" : "hilux-travo"))!;
  const full = !thin;
  const skus = full ? [...HILUX_SKUS].sort((a, b) => (a.price ?? 0) - (b.price ?? 0)) : [];
  const sources = sourcesFor(np.slug);
  const groups = [...new Set(HILUX_SKUS.map((s) => s.group))];

  return (
    <Shell thin={thin}>
      <main className="mx-auto max-w-[1280px] px-4 pt-5 sm:px-6">
        <nav className="lk-faint text-[12px]">
          <LookLink look={LOOK} screen="home" thin={thin}>
            ฐานข้อมูล
          </LookLink>
          <span aria-hidden> / </span>
          {np.brand}
          <span aria-hidden> / </span>
          <span style={{ color: "var(--lk-text)" }}>{np.name}</span>
        </nav>

        {/* หัวหน้ารุ่น — ภาพรถบนพื้นเรืองน้ำเงิน + สถิติเรียงเป็นแถว */}
        <header
          className="lk-panel relative mt-3 overflow-hidden"
          style={{ background: "radial-gradient(120% 140% at 78% 30%, var(--lk-accent-soft), transparent 60%), var(--lk-panel)" }}
        >
          <div className="grid gap-4 p-5 sm:grid-cols-[1fr_300px] sm:p-6">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="lk-tag">{np.brand}</span>
                <span className="lk-tag" style={{ background: "var(--lk-panel-2)", color: "var(--lk-muted)" }}>
                  {np.segmentLabel}
                </span>
                <span className="lk-tag" style={{ background: "rgba(58,208,127,.14)", color: "var(--lk-good)" }}>
                  ขายอยู่
                </span>
              </div>
              <h1 className="mt-2 text-[34px] leading-none font-bold tracking-tight sm:text-[46px]">{np.name}</h1>
              <p className="lk-muted mt-2 flex flex-wrap items-center gap-x-3 text-[13px]">
                {np.powertrains.map((p) => (
                  <PtDot key={p} label={p} />
                ))}
                <span aria-hidden>·</span>
                <span>{np.launchYear != null ? `เปิดตัวในไทย ${np.launchYear}` : "ปีเปิดตัว: ไม่มีข้อมูล"}</span>
                <span aria-hidden>·</span>
                <span>ตรวจล่าสุด {formatDateTH(np.checkedDate)}</span>
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <StatCell k="เริ่มต้น" v={<span className="text-lg">{np.priceMin != null ? formatTHB(np.priceMin) : "—"}</span>} />
                <StatCell k="สูงสุด" v={<span className="text-lg">{np.priceMax != null ? formatTHB(np.priceMax) : "—"}</span>} />
                <StatCell k="รุ่นย่อย" v={np.variantCount} sub={full ? `${groups.length} ตัวถัง` : undefined} />
                <StatCell
                  k="ห่างกัน"
                  v={
                    <span className="text-lg">
                      {np.priceMin != null && np.priceMax != null ? formatTHB(np.priceMax - np.priceMin) : "—"}
                    </span>
                  }
                  sub="ถูกสุด→แพงสุด"
                />
              </div>
            </div>
            {np.image ? (
              <div className="flex items-center justify-center">
                <Image src={np.image} alt={`${np.brand} ${np.name}`} width={300} height={170} priority className="h-auto w-full max-w-[300px] object-contain" />
              </div>
            ) : (
              <div className="lk-faint grid place-items-center p-4 text-center text-[12px]">
                ยังไม่มีรูปของรุ่นนี้ — ต้องได้สิทธิ์ใช้ภาพจากผู้ผลิตก่อน
              </div>
            )}
          </div>
        </header>

        {/* บันไดราคา — จุดเด่นของ look นี้: เห็นการกระจายราคาทั้งไลน์อัปในภาพเดียว */}
        {full && (
          <section className="mt-8">
            <h2 className="lk-head text-[15px]">
              <span className="idx">01</span> บันไดราคา {skus.length} รุ่นย่อย
            </h2>
            <div className="lk-panel mt-3 p-4">
              <div className="space-y-1.5">
                {skus.map((v) => {
                  const pct = ((v.price! - HILUX_MIN) / (HILUX_MAX - HILUX_MIN)) * 100;
                  return (
                    <LookLink
                      key={v.key}
                      look={LOOK}
                      screen="sku"
                      thin={thin}
                      className="group grid grid-cols-[minmax(0,1fr)_100px] items-center gap-3 rounded-sm px-1 py-1 hover:bg-[color:var(--lk-accent-soft)] sm:grid-cols-[220px_minmax(0,1fr)_110px]"
                    >
                      <span className="truncate text-[13px] font-medium">{v.shortName}</span>
                      <span className="hidden sm:block">
                        <span className="lk-meter block">
                          <span style={{ left: 0, width: `${Math.max(pct, 2)}%`, background: ptColor(v.powertrainText) }} />
                        </span>
                      </span>
                      <span className="text-right text-[13px] font-bold tnum">{formatTHB(v.price!)}</span>
                    </LookLink>
                  );
                })}
              </div>
              <p className="lk-faint mt-3 text-[11px]">
                แท่งวัดจากรุ่นถูกสุด ({formatTHB(HILUX_MIN)}) ถึงแพงสุด ({formatTHB(HILUX_MAX)}) ของรุ่นนี้ ·
                สีแท่งตามหมวดขุมพลัง
              </p>
            </div>
          </section>
        )}

        {/* ตารางรุ่นย่อยแบบสถิติ */}
        <section className="mt-8">
          <h2 className="lk-head text-[15px]">
            <span className="idx">02</span> ตารางรุ่นย่อย
          </h2>
          {full ? (
            <>
              <div className="mt-3 hidden overflow-x-auto sm:block">
                <table className="lk-table min-w-[900px] text-[13px]">
                  <thead>
                    <tr>
                      <th>รุ่นย่อย</th>
                      <th>ตัวถัง</th>
                      <th>ขุมพลัง · กำลัง</th>
                      <th>เกียร์ · ขับเคลื่อน</th>
                      <th>ระบบช่วยขับขี่</th>
                      <th className="text-right">ราคาป้าย</th>
                      <th className="text-right">Δ ถูกสุด</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skus.map((v) => (
                      <tr key={v.key} className="group relative">
                        <td className="font-medium">
                          <LookLink look={LOOK} screen="sku" thin={thin} className="after:absolute after:inset-0 group-hover:text-[color:var(--lk-accent)]">
                            {v.shortName}
                          </LookLink>
                        </td>
                        <td className="lk-muted">{v.group.replace("Travo ", "")}</td>
                        <td className="lk-muted">
                          <PtDot label={v.powertrainText} /> · {v.powerText}
                        </td>
                        <td className="lk-muted">
                          {v.transmission} · {v.drivetrain}
                        </td>
                        <td>
                          <span className="flex gap-2">
                            <AdasMark value={v.adas.aeb} label="AEB" />
                            <AdasMark value={v.adas.acc} label="ACC" />
                            <AdasMark value={v.adas.lka} label="LKA" />
                          </span>
                        </td>
                        <td className="text-right font-bold tnum">{formatTHB(v.price!)}</td>
                        <td className="text-right text-[12px] tnum">
                          {v.price === HILUX_MIN ? (
                            <span className="lk-good">ถูกสุด</span>
                          ) : (
                            <span className="lk-muted">+{formatTHB(v.price! - HILUX_MIN)}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 sm:hidden">
                {skus.map((v) => (
                  <LookLink key={v.key} look={LOOK} screen="sku" thin={thin} className="lk-line flex items-start gap-3 border-b py-2.5">
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">{v.shortName}</span>
                      <span className="lk-faint block text-[11px]">
                        {v.group.replace("Travo ", "")} · {v.transmission} · {v.drivetrain}
                      </span>
                      <span className="mt-1 flex gap-2">
                        <AdasMark value={v.adas.aeb} label="AEB" />
                        <AdasMark value={v.adas.acc} label="ACC" />
                        <AdasMark value={v.adas.lka} label="LKA" />
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block font-bold tnum">{formatTHB(v.price!)}</span>
                      <span className="lk-faint block text-[11px] tnum">
                        {v.price === HILUX_MIN ? "ถูกสุด" : `+${formatTHB(v.price! - HILUX_MIN)}`}
                      </span>
                    </span>
                  </LookLink>
                ))}
              </div>
            </>
          ) : (
            <p className="lk-panel lk-muted mt-3 px-4 py-10 text-center text-[13px]">
              หน้าลองเก็บรุ่นย่อยละเอียดไว้เฉพาะ Hilux Travo — ปิดสวิตช์ “ข้อมูลไม่ครบ” เพื่อดูตารางเต็ม
            </p>
          )}
        </section>

        {/* ไทม์ไลน์ + แหล่งอ้างอิง */}
        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="lk-head text-[15px]">
              <span className="idx">03</span> ไทม์ไลน์
            </h2>
            <div className="lk-panel mt-3 p-4">
              {full ? (
                <ol className="space-y-3">
                  {TIMELINE.map((e) => (
                    <li key={e.date + e.text} className="flex gap-3 text-[13px]">
                      <span className="lk-faint w-24 shrink-0 tnum">{formatDateTH(e.date)}</span>
                      <span>
                        <span className="lk-tag mr-2">{e.type}</span>
                        {e.text}
                      </span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="lk-muted text-[13px]">ยังไม่มีเหตุการณ์ที่ยืนยันของรุ่นนี้</p>
              )}
            </div>
          </div>
          <div>
            <h2 className="lk-head text-[15px]">
              <span className="idx">04</span> แหล่งอ้างอิง
            </h2>
            <div className="lk-panel mt-3 p-4">
              <ul className="space-y-2.5 text-[13px]">
                {sources.map((s) => (
                  <li key={s.id} className="lk-line border-b pb-2 last:border-b-0">
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-[color:var(--lk-accent)]">
                      <span className="font-semibold">{s.publisher}</span>{" "}
                      <span className="lk-muted">{s.title} ↗</span>
                    </a>
                    <span className="lk-faint mt-0.5 flex items-center gap-2 text-[11px]">
                      ตรวจ {formatDateTH(s.checkedDate)}
                      <span className="lk-tag" style={s.confidence === "HIGH" ? { background: "rgba(58,208,127,.14)", color: "var(--lk-good)" } : { background: "rgba(255,176,32,.14)", color: "var(--lk-warn)" }}>
                        ความเชื่อมั่น{s.confidence === "HIGH" ? "สูง" : "ปานกลาง"}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </Shell>
  );
}

/* ────────────────────────── หน้ารุ่นย่อย ────────────────────────── */

export function MetaSku({ thin }: { thin: boolean }) {
  const v = skuByKey(thin ? "travo-e-double-4trex" : "double-4trex-2-8-overland-plus-at");
  const np = NAMEPLATES.find((n) => n.slug === "hilux-travo")!;
  const sorted = [...HILUX_SKUS].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  const idx = sorted.findIndex((s) => s.key === v.key);
  const pricePct = ((v.price! - HILUX_MIN) / (HILUX_MAX - HILUX_MIN)) * 100;
  const maxPower = 204; // กำลังสูงสุดในไลน์อัปนี้ (ดีเซล 2.8) — ใช้เป็นฐานเทียบแท่ง

  return (
    <Shell thin={thin}>
      <main className="mx-auto max-w-[1280px] px-4 pt-5 sm:px-6">
        <nav className="lk-faint text-[12px]">
          <LookLink look={LOOK} screen="home" thin={thin}>
            ฐานข้อมูล
          </LookLink>
          <span aria-hidden> / </span>
          <LookLink look={LOOK} screen="model" thin={thin}>
            {np.name}
          </LookLink>
          <span aria-hidden> / </span>
          <span style={{ color: "var(--lk-text)" }}>{v.shortName}</span>
        </nav>

        <header className="lk-panel mt-3 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <span className="lk-tag">
                {np.brand} {np.name}
              </span>
              <h1 className="mt-2 text-[24px] leading-tight font-bold sm:text-[30px]">{v.name}</h1>
              <p className="lk-muted mt-1.5 flex flex-wrap items-center gap-x-3 text-[13px]">
                <span>{v.group}</span>
                <span aria-hidden>·</span>
                <PtDot label={v.powertrainText} />
                <span aria-hidden>·</span>
                <span>{v.transmission}</span>
                <span aria-hidden>·</span>
                <span>{v.drivetrain}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="lk-faint text-[11px] tracking-[0.1em] uppercase">ราคาป้ายทางการ</p>
              <p className="text-[34px] leading-none font-bold tnum">{formatTHB(v.price!)}</p>
              <p className="lk-muted mt-1 text-[12px] tnum">ณ {formatDateTH(np.checkedDate)}</p>
            </div>
          </div>

          {/* ตำแหน่งราคาในไลน์อัป */}
          <div className="mt-5">
            <div className="lk-meter">
              <span style={{ left: 0, width: `${Math.max(pricePct, 2)}%` }} />
            </div>
            <div className="lk-faint mt-1 flex justify-between text-[11px] tnum">
              <span>ถูกสุด {formatTHB(HILUX_MIN)}</span>
              <span>
                อันดับราคา {idx + 1}/{sorted.length} ในรุ่นนี้
              </span>
              <span>แพงสุด {formatTHB(HILUX_MAX)}</span>
            </div>
          </div>

          {/* สลับรุ่นย่อยพี่น้อง */}
          <div className="lk-line mt-5 flex flex-wrap items-center gap-2 border-t pt-4 text-[13px]">
            <span className="lk-muted">‹ {sorted[Math.max(idx - 1, 0)].shortName}</span>
            <span className="lk-faint">|</span>
            <span className="lk-muted">{sorted[Math.min(idx + 1, sorted.length - 1)].shortName} ›</span>
            <LookLink look={LOOK} screen="model" thin={thin} className="lk-accent ml-auto">
              ดูทั้ง {sorted.length} รุ่นย่อย
            </LookLink>
          </div>
        </header>

        {/* stat block — ค่ากับแท่งเทียบในไลน์อัปเดียวกัน */}
        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <h2 className="lk-head text-[15px]">
              <span className="idx">01</span> สเปก
            </h2>
            <div className="lk-panel mt-3 p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="lk-faint text-[11px] tracking-[0.1em] uppercase">กำลังสูงสุด</p>
                  <p className="text-xl font-bold tnum">{v.powerText}</p>
                  <span className="lk-meter mt-1.5 block">
                    <span
                      style={{
                        left: 0,
                        width: `${Math.min((parseInt(v.powerText) / maxPower) * 100, 100)}%`,
                      }}
                    />
                  </span>
                  <p className="lk-faint mt-1 text-[11px]">เทียบกับกำลังสูงสุดในไลน์อัปนี้ ({maxPower} PS)</p>
                </div>
                <div>
                  <p className="lk-faint text-[11px] tracking-[0.1em] uppercase">ที่นั่ง</p>
                  <p className="text-xl font-bold tnum">{v.seats}</p>
                  <p className="lk-faint mt-1 text-[11px]">ตามสเปกทางการของตัวถังนี้</p>
                </div>
              </div>
              <dl className="mt-4">
                <div className="lk-spec">
                  <dt>ขุมพลัง</dt>
                  <span className="dots" aria-hidden />
                  <dd>{v.powertrainText}</dd>
                </div>
                <div className="lk-spec">
                  <dt>เกียร์</dt>
                  <span className="dots" aria-hidden />
                  <dd>{v.transmission}</dd>
                </div>
                <div className="lk-spec">
                  <dt>ระบบขับเคลื่อน</dt>
                  <span className="dots" aria-hidden />
                  <dd>{v.drivetrain}</dd>
                </div>
                <div className="lk-spec">
                  <dt>ตัวถัง</dt>
                  <span className="dots" aria-hidden />
                  <dd>{v.group}</dd>
                </div>
                <div className="lk-spec">
                  <dt>มิติตัวถัง (ก×ย×ส)</dt>
                  <span className="dots" aria-hidden />
                  <dd className="lk-faint">ไม่มีข้อมูล</dd>
                </div>
              </dl>
            </div>

            <h2 className="lk-head mt-8 text-[15px]">
              <span className="idx">02</span> ระบบช่วยขับขี่
            </h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {ADAS_FEATURES.map((f) => {
                const has = v.adas[f.key.toLowerCase() as "aeb" | "acc" | "lka"];
                const color = has === true ? "var(--lk-good)" : has === false ? "var(--lk-faint)" : "var(--lk-warn)";
                return (
                  <div key={f.key} className="lk-panel p-3" style={{ borderTop: `2px solid ${color}` }}>
                    <p className="text-[12px] font-bold" style={{ color }}>
                      {has === true ? "มี" : has === false ? "ไม่มี" : "สเปกไม่ระบุ"}
                    </p>
                    <p className="mt-1 text-[13px] font-medium">{f.nameTh}</p>
                    <p className="lk-faint mt-0.5 text-[11px]">{has === true ? f.marketing : `รหัส ${f.key}`}</p>
                  </div>
                );
              })}
            </div>
            <p className="lk-faint mt-2 text-[12px]">“สเปกไม่ระบุ” ไม่เท่ากับ “ไม่มี” — เราไม่เดาแทนเอกสารทางการ</p>
          </div>

          <div>
            <h2 className="lk-head text-[15px]">
              <span className="idx">03</span> ประวัติราคา
            </h2>
            <div className="lk-panel mt-3 p-4">
              <table className="w-full text-[13px]">
                <tbody>
                  {PRICE_HISTORY.map((h) => (
                    <tr key={h.date} className="lk-line border-b last:border-b-0">
                      <td className="lk-faint py-2 tnum">{formatDateTH(h.date)}</td>
                      <td className="py-2 text-right font-bold tnum">{formatTHB(v.price ?? h.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <a
                href={PRICE_HISTORY[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="lk-accent mt-3 inline-block text-[12px]"
              >
                {PRICE_HISTORY[0].publisher} — เปิดหน้าต้นทาง ↗
              </a>
              <p className="lk-faint mt-2 text-[11px]">
                บันทึกแบบไม่เขียนทับ — ถ้าราคาขยับจะเพิ่มแถวใหม่ ไม่ลบของเดิม
              </p>
            </div>

            <h2 className="lk-head mt-8 text-[15px]">
              <span className="idx">04</span> รุ่นย่อยข้างเคียง
            </h2>
            <div className="lk-panel mt-3">
              {sorted.slice(Math.max(idx - 2, 0), idx + 3).map((s) => (
                <LookLink
                  key={s.key}
                  look={LOOK}
                  screen="sku"
                  thin={thin}
                  className="lk-line flex items-center justify-between gap-3 border-b px-3 py-2 text-[13px] last:border-b-0"
                >
                  <span className={`truncate ${s.key === v.key ? "lk-accent font-bold" : "lk-muted"}`}>
                    {s.shortName}
                  </span>
                  <span className="shrink-0 tnum">{formatTHB(s.price!)}</span>
                </LookLink>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Shell>
  );
}
