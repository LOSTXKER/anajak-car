import { notFound } from "next/navigation";
import Link from "next/link";
import { getBrandShell } from "@/lib/queries";
import { brandNav } from "@/lib/nav";
import { AppShell } from "@/components/app-shell";
import { Sidebar } from "@/components/sidebar";
import { BrandMark } from "@/components/brand-shortcuts";

// โซนแบรนด์ (/brands/[slug]/*) — sidebar เมนูประจำแบรนด์ (หัว = โลโก้+ชื่อแบรนด์ แบบ game selector)
// getBrandShell เบา (ไม่ลาก tree) + gate เมนูตามข้อมูลจริง (กฎห้ามหน้า thin)
export default async function BrandLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const shell = await getBrandShell(slug);
  if (!shell) notFound();

  const topSlot = (
    <Link
      href={`/brands/${shell.slug}`}
      className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-muted"
    >
      <BrandMark name={shell.name} size={24} />
      <span className="text-sm font-semibold text-foreground">{shell.name}</span>
    </Link>
  );

  return (
    <AppShell
      sidebar={
        <Sidebar
          nav={brandNav(shell.slug, {
            hasPriceLadder: shell.hasPriceLadder,
            hasTimeline: shell.hasTimeline,
          })}
          topSlot={topSlot}
        />
      }
    >
      {children}
    </AppShell>
  );
}
