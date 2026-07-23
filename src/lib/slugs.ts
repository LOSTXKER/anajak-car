// คีย์ URL สำหรับหน้าย่อยตามลำดับชั้น (Generation/Derivative/Trim)
// pure — ใช้ร่วมทั้ง link builder, breadcrumb และ query resolver (คีย์ต้องตรงกันทั้งสองฝั่ง)

// slug อ่านง่าย: เก็บ a-z0-9 ที่เหลือเป็นขีด · รองรับชื่ออังกฤษ/รหัส (ไทยจะเหลือขีด → มี fallback index)
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

// เจเนอเรชัน: ใช้ launchYear (สะอาด มีทุกเจน) · code เป็น free-text รก ใช้เป็น fallback
export function generationKey(gen: { launchYear: number | null; code: string | null }, index = 0): string {
  if (gen.launchYear != null) return String(gen.launchYear);
  if (gen.code) {
    const first = gen.code.split(/[\s(/·]/)[0];
    const s = slugify(first);
    if (s) return s;
  }
  return `g${index + 1}`;
}

// ตัวถัง/อนุพันธ์: ชื่อ (เช่น "Travo Smart Cab") ถ้าไม่มีใช้ bodyType
export function derivativeKey(deriv: { name: string | null; bodyType: string }, index = 0): string {
  const base = deriv.name ? slugify(deriv.name) : deriv.bodyType.toLowerCase();
  return base || `d${index + 1}`;
}

// เกรด/รุ่นย่อย: standardName ก่อน (คำกลาง) แล้ว name
export function trimKey(trim: { standardName: string | null; name: string }, index = 0): string {
  const base = slugify(trim.standardName ?? trim.name);
  return base || `t${index + 1}`;
}

// รุ่นย่อยขายจริง (SKU): ชื่อ variant ก่อน (เช่น "Travo Smart Cab 2.4 Entry") ไม่มีก็ใช้ชื่อ trim
// dedupe ระดับทั้ง nameplate (ไม่ใช่ต่อ trim) — คีย์ต้องไม่ชนกันใน /cars/[slug]/*
export function variantKey(v: { name: string | null }, trim: { name: string }, index = 0): string {
  const base = slugify(v.name ?? trim.name);
  return base || `v${index + 1}`;
}

// กันคีย์ชนกันในพาเรนต์เดียว — เติมเลขต่อท้ายตัวที่ซ้ำ (t, t-2, t-3)
export function dedupeKeys<T>(items: T[], keyOf: (item: T, index: number) => string): Map<T, string> {
  const seen = new Map<string, number>();
  const out = new Map<T, string>();
  items.forEach((item, i) => {
    let key = keyOf(item, i);
    const n = seen.get(key) ?? 0;
    seen.set(key, n + 1);
    if (n > 0) key = `${key}-${n + 1}`;
    out.set(item, key);
  });
  return out;
}
