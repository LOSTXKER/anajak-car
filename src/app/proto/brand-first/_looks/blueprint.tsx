// ── H · BLUEPRINT — หน้าตา "แบบแปลนวิศวกรรม" (สว่าง น้ำเงินทั้งหน้า) ─────────
// รอบนี้ปรับ flow ตามที่เบสสั่ง: หน้าแรกให้ "เลือกแบรนด์" เป็นทางเข้าหลัก + เพิ่มหน้าแบรนด์เต็ม
// บุคลิก: กระดาษแบบแปลนสีน้ำเงิน · เส้นตารางจางทั้งหน้า · กรอบมุมตัด · เลขข้อกำกับ ·
// ทุกหน้าปิดท้ายด้วย "ช่องรับรอง" (title block) ที่บอกที่มา วันที่ตรวจ และความเชื่อมั่น
// เหตุผลที่เข้ากับ CARMETA: ตัวตนของเว็บคือ "ตรวจสอบได้" — หน้าตาแบบเอกสารเทคนิคพูดเรื่องนี้ได้เองโดยไม่ต้องโฆษณา
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
  brandStats,
  skuByKey,
  sourcesFor,
} from "../../_kit/data";
import { AdasMark, BfLink as LookLink, BrandLogo, PtDot, shortTHB } from "./kit";

const LOOK = "blueprint" as const;

function Shell({ thin, children }: { thin: boolean; children: React.ReactNode }) {
  return (
    <div className="look look-blueprint">
      <header className="lk-bar sticky top-0 z-40">
        <div className="mx-auto flex h-14 max-w-[1180px] items-center gap-4 px-4 sm:px-6">
          <LookLink look={LOOK} screen="home" thin={thin} className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="grid size-7 place-items-center border text-[12px] font-bold"
              style={{ borderColor: "var(--lk-accent)", color: "var(--lk-accent)" }}
            >
              C
            </span>
            <span className="text-[15px] font-bold tracking-[0.2em]">CARMETA</span>
          </LookLink>
          <span className="lk-faint hidden font-mono text-[11px] tracking-wider sm:inline">
            THAILAND CAR DATABASE · REV {formatDateTH(TOTALS.latestChecked)}
          </span>
          <label className="relative ml-auto w-full max-w-[280px]">
            <span className="sr-only">ค้นหา</span>
            <input
              className="lk-input w-full px-3 py-1.5 font-mono text-[12px] outline-none"
              placeholder="ค้นหา: รุ่น / เกรด / รหัส"
            />
          </label>
        </div>
      </header>
      {children}
      <footer className="mx-auto max-w-[1180px] px-4 pb-10 sm:px-6">
        <div className="lk-panel lk-cut mt-8 grid gap-3 p-4 text-[12px] sm:grid-cols-3">
          <div>
            <p className="lk-faint font-mono text-[10px] tracking-wider uppercase">เอกสารนี้แสดงราคาชนิด</p>
            <p className="mt-0.5 font-semibold">ราคาป้ายทางการจากผู้ผลิต</p>
            <p className="lk-muted mt-0.5">ไม่ใช่ราคาซื้อขายจริง ไม่รวมส่วนลด/โปรโมชัน</p>
          </div>
          <div>
            <p className="lk-faint font-mono text-[10px] tracking-wider uppercase">ค่าที่ยังไม่มีหลักฐาน</p>
            <p className="mt-0.5 font-semibold">แสดงว่า “ไม่มีข้อมูล”</p>
            <p className="lk-muted mt-0.5">ไม่เดา ไม่ใส่ 0 แทนค่าที่ยังไม่ยืนยัน</p>
          </div>
          <div>
            <p className="lk-faint font-mono text-[10px] tracking-wider uppercase">ตรวจล่าสุด</p>
            <p className="mt-0.5 font-semibold tnum">{formatDateTH(TOTALS.latestChecked)}</p>
            <p className="lk-muted mt-0.5">ตรวจซ้ำกับหน้าทางการเป็นรอบ</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/** หัวข้อแบบแปลน: เลขข้อ + ชื่อ + เส้นลากยาว */
function Head({ idx, children }: { idx: string; children: React.ReactNode }) {
  return (
    <h2 className="lk-head mt-8 text-[15px]">
      <span className="idx">{idx}</span>
      {children}
    </h2>
  );
}

/* ─────────────────────────── หน้าแรก ─────────────────────────── */

export function BlueprintHome({ thin }: { thin: boolean }) {
  const rows = thin ? [] : [...NAMEPLATES].sort((a, b) => (a.priceMin ?? 0) - (b.priceMin ?? 0));

  return (
    <Shell thin={thin}>
      <main className="mx-auto max-w-[1180px] px-4 pt-6 sm:px-6">
        {/* แผ่นหัวเอกสาร */}
        <section className="lk-panel lk-cut relative overflow-hidden p-5 sm:p-7">
          <div className="grid gap-5 sm:grid-cols-[1fr_300px]">
            <div>
              <p className="lk-accent font-mono text-[11px] tracking-[0.2em]">DOC-01 · ดัชนีรุ่นรถในไทย</p>
              <h1 className="mt-2 text-[30px] leading-tight font-bold sm:text-[38px]">
                ข้อมูลรถที่<span className="lk-accent">ตรวจสอบได้ทุกบรรทัด</span>
              </h1>
              <p className="lk-muted mt-2 max-w-lg text-[14px] leading-7">
                ราคาป้ายทางการ สเปก และรุ่นย่อยทุกแบบ จัดเป็นเอกสารอ่านง่าย —
                ทุกค่ามีที่มา วันที่ตรวจ และระดับความเชื่อมั่นกำกับ
              </p>
              <dl className="mt-5 grid max-w-lg grid-cols-2 gap-x-6 sm:grid-cols-4">
                {[
                  ["รุ่น", TOTALS.nameplates],
                  ["รุ่นย่อย", TOTALS.variants],
                  ["แบรนด์", TOTALS.brands],
                  // เขียนช่วงราคาติดกันแล้วตกบรรทัดบนมือถือ — ใช้ค่าต่ำสุดเป็นตัวหลัก
                  ["ช่วงราคาต่ำสุด", formatTHB(569000)],
                ].map(([k, v]) => (
                  <div key={String(k)}>
                    <dt className="lk-faint font-mono text-[10px] tracking-wider uppercase">{k}</dt>
                    <dd className="mt-0.5 text-xl font-bold tnum">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="lk-faint mt-2 font-mono text-[11px] tnum">
                ราคาสูงสุดในเอกสารชุดนี้ {formatTHB(7580000)}
              </p>
            </div>
            <div className="relative hidden items-center justify-center sm:flex">
              <Image src="/cars/hilux-travo.webp" alt="" width={300} height={168} priority className="h-auto w-[300px] object-contain" />
              {/* เส้นบอกระยะแบบแบบแปลน */}
              <span aria-hidden className="pointer-events-none absolute inset-x-2 bottom-2 flex items-center gap-2">
                <span className="h-px flex-1" style={{ background: "var(--lk-accent)" }} />
                <span className="lk-accent font-mono text-[10px]">ภาพจากผู้ผลิต</span>
                <span className="h-px flex-1" style={{ background: "var(--lk-accent)" }} />
              </span>
            </div>
          </div>
        </section>

        {/* ทางเข้าหลัก = แบรนด์ (เบสเคาะ: คนชอบเลือกหมวดมากกว่าค้นหา) */}
        <Head idx="01">เลือกแบรนด์</Head>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {BRANDS.map((b) => {
            const st = brandStats(b.slug);
            return (
              <LookLink
                key={b.slug}
                look={LOOK}
                screen="brand"
                thin={thin}
                className="lk-panel lk-cut block p-4 transition-colors hover:border-[color:var(--lk-accent)]"
              >
                <span className="flex items-center gap-3">
                  <span
                    className="grid h-12 w-16 shrink-0 place-items-center border"
                    style={{ borderColor: "var(--lk-line)", background: "var(--lk-panel)" }}
                  >
                    <BrandLogo name={b.name} logo={b.logo} size={34} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[16px] font-bold">{b.name}</span>
                    <span className="lk-faint block font-mono text-[11px] tnum">
                      {st.nameplates} รุ่น · {st.variants} รุ่นย่อย
                    </span>
                  </span>
                  <span aria-hidden className="lk-accent ml-auto">→</span>
                </span>
                <span className="lk-line mt-3 block border-t pt-2.5 font-mono text-[11px]">
                  <span className="lk-faint block tracking-wider uppercase">ช่วงราคาป้าย</span>
                  <span className="mt-0.5 block text-[14px] font-bold tnum">
                    {st.priceMin != null && st.priceMax != null
                      ? `${formatTHB(st.priceMin)} – ${formatTHB(st.priceMax)}`
                      : "ไม่มีข้อมูล"}
                  </span>
                </span>
              </LookLink>
            );
          })}
        </div>

        {/* ตัวกรองแบบแถบเอกสาร */}
        <div className="lk-line mt-6 flex flex-wrap items-center gap-2 border-b pb-2 font-mono text-[12px]">
          <span className="lk-faint">FILTER:</span>
          {["ทั้งหมด", "กระบะ", "PPV", "SUV", "ซีดาน"].map((t, i) => (
            <span key={t} className={i === 0 ? "lk-accent-bg px-2 py-0.5" : "lk-muted px-2 py-0.5"}>
              {t}
            </span>
          ))}
          <span className="lk-faint ml-auto tnum">
            {rows.length} รายการ · เรียงตามราคาเริ่มต้น
          </span>
        </div>

        {rows.length === 0 ? (
          <p className="lk-panel lk-muted mt-4 px-6 py-16 text-center text-[13px]">
            ไม่มีรายการที่ตรงเงื่อนไขนี้ในเอกสารชุดปัจจุบัน
          </p>
        ) : (
          <>
            <div className="mt-4 hidden overflow-x-auto sm:block">
              <table className="lk-table lk-panel min-w-[900px] font-[inherit] text-[13px]">
                <thead>
                  <tr>
                    <th className="w-12 text-right">ข้อ</th>
                    <th>รุ่น / แบรนด์</th>
                    <th>ประเภท</th>
                    <th>ขุมพลัง</th>
                    <th className="text-right">ราคาเริ่มต้น</th>
                    <th className="text-right">ราคาสูงสุด</th>
                    <th className="text-right">รุ่นย่อย</th>
                    <th className="text-right">ตรวจเมื่อ</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((n, i) => (
                    <tr key={n.slug} className="group relative">
                      <td className="lk-faint text-right font-mono tnum">
                        {String(i + 1).padStart(2, "0")}
                      </td>
                      <td>
                        <LookLink
                          look={LOOK}
                          screen="model"
                          thin={thin}
                          className="font-semibold after:absolute after:inset-0 group-hover:text-[color:var(--lk-accent)]"
                        >
                          {n.name}
                        </LookLink>
                        <span className="lk-faint ml-2 font-mono text-[11px] tracking-wide uppercase">{n.brand}</span>
                      </td>
                      <td className="lk-muted">{n.segmentLabel}</td>
                      <td className="lk-muted">
                        <span className="flex flex-wrap gap-x-3">
                          {n.powertrains.map((p) => (
                            <PtDot key={p} label={p} />
                          ))}
                        </span>
                      </td>
                      <td className="text-right font-bold tnum">
                        {n.priceMin != null ? formatTHB(n.priceMin) : <span className="lk-faint">ไม่มีข้อมูล</span>}
                      </td>
                      <td className="lk-muted text-right tnum">
                        {n.priceMax != null ? formatTHB(n.priceMax) : "—"}
                      </td>
                      <td className="text-right tnum">{n.variantCount}</td>
                      <td className="lk-faint text-right font-mono text-[11px] tnum">
                        {formatDateTH(n.checkedDate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 sm:hidden">
              {rows.map((n, i) => (
                <LookLink
                  key={n.slug}
                  look={LOOK}
                  screen="model"
                  thin={thin}
                  className="lk-line flex items-start gap-3 border-b py-2.5"
                >
                  <span className="lk-faint w-6 shrink-0 pt-0.5 font-mono text-[11px] tnum">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{n.name}</span>
                    <span className="lk-faint block font-mono text-[11px] tracking-wide uppercase">
                      {n.brand} · {n.segmentLabel} · {n.variantCount} รุ่นย่อย
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block font-bold tnum">{n.priceMin != null ? shortTHB(n.priceMin) : "—"}</span>
                    <span className="lk-faint block text-[11px] tnum">
                      ถึง {n.priceMax != null ? shortTHB(n.priceMax) : "—"}
                    </span>
                  </span>
                </LookLink>
              ))}
            </div>
          </>
        )}

        <Head idx="03">ดัชนีรุ่นทั้งหมด แยกตามแบรนด์</Head>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          {BRANDS.map((b) => (
            <div key={b.slug} className="lk-panel lk-cut p-4">
              <p className="lk-accent font-mono text-[11px] tracking-wider uppercase">{b.name}</p>
              <ul className="mt-2 space-y-1 text-[13px]">
                {NAMEPLATES.filter((n) => n.brandSlug === b.slug).map((n) => (
                  <li key={n.slug} className="flex items-baseline gap-2">
                    <LookLink look={LOOK} screen="model" thin={thin} className="lk-muted hover:text-[color:var(--lk-accent)]">
                      {n.name}
                    </LookLink>
                    <span className="lk-line flex-1 border-b border-dotted" aria-hidden />
                    <span className="lk-faint text-[11px] tnum">
                      {n.priceMin != null ? shortTHB(n.priceMin) : "—"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </Shell>
  );
}

/* ─────────────────────────── หน้ารุ่น ─────────────────────────── */

export function BlueprintModel({ thin }: { thin: boolean }) {
  const np = NAMEPLATES.find((n) => n.slug === (thin ? "model-3" : "hilux-travo"))!;
  const full = !thin;
  const sources = sourcesFor(np.slug);
  const skus = full ? [...HILUX_SKUS].sort((a, b) => (a.price ?? 0) - (b.price ?? 0)) : [];

  return (
    <Shell thin={thin}>
      <main className="mx-auto max-w-[1180px] px-4 pt-5 sm:px-6">
        <nav className="lk-faint font-mono text-[11px] tracking-wider uppercase">
          <LookLink look={LOOK} screen="home" thin={thin}>
            ดัชนี
          </LookLink>
          <span aria-hidden> / </span>
          <LookLink look={LOOK} screen="brand" thin={thin}>
            {np.brand}
          </LookLink>
          <span aria-hidden> / </span>
          <span style={{ color: "var(--lk-text)" }}>{np.name}</span>
        </nav>

        {/* แผ่นหัวรุ่น */}
        <header className="lk-panel lk-cut mt-3 p-5 sm:p-7">
          <div className="grid gap-5 sm:grid-cols-[1fr_290px]">
            <div className="min-w-0">
              <p className="lk-accent font-mono text-[11px] tracking-[0.2em]">
                SHEET · {np.brand.toUpperCase()} / {np.name.toUpperCase()}
              </p>
              <h1 className="mt-1.5 text-[32px] leading-none font-bold sm:text-[42px]">{np.name}</h1>
              <p className="lk-muted mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px]">
                <span>{np.segmentLabel}</span>
                {np.powertrains.map((p) => (
                  <PtDot key={p} label={p} />
                ))}
                <span>{np.launchYear != null ? `เปิดตัวในไทย ${np.launchYear}` : "ปีเปิดตัว: ไม่มีข้อมูล"}</span>
              </p>

              <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
                {[
                  ["ราคาเริ่มต้น", np.priceMin != null ? formatTHB(np.priceMin) : "ไม่มีข้อมูล"],
                  ["ราคาสูงสุด", np.priceMax != null ? formatTHB(np.priceMax) : "ไม่มีข้อมูล"],
                  ["รุ่นย่อย", `${np.variantCount}`],
                  [
                    "ส่วนต่างในไลน์",
                    np.priceMin != null && np.priceMax != null ? formatTHB(np.priceMax - np.priceMin) : "—",
                  ],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="lk-faint font-mono text-[10px] tracking-wider uppercase">{k}</dt>
                    <dd className="mt-0.5 text-[17px] font-bold tnum">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="relative flex items-center justify-center">
              {np.image ? (
                <>
                  <Image src={np.image} alt={`${np.brand} ${np.name}`} width={290} height={165} priority className="h-auto w-full max-w-[290px] object-contain" />
                  <span aria-hidden className="pointer-events-none absolute inset-x-0 -bottom-1 flex items-center gap-2">
                    <span className="h-px flex-1" style={{ background: "var(--lk-accent)" }} />
                    <span className="lk-accent font-mono text-[10px]">
                      {full ? `${skus.length} รุ่นย่อย` : "ภาพจากผู้ผลิต"}
                    </span>
                    <span className="h-px flex-1" style={{ background: "var(--lk-accent)" }} />
                  </span>
                </>
              ) : (
                <p className="lk-faint max-w-[220px] text-center text-[12px]">
                  ยังไม่มีภาพของรุ่นนี้ในเอกสาร — ต้องได้สิทธิ์ใช้ภาพจากผู้ผลิตก่อน
                </p>
              )}
            </div>
          </div>
        </header>

        <Head idx="01">ข้อมูลทั่วไป</Head>
        <p className="lk-muted mt-3 max-w-3xl text-[14px] leading-7">{np.summary}</p>

        <Head idx="02">ตารางรุ่นย่อยและราคา</Head>
        {full ? (
          <>
            <div className="mt-3 hidden overflow-x-auto sm:block">
              <table className="lk-table lk-panel min-w-[880px] text-[13px]">
                <thead>
                  <tr>
                    <th className="w-12 text-right">ข้อ</th>
                    <th>รุ่นย่อย</th>
                    <th>ตัวถัง</th>
                    <th>กำลัง · เกียร์ · ขับเคลื่อน</th>
                    <th>ระบบช่วยขับขี่</th>
                    <th className="text-right">ราคาป้าย</th>
                    <th className="text-right">Δ ถูกสุด</th>
                  </tr>
                </thead>
                <tbody>
                  {skus.map((v, i) => (
                    <tr key={v.key} className="group relative">
                      <td className="lk-faint text-right font-mono tnum">{String(i + 1).padStart(2, "0")}</td>
                      <td className="font-semibold">
                        <LookLink look={LOOK} screen="sku" thin={thin} className="after:absolute after:inset-0 group-hover:text-[color:var(--lk-accent)]">
                          {v.shortName}
                        </LookLink>
                      </td>
                      <td className="lk-muted">{v.group.replace("Travo ", "")}</td>
                      <td className="lk-muted">
                        {v.powerText} · {v.transmission} · {v.drivetrain}
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
              {skus.map((v, i) => (
                <LookLink key={v.key} look={LOOK} screen="sku" thin={thin} className="lk-line flex items-start gap-3 border-b py-2.5">
                  <span className="lk-faint w-6 shrink-0 pt-0.5 font-mono text-[11px] tnum">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{v.shortName}</span>
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
            เอกสารชุดนี้ยังไม่ได้แตกรุ่นย่อยของรุ่นดังกล่าว
          </p>
        )}
        <p className="lk-faint mt-2 text-[12px]">
          ✓ = สเปกทางการระบุว่ามี · – = ระบุว่าไม่มี · ? = สเปกไม่ระบุ (ไม่ใช่ “ไม่มี”)
        </p>

        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <Head idx="03">บันทึกการเปลี่ยนแปลง</Head>
            <ol className="mt-3">
              {(full ? TIMELINE : []).map((e, i) => (
                <li key={e.date + e.text} className="lk-line flex gap-3 border-b py-2.5 text-[13px]">
                  <span className="lk-faint w-6 shrink-0 font-mono tnum">{String(i + 1).padStart(2, "0")}</span>
                  <span className="lk-faint w-24 shrink-0 tnum">{formatDateTH(e.date)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="lk-accent mr-2 font-mono text-[11px] uppercase">{e.type}</span>
                    {e.text}
                  </span>
                </li>
              ))}
              {!full && <li className="lk-muted py-2 text-[13px]">ยังไม่มีเหตุการณ์ที่ยืนยันของรุ่นนี้</li>}
            </ol>
          </div>
          <div>
            <Head idx="04">ช่องรับรองข้อมูล</Head>
            <div className="lk-panel lk-cut mt-3 p-4">
              <ul className="space-y-2.5 text-[13px]">
                {sources.map((s, i) => (
                  <li key={s.id} className="lk-line border-b pb-2.5 last:border-b-0 last:pb-0">
                    <span className="lk-faint mr-2 font-mono text-[11px]">{String(i + 1).padStart(2, "0")}</span>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-[color:var(--lk-accent)]">
                      {s.publisher} ↗
                    </a>
                    <span className="lk-muted block pl-7">{s.title}</span>
                    <span className="lk-faint block pl-7 font-mono text-[11px] tnum">
                      ตรวจ {formatDateTH(s.checkedDate)} · ความเชื่อมั่น{s.confidence === "HIGH" ? "สูง" : "ปานกลาง"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </Shell>
  );
}

/* ────────────────────────── หน้ารุ่นย่อย ────────────────────────── */

export function BlueprintSku({ thin }: { thin: boolean }) {
  const v = skuByKey(thin ? "travo-e-double-4trex" : "double-4trex-2-8-overland-plus-at");
  const np = NAMEPLATES.find((n) => n.slug === "hilux-travo")!;
  const siblings = HILUX_SKUS.filter((s) => s.group === v.group);
  const pct = ((v.price! - HILUX_MIN) / (HILUX_MAX - HILUX_MIN)) * 100;

  return (
    <Shell thin={thin}>
      <main className="mx-auto max-w-[1180px] px-4 pt-5 sm:px-6">
        <nav className="lk-faint font-mono text-[11px] tracking-wider uppercase">
          <LookLink look={LOOK} screen="home" thin={thin}>
            ดัชนี
          </LookLink>
          <span aria-hidden> / </span>
          <LookLink look={LOOK} screen="model" thin={thin}>
            {np.name}
          </LookLink>
          <span aria-hidden> / </span>
          <span style={{ color: "var(--lk-text)" }}>{v.shortName}</span>
        </nav>

        <header className="lk-panel lk-cut mt-3 p-5 sm:p-6">
          <p className="lk-accent font-mono text-[11px] tracking-[0.2em]">
            SHEET · {np.name.toUpperCase()} / รุ่นย่อย
          </p>
          <div className="mt-1.5 flex flex-wrap items-start justify-between gap-4">
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
              <p className="lk-faint font-mono text-[10px] tracking-wider uppercase">ราคาป้ายทางการ</p>
              <p className="text-[30px] leading-none font-bold tnum">{formatTHB(v.price!)}</p>
              <p className="lk-muted mt-1 font-mono text-[11px] tnum">ณ {formatDateTH(np.checkedDate)}</p>
            </div>
          </div>

          <div className="mt-5">
            <div className="lk-meter">
              <span style={{ left: 0, width: `${Math.max(pct, 2)}%` }} />
            </div>
            <p className="lk-faint mt-1 flex justify-between font-mono text-[11px] tnum">
              <span>MIN {formatTHB(HILUX_MIN)}</span>
              <span>ตำแหน่งราคาในไลน์อัป</span>
              <span>MAX {formatTHB(HILUX_MAX)}</span>
            </p>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <Head idx="01">ตารางสเปก</Head>
            <dl className="lk-panel mt-3 px-4 py-2">
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
            </dl>
          </div>

          <div>
            <Head idx="02">ระบบช่วยขับขี่</Head>
            <div className="lk-panel mt-3">
              {ADAS_FEATURES.map((f, i) => {
                const has = v.adas[f.key.toLowerCase() as "aeb" | "acc" | "lka"];
                const color = has === true ? "var(--lk-good)" : has === false ? "var(--lk-faint)" : "var(--lk-warn)";
                return (
                  <div key={f.key} className="lk-line flex items-start gap-3 border-b px-4 py-3 text-[13px] last:border-b-0">
                    <span className="lk-faint w-6 shrink-0 font-mono text-[11px]">{String(i + 1).padStart(2, "0")}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">{f.nameTh}</span>
                      <span className="lk-faint block font-mono text-[11px]">{f.key}</span>
                    </span>
                    <span className="shrink-0 font-semibold" style={{ color }}>
                      {has === true ? "มี" : has === false ? "ไม่มี" : "สเปกไม่ระบุ"}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="lk-faint mt-2 text-[12px]">“สเปกไม่ระบุ” ไม่เท่ากับ “ไม่มี” — ไม่เดาแทนเอกสารทางการ</p>
          </div>

          <div>
            <Head idx="03">ประวัติราคา (ไม่เขียนทับ)</Head>
            <table className="lk-table lk-panel mt-3 text-[13px]">
              <thead>
                <tr>
                  <th>วันที่บันทึก</th>
                  <th className="text-right">ราคาป้าย</th>
                  <th>ที่มา</th>
                </tr>
              </thead>
              <tbody>
                {PRICE_HISTORY.map((h) => (
                  <tr key={h.date}>
                    <td className="lk-faint tnum">{formatDateTH(h.date)}</td>
                    <td className="text-right font-bold tnum">{formatTHB(v.price ?? h.amount)}</td>
                    <td>
                      <a href={h.url} target="_blank" rel="noopener noreferrer" className="lk-accent text-[12px]">
                        {h.publisher} ↗
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <Head idx="04">รุ่นย่อยตัวถังเดียวกัน</Head>
            <div className="lk-panel mt-3">
              {siblings.map((s) => (
                <LookLink
                  key={s.key}
                  look={LOOK}
                  screen="sku"
                  thin={thin}
                  className={`lk-line flex items-baseline gap-2 border-b px-4 py-2 text-[13px] last:border-b-0 ${
                    s.key === v.key ? "lk-soft-bg font-bold" : ""
                  }`}
                >
                  <span className="truncate">{s.shortName}</span>
                  <span className="lk-line flex-1 border-b border-dotted" aria-hidden />
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

/* ─────────────────────────── หน้าแบรนด์ ─────────────────────────── */

export function BlueprintBrand({ thin }: { thin: boolean }) {
  // ปกติ = Toyota (ข้อมูลแบรนด์ครบ) · สถานะขอบ = Tesla (ไม่มีปีดำเนินงาน/ผู้จำหน่าย/โลโก้)
  const b = BRANDS.find((x) => x.slug === (thin ? "tesla" : "toyota"))!;
  const st = brandStats(b.slug);
  const rows = NAMEPLATES.filter((n) => n.brandSlug === b.slug).sort(
    (x, y) => (x.priceMin ?? 0) - (y.priceMin ?? 0),
  );

  return (
    <Shell thin={thin}>
      <main className="mx-auto max-w-[1180px] px-4 pt-5 sm:px-6">
        <nav className="lk-faint font-mono text-[11px] tracking-wider uppercase">
          <LookLink look={LOOK} screen="home" thin={thin}>
            ดัชนี
          </LookLink>
          <span aria-hidden> / </span>
          <span style={{ color: "var(--lk-text)" }}>{b.name}</span>
        </nav>

        {/* แผ่นหัวแบรนด์ */}
        <header className="lk-panel lk-cut mt-3 p-5 sm:p-6">
          <p className="lk-accent font-mono text-[11px] tracking-[0.2em]">
            SHEET · BRAND / {b.name.toUpperCase()}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <span
              className="grid size-16 shrink-0 place-items-center border"
              style={{ borderColor: "var(--lk-line)", background: "var(--lk-panel)" }}
            >
              <BrandLogo name={b.name} logo={b.logo} size={44} />
            </span>
            <div className="min-w-0">
              <h1 className="text-[30px] leading-none font-bold sm:text-[36px]">{b.name}</h1>
              <p className="lk-muted mt-1 text-[13px]">
                {b.officialName ?? "ไม่มีข้อมูลชื่อนิติบุคคล"} · ต้นทาง {b.countryOrigin}
              </p>
            </div>
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
            {[
              ["รุ่นใน coverage", String(st.nameplates)],
              ["รุ่นย่อย", String(st.variants)],
              ["ราคาเริ่มต้นต่ำสุด", st.priceMin != null ? formatTHB(st.priceMin) : "ไม่มีข้อมูล"],
              ["ดำเนินงานในไทยตั้งแต่", b.operationYear != null ? String(b.operationYear) : "ไม่มีข้อมูล"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="lk-faint font-mono text-[10px] tracking-wider uppercase">{k}</dt>
                <dd className={`mt-0.5 text-[17px] font-bold tnum ${v === "ไม่มีข้อมูล" ? "lk-faint" : ""}`}>{v}</dd>
              </div>
            ))}
          </dl>
        </header>

        <Head idx="01">รุ่นทั้งหมดของแบรนด์นี้</Head>
        <div className="mt-3 hidden overflow-x-auto sm:block">
          <table className="lk-table lk-panel min-w-[820px] text-[13px]">
            <thead>
              <tr>
                <th className="w-12 text-right">ข้อ</th>
                <th>รุ่น</th>
                <th>ประเภท</th>
                <th>ขุมพลัง</th>
                <th className="text-right">ราคาเริ่มต้น</th>
                <th className="text-right">ราคาสูงสุด</th>
                <th className="text-right">รุ่นย่อย</th>
                <th className="text-right">ตรวจเมื่อ</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((n, i) => (
                <tr key={n.slug} className="group relative">
                  <td className="lk-faint text-right font-mono tnum">{String(i + 1).padStart(2, "0")}</td>
                  <td className="font-semibold">
                    <LookLink look={LOOK} screen="model" thin={thin} className="after:absolute after:inset-0 group-hover:text-[color:var(--lk-accent)]">
                      {n.name}
                    </LookLink>
                  </td>
                  <td className="lk-muted">{n.segmentLabel}</td>
                  <td className="lk-muted">
                    <span className="flex flex-wrap gap-x-3">
                      {n.powertrains.map((p) => (
                        <PtDot key={p} label={p} />
                      ))}
                    </span>
                  </td>
                  <td className="text-right font-bold tnum">
                    {n.priceMin != null ? formatTHB(n.priceMin) : <span className="lk-faint">ไม่มีข้อมูล</span>}
                  </td>
                  <td className="lk-muted text-right tnum">{n.priceMax != null ? formatTHB(n.priceMax) : "—"}</td>
                  <td className="text-right tnum">{n.variantCount}</td>
                  <td className="lk-faint text-right font-mono text-[11px] tnum">{formatDateTH(n.checkedDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 sm:hidden">
          {rows.map((n, i) => (
            <LookLink key={n.slug} look={LOOK} screen="model" thin={thin} className="lk-line flex items-start gap-3 border-b py-2.5">
              <span className="lk-faint w-6 shrink-0 pt-0.5 font-mono text-[11px] tnum">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{n.name}</span>
                <span className="lk-faint block font-mono text-[11px] tracking-wide uppercase">
                  {n.segmentLabel} · {n.variantCount} รุ่นย่อย
                </span>
              </span>
              <span className="shrink-0 text-right">
                <span className="block font-bold tnum">{n.priceMin != null ? shortTHB(n.priceMin) : "—"}</span>
                <span className="lk-faint block text-[11px] tnum">ถึง {n.priceMax != null ? shortTHB(n.priceMax) : "—"}</span>
              </span>
            </LookLink>
          ))}
        </div>

        <Head idx="02">ข้อมูลแบรนด์ในไทย</Head>
        <div className="lk-panel lk-cut mt-3 p-4">
          <dl className="grid gap-x-8 gap-y-3 text-[13px] sm:grid-cols-2">
            {[
              ["ผู้ผลิต/ผู้จัดจำหน่าย", b.distributorName],
              ["บริษัทแม่", b.parentCompany],
              ["ช่องทางจำหน่าย", b.channel],
              ["ประเทศต้นทาง", b.countryOrigin],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="lk-faint font-mono text-[10px] tracking-wider uppercase">{k}</dt>
                <dd className={`mt-0.5 ${v ? "font-medium" : "lk-faint"}`}>{v ?? "ไม่มีข้อมูล"}</dd>
              </div>
            ))}
          </dl>
          {!b.distributorName && (
            <p className="lk-faint mt-3 text-[12px] leading-6">
              ข้อมูลนิติบุคคล/ช่องทางจำหน่ายของแบรนด์นี้ยังไม่ผ่านการตรวจกับแหล่งทางการ —
              เอกสารจึงเว้นช่องไว้ ไม่กรอกด้วยการเดา
            </p>
          )}
        </div>
      </main>
    </Shell>
  );
}
