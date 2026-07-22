import Link from "next/link";
import type { NameplateTree } from "@/lib/queries";
import { BODY_TYPE_LABEL, DRIVETRAIN_LABEL } from "@/lib/labels";
import { formatPriceRange, formatTHB } from "@/lib/format";
import { ptDotClass } from "@/components/badges";

// ── ตารางรุ่นย่อย = "ประตู" เดียวของหน้ารุ่น: กวาดตาเทียบได้ + กดแต่ละแถวเข้าหน้า SKU ──
// server component (ลิงก์ล้วน ไม่มี state) · desktop = ตารางจัดคอลัมน์ · mobile = การ์ดต่อแถว
function specLine(v: { powerText: string | null; transmissionText: string | null; drivetrain: string | null }) {
  return (
    [v.powerText, v.transmissionText, v.drivetrain ? (DRIVETRAIN_LABEL[v.drivetrain] ?? v.drivetrain) : null]
      .filter(Boolean)
      .join(" · ") || "—"
  );
}

export function SkuTable({ tree }: { tree: NameplateTree }) {
  const gen = tree.generations[0] ?? null;
  if (!gen) return null;
  const multiBody = gen.derivatives.length > 1;

  return (
    <section aria-labelledby="sku-heading" className="mt-8">
      <div className="flex items-baseline justify-between gap-3 px-1">
        <h2 id="sku-heading" className="text-lg font-semibold tracking-tight">รุ่นย่อยทั้งหมด</h2>
        <span className="text-[13px] text-faint">
          <span className="tnum">{gen.variantCount}</span> รุ่น · แตะเพื่อดูสเปกและราคา
        </span>
      </div>

      <div className="mt-4 space-y-6">
        {gen.derivatives.map((d) => (
          <div key={d.key}>
            {multiBody && (
              <div className="mb-2 flex items-baseline justify-between gap-3 px-1">
                <h3 className="text-sm font-semibold text-muted">{d.name || (BODY_TYPE_LABEL[d.bodyType] ?? d.bodyType)}</h3>
                <span className="text-xs text-faint tnum">{formatPriceRange(d.priceMin, d.priceMax)}</span>
              </div>
            )}
            <div className="overflow-hidden rounded-2xl border border-border">
              {/* หัวคอลัมน์ — เดสก์ท็อปเท่านั้น */}
              <div className="hidden grid-cols-[1fr_8rem_11rem_9rem] items-center gap-4 border-b border-border bg-surface-muted/50 px-4 py-2.5 text-[12px] font-medium text-faint sm:grid">
                <span>รุ่นย่อย</span>
                <span>ขุมพลัง</span>
                <span>กำลัง · เกียร์ · ขับ</span>
                <span className="text-right">ราคาป้าย</span>
              </div>
              {d.trims.flatMap((t) => t.variants).map((v) => (
                <Link
                  key={v.id}
                  href={`/cars/${tree.slug}/${v.skuKey}`}
                  className="group grid grid-cols-1 gap-1 border-b border-border px-4 py-3 transition-colors last:border-b-0 hover:bg-surface-muted/60 sm:grid-cols-[1fr_8rem_11rem_9rem] sm:items-center sm:gap-4 sm:py-2.5"
                >
                  <div className="flex items-center justify-between gap-2 sm:block">
                    <span className="font-medium group-hover:text-accent">{v.name}</span>
                    <span aria-hidden className="text-faint transition-colors group-hover:text-accent sm:hidden">›</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[13px] text-muted">
                    <span aria-hidden className={`inline-block size-2 shrink-0 rounded-full ${ptDotClass(v.powertrainText)}`} />
                    {v.powertrainText}
                  </div>
                  <div className="text-[13px] text-muted">{specLine(v)}</div>
                  <div className="flex items-center justify-between gap-2 sm:justify-end">
                    <span className="text-[11px] text-faint sm:hidden">ราคาป้าย</span>
                    <span className="flex items-center gap-2">
                      {v.price != null ? (
                        <span className="font-semibold tnum">{formatTHB(v.price)}</span>
                      ) : (
                        <span className="text-sm text-faint">ไม่มีข้อมูล</span>
                      )}
                      <span aria-hidden className="hidden text-faint transition-colors group-hover:text-accent sm:inline">›</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 px-1 text-[13px] text-faint">ราคาป้ายทางการ ไม่ใช่ราคาซื้อขายจริง</p>
    </section>
  );
}
