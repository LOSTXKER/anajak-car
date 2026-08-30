/*
  THESIS: ถ้า Apple ทำเว็บนี้ เขาจะไม่ทำ "หน้าโฆษณาโล่งๆ" (แบบที่เบสเคยปัดเมื่อ 07-21 ว่าโล่งไป)
    เขาจะทำแบบ "หน้าเทียบรุ่น + หน้าสเปก" ของ apple.com ซึ่งเป็นหน้าที่ข้อมูลแน่นที่สุดในเว็บเขา —
    ของจริงคือ CARMETA เป็น data product เหมือน tech specs ของ Apple: ตารางเทียบเป็นพระเอก
    ตัวเลขทุกตัวมีเชิงอรรถกำกับท้ายหน้า และประโยคหนึ่งประโยคพูดเรื่องเดียว
  OWN-WORLD: ขาว/เทา #f5f5f7 สลับกันเป็นแถบ · หมึก #1d1d1f · เส้นผม 1px แทนกล่อง · น้ำเงิน CI ใช้เฉพาะลิงก์/ปุ่ม/จุดข้อมูล
  STORY: พาดหัวพิมพ์วน + ช่องค้นหา → ราคาทุกเกรดในฐานบนแกนเดียว → เลือกแบรนด์ →
    หนึ่งตัวเลขใหญ่ (รุ่นเดียวราคาต่างกันเท่าไร) พร้อมบันได 18 เกรดจริง → ตารางเทียบทั้งฐาน → เชิงอรรถ
  FIRST VIEWPORT: พาดหัวสเกลหน้าเปิดตัว + ช่องค้นหาแคปซูล + ทางลัดแบรนด์ + ขอบบนของแถบราคา 64 ขีด
  FORM: แพตเทิร์นที่ยืมมาคือของที่ Apple ใช้กับ "ข้อมูล" ไม่ใช่ของที่ใช้กับ "โฆษณา" — เชิงอรรถมีเลข
    คือที่อยู่ของหลักฐานตามหลัก evidence-first ของ CARMETA พอดี
  FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
*/
import { HeroHeadline } from "@/components/hero-headline";
import { formatDateTH, formatTHB } from "@/lib/format";

import "../apple.css";
import {
  BRANDS,
  HILUX_GROUPS,
  HILUX_SKUS,
  NAMEPLATES,
  TOTALS,
  UPCOMING_BRANDS,
  brandStats,
} from "../../_kit/data";

/* ── ตัวเลขทั้งหมดคำนวณสดจากราคาจริง 64 รายการ ไม่มีเลขพิมพ์มือ ───────── */
const ALL_PRICES = NAMEPLATES.flatMap((n) => n.variantPrices).sort((a, b) => a - b);
const MIN = ALL_PRICES[0];
const MAX = ALL_PRICES[ALL_PRICES.length - 1];
const MEDIAN = ALL_PRICES[Math.floor(ALL_PRICES.length / 2)];
const cheapest = NAMEPLATES.find((n) => n.variantPrices.includes(MIN))!;
const priciest = NAMEPLATES.find((n) => n.variantPrices.includes(MAX))!;

/* แกนราคาเป็นสเกลลอการิทึม เพราะถูกสุดกับแพงสุดห่างกัน 13 เท่า
   ถ้าใช้แกนเชิงเส้น รถ 9 ใน 12 รุ่นจะกองอยู่ 25% แรกจนอ่านไม่ออก — กำกับไว้ในเชิงอรรถข้อ 3 */
const AXIS_MIN = 500_000;
const AXIS_MAX = 8_000_000;
const AXIS_TICKS = [500_000, 1_000_000, 2_000_000, 4_000_000, 8_000_000];

function pos(price: number) {
  const t = (Math.log(price) - Math.log(AXIS_MIN)) / (Math.log(AXIS_MAX) - Math.log(AXIS_MIN));
  return Math.min(Math.max(t, 0), 1) * 100;
}

function axisLabel(v: number) {
  return v >= 1_000_000 ? `${v / 1_000_000} ล้าน` : "5 แสน";
}

/* รุ่นที่ช่วงราคาภายในรุ่นเดียวกันกว้างที่สุดในฐาน — ใช้เป็นสถิติข้างเคียง */
const widest = NAMEPLATES.reduce((a, b) =>
  b.priceMax! - b.priceMin! > a.priceMax! - a.priceMin! ? b : a,
);
const widestGap = widest.priceMax! - widest.priceMin!;

/* รุ่นที่เอามาเปิดบันไดกลางหน้า = รุ่นที่มีเกรดมากที่สุด และเป็นรุ่นเดียวที่เรามีสเปกรายเกรดครบในหน้าลอง */
const HERO_MODEL = NAMEPLATES.find((n) => n.slug === "hilux-travo")!;

/* บันไดราคาของรุ่นนั้น (Hilux Travo 18 เกรด) — จัดกลุ่มตามตัวถัง เรียงราคาในกลุ่ม */
const LADDER = HILUX_GROUPS.map((g) => ({
  group: g,
  rows: HILUX_SKUS.filter((s) => s.group === g).sort((a, b) => (a.price ?? 0) - (b.price ?? 0)),
})).filter((g) => g.rows.length > 0);
const L_MIN = Math.min(...HILUX_SKUS.map((s) => s.price ?? Infinity));
const L_MAX = Math.max(...HILUX_SKUS.map((s) => s.price ?? 0));
const lpos = (p: number) => ((p - L_MIN) / (L_MAX - L_MIN)) * 100;

/* ADAS: true = ยืนยันว่ามี · false = ยืนยันว่าไม่มี · null = สเปกทางการไม่ระบุ (ไม่ใช่ "ไม่มี") */
const adasFull = HILUX_SKUS.filter((s) => s.adas.aeb && s.adas.acc && s.adas.lka).length;
const adasUnknown = HILUX_SKUS.filter(
  (s) => s.adas.aeb === null || s.adas.acc === null || s.adas.lka === null,
).length;

const mostGrades = NAMEPLATES.reduce((a, b) => (b.variantCount > a.variantCount ? b : a));

/* จุดสีตามหมวดขุมพลัง — มีข้อความกำกับเสมอ ไม่ใช้สีสื่อความหมายเดี่ยวๆ */
const PT_DOT: Record<string, string> = {
  ดีเซล: "var(--pt-diesel)",
  เบนซิน: "var(--pt-petrol)",
  ไฮบริด: "var(--pt-hybrid)",
  ปลั๊กอินไฮบริด: "var(--pt-hybrid)",
  EV: "var(--pt-ev)",
};

function Sup({ n }: { n: number }) {
  return (
    <sup className="ap-sup">
      <a href="#notes">{n}</a>
    </sup>
  );
}

/** เครื่องหมายสถานะ ADAS แบบตารางเทียบ: มี / ไม่มี / ยังไม่ระบุ (ต่างกันสามสถานะจริงๆ) */
function AdasMark({ v }: { v: boolean | null }) {
  if (v === true) return <span className="ap-yes" aria-label="มี">✓</span>;
  if (v === false) return <span className="ap-no" aria-label="ไม่มี">—</span>;
  return <span className="ap-unk" aria-label="สเปกทางการไม่ระบุ">ไม่ระบุ</span>;
}

export default function AppleHomePage() {
  const board = [...NAMEPLATES].sort((a, b) => a.priceMin! - b.priceMin!);

  return (
    <div className="ap">
      {/* แถบเมนู: เตี้ย โปร่ง เบลอหลัง ตัวอักษรเล็กเท่ากันหมด */}
      <header className="ap-nav">
        <div className="ap-shell-wide ap-nav-in">
          <a href="#" className="ap-nav-word">
            CARMETA
          </a>
          <a href="#brands" className="ap-nav-mid">
            แบรนด์
          </a>
          <a href="#grades" className="ap-nav-mid">
            เกรดและราคา
          </a>
          <a href="#compare" className="ap-nav-mid">
            เทียบทั้งฐาน
          </a>
          <a href="#notes" className="ap-nav-mid">
            แหล่งอ้างอิง
          </a>
          <span className="ap-nav-right">
            <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <circle cx="9" cy="9" r="5.4" />
              <path d="m13.3 13.3 3.5 3.5" strokeLinecap="round" />
            </svg>
            ข้อมูล ณ <span className="tnum">{formatDateTH(TOTALS.latestChecked)}</span>
          </span>
        </div>
      </header>

      <main>
        <section className="ap-hero">
          <div className="ap-shell">
            <div className="ap-rise">
              <HeroHeadline />
            </div>
            <p className="ap-hero-sub ap-rise ap-rise-2">
              ฐานข้อมูลรถยนต์ไทยที่แยกลึกถึงเกรดที่ซื้อได้จริงทุกคัน
              ทุกตัวเลขบอกว่ามาจากไหนและตรวจเมื่อไร
            </p>

            {/* หน้าลองยังไม่ต่อระบบค้นหาจริง (server component ส่ง handler ไม่ได้) */}
            <form className="ap-search ap-rise ap-rise-2" role="search" action="/proto/home-2026/apple">
              <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="var(--ink-3)" strokeWidth="1.6" aria-hidden>
                <circle cx="9" cy="9" r="5.4" />
                <path d="m13.3 13.3 3.5 3.5" strokeLinecap="round" />
              </svg>
              <input
                aria-label="ค้นหารุ่นรถหรือเกรด"
                placeholder="ค้นหารุ่นหรือเกรด เช่น Hilux Travo, Overland Plus"
              />
              <button type="submit">ค้นหา</button>
            </form>

            <p className="ap-hero-meta ap-rise ap-rise-3">
              <b className="tnum">{TOTALS.brands}</b> แบรนด์ · <b className="tnum">{TOTALS.nameplates}</b> รุ่น ·{" "}
              <b className="tnum">{TOTALS.variants}</b> เกรดที่ซื้อได้จริง — ราคาป้ายทางการทุกเกรด
              <Sup n={1} />
            </p>

            {/* ทางลัดเข้าหน้าแบรนด์ อยู่ใน hero ตามที่เบสสั่งไว้รอบก่อน */}
            <nav className="ap-pills ap-rise ap-rise-3" aria-label="ทางลัดไปหน้าแบรนด์">
              {BRANDS.map((b) => {
                const st = brandStats(b.slug);
                return (
                  <a key={b.slug} href="#brands" className="ap-pill">
                    {b.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element -- โลโก้ SVG local ที่ next/image ไม่ optimize
                      <img src={b.logo} alt={b.name} />
                    ) : (
                      <span className="wm">{b.name}</span>
                    )}
                    <span className="n tnum">{st.variants} เกรด</span>
                  </a>
                );
              })}
            </nav>

            {/* วัตถุหลักของหน้าแรก: เกรดทั้งฐานวางบนแกนราคาเดียว */}
            <div className="ap-strip-wrap ap-rise ap-rise-4">
              <div className="ap-strip-head">
                <h2>เกรดทั้ง {TOTALS.variants} คันในฐานข้อมูล อยู่ตรงไหนของราคา</h2>
                <span>หนึ่งขีดคือหนึ่งเกรดที่ซื้อได้จริง ไม่ใช่หนึ่งรุ่น</span>
              </div>

              <div className="ap-strip">
                <span className="ap-note">
                  <b className="tnum">{formatTHB(MIN)}</b>
                  {cheapest.brand} {cheapest.name}
                </span>
                <span
                  className="ap-note center"
                  style={{ left: `${pos(MEDIAN)}%`, transform: "translateX(-50%)" }}
                >
                  <b className="tnum">{formatTHB(MEDIAN)}</b>
                  ค่ากลาง
                </span>
                <span className="ap-note right">
                  <b className="tnum">{formatTHB(MAX)}</b>
                  {priciest.brand} {priciest.name}
                </span>

                <span className="ap-strip-axis" aria-hidden />
                {ALL_PRICES.map((p, i) => (
                  <span
                    key={`${p}-${i}`}
                    aria-hidden
                    className={`ap-tick${p === MIN || p === MAX ? " edge" : p === MEDIAN ? " mid" : ""}`}
                    style={{ left: `${pos(p)}%` }}
                  />
                ))}
                {AXIS_TICKS.map((v) => (
                  <span key={v} className="ap-axis-label" style={{ left: `${pos(v)}%` }}>
                    {axisLabel(v)}
                  </span>
                ))}
              </div>

              <p className="ap-strip-foot">
                แกนนี้เป็นสเกลเท่าตัว (ทุกช่วงคือราคาคูณสอง) เพราะรถถูกสุดกับแพงสุดในฐานห่างกัน{" "}
                <span className="tnum">{Math.round(MAX / MIN)}</span> เท่า
                <Sup n={3} /> · ราคาที่แสดงคือราคาป้ายทางการ ไม่ใช่ราคาซื้อขายจริง
                <Sup n={1} />
              </p>
            </div>
          </div>
        </section>

        {/* ── แบรนด์ ─────────────────────────────────────────────── */}
        <section id="brands" className="ap-band grey">
          <div className="ap-shell-wide">
            <div className="ap-head">
              <h2>เริ่มจากแบรนด์ที่คุณกำลังดูอยู่</h2>
              <p>
                แต่ละแบรนด์เปิดเมื่อเก็บราคาครบทุกเกรดแล้วเท่านั้น — เราไม่เปิดหน้าที่ข้อมูลยังไม่ครบ
                เพื่อให้ดูเหมือนมีรถเยอะ
              </p>
            </div>

            <div className="ap-shelf">
              {BRANDS.map((b) => {
                const st = brandStats(b.slug);
                return (
                  <a key={b.slug} href="#" className="ap-card">
                    <span className="ap-card-logo">
                      {b.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element -- โลโก้ SVG local ที่ next/image ไม่ optimize
                        <img src={b.logo} alt={b.name} />
                      ) : (
                        <span className="wm">{b.name}</span>
                      )}
                    </span>
                    <p className="ap-card-sub">
                      <span className="tnum">{st.nameplates}</span> รุ่น ·{" "}
                      <span className="tnum">{st.variants}</span> เกรด · {st.powertrains.join(" / ")}
                    </p>
                    <p className="ap-card-price tnum">
                      <b>{formatTHB(st.priceMin!)}</b> <em>– {formatTHB(st.priceMax!)}</em>
                    </p>
                    <span className="ap-card-bar" aria-hidden>
                      <i
                        style={{
                          left: `${pos(st.priceMin!)}%`,
                          width: `${Math.max(pos(st.priceMax!) - pos(st.priceMin!), 2)}%`,
                        }}
                      />
                    </span>
                    <span className="ap-card-scale">
                      <span>{axisLabel(AXIS_MIN)}</span>
                      <span>{axisLabel(AXIS_MAX)}</span>
                    </span>
                    <span className="ap-card-go">ดูรุ่นทั้งหมด ›</span>
                  </a>
                );
              })}

              {UPCOMING_BRANDS.map((name) => (
                <span key={name} className="ap-card ghost">
                  <strong>{name}</strong>
                  <span>ยังไม่เปิด<Sup n={6} /></span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── ตัวเลขใหญ่หนึ่งตัว + บันไดราคาจริง ────────────────────── */}
        <section id="grades" className="ap-band">
          <div className="ap-shell-wide">
            <div className="ap-figure">
              <b className="tnum">{formatTHB(L_MAX - L_MIN)}</b>
              <em>
                คือส่วนต่างระหว่างเกรดถูกสุดกับแพงสุดของ {HERO_MODEL.brand} {HERO_MODEL.name} —
                รถ<strong> รุ่นเดียวกัน</strong> ที่มี {HERO_MODEL.variantCount} เกรดให้เลือก
                นี่คือเหตุผลที่ราคา “เริ่มต้น” ของรุ่นหนึ่งบอกอะไรได้น้อยมาก และเป็นเหตุผลที่เราเก็บทุกเกรดแยกกัน
              </em>
            </div>

            <div className="ap-ladder">
              <div className="ap-ladder-head">
                <span>เกรด</span>
                <span>ตำแหน่งราคาในรุ่น</span>
                <span className="r">ราคาป้าย<Sup n={1} /></span>
                <span className="r">ห่างจากเกรดก่อน</span>
                <span className="c ap-adas">เบรกฉุกเฉิน<Sup n={5} /></span>
                <span className="c ap-adas">ครูซคุมระยะ</span>
                <span className="c ap-adas">ช่วยคุมเลน</span>
              </div>

              {LADDER.map((g) => (
                <div key={g.group}>
                  <div className="ap-group">
                    {g.group} <span>· {g.rows.length} เกรด</span>
                  </div>
                  {g.rows.map((s, i) => {
                    const prev = i > 0 ? g.rows[i - 1].price : null;
                    const delta = prev != null && s.price != null ? s.price - prev : null;
                    return (
                      <div key={s.key} className="ap-rung">
                        <span className="ap-rung-name">
                          {s.shortName}
                          {/* บนมือถือบรรทัดนี้ตัดคำ — ล็อกแต่ละก้อนไม่ให้ขาดกลางคำ */}
                          <span>
                            <span className="nb">{s.powertrainText}</span> ·{" "}
                            <span className="nb">{s.powerText}</span> ·{" "}
                            <span className="nb">{s.drivetrain}</span> ·{" "}
                            <span className="nb">{s.seats} ที่นั่ง</span>
                          </span>
                        </span>
                        <span className="ap-rail" aria-hidden>
                          <i style={{ left: `${lpos(s.price!)}%` }} />
                        </span>
                        <span className="price tnum">{formatTHB(s.price!)}</span>
                        <span className="delta tnum">{delta ? `+${formatTHB(delta)}` : "—"}</span>
                        <span className="c ap-adas">
                          <AdasMark v={s.adas.aeb} />
                        </span>
                        <span className="c ap-adas">
                          <AdasMark v={s.adas.acc} />
                        </span>
                        <span className="c ap-adas">
                          <AdasMark v={s.adas.lka} />
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="ap-side">
              <div>
                <h4>เกรดที่ยืนยันว่ามีระบบช่วยขับครบทั้งสาม</h4>
                <b className="tnum">
                  {adasFull} จาก {HILUX_SKUS.length}
                </b>
                <p>
                  อีก {adasUnknown} เกรดที่สเปกทางการไม่ได้ระบุ เราขึ้นว่า “ไม่ระบุ” ไม่ใช่ “ไม่มี”
                  <Sup n={5} />
                </p>
              </div>
              <div>
                <h4>ช่วงราคาในรุ่นเดียวที่กว้างที่สุดในฐาน</h4>
                <b className="tnum">{formatTHB(widestGap)}</b>
                <p>
                  {widest.brand} {widest.name} — {widest.variantCount} เกรด ตั้งแต่{" "}
                  {formatTHB(widest.priceMin!)} ถึง {formatTHB(widest.priceMax!)}
                </p>
              </div>
              <div>
                <h4>รุ่นที่มีเกรดให้เลือกมากที่สุด</h4>
                <b className="tnum">{mostGrades.variantCount} เกรด</b>
                <p>
                  {mostGrades.brand} {mostGrades.name} — ทุกเกรดเก็บแยกกันเป็นคนละรายการ ไม่ยุบเป็นราคาเดียว
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── ตารางเทียบทั้งฐาน (แพตเทิร์นหน้า compare ของ Apple) ───── */}
        <section id="compare" className="ap-band grey">
          <div className="ap-shell-wide">
            <div className="ap-head">
              <h2>เทียบทุกรุ่นในฐานข้อมูล</h2>
              <p>
                เรียงตามราคาเริ่มต้น · แถบในคอลัมน์ “การกระจายราคา” วางบนแกนเดียวกันทั้งตาราง
                จึงเทียบข้ามรุ่นได้ตรงๆ
              </p>
            </div>

            <div className="ap-table-wrap">
              <table className="ap-table">
                <thead>
                  <tr>
                    <th>รุ่น</th>
                    <th>ขุมพลัง</th>
                    <th className="r">เกรด</th>
                    <th>การกระจายราคาของเกรด</th>
                    <th className="r">
                      เริ่มต้น
                      <Sup n={1} />
                    </th>
                    <th className="r">สูงสุด</th>
                    <th className="r">ส่วนต่าง</th>
                    <th className="r">
                      ตรวจเมื่อ
                      <Sup n={2} />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {board.map((n) => {
                    const lo = n.priceMin!;
                    const hi = n.priceMax!;
                    return (
                      <tr key={n.slug}>
                        <td>
                          {/* เลขเชิงอรรถต้องอยู่นอกลิงก์ — ลิงก์ซ้อนลิงก์ทำให้ HTML ไม่ถูกต้อง */}
                          <a href="#" className="ap-t-name">
                            {n.name}
                          </a>
                          {n.brandSlug === "tesla" ? <Sup n={4} /> : null}
                          <span className="ap-t-sub">
                            {n.brand} · {n.segmentLabel} · {n.bodyLabel}
                          </span>
                        </td>
                        <td>
                          {n.powertrains.map((p) => (
                            <span key={p} className="ap-t-pt">
                              <i style={{ background: PT_DOT[p] ?? "var(--ink-3)" }} aria-hidden />
                              {p}
                            </span>
                          ))}
                        </td>
                        <td className="r tnum">{n.variantCount}</td>
                        <td>
                          <span className="ap-spread" aria-hidden>
                            <b
                              style={{
                                left: `${pos(lo)}%`,
                                width: `${Math.max(pos(hi) - pos(lo), 0.8)}%`,
                              }}
                            />
                            {n.variantPrices.map((p, i) => (
                              <i key={`${p}-${i}`} style={{ left: `${pos(p)}%` }} />
                            ))}
                          </span>
                        </td>
                        <td className="r tnum" style={{ fontWeight: 600 }}>
                          {formatTHB(lo)}
                        </td>
                        <td className="r tnum" style={{ color: "var(--ink-2)" }}>
                          {hi > lo ? formatTHB(hi) : "—"}
                        </td>
                        <td className="r tnum" style={{ color: "var(--ink-2)" }}>
                          {hi > lo ? formatTHB(hi - lo) : "—"}
                        </td>
                        <td className="r tnum" style={{ color: "var(--ink-3)", fontSize: 12.5 }}>
                          {formatDateTH(n.checkedDate)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── เชิงอรรถ = ที่อยู่ของหลักฐาน ────────────────────────── */}
        <section id="notes" className="ap-shell-wide ap-notes">
          <ol>
            <li>
              <strong>ราคาป้ายทางการ</strong> ที่ผู้ผลิตประกาศ ไม่ใช่ราคาซื้อขายจริง ไม่รวมส่วนลดหรือ
              ของแถม และไม่ใช่ราคาประกาศขายมือสอง — สามอย่างนี้เราเก็บแยกชนิดกัน
            </li>
            <li>
              <strong>วันที่ตรวจ</strong> คือวันที่เราเปิดหน้าต้นทางแล้วเทียบตัวเลขครั้งล่าสุด
              เมื่อราคาปรับ เราเพิ่มรายการใหม่ ไม่เขียนทับของเดิม ประวัติจึงย้อนดูได้
            </li>
            <li>
              <strong>แกนราคาเป็นสเกลเท่าตัว</strong> (5 แสน · 1 · 2 · 4 · 8 ล้าน) ไม่ใช่แกนตรง
              เพราะรถถูกสุด <span className="tnum">{formatTHB(MIN)}</span> กับแพงสุด{" "}
              <span className="tnum">{formatTHB(MAX)}</span> ห่างกันมากเกินกว่าจะอ่านบนแกนตรงได้
            </li>
            <li>
              <strong>ราคา Tesla</strong> อ้างจากสื่อยานยนต์ไทยหลายสำนักที่รายงานตรงกัน
              (ความเชื่อมั่นระดับกลาง) เพราะหน้าทางการบล็อกการดึงข้อมูล — ต่างจาก Toyota และ
              Mercedes-Benz ที่อ้างหน้าผู้ผลิตโดยตรง
            </li>
            <li>
              <strong>ระบบช่วยขับ</strong> ✓ คือสเปกทางการยืนยันว่ามี · — คือยืนยันว่าไม่มี ·
              “ไม่ระบุ” คือเอกสารทางการไม่ได้บอก ซึ่งไม่เท่ากับไม่มี เราจึงไม่เติมให้เอง
            </li>
            <li>
              <strong>อีก {UPCOMING_BRANDS.length} แบรนด์</strong> ({UPCOMING_BRANDS.join(" · ")})
              ยังไม่เปิด เพราะเก็บราคาให้ครบทุกเกรดยังไม่เสร็จ · ยังไม่มีกราฟราคาย้อนหลัง
              เพราะราคาส่วนใหญ่เพิ่งตรวจครั้งแรก ยังไม่มีการเปลี่ยนแปลงจริงให้พล็อต
            </li>
          </ol>
        </section>
      </main>

      <footer className="ap-foot">
        <div className="ap-shell-wide">
          <div className="ap-foot-cols">
            <div>
              <h5>ฐานข้อมูล</h5>
              <ul>
                <li>
                  <a href="#compare">รุ่นรถทั้งหมด</a>
                </li>
                <li>
                  <a href="#grades">เกรดและราคา</a>
                </li>
                <li>
                  <a href="#brands">แบรนด์</a>
                </li>
              </ul>
            </div>
            <div>
              <h5>แบรนด์ที่เปิดแล้ว</h5>
              <ul>
                {BRANDS.map((b) => (
                  <li key={b.slug}>
                    <a href="#brands">{b.name}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5>วิธีทำงานของข้อมูล</h5>
              <ul>
                <li>
                  <a href="#notes">แหล่งอ้างอิงและวันที่ตรวจ</a>
                </li>
                <li>
                  <a href="#notes">ชนิดของราคา</a>
                </li>
                <li>
                  <a href="#notes">สิ่งที่เรายังไม่มี</a>
                </li>
              </ul>
            </div>
            <div>
              <h5>เกี่ยวกับ</h5>
              <ul>
                <li>
                  <a href="#">CARMETA คืออะไร</a>
                </li>
                <li>
                  <a href="#">ติดต่อ</a>
                </li>
              </ul>
            </div>
          </div>
          <p className="ap-foot-legal">
            ราคาและสเปกทั้งหมดในหน้านี้เป็นข้อมูลที่ตรวจจากเอกสารทางการของผู้ผลิตหรือสื่อที่ระบุไว้
            ณ วันที่กำกับในแต่ละแถว · ราคาป้ายไม่ใช่ราคาซื้อขายจริงและอาจเปลี่ยนแปลงได้
            <br />
            หน้านี้เป็นหน้าลอง — ตัวเลขแช่แข็งจากฐานข้อมูลจริง ณ{" "}
            <span className="tnum">{formatDateTH(TOTALS.latestChecked)}</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
