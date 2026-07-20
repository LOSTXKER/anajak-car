import { getBrandTiles } from "@/lib/queries";
import { GlobalNavbar } from "@/components/global-navbar";

// Layout โซน app — navbar เต็มกว้างบนสุด (global) + {children} (= zone layout ที่ใส่ sidebar เอง)
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const brands = await getBrandTiles();
  return (
    <div className="flex min-h-svh flex-col">
      <GlobalNavbar brands={brands} />
      {children}
    </div>
  );
}
