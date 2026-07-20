import { CONFIDENCE_LABEL, LIFECYCLE_LABEL, SOURCE_TYPE_LABEL } from "@/lib/labels";
import { formatDateTH } from "@/lib/format";
import type { ConfidenceLevel, EvidenceRef } from "@/lib/queries";

export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-surface-muted px-2 py-0.5 text-xs whitespace-nowrap text-muted">
      {children}
    </span>
  );
}

const CONFIDENCE_STYLE: Record<ConfidenceLevel, string> = {
  HIGH: "bg-success-soft text-success",
  MEDIUM: "bg-warning-soft text-warning",
  LOW: "bg-danger-soft text-danger",
};

export function ConfidenceBadge({ level }: { level: ConfidenceLevel }) {
  return (
    <span
      title={CONFIDENCE_LABEL[level]}
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${CONFIDENCE_STYLE[level]}`}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      <span aria-hidden>{level}</span>
      <span className="sr-only">{CONFIDENCE_LABEL[level]}</span>
    </span>
  );
}

const LIFECYCLE_STYLE: Record<string, string> = {
  UPCOMING: "bg-accent-soft text-accent",
  CURRENT: "bg-success-soft text-success",
  TRANSITION: "bg-warning-soft text-warning",
  DISCONTINUED: "bg-surface-muted text-faint",
};

export function LifecycleBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${LIFECYCLE_STYLE[status] ?? "bg-surface-muted text-muted"}`}
    >
      {LIFECYCLE_LABEL[status] ?? status}
    </span>
  );
}

const LIFECYCLE_DOT_STYLE: Record<string, string> = {
  UPCOMING: "bg-accent",
  CURRENT: "bg-success",
  TRANSITION: "bg-warning",
  DISCONTINUED: "bg-faint",
};

/** จุดสถานะแบบย่อ — ใช้ในตารางที่พื้นที่จำกัด (title + sr-only ยังบอกความหมายเต็มให้ทุกคนเข้าถึงได้) */
export function LifecycleDot({ status }: { status: string }) {
  return (
    <span title={LIFECYCLE_LABEL[status] ?? status} className="inline-flex items-center">
      <span
        aria-hidden
        className={`size-1.5 shrink-0 rounded-full ${LIFECYCLE_DOT_STYLE[status] ?? "bg-faint"}`}
      />
      <span className="sr-only">{LIFECYCLE_LABEL[status] ?? status}</span>
    </span>
  );
}

export function FreshnessTag({ date, prefix = "ข้อมูล ณ" }: { date: string | null; prefix?: string }) {
  const text = formatDateTH(date);
  if (!text) return <span className="text-xs text-faint">ยังไม่มีวันที่ตรวจสอบ</span>;
  return (
    <span className="text-xs whitespace-nowrap text-faint">
      {prefix} {text}
    </span>
  );
}

/** แสดงค่า หรือ "ไม่มีข้อมูล" — ห้ามใช้ 0/ค่าว่างแทนข้อมูลที่ไม่มี (DataStatus) */
export function DataStatusValue({
  value,
  children,
}: {
  value: string | number | null | undefined;
  children?: React.ReactNode;
}) {
  if (value == null || value === "") {
    return <span className="text-faint">ไม่มีข้อมูล</span>;
  }
  return <>{children ?? value}</>;
}

export function EvidenceLink({ evidence }: { evidence: EvidenceRef }) {
  const label =
    evidence.publisher ?? SOURCE_TYPE_LABEL[evidence.sourceType] ?? "แหล่งอ้างอิง";
  if (!evidence.url) {
    return <span className="text-xs text-faint">{label}</span>;
  }
  return (
    <a
      href={evidence.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-0.5 text-xs whitespace-nowrap text-accent hover:underline"
    >
      {label}
      <span aria-hidden>↗</span>
      <span className="sr-only">(เปิดแหล่งอ้างอิงในแท็บใหม่)</span>
    </a>
  );
}
