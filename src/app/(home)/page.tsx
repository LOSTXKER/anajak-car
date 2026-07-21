import type { Metadata } from "next";
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
    a: "ราคาป้ายทางการที่ผู้ผลิตประกาศ — ไม่ใช่ราคาซื้อขายจริงหรือราคาหลังโปรโมชัน",
  },
  {
    q: "ข้อมูลมาจากไหน เชื่อถือได้แค่ไหน?",
    a: "อ้างอิงเว็บและเอกสารทางการของผู้ผลิตเป็นหลัก — เปิดดูแหล่งที่มาและวันที่ตรวจสอบได้ในหน้าของทุกรุ่น",
  },
  {
    q: "รุ่นย่อย (variant) ต่างจากรุ่นรถยังไง?",
    a: "รุ่นรถคือชื่อรุ่นที่ขายในไทย ส่วนรุ่นย่อยคือแบบที่ซื้อได้จริงแต่ละแบบ (เกรด/เครื่องยนต์/เกียร์) ซึ่งราคาต่างกัน",
  },
  {
    q: "ยังไม่มีข้อมูลบางค่า ทำไมไม่ใส่ให้ครบ?",
    a: "ค่าที่ไม่มีหลักฐานแสดงเป็น “ไม่มีข้อมูล” แทนการเดา — ความถูกต้องมาก่อนความครบ",
  },
];

export default async function Home() {
  const [{ stats }, brands] = await Promise.all([
    getDatabaseIndex(),
    getBrandTiles(),
  ]);
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
          hero จบที่ชิป (กฎ DESIGN.md — ห้ามข้อความ/eyebrow/สถิติเพิ่ม) */}
      <section className="pt-20 pb-14 text-center sm:pt-28">
        {/* mobile ใช้ text-3xl — วลี "ด้วยข้อมูลรถที่ตรวจสอบได้" เป็นสตริงไทยยาวไม่มีวรรค ตัดคำไม่ได้ ที่ 4xl จะล้นจอ 390px */}
        <h1 className="mx-auto max-w-3xl text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
          เช็กก่อนซื้อ
          <br className="sm:hidden" />
          <span className="text-muted"> ด้วยข้อมูลรถที่ตรวจสอบได้</span>
        </h1>
        <div className="mt-10">
          <HeroSearch />
        </div>
      </section>

      {/* โลโก้แบรนด์ = shortcut เข้าหน้าแบรนด์ */}
      <section id="brands" aria-label="แบรนด์ในฐานข้อมูล" className="scroll-mt-20 pb-16">
        <BrandShortcuts brands={brands} />
      </section>

      {/* Landing: จุดยืนของผลิตภัณฑ์ — 3 เสาสั้น (ไม่มีไอคอนหัวหัวข้อ ตามกฎ LOCKED) */}
      <section aria-labelledby="why-heading" className="border-t border-border py-20 sm:py-24">
        <h2 id="why-heading" className="text-center text-xl font-semibold tracking-tight sm:text-2xl">
          ฐานข้อมูลรถที่<span className="text-accent">ต้องเช็กก่อนซื้อ</span>
        </h2>
        <div className="mt-10 grid gap-10 sm:grid-cols-3 sm:gap-8">
          <div>
            <h3 className="text-lg font-semibold">ทุกราคามีหลักฐาน</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              ราคาป้ายทางการ {stats.prices} รายการ เปิดดูแหล่งต้นทางได้ทุกตัวเลข
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">ลึกถึงรุ่นย่อย</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              แยกถึงระดับรุ่นย่อย {stats.variants} แบบ เทียบแบบตรงตัว ไม่ปนเกรด
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">สดใหม่ ตรวจสอบได้</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              {latestChecked ? `ตรวจสอบล่าสุด ${latestChecked} ` : ""}เก็บประวัติการเปลี่ยนแปลงย้อนหลัง
            </p>
          </div>
        </div>
      </section>

      {/* Landing: FAQ */}
      <section aria-labelledby="faq-heading" className="border-t border-border py-20 pb-24 sm:py-24">
        <h2 id="faq-heading" className="text-xl font-semibold tracking-tight sm:text-2xl">
          คำถามที่พบบ่อย
        </h2>
        <div className="mt-6 max-w-3xl divide-y divide-border">
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
