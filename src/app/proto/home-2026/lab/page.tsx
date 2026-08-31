/*
  ทิศ A · ห้องแล็บ — "สถานะเป็นพระเอก"
  THESIS: เบสเคาะว่าหน้าแรกมีหน้าที่ทำให้เชื่อว่าข้อมูลที่นี่แม่นกว่าที่อื่น และไม่มีคู่แข่งให้เทียบผลลัพธ์
    → พิสูจน์ด้วยการ "เปิดครัว": บอกให้หมดว่าฐานนี้มีอะไร ตรวจเมื่อไร ครบแค่ไหน และอะไรยังไม่มี
  ผังของทิศนี้: เปิดมาเจอ "รายงานสถานะ" ก่อน แล้วบันทึกการตรวจสอบอยู่รอง
    → เหมาะกับคนที่เข้ามาครั้งแรกแล้วถามว่า "เว็บนี้เชื่อได้ไหม"
  น้ำเสียง: เงียบ เนี้ยบ เส้นผมบาง ตัวเลขเรียงหลักตรง — เหมือนรายงานผลตรวจ ไม่ใช่โบรชัวร์
*/
import { HeroHeadline } from "@/components/hero-headline";
import { formatDateTH } from "@/lib/format";

import "../fresh.css";
import { NAMEPLATES } from "../../_kit/data";
import {
  AUDIT_LOG,
  CELL_TEXT,
  COVERAGE,
  COVERAGE_COLUMNS,
  DB_STATS,
  LAST_AUDIT,
  PENDING,
  STALE_TODAY,
  TODAY,
  daysBetween,
} from "../_fresh/data";
import {
  BrandPills,
  Caveat,
  CountsLine,
  EventMeta,
  Footnotes,
  FreshBar,
  KindTag,
  NavBar,
  SearchBox,
  Sup,
} from "../_fresh/kit";

type Props = { searchParams: Promise<{ stale?: string }> };

/* รุ่นที่มีเกรดมากที่สุด — ใช้เป็นตัวอย่างว่า "ลึกถึงเกรด" แปลว่าอะไร */
const deepest = NAMEPLATES.reduce((a, b) => (b.variantCount > a.variantCount ? b : a));

export default async function LabHomePage({ searchParams }: Props) {
  const sp = await searchParams;
  const today = sp.stale === "1" ? STALE_TODAY : TODAY;

  return (
    <div className="fx fx-lab">
      <NavBar />

      <main>
        {/* ── หัวหน้า ─────────────────────────────────────────────── */}
        <section className="fx-hero">
          <div className="fx-shell">
            <div style={{ maxWidth: 768 }}>
              <HeroHeadline />
            </div>
            <p className="fx-hero-sub">
              ฐานข้อมูลรถไทยที่แยกลึกถึงเกรดที่ซื้อได้จริงทุกคัน — และเปิดให้ดูด้วยว่า
              แต่ละตัวเลขมาจากไหน ตรวจเมื่อไร และตรงไหนที่เรายังไม่มีข้อมูล
            </p>
            <SearchBox action="/proto/home-2026/lab" />
            <BrandPills />
          </div>
        </section>

        {/* ── 01 สถานะฐานข้อมูล (พระเอกของทิศนี้) ──────────────────── */}
        <section className="fx-band">
          <div className="fx-shell">
            <span className="fx-num">01 — สถานะฐานข้อมูล</span>
            <h2 className="fx-h2">ตอนนี้ในฐานข้อมูลมีอะไรอยู่บ้าง</h2>
            <p className="fx-h2-note">
              ทุกเว็บบอกได้ว่ามีข้อมูลรถ แต่ไม่มีเว็บไหนบอกว่า
              <strong> ข้อมูลนั้นตรวจครั้งสุดท้ายเมื่อไร</strong> — เราขึ้นไว้บนสุดของหน้าแรก
              ต่อให้ตัวเลขจะไม่สวยก็ตาม
              <Sup n={6} />
            </p>

            <div style={{ marginTop: 20 }}>
              <FreshBar lastDate={LAST_AUDIT} today={today} />
            </div>

            <div className="fx-stats">
              <div className="fx-stat">
                <b className="tnum">{DB_STATS.brands}</b>
                <span>แบรนด์ที่เปิดแล้ว</span>
                <small>เปิดต่อเมื่อเก็บราคาครบทุกเกรด ไม่เปิดหน้าที่ข้อมูลบาง</small>
              </div>
              <div className="fx-stat">
                <b className="tnum">{DB_STATS.nameplates}</b>
                <span>รุ่นรถ</span>
                <small>นับเฉพาะรุ่นที่ยังขายอยู่ในไทย</small>
              </div>
              <div className="fx-stat">
                <b className="tnum">{DB_STATS.variants}</b>
                <span>เกรดที่ซื้อได้จริง</span>
                <small>
                  แยกทุกเกรด ไม่ยุบเป็นช่วงราคา — {deepest.name} รุ่นเดียวมี {deepest.variantCount} เกรด
                  <Sup n={2} />
                </small>
              </div>
              <div className="fx-stat">
                <b className="tnum">{DB_STATS.sources}</b>
                <span>แหล่งอ้างอิง</span>
                <small>ทุกแหล่งเปิดลิงก์ดูได้ พร้อมวันที่ตรวจและระดับความเชื่อมั่น</small>
              </div>
              <div className="fx-stat">
                <b className="tnum">{DB_STATS.audits}</b>
                <span>บันทึกการตรวจสอบ</span>
                <small>เพิ่มแถวใหม่เท่านั้น ไม่เขียนทับของเก่า</small>
              </div>
            </div>
          </div>
        </section>

        {/* ── 02 ความครบถ้วน ──────────────────────────────────────── */}
        <section className="fx-band tint" id="coverage">
          <div className="fx-shell">
            <span className="fx-num">02 — ความครบถ้วน</span>
            <h2 className="fx-h2">อะไรเก็บครบแล้ว อะไรยังไม่ได้เก็บ</h2>
            <p className="fx-h2-note">
              ตารางนี้คือสิ่งที่เว็บอื่นไม่ทำ เพราะมันฟ้องตัวเอง — แต่เป็นสิ่งเดียวที่ทำให้รู้ว่า
              เวลาเว็บนี้เงียบเรื่องอะไร แปลว่า “ยังไม่ได้เก็บ” ไม่ใช่ “ไม่มี”
            </p>

            <div className="fx-tablewrap">
              <table className="fx-table">
                <thead>
                  <tr>
                    <th>แบรนด์</th>
                    {COVERAGE_COLUMNS.map((c) => (
                      <th key={c.key} scope="col">
                        {c.label}
                        <small>{c.hint}</small>
                      </th>
                    ))}
                    <th>ตรวจล่าสุด</th>
                  </tr>
                </thead>
                <tbody>
                  {COVERAGE.map((row) => (
                    <tr key={row.slug}>
                      <th scope="row" className="fx-brandcell">
                        <b>{row.brand}</b>
                        <small>
                          {row.nameplates} รุ่น · {row.variants} เกรด — {row.note}
                        </small>
                      </th>
                      {COVERAGE_COLUMNS.map((c) => {
                        const state = row.cells[c.key];
                        const t = CELL_TEXT[state];
                        return (
                          <td key={c.key} className="c">
                            <span className={`fx-cell ${state}`}>
                              <span aria-hidden>{t.mark}</span>
                              <i>{t.label}</i>
                            </span>
                          </td>
                        );
                      })}
                      <td className="tnum" style={{ whiteSpace: "nowrap", fontSize: 13 }}>
                        {formatDateTH(row.checkedDate)}
                        <br />
                        <span style={{ color: "var(--ink-3)", fontSize: 12 }}>
                          {daysBetween(row.checkedDate, today)} วันที่แล้ว
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ marginTop: 12, fontSize: 12.5, color: "var(--ink-3)", lineHeight: 1.7 }}>
              ✓ เก็บครบแล้ว · ◐ เก็บบางส่วน · — ยังไม่เก็บ · ○ ยังไม่มีอะไรให้บันทึก (เช่น ประวัติราคา
              ที่ยังไม่มีการเปลี่ยนแปลงเกิดขึ้นเลยตั้งแต่เริ่มตรวจ)
              <Sup n={5} />
            </p>
          </div>
        </section>

        {/* ── 03 บันทึกการตรวจสอบ ─────────────────────────────────── */}
        <section className="fx-band" id="log">
          <div className="fx-shell">
            <span className="fx-num">03 — บันทึกการตรวจสอบ</span>
            <h2 className="fx-h2">ทุกครั้งที่เราแตะข้อมูล มีบันทึกไว้</h2>
            <p className="fx-h2-note">
              เรียงจากใหม่ไปเก่า · แถวที่เขียนว่า “ราคาที่เปลี่ยน 0 รายการ” คือการยืนยันว่าราคาเท่าเดิม
              ไม่ใช่การไม่ได้ตรวจ — สองอย่างนี้ต่างกัน และเว็บทั่วไปไม่แยกให้
            </p>

            <div className="fx-log">
              {AUDIT_LOG.map((e) => (
                <article key={e.id} className="fx-row">
                  <div className="date">
                    <span className="tnum">{formatDateTH(e.date)}</span>
                    <small className="tnum">{daysBetween(e.date, today)} วันที่แล้ว</small>
                  </div>
                  <div>
                    <KindTag kind={e.kind} />
                  </div>
                  <div>
                    <h3>{e.title}</h3>
                    <p>{e.detail}</p>
                    <CountsLine counts={e.counts} />
                    <EventMeta event={e} />
                    {e.caveat ? <Caveat text={e.caveat} /> : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── 04 สิ่งที่ยังไม่มี ──────────────────────────────────── */}
        <section className="fx-band tint" id="pending">
          <div className="fx-shell">
            <span className="fx-num">04 — สิ่งที่ยังไม่มี</span>
            <h2 className="fx-h2">ของที่เว็บนี้ยังทำไม่ได้ พูดไว้ตรงนี้</h2>
            <p className="fx-h2-note">
              การบอกว่าอะไรยังไม่มี คือส่วนหนึ่งของการบอกว่าอะไรเชื่อได้ —
              ถ้าไม่เขียนไว้ คนจะเข้าใจว่าเราเก็บครบแล้วแต่ไม่เจอ
            </p>
            <div className="fx-pending">
              {PENDING.map((p) => (
                <div key={p.title} className="fx-pend">
                  <h3>{p.title}</h3>
                  <p>{p.why}</p>
                  <p className="when">มีให้ดูเมื่อ: {p.when}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footnotes />
    </div>
  );
}
