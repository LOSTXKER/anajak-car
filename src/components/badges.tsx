import { CONFIDENCE_LABEL, CONFIDENCE_SHORT, LIFECYCLE_LABEL, SOURCE_TYPE_LABEL } from "@/lib/labels";
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
      <span aria-hidden>{CONFIDENCE_SHORT[level] ?? level}</span>
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

// สถานะปกติ (ขายอยู่ = CURRENT) เงียบ — ป้ายโชว์เฉพาะข้อยกเว้น (เตรียมเปิดตัว/ช่วงเปลี่ยนรุ่น/เลิกจำหน่าย)
// silence = normal · ตัดจุดเดียวครอบทุกที่ที่เรียก (ModelCard + header หน้ารถ)
export function LifecycleBadge({ status }: { status: string }) {
  if (status === "CURRENT") return null;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${LIFECYCLE_STYLE[status] ?? "bg-surface-muted text-muted"}`}
    >
      {LIFECYCLE_LABEL[status] ?? status}
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
