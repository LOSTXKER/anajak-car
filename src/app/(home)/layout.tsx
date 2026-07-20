import { LandingHeader } from "@/components/landing-header";
import { SiteFooter } from "@/components/site-footer";

// Layout ของหน้าแรก = landing เต็มจอ ไม่มี sidebar (มี top header แทน)
export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <LandingHeader />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
}
