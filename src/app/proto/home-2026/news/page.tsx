/*
  ทิศ B · ห้องข่าว — "เหตุการณ์เป็นพระเอก"
  THESIS: โจทย์เดียวกับทิศ A (พิสูจน์ความแม่นด้วยความสด) แต่คนละสมมติฐานว่าอะไรทำให้เชื่อ
    ทิศ A เชื่อว่า "เห็นสถานะทั้งหมด" แล้วเชื่อ · ทิศ B เชื่อว่า "เห็นว่ามีคนทำงานอยู่ตลอด" แล้วเชื่อ
  ผังของทิศนี้: เปิดมาเจอ "ล่าสุดเราทำอะไร" เป็นข่าวเด่น แล้วไล่ลงมาเป็นเส้นเวลารายวัน
    → เหมาะกับคนที่กลับมาซ้ำแล้วถามว่า "มีอะไรใหม่"  · สถานะฐานถูกลดเหลือแถบเดียว
  น้ำเสียง: มีจังหวะ พาดหัวใหญ่ ป้ายประเภทมีสี วันที่เป็นหัวเรื่อง — เหมือนหน้าสำนักข่าวข้อมูล
*/
import { HeroHeadline } from "@/components/hero-headline";
import { formatDateTH } from "@/lib/format";

import "../fresh.css";
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
  auditByDate,
  daysBetween,
  freshLevel,
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

const LEAD = AUDIT_LOG[0];
/** เส้นเวลาไล่ต่อจากข่าวเด่น — ตัดเหตุการณ์ที่ยกไปเป็นข่าวเด่นแล้วออก ไม่ให้ซ้ำสองที่ */
const REST = auditByDate()
  .map(([date, list]) => [date, list.filter((e) => e.id !== LEAD.id)] as const)
  .filter(([, list]) => list.length > 0);

export default async function NewsHomePage({ searchParams }: Props) {
  const sp = await searchParams;
  const today = sp.stale === "1" ? STALE_TODAY : TODAY;
  const daysSince = daysBetween(LAST_AUDIT, today);
  const tone = freshLevel(daysSince);

  return (
    <div className="fx fx-news">
      <NavBar />

      {/* แถบบอกความสดใต้เมนู — ของชิ้นแรกที่ตาเจอ ก่อนพาดหัวด้วยซ้ำ */}
      <div className={`fx-tone-${tone}`} style={{ borderBottom: "1px solid var(--hair)", background: "var(--tone-soft)" }}>
        <div className="fx-shell" style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px", alignItems: "baseline", padding: "9px 20px", fontSize: 13 }}>
          <b style={{ color: "var(--tone)", fontWeight: 600 }}>
            อัปเดตล่าสุด <span className="tnum">{daysSince}</span> วันที่แล้ว
          </b>
          <span style={{ color: "var(--ink-2)" }}>
            {formatDateTH(LAST_AUDIT)} — {LEAD.title}
          </span>
        </div>
      </div>

      <main>
        {/* ── หัวหน้า (เตี้ยกว่าทิศ A เพราะรีบพาไปที่ข่าว) ─────────── */}
        <section className="fx-hero" style={{ paddingBottom: 20 }}>
          <div className="fx-shell">
            <div style={{ maxWidth: 768 }}>
              <HeroHeadline />
            </div>
            <SearchBox action="/proto/home-2026/news" />
            <BrandPills />
          </div>
        </section>

        {/* ── ข่าวเด่น = เหตุการณ์ล่าสุด ───────────────────────────── */}
        <section className="fx-band" id="log" style={{ paddingTop: 24 }}>
          <div className="fx-shell">
            <span className="fx-num">ความเคลื่อนไหวล่าสุด</span>
            <div className="fx-lead">
              <div>
                <KindTag kind={LEAD.kind} />
                <h2>{LEAD.title}</h2>
                <p className="lede">{LEAD.detail}</p>
                <EventMeta event={LEAD} />
                {LEAD.caveat ? <Caveat text={LEAD.caveat} /> : null}
              </div>
              <div className="fx-figures">
                {LEAD.counts.map((c) => (
                  <div key={c.label} className="fx-figure">
                    <span>{c.label}</span>
                    <b className="tnum">{c.value}</b>
                  </div>
                ))}
                <div className="fx-figure">
                  <span>บันทึกเมื่อ</span>
                  <b className="tnum" style={{ fontSize: 15 }}>
                    {formatDateTH(LEAD.date)}
                  </b>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── เส้นเวลารายวัน ──────────────────────────────────────── */}
        <section className="fx-band tint" style={{ paddingTop: 32 }}>
          <div className="fx-shell">
            <h2 className="fx-h2">ย้อนดูทุกครั้งที่เราแตะข้อมูล</h2>
            <p className="fx-h2-note">
              ไม่ใช่ข่าวรถ — เป็นบันทึกงานของเราเอง ว่าวันไหนไปเก็บอะไร จากแหล่งไหน และเจอข้อจำกัดอะไร
              บันทึกเพิ่มแถวใหม่เสมอ ไม่เขียนทับของเก่า
              <Sup n={5} />
            </p>

            <div style={{ marginTop: 8 }}>
              {REST.map(([date, list]) => (
                <div key={date} className="fx-daygroup">
                  <div className="fx-day">
                    <span className="tnum">{formatDateTH(date)}</span>
                    <small className="tnum">{daysBetween(date, today)} วันที่แล้ว</small>
                  </div>
                  <div>
                    {list.map((e) => (
                      <article key={e.id} className="fx-item">
                        <KindTag kind={e.kind} />
                        <h3>{e.title}</h3>
                        <p>{e.detail}</p>
                        <CountsLine counts={e.counts} />
                        <EventMeta event={e} />
                        {e.caveat ? <Caveat text={e.caveat} /> : null}
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── สถานะฐาน (รองในทิศนี้ — เหลือแถบเดียว) ───────────────── */}
        <section className="fx-band" id="coverage">
          <div className="fx-shell">
            <h2 className="fx-h2">ฐานข้อมูลนี้มีอะไร และครบแค่ไหน</h2>
            <div className="fx-strip" style={{ marginTop: 16 }}>
              <span>
                <b className="tnum">{DB_STATS.brands}</b> แบรนด์
              </span>
              <span>
                <b className="tnum">{DB_STATS.nameplates}</b> รุ่น
              </span>
              <span>
                <b className="tnum">{DB_STATS.variants}</b> เกรดที่ซื้อได้จริง
                <Sup n={2} />
              </span>
              <span>
                <b className="tnum">{DB_STATS.sources}</b> แหล่งอ้างอิงที่เปิดดูได้
              </span>
            </div>

            <div style={{ marginTop: 14 }}>
              <FreshBar lastDate={LAST_AUDIT} today={today} />
            </div>

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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── สิ่งที่ยังไม่มี ─────────────────────────────────────── */}
        <section className="fx-band tint" id="pending">
          <div className="fx-shell">
            <h2 className="fx-h2">ของที่เว็บนี้ยังทำไม่ได้ พูดไว้ตรงนี้</h2>
            <p className="fx-h2-note">
              ถ้าไม่เขียนไว้ คนจะเข้าใจว่าเราเก็บครบแล้วแต่หาไม่เจอ
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
