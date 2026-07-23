// ── ภาษา UI "คู่มือ" แบบ prydwen ฉบับ CARMETA light (M25g · เบสเลือก 2026-07-23) ──
// 3 ชิ้น: SectionHeader (■+เส้นสีเต็มแถว) · StatBar (แถบหัวสีเต็ม+ค่าใหญ่) · TagCard (ป้ายสีซ้าย)
// ใช้คู่กับ primitives เดิมใน badges.tsx — อย่าสร้าง heading/stat รูปแบบอื่นเพิ่มรายหน้า

/** หัวข้อ section signature: ■ accent + ชื่อหนา + เส้น accent ยาวเต็มแถว */
export function SectionHeader({
  id,
  title,
  sub,
}: {
  id?: string;
  title: string;
  sub?: React.ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-20">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="flex items-center gap-2.5 text-lg font-bold tracking-tight">
          <span aria-hidden className="size-3 shrink-0 rounded-[3px] bg-accent" />
          {title}
        </h2>
        {sub && <span className="text-[13px] text-faint">{sub}</span>}
      </div>
      <div aria-hidden className="mt-2 h-0.5 w-full rounded-full bg-accent" />
    </div>
  );
}

/** บล็อกข้อมูลสำคัญ: แถบหัวพื้น accent ตัวขาวกึ่งกลาง + ค่าใหญ่ข้างใต้ (แบบ update-tracker ของ prydwen) */
export function StatBar({
  label,
  value,
  sub,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="bg-accent px-3 py-1.5 text-center text-[12px] font-semibold tracking-wide text-white">
        {label}
      </div>
      <div className="bg-background px-3 py-2.5 text-center">
        <div className="text-lg font-semibold tnum">{value}</div>
        {sub && <div className="mt-0.5 text-[11px] text-faint">{sub}</div>}
      </div>
    </div>
  );
}

/** การ์ดป้ายสีซ้าย (แบบ skill card): tag = ข้อความในแท่งซ้าย · โทนสีตาม tone */
export function TagCard({
  tag,
  tone = "accent",
  title,
  children,
}: {
  tag: string;
  tone?: "accent" | "success" | "muted" | "faint";
  title: React.ReactNode;
  children?: React.ReactNode;
}) {
  const toneClass = {
    accent: "bg-accent text-white",
    success: "bg-success text-white",
    muted: "bg-surface-muted text-muted",
    faint: "bg-surface-muted text-faint italic",
  }[tone];
  return (
    <div className="flex overflow-hidden rounded-xl border border-border">
      <div className={`flex w-20 shrink-0 items-center justify-center px-2 py-3 text-center text-[12px] font-semibold ${toneClass}`}>
        {tag}
      </div>
      <div className="min-w-0 flex-1 px-3.5 py-3">
        <div className="text-sm font-medium">{title}</div>
        {children && <div className="mt-0.5 text-[13px] text-faint">{children}</div>}
      </div>
    </div>
  );
}
