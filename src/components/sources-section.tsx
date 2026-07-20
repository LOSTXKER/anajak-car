import type { SourceRow } from "@/lib/queries";
import { SOURCE_TYPE_LABEL } from "@/lib/labels";
import { formatDateTH } from "@/lib/format";
import { ConfidenceBadge } from "@/components/badges";

export function SourcesSection({
  sources,
  subtitle = "หลักฐานทั้งหมดที่ใช้ยืนยันราคาและข้อมูลในหน้านี้",
}: {
  sources: SourceRow[];
  subtitle?: string;
}) {
  return (
    <section aria-labelledby="sources-heading" className="pb-20">
      <h2 id="sources-heading" className="text-xl font-semibold tracking-tight">
        แหล่งอ้างอิง
      </h2>
      <p className="mt-1.5 text-sm text-faint">{subtitle}</p>
      {sources.length === 0 ? (
        <p className="mt-4 text-sm text-muted">ยังไม่มีแหล่งอ้างอิง</p>
      ) : (
        <ul className="mt-2 max-w-3xl divide-y divide-border">
          {sources.map((source) => (
            <li key={source.id} className="flex flex-col gap-1 py-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {source.publisher ?? "ไม่ระบุผู้เผยแพร่"}
                </span>
                <ConfidenceBadge level={source.confidence} />
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
              <p className="text-xs text-faint">
                {SOURCE_TYPE_LABEL[source.sourceType] ?? source.sourceType}
                {source.checkedDate && ` · ตรวจสอบ ${formatDateTH(source.checkedDate)}`}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
