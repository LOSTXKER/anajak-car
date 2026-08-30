/*
  THESIS: หน้าแรกที่ให้ความรู้สึกเหมือนเว็บผู้ผลิตรถระดับบน แต่พิสูจน์ความจริงของ CARMETA ไปพร้อมกัน —
    ภาพรถเป็นพระเอก ช่องไฟกว้าง ตัวอักษรคม · ปฏิเสธการอัดตารางตั้งแต่บรรทัดแรก (รอบก่อนแห้งเกินไป)
  OWN-WORLD: ขาว–เทาอ่อน หมึกเกือบดำ น้ำเงิน CI ใช้เท่าที่จำเป็น · เส้น 1px · ไม่มีการ์ดลอย ไม่มีเงาหนา ไม่มีไล่สีบนตัวอักษร
  STORY: เปิดมาเจอพาดหัวใหญ่ที่พิมพ์วนได้กับช่องค้นหาใหญ่ (สองอย่างที่เบสอยากเก็บ) แล้วภาพรถพาสายตาลงไปที่แบรนด์ → รุ่นเด่น → ตารางทั้งฐาน
  FIRST VIEWPORT: พาดหัว 82px กลางหน้า · ช่องค้นหาใหญ่ใต้พาดหัว · บรรทัดพิสูจน์ (12 รุ่น · 64 รุ่นย่อย · วันที่ตรวจ) · ภาพรถเต็มเวทีใต้ลงไป
  FORM: โครงเดิมของเว็บ (hero + ค้นหา + แบรนด์ + ตาราง) ยกระดับด้วยภาษาเว็บรถหรู — ไม่ใช่โลกภาพที่ยืมมาสวม
  FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
*/
import Image from "next/image";

import { HeroHeadline } from "@/components/hero-headline";
import { formatDateTH, formatTHB } from "@/lib/format";

import "../lux.css";
import { BRANDS, NAMEPLATES, TOTALS, UPCOMING_BRANDS, brandStats } from "../../_kit/data";

const FEATURED = ["hilux-travo", "bz4x", "fortuner"];

export default function LuxHomePage() {
  const featured = FEATURED.map((s) => NAMEPLATES.find((n) => n.slug === s)!);
  const hero = featured[0];
  const table = [...NAMEPLATES].sort((a, b) => (a.priceMin ?? 0) - (b.priceMin ?? 0));

  return (
    <div className="lx">
      <header className="lx-top">
        <div className="lx-shell lx-top-in">
          <span className="lx-word">CARMETA</span>
          <nav className="lx-menu" aria-label="เมนูหลัก">
            <a href="#brands">แบรนด์</a>
            <a href="#models">รุ่นรถ</a>
            <a href="#database">ฐานข้อมูล</a>
          </nav>
          <span className="lx-top-cta">ข้อมูล ณ {formatDateTH(TOTALS.latestChecked)}</span>
        </div>
      </header>

      <main>
        {/* Hero — พาดหัวพิมพ์วนของเดิม + ช่องค้นหาใหญ่ + ภาพรถเป็นพระเอก */}
        <section className="lx-hero">
          <div className="lx-shell lx-hero-in">
            <div className="lx-rise">
              <HeroHeadline />
            </div>
            <p className="lx-hero-sub lx-rise lx-rise-2">
              ฐานข้อมูลรถยนต์ในไทยที่แยกลึกถึงรุ่นย่อยที่ซื้อได้จริง — ราคาป้ายทางการทุกเกรด
              พร้อมหน้าต้นทางและวันที่ตรวจกำกับทุกตัวเลข
            </p>

            {/* หน้าลองยังไม่ต่อระบบค้นหาจริง — ใช้ form ธรรมดา (server component ส่ง event handler ไม่ได้) */}
            <form className="lx-search lx-rise lx-rise-2" role="search" action="/proto/home-2026/lux">
              <svg viewBox="0 0 20 20" width="19" height="19" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" aria-hidden>
                <circle cx="9" cy="9" r="5.6" />
                <path d="m13.4 13.4 3.6 3.6" strokeLinecap="round" />
              </svg>
              <input aria-label="ค้นหารุ่นรถหรือเกรด" placeholder="ค้นหารุ่นรถหรือเกรด เช่น Hilux Travo, Overland Plus" />
              <button type="submit">ค้นหา</button>
            </form>

            <p className="lx-proof lx-rise lx-rise-3">
              <span>
                <b>{TOTALS.nameplates}</b> รุ่น
              </span>
              <span>
                <b>{TOTALS.variants}</b> รุ่นย่อยที่ซื้อได้จริง
              </span>
              <span>
                <b>{TOTALS.brands}</b> แบรนด์
              </span>
              <span>ราคาป้ายทางการ ไม่ใช่ราคาซื้อขายจริง</span>
            </p>
          </div>

          <div className="lx-stage lx-rise lx-rise-3">
            <Image
              src={hero.image!}
              alt={`${hero.brand} ${hero.name}`}
              width={1000}
              height={560}
              priority
              sizes="(max-width: 1000px) 100vw, 1000px"
            />
            <span className="lx-stage-cap">
              {hero.brand} {hero.name} · {hero.variantCount} รุ่นย่อย · เริ่ม {formatTHB(hero.priceMin!)}
            </span>
          </div>
        </section>

        {/* แบรนด์ = ทางเข้าหลัก */}
        <section id="brands" className="lx-sec">
          <div className="lx-shell">
            <div className="lx-sec-head">
              <h2>เลือกจากแบรนด์</h2>
              <span className="lx-sec-note">
                เปิดแบรนด์เมื่อเก็บราคาครบทุกเกรดแล้วเท่านั้น — อีก {UPCOMING_BRANDS.length} แบรนด์กำลังทยอยเก็บ
              </span>
            </div>

            <div className="lx-brands">
              {BRANDS.map((b) => {
                const st = brandStats(b.slug);
                return (
                  <a key={b.slug} href="#" className="lx-brand">
                    <span className="lx-brand-logo">
                      {b.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element -- โลโก้ SVG local ที่ next/image ไม่ optimize
                        <img src={b.logo} alt={b.name} />
                      ) : (
                        <span>{b.name}</span>
                      )}
                    </span>
                    <span className="lx-brand-count">
                      {st.nameplates} รุ่น · {st.variants} รุ่นย่อย
                    </span>
                    <span className="lx-brand-price">
                      <em>ช่วงราคาป้าย</em>
                      <span className="tnum">
                        {formatTHB(st.priceMin!)} – {formatTHB(st.priceMax!)}
                      </span>
                    </span>
                    <span className="lx-brand-go">ดูรุ่นทั้งหมด →</span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* รุ่นเด่น — ภาพใหญ่สลับซ้ายขวา ไม่ใช่การ์ดขนาดเท่ากัน */}
        <section id="models" className="lx-sec" style={{ paddingBottom: 40 }}>
          <div className="lx-shell">
            <div className="lx-sec-head">
              <h2>ดูความต่างของแต่ละเกรด</h2>
              <span className="lx-sec-note">ตัวเลขทุกตัวมาจากตารางราคาทางการของผู้ผลิต</span>
            </div>

            {featured.map((n, i) => {
              const st = n.variantPrices;
              const gap = st[st.length - 1] - st[0];
              return (
                <article key={n.slug} className={`lx-feature${i % 2 === 1 ? " flip" : ""}`}>
                  <div className="lx-feature-media">
                    <Image
                      src={n.image!}
                      alt={`${n.brand} ${n.name}`}
                      width={620}
                      height={350}
                      sizes="(max-width: 900px) 100vw, 620px"
                    />
                  </div>
                  <div>
                    <p className="lx-kind">
                      {n.brand} · {n.segmentLabel}
                    </p>
                    <h3>{n.name}</h3>
                    <p>{n.summary}</p>
                    <div className="lx-spread">
                      <div>
                        <em>เริ่มต้น</em>
                        <b className="tnum">{formatTHB(st[0])}</b>
                      </div>
                      <div>
                        <em>สูงสุด</em>
                        <b className="tnum">{formatTHB(st[st.length - 1])}</b>
                      </div>
                      <div>
                        <em>ต่างกัน</em>
                        <b className="tnum">{formatTHB(gap)}</b>
                      </div>
                      <div>
                        <em>เกรดที่ซื้อได้</em>
                        <b className="tnum">{n.variantCount}</b>
                      </div>
                    </div>
                    <p className="lx-feature-src">
                      ตรวจล่าสุด {formatDateTH(n.checkedDate)} ·{" "}
                      <a href="https://www.toyota.co.th/" target="_blank" rel="noopener noreferrer">
                        หน้าราคาทางการของผู้ผลิต
                      </a>
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ตารางทั้งฐาน */}
        <section id="database" className="lx-sec" style={{ borderBottom: 0 }}>
          <div className="lx-shell">
            <div className="lx-sec-head">
              <h2>ทุกรุ่นในฐานข้อมูล</h2>
              <span className="lx-sec-note">เรียงตามราคาเริ่มต้น · ตรวจล่าสุด {formatDateTH(TOTALS.latestChecked)}</span>
            </div>

            <table className="lx-table">
              <thead>
                <tr>
                  <th>รุ่น</th>
                  <th className="lx-hide-sm">เกรดที่ซื้อได้</th>
                  <th className="lx-hide-sm">ขุมพลัง</th>
                  <th className="lx-num">ราคาเริ่มต้น</th>
                  <th className="lx-num lx-hide-sm">ราคาสูงสุด</th>
                </tr>
              </thead>
              <tbody>
                {table.map((n) => (
                  <tr key={n.slug}>
                    <td>
                      <a className="lx-row-model" href="#">
                        {n.image ? (
                          <Image src={n.image} alt="" width={84} height={48} />
                        ) : (
                          <span className="ph" aria-hidden>
                            ยังไม่มีรูป
                          </span>
                        )}
                        <span>
                          <span className="lx-row-name">{n.name}</span>
                          <span className="lx-row-brand">
                            {n.brand} · {n.segmentLabel}
                          </span>
                        </span>
                      </a>
                    </td>
                    <td className="lx-hide-sm">
                      <span className="lx-dots" aria-hidden>
                        {n.variantPrices.slice(0, 10).map((p, i) => (
                          <i key={`${p}-${i}`} />
                        ))}
                      </span>
                      <span className="lx-row-brand" style={{ marginTop: 6 }}>
                        {n.variantCount} เกรด
                      </span>
                    </td>
                    <td className="lx-hide-sm" style={{ fontSize: 14, color: "var(--ink-2)" }}>
                      {n.powertrains.join(" · ")}
                    </td>
                    <td className="lx-num">
                      <b className="tnum">{formatTHB(n.variantPrices[0])}</b>
                      <span>ตรวจ {formatDateTH(n.checkedDate)}</span>
                    </td>
                    <td className="lx-num lx-hide-sm">
                      <b className="tnum" style={{ fontWeight: 500, color: "var(--ink-2)" }}>
                        {n.variantPrices.length > 1
                          ? formatTHB(n.variantPrices[n.variantPrices.length - 1])
                          : "—"}
                      </b>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="lx-foot">
              <div>
                <h4>ราคาบนหน้านี้คือราคาอะไร</h4>
                <p>
                  ราคาป้ายทางการที่ผู้ผลิตประกาศ ไม่ใช่ราคาซื้อขายจริง ไม่รวมส่วนลดหรือโปรโมชัน ·
                  ทุกตัวเลขผูกหน้าต้นทางและวันที่ตรวจ และเก็บประวัติแบบไม่เขียนทับเมื่อมีการปรับราคา
                </p>
              </div>
              <div>
                <h4>สิ่งที่ยังไม่มี</h4>
                <p>
                  อีก {UPCOMING_BRANDS.length} แบรนด์ ({UPCOMING_BRANDS.join(" · ")}) ยังไม่เปิด
                  เพราะเก็บราคาให้ครบทุกเกรดยังไม่เสร็จ · ราคามือสองและประวัติการปรับราคายังไม่มีในระบบ ·
                  รูปรถมีเฉพาะแบรนด์ที่ได้สิทธิ์ใช้ภาพแล้ว ที่เหลือเว้นไว้ตามจริง
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
