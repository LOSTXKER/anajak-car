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
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">รุ่นรถทั้งหมด</h1>
      </header>

      {stats.nameplates === 0 ? (
        <p className="py-20 text-center text-sm text-muted">กำลังเตรียมข้อมูลชุดแรก</p>
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
