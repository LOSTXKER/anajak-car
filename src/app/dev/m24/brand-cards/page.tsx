import { notFound } from "next/navigation";
import { getBrandDetail } from "@/lib/queries";
import { MockAppFrame } from "@/components/dev/m24/frame";
import { BrandCards } from "@/components/dev/m24/brand-cards";

export const dynamic = "force-dynamic";

export default async function Page() {
  const detail = await getBrandDetail("toyota");
  if (!detail) notFound();
  return (
    <MockAppFrame>
      <BrandCards detail={detail} />
    </MockAppFrame>
  );
}
