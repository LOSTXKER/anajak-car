import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNameplateDetail } from "@/lib/queries";
import { CHANGE_TYPE_LABEL } from "@/lib/labels";
import { formatDateTH } from "@/lib/format";
import { Chip, EvidenceLink, PendingBlock } from "@/components/badges";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getNameplateDetail(slug);
  if (!detail) notFound();
  return { title: `ไทม์ไลน์ ${detail.brand} ${detail.name}` };
}

export default async function TimelinePage({ params }: Props) {
  const { slug } = await params;
  const detail = await getNameplateDetail(slug);
  if (!detail) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-20 sm:px-6">
      <nav aria-label="breadcrumb" className="pt-8 text-sm text-faint">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-foreground">ฐานข้อมูลรถ</Link></li>
          <li aria-hidden>›</li>
          <li><Link href={`/brands/${detail.brandSlug}`} className="text-muted hover:text-foreground">{detail.brand}</Link></li>
          <li aria-hidden>›</li>
          <li><Link href={`/cars/${slug}`} className="text-muted hover:text-foreground">{detail.name}</Link></li>
          <li aria-hidden>›</li>
          <li aria-current="page" className="font-medium text-foreground">ไทม์ไลน์</li>
        </ol>
      </nav>

      <h1 className="pt-6 pb-2 text-3xl font-semibold tracking-tight">ไทม์ไลน์การเปลี่ยนแปลง</h1>
      <p className="text-sm text-muted">{detail.brand} {detail.name} — เปิดตัว ปรับสเปก ปรับราคา และเหตุการณ์ที่มีหลักฐาน</p>

      {detail.changeEvents.length > 0 ? (
        <ol className="mt-8 max-w-3xl border-l border-border">
          {detail.changeEvents.map((event) => (
            <li key={event.id} className="relative pb-8 pl-6 last:pb-0">
              <span aria-hidden className="absolute top-1.5 -left-[5px] size-2.5 rounded-full bg-accent ring-4 ring-background" />
              <div className="flex flex-wrap items-center gap-2">
                <span className="tnum text-xs text-faint">{formatDateTH(event.effectiveDate) ?? "ไม่ระบุวันที่"}</span>
                <Chip>{CHANGE_TYPE_LABEL[event.changeType] ?? event.changeType}</Chip>
              </div>
              <p className="mt-1.5 font-medium">{event.title}</p>
              {event.summary && <p className="mt-1 text-sm text-muted">{event.summary}</p>}
              {(event.beforeValue || event.afterValue) && (
                <p className="mt-1 text-sm text-muted tnum">{event.beforeValue ?? "—"} → {event.afterValue ?? "—"}</p>
              )}
              {event.evidence && <div className="mt-2"><EvidenceLink evidence={event.evidence} /></div>}
            </li>
          ))}
        </ol>
      ) : (
        <div className="mt-8 max-w-xl">
          <PendingBlock title="ยังไม่มีบันทึกการเปลี่ยนแปลง" reason="รุ่นนี้ยังไม่มีเหตุการณ์ที่บันทึกพร้อมหลักฐาน (เปิดตัว/ปรับราคา/เฟซลิฟต์/เรียกคืน) — จะเพิ่มเมื่อพบหลักฐาน" />
        </div>
      )}
    </div>
  );
}
