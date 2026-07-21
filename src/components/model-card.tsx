import Image from "next/image";
import Link from "next/link";
import type { NameplateRow } from "@/lib/queries";
import { BODY_TYPE_LABEL } from "@/lib/labels";
import { formatTHB } from "@/lib/format";
import { LifecycleBadge } from "@/components/badges";
import { nameplateImage } from "@/lib/images";

// เงารถ = ภาษาเดียวของ "ยังไม่มีภาพ" ทั้งเว็บ — เส้นบางสีเดียวกับ hairline อ่านเป็น "แบบร่างรอภาพ" ไม่ใช่ของขาด
export function CarSilhouette({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 17h-2v-4l4-1 5-6h14l6 6h7a3 3 0 0 1 3 3v2h-3" />
      <circle cx="14" cy="17" r="3" />
      <circle cx="36" cy="17" r="3" />
      <path d="M17 17h16" />
    </svg>
  );
}

// รูปรถในการ์ด — ภาพทางการถ้ามี, ไม่มีก็เป็นเงารถ (Champ/Revo ยังไม่มีไฟล์)
function ModelImage({ slug }: { slug: string }) {
  const image = nameplateImage(slug);
  if (!image) {
    return (
      <span className="flex h-full w-full items-center justify-center text-border-strong">
        <CarSilhouette className="h-14 w-28" />
      </span>
    );
  }
  return (
    <Image
      src={image.src}
      alt=""
      width={320}
      height={180}
      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.04]"
    />
  );
}

// การ์ดหนึ่งรุ่น (= "character") — ใช้ทั้งหน้า /cars และ /brands/[slug] · คลิกทั้งใบเข้าหน้ารุ่น
// image-forward: รูป = tile กดได้ · ชื่อ/สเปก/ราคา ลอยบนพื้นเปล่าใต้รูป (แบบ Apple Store card)
export function ModelCard({ row }: { row: NameplateRow }) {
  const bodyLabel = [...new Set(row.bodyTypes.map((bt) => BODY_TYPE_LABEL[bt] ?? bt))].join(" · ");
  // สเปกบรรทัดเดียวเงียบๆ (ตัวถัง · ขุมพลัง) — จำนวนรุ่นย่อยเป็น meta ชั้น detail เห็นเมื่อคลิกเข้าไป
  const specLine = [bodyLabel, row.powertrainLabels.join(" · ")].filter(Boolean).join(" · ");

  return (
    <Link href={`/brands/${row.brandSlug}/cars/${row.slug}`} className="group flex flex-col">
      <div className="flex aspect-[16/10] items-center justify-center rounded-2xl bg-surface-muted px-8 py-6 transition-all group-hover:-translate-y-0.5 group-hover:shadow-md">
        <ModelImage slug={row.slug} />
      </div>
      <div className="mt-4 px-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <h3 className="text-base font-semibold group-hover:text-accent">{row.name}</h3>
          <LifecycleBadge status={row.lifecycleStatus} />
        </div>
        <p className="mt-1 text-sm text-muted">{specLine}</p>
        {row.priceMin != null ? (
          <p className="mt-2 text-lg font-semibold tabular-nums">
            <span className="text-sm font-normal text-faint">เริ่มต้น </span>
            {formatTHB(row.priceMin)}
          </p>
        ) : (
          <p className="mt-2 text-sm text-faint">ยังไม่มีราคา</p>
        )}
      </div>
    </Link>
  );
}
