import type { Metadata } from "next";
import { Suspense } from "react";
import { getDatabaseIndex } from "@/lib/queries";
import { CarGrid } from "@/components/car-grid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "รุ่นรถทั้งหมด — ราคาป้ายและสเปกที่ตรวจสอบได้",
  description:
    "รุ่นรถทั้งหมดใน coverage ของ CARMETA — ค้นหาและกรองตามตัวถัง/ขุมพลัง ดูราคาป้ายทางการและรุ่นย่อย พร้อมแหล่งอ้างอิงทุกตัวเลข",
};

export default async function CarsPage() {
  const { rows, variantRows, stats } = await getDatabaseIndex();

  return (
    <>
      <header className="pt-8 pb-6">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">รุ่นรถทั้งหมด</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          ทุกรุ่นที่มีข้อมูลตรวจสอบแล้ว {stats.nameplates} รุ่น · {stats.variants} รุ่นย่อย —
          เลือกดูราคาป้ายทางการ สเปก และรุ่นย่อยของแต่ละรุ่น
        </p>
      </header>

      {stats.nameplates === 0 ? (
        <p className="py-20 text-center text-sm text-muted">
          กำลังเตรียมข้อมูลชุดแรก — ทุกตัวเลขต้องมีหลักฐานอ้างอิงก่อนแสดง
        </p>
      ) : (
        <div className="pb-12">
          <Suspense>
            <CarGrid rows={rows} variantRows={variantRows} />
          </Suspense>
        </div>
      )}
    </>
  );
}
