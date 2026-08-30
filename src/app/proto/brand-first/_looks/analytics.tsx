// ── G · ANALYTICS — dashboard เทียบข้อมูล พื้นสว่าง (ref ที่เบสส่ง: artificialanalysis.ai / arena.ai) ──
// บุคลิก: ขาวสะอาด · กราฟเป็นเนื้อหา ไม่ใช่ของประดับ · ตารางจัดอันดับที่กดเรียงได้
// flow: หน้าแรกให้ "เลือกแบรนด์" เป็นทางเข้าหลัก (ตามที่เบสบอกว่าคนชอบเลือกหมวดมากกว่าค้นหา)
// กฎที่ยังยึด: ไม่มีคะแนนรวมของรถ — อันดับทุกอันมาจากค่าที่วัดได้จริง (ราคา/จำนวน/ปี) เท่านั้น
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
  UPCOMING_BRANDS,
  brandStats,
  skuByKey,
  sourcesFor,
} from "../../_kit/data";
import { AnalyticsTable } from "./analytics-table";
import { AdasMark, BfLink, BrandLogo, PtDot, ptColor, shortTHB } from "./kit";

const LOOK = "analytics" as const;
const SCALE = Math.max(...NAMEPLATES.map((n) => n.priceMax ?? 0));

function Shell({ thin, children }: { thin: boolean; children: React.ReactNode }) {
  return (
    <div className="look look-analytics">
      <header className="lk-bar sticky top-0 z-40">
        <div className="mx-auto flex h-14 max-w-[1220px] items-center gap-4 px-4 sm:px-6">
          <BfLink look={LOOK} screen="home" thin={thin} className="flex items-center gap-2">
            <span
              aria-hidden
              className="grid size-7 place-items-center rounded-lg text-[13px] font-bold text-white"
              style={{ background: "linear-gradient(135deg, var(--lk-accent), var(--lk-cyan))" }}
            >
              C
            </span>
            <span className="text-[15px] font-bold tracking-tight">CARMETA</span>
          </BfLink>
          <nav className="lk-muted hidden items-center gap-4 text-[13px] sm:flex">
            <span className="lk-accent font-semibold">แบรนด์</span>
            <span>รุ่นรถทั้งหมด</span>
            <span>เทียบรุ่น</span>
          </nav>
          <label className="relative ml-auto w-full max-w-[240px]">
            <span className="sr-only">ค้นหา</span>
            <span aria-hidden className="lk-faint pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[13px]">
              ⌕
            </span>
            <input
              className="lk-input w-full rounded-full py-1.5 pr-3 pl-8 text-[13px] outline-none"
              placeholder="ค้นหารุ่น (ถ้ารู้ชื่ออยู่แล้ว)"
            />
          </label>
        </div>
      </header>
      {children}
      <footer className="lk-line mt-12 border-t">
        <p className="lk-faint mx-auto max-w-[1220px] px-4 py-6 text-[12px] leading-6 sm:px-6">
          ราคาป้ายทางการจากผู้ผลิต ไม่ใช่ราคาซื้อขายจริง · อันดับในตารางเรียงตามค่าที่วัดได้ (ราคา/จำนวน/ปี)
          ไม่ใช่คะแนนความดีของรถ · ค่าที่ยังไม่มีหลักฐานแสดงว่า “ไม่มีข้อมูล” · ตรวจล่าสุด{" "}
          {formatDateTH(TOTALS.latestChecked)}
        </p>
      </footer>
    </div>
  );
}

function Kpi({ k, v, sub }: { k: string; v: React.ReactNode; sub?: string }) {
  return (
    <div className="lk-panel rounded-xl border px-4 py-3" style={{ borderColor: "var(--lk-line)" }}>
      <p className="lk-faint text-[11px] tracking-[0.08em] uppercase">{k}</p>
      <p className="mt-1 text-2xl font-bold tnum">{v}</p>
      {sub && <p className="lk-faint mt-0.5 text-[11px]">{sub}</p>}
    </div>
  );
}

/** กราฟแท่งแนวนอน: ราคาเริ่มต้นของแต่ละรุ่น (แกนร่วม 0 → ราคาสูงสุดในฐาน) */
function PriceBars({
  rows,
  thin,
  max = SCALE,
}: {
  rows: typeof NAMEPLATES;
  thin: boolean;
  max?: number;
}) {
  return (
    <div className="an-bars an-grid">
      {rows.map((n) => (
        <BfLink key={n.slug} look={LOOK} screen="model" thin={thin} className="an-bar-row group">
          <span className="lk-muted truncate group-hover:text-[color:var(--lk-accent)]">{n.name}</span>
          <span className="an-bar-track">
            <span
              className="an-bar-fill"
              style={{ width: `${Math.max(((n.priceMin ?? 0) / max) * 100, 1.5)}%` }}
            />
          </span>
          <span className="text-right font-semibold tnum">
            {n.priceMin != null ? shortTHB(n.priceMin) : "—"}
          </span>
        </BfLink>
      ))}
      {/* ป้ายแกน — โชว์เฉพาะจอกว้าง (บนมือถือความกว้างไม่พอ ตัวเลขจะทับกัน) */}
      <div className="lk-faint mt-1 hidden grid-cols-[minmax(96px,148px)_minmax(0,1fr)_96px] gap-[10px] text-[11px] tnum sm:grid">
        <span />
        <span className="flex justify-between">
          <span>0</span>
          <span>{shortTHB(max * 0.25)}</span>
          <span>{shortTHB(max * 0.5)}</span>
          <span>{shortTHB(max * 0.75)}</span>
          <span>{shortTHB(max)}</span>
        </span>
        <span />
      </div>
    </div>
  );
}

/* ─────────────────────────── หน้าแรก ─────────────────────────── */

export function AnalyticsHome({ thin }: { thin: boolean }) {
  const sorted = [...NAMEPLATES].sort((a, b) => (a.priceMin ?? 0) - (b.priceMin ?? 0));

  return (
    <Shell thin={thin}>
      <section className="an-hero">
        <div className="mx-auto max-w-[1220px] px-4 pt-8 pb-7 sm:px-6">
          <p className="lk-accent text-[12px] font-semibold tracking-[0.16em] uppercase">
            Thailand Car Database
          </p>
          <h1 className="mt-1.5 max-w-2xl text-[28px] leading-tight font-bold sm:text-[36px]">
            เลือกแบรนด์ที่สนใจ แล้วดูราคาป้ายทางการทุกรุ่นย่อย
          </h1>
          <p className="lk-muted mt-2 max-w-2xl text-[14px] leading-7">
            ข้อมูลเทียบกันได้ทั้งฐาน — ราคา สเปก และรุ่นย่อย พร้อมที่มาและวันที่ตรวจทุกค่า
          </p>

          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <Kpi k="แบรนด์ใน coverage" v={TOTALS.brands} sub={`อีก ${UPCOMING_BRANDS.length} แบรนด์กำลังเก็บ`} />
            <Kpi k="รุ่นในระบบ" v={TOTALS.nameplates} />
            <Kpi k="รุ่นย่อย" v={TOTALS.variants} sub="มีราคาป้ายครบทุกแถว" />
            <Kpi
              k="ตรวจล่าสุด"
              v={<span className="text-lg">{formatDateTH(TOTALS.latestChecked)}</span>}
              sub="ตรวจซ้ำกับหน้าทางการเป็นรอบ"
            />
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1220px] px-4 sm:px-6">
        {/* ทางเข้าหลัก = แบรนด์ */}
        <section className="mt-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-[18px] font-bold">เริ่มจากแบรนด์</h2>
            <span className="lk-faint text-[12px]">
              กดที่แบรนด์เพื่อดูรุ่นทั้งหมด ราคา และไทม์ไลน์ของแบรนด์นั้น
            </span>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {BRANDS.map((b) => {
              const st = brandStats(b.slug);
              return (
                <BfLink key={b.slug} look={LOOK} screen="brand" thin={thin} className="an-brand block p-4">
                  <span className="flex items-center gap-3">
                    <span
                      className="grid h-14 w-[72px] shrink-0 place-items-center rounded-xl border"
                      style={{ borderColor: "var(--lk-line)", background: "var(--lk-panel)" }}
                    >
                      <BrandLogo name={b.name} logo={b.logo} size={40} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[17px] font-bold">{b.name}</span>
                      <span className="lk-faint block text-[12px] tnum">
                        {st.nameplates} รุ่น · {st.variants} รุ่นย่อย
                      </span>
                    </span>
                    <span aria-hidden className="lk-accent ml-auto text-lg">
                      →
                    </span>
                  </span>

                  <span className="lk-line mt-3 block border-t pt-3">
                    <span className="lk-faint block text-[11px]">ช่วงราคาป้าย</span>
                    <span className="block text-[15px] font-bold tnum">
                      {st.priceMin != null && st.priceMax != null
                        ? `${formatTHB(st.priceMin)} – ${formatTHB(st.priceMax)}`
                        : "ไม่มีข้อมูล"}
                    </span>
                    <span className="an-bar-track mt-2 block">
                      <span
                        className="an-bar-fill"
                        style={{
                          left: `${((st.priceMin ?? 0) / SCALE) * 100}%`,
                          width: `${Math.max((((st.priceMax ?? 0) - (st.priceMin ?? 0)) / SCALE) * 100, 2)}%`,
                        }}
                      />
                    </span>
                    <span className="lk-muted mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[12px]">
                      {st.powertrains.map((p) => (
                        <PtDot key={p} label={p} />
                      ))}
                    </span>
                  </span>
                </BfLink>
              );
            })}
          </div>

          {/* แบรนด์ที่ยังไม่มีข้อมูล — โชว์ตรงๆ ว่ายังไม่เปิด ไม่ทำลิงก์หลอก */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="lk-faint text-[12px]">กำลังเก็บข้อมูลต่อ:</span>
            {UPCOMING_BRANDS.map((n) => (
              <span key={n} className="an-chip lk-faint" style={{ opacity: 0.75 }}>
                {n}
              </span>
            ))}
          </div>
        </section>

        {/* กราฟเทียบราคาเริ่มต้นทั้งฐาน */}
        <section className="mt-10">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-[18px] font-bold">ราคาเริ่มต้นของทุกรุ่นในฐานข้อมูล</h2>
            <span className="lk-faint text-[12px]">แกนเดียวกันทั้งกราฟ · หน่วยบาท</span>
          </div>
          <div className="lk-panel mt-3 rounded-2xl border p-4" style={{ borderColor: "var(--lk-line)" }}>
            {thin ? (
              <p className="lk-muted py-10 text-center text-[13px]">
                ไม่มีรุ่นที่ตรงเงื่อนไข — กราฟจะว่างตามจริง ไม่เติมรุ่นสมมติ
              </p>
            ) : (
              <PriceBars rows={sorted} thin={thin} />
            )}
          </div>
        </section>

        {/* ตารางจัดอันดับ */}
        <section className="mt-10">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-[18px] font-bold">ตารางเทียบทุกรุ่น</h2>
            <span className="an-chip on">ทั้งหมด</span>
            {["กระบะ", "PPV", "SUV", "ซีดาน", "EV"].map((t) => (
              <span key={t} className="an-chip">
                {t}
              </span>
            ))}
            <span className="lk-faint ml-auto text-[12px]">กดหัวคอลัมน์เพื่อเรียงใหม่</span>
          </div>
          <div className="mt-3">
            <AnalyticsTable thin={thin} />
          </div>
        </section>
      </main>
    </Shell>
  );
}

/* ─────────────────────────── หน้าแบรนด์ ─────────────────────────── */

export function AnalyticsBrand({ thin }: { thin: boolean }) {
  // ปกติ = Toyota (ข้อมูลแบรนด์ครบ) · สถานะขอบ = Tesla (ไม่มีปีดำเนินงาน/ผู้จำหน่าย/โลโก้)
  const b = BRANDS.find((x) => x.slug === (thin ? "tesla" : "toyota"))!;
  const st = brandStats(b.slug);
  const rows = NAMEPLATES.filter((n) => n.brandSlug === b.slug).sort(
    (x, y) => (x.priceMin ?? 0) - (y.priceMin ?? 0),
  );

  return (
    <Shell thin={thin}>
      <section className="an-hero">
        <div className="mx-auto max-w-[1220px] px-4 pt-5 pb-6 sm:px-6">
          <nav className="lk-faint text-[12px]">
            <BfLink look={LOOK} screen="home" thin={thin}>
              แบรนด์ทั้งหมด
            </BfLink>
            <span aria-hidden> › </span>
            <span style={{ color: "var(--lk-text)" }}>{b.name}</span>
          </nav>

          <div className="mt-3 flex flex-wrap items-center gap-4">
            <span
              className="grid size-16 shrink-0 place-items-center rounded-2xl border"
              style={{ borderColor: "var(--lk-line)", background: "var(--lk-panel)" }}
            >
              <BrandLogo name={b.name} logo={b.logo} size={46} />
            </span>
            <div className="min-w-0">
              <h1 className="text-[30px] leading-tight font-bold sm:text-[36px]">{b.name}</h1>
              <p className="lk-muted mt-0.5 text-[13px]">
                {b.officialName ?? "ไม่มีข้อมูลชื่อนิติบุคคล"} · ประเทศต้นทาง {b.countryOrigin}
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-5">
            <Kpi k="รุ่นใน coverage" v={st.nameplates} />
            <Kpi k="รุ่นย่อย" v={st.variants} />
            <Kpi
              k="ช่วงราคาป้าย"
              v={<span className="text-base">{st.priceMin != null ? formatTHB(st.priceMin) : "—"}</span>}
              sub={st.priceMax != null ? `ถึง ${formatTHB(st.priceMax)}` : undefined}
            />
            <Kpi
              k="ดำเนินงานในไทยตั้งแต่"
              v={b.operationYear != null ? <span>{b.operationYear}</span> : <span className="lk-faint text-base">ไม่มีข้อมูล</span>}
              sub={b.distributorName ?? undefined}
            />
            <Kpi k="ตรวจล่าสุด" v={<span className="text-base">{formatDateTH(b.checkedDate)}</span>} />
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1220px] px-4 sm:px-6">
        <section className="mt-8">
          <h2 className="text-[18px] font-bold">ราคาเริ่มต้นของรุ่นในแบรนด์นี้</h2>
          <div className="lk-panel mt-3 rounded-2xl border p-4" style={{ borderColor: "var(--lk-line)" }}>
            <PriceBars rows={rows} thin={thin} max={st.priceMax ?? SCALE} />
          </div>
        </section>

        <section className="mt-10">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-[18px] font-bold">รุ่นทั้งหมดของ {b.name}</h2>
            <span className="lk-faint text-[12px] tnum">{rows.length} รุ่น</span>
          </div>
          <div className="mt-3">
            <AnalyticsTable thin={thin} brandSlug={b.slug} />
          </div>
        </section>

        <section className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="lk-panel rounded-2xl border p-4" style={{ borderColor: "var(--lk-line)" }}>
            <h2 className="text-[15px] font-bold">ข้อมูลแบรนด์ในไทย</h2>
            <dl className="mt-2 space-y-2 text-[13px]">
              {[
                ["ผู้ผลิต/ผู้จัดจำหน่าย", b.distributorName],
                ["บริษัทแม่", b.parentCompany],
                ["ช่องทางจำหน่าย", b.channel],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-3">
                  <dt className="lk-faint w-36 shrink-0">{k}</dt>
                  <dd className={v ? "" : "lk-faint"}>{v ?? "ไม่มีข้อมูล"}</dd>
                </div>
              ))}
            </dl>
            {!b.distributorName && (
              <p className="lk-faint mt-3 text-[12px] leading-6">
                ข้อมูลนิติบุคคล/ช่องทางจำหน่ายของแบรนด์นี้ยังไม่ผ่านการตรวจกับแหล่งทางการ —
                เว็บจึงเว้นไว้แทนที่จะเดา
              </p>
            )}
          </div>

          <div className="lk-panel rounded-2xl border p-4" style={{ borderColor: "var(--lk-line)" }}>
            <h2 className="text-[15px] font-bold">ขุมพลังที่มีในไลน์อัป</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {st.powertrains.map((p) => (
                <span key={p} className="an-chip">
                  <PtDot label={p} />
                </span>
              ))}
            </div>
            <h3 className="mt-4 text-[13px] font-semibold">ทางลัด</h3>
            <ul className="mt-1.5 space-y-1 text-[13px]">
              {rows.map((n) => (
                <li key={n.slug}>
                  <BfLink look={LOOK} screen="model" thin={thin} className="lk-muted hover:text-[color:var(--lk-accent)]">
                    ราคา {b.name} {n.name} ทุกรุ่นย่อย
                  </BfLink>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </Shell>
  );
}

/* ─────────────────────────── หน้ารุ่น ─────────────────────────── */

export function AnalyticsModel({ thin }: { thin: boolean }) {
  const np = NAMEPLATES.find((n) => n.slug === (thin ? "model-3" : "hilux-travo"))!;
  const full = !thin;
  const sources = sourcesFor(np.slug);
  const skus = full ? [...HILUX_SKUS].sort((a, b) => (a.price ?? 0) - (b.price ?? 0)) : [];
  // แผนภาพจุดใช้เฉพาะรุ่นย่อยที่สเปกให้กำลังเป็น PS — รุ่นไฟฟ้าให้มาเป็น kW จึงไม่เอามาปนแกนเดียวกัน
  const scatter = skus.filter((s) => s.powerText.includes("PS"));
  const evOnly = skus.filter((s) => !s.powerText.includes("PS"));

  return (
    <Shell thin={thin}>
      <section className="an-hero">
        <div className="mx-auto max-w-[1220px] px-4 pt-5 pb-6 sm:px-6">
          <nav className="lk-faint text-[12px]">
            <BfLink look={LOOK} screen="home" thin={thin}>
              แบรนด์ทั้งหมด
            </BfLink>
            <span aria-hidden> › </span>
            <BfLink look={LOOK} screen="brand" thin={thin}>
              {np.brand}
            </BfLink>
            <span aria-hidden> › </span>
            <span style={{ color: "var(--lk-text)" }}>{np.name}</span>
          </nav>

          <div className="mt-3 grid gap-4 sm:grid-cols-[1fr_280px]">
            <div className="min-w-0">
              <p className="lk-accent text-[12px] font-semibold tracking-[0.16em] uppercase">{np.brand}</p>
              <h1 className="text-[30px] leading-tight font-bold sm:text-[38px]">{np.name}</h1>
              <p className="lk-muted mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px]">
                <span>{np.segmentLabel}</span>
                {np.powertrains.map((p) => (
                  <PtDot key={p} label={p} />
                ))}
                <span>{np.launchYear != null ? `เปิดตัวในไทย ${np.launchYear}` : "ปีเปิดตัว: ไม่มีข้อมูล"}</span>
                <span>ตรวจล่าสุด {formatDateTH(np.checkedDate)}</span>
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                <Kpi k="เริ่มต้น" v={<span className="text-lg">{np.priceMin != null ? formatTHB(np.priceMin) : "—"}</span>} />
                <Kpi k="สูงสุด" v={<span className="text-lg">{np.priceMax != null ? formatTHB(np.priceMax) : "—"}</span>} />
                <Kpi k="รุ่นย่อย" v={np.variantCount} />
                <Kpi
                  k="ห่างกัน"
                  v={<span className="text-lg">{np.priceMin != null && np.priceMax != null ? formatTHB(np.priceMax - np.priceMin) : "—"}</span>}
                  sub="ถูกสุด→แพงสุด"
                />
              </div>
            </div>
            {np.image ? (
              <div className="flex items-center justify-center">
                <Image src={np.image} alt={`${np.brand} ${np.name}`} width={280} height={158} priority className="h-auto w-full max-w-[280px] object-contain" />
              </div>
            ) : (
              <div className="lk-faint grid place-items-center text-center text-[12px]">
                ยังไม่มีรูปของรุ่นนี้ — ต้องได้สิทธิ์ใช้ภาพจากผู้ผลิตก่อน
              </div>
            )}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1220px] px-4 sm:px-6">
        {full ? (
          <>
            {/* แผนภาพจุด ราคา × กำลัง — เห็นว่ารุ่นย่อยไหนจ่ายเพิ่มแล้วได้อะไร */}
            <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="text-[18px] font-bold">จ่ายเพิ่มแล้วได้อะไร</h2>
                  <span className="lk-faint text-[12px]">
                    แกนนอน = ราคาป้าย · แกนตั้ง = ระบบช่วยขับขี่ที่ยืนยันแล้ว (0–3)
                  </span>
                </div>
                <div className="lk-panel mt-3 rounded-2xl border p-4 pb-6" style={{ borderColor: "var(--lk-line)" }}>
                  <div className="flex gap-2">
                    {/* ป้ายแกนตั้ง — ไม่มีตัวเลขกำกับ กราฟก็อ่านไม่ออก */}
                    <div className="lk-faint flex w-4 flex-col justify-between py-1 text-[11px] tnum">
                      <span>3</span>
                      <span>2</span>
                      <span>1</span>
                      <span>0</span>
                    </div>
                    <div className="an-scatter flex-1">
                    {scatter.map((s) => {
                      const x = ((s.price! - HILUX_MIN) / (HILUX_MAX - HILUX_MIN)) * 100;
                      // ทุกคันในไลน์นี้ 204 PS เท่ากัน — กระจายแนวตั้งด้วย "จำนวน ADAS ที่ยืนยันแล้ว" แทน
                      const confirmed = [s.adas.aeb, s.adas.acc, s.adas.lka].filter((v) => v === true).length;
                      const y = 12 + confirmed * 26;
                      return (
                        <span
                          key={s.key}
                          className="an-dot"
                          title={`${s.shortName} · ${formatTHB(s.price!)} · ${s.powerText} · ระบบช่วยขับขี่ที่ยืนยันแล้ว ${confirmed}/3`}
                          style={{ left: `${x}%`, bottom: `${y}%`, background: ptColor(s.powertrainText) }}
                        />
                      );
                    })}
                    </div>
                  </div>
                  <div className="lk-faint mt-2 flex justify-between pl-6 text-[11px] tnum">
                    <span>{formatTHB(HILUX_MIN)}</span>
                    <span>{formatTHB(Math.round((HILUX_MIN + HILUX_MAX) / 2))}</span>
                    <span>{formatTHB(HILUX_MAX)}</span>
                  </div>
                  <p className="lk-muted mt-3 text-[12px] leading-6">
                    ไลน์นี้ทุกรุ่นย่อยดีเซล 204 PS เท่ากัน กราฟราคา×กำลังจึงเป็นเส้นตรงไม่มีความหมาย —
                    แกนตั้งจึงใช้ <strong>จำนวนระบบช่วยขับขี่ที่ยืนยันแล้ว (AEB/ACC/LKA)</strong>{" "}
                    เพื่อให้เห็นว่าจ่ายเพิ่มแล้วได้อะไรจริง
                    {evOnly.length > 0 && (
                      <>
                        {" "}
                        · รุ่นไฟฟ้า {evOnly.length} คันไม่อยู่ในกราฟนี้ เพราะสเปกทางการให้กำลังมาเป็น kW
                        ไม่ใช่ PS — เราไม่แปลงหน่วยแทนเอกสาร
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="text-[18px] font-bold">บันไดราคา {skus.length} รุ่นย่อย</h2>
                  <span className="lk-faint text-[12px]">เรียงถูก → แพง</span>
                </div>
                <div className="lk-panel mt-3 rounded-2xl border p-4" style={{ borderColor: "var(--lk-line)" }}>
                  <div className="an-bars an-grid">
                    {skus.map((s) => (
                      <BfLink key={s.key} look={LOOK} screen="sku" thin={thin} className="an-bar-row group">
                        <span className="lk-muted truncate text-[12px] group-hover:text-[color:var(--lk-accent)]">
                          {s.shortName}
                        </span>
                        <span className="an-bar-track" style={{ height: 14 }}>
                          <span
                            className="an-bar-fill"
                            style={{
                              width: `${Math.max(((s.price! - HILUX_MIN) / (HILUX_MAX - HILUX_MIN)) * 100, 2)}%`,
                              background: ptColor(s.powertrainText),
                            }}
                          />
                        </span>
                        <span className="text-right text-[12px] font-semibold tnum">{formatTHB(s.price!)}</span>
                      </BfLink>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ตารางรุ่นย่อย */}
            <section className="mt-10">
              <h2 className="text-[18px] font-bold">ตารางรุ่นย่อยทั้งหมด</h2>
              <div className="lk-panel mt-3 hidden overflow-x-auto rounded-2xl sm:block">
                <table className="lk-table min-w-[900px] text-[13px]">
                  <thead>
                    <tr>
                      <th className="w-12 text-right">อันดับราคา</th>
                      <th>รุ่นย่อย</th>
                      <th>ตัวถัง</th>
                      <th>กำลัง · เกียร์ · ขับเคลื่อน</th>
                      <th>ระบบช่วยขับขี่</th>
                      <th className="text-right">ราคาป้าย</th>
                      <th className="text-right">Δ ถูกสุด</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skus.map((s, i) => (
                      <tr key={s.key} className="group relative">
                        <td className="text-right">
                          <span className={`an-rank ${i === 0 ? "top" : ""}`}>{i + 1}</span>
                        </td>
                        <td className="font-semibold">
                          <BfLink look={LOOK} screen="sku" thin={thin} className="after:absolute after:inset-0 group-hover:text-[color:var(--lk-accent)]">
                            {s.shortName}
                          </BfLink>
                        </td>
                        <td className="lk-muted">{s.group.replace("Travo ", "")}</td>
                        <td className="lk-muted">
                          {s.powerText} · {s.transmission} · {s.drivetrain}
                        </td>
                        <td>
                          <span className="flex gap-2">
                            <AdasMark value={s.adas.aeb} label="AEB" />
                            <AdasMark value={s.adas.acc} label="ACC" />
                            <AdasMark value={s.adas.lka} label="LKA" />
                          </span>
                        </td>
                        <td className="text-right font-bold tnum">{formatTHB(s.price!)}</td>
                        <td className="text-right text-[12px] tnum">
                          {s.price === HILUX_MIN ? (
                            <span className="lk-good">ถูกสุด</span>
                          ) : (
                            <span className="lk-muted">+{formatTHB(s.price! - HILUX_MIN)}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 sm:hidden">
                {skus.map((s, i) => (
                  <BfLink key={s.key} look={LOOK} screen="sku" thin={thin} className="lk-line flex items-start gap-3 border-b py-2.5">
                    <span className="an-rank mt-0.5 shrink-0">{i + 1}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold">{s.shortName}</span>
                      <span className="lk-faint block text-[11px]">
                        {s.group.replace("Travo ", "")} · {s.transmission} · {s.drivetrain}
                      </span>
                      <span className="mt-1 flex gap-2">
                        <AdasMark value={s.adas.aeb} label="AEB" />
                        <AdasMark value={s.adas.acc} label="ACC" />
                        <AdasMark value={s.adas.lka} label="LKA" />
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block font-bold tnum">{formatTHB(s.price!)}</span>
                      <span className="lk-faint block text-[11px] tnum">
                        {s.price === HILUX_MIN ? "ถูกสุด" : `+${formatTHB(s.price! - HILUX_MIN)}`}
                      </span>
                    </span>
                  </BfLink>
                ))}
              </div>
            </section>
          </>
        ) : (
          <p className="lk-panel lk-muted mt-8 rounded-2xl px-4 py-12 text-center text-[13px]">
            หน้าลองเก็บรุ่นย่อยละเอียดไว้เฉพาะ Hilux Travo — ปิดสวิตช์ “ข้อมูลไม่ครบ” เพื่อดูกราฟและตารางเต็ม
          </p>
        )}

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="text-[18px] font-bold">ไทม์ไลน์</h2>
            <div className="lk-panel mt-3 rounded-2xl border p-4" style={{ borderColor: "var(--lk-line)" }}>
              {full ? (
                <ol className="space-y-3 text-[13px]">
                  {TIMELINE.map((e) => (
                    <li key={e.date + e.text} className="flex gap-3">
                      <span className="lk-faint w-24 shrink-0 tnum">{formatDateTH(e.date)}</span>
                      <span>
                        <span className="an-chip mr-2 px-2 py-0.5 text-[11px]">{e.type}</span>
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
            <h2 className="text-[18px] font-bold">แหล่งอ้างอิง</h2>
            <div className="lk-panel mt-3 rounded-2xl border p-4" style={{ borderColor: "var(--lk-line)" }}>
              <ul className="space-y-2.5 text-[13px]">
                {sources.map((s) => (
                  <li key={s.id} className="lk-line border-b pb-2 last:border-b-0 last:pb-0">
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-[color:var(--lk-accent)]">
                      <span className="font-semibold">{s.publisher}</span> <span className="lk-muted">{s.title} ↗</span>
                    </a>
                    <span className="lk-faint mt-0.5 block text-[11px]">
                      ตรวจ {formatDateTH(s.checkedDate)} · ความเชื่อมั่น{s.confidence === "HIGH" ? "สูง" : "ปานกลาง"}
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

export function AnalyticsSku({ thin }: { thin: boolean }) {
  const v = skuByKey(thin ? "travo-e-double-4trex" : "double-4trex-2-8-overland-plus-at");
  const np = NAMEPLATES.find((n) => n.slug === "hilux-travo")!;
  const sorted = [...HILUX_SKUS].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  const idx = sorted.findIndex((s) => s.key === v.key);
  const cheaper = sorted[idx - 1];
  const pct = ((v.price! - HILUX_MIN) / (HILUX_MAX - HILUX_MIN)) * 100;

  return (
    <Shell thin={thin}>
      <section className="an-hero">
        <div className="mx-auto max-w-[1220px] px-4 pt-5 pb-6 sm:px-6">
          <nav className="lk-faint text-[12px]">
            <BfLink look={LOOK} screen="home" thin={thin}>
              แบรนด์ทั้งหมด
            </BfLink>
            <span aria-hidden> › </span>
            <BfLink look={LOOK} screen="brand" thin={thin}>
              {np.brand}
            </BfLink>
            <span aria-hidden> › </span>
            <BfLink look={LOOK} screen="model" thin={thin}>
              {np.name}
            </BfLink>
            <span aria-hidden> › </span>
            <span style={{ color: "var(--lk-text)" }}>{v.shortName}</span>
          </nav>

          <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-[24px] leading-tight font-bold sm:text-[30px]">{v.name}</h1>
              <p className="lk-muted mt-1.5 flex flex-wrap items-center gap-x-3 text-[13px]">
                <span>{v.group}</span>
                <PtDot label={v.powertrainText} />
                <span>{v.transmission}</span>
                <span>{v.drivetrain}</span>
                <span>{v.seats} ที่นั่ง</span>
              </p>
            </div>
            <div className="text-right">
              <p className="lk-faint text-[11px] tracking-[0.08em] uppercase">ราคาป้ายทางการ</p>
              <p className="text-[32px] leading-none font-bold tnum">{formatTHB(v.price!)}</p>
              <p className="lk-muted mt-1 text-[12px] tnum">ณ {formatDateTH(np.checkedDate)}</p>
            </div>
          </div>

          <div className="mt-4">
            <span className="an-bar-track block" style={{ height: 14 }}>
              <span className="an-bar-fill" style={{ width: `${Math.max(pct, 2)}%` }} />
            </span>
            <p className="lk-faint mt-1 flex justify-between text-[11px] tnum">
              <span>ถูกสุดในรุ่น {formatTHB(HILUX_MIN)}</span>
              <span>
                อันดับราคา {idx + 1}/{sorted.length}
              </span>
              <span>แพงสุด {formatTHB(HILUX_MAX)}</span>
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1220px] px-4 sm:px-6">
        {cheaper && (
          <section className="mt-6">
            <div className="lk-panel rounded-2xl border p-4" style={{ borderColor: "var(--lk-accent)", background: "var(--lk-accent-soft)" }}>
              <p className="text-[14px] leading-7">
                เทียบกับรุ่นย่อยที่ถูกกว่าหนึ่งขั้น (<strong>{cheaper.shortName}</strong>{" "}
                {formatTHB(cheaper.price!)}) — รุ่นนี้แพงกว่า{" "}
                <strong className="tnum">{formatTHB(v.price! - cheaper.price!)}</strong>{" "}
                {(() => {
                  const gained = ADAS_FEATURES.filter(
                    (f) =>
                      v.adas[f.key.toLowerCase() as "aeb" | "acc" | "lka"] === true &&
                      cheaper.adas[f.key.toLowerCase() as "aeb" | "acc" | "lka"] !== true,
                  );
                  return gained.length > 0
                    ? `และได้ ${gained.map((f) => f.key).join(" · ")} เพิ่มตามสเปกทางการ`
                    : "โดยชุดช่วยขับขี่ที่ยืนยันแล้วเท่ากัน (ต่างที่ตัวถัง/ระบบขับเคลื่อน)";
                })()}
              </p>
            </div>
          </section>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <h2 className="text-[18px] font-bold">สเปก</h2>
            <div className="lk-panel mt-3 rounded-2xl border px-4 py-2" style={{ borderColor: "var(--lk-line)" }}>
              {[
                ["ขุมพลัง", v.powertrainText],
                ["กำลังสูงสุด", v.powerText],
                ["ระบบส่งกำลัง", v.transmission],
                ["ระบบขับเคลื่อน", v.drivetrain],
                ["จำนวนที่นั่ง", String(v.seats)],
                ["ตัวถัง", v.group],
                ["มิติตัวถัง (ก×ย×ส)", "ไม่มีข้อมูล"],
              ].map(([k, val]) => (
                <div key={k} className="lk-spec">
                  <dt>{k}</dt>
                  <span className="dots" aria-hidden />
                  <dd className={val === "ไม่มีข้อมูล" ? "lk-faint" : ""}>{val}</dd>
                </div>
              ))}
            </div>

            <h2 className="mt-8 text-[18px] font-bold">ระบบช่วยขับขี่</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {ADAS_FEATURES.map((f) => {
                const has = v.adas[f.key.toLowerCase() as "aeb" | "acc" | "lka"];
                const color = has === true ? "var(--lk-good)" : has === false ? "var(--lk-faint)" : "var(--lk-warn)";
                return (
                  <div key={f.key} className="lk-panel rounded-xl border p-3" style={{ borderColor: "var(--lk-line)", borderTopColor: color, borderTopWidth: 2 }}>
                    <p className="text-[12px] font-bold" style={{ color }}>
                      {has === true ? "มี" : has === false ? "ไม่มี" : "สเปกไม่ระบุ"}
                    </p>
                    <p className="mt-1 text-[13px] font-medium">{f.nameTh}</p>
                    <p className="lk-faint mt-0.5 text-[11px]">{has === true ? f.marketing : f.key}</p>
                  </div>
                );
              })}
            </div>
            <p className="lk-faint mt-2 text-[12px]">“สเปกไม่ระบุ” ไม่เท่ากับ “ไม่มี” — ไม่เดาแทนเอกสารทางการ</p>
          </div>

          <div>
            <h2 className="text-[18px] font-bold">ประวัติราคา</h2>
            <div className="lk-panel mt-3 rounded-2xl border p-4" style={{ borderColor: "var(--lk-line)" }}>
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

            <h2 className="mt-8 text-[18px] font-bold">รุ่นย่อยข้างเคียง</h2>
            <div className="lk-panel mt-3 overflow-hidden rounded-2xl border" style={{ borderColor: "var(--lk-line)" }}>
              {sorted.slice(Math.max(idx - 2, 0), idx + 3).map((s) => (
                <BfLink
                  key={s.key}
                  look={LOOK}
                  screen="sku"
                  thin={thin}
                  className={`lk-line flex items-center justify-between gap-3 border-b px-3.5 py-2.5 text-[13px] last:border-b-0 ${
                    s.key === v.key ? "font-bold" : "lk-muted"
                  }`}
                >
                  <span className="truncate">{s.shortName}</span>
                  <span className="shrink-0 tnum">{formatTHB(s.price!)}</span>
                </BfLink>
              ))}
            </div>
          </div>
        </div>
      </main>
    </Shell>
  );
}
