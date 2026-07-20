import { getBrandTiles } from "@/lib/queries";
import { GlobalNavbar } from "@/components/global-navbar";
import { SiteFooter } from "@/components/site-footer";

// Layout ของหน้าแรก = landing เต็มจอ ไม่มี sidebar (navbar เดียวกับโซน app)
export default async function HomeLayout({ children }: { children: React.ReactNode }) {
  const brands = await getBrandTiles();
  return (
    <div className="flex min-h-svh flex-col">
      <GlobalNavbar brands={brands} />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
}
