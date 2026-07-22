import { CONFIDENCE_LABEL, LIFECYCLE_LABEL, SOURCE_TYPE_LABEL } from "@/lib/labels";
import { formatDateTH, formatTHB } from "@/lib/format";
import type { ConfidenceLevel, EvidenceRef } from "@/lib/queries";

export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-surface-muted px-2 py-0.5 text-xs whitespace-nowrap text-muted">
      {children}
    </span>
  );
}

// สีตามหมวดขุมพลัง — สื่อ "หมวด" ไม่ใช่คะแนนรถ · ต้องมีข้อความคู่เสมอ (a11y) · token --pt-* ใน globals.css
export function ptDotClass(label: string): string {
  if (label.includes("EV") || label.includes("ไฟฟ้า") || label.includes("ไฮโดรเจน")) return "bg-pt-ev";
  if (label.includes("ไฮบริด")) return "bg-pt-hybrid";
  if (label.includes("ดีเซล")) return "bg-pt-diesel";
  if (label.includes("เบนซิน") || label.includes("สันดาป")) return "bg-pt-petrol";
  return "bg-faint";
}

/** ขุมพลัง = จุดสีตามหมวด + ข้อความ (สแกนไว) — ใช้ร่วมตาราง/หน้ารุ่น */
export function PowertrainDots({ labels }: { labels: string[] }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-x-1 gap-y-1">
      {labels.map((l, i) => (
        <span key={l} className="inline-flex items-center whitespace-nowrap">
          {i > 0 && <span className="mx-1 text-faint">·</span>}
          <span aria-hidden className={`mr-1.5 inline-block size-2 rounded-full ${ptDotClass(l)}`} />
          {l}
        </span>
      ))}
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

/** ช่องสถิติ — label + ค่าเด่น (ตัวเลขใช้ .tnum) · ใช้ในหัวหน้ารุ่น/แบรนด์ */
export function StatTile({
  label,
  value,
  sub,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface-muted px-4 py-3">
      <div className="text-xs text-faint">{label}</div>
      <div className="mt-1 text-lg font-semibold text-foreground">{value}</div>
      {sub && <div className="mt-0.5 text-[11px] text-faint">{sub}</div>}
    </div>
  );
}

/** แถวสเปก dt/dd — ใช้ในบล็อกสเปก (ขุมพลัง/มิติ) */
export function SpecRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border py-2.5 last:border-b-0">
      <dt className="shrink-0 text-sm text-faint">{label}</dt>
      <dd className="text-right text-sm font-medium text-foreground">{children}</dd>
    </div>
  );
}

/** แถบตำแหน่งราคาในช่วง min–max (data-viz จากราคาจริง ไม่ใช่ ranking) */
export function PricePositionBar({ min, max, value }: { min: number; max: number; value: number }) {
  const pct = max > min ? ((value - min) / (max - min)) * 100 : 0;
  return (
    <div className="w-full">
      <div className="relative h-1.5 w-full rounded-full bg-surface-muted">
        <div
          className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent ring-2 ring-background"
          style={{ left: `${pct}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-faint tnum">
        <span>{formatTHB(min)}</span>
        <span>{formatTHB(max)}</span>
      </div>
    </div>
  );
}

/** ช่องข้อมูลที่ยังไม่มี — ซื่อสัตย์ ไม่ปลอมเลข (คู่กับกฎ DataStatus / no false precision) */
export function PendingBlock({ title, reason }: { title: string; reason?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-surface-muted/40 px-4 py-5 text-center">
      <div className="text-sm font-medium text-muted">{title}</div>
      <div className="mt-1 text-xs text-faint">{reason ?? "รอข้อมูลที่ตรวจสอบได้"}</div>
    </div>
  );
}
