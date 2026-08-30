// หน้าจอเดี่ยวของหน้าลอง "หน้าตา" — เปิดเต็มจอได้ และเป็นตัวที่หน้าเทียบโหลดเข้ากรอบ
import "../looks.css";

import { CurrentHome, CurrentModel, CurrentSku } from "../../redesign-2026/_screens/current";
import { MetaHome, MetaModel, MetaSku } from "../_looks/meta";
import { PitHome, PitModel, PitSku } from "../_looks/pit";
import { BlueprintHome, BlueprintModel, BlueprintSku } from "../_looks/blueprint";
import { LOOKS, type Look, type Screen } from "../_looks/kit";

type Props = { searchParams: Promise<{ v?: string; s?: string; thin?: string }> };

const LOOK_VALUES = LOOKS.map((l) => l.value);
const SCREEN_VALUES: Screen[] = ["home", "model", "sku"];

export default async function LookViewPage({ searchParams }: Props) {
  const sp = await searchParams;
  const look = (LOOK_VALUES.includes(sp.v as Look) ? sp.v : "meta") as Look;
  const screen = (SCREEN_VALUES.includes(sp.s as Screen) ? sp.s : "home") as Screen;
  const thin = sp.thin === "1";

  const map: Record<Look, Record<Screen, React.ReactNode>> = {
    // "ปัจจุบัน" = หน้าเดียวกับหน้าลองรอบก่อน (ตัวตั้งไว้เทียบ ไม่ได้ทำใหม่)
    current: {
      home: <CurrentHome thin={thin} />,
      model: <CurrentModel thin={thin} />,
      sku: <CurrentSku thin={thin} />,
    },
    meta: {
      home: <MetaHome thin={thin} />,
      model: <MetaModel thin={thin} />,
      sku: <MetaSku thin={thin} />,
    },
    pit: {
      home: <PitHome thin={thin} />,
      model: <PitModel thin={thin} />,
      sku: <PitSku thin={thin} />,
    },
    blueprint: {
      home: <BlueprintHome thin={thin} />,
      model: <BlueprintModel thin={thin} />,
      sku: <BlueprintSku thin={thin} />,
    },
  };

  return map[look][screen];
}
