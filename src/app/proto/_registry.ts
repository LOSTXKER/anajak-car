// ทะเบียนหน้าลอง — หน้ารวม /proto อ่านจากไฟล์นี้
export type ProtoStatus = "รอเคาะ" | "เคาะแล้ว" | "พับ" | "เก็บอ้างอิง";

export type ProtoEntry = {
  slug: string;
  title: string;
  /** คำถามที่ต้องเคาะ 1 ประโยค — อ่านแล้วรู้ทันทีว่าเปิดเข้าไปเพื่อตัดสินอะไร */
  question: string;
  date: string;
  status: ProtoStatus;
  verdict?: string;
};

export const PROTOS: ProtoEntry[] = [
  {
    slug: "redesign-2026",
    title: "รื้อ UX/UI ทั้งเว็บ — เลือกทิศ",
    question: "คนเข้าเว็บ CARMETA ควรเดินยังไงถึงได้คำตอบเร็วที่สุด และหน้าตาแบบไหนที่ใช้ง่ายจริง",
    date: "2026-08-30",
    status: "รอเคาะ",
  },
];
