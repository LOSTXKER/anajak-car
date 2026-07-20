// Formatter กลาง — ราคา THB + วันที่ไทย (ค.ศ. ให้ตรงกับ model year ของวงการรถ)

const thbFormat = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
  maximumFractionDigits: 0,
});

const dateFormat = new Intl.DateTimeFormat("th-TH-u-ca-gregory", {
  day: "numeric",
  month: "short",
  year: "numeric",
  // ค่าวันที่ในระบบเก็บเป็น date-only (00:00 UTC) — fix เป็น UTC กันวันเพี้ยนตาม timezone ของเครื่องที่รัน
  timeZone: "UTC",
});

export function formatTHB(amount: number): string {
  return thbFormat.format(amount);
}

export function formatPriceRange(min: number | null, max: number | null): string | null {
  if (min == null || max == null) return null;
  if (min === max) return formatTHB(min);
  return `${formatTHB(min)} – ${formatTHB(max)}`;
}

export function formatDateTH(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return dateFormat.format(d);
}
