import type { SourceRow } from "@/lib/queries";
import { CONFIDENCE_LABEL, SOURCE_TYPE_LABEL } from "@/lib/labels";
import { formatDateTH } from "@/lib/format";
import { ConfidenceBadge } from "@/components/badges";

export function SourcesSection({ sources }: { sources: SourceRow[] }) {
  // ความเชื่อมั่นพูดครั้งเดียว (DESIGN.md): ทุกแหล่งระดับเดียวกัน → สรุปประโยคเดียวใต้หัว section
  // ไม่ติดป้ายรายแถว · ระดับปนกันจริงเท่านั้นถึงติดป้ายรายแถว (คำไทย)
  const levels = [...new Set(sources.map((s) => s.confidence))];
  const uniformLevel = levels.length === 1 ? levels[0] : null;

  return (
    <section aria-labelledby="sources-heading" className="pb-20">
      <h2 id="sources-heading" className="text-xl font-semibold tracking-tight sm:text-2xl">
        แหล่งอ้างอิง
      </h2>
      {sources.length === 0 ? (
        <p className="mt-4 text-sm text-muted">ยังไม่มีแหล่งอ้างอิง</p>
      ) : (
        <>
          {uniformLevel && (
            <p className="mt-2 text-sm text-faint">ทุกแหล่ง{CONFIDENCE_LABEL[uniformLevel]}</p>
          )}
          <ul className="mt-4 max-w-3xl divide-y divide-border">
            {sources.map((source) => (
              <li key={source.id} className="flex flex-col gap-1 py-5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {source.publisher ?? "ไม่ระบุผู้เผยแพร่"}
                  </span>
                  {!uniformLevel && <ConfidenceBadge level={source.confidence} />}
                </div>
                {source.title && (
                  <p className="text-sm text-muted">
                    {source.url ? (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-accent hover:underline"
                      >
                        {source.title} ↗
                      </a>
                    ) : (
                      source.title
                    )}
                  </p>
                )}
                <p className="text-[13px] text-faint">
                  {SOURCE_TYPE_LABEL[source.sourceType] ?? source.sourceType}
                  {source.checkedDate && ` · ตรวจสอบ ${formatDateTH(source.checkedDate)}`}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
