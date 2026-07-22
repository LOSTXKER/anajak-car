import { notFound } from "next/navigation";
import { getNameplateDetail } from "@/lib/queries";
import { MockAppFrame } from "@/components/dev/m24/frame";
import { NameplateDense } from "@/components/dev/m24/nameplate-dense";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = await getNameplateDetail(slug);
  if (!detail) notFound();
  return (
    <MockAppFrame>
      <NameplateDense detail={detail} />
    </MockAppFrame>
  );
}
