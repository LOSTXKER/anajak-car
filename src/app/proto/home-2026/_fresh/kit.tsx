// ชิ้นส่วนที่สองทิศของ M33 ใช้ร่วมกัน — ต่างกันที่ "ผัง" ไม่ใช่ที่ชิ้นส่วน
// (ถ้าชิ้นส่วนต่างกันด้วย จะเทียบไม่ออกว่าเบสชอบเพราะผังหรือเพราะรายละเอียด)
import { formatDateTH } from "@/lib/format";

import { BRANDS, UPCOMING_BRANDS, brandStats } from "../../_kit/data";
import {
  type AuditEvent,
  type AuditKind,
  type FreshLevel,
  FRESH_TEXT,
  daysBetween,
  freshLevel,
} from "./data";

const KIND_CLASS: Record<AuditKind, string> = {
  ตรวจสอบราคา: "k-price",
  เพิ่มแบรนด์: "k-brand",
  เปิดตัวรุ่น: "k-launch",
  จำแนกอุปกรณ์: "k-spec",
  แก้โครงสร้าง: "k-struct",
};

export function KindTag({ kind }: { kind: AuditKind }) {
  return <span className={`fx-kind ${KIND_CLASS[kind]}`}>{kind}</span>;
}

export function ConfTag({ level }: { level: AuditEvent["confidence"] }) {
  if (!level) return null;
  return (
    <span className={`fx-conf ${level === "HIGH" ? "high" : "medium"}`}>
      ความเชื่อมั่น{level === "HIGH" ? "สูง" : "กลาง"}
    </span>
  );
}

export function Sup({ n }: { n: number }) {
  return (
    <a href={`#fn${n}`} className="fx-sup" aria-label={`ดูเชิงอรรถข้อ ${n}`}>
      {n}
    </a>
  );
}

/** ตัวเลขประกอบเหตุการณ์ — "ราคาที่เปลี่ยน 0" คือข้อมูล ไม่ใช่ความว่างเปล่า จึงต้องแสดง */
export function CountsLine({ counts }: { counts: AuditEvent["counts"] }) {
  if (counts.length === 0) return null;
  return (
    <p className="fx-counts">
      {counts.map((c) => (
        <span key={c.label}>
          {c.label} <b className="tnum">{c.value}</b>
        </span>
      ))}
    </p>
  );
}

/** แถวข้อมูลกำกับใต้เหตุการณ์ — ที่มา + ความเชื่อมั่น + ขอบเขต (evidence-first) */
export function EventMeta({ event }: { event: AuditEvent }) {
  return (
    <div className="fx-meta">
      <ConfTag level={event.confidence} />
      <span>ขอบเขต: {event.scope}</span>
      {event.source ? (
        <a className="fx-link" href={event.source.url} target="_blank" rel="noopener noreferrer">
          ที่มา: {event.source.publisher} ↗
        </a>
      ) : (
        <span>ที่มา: งานจัดระเบียบข้อมูลภายใน ไม่มีลิงก์ภายนอก</span>
      )}
    </div>
  );
}

export function Caveat({ text }: { text: string }) {
  return (
    <p className="fx-caveat">
      <b>ข้อจำกัด</b>
      <span>{text}</span>
    </p>
  );
}

/** แถบความสด — ตัวเลข "กี่วันที่แล้ว" คือหัวใจของทิศนี้ ต้องอ่านได้ในแวบเดียว */
export function FreshBar({ lastDate, today }: { lastDate: string; today: string }) {
  const days = daysBetween(lastDate, today);
  const level: FreshLevel = freshLevel(days);
  const t = FRESH_TEXT[level];
  return (
    <div className={`fx-fresh fx-tone-${level}`}>
      <span className="big tnum">{days} วันที่แล้ว</span>
      <span className="lab">{t.label}</span>
      <span className="say">
        ตรวจสอบครั้งล่าสุด {formatDateTH(lastDate)} · {t.say}
      </span>
    </div>
  );
}

export function NavBar() {
  return (
    <header className="fx-nav">
      <div className="fx-shell fx-nav-in">
        <span className="fx-brand">
          CAR<span>META</span>
        </span>
        <nav className="fx-nav-links" aria-label="เมนูหลัก">
          <a href="#log">บันทึกการตรวจสอบ</a>
          <a href="#coverage">ความครบถ้วน</a>
          <a href="#pending">สิ่งที่ยังไม่มี</a>
        </nav>
      </div>
    </header>
  );
}

/** ช่องค้นหา — หน้าลองยังไม่ต่อระบบค้นหาจริง (server component ส่ง handler ไม่ได้) */
export function SearchBox({ action }: { action: string }) {
  return (
    <form className="fx-search" role="search" action={action}>
      <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden style={{ color: "var(--ink-3)" }}>
        <circle cx="9" cy="9" r="5.4" />
        <path d="m13.3 13.3 3.5 3.5" strokeLinecap="round" />
      </svg>
      <input aria-label="ค้นหารุ่นรถหรือเกรด" placeholder="ค้นหารุ่นหรือเกรด เช่น Hilux Travo, Overland Plus" />
      <button type="submit">ค้นหา</button>
    </form>
  );
}

/** ทางลัดแบรนด์ในหัวหน้า — เบสสั่งไว้ตั้งแต่ M31b ว่า hero ต้องมีโลโก้แบรนด์เป็นทางลัด */
export function BrandPills() {
  return (
    <nav className="fx-pills" aria-label="ทางลัดไปหน้าแบรนด์">
      {BRANDS.map((b) => {
        const st = brandStats(b.slug);
        return (
          <a key={b.slug} href="#coverage" className="fx-pill">
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
      {UPCOMING_BRANDS.slice(0, 4).map((name) => (
        <span key={name} className="fx-pill off">
          <span className="wm">{name}</span>
          <span className="n">ยังไม่เปิด</span>
        </span>
      ))}
    </nav>
  );
}

export const FOOTNOTES = [
  "ราคาทุกตัวในหน้านี้คือ “ราคาป้ายทางการ” ของผู้ผลิต ไม่ใช่ราคาหลังส่วนลด ไม่ใช่ราคาที่ซื้อขายกันจริง และไม่ใช่ราคามือสอง",
  "“เกรด” คือรุ่นย่อยที่สั่งซื้อได้จริงคนละราคา — เว็บนี้เก็บแยกทุกเกรด ไม่ยุบเป็นช่วงราคาเดียวต่อรุ่น",
  "ความเชื่อมั่น “สูง” = ยืนยันจากหน้าทางการของผู้ผลิตโดยตรง · “กลาง” = ยืนยันจากสื่อที่ตัวเลขตรงกันตั้งแต่สองสำนักขึ้นไป เพราะหน้าทางการดึงไม่ได้",
  "ระบบช่วยขับแยก 3 สถานะ: ยืนยันว่ามี / ยืนยันว่าไม่มี / เอกสารทางการไม่ระบุ — สถานะที่สามไม่เท่ากับ “ไม่มี”",
  "บันทึกการตรวจสอบเป็นแบบเพิ่มแถวใหม่เท่านั้น ไม่เขียนทับของเก่า ของที่เคยบันทึกผิดจะขึ้นเป็นแถวแก้ไข ไม่ใช่หายไปเงียบๆ",
  "หน้าลองนี้ใช้ชุดข้อมูลแช่แข็ง (ไม่ได้ยิงฐานข้อมูลจริง) และตรึงวันที่ไว้เพื่อให้เปิดกี่ครั้งก็ได้ภาพเดิม — ของจริงจะนับวันจากวันที่เปิดหน้า",
];

export function Footnotes() {
  return (
    <footer className="fx-foot">
      <div className="fx-shell">
        <h2>เชิงอรรถ</h2>
        <ol>
          {FOOTNOTES.map((t, i) => (
            <li key={i} id={`fn${i + 1}`}>
              {t}
            </li>
          ))}
        </ol>
      </div>
    </footer>
  );
}
