import type { Metadata } from "next";
import Link from "next/link";
import { getBrandTiles, getDatabaseIndex } from "@/lib/queries";
import { formatDateTH } from "@/lib/format";
import { BrandShortcuts } from "@/components/brand-shortcuts";
import { HeroSearch } from "@/components/hero-search";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "CARMETA — เช็กราคารถใหม่ สเปก และรุ่นย่อย พร้อมแหล่งอ้างอิง",
  // เลี่ยงคำว่า "ตรวจสอบกับแหล่งทางการ" ครอบทุกตัวเลข — ราคาปัจจุบันอ้างผู้ผลิตจริง
  // แต่ไทม์ไลน์ย้อนหลังบางรายการอ้างสื่อ (EDITORIAL/MEDIUM) ไม่ใช่ผู้ผลิตโดยตรง
  description:
    "ฐานข้อมูลรถยนต์ในไทย: ราคาป้ายทางการ สเปกรายรุ่นย่อย เจเนอเรชัน และไทม์ไลน์การเปลี่ยนแปลง — ทุกตัวเลขผูกแหล่งอ้างอิงที่ตรวจสอบได้ พร้อมวันที่ตรวจและระดับความเชื่อมั่น",
};

const FAQ = [
  {
    q: "ราคาบน CARMETA คือราคาอะไร?",
    a: "เป็น “ราคาป้ายทางการ” (ราคาประกาศของผู้ผลิต) ไม่ใช่ราคาซื้อขายจริงหรือราคาหลังโปรโมชัน — เราแยกชนิดราคาชัดเจนและไม่นำมาปนกัน",
  },
  {
    q: "ข้อมูลมาจากไหน เชื่อถือได้แค่ไหน?",
    a: "ทุกราคาอ้างอิงหน้าเว็บ/เอกสารทางการของผู้ผลิตเป็นหลัก และผ่านการตรวจซ้ำกับแหล่งที่อ้างทีละรายการ ทุกตัวเลขแสดงแหล่งที่มา วันที่ตรวจสอบ และระดับความเชื่อมั่นกำกับเสมอ — ไม่มีตัวเลขที่ไม่มีหลักฐาน",
  },
  {
    q: "รุ่นย่อย (variant) ต่างจากรุ่นรถยังไง?",
    a: "รุ่นรถ (เช่น Hilux Travo) คือชื่อรุ่นที่ขายในไทย ส่วนรุ่นย่อยคือแบบที่ซื้อได้จริงแต่ละแบบ (เกรด/เครื่องยนต์/เกียร์/ขับเคลื่อน) ซึ่งราคาต่างกัน — CARMETA แยกข้อมูลลึกถึงระดับรุ่นย่อยเพื่อให้เทียบแบบตรงตัวได้",
  },
  {
    q: "ยังไม่มีข้อมูลบางค่า ทำไมไม่ใส่ให้ครบ?",
    a: "ค่าที่ไม่มีหลักฐานเราแสดงว่า “ไม่มีข้อมูล” แทนการเดาหรือใส่ 0 — ความถูกต้องมาก่อนความครบ และเราขยาย coverage แบบลึกก่อนกว้าง",
  },
];

export default async function Home() {
  const [{ rows, stats }, brands] = await Promise.all([
    getDatabaseIndex(),
    getBrandTiles(),
  ]);
  const isEmpty = stats.nameplates === 0;
  const latestChecked = formatDateTH(stats.latestChecked);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      {/* Hero แบบ search-first (เบสเลือกจากหน้าเทียบ 3 แบบ 2026-07-20) — ช่องค้นหาคือพระเอก
          คนมาเว็บนี้เพื่อ "ค้นรถ" ให้ทำได้ทันที · ตัวเลขจริงเป็นบรรทัดพิสูจน์ ไม่ใช่การ์ดสถิติ (เบสถอดการ์ดไปแล้วใน M5) */}
      <section className="pt-14 pb-10 text-center sm:pt-20">
        <p className="text-xs font-medium tracking-[0.22em] text-faint uppercase">
          Thailand Car Database
        </p>
        {/* mobile ใช้ text-3xl — วลี "ด้วยข้อมูลรถที่ตรวจสอบได้" เป็นสตริงไทยยาวไม่มีวรรค ตัดคำไม่ได้ ที่ 4xl จะล้นจอ 390px */}
        <h1 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
          เช็กก่อนซื้อ
          <br className="sm:hidden" />
          <span className="text-muted"> ด้วยข้อมูลรถที่ตรวจสอบได้</span>
        </h1>
        <div className="mt-8">
          <HeroSearch />
        </div>
      </section>

      {/* โลโก้แบรนด์ = shortcut เข้าหน้าแบรนด์ */}
      <section id="brands" aria-label="แบรนด์ใน coverage" className="scroll-mt-20 pb-14">
        <BrandShortcuts brands={brands} />
      </section>

      {/* Landing: จุดยืนของผลิตภัณฑ์ */}
      <section aria-labelledby="why-heading" className="border-t border-border py-14">
        <h2 id="why-heading" className="text-center text-2xl font-semibold tracking-tight">
          ฐานข้อมูลรถที่<span className="text-accent">ต้องเช็กก่อนซื้อ</span>
        </h2>
        <div className="mt-10 grid gap-10 sm:grid-cols-3 sm:gap-8">
          <div>
            <div className="flex size-10 items-center justify-center rounded-full bg-accent-soft text-accent">
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12 2.5 4.5 5.5v6c0 4.6 3.2 8.1 7.5 9.5 4.3-1.4 7.5-4.9 7.5-9.5v-6L12 2.5Z" />
                <path d="m8.8 12 2.2 2.2 4.2-4.4" />
              </svg>
            </div>
            <h3 className="mt-4 text-[15px] font-semibold">ทุกราคามีหลักฐาน</h3>
            <p className="mt-1.5 text-sm text-muted">
              ราคาป้ายทางการ {stats.prices} รายการในระบบ อ้างอิงแหล่งทางการของผู้ผลิตทั้งหมด
              เปิดดูต้นทางได้ทุกตัวเลข พร้อมระดับความเชื่อมั่นกำกับ
            </p>
          </div>
          <div>
            <div className="flex size-10 items-center justify-center rounded-full bg-accent-soft text-accent">
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="m12 3 9 5-9 5-9-5 9-5Z" />
                <path d="m3 12.5 9 5 9-5" />
                <path d="m3 17 9 5 9-5" />
              </svg>
            </div>
            <h3 className="mt-4 text-[15px] font-semibold">ลึกถึงระดับรุ่นย่อย</h3>
            <p className="mt-1.5 text-sm text-muted">
              แยกโครงสร้างรถถูกต้องตั้งแต่รุ่น เจเนอเรชัน ตัวถัง จนถึงรุ่นย่อย {stats.variants} แบบ
              — เทียบราคา/สเปกแบบตรงตัว ไม่ปนคนละโฉมคนละเกรด
            </p>
          </div>
          <div>
            <div className="flex size-10 items-center justify-center rounded-full bg-accent-soft text-accent">
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="12" cy="12" r="8.5" />
                <path d="M12 7v5l3.2 1.8" />
              </svg>
            </div>
            <h3 className="mt-4 text-[15px] font-semibold">สดใหม่ ตรวจสอบได้</h3>
            <p className="mt-1.5 text-sm text-muted">
              ทุกข้อมูลระบุวันที่ตรวจสอบ{latestChecked ? ` (ล่าสุด ${latestChecked})` : ""} และเก็บประวัติการเปลี่ยนแปลงแบบไม่เขียนทับ
              — เห็นทั้งราคาปัจจุบันและไทม์ไลน์ย้อนหลัง
            </p>
          </div>
        </div>
      </section>

      {/* Landing: coverage + internal links เพื่อ SEO — ผูกกับข้อมูลจริงต่อแบรนด์ ไม่ hardcode ชื่อ */}
      {!isEmpty && (
        <section aria-labelledby="coverage-heading" className="border-t border-border py-14">
          <h2 id="coverage-heading" className="text-2xl font-semibold tracking-tight">
            Coverage ปัจจุบัน
          </h2>
          <p className="mt-3 max-w-3xl text-[15px] leading-7 text-muted">
            CARMETA เก็บข้อมูลเชิงลึกทีละแบรนด์ ครอบคลุมรถเก๋ง กระบะ PPV และรถไฟฟ้า
            รวม {stats.nameplates} รุ่น {stats.variants} รุ่นย่อยในระบบขณะนี้
            — เราตั้งใจทำให้ลึกและถูกต้องก่อน แล้วจึงขยายแบรนด์ถัดไป
          </p>
          <div className="mt-6 flex flex-col gap-6">
            {brands
              .filter((brand) => brand.nameplateCount > 0)
              .map((brand) => {
                const brandRows = rows.filter((row) => row.brand === brand.name);
                if (brandRows.length === 0) return null;
                return (
                  <div key={brand.slug}>
                    <Link
                      href={`/brands/${brand.slug}`}
                      className="text-sm font-medium text-foreground hover:text-accent"
                    >
                      {brand.name}
                      <span className="ml-1.5 font-normal text-faint">
                        ({brandRows.length} รุ่นใน coverage)
                      </span>
                    </Link>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {brandRows.map((row) => (
                        <li key={row.slug}>
                          <Link
                            href={`/cars/${row.slug}`}
                            className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-3.5 py-1.5 text-sm text-foreground transition-colors hover:bg-accent-soft hover:text-accent"
                          >
                            ราคา {row.brand} {row.name}
                            <span aria-hidden className="text-faint">›</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
          </div>
        </section>
      )}

      {/* Landing: FAQ */}
      <section aria-labelledby="faq-heading" className="border-t border-border py-14 pb-20">
        <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight">
          คำถามที่พบบ่อย
        </h2>
        <div className="mt-4 max-w-3xl divide-y divide-border">
          {FAQ.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center gap-3 rounded-xl text-[15px] font-medium marker:content-none">
                <span className="text-accent" aria-hidden>
                  Q
                </span>
                <span className="flex-1">{item.q}</span>
                <span
                  aria-hidden
                  className="text-faint transition-transform duration-200 group-open:rotate-180"
                >
                  ⌄
                </span>
              </summary>
              <p className="mt-2.5 pl-7 text-sm leading-6 text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
