"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ชิปหมวดใต้ช่องค้นหา — ค่าต้องตรงกับ filter จริงของ CarDatabaseExplorer เท่านั้น
// (body = BodyType enum · pt = powertrainLabel canonical · cap = งบสูงสุดบาท)
const QUICK_FILTERS: { label: string; params: Record<string, string> }[] = [
  { label: "กระบะ", params: { body: "PICKUP" } },
  { label: "SUV", params: { body: "SUV" } },
  { label: "PPV", params: { body: "PPV" } },
  { label: "ซีดาน", params: { body: "SEDAN" } },
  { label: "รถไฟฟ้า", params: { pt: "EV" } },
  { label: "งบไม่เกิน 1 ล้าน", params: { cap: "1000000" } },
];

// ช่องค้นหาพระเอกของ hero — เขียนเงื่อนไขลง URL (?q=/&body=/&pt=/&cap=) แล้วเลื่อนลงตาราง
// CarDatabaseExplorer อ่าน param ชุดนี้มาตั้ง filter — state เดียวกัน ไม่มีสองระบบค้นหา
export function HeroSearch() {
  const router = useRouter();
  const [value, setValue] = useState("");

  function apply(params: Record<string, string>) {
    const sp = new URLSearchParams(params);
    router.replace(sp.size > 0 ? `/?${sp.toString()}` : "/", { scroll: false });
    document.getElementById("database")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <form
        role="search"
        aria-label="ค้นหารุ่นรถ"
        className="flex items-center gap-2 rounded-full border border-border-strong bg-surface py-2 pr-2 pl-5 shadow-[0_10px_30px_-16px_rgba(20,30,60,0.28)] transition-[border-color,box-shadow] hover:border-faint focus-within:border-accent focus-within:shadow-[0_0_0_4px_var(--accent-soft)]"
        onSubmit={(e) => {
          e.preventDefault();
          apply(value.trim() ? { q: value.trim() } : {});
        }}
      >
        <span aria-hidden className="text-lg text-faint">
          ⌕
        </span>
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="ค้นหารุ่นรถ เช่น Hilux, Corolla Altis, bZ4X…"
          className="w-full bg-transparent py-1.5 text-[15px] outline-none placeholder:text-faint"
        />
        <button
          type="submit"
          className="shrink-0 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          ค้นหา
        </button>
      </form>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        {QUICK_FILTERS.map((f) => (
          <button
            key={f.label}
            type="button"
            onClick={() => apply(f.params)}
            className="rounded-full bg-surface-muted px-3.5 py-1.5 text-[13px] text-muted transition-colors hover:bg-accent-soft hover:text-accent"
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
