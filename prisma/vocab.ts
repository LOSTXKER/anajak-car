// การ map ข้อความดิบ → คำกลาง (VOCABULARY.md §4) — ใช้ร่วมทั้ง seed.ts และ ops backfill
// หลัก: map เฉพาะที่มั่นใจตามกฎ editorial · ไม่รู้จัก → คืน null (ห้ามเดา — DataStatus คงเป็น unknown)
import type { AspirationType, FuelType } from "../src/generated/prisma/enums";

export function fuelTypeFromRaw(raw?: string | null): FuelType | null {
  if (!raw) return null;
  const t = raw.trim().toLowerCase();
  if (t === "ดีเซล" || t === "diesel") return "DIESEL";
  if (t === "เบนซิน" || t === "petrol" || t === "gasoline") return "GASOLINE";
  return null;
}

export function motorLayoutFromRaw(raw?: string | null): "FRONT" | "REAR" | "DUAL" | null {
  if (!raw) return null;
  const t = raw.trim().toLowerCase();
  const front = t.includes("หน้า") || t.includes("front");
  const rear = t.includes("หลัง") || t.includes("rear");
  if (front && rear) return "DUAL";
  if (t.includes("dual") || t.includes("คู่")) return "DUAL";
  if (front) return "FRONT";
  if (rear) return "REAR";
  return null;
}

// "ลิเธียมไอออน" หยาบกว่าเคมีจริง (ครอบทั้ง NMC/LFP) → map ไม่ได้ คืน null (unknown โดยตั้งใจ)
export function batteryChemistryFromRaw(raw?: string | null): "NMC" | "LFP" | null {
  if (!raw) return null;
  const t = raw.trim().toLowerCase();
  if (t.includes("nmc") || t.includes("นิกเกิล")) return "NMC";
  if (t.includes("lfp") || t.includes("ฟอสเฟต") || t.includes("blade")) return "LFP";
  return null;
}

export function aspirationFromRaw(raw?: string | null): AspirationType | null {
  if (!raw) return null;
  const t = raw.trim().toLowerCase();
  if (t === "na" || t === "n/a") return "NA";
  if ((t.includes("twin") && t.includes("turbo")) || t.includes("bi-turbo") || t.includes("biturbo")) {
    return "TWIN_TURBO";
  }
  if (t.includes("turbo") || t.includes("เทอร์โบ")) return "TURBO";
  if (t.includes("supercharg") || t.includes("ซูเปอร์ชาร์จ")) return "SUPERCHARGED";
  return null;
}
