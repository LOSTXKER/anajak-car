"use client";

import { useEffect, useRef, useState } from "react";

// บรรทัด 2 พิมพ์วนเปลี่ยนไปเรื่อยๆ (เบสขอ) — ฮุค "เช็กก่อนซื้อ" คงที่ · เฉพาะคำท้ายวน+เป็น accent
// evidence-first: ทุกวลีคือคุณค่าจริงของ CARMETA (ราคาป้าย/สเปกลึก/ประวัติ/แหล่งอ้างอิง/ไม่เดา)
const PHRASES = [
  "ราคาป้ายทางการทุกรุ่น",
  "สเปกลึกถึงรุ่นย่อย",
  "ไทม์ไลน์ราคาย้อนหลัง",
  "แหล่งอ้างอิงที่เปิดดูได้",
  "ข้อมูลที่ไม่ต้องเดา",
];

export function HeroHeadline() {
  const [text, setText] = useState(PHRASES[0]);
  const [typing, setTyping] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    // เคารพ reduced-motion — แสดงวลีแรกนิ่งๆ ไม่วน
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let i = 0;
    let j = 0;
    let deleting = false;

    const rand = (base: number) => base + Math.floor(Math.random() * 50) - 25;

    const tick = () => {
      const w = PHRASES[i];
      setText(w.slice(0, j));
      if (!deleting) {
        setTyping(true);
        j++;
        if (j > w.length) {
          setTyping(false);
          deleting = true;
          timer.current = setTimeout(tick, 1650);
          return;
        }
        timer.current = setTimeout(tick, rand(60));
      } else {
        setTyping(true);
        j--;
        if (j < 0) {
          deleting = false;
          j = 0;
          i = (i + 1) % PHRASES.length;
          timer.current = setTimeout(tick, 360);
          return;
        }
        timer.current = setTimeout(tick, 30);
      }
    };

    timer.current = setTimeout(tick, 750);
    return () => clearTimeout(timer.current);
  }, []);

  return (
    <h1
      className="mx-auto mt-4 max-w-3xl text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl"
      aria-label="เช็กก่อนซื้อ ด้วยข้อมูลรถที่ตรวจสอบได้"
    >
      <span className="block">เช็กก่อนซื้อ</span>
      <span className="block min-h-[1.2em]">
        <span>ด้วย</span>
        <span className="text-accent" aria-hidden>
          {text}
        </span>
        <span
          aria-hidden
          className="ml-0.5 inline-block h-[0.86em] w-[3px] translate-y-[2px] rounded-[1px] bg-accent align-middle"
          style={{ animation: typing ? "none" : "caret-blink 1.06s step-end infinite" }}
        />
      </span>
      <span className="sr-only">
        ด้วยราคาป้ายทางการ สเปกรายรุ่นย่อย และแหล่งอ้างอิงที่ตรวจสอบได้
      </span>
    </h1>
  );
}
