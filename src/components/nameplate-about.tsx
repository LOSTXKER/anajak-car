import type { NameplateDetail, NameplateTree } from "@/lib/queries";
import { CHANGE_TYPE_LABEL, CHASSIS_TYPE_LABEL } from "@/lib/labels";
import { formatDateTH } from "@/lib/format";
import { Chip, DataStatusValue, EvidenceLink, PendingBlock, SpecRow } from "@/components/badges";
import { SectionHeader } from "@/components/panel";

// ── ข้อมูลประกอบระดับรุ่น — 2 คอลัมน์บนจอกว้าง (เกี่ยวกับรุ่น | ไทม์ไลน์) + แหล่งอ้างอิงเต็มกว้าง ──
// สเปก/ADAS ของแต่ละรุ่นย่อยอยู่หน้า SKU (/cars/[slug]/[sku])
export function NameplateAbout({ detail, tree }: { detail: NameplateDetail; tree: NameplateTree }) {
  const gen = tree.generations[0] ?? null;
  const hasTimeline = detail.changeEvents.length > 0;

  return (
    <div className="mt-12 space-y-12">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-10">
        {/* เกี่ยวกับรุ่นนี้ */}
        <section aria-label="เกี่ยวกับรุ่นนี้">
          <SectionHeader id="about-heading" title="เกี่ยวกับรุ่นนี้" />
          {detail.summary && <p className="mt-4 text-[15px] leading-7 text-muted">{detail.summary}</p>}
          {gen && (
            <dl className="mt-4">
              <SpecRow label="เจเนอเรชัน">{gen.launchYear ? `เปิดตัว ${gen.launchYear}` : "—"}{gen.code ? ` · ${gen.code}` : ""}</SpecRow>
              <SpecRow label="แพลตฟอร์ม"><DataStatusValue value={gen.platformName} /></SpecRow>
              <SpecRow label="โครงสร้างตัวถัง"><DataStatusValue value={gen.chassisType ? CHASSIS_TYPE_LABEL[gen.chassisType] : null} /></SpecRow>
              <SpecRow label="ตัวถัง / รุ่นย่อย"><span className="tnum">{gen.derivatives.length} ตัวถัง · {gen.variantCount} รุ่นย่อย</span></SpecRow>
            </dl>
          )}
          {gen?.summary && <p className="mt-4 border-t border-border pt-4 text-sm leading-6 text-faint">{gen.summary}</p>}
        </section>

        {/* ไทม์ไลน์และประวัติ */}
        <section aria-label="ไทม์ไลน์และประวัติ">
          <SectionHeader id="timeline-heading" title="ไทม์ไลน์และประวัติ" />
          {hasTimeline ? (
            <ol className="mt-4 border-l border-border">
              {detail.changeEvents.map((e) => (
                <li key={e.id} className="relative pb-7 pl-6 last:pb-0">
                  <span aria-hidden className="absolute top-1.5 -left-[5px] size-2.5 rounded-full bg-accent ring-4 ring-background" />
                  <div className="flex flex-wrap items-center gap-2"><span className="tnum text-xs text-faint">{formatDateTH(e.effectiveDate) ?? "ไม่ระบุวันที่"}</span><Chip>{CHANGE_TYPE_LABEL[e.changeType] ?? e.changeType}</Chip></div>
                  <p className="mt-1.5 font-medium">{e.title}</p>
                  {e.summary && <p className="mt-1 text-sm text-muted">{e.summary}</p>}
                  {(e.beforeValue || e.afterValue) && <p className="mt-1 text-sm text-muted tnum">{e.beforeValue ?? "—"} → {e.afterValue ?? "—"}</p>}
                  {e.evidence && <div className="mt-2"><EvidenceLink evidence={e.evidence} /></div>}
                </li>
              ))}
            </ol>
          ) : (
            <div className="mt-4"><PendingBlock title="ยังไม่มีบันทึกการเปลี่ยนแปลง" reason="จะเพิ่มเมื่อมีเหตุการณ์ที่มีหลักฐาน (เปิดตัว/ปรับราคา/เฟซลิฟต์/เรียกคืน)" /></div>
          )}
        </section>
      </div>

      {/* แหล่งอ้างอิง */}
      <section aria-label="แหล่งอ้างอิง">
        <SectionHeader id="sources-heading" title="แหล่งอ้างอิง" sub={<><span className="tnum">{detail.sources.length}</span> แหล่ง — หลักฐานราคาและข้อมูลในหน้านี้</>} />
        <ul className="mt-2 max-w-3xl divide-y divide-border">
          {detail.sources.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center gap-2 py-3 text-sm">
              <span className="font-medium">{s.publisher ?? "ไม่ระบุผู้เผยแพร่"}</span>
              {s.title && <span className="text-muted">{s.url ? <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent hover:underline">{s.title} ↗</a> : s.title}</span>}
              {s.checkedDate && <span className="ml-auto text-xs text-faint tnum">ตรวจ {formatDateTH(s.checkedDate)}</span>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
