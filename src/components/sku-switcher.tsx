import Link from "next/link";
import type { NameplateTree } from "@/lib/queries";
import { BODY_TYPE_LABEL } from "@/lib/labels";

// ── แถบสลับรุ่นย่อยพี่น้อง (pill ลิงก์ล้วน — server component) · ใช้บนหัวหน้า SKU ──
export function SkuSwitcher({ tree, currentSkuKey }: { tree: NameplateTree; currentSkuKey: string }) {
  const gen = tree.generations[0] ?? null;
  if (!gen) return null;
  const multiBody = gen.derivatives.length > 1;

  return (
    <nav aria-label="สลับรุ่นย่อย" className="flex flex-wrap items-center gap-x-3 gap-y-2">
      {gen.derivatives.map((d) => (
        <div key={d.key} className="flex flex-wrap items-center gap-1.5">
          {multiBody && (
            <span className="text-xs text-faint">{d.name || (BODY_TYPE_LABEL[d.bodyType] ?? d.bodyType)}:</span>
          )}
          {d.trims.flatMap((t) => t.variants).map((v) => {
            const active = v.skuKey === currentSkuKey;
            return (
              <Link
                key={v.id}
                href={`/cars/${tree.slug}/${v.skuKey}`}
                aria-current={active ? "page" : undefined}
                className={`rounded-full border px-3 py-1 text-[13px] whitespace-nowrap transition-colors ${
                  active
                    ? "border-accent font-medium text-accent"
                    : "border-border text-muted hover:border-accent hover:text-foreground"
                }`}
              >
                {v.name}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
