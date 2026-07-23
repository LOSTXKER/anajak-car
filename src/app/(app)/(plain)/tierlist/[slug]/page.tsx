import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEditorialTierList } from "@/lib/editorial-tiers";
import { EditorialTierlist } from "@/components/tierlist/editorial-tierlist";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const list = getEditorialTierList(slug);
  if (!list) notFound();
  return { title: `${list.title} — ความเห็นบรรณาธิการ`, description: list.cohortLabel };
}

export default async function TierlistDetail({ params }: Props) {
  const { slug } = await params;
  const list = getEditorialTierList(slug);
  if (!list) notFound();
  return <EditorialTierlist list={list} />;
}
