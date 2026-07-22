import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNameplateDetail, getNameplateTree } from "@/lib/queries";
import type { NameplateDetail, NameplateTree, TreeDerivative, TreeVariant } from "@/lib/queries";
import { BODY_TYPE_LABEL, DRIVETRAIN_LABEL, SEGMENT_LABEL } from "@/lib/labels";
import { formatDateTH, formatPriceRange, formatTHB } from "@/lib/format";
import { nameplateImage } from "@/lib/images";
import { LifecycleBadge, PowertrainDots, ptDotClass } from "@/components/badges";

// ── หน้าเทียบทิศ UX (ชั่วคราว — ให้เบสเลือก แล้วค่อย implement ลง /cars จริง) ──
// /ux/a/[slug] = A บันไดราคา · /ux/b/[slug] = B ตารางสถิติ · /ux/c/[slug] = C โชว์รูม
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ v: string; slug: string }> };

const VARIANTS: Record<string, string> = {
  a: "A · บันไดราคา",
  b: "B · ตารางสถิติ",
  c: "C · โชว์รูม",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { v, slug } = await params;
  return { title: `ทิศ ${v.toUpperCase()} — ${slug} | เทียบ UX`, robots: { index: false } };
}

function flatVariants(gen: TreeDerivative[]): TreeVariant[] {
  return gen.flatMap((d) => d.trims.flatMap((t) => t.variants));
}

function specText(v: TreeVariant): string {
  return [v.powerText, v.transmissionText, v.drivetrain ? (DRIVETRAIN_LABEL[v.drivetrain] ?? v.drivetrain) : null]
    .filter(Boolean)
    .join(" · ");
}

function bodyLabel(d: TreeDerivative): string {
  return d.name || (BODY_TYPE_LABEL[d.bodyType] ?? d.bodyType);
}

// ── สวิตช์สลับทิศ (ลอยล่าง) ──
function Switcher({ v, slug }: { v: string; slug: string }) {
  const other = slug === "hilux-travo" ? "model-3" : "hilux-travo";
  return (
    <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-1 rounded-full border border-border bg-background/95 px-2 py-1.5 shadow-lg backdrop-blur">
        {Object.entries(VARIANTS).map(([key, label]) => (
          <Link
            key={key}
            href={`/ux/${key}/${slug}`}
            className={`rounded-full px-3 py-1.5 text-[13px] whitespace-nowrap transition-colors ${
              key === v ? "bg-accent font-medium text-white" : "text-muted hover:bg-surface-muted"
            }`}
          >
            {label}
          </Link>
        ))}
        <span className="mx-1 h-4 w-px bg-border" />
        <Link href={`/ux/${v}/${other}`} className="rounded-full px-3 py-1.5 text-[13px] whitespace-nowrap text-muted hover:bg-surface-muted">
          ดู {other === "model-3" ? "Model 3" : "Hilux"} →
        </Link>
      </div>
    </div>
  );
}

// ═══════════════ ทิศ A — บันไดราคา ═══════════════
// พระเอก = แถบราคาแนวนอนต่อรุ่นย่อย เห็น "บันได" ทั้งรุ่นในครั้งเดียว · แถวกดได้
function DirA({ detail, tree }: { detail: NameplateDetail; tree: NameplateTree }) {
  const gen = tree.generations[0]!;
  const all = flatVariants(gen.derivatives);
  const prices = all.map((v) => v.price).filter((p): p is number => p != null);
  const min = prices.length ? Math.min(...prices) : 0;
  const max = prices.length ? Math.max(...prices) : 1;
  const img = nameplateImage(detail.slug);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-28 sm:px-6">
      {/* hero — แถบเดียว กระชับ ราคาเป็นพระเอกรอง */}
      <header className="flex flex-wrap items-center justify-between gap-6 border-b border-border py-8">
        <div className="min-w-0">
          <p className="text-[13px] font-medium tracking-widest text-faint uppercase">{detail.brand}</p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h1 className="text-4xl font-semibold tracking-tight">{detail.name}</h1>
            <LifecycleBadge status={detail.lifecycleStatus} />
          </div>
          <p className="mt-2 text-sm text-muted">
            {[detail.segment ? (SEGMENT_LABEL[detail.segment] ?? detail.segment) : null, detail.generationCode, detail.launchYear ? `เปิดตัว ${detail.launchYear}` : null].filter(Boolean).join(" · ")}
          </p>
          <p className="mt-4 text-2xl font-semibold tnum">
            {formatPriceRange(detail.priceMin, detail.priceMax) ?? "—"}
            <span className="ml-2 align-middle text-[13px] font-normal text-faint">ราคาป้าย {gen.variantCount} รุ่นย่อย</span>
          </p>
        </div>
        {img && (
          <Image src={img.src} alt={img.alt} width={340} height={191} priority className="h-auto w-[280px] object-contain sm:w-[340px]" />
        )}
      </header>

      {/* บันไดราคา */}
      <main className="mt-8 space-y-10">
        {gen.derivatives.map((d) => (
          <section key={d.key}>
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-base font-semibold">{bodyLabel(d)}</h2>
              <span className="text-[13px] text-faint tnum">{formatPriceRange(d.priceMin, d.priceMax)}</span>
            </div>
            <div className="mt-3">
              {d.trims.flatMap((t) => t.variants).map((v) => {
                const pct = v.price != null && max > min ? 8 + ((v.price - min) / (max - min)) * 92 : 8;
                return (
                  <Link
                    key={v.id}
                    href={`/cars/${tree.slug}/${v.skuKey}`}
                    className="group grid grid-cols-[minmax(11rem,16rem)_1fr_7.5rem] items-center gap-4 rounded-lg px-2 py-2 transition-colors hover:bg-accent-soft"
                  >
                    <div className="min-w-0">
                      <span className="block truncate text-[15px] font-medium group-hover:text-accent">{v.name}</span>
                      <span className="mt-0.5 flex items-center gap-1.5 text-[12px] text-faint">
                        <span aria-hidden className={`inline-block size-1.5 rounded-full ${ptDotClass(v.powertrainText)}`} />
                        {v.powertrainText}{specText(v) ? ` · ${specText(v)}` : ""}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-surface-muted">
                      {v.price != null && (
                        <div className="h-full rounded-full bg-accent/70 transition-colors group-hover:bg-accent" style={{ width: `${pct}%` }} />
                      )}
                    </div>
                    <span className="text-right font-semibold tnum">
                      {v.price != null ? formatTHB(v.price) : <span className="text-[13px] font-normal text-faint">ไม่มีข้อมูล</span>}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
        <p className="text-[13px] text-faint">ราคาป้ายทางการ ไม่ใช่ราคาซื้อขายจริง · แตะรุ่นย่อยเพื่อดูสเปกเต็ม{detail.latestChecked ? ` · ตรวจสอบล่าสุด ${formatDateTH(detail.latestChecked)}` : ""}</p>
      </main>
    </div>
  );
}

// ═══════════════ ทิศ B — ตารางสถิติ ═══════════════
// สาย op.gg/ตลาด: แถบสถิติสีบน + ตารางแน่น มี Δ จากรุ่นถูกสุด · zebra rows
function DirB({ detail, tree }: { detail: NameplateDetail; tree: NameplateTree }) {
  const gen = tree.generations[0]!;
  const all = flatVariants(gen.derivatives);
  const prices = all.map((v) => v.price).filter((p): p is number => p != null);
  const min = prices.length ? Math.min(...prices) : 0;
  const img = nameplateImage(detail.slug);
  const powertrains = [...new Set(all.map((v) => v.powertrainText))];

  const stat = (label: string, value: React.ReactNode, border: string, sub?: string) => (
    <div className={`rounded-xl border border-border border-t-2 bg-background px-4 py-3 ${border}`}>
      <div className="text-[11px] text-faint">{label}</div>
      <div className="mt-1 text-xl font-semibold tnum">{value}</div>
      {sub && <div className="mt-0.5 text-[11px] text-faint">{sub}</div>}
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-28 sm:px-6">
      <header className="flex flex-wrap items-center gap-x-8 gap-y-4 py-7">
        {img && <Image src={img.src} alt={img.alt} width={220} height={124} priority className="h-auto w-[200px] object-contain" />}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight">
              <span className="mr-2 font-normal text-muted">{detail.brand}</span>{detail.name}
            </h1>
            <LifecycleBadge status={detail.lifecycleStatus} />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted">
            <span>{[detail.segment ? (SEGMENT_LABEL[detail.segment] ?? detail.segment) : null, detail.generationCode, detail.launchYear ? `ปี ${detail.launchYear}` : null].filter(Boolean).join(" · ")}</span>
            <PowertrainDots labels={powertrains} />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {stat("เริ่มต้น", detail.priceMin != null ? formatTHB(detail.priceMin) : "—", "border-t-accent")}
        {stat("สูงสุด", detail.priceMax != null ? formatTHB(detail.priceMax) : "—", "border-t-accent")}
        {stat("รุ่นย่อย", gen.variantCount, "border-t-border", `${gen.derivatives.length} ตัวถัง`)}
        {stat("ตรวจสอบล่าสุด", detail.latestChecked ? formatDateTH(detail.latestChecked) : "—", "border-t-border")}
      </div>

      <main className="mt-8 space-y-8">
        {gen.derivatives.map((d) => (
          <section key={d.key} className="overflow-hidden rounded-2xl border border-border">
            <div className="flex items-baseline justify-between gap-3 bg-surface-muted/60 px-4 py-2.5">
              <h2 className="text-sm font-semibold">{bodyLabel(d)}</h2>
              <span className="text-xs text-faint tnum">{formatPriceRange(d.priceMin, d.priceMax)}</span>
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
                      <td className="px-3 py-2.5 text-muted">{specText(v) || "—"}</td>
                      <td className="px-3 py-2.5 text-right font-semibold tnum">{v.price != null ? formatTHB(v.price) : <span className="font-normal text-faint">ไม่มีข้อมูล</span>}</td>
                      <td className="px-3 py-2.5 text-right text-[13px] tnum">
                        {v.price != null ? (v.price === min ? <span className="text-success">ถูกสุด</span> : <span className="text-muted">+{formatTHB(v.price - min)}</span>) : "—"}
                      </td>
                      <td className="px-2 py-2.5 text-faint group-hover:text-accent" aria-hidden>›</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
        <p className="text-[13px] text-faint">ราคาป้ายทางการ ไม่ใช่ราคาซื้อขายจริง · Δ = ส่วนต่างจากรุ่นย่อยถูกสุดของรุ่นนี้</p>
      </main>
    </div>
  );
}

// ═══════════════ ทิศ C — โชว์รูม ═══════════════
// สายสะอาด: ภาพ+ราคาใหญ่กลางหน้า · ลิสต์แถวโปร่ง ตัวหนังสือใหญ่ เส้นบาง
function DirC({ detail, tree }: { detail: NameplateDetail; tree: NameplateTree }) {
  const gen = tree.generations[0]!;
  const img = nameplateImage(detail.slug);
  const powertrains = [...new Set(flatVariants(gen.derivatives).map((v) => v.powertrainText))];

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-28 sm:px-6">
      <header className="flex flex-col items-center pt-10 pb-4 text-center">
        <p className="text-[13px] font-medium tracking-widest text-faint uppercase">{detail.brand}</p>
        <h1 className="mt-1 text-5xl font-semibold tracking-tight">{detail.name}</h1>
        <p className="mt-3 text-lg text-muted tnum">{formatPriceRange(detail.priceMin, detail.priceMax) ?? "ยังไม่มีข้อมูลราคา"}</p>
        <div className="mt-2 flex items-center gap-3 text-xs text-faint">
          <LifecycleBadge status={detail.lifecycleStatus} />
          <PowertrainDots labels={powertrains} />
        </div>
        {img && (
          <Image src={img.src} alt={img.alt} width={560} height={315} priority className="mt-6 h-auto w-full max-w-[520px] object-contain" />
        )}
      </header>

      <main className="mt-6 space-y-12">
        {gen.derivatives.map((d) => (
          <section key={d.key}>
            <h2 className="text-center text-[13px] font-medium tracking-widest text-faint uppercase">{bodyLabel(d)}</h2>
            <div className="mt-4 divide-y divide-border border-y border-border">
              {d.trims.flatMap((t) => t.variants).map((v) => (
                <Link key={v.id} href={`/cars/${tree.slug}/${v.skuKey}`} className="group flex items-center justify-between gap-4 py-4">
                  <div className="min-w-0">
                    <span className="block text-lg font-medium group-hover:text-accent">{v.name}</span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-[13px] text-faint">
                      <span aria-hidden className={`inline-block size-1.5 rounded-full ${ptDotClass(v.powertrainText)}`} />
                      {v.powertrainText}{specText(v) ? ` · ${specText(v)}` : ""}
                    </span>
                  </div>
                  <span className="flex shrink-0 items-center gap-3">
                    <span className="text-lg font-semibold tnum">{v.price != null ? formatTHB(v.price) : <span className="text-sm font-normal text-faint">ไม่มีข้อมูล</span>}</span>
                    <span aria-hidden className="text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-accent">›</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
        <p className="text-center text-[13px] text-faint">ราคาป้ายทางการ ไม่ใช่ราคาซื้อขายจริง{detail.latestChecked ? ` · ตรวจสอบล่าสุด ${formatDateTH(detail.latestChecked)}` : ""}</p>
      </main>
    </div>
  );
}

export default async function UxPreviewPage({ params }: Props) {
  const { v, slug } = await params;
  if (!VARIANTS[v]) notFound();
  const [detail, tree] = await Promise.all([getNameplateDetail(slug), getNameplateTree(slug)]);
  if (!detail || !tree || !tree.generations[0]) notFound();

  return (
    <>
      <div className="border-b border-border bg-warning-soft px-4 py-2 text-center text-[13px] text-warning">
        หน้าเทียบทิศ UX (ชั่วคราว) — กำลังดูทิศ <strong>{VARIANTS[v]}</strong> · สลับได้ที่แถบล่าง
      </div>
      {v === "a" && <DirA detail={detail} tree={tree} />}
      {v === "b" && <DirB detail={detail} tree={tree} />}
      {v === "c" && <DirC detail={detail} tree={tree} />}
      <Switcher v={v} slug={slug} />
    </>
  );
}
