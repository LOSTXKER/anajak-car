import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrandDetail, getBrandTimeline } from "@/lib/queries";
import { CHANGE_TYPE_LABEL } from "@/lib/labels";
import { formatDateTH } from "@/lib/format";
import { Chip, EvidenceLink, PendingBlock } from "@/components/badges";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getBrandDetail(slug);
  if (!detail) notFound();
  return { title: `ไทม์ไลน์และประวัติ ${detail.name}` };
}

export default async function BrandTimelinePage({ params }: Props) {
  const { slug } = await params;
  const [detail, timeline] = await Promise.all([getBrandDetail(slug), getBrandTimeline(slug)]);
  if (!detail) notFound();
  const operationYear = detail.operationFrom ? new Date(detail.operationFrom).getUTCFullYear() : null;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-20 sm:px-6">
      <nav aria-label="breadcrumb" className="pt-8 text-sm text-faint">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-foreground">ฐานข้อมูลรถ</Link></li>
          <li aria-hidden>›</li>
          <li><Link href={`/brands/${slug}`} className="text-muted hover:text-foreground">{detail.name}</Link></li>
          <li aria-hidden>›</li>
          <li aria-current="page" className="font-medium text-foreground">ไทม์ไลน์และประวัติ</li>
        </ol>
      </nav>

      <div className="pt-6">
        <p className="text-[13px] font-semibold tracking-[0.2em] text-accent uppercase">{detail.name}</p>
        <h1 className="mt-0.5 text-3xl font-bold tracking-tight">ไทม์ไลน์และประวัติ</h1>
        {operationYear && <p className="mt-1 text-sm text-muted tnum">ดำเนินงานในไทยตั้งแต่ {operationYear}{detail.distributorName ? ` · ${detail.distributorName}` : ""}</p>}
        <div aria-hidden className="mt-3 h-0.5 w-full rounded-full bg-accent" />
      </div>

      {timeline.length > 0 ? (
        <ol className="mt-8 border-l border-border">
          {timeline.map((e) => (
            <li key={e.id} className="relative pb-8 pl-6 last:pb-0">
              <span aria-hidden className="absolute top-1.5 -left-[5px] size-2.5 rounded-full bg-accent ring-4 ring-background" />
              <div className="flex flex-wrap items-center gap-2">
                <span className="tnum text-xs text-faint">{formatDateTH(e.effectiveDate) ?? "ไม่ระบุวันที่"}</span>
                <Chip>{CHANGE_TYPE_LABEL[e.changeType] ?? e.changeType}</Chip>
                <Link href={`/cars/${e.nameplateSlug}`} className="text-sm font-medium hover:text-accent">{e.nameplateName}</Link>
              </div>
              <p className="mt-1.5 text-sm text-foreground">{e.title}</p>
              {e.summary && <p className="mt-1 text-sm text-muted">{e.summary}</p>}
              {e.evidence && <div className="mt-2"><EvidenceLink evidence={e.evidence} /></div>}
            </li>
          ))}
        </ol>
      ) : (
        <div className="mt-8 max-w-xl"><PendingBlock title="ยังไม่มีบันทึกความเคลื่อนไหวของแบรนด์" reason="เปิดตัวรุ่นใหม่ ปรับราคา เฟซลิฟต์ ฯลฯ จะรวมมาที่นี่เมื่อมีหลักฐาน" /></div>
      )}
    </div>
  );
}
