// หน้าจอเดี่ยวของหน้าลอง — เปิดเต็มจอได้ และเป็นตัวที่หน้าเทียบ (/proto/redesign-2026) โหลดเข้ากรอบ
// เป็น server component: ได้ HTML จริงเหมือนหน้าเว็บจริง (ทิศไหนต้องกดเล่นได้ ใช้ client component ย่อยข้างใน)
import { CurrentHome, CurrentModel, CurrentSku } from "../_screens/current";
import { FilterHome, FilterModel, FilterSku } from "../_screens/filter";
import { AnswerHome, AnswerModel, AnswerSku } from "../_screens/answer";
import { GuideHome, GuideModel, GuideSku } from "../_screens/guide";
import { DIRS, type Dir, type Screen } from "../_screens/kit";

type Props = { searchParams: Promise<{ v?: string; s?: string; thin?: string }> };

const DIR_VALUES = DIRS.map((d) => d.value);
const SCREEN_VALUES: Screen[] = ["home", "model", "sku"];

export default async function ProtoViewPage({ searchParams }: Props) {
  const sp = await searchParams;
  const dir = (DIR_VALUES.includes(sp.v as Dir) ? sp.v : "current") as Dir;
  const screen = (SCREEN_VALUES.includes(sp.s as Screen) ? sp.s : "home") as Screen;
  const thin = sp.thin === "1";

  const map: Record<Dir, Record<Screen, React.ReactNode>> = {
    current: {
      home: <CurrentHome thin={thin} />,
      model: <CurrentModel thin={thin} />,
      sku: <CurrentSku thin={thin} />,
    },
    filter: {
      home: <FilterHome thin={thin} />,
      model: <FilterModel thin={thin} />,
      sku: <FilterSku thin={thin} />,
    },
    answer: {
      home: <AnswerHome thin={thin} />,
      model: <AnswerModel thin={thin} />,
      sku: <AnswerSku thin={thin} />,
    },
    guide: {
      home: <GuideHome thin={thin} />,
      model: <GuideModel thin={thin} />,
      sku: <GuideSku thin={thin} />,
    },
  };

  return map[dir][screen];
}
