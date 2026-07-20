// Registry รูปภาพ static — โลโก้แบรนด์ + รูปรถต่อ nameplate
// ที่มา/license ของทุกไฟล์บันทึกใน public/logos/CREDITS.md และ public/cars/CREDITS.md
// (ยังไม่ย้ายลง DB — Brand.logoUrl ในสคีมารองรับแล้ว จะ migrate เมื่อ asset นิ่ง)

export type CarImage = { src: string; alt: string };

// โลโก้จาก Wikimedia Commons (Public domain — ตัวเครื่องหมายการค้ายังเป็นของแบรนด์ ใช้เชิงระบุถึงเท่านั้น)
export const BRAND_LOGO: Record<string, string> = {
  toyota: "/logos/toyota.svg",
  honda: "/logos/honda.svg",
  isuzu: "/logos/isuzu.svg",
  byd: "/logos/byd.svg",
  mitsubishi: "/logos/mitsubishi.svg",
  nissan: "/logos/nissan.svg",
  mg: "/logos/mg.svg",
  mazda: "/logos/mazda.svg",
  ford: "/logos/ford.svg",
};

// โลโก้ที่ใช้สีเข้ม/เทาเป็นส่วนสำคัญ (ตัด/วงกลม/wordmark สีดำ) จมหายบนพื้นมืด (contrast ~1:1)
// จึงรีมแมปเฉพาะ pixel ที่เป็น "หมึกดำ/เทา" เป็นสีอ่อน (คงสีจริงของโลโก้ เช่น สีแดง Mitsubishi ไว้เหมือนเดิม)
export const BRAND_LOGO_DARK: Record<string, string> = {
  nissan: "/logos/nissan-dark.png",
  mazda: "/logos/mazda-dark.png",
  mitsubishi: "/logos/mitsubishi-dark.png",
};

// ภาพสินค้าทางการจาก toyota.co.th (ลิขสิทธิ์ Toyota — ใช้ระบุสินค้า · ดู CREDITS.md)
export const NAMEPLATE_IMAGE: Record<string, CarImage> = {
  "corolla-altis": { src: "/cars/corolla-altis.webp", alt: "Toyota Corolla Altis" },
  "yaris-ativ": { src: "/cars/yaris-ativ.webp", alt: "Toyota Yaris Ativ" },
  "hilux-travo": { src: "/cars/hilux-travo.webp", alt: "Toyota Hilux Travo" },
  fortuner: { src: "/cars/fortuner.webp", alt: "Toyota Fortuner" },
  bz4x: { src: "/cars/bz4x.webp", alt: "Toyota bZ4X" },
};

export function brandLogo(slugOrName: string): string | undefined {
  return BRAND_LOGO[slugOrName.toLowerCase()];
}

export function brandLogoDark(slugOrName: string): string | undefined {
  return BRAND_LOGO_DARK[slugOrName.toLowerCase()];
}

export function nameplateImage(slug: string): CarImage | undefined {
  return NAMEPLATE_IMAGE[slug];
}
