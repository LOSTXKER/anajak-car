import { formatTHB } from "@/lib/format";

// ── MOCKUP (M24) primitives — ทดลองหน้าตา · ตัวที่ชนะจะย้ายเข้า badges.tsx ตอน Phase B ──
// token เท่านั้น (ไม่ hardcode hex)

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

export function SpecRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border py-2.5 last:border-b-0">
      <dt className="shrink-0 text-sm text-faint">{label}</dt>
      <dd className="text-right text-sm font-medium text-foreground">{children}</dd>
    </div>
  );
}

// แถบตำแหน่งราคาในช่วง min–max (data-viz จากราคาจริง ไม่ใช่ ranking) — มาร์กตำแหน่งของราคาหนึ่งค่า
export function PricePositionBar({
  min,
  max,
  value,
}: {
  min: number;
  max: number;
  value: number;
}) {
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

// ช่องข้อมูลที่ยังไม่มี — ซื่อสัตย์ ไม่ปลอมเลข (คู่กับกฎ DataStatus)
export function PendingBlock({
  title,
  reason,
}: {
  title: string;
  reason?: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-surface-muted/40 px-4 py-5 text-center">
      <div className="text-sm font-medium text-muted">{title}</div>
      <div className="mt-1 text-xs text-faint">{reason ?? "รอข้อมูลที่ตรวจสอบได้"}</div>
    </div>
  );
}

// ราคาย่อสำหรับป้าย/หัวข้อ (ตัวเลขเต็มอยู่ในตาราง) — แสน/ล้าน
export function priceShort(n: number | null): string | null {
  if (n == null) return null;
  const trim = (s: string) => s.replace(/\.?0+$/, "");
  if (n >= 1_000_000) return `${trim((n / 1_000_000).toFixed(2))} ล้าน`;
  if (n >= 100_000) return `${trim((n / 100_000).toFixed(2))} แสน`;
  return n.toLocaleString("th-TH");
}
