// หน้าแบรนด์ของทิศ "ปัจจุบัน" — เลียนหน้าจริง src/app/(app)/brands/[slug]/page.tsx
// (ใช้ SectionHeader / StatBar / BrandMark ตัวจริงของเว็บ · ต่างแค่ลิงก์ชี้กลับเข้าหน้าลอง)
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SectionHeader, StatBar } from "@/components/panel";
import { BrandMark } from "@/components/brand-shortcuts";
import { DataStatusValue } from "@/components/badges";
import { formatDateTH, formatPriceRange } from "@/lib/format";

import { BRANDS, NAMEPLATES, brandStats } from "../../_kit/data";
import { BfLink } from "./kit";

export function CurrentBrand({ thin }: { thin: boolean }) {
  const b = BRANDS.find((x) => x.slug === (thin ? "tesla" : "toyota"))!;
  const st = brandStats(b.slug);
  const rows = NAMEPLATES.filter((n) => n.brandSlug === b.slug);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-5xl px-4 pb-20 sm:px-6">
          <nav aria-label="breadcrumb" className="pt-8 text-sm text-faint">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <BfLink look="current" screen="home" thin={thin} className="hover:text-foreground">
                  ฐานข้อมูลรถ
                </BfLink>
              </li>
              <li aria-hidden>›</li>
              <li aria-current="page" className="font-medium text-foreground">
                {b.name}
              </li>
            </ol>
          </nav>

          <header className="relative mt-5 mb-8 overflow-hidden rounded-2xl border border-border bg-background">
            <div
              aria-hidden
              className="absolute inset-y-0 right-0 hidden w-[40%] bg-accent-soft sm:block"
              style={{ clipPath: "polygon(24% 0, 100% 0, 100% 100%, 0 100%)" }}
            />
            <div className="relative p-6 sm:p-8">
              <div className="flex items-center gap-4">
                <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl border border-border bg-background p-3">
                  <BrandMark name={b.name} size={44} />
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold tracking-[0.2em] text-accent uppercase">แบรนด์</p>
                  <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{b.name}</h1>
                  {b.officialName && <p className="mt-0.5 text-sm text-muted">{b.officialName}</p>}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
                <StatBar label="รุ่นใน coverage" value={st.nameplates} />
                <StatBar label="รุ่นย่อย" value={st.variants} />
                <StatBar
                  label="ช่วงราคาป้าย"
                  value={<span className="text-sm">{formatPriceRange(st.priceMin, st.priceMax) ?? "—"}</span>}
                />
                <StatBar
                  label="ดำเนินงานตั้งแต่"
                  value={<DataStatusValue value={b.operationYear} />}
                  sub={b.distributorName ?? undefined}
                />
                <StatBar label="ตรวจสอบล่าสุด" value={<span className="text-sm">{formatDateTH(b.checkedDate)}</span>} />
              </div>
            </div>
          </header>

          <section className="pt-2">
            <SectionHeader title="เกี่ยวกับแบรนด์ในไทย" />
            <dl className="mt-3 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-faint">ผู้ผลิต/จัดจำหน่าย</dt>
                <dd className="mt-0.5 text-sm font-medium">
                  <DataStatusValue value={b.distributorName} />
                </dd>
              </div>
              <div>
                <dt className="text-xs text-faint">บริษัทแม่</dt>
                <dd className="mt-0.5 text-sm font-medium">
                  <DataStatusValue value={b.parentCompany} />
                </dd>
              </div>
            </dl>
            {b.channel && <p className="mt-3 max-w-2xl text-sm text-muted">{b.channel}</p>}
          </section>

          <section className="mt-8">
            <SectionHeader title="สำรวจข้อมูลแบรนด์" />
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                { title: "รุ่นรถ", sub: `${st.nameplates} รุ่น · ${st.variants} รุ่นย่อย`, screen: "model" as const },
                { title: "ไทม์ไลน์และประวัติ", sub: "3 เหตุการณ์", screen: "model" as const },
                { title: "แหล่งอ้างอิง", sub: "3 แหล่ง", screen: "model" as const },
              ].map((e) => (
                <BfLink
                  key={e.title}
                  look="current"
                  screen={e.screen}
                  thin={thin}
                  className="rounded-2xl border border-border bg-surface p-5 transition-all hover:border-accent hover:shadow-sm"
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-semibold">{e.title}</span>
                    <span aria-hidden className="text-accent">
                      →
                    </span>
                  </span>
                  <span className="mt-1 block text-xs text-faint tnum">{e.sub}</span>
                </BfLink>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <SectionHeader title={`รุ่นของ ${b.name}`} sub={<span className="tnum">{rows.length} รุ่น</span>} />
            <ul className="mt-3 flex flex-wrap gap-2">
              {rows.map((n) => (
                <li key={n.slug}>
                  <BfLink
                    look="current"
                    screen="model"
                    thin={thin}
                    className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-3.5 py-1.5 text-sm transition-colors hover:bg-accent-soft hover:text-accent"
                  >
                    {n.name}
                    <span aria-hidden className="text-faint">
                      ›
                    </span>
                  </BfLink>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
