import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNameplateTree, selectGeneration } from "@/lib/queries";
import { BODY_TYPE_LABEL, CHASSIS_TYPE_LABEL, SEGMENT_LABEL } from "@/lib/labels";
import { formatPriceRange } from "@/lib/format";
import { DataStatusValue, PendingBlock, SpecRow, StatTile } from "@/components/badges";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string; gen: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, gen } = await params;
  const tree = await getNameplateTree(slug);
  if (!tree) notFound();
  const g = selectGeneration(tree, gen);
  if (!g) notFound();
  return { title: `${tree.brand} ${tree.name} เจน ${g.launchYear ?? g.key} — โครงสร้างรุ่น` };
}

export default async function GenerationPage({ params }: Props) {
  const { slug, gen } = await params;
  const tree = await getNameplateTree(slug);
  if (!tree) notFound();
  const g = selectGeneration(tree, gen);
  if (!g) notFound();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-20 sm:px-6">
      <nav aria-label="breadcrumb" className="pt-8 text-sm text-faint">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-foreground">ฐานข้อมูลรถ</Link></li>
          <li aria-hidden>›</li>
          <li><Link href={`/brands/${tree.brandSlug}`} className="text-muted hover:text-foreground">{tree.brand}</Link></li>
          <li aria-hidden>›</li>
          <li><Link href={`/cars/${slug}`} className="text-muted hover:text-foreground">{tree.name}</Link></li>
          <li aria-hidden>›</li>
          <li aria-current="page" className="font-medium text-foreground">เจน {g.launchYear ?? g.key}</li>
        </ol>
      </nav>

      <header className="pt-6 pb-6">
        <h1 className="text-3xl font-semibold tracking-tight">
          {tree.name} <span className="font-normal text-muted">เจน {g.launchYear ?? g.key}</span>
        </h1>
        <p className="mt-2 text-sm text-muted">
          {[
            tree.segment ? (SEGMENT_LABEL[tree.segment] ?? tree.segment) : null,
            g.code,
            g.launchYear != null ? `เปิดตัวในไทย ${g.launchYear}` : null,
          ].filter(Boolean).join(" · ")}
        </p>
        {g.summary && <p className="mt-4 max-w-2xl text-[15px] leading-7 text-muted">{g.summary}</p>}

        <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <StatTile label="ตัวถัง" value={<span className="tnum">{g.derivatives.length}</span>} />
          <StatTile label="รุ่นย่อย" value={<span className="tnum">{g.variantCount}</span>} />
          <StatTile label="ช่วงราคาป้าย" value={<span className="tnum text-sm">{formatPriceRange(g.priceMin, g.priceMax) ?? "—"}</span>} />
          <StatTile label="แพลตฟอร์ม" value={<span className="text-sm"><DataStatusValue value={g.platformName} /></span>} sub={g.chassisType ? CHASSIS_TYPE_LABEL[g.chassisType] : undefined} />
        </div>
      </header>

      {/* derivatives */}
      <section className="border-t border-border pt-8">
        <h2 className="text-xl font-semibold tracking-tight">ตัวถังในเจนนี้</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {g.derivatives.map((d) => (
            <Link key={d.key} href={`/cars/${slug}/gen/${g.key}/${d.key}`} className="rounded-2xl border border-border bg-surface p-4 transition-all hover:border-accent hover:shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold">{d.name || (BODY_TYPE_LABEL[d.bodyType] ?? d.bodyType)}</span>
                <span aria-hidden className="text-accent">→</span>
              </div>
              <div className="mt-1.5 text-lg font-semibold tnum"><DataStatusValue value={formatPriceRange(d.priceMin, d.priceMax)} /></div>
              <div className="mt-1 text-xs text-faint tnum">{d.variantCount} รุ่นย่อย · {d.trims.length} เกรด</div>
            </Link>
          ))}
        </div>
      </section>

      {/* spec / facelift placeholders — ซื่อสัตย์ */}
      <section className="border-t border-border pt-8 mt-10">
        <h2 className="text-xl font-semibold tracking-tight">ข้อมูลเจเนอเรชัน</h2>
        <dl className="mt-4 max-w-2xl">
          <SpecRow label="แพลตฟอร์ม/โครงสร้าง"><DataStatusValue value={g.platformName} /></SpecRow>
          <SpecRow label="ประเภทแชสซี"><DataStatusValue value={g.chassisType ? CHASSIS_TYPE_LABEL[g.chassisType] : null} /></SpecRow>
          <SpecRow label="เฟส Eco Car"><DataStatusValue value={g.ecoCarPhase} /></SpecRow>
        </dl>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <PendingBlock title="ยังไม่มีประวัติเฟซลิฟต์/เจนก่อนหน้า" reason="เจนนี้เป็นรุ่นปัจจุบัน · ประวัติเจนเก่าจะเพิ่มเมื่อมีหลักฐาน" />
          <PendingBlock title="รอข้อมูลมิติตัวถัง" reason="ยาว × กว้าง × สูง · ระยะฐานล้อ · น้ำหนัก" />
        </div>
      </section>
    </div>
  );
}
