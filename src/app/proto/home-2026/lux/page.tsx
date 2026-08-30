/*
  THESIS: หน้าแรกของ CARMETA ทำงานเหมือน "กระดานราคา" ของเว็บข้อมูลตลาด — ราคาและการกระจายของเกรดคือภาพ
    ไม่ใช่รูปรถ (เราไม่ได้ขายรถ) · ปฏิเสธหน้าเปิดแบบเว็บผู้ผลิตที่ให้ภาพรถกินครึ่งจอ
  OWN-WORLD: ขาว–เทาอ่อน หมึกเกือบดำ น้ำเงิน CI + ฟ้าเป็นสีของกราฟเท่านั้น · เส้น 1px · ตัวเลขทุกตัวเป็น mono เรียงหลัก
  STORY: เปิดมาเจอพาดหัวพิมพ์วน + ช่องค้นหา + โลโก้แบรนด์เป็นทางลัด → แผนภูมิว่าทั้งตลาดในฐานกระจายราคาอย่างไร → กระดานราคารายรุ่นพร้อมกราฟกระจายเกรดในแถว
  FIRST VIEWPORT: แถบสรุปตลาดบนสุด · พาดหัว 74px · ช่องค้นหาใหญ่ · แถวโลโก้ 3 แบรนด์พร้อมช่วงราคาเป็นแถบเทียบกัน
  FORM: กราฟทุกอันมาจากราคาจริง 64 รายการ — ไม่มีเส้นกราฟตามเวลา เพราะราคาส่วนใหญ่เพิ่งตรวจครั้งเดียว จะวาดก็เป็นการโกหก
  FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
*/
import { HeroHeadline } from "@/components/hero-headline";
import { formatDateTH, formatTHB } from "@/lib/format";

import "../lux.css";
import { BRANDS, NAMEPLATES, TOTALS, UPCOMING_BRANDS, brandStats } from "../../_kit/data";

/* ── ตัวเลขสรุปที่คำนวณจากราคาจริงทั้ง 64 รายการ ────────────────── */
const ALL_PRICES = NAMEPLATES.flatMap((n) => n.variantPrices).sort((a, b) => a - b);
const MIN = ALL_PRICES[0];
const MAX = ALL_PRICES[ALL_PRICES.length - 1];
const MEDIAN = ALL_PRICES[Math.floor(ALL_PRICES.length / 2)];

/* ช่วงราคาของแผนภูมิ — แบ่งเป็นชั้นที่คนซื้อรถใช้คิดจริง (ไม่ใช่แบ่งเท่าๆ กันแบบเครื่องจักร) */
const BUCKETS: { label: string; min: number; max: number }[] = [
  { label: "ไม่เกิน 8 แสน", min: 0, max: 800_000 },
  { label: "8 แสน–1 ล้าน", min: 800_000, max: 1_000_000 },
  { label: "1–1.5 ล้าน", min: 1_000_000, max: 1_500_000 },
  { label: "1.5–2 ล้าน", min: 1_500_000, max: 2_000_000 },
  { label: "2–3 ล้าน", min: 2_000_000, max: 3_000_000 },
  { label: "3–4 ล้าน", min: 3_000_000, max: 4_000_000 },
  { label: "4 ล้านขึ้นไป", min: 4_000_000, max: Infinity },
];
const HIST = BUCKETS.map((b) => ({
  ...b,
  n: ALL_PRICES.filter((p) => p >= b.min && p < b.max).length,
}));
const HIST_MAX = Math.max(...HIST.map((h) => h.n));

/* ข้อสังเกตจากข้อมูล — คำนวณสด ไม่มีเลขพิมพ์มือ */
const widest = NAMEPLATES.reduce((a, b) =>
  b.variantPrices[b.variantPrices.length - 1] - b.variantPrices[0] >
  a.variantPrices[a.variantPrices.length - 1] - a.variantPrices[0]
    ? b
    : a,
);
const widestGap = widest.variantPrices[widest.variantPrices.length - 1] - widest.variantPrices[0];
/** ขั้นบันไดที่ห่างที่สุดในรุ่นเดียวกัน — "จ่ายเพิ่มก้อนใหญ่สุดเพื่อขึ้นหนึ่งเกรด" */
const biggestStep = NAMEPLATES.flatMap((n) =>
  n.variantPrices.slice(1).map((p, i) => ({ n, gap: p - n.variantPrices[i], from: n.variantPrices[i], to: p })),
).reduce((a, b) => (b.gap > a.gap ? b : a));
const mostGrades = NAMEPLATES.reduce((a, b) => (b.variantCount > a.variantCount ? b : a));

function pct(v: number) {
  return ((v - MIN) / (MAX - MIN)) * 100;
}

/** กราฟย่อในแถว: ขีดหนึ่งขีด = หนึ่งเกรด วางตามราคาจริงบนแกนของทั้งตลาด */
function GradeSpread({ prices }: { prices: number[] }) {
  const lo = prices[0];
  const hi = prices[prices.length - 1];
  return (
    <span className="lx-spark" aria-hidden>
      <span className="lx-spark-axis" />
      <span className="lx-spark-span" style={{ left: `${pct(lo)}%`, width: `${Math.max(pct(hi) - pct(lo), 0.6)}%` }} />
      {prices.map((p, i) => (
        <span
          key={`${p}-${i}`}
          className={`lx-spark-tick${p === lo || p === hi ? " edge" : ""}`}
          style={{ left: `${pct(p)}%` }}
        />
      ))}
    </span>
  );
}

export default function LuxHomePage() {
  const board = [...NAMEPLATES].sort((a, b) => a.variantPrices[0] - b.variantPrices[0]);

  return (
    <div className="lx">
      <header className="lx-top">
        <div className="lx-shell lx-top-in">
          <span className="lx-word">CARMETA</span>
          <nav className="lx-menu" aria-label="เมนูหลัก">
            <a href="#brands">แบรนด์</a>
            <a href="#market">ภาพรวมราคา</a>
            <a href="#board">กระดานราคา</a>
          </nav>
          <span className="lx-top-right">ข้อมูล ณ {formatDateTH(TOTALS.latestChecked)}</span>
        </div>
      </header>

      {/* แถบสรุป — อ่านสถานะของฐานข้อมูลได้ในบรรทัดเดียว แบบแถบดัชนีตลาด */}
      <div className="lx-tape">
        <div className="lx-shell lx-tape-in">
          {[
            { k: "รุ่น", v: `${TOTALS.nameplates}` },
            { k: "เกรดที่ซื้อได้จริง", v: `${TOTALS.variants}` },
            { k: "ถูกสุด", v: formatTHB(MIN) },
            { k: "แพงสุด", v: formatTHB(MAX) },
            { k: "ค่ากลาง", v: formatTHB(MEDIAN) },
          ].map((t) => (
            <span key={t.k} className="lx-tape-item">
              <span className="lx-tape-k">{t.k}</span>
              <span className="lx-tape-v tnum">{t.v}</span>
            </span>
          ))}
          {/* วันที่ตรวจเป็นสถานะของข้อมูล ไม่ใช่ค่าสถิติ — แยกไปท้ายแถวพร้อมจุดสถานะ */}
          <span className="lx-live">
            <i aria-hidden />
            ข้อมูล ณ <span className="tnum">{formatDateTH(TOTALS.latestChecked)}</span>
          </span>
        </div>
      </div>

      <main>
        {/* Hero — พาดหัวพิมพ์วน + ช่องค้นหา + โลโก้แบรนด์เป็นทางลัด */}
        <section className="lx-hero">
          <div className="lx-shell">
            <div className="lx-hero-in">
              <div className="lx-rise">
                <HeroHeadline />
              </div>
              <p className="lx-hero-sub lx-rise lx-rise-2">
                กระดานราคารถยนต์ในไทย ลึกถึงเกรดที่ซื้อได้จริงทุกคัน — ทุกตัวเลขผูกหน้าต้นทางของผู้ผลิต
                พร้อมวันที่ตรวจ
              </p>

              {/* หน้าลองยังไม่ต่อระบบค้นหาจริง — server component ส่ง event handler ไม่ได้ */}
              <form className="lx-search lx-rise lx-rise-2" role="search" action="/proto/home-2026/lux">
                <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" aria-hidden>
                  <circle cx="9" cy="9" r="5.6" />
                  <path d="m13.4 13.4 3.6 3.6" strokeLinecap="round" />
                </svg>
                <input aria-label="ค้นหารุ่นรถหรือเกรด" placeholder="ค้นหารุ่นรถหรือเกรด เช่น Hilux Travo, Overland Plus" />
                <button type="submit">ค้นหา</button>
              </form>
            </div>

            <nav id="brands" className="lx-marks lx-rise lx-rise-3" aria-label="ทางลัดไปหน้าแบรนด์">
              {BRANDS.map((b) => {
                const st = brandStats(b.slug);
                return (
                  <a key={b.slug} href="#" className="lx-mark">
                    <span className="lx-mark-top">
                      {b.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element -- โลโก้ SVG local ที่ next/image ไม่ optimize
                        <img src={b.logo} alt={b.name} />
                      ) : (
                        <span className="wm">{b.name}</span>
                      )}
                      <span className="lx-mark-count tnum">
                        {st.nameplates} รุ่น · {st.variants} เกรด
                      </span>
                    </span>
                    <span className="lx-mark-range tnum">
                      <b>{formatTHB(st.priceMin!)}</b> – {formatTHB(st.priceMax!)}
                    </span>
                    <span className="lx-mark-bar">
                      <i
                        style={{
                          left: `${pct(st.priceMin!)}%`,
                          width: `${Math.max(pct(st.priceMax!) - pct(st.priceMin!), 1.5)}%`,
                        }}
                      />
                    </span>
                  </a>
                );
              })}
            </nav>
          </div>
        </section>

        {/* แผนภูมิภาพรวมราคา — แทนที่รูปรถเป็นภาพหลักของหน้า */}
        <section id="market" className="lx-sec">
          <div className="lx-shell">
            <div className="lx-sec-head">
              <h2>เกรดทั้ง {TOTALS.variants} คันในฐานข้อมูล กระจายอยู่ช่วงราคาไหน</h2>
              <span className="lx-sec-note">นับจากราคาป้ายทางการรายเกรด · ไม่ใช่ราคาซื้อขายจริง</span>
            </div>

            <div className="lx-hist">
              {HIST.map((h, i) => (
                <span key={h.label} className="lx-hist-col">
                  <span className="lx-hist-n tnum">{h.n}</span>
                  <span
                    className="lx-hist-bar"
                    style={{
                      height: `${Math.max((h.n / HIST_MAX) * 100, 1.5)}%`,
                      animationDelay: `${i * 60}ms`,
                    }}
                  />
                </span>
              ))}
            </div>
            <div className="lx-hist-x">
              {HIST.map((h) => (
                <span key={h.label}>{h.label}</span>
              ))}
            </div>

            <div className="lx-facts">
              <div className="lx-fact">
                <em>ช่วงราคากว้างสุดในรุ่นเดียว</em>
                <b className="tnum">{formatTHB(widestGap)}</b>
                <span>
                  {widest.brand} {widest.name} — จาก {formatTHB(widest.variantPrices[0])} ถึง{" "}
                  {formatTHB(widest.variantPrices[widest.variantPrices.length - 1])} ใน{" "}
                  {widest.variantCount} เกรด
                </span>
              </div>
              <div className="lx-fact">
                <em>ขั้นบันไดที่แพงสุด</em>
                <b className="tnum">{formatTHB(biggestStep.gap)}</b>
                <span>
                  {biggestStep.n.brand} {biggestStep.n.name} — ขยับจาก{" "}
                  {formatTHB(biggestStep.from)} ไป {formatTHB(biggestStep.to)} คือการข้ามเกรดที่ต้องจ่ายเพิ่มก้อนใหญ่ที่สุดในฐาน
                </span>
              </div>
              <div className="lx-fact">
                <em>รุ่นที่มีเกรดให้เลือกมากสุด</em>
                <b className="tnum">{mostGrades.variantCount} เกรด</b>
                <span>
                  {mostGrades.brand} {mostGrades.name} — เกรดที่ซื้อได้จริงมากที่สุดในฐานข้อมูลตอนนี้
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* กระดานราคา */}
        <section id="board" className="lx-sec">
          <div className="lx-shell">
            <div className="lx-sec-head">
              <h2>กระดานราคารายรุ่น</h2>
              <span className="lx-sec-note">เรียงตามราคาเริ่มต้น · แต่ละขีดในกราฟคือหนึ่งเกรดที่ซื้อได้จริง</span>
            </div>

            <table className="lx-board">
              <thead>
                <tr>
                  <th>รุ่น</th>
                  <th className="lx-hide-sm">เกรด</th>
                  <th className="lx-hide-sm">การกระจายราคาของเกรด</th>
                  <th className="r">เริ่มต้น</th>
                  <th className="r lx-hide-sm">สูงสุด</th>
                  <th className="r lx-hide-sm">ส่วนต่าง</th>
                  <th className="r lx-hide-sm">ตรวจเมื่อ</th>
                </tr>
              </thead>
              <tbody>
                {board.map((n) => {
                  const lo = n.variantPrices[0];
                  const hi = n.variantPrices[n.variantPrices.length - 1];
                  return (
                    <tr key={n.slug}>
                      <td>
                        <a href="#">
                          <span className="lx-b-name">{n.name}</span>
                          <span className="lx-b-brand">
                            {n.brand} · {n.segmentLabel} · {n.powertrains.join(" / ")}
                          </span>
                        </a>
                      </td>
                      <td className="lx-hide-sm">
                        <span className="lx-b-grade">
                          <b className="tnum">{n.variantCount}</b> เกรด
                        </span>
                      </td>
                      <td className="lx-hide-sm">
                        <GradeSpread prices={n.variantPrices} />
                      </td>
                      <td className="r tnum" style={{ fontWeight: 600 }}>
                        {formatTHB(lo)}
                      </td>
                      <td className="r tnum lx-hide-sm" style={{ color: "var(--ink-2)" }}>
                        {hi > lo ? formatTHB(hi) : "—"}
                      </td>
                      <td className="r tnum lx-hide-sm" style={{ color: "var(--ink-2)" }}>
                        {hi > lo ? formatTHB(hi - lo) : "—"}
                      </td>
                      <td className="r tnum lx-hide-sm" style={{ color: "var(--ink-3)", fontSize: 12.5 }}>
                        {formatDateTH(n.checkedDate)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <p className="lx-note-row">
              กราฟในคอลัมน์ “การกระจายราคาของเกรด” วางบนแกนเดียวกันทั้งตาราง ({formatTHB(MIN)} –{" "}
              {formatTHB(MAX)}) — ขีดเข้มคือเกรดถูกสุดกับแพงสุดของรุ่นนั้น ขีดจางคือเกรดระหว่างกลาง
            </p>

            <div className="lx-foot">
              <div>
                <h4>ราคาบนกระดานนี้คือราคาอะไร</h4>
                <p>
                  ราคาป้ายทางการที่ผู้ผลิตประกาศ ไม่ใช่ราคาซื้อขายจริง ไม่รวมส่วนลดหรือโปรโมชัน ·
                  ทุกตัวเลขผูกหน้าต้นทางและวันที่ตรวจ และเก็บแบบไม่เขียนทับเมื่อมีการปรับราคาในอนาคต
                </p>
              </div>
              <div>
                <h4>ทำไมยังไม่มีกราฟราคาย้อนหลัง</h4>
                <p>
                  เพราะราคาส่วนใหญ่เพิ่งตรวจครั้งแรก ยังไม่มีการเปลี่ยนแปลงให้พล็อตเป็นเส้นเวลา —
                  เราจึงแสดงการกระจายของเกรดแทน และจะเพิ่มกราฟย้อนหลังเมื่อมีข้อมูลจริงพอ ·
                  อีก {UPCOMING_BRANDS.length} แบรนด์ ({UPCOMING_BRANDS.join(" · ")}) ยังไม่เปิด
                  เพราะเก็บราคาให้ครบทุกเกรดไม่เสร็จ
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
