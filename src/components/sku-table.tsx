import Link from "next/link";
import type { NameplateTree } from "@/lib/queries";
import { BODY_TYPE_LABEL, DRIVETRAIN_LABEL } from "@/lib/labels";
import { formatDateTH, formatPriceRange, formatTHB } from "@/lib/format";
import { ptDotClass } from "@/components/badges";
import { SectionHeader } from "@/components/panel";

// ── ตารางรุ่นย่อย (ทิศ B "ตารางสถิติ" — เบสเลือก 2026-07-23): การ์ดต่อตัวถัง หัวกลุ่มสี accent ·
// คอลัมน์ Δ ถูกสุด · zebra · แถวกดเข้าหน้า SKU ── server component ล้วน
function specText(v: { powerText: string | null; transmissionText: string | null; drivetrain: string | null }) {
  return (
    [v.powerText, v.transmissionText, v.drivetrain ? (DRIVETRAIN_LABEL[v.drivetrain] ?? v.drivetrain) : null]
      .filter(Boolean)
      .join(" · ") || "—"
  );
}

export function SkuTable({ tree, latestChecked }: { tree: NameplateTree; latestChecked?: string | null }) {
  const gen = tree.generations[0] ?? null;
  if (!gen) return null;
  const all = gen.derivatives.flatMap((d) => d.trims.flatMap((t) => t.variants));
  const prices = all.map((v) => v.price).filter((p): p is number => p != null);
  const min = prices.length ? Math.min(...prices) : null;

  return (
    <section aria-label="รุ่นย่อยและราคา" className="mt-10">
      <SectionHeader
        id="sku-heading"
        title="รุ่นย่อยและราคา"
        sub={<><span className="tnum">{gen.variantCount}</span> รุ่น · แตะแถวเพื่อดูสเปกเต็ม</>}
      />

      <div className="mt-4 space-y-6">
        {gen.derivatives.map((d) => (
          <div key={d.key} className="overflow-hidden rounded-2xl border border-border">
            <div className="flex items-baseline justify-between gap-3 bg-accent-soft px-4 py-2.5">
              <h3 className="text-sm font-semibold text-accent">{d.name || (BODY_TYPE_LABEL[d.bodyType] ?? d.bodyType)}</h3>
              <span className="text-xs text-accent/80 tnum">{formatPriceRange(d.priceMin, d.priceMax)}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-[12px] text-faint">
                    <th className="py-2 pr-3 pl-4 font-medium">รุ่นย่อย</th>
                    <th className="px-3 py-2 font-medium">ขุมพลัง</th>
                    <th className="px-3 py-2 font-medium">กำลัง · เกียร์ · ขับ</th>
                    <th className="px-3 py-2 text-right font-medium">ราคาป้าย</th>
                    <th className="px-3 py-2 text-right font-medium">Δ ถูกสุด</th>
                    <th className="w-8 px-2 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {d.trims.flatMap((t) => t.variants).map((v, i) => (
                    <tr key={v.id} className={`group relative ${i % 2 === 1 ? "bg-surface-muted/35" : ""} transition-colors hover:bg-accent-soft`}>
                      <td className="py-2.5 pr-3 pl-4 font-medium">
                        <Link href={`/cars/${tree.slug}/${v.skuKey}`} className="after:absolute after:inset-0 group-hover:text-accent">{v.name}</Link>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="inline-flex items-center gap-1.5 text-muted">
                          <span aria-hidden className={`inline-block size-2 rounded-full ${ptDotClass(v.powertrainText)}`} />
                          {v.powertrainText}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-muted">{specText(v)}</td>
                      <td className="px-3 py-2.5 text-right font-semibold tnum">{v.price != null ? formatTHB(v.price) : <span className="font-normal text-faint">ไม่มีข้อมูล</span>}</td>
                      <td className="px-3 py-2.5 text-right text-[13px] tnum">
                        {v.price != null && min != null ? (
                          v.price === min ? <span className="text-success">ถูกสุด</span> : <span className="text-muted">+{formatTHB(v.price - min)}</span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-2 py-2.5 text-faint group-hover:text-accent" aria-hidden>›</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[13px] text-faint">
        ราคาป้ายทางการ ไม่ใช่ราคาซื้อขายจริง · Δ = ส่วนต่างจากรุ่นย่อยถูกสุดของรุ่นนี้
        {latestChecked ? <> · ตรวจสอบล่าสุด <span className="tnum">{formatDateTH(latestChecked)}</span></> : null}
      </p>
    </section>
  );
}
