import Link from "next/link";
import type { NameplateTree } from "@/lib/queries";

// ── นำทางรุ่นย่อยพี่น้อง: ‹ ก่อนหน้า · x/N · ถัดไป › + กลับตารางรวม (แทน pill wall เดิมที่รก) ──
// ลำดับ = ลำดับเดียวกับตารางหน้ารุ่น (ไล่ตามตัวถัง → trim → variant)
export function SkuSwitcher({ tree, currentSkuKey }: { tree: NameplateTree; currentSkuKey: string }) {
  const gen = tree.generations[0] ?? null;
  if (!gen) return null;
  const all = gen.derivatives.flatMap((d) => d.trims.flatMap((t) => t.variants));
  const idx = all.findIndex((v) => v.skuKey === currentSkuKey);
  if (idx < 0) return null;
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx < all.length - 1 ? all[idx + 1] : null;

  const navClass = "inline-flex max-w-[16rem] items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-[13px] text-muted transition-colors hover:border-accent hover:text-accent";

  return (
    <nav aria-label="สลับรุ่นย่อย" className="flex flex-wrap items-center gap-2.5">
      {prev ? (
        <Link href={`/cars/${tree.slug}/${prev.skuKey}`} className={navClass}>
          <span aria-hidden>‹</span>
          <span className="truncate">{prev.name}</span>
        </Link>
      ) : (
        <span className={`${navClass} pointer-events-none opacity-40`} aria-hidden>‹ —</span>
      )}
      <span className="text-[13px] text-faint tnum">{idx + 1} / {all.length}</span>
      {next ? (
        <Link href={`/cars/${tree.slug}/${next.skuKey}`} className={navClass}>
          <span className="truncate">{next.name}</span>
          <span aria-hidden>›</span>
        </Link>
      ) : (
        <span className={`${navClass} pointer-events-none opacity-40`} aria-hidden>— ›</span>
      )}
      <Link href={`/cars/${tree.slug}#sku-heading`} className="ml-1 text-[13px] text-accent hover:underline">
        ดูรุ่นย่อยทั้งหมด ({all.length})
      </Link>
    </nav>
  );
}
