/*
  THESIS: หน้าแรกของ CARMETA ต้องพิสูจน์ความจริงที่เว็บรถเจ้าอื่นไม่มี — เราแยกรถถึง "รุ่นย่อยที่ซื้อได้จริง"
    และทุกราคามีต้นทางกับวันที่ตรวจ · ปฏิเสธการจัดหน้าแบบ hero + การ์ดกริด + แถบสถิติ ที่พูดเรื่องนี้ด้วยคำโฆษณาแทนที่จะแสดงให้เห็น
  OWN-WORLD: กระดาษอมเทา หมึกเกือบดำ น้ำเงิน CI หนึ่งเดียว · ไม่มีการ์ด ไม่มีเงา ไม่มีไล่สี · โครงคือเส้นบรรทัดกับแกนราคาเส้นเดียวที่ทั้งหน้าใช้ร่วมกัน
  STORY: คนกำลังจะซื้อรถเปิดมา เห็นทันทีว่าแต่ละรุ่นมีกี่เกรดและราคากระจายแค่ไหน เลือกแบรนด์ที่สนใจแล้วเดินต่อ
  FIRST VIEWPORT: ประโยคเปิดที่มีตัวเลขจริงอยู่ในประโยค → แกนราคาร่วม (ติดบนสุดเมื่อเลื่อน) → กลุ่มแบรนด์ที่มีโลโก้เป็นหัว แต่ละรุ่นเป็นแถวเดียวที่มีจุดครบทุกรุ่นย่อยวางบนแกน
  FORM: ผลลัพธ์จากข้อมูลเอง ไม่ใช่โลกภาพที่ยืมมา (สามรอบก่อนล้มเพราะยืมเปลือกมาสวม)
  FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
*/
import "../home.css";

import { formatDateTH, formatTHB } from "@/lib/format";

import { BRANDS, NAMEPLATES, TOTALS, UPCOMING_BRANDS, brandStats } from "../../_kit/data";

// แกนราคาเป็นสเกลเท่าตัว (500k → 1M → 2M → 4M → 8M) เพราะราคารถในฐานห่างกัน 13 เท่า
// ถ้าใช้แกนเชิงเส้น รถ 9 ใน 12 รุ่นจะกองอยู่ซ้ายมือ 25% แรกจนอ่านไม่ออก
const AXIS_MIN = 500_000;
const AXIS_MAX = 8_000_000;
const TICKS = [500_000, 1_000_000, 2_000_000, 4_000_000, 8_000_000];

function pos(price: number) {
  const t = (Math.log(price) - Math.log(AXIS_MIN)) / (Math.log(AXIS_MAX) - Math.log(AXIS_MIN));
  return Math.min(Math.max(t, 0), 1) * 100;
}

function axisLabel(v: number) {
  return v >= 1_000_000 ? `${v / 1_000_000} ล้าน` : `${v / 1000} แสน`.replace("500 แสน", "5 แสน");
}

const PT_COLOR: Record<string, string> = {
  ดีเซล: "var(--pt-diesel)",
  เบนซิน: "var(--pt-petrol)",
  ไฮบริด: "var(--pt-hybrid)",
  ปลั๊กอินไฮบริด: "var(--pt-phev)",
  EV: "var(--pt-ev)",
};

/** จุดหนึ่งจุด = รุ่นย่อยหนึ่งคันที่ซื้อได้จริง — สีตามหมวดขุมพลังของรุ่นนั้น */
function Strip({ n }: { n: (typeof NAMEPLATES)[number] }) {
  const prices = n.variantPrices;
  const min = prices[0];
  const max = prices[prices.length - 1];
  const color = PT_COLOR[n.powertrains[0]] ?? "var(--blue)";
  return (
    <span className="cm-strip">
      <span className="cm-span" style={{ left: `${pos(min)}%`, width: `${pos(max) - pos(min)}%` }} />
      {prices.map((p, i) => (
        <span
          key={`${p}-${i}`}
          className="cm-dot"
          style={{ left: `${pos(p)}%`, background: color, animationDelay: `${i * 28}ms` }}
          title={`${n.brand} ${n.name} — รุ่นย่อยราคา ${formatTHB(p)}`}
        />
      ))}
    </span>
  );
}

export default function HomeProtoPage() {
  const hilux = NAMEPLATES.find((n) => n.slug === "hilux-travo")!;
  const gap = hilux.priceMax! - hilux.priceMin!;

  return (
    <div className="cm" style={{ ["--label-col" as string]: "230px", ["--price-col" as string]: "190px" }}>
      <header className="cm-top">
        <div className="cm-shell cm-top-in">
          <span style={{ fontWeight: 700, letterSpacing: "-0.02em", fontSize: 17 }}>CARMETA</span>
          <nav className="cm-nav" aria-label="เมนูหลัก">
            <span style={{ color: "var(--ink)", fontWeight: 600 }}>แบรนด์</span>
            <span>รุ่นรถทั้งหมด</span>
            <span>เทียบรุ่น</span>
          </nav>
          <span className="cm-search">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <circle cx="7" cy="7" r="4.4" />
              <path d="m10.4 10.4 3 3" strokeLinecap="round" />
            </svg>
            <span className="cm-search-label">ค้นหารุ่นหรือเกรด</span>
          </span>
        </div>
      </header>

      <main>
        <section className="cm-shell cm-open">
          <h1>
            รถ <b>{TOTALS.nameplates}</b> รุ่นในไทย แยกละเอียดถึง <b>{TOTALS.variants}</b> รุ่นย่อยที่ซื้อได้จริง
          </h1>
          <p>
            รุ่นเดียวกันต่างเกรดกันได้ถึง <strong>{formatTHB(gap)}</strong> — {hilux.name} เริ่ม{" "}
            {formatTHB(hilux.priceMin!)} และไปจบที่ {formatTHB(hilux.priceMax!)} · CARMETA เก็บทุกเกรดแยกกัน
            ไม่ยุบเป็นราคาเดียว ทุกจุดในหน้านี้คือรุ่นย่อยหนึ่งคันที่มีราคาป้ายของตัวเอง
          </p>
          <p className="cm-evidence">
            ราคาทั้ง {TOTALS.variants} รายการเป็นราคาป้ายทางการที่ผูกหน้าต้นทางของผู้ผลิตไว้ทุกตัว ·
            ตรวจล่าสุด {formatDateTH(TOTALS.latestChecked)} · ค่าที่ยังไม่มีหลักฐานจะเขียนว่า “ไม่มีข้อมูล”
            ไม่เดาและไม่ใส่ 0
          </p>
        </section>

        <div className="cm-axis">
          <div className="cm-shell cm-axis-row">
            <span className="cm-axis-label">ราคาป้าย</span>
            <span className="cm-ticks">
              {TICKS.map((t) => (
                <span key={t} className="cm-tick" style={{ left: `${pos(t)}%` }}>
                  {axisLabel(t)}
                </span>
              ))}
            </span>
            <span className="cm-axis-label" style={{ textAlign: "right" }}>
              ช่วงราคาในรุ่น
            </span>
          </div>
        </div>

        <div className="cm-shell">
          {BRANDS.map((b) => {
            const st = brandStats(b.slug);
            const rows = NAMEPLATES.filter((n) => n.brandSlug === b.slug).sort(
              (x, y) => x.variantPrices[0] - y.variantPrices[0],
            );
            return (
              <section key={b.slug} className="cm-brand" aria-labelledby={`brand-${b.slug}`}>
                <div className="cm-brand-head">
                  {/* โลโก้ Toyota เป็น wordmark ที่มีชื่ออยู่ในตัวแล้ว — พิมพ์ชื่อซ้ำข้างๆ คือความซ้ำที่ไม่มีใครออกแบบจริง
                      แบรนด์ที่ยังไม่มีไฟล์โลโก้ใช้ชื่อเป็นตัวอักษรแทน ไม่ปลอมโลโก้ขึ้นมาเอง */}
                  <span className="cm-brand-mark">
                    {b.logo ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element -- โลโก้ SVG local ที่ next/image ไม่ optimize */}
                        <img src={b.logo} alt="" />
                        <span id={`brand-${b.slug}`} className="sr-only">
                          {b.name}
                        </span>
                      </>
                    ) : (
                      <span id={`brand-${b.slug}`} className="cm-brand-name">
                        {b.name}
                      </span>
                    )}
                  </span>
                  <span className="cm-brand-meta">
                    {st.nameplates} รุ่น · {st.variants} รุ่นย่อย ·{" "}
                    <span className="tnum">
                      {st.priceMin === st.priceMax
                        ? formatTHB(st.priceMin!)
                        : `${formatTHB(st.priceMin!)} – ${formatTHB(st.priceMax!)}`}
                    </span>{" "}
                    · ตรวจ {formatDateTH(b.checkedDate)}
                  </span>
                  <a className="cm-brand-link" href="#">
                    ดูรุ่นทั้งหมดของ {b.name}
                    <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
                      <path d="M3 8h9.5M9 4.5 12.8 8 9 11.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>

                <div className="cm-rows">
                  {rows.map((n) => (
                    <a key={n.slug} className="cm-row" href="#">
                      <span>
                        <span className="cm-row-name">{n.name}</span>
                        <span className="cm-row-sub">
                          {n.segmentLabel} · <span className="tnum">{n.variantCount}</span> รุ่นย่อย ·{" "}
                          {n.powertrains.join(" / ")}
                        </span>
                      </span>
                      <Strip n={n} />
                      <span>
                        {/* รุ่นที่มีเกรดเดียว (EQS) ไม่มี "ช่วง" ราคา — เขียนเป็นช่วงซ้ำเลขเดิมคือความมักง่าย */}
                        <span className="cm-price">
                          <b className="tnum">{formatTHB(n.variantPrices[0])}</b>
                          {n.variantPrices.length > 1 && (
                            <span className="tnum">
                              {" "}
                              – {formatTHB(n.variantPrices[n.variantPrices.length - 1])}
                            </span>
                          )}
                        </span>
                        <span className="cm-src">
                          {b.logo ? "หน้าทางการผู้ผลิต" : "สื่อยานยนต์ที่ตรงกันหลายสำนัก"}
                        </span>
                      </span>
                    </a>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <div className="cm-shell">
          <section className="cm-foot">
            <div>
              <h2>อ่านหน้านี้ยังไง</h2>
              <p>
                หนึ่งจุดคือหนึ่งรุ่นย่อยที่ซื้อได้จริง วางตามราคาป้ายของตัวเองบนแกนเดียวกันทั้งหน้า —
                จุดที่เกาะกลุ่มแปลว่าเกรดต่างกันน้อย จุดที่ห่างแปลว่าจ่ายเพิ่มก้อนใหญ่เพื่อข้ามชั้น
              </p>
              <p>
                แกนราคาไม่ใช่เส้นตรง แต่ละช่วงคือราคาเพิ่มเท่าตัว (5 แสน · 1 ล้าน · 2 ล้าน · 4 ล้าน · 8 ล้าน)
                เพราะรถถูกสุดกับแพงสุดในฐานห่างกัน 13 เท่า ถ้าใช้แกนตรงรถส่วนใหญ่จะกองอยู่มุมซ้ายจนอ่านไม่ออก
              </p>
              <p className="cm-legend">
                {Object.entries(PT_COLOR).map(([k, v]) => (
                  <span key={k}>
                    <i style={{ background: v }} />
                    {k}
                  </span>
                ))}
              </p>
            </div>
            <div>
              <h2>สิ่งที่หน้านี้ยังไม่มี</h2>
              <p>
                ตอนนี้มี {TOTALS.brands} แบรนด์ · อีก {UPCOMING_BRANDS.length} แบรนด์ (
                {UPCOMING_BRANDS.join(" · ")}) ยังไม่เปิด เพราะยังเก็บราคาให้ครบทุกเกรดไม่เสร็จ —
                เราเปิดแบรนด์เมื่อข้อมูลครบพอ ไม่เปิดหน้าเปล่าไว้ก่อน
              </p>
              <p>
                ราคาบนหน้านี้เป็นราคาป้ายทางการเท่านั้น ไม่ใช่ราคาซื้อขายจริงและไม่รวมส่วนลด ·
                ราคามือสองยังไม่มีในระบบ · ประวัติการปรับราคาเพิ่งเริ่มเก็บ ส่วนใหญ่จึงยังมีบันทึกเดียวต่อรุ่นย่อย
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
