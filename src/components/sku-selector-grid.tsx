import Link from "next/link";
import type { NameplateTree } from "@/lib/queries";
import { BODY_TYPE_LABEL, DRIVETRAIN_LABEL } from "@/lib/labels";
import { formatPriceRange, formatTHB } from "@/lib/format";
import { ptDotClass } from "@/components/badges";

// ── ตารางเลือกรุ่นย่อย (SKU) — จุดเข้าแรกของหน้ารุ่น · กดการ์ด → /cars/[slug]/[sku] ──
// server component ล้วน (ลิงก์อย่างเดียว ไม่มี state)
export function SkuSelectorGrid({ tree }: { tree: NameplateTree }) {
  const gen = tree.generations[0] ?? null;
  if (!gen) return null;

  return (
    <section aria-labelledby="sku-heading" className="mt-8">
      <h2 id="sku-heading" className="text-lg font-semibold tracking-tight">
        เลือกรุ่นย่อย <span className="tnum text-sm font-normal text-faint">({gen.variantCount} รุ่น)</span>
      </h2>
      <div className="mt-4 space-y-7">
        {gen.derivatives.map((d) => (
          <div key={d.key}>
            {(gen.derivatives.length > 1 || d.name) && (
              <div className="mb-2.5 flex items-baseline justify-between gap-3">
                <h3 className="text-[15px] font-semibold">{d.name || (BODY_TYPE_LABEL[d.bodyType] ?? d.bodyType)}</h3>
                <span className="text-sm text-faint tnum">{formatPriceRange(d.priceMin, d.priceMax)}</span>
              </div>
            )}
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {d.trims.flatMap((t) => t.variants).map((v) => (
                <Link
                  key={v.id}
                  href={`/cars/${tree.slug}/${v.skuKey}`}
                  className="group rounded-2xl border border-border p-4 transition-colors hover:border-accent"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium leading-snug group-hover:text-accent">{v.name}</span>
                    <span aria-hidden className="text-faint transition-colors group-hover:text-accent">›</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-[13px] text-muted">
                    <span aria-hidden className={`inline-block size-2 rounded-full ${ptDotClass(v.powertrainText)}`} />
                    {v.powertrainText}
                  </div>
                  <div className="mt-1 text-[13px] text-muted">
                    {[v.powerText, v.transmissionText, v.drivetrain ? (DRIVETRAIN_LABEL[v.drivetrain] ?? v.drivetrain) : null]
                      .filter(Boolean)
                      .join(" · ") || "—"}
                  </div>
                  <div className="mt-3 text-[15px]">
                    {v.price != null ? (
                      <span className="font-semibold tnum">{formatTHB(v.price)}</span>
                    ) : (
                      <span className="text-sm text-faint">ไม่มีข้อมูลราคา</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[13px] text-faint">ราคาป้ายทางการ ไม่ใช่ราคาซื้อขายจริง · กดรุ่นย่อยเพื่อดูสเปกเต็ม ประวัติราคา และหลักฐาน</p>
    </section>
  );
}
