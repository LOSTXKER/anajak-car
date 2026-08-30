// หน้าจอเดี่ยวของหน้าลอง "แบรนด์เป็นทางเข้า" — เปิดเต็มจอได้ และเป็นตัวที่หน้าเทียบโหลดเข้ากรอบ
import "../../look-2026/looks.css"; // คลาสร่วม .lk-* + ธีม blueprint
import "../looks.css"; // ธีม analytics + ชิ้นส่วน dashboard

import { CurrentHome, CurrentModel, CurrentSku } from "../../redesign-2026/_screens/current";
import { CurrentBrand } from "../_looks/current-brand";
import { AnalyticsHome, AnalyticsBrand, AnalyticsModel, AnalyticsSku } from "../_looks/analytics";
import {
  BlueprintHome,
  BlueprintBrand,
  BlueprintModel,
  BlueprintSku,
} from "../_looks/blueprint";
import { LOOKS, type Look, type Screen } from "../_looks/kit";

type Props = { searchParams: Promise<{ v?: string; s?: string; thin?: string }> };

const LOOK_VALUES = LOOKS.map((l) => l.value);
const SCREEN_VALUES: Screen[] = ["home", "brand", "model", "sku"];

export default async function BrandFirstViewPage({ searchParams }: Props) {
  const sp = await searchParams;
  const look = (LOOK_VALUES.includes(sp.v as Look) ? sp.v : "analytics") as Look;
  const screen = (SCREEN_VALUES.includes(sp.s as Screen) ? sp.s : "home") as Screen;
  const thin = sp.thin === "1";

  const map: Record<Look, Record<Screen, React.ReactNode>> = {
    current: {
      home: <CurrentHome thin={thin} />,
      brand: <CurrentBrand thin={thin} />,
      model: <CurrentModel thin={thin} />,
      sku: <CurrentSku thin={thin} />,
    },
    analytics: {
      home: <AnalyticsHome thin={thin} />,
      brand: <AnalyticsBrand thin={thin} />,
      model: <AnalyticsModel thin={thin} />,
      sku: <AnalyticsSku thin={thin} />,
    },
    blueprint: {
      home: <BlueprintHome thin={thin} />,
      brand: <BlueprintBrand thin={thin} />,
      model: <BlueprintModel thin={thin} />,
      sku: <BlueprintSku thin={thin} />,
    },
  };

  return map[look][screen];
}
