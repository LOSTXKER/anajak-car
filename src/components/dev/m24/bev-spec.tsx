import { SpecRow } from "@/components/dev/m24/primitives";

// ── MOCKUP (M24) — บล็อกสเปก BEV ของ bZ4X (ตัวเลขจริงจาก seed/หลักฐานทางการ) ──
// Phase B จะดึงจาก getNameplateTree (motor/battery/range/charging) แทน hardcode
export const BZ4X_BEV = {
  motor: "165 kW (FWD) · 252 kW (AWD)",
  battery: "73.11 kWh",
  range: "600 กม. (NEDC, FWD) · 411 กม. (AWD)",
  charging: "AC 22 kW (Type 2) · DC 150 kW (CCS2)",
  drivetrain: "ขับหน้า / ขับสี่ (AWD)",
  seats: "5 ที่นั่ง",
  source: "toyota.co.th + Headlightmag/Autolife",
};

export function BevSpecBlock({ variant = "calm" }: { variant?: "calm" | "dense" }) {
  const rows: [string, string][] = [
    ["กำลังมอเตอร์", BZ4X_BEV.motor],
    ["ความจุแบตเตอรี่", BZ4X_BEV.battery],
    ["ระยะทางต่อชาร์จ", BZ4X_BEV.range],
    ["การชาร์จ", BZ4X_BEV.charging],
    ["ระบบขับเคลื่อน", BZ4X_BEV.drivetrain],
    ["ที่นั่ง", BZ4X_BEV.seats],
  ];
  if (variant === "dense") {
    return (
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {rows.map(([k, v]) => (
          <div key={k} className="rounded-xl border border-border bg-surface-muted px-3 py-2.5">
            <div className="text-[11px] text-faint">{k}</div>
            <div className="mt-0.5 text-sm font-semibold text-foreground">{v}</div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <dl className="max-w-2xl">
      {rows.map(([k, v]) => (
        <SpecRow key={k} label={k}>
          <span className="tnum">{v}</span>
        </SpecRow>
      ))}
    </dl>
  );
}
