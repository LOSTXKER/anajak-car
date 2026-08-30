"use client";

// ทิศ A — ตารางรุ่นย่อยที่ "กรองได้" ในหน้ารุ่น (18 แถวในตารางเดียว ไม่แยกการ์ดต่อตัวถัง)
// เพราะโจทย์จริงของคนดูกระบะคือ "ตัดตัวเลือกทิ้ง" (เอาเฉพาะ 4 ประตู เกียร์ออโต้ มี AEB) ไม่ใช่ไล่อ่านทีละกลุ่ม
import { useMemo, useState } from "react";

import { formatTHB } from "@/lib/format";
import { ptDotClass } from "@/components/badges";

import { HILUX_MIN, HILUX_SKUS } from "../../_kit/data";
import { ProtoLink } from "./kit";

const GROUPS = ["ทุกตัวถัง", "Travo Standard Cab", "Travo Smart Cab", "Travo Double Cab", "Travo Double Cab (ไฟฟ้า)"];
const GEARS = ["ทุกเกียร์", "อัตโนมัติ", "ธรรมดา"];
const DRIVES = ["ทุกระบบขับ", "ขับหลัง", "4WD", "AWD"];

export function FilterSkuTable() {
  const [group, setGroup] = useState(GROUPS[0]);
  const [gear, setGear] = useState(GEARS[0]);
  const [drive, setDrive] = useState(DRIVES[0]);
  const [adasOnly, setAdasOnly] = useState(false);
  const [asc, setAsc] = useState(true);

  const rows = useMemo(() => {
    const list = HILUX_SKUS.filter((s) => {
      if (group !== GROUPS[0] && s.group !== group) return false;
      if (gear === "อัตโนมัติ" && !s.transmission.includes("อัตโนมัติ") && !s.transmission.includes("เกียร์เดียว"))
        return false;
      if (gear === "ธรรมดา" && !s.transmission.includes("ธรรมดา")) return false;
      if (drive !== DRIVES[0] && s.drivetrain !== drive) return false;
      if (adasOnly && s.adas.aeb !== true) return false;
      return true;
    });
    return [...list].sort((a, b) => ((a.price ?? 0) - (b.price ?? 0)) * (asc ? 1 : -1));
  }, [group, gear, drive, adasOnly, asc]);

  return (
    <section className="mt-6">
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-surface-muted/40 px-3 py-2.5">
        <Select label="ตัวถัง" value={group} onChange={setGroup} options={GROUPS} />
        <Select label="เกียร์" value={gear} onChange={setGear} options={GEARS} />
        <Select label="ระบบขับ" value={drive} onChange={setDrive} options={DRIVES} />
        <button
          type="button"
          onClick={() => setAdasOnly((v) => !v)}
          className={`rounded-full px-3 py-1.5 text-[13px] transition-colors ${
            adasOnly ? "bg-accent text-background" : "bg-surface-muted text-muted hover:text-foreground"
          }`}
        >
          เฉพาะรุ่นที่ยืนยันว่ามีเบรกฉุกเฉิน (AEB)
        </button>
        <span className="ml-auto text-[13px] text-faint tnum">
          {rows.length}/{HILUX_SKUS.length} รุ่นย่อย
        </span>
      </div>

      {rows.length === 0 ? (
        <p className="py-14 text-center text-sm text-muted">
          ไม่มีรุ่นย่อยที่ตรงเงื่อนไขนี้ — ลองปลดตัวกรองบางอัน
        </p>
      ) : (
        <>
          {/* desktop */}
          <div className="mt-3 hidden overflow-x-auto rounded-2xl border border-border sm:block">
            <table className="w-full min-w-[860px] text-sm">
              <thead className="bg-surface-muted/60">
                <tr className="border-b border-border text-left text-[12px] text-faint">
                  <th className="py-2.5 pr-3 pl-4 font-medium">รุ่นย่อย</th>
                  <th className="px-3 py-2.5 font-medium">ตัวถัง</th>
                  <th className="px-3 py-2.5 font-medium">ขุมพลัง · กำลัง</th>
                  <th className="px-3 py-2.5 font-medium">เกียร์ · ขับ</th>
                  <th className="px-3 py-2.5 text-center font-medium" title="เบรกฉุกเฉิน / ครูซคุมระยะ / ช่วยคุมเลน">
                    AEB · ACC · LKA
                  </th>
                  <th className="px-3 py-2.5 text-right font-medium">
                    <button type="button" onClick={() => setAsc((v) => !v)} className="hover:text-foreground">
                      ราคาป้าย <span className="text-accent">{asc ? "↑" : "↓"}</span>
                    </button>
                  </th>
                  <th className="px-3 py-2.5 text-right font-medium">Δ ถูกสุด</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((v, i) => (
                  <tr
                    key={v.key}
                    className={`group relative border-b border-border last:border-b-0 hover:bg-accent-soft ${i % 2 ? "bg-surface-muted/30" : ""}`}
                  >
                    <td className="py-2 pr-3 pl-4 font-medium">
                      <ProtoLink
                        dir="filter"
                        screen="sku"
                        thin={false}
                        className="after:absolute after:inset-0 group-hover:text-accent"
                      >
                        {v.shortName}
                      </ProtoLink>
                    </td>
                    <td className="px-3 py-2 text-[13px] text-muted">{v.group.replace("Travo ", "")}</td>
                    <td className="px-3 py-2 text-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <span aria-hidden className={`inline-block size-2 rounded-full ${ptDotClass(v.powertrainText)}`} />
                        {v.powertrainText} · {v.powerText}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-muted">
                      {v.transmission.replace(" 6 สปีด", " 6 สป.")} · {v.drivetrain}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <AdasCells adas={v.adas} />
                    </td>
                    <td className="px-3 py-2 text-right font-semibold tnum">{formatTHB(v.price!)}</td>
                    <td className="px-3 py-2 text-right text-[13px] tnum">
                      {v.price === HILUX_MIN ? (
                        <span className="text-success">ถูกสุด</span>
                      ) : (
                        <span className="text-muted">+{formatTHB(v.price! - HILUX_MIN)}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* mobile */}
          <div className="mt-3 space-y-2 sm:hidden">
            {rows.map((v) => (
              <ProtoLink
                key={v.key}
                dir="filter"
                screen="sku"
                thin={false}
                className="flex items-start gap-3 rounded-xl border border-border bg-surface px-3 py-2.5 active:bg-accent-soft"
              >
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{v.shortName}</span>
                  <span className="mt-0.5 block text-[12px] text-faint">
                    {v.group.replace("Travo ", "")} · {v.transmission} · {v.drivetrain}
                  </span>
                  <span className="mt-1 flex items-center gap-1.5 text-[11px] text-faint">
                    ช่วยขับขี่
                    <AdasCells adas={v.adas} labelled />
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block font-semibold tnum">{formatTHB(v.price!)}</span>
                  <span className="block text-[11px] tnum">
                    {v.price === HILUX_MIN ? (
                      <span className="text-success">ถูกสุด</span>
                    ) : (
                      <span className="text-faint">+{formatTHB(v.price! - HILUX_MIN)}</span>
                    )}
                  </span>
                </span>
              </ProtoLink>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="flex items-center gap-1.5 text-[13px] text-muted">
      <span className="text-[11px] text-faint">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`cursor-pointer rounded-full px-3 py-1.5 text-[13px] outline-none ${
          value === options[0] ? "bg-surface-muted text-muted" : "bg-accent-soft font-medium text-accent"
        }`}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

/** ✓ / – / ? ต่อฟีเจอร์ — "?" คือสเปกทางการไม่ระบุ ไม่ใช่ "ไม่มี" (กฎ evidence-first) */
function AdasCells({
  adas,
  labelled = false,
}: {
  adas: { aeb: boolean | null; acc: boolean | null; lka: boolean | null };
  /** จอแคบไม่มีหัวคอลัมน์ให้อ่าน — ต้องพิมพ์ชื่อย่อคู่สัญลักษณ์ */
  labelled?: boolean;
}) {
  const cell = (v: boolean | null, name: string, short: string) => (
    <span
      key={name}
      title={`${name}: ${v === true ? "มี" : v === false ? "ไม่มี" : "สเปกทางการไม่ระบุ"}`}
      className={`inline-flex justify-center gap-0.5 text-[13px] ${labelled ? "" : "w-8"} ${
        v === true ? "font-semibold text-success" : v === false ? "text-faint" : "text-warning"
      }`}
    >
      {labelled && <span>{short}</span>}
      {v === true ? "✓" : v === false ? "–" : "?"}
      <span className="sr-only">
        {name}: {v === true ? "มี" : v === false ? "ไม่มี" : "สเปกทางการไม่ระบุ"}
      </span>
    </span>
  );
  return (
    <span className={`inline-flex ${labelled ? "gap-2" : ""}`}>
      {cell(adas.aeb, "เบรกฉุกเฉิน AEB", "AEB")}
      {cell(adas.acc, "ครูซคุมระยะ ACC", "ACC")}
      {cell(adas.lka, "ช่วยคุมเลน LKA", "LKA")}
    </span>
  );
}
