import { notFound } from "next/navigation";
import { getBrandDetail } from "@/lib/queries";
import { MockAppFrame } from "@/components/dev/m24/frame";
import { TierlistData } from "@/components/dev/m24/tierlist-data";

export const dynamic = "force-dynamic";

export default async function Page() {
  const detail = await getBrandDetail("toyota");
  if (!detail) notFound();
  const pickups = detail.rows.filter((r) => r.bodyTypes.includes("PICKUP"));
  return (
    <MockAppFrame sidebar={false}>
      <TierlistData rows={pickups} checked={detail.stats.latestChecked} />
    </MockAppFrame>
  );
}
