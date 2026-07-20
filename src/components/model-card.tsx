import Image from "next/image";
import Link from "next/link";
import type { NameplateRow } from "@/lib/queries";
import { BODY_TYPE_LABEL } from "@/lib/labels";
import { formatTHB } from "@/lib/format";
import { LifecycleBadge } from "@/components/badges";
import { nameplateImage } from "@/lib/images";

// รูปรถในการ์ด — ภาพทางการถ้ามี, ไม่มีก็เป็นภาพเงารถ (Champ/Revo ยังไม่มีไฟล์)
function ModelImage({ slug }: { slug: string }) {
  const image = nameplateImage(slug);
  if (!image) {
    return (
      <span aria-hidden className="flex h-full w-full items-center justify-center text-faint">
        <svg viewBox="0 0 48 24" className="h-10 w-20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 17h-2v-4l4-1 5-6h14l6 6h7a3 3 0 0 1 3 3v2h-3" />
          <circle cx="14" cy="17" r="3" />
          <circle cx="36" cy="17" r="3" />
          <path d="M17 17h16" />
        </svg>
      </span>
    );
  }
  return (
    <Image
      src={image.src}
      alt=""
      width={320}
      height={180}
      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
    />
  );
}

// การ์ดหนึ่งรุ่น (= "character") — ใช้ทั้งหน้า /cars และ /brands/[slug] · คลิกทั้งใบเข้าหน้ารุ่น
export function ModelCard({ row }: { row: NameplateRow }) {
  const bodyLabel = [...new Set(row.bodyTypes.map((bt) => BODY_TYPE_LABEL[bt] ?? bt))].join(" · ");
  // สเปกบรรทัดเดียวเงียบๆ ใต้ชื่อ (ตัวถัง · ขุมพลัง · จำนวนรุ่นย่อย)
  const specLine = [bodyLabel, row.powertrainLabels.join(" · "), `${row.variantCount} รุ่นย่อย`]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link
      href={`/cars/${row.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-surface-muted transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex aspect-[16/9] items-center justify-center px-5 pt-4">
        <ModelImage slug={row.slug} />
      </div>
      <div className="flex flex-col gap-1 p-4">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <h3 className="text-[15px] font-semibold group-hover:text-accent">{row.name}</h3>
          <LifecycleBadge status={row.lifecycleStatus} />
        </div>
        <p className="text-[13px] text-muted">{specLine}</p>
        {row.priceMin != null ? (
          <p className="mt-1 text-sm font-semibold tabular-nums">เริ่มต้น {formatTHB(row.priceMin)}</p>
        ) : (
          <p className="mt-1 text-sm text-faint">ยังไม่มีราคา</p>
        )}
      </div>
    </Link>
  );
}
