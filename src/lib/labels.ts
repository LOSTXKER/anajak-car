// ป้ายภาษาไทยของ enum ในสคีมา — ใช้ร่วมกันทุกหน้า

export const BODY_TYPE_LABEL: Record<string, string> = {
  SEDAN: "ซีดาน",
  HATCHBACK: "แฮตช์แบ็ก",
  WAGON: "แวกอน",
  SUV: "SUV",
  PPV: "PPV",
  PICKUP: "กระบะ",
  COUPE: "คูเป้",
  CONVERTIBLE: "เปิดประทุน",
  MPV: "MPV",
  VAN: "แวน",
  OTHER: "อื่นๆ",
};

export const SEGMENT_LABEL: Record<string, string> = {
  ECO_CAR: "Eco car",
  SUBCOMPACT: "B-segment",
  COMPACT: "C-segment",
  MIDSIZE: "D-segment",
  FULLSIZE: "Full-size",
  LUXURY: "Luxury",
  SPORTS: "Sports",
  SUV_SUBCOMPACT: "SUV เล็ก",
  SUV_COMPACT: "SUV กลาง",
  SUV_MIDSIZE: "SUV ใหญ่",
  SUV_FULLSIZE: "SUV Full-size",
  PPV: "PPV",
  PICKUP: "กระบะ",
  MPV: "MPV",
  VAN: "แวน",
  OTHER: "อื่นๆ",
};

export const LIFECYCLE_LABEL: Record<string, string> = {
  UPCOMING: "เตรียมเปิดตัว",
  CURRENT: "ขายอยู่",
  TRANSITION: "ช่วงเปลี่ยนรุ่น",
  DISCONTINUED: "เลิกจำหน่าย",
};

export const CONFIDENCE_LABEL: Record<string, string> = {
  HIGH: "ความเชื่อมั่นสูง",
  MEDIUM: "ความเชื่อมั่นปานกลาง",
  LOW: "ความเชื่อมั่นต่ำ",
};

// คำสั้นสำหรับป้ายบนจอ (เลี่ยง enum อังกฤษ HIGH/MEDIUM/LOW) · title/sr-only ยังใช้ CONFIDENCE_LABEL เต็ม
export const CONFIDENCE_SHORT: Record<string, string> = {
  HIGH: "สูง",
  MEDIUM: "ปานกลาง",
  LOW: "ต่ำ",
};

export const SOURCE_TYPE_LABEL: Record<string, string> = {
  MANUFACTURER_OFFICIAL: "ผู้ผลิตทางการ",
  GOVERNMENT: "หน่วยงานรัฐ",
  MARKETPLACE_LICENSED: "Marketplace",
  PARTNER: "พาร์ตเนอร์",
  USER_REPORTED: "ผู้ใช้รายงาน",
  MEDIA: "สื่อยานยนต์/แหล่งอ้างอิงภายนอก",
  EDITORIAL: "ทีมข้อมูลตรวจทาน",
};

export const CHANGE_TYPE_LABEL: Record<string, string> = {
  LAUNCH: "เปิดตัว",
  FACELIFT: "ไมเนอร์เชนจ์",
  SPEC_CHANGE: "เปลี่ยนสเปก",
  TRIM_ADDED: "เพิ่มรุ่นย่อย",
  TRIM_REMOVED: "ตัดรุ่นย่อย",
  PRICE_CHANGE: "ปรับราคา",
  RECALL: "เรียกคืน",
  DISCONTINUED: "เลิกขาย",
};

export const DRIVETRAIN_LABEL: Record<string, string> = {
  FWD: "ขับหน้า",
  RWD: "ขับหลัง",
  AWD: "AWD",
  FOUR_WD: "4WD",
};

// ป้ายชนิดเชื้อเพลิง (คำกลาง — FuelType enum · VOCABULARY.md §3: ห้ามใช้ free text บนหน้าเว็บ/filter)
export const FUEL_TYPE_LABEL: Record<string, string> = {
  DIESEL: "ดีเซล",
  GASOLINE: "เบนซิน",
  OTHER: "สันดาป",
};

// ป้ายระบบอัดอากาศ (คำกลาง — AspirationType enum · ชื่อการตลาดเช่น "VN Turbo" เป็นข้อมูลรองใน tooltip)
export const ASPIRATION_LABEL: Record<string, string> = {
  NA: "ไม่มีระบบอัดอากาศ",
  TURBO: "เทอร์โบ",
  TWIN_TURBO: "ทวินเทอร์โบ",
  SUPERCHARGED: "ซูเปอร์ชาร์จ",
  OTHER: "อื่นๆ",
};

// ป้ายขุมพลังระดับ variant — ICE ใช้ชนิดเชื้อเพลิง canonical ถ้ารู้ (สั้นเพื่อความแน่นของตาราง)
// fuelType ต้องเป็นค่า FuelType enum เท่านั้น — ห้ามส่ง fuelTypeRaw (free text) เข้ามา
export function powertrainLabel(
  powertrainType: string,
  fuelType?: string | null,
): string {
  switch (powertrainType) {
    case "ICE":
      return fuelType ? (FUEL_TYPE_LABEL[fuelType] ?? "สันดาป") : "สันดาป";
    case "MHEV":
      return "มายด์ไฮบริด";
    case "HEV":
      return "ไฮบริด";
    case "PHEV":
      return "ปลั๊กอินไฮบริด";
    case "BEV":
      return "EV";
    case "FCEV":
      return "ไฮโดรเจน";
    default:
      return powertrainType;
  }
}
