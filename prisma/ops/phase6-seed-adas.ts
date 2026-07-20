// Phase 6 (VOCABULARY.md Phase 4 ต่อ): seed ADAS 3 ฟีเจอร์แรก (AEB/ACC/LKA) จากสเปกทางการต่อ grade
// ข้อมูล: prisma/ops/data/adas-classified-20260720.json (fetch จาก /model/api/car/ ทางการ 2026-07-20)
//
// กติกา (VOCABULARY.md §4):
//  - insert เฉพาะค่า known: สเปกระบุ "มี/รายละเอียด" = true · ระบุ "ไม่มี"/"-" = false (fact เชิงลบมีหลักฐาน)
//  - สเปกไม่มีแถวฟีเจอร์นั้นเลย (เช่น Fortuner ไม่มีแถว PCS) = unknown → ไม่ insert
//  - Cruise "มี" เฉยๆ ไม่ระบุ radar/adaptive = unknown (ครูซธรรมดา ≠ ACC — ห้ามเดา)
//  - ระดับ trim: บันทึกเมื่อทุก variant ที่จับคู่ได้ใน trim เป็น known และค่าตรงกันเท่านั้น
//  - จับคู่ grade → variant ด้วย gradeCode เป็นหลัก · fallback: (nameplate + ราคาตรง) · จับคู่ไม่ได้ = ข้าม + รายงาน
//
// รัน: npx tsx prisma/ops/phase6-seed-adas.ts --dry (ดูผลก่อน) · ไม่มี --dry = เขียนจริง
import "dotenv/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { prisma } from "../../src/lib/prisma";

const DRY = process.argv.includes("--dry");
const TODAY = new Date("2026-07-20");

type FeatKey = "AEB" | "ACC" | "LKA";
type GradeFeat = { present: boolean | null; title: string; value: string } | undefined;
type ClassifiedGrade = {
  grade_code: string | null;
  title: string;
  price: number | null;
  features: Partial<Record<FeatKey, NonNullable<GradeFeat>>>;
};
type Classified = Record<string, { series_title: string; grades: ClassifiedGrade[] }>;

const DATA: Classified = JSON.parse(
  readFileSync(join(__dirname, "data", "adas-classified-20260720.json"), "utf8"),
);

const SERIES_TO_SLUG: Record<string, string> = {
  bz4x: "bz4x",
  altis: "corolla-altis",
  altis_grsport: "corolla-altis",
  yarisativ: "yaris-ativ",
  yarisativ_nightshade: "yaris-ativ",
  yarisativ_grsport: "yaris-ativ",
  fortuner_leader: "fortuner",
  fortuner_legender: "fortuner",
  fortuner_grsport: "fortuner",
  hilux_travo_standard_4trex: "hilux-travo",
  hilux_travo_prerunner_4trex: "hilux-travo",
  hilux_travo_overland: "hilux-travo",
  hilux_travo_e: "hilux-travo",
  hilux_champ: "hilux-champ",
  hilux_revo_standard: "hilux-revo",
  hilux_revo_zedition: "hilux-revo",
};

const FEATURES: { key: FeatKey; category: "AEB" | "ACC" | "LKA"; th: string; en: string; def: string }[] = [
  {
    key: "AEB", category: "AEB",
    th: "เบรกฉุกเฉินอัตโนมัติ", en: "Autonomous Emergency Braking (AEB)",
    def: "ระบบเบรกให้อัตโนมัติเมื่อเสี่ยงชน — ต้อง 'เบรกให้จริง' ไม่ใช่แค่เตือน (แยกจาก FCW ที่เตือนอย่างเดียว)",
  },
  {
    key: "ACC", category: "ACC",
    th: "ครูซคอนโทรลแปรผัน", en: "Adaptive Cruise Control (ACC)",
    def: "รักษาความเร็วและระยะห่างจากคันหน้าอัตโนมัติ — ครูซธรรมดาที่ตั้งความเร็วคงที่ไม่นับเป็น ACC",
  },
  {
    key: "LKA", category: "LKA",
    th: "ช่วยประคองรถให้อยู่ในเลน", en: "Lane Keeping/Tracing Assist (LKA)",
    def: "ช่วยหมุนพวงมาลัยประคองรถให้อยู่ในเลน — ไม่ใช่แค่เตือนเมื่อออกนอกเลน (แยกจาก LDW/LDA)",
  },
];

async function main() {
  // ── Feature master 3 แถว ──
  const featureIds = new Map<FeatKey, string>();
  for (const f of FEATURES) {
    let row = await prisma.feature.findFirst({ where: { category: f.category } });
    if (!row && !DRY) {
      row = await prisma.feature.create({
        data: { category: f.category, canonicalNameTh: f.th, canonicalNameEn: f.en, definition: f.def },
      });
    }
    if (row) featureIds.set(f.key, row.id);
    console.log(`feature ${f.key}: ${row ? row.id.slice(-6) : "(dry — จะสร้าง)"}`);
  }

  // ── EvidenceSource ต่อ series (reuse 3 แถวของ hilux lines จาก M15 — URL/วันที่เดียวกัน) ──
  const seriesEvidence = new Map<string, string>();
  for (const [code, series] of Object.entries(DATA)) {
    const docRef = `API: /model/api/car/?series_code=${code} + /api-service/car/series (version 739)`;
    let ev = await prisma.evidenceSource.findFirst({ where: { documentRef: docRef } });
    if (!ev) {
      const altRef = `API: /model/api/car/?series_code=${code}`;
      ev = await prisma.evidenceSource.findFirst({ where: { documentRef: { contains: `series_code=${code} ` } } })
        ?? await prisma.evidenceSource.findFirst({ where: { documentRef: altRef } });
    }
    if (!ev && !DRY) {
      ev = await prisma.evidenceSource.create({
        data: {
          sourceType: "MANUFACTURER_OFFICIAL",
          publisher: "Toyota Motor Thailand",
          title: `${series.series_title} — ตารางสเปกทางการต่อรุ่นย่อย (รวมระบบความปลอดภัย)`,
          url: `https://www.toyota.co.th/model/${code}/grade`,
          documentRef: `API: /model/api/car/?series_code=${code}`,
          checkedDate: TODAY,
          checkedBy: "AI session (fetch สดจาก API ทางการ 2026-07-20)",
          confidence: "HIGH",
          notes: `แถวระบบความปลอดภัย (PCS/Cruise/LTA·LKC) ระบุค่า มี/ไม่มี ต่อ grade ชัดเจน · ข้อมูล classify แล้วเก็บที่ prisma/ops/data/adas-classified-20260720.json`,
        },
      });
    }
    if (ev) seriesEvidence.set(code, ev.id);
    console.log(`evidence ${code}: ${ev ? `reuse/สร้าง ${ev.id.slice(-6)}` : "(dry — จะสร้าง)"}`);
  }

  // ── จับคู่ grade → variant → trim ──
  const variants = await prisma.variantRevision.findMany({
    include: {
      trim: { include: { phase: { include: { derivative: { include: { generation: { include: { nameplate: true } } } } } } } },
      officialPriceObservations: { orderBy: { observedDate: "desc" }, take: 1 },
    },
  });

  type TrimAgg = Map<string, { seriesCode: string; values: (boolean | null)[]; marketing: string[]; notes: string[] }>;
  const perFeatureTrim: Record<FeatKey, TrimAgg> = { AEB: new Map(), ACC: new Map(), LKA: new Map() };
  let matched = 0;
  const unmatched: string[] = [];

  for (const [code, series] of Object.entries(DATA)) {
    const slug = SERIES_TO_SLUG[code];
    for (const g of series.grades) {
      // จับคู่: gradeCode ก่อน → fallback ราคา+nameplate
      let v = g.grade_code
        ? variants.find((x) => x.gradeCode === g.grade_code && x.trim.phase.derivative.generation.nameplate.slug === slug)
        : undefined;
      if (!v && g.price != null) {
        const priceMatches = variants.filter(
          (x) =>
            x.trim.phase.derivative.generation.nameplate.slug === slug &&
            x.officialPriceObservations[0] &&
            Number(x.officialPriceObservations[0].amount) === g.price,
        );
        if (priceMatches.length === 1) v = priceMatches[0];
      }
      if (!v) {
        unmatched.push(`${code} · ${g.title} (${g.grade_code ?? "no-code"})`);
        continue;
      }
      matched++;
      for (const f of FEATURES) {
        const feat = g.features[f.key];
        if (!feat) continue; // ไม่มีแถวในสเปก = unknown → ข้าม
        const agg = perFeatureTrim[f.key];
        if (!agg.has(v.trimId)) agg.set(v.trimId, { seriesCode: code, values: [], marketing: [], notes: [] });
        const a = agg.get(v.trimId)!;
        a.values.push(feat.present);
        if (feat.present) {
          a.marketing.push(feat.value && feat.value !== "มี" ? `${feat.title}: ${feat.value}` : feat.title);
        }
        a.notes.push(`${g.title}: "${feat.title}" = "${feat.value}"`);
      }
    }
  }
  console.log(`\nจับคู่ variant ได้ ${matched} · ไม่ได้ ${unmatched.length}`);
  for (const u of unmatched) console.log("  ✗", u);

  // ── สร้าง TrimFeature (เฉพาาะ known ตรงกันทั้ง trim) ──
  let created = 0, skippedMixed = 0;
  for (const f of FEATURES) {
    for (const [trimId, a] of perFeatureTrim[f.key]) {
      const allKnown = a.values.every((x) => x !== null);
      const allSame = new Set(a.values.map(String)).size === 1;
      if (!allKnown || !allSame) {
        skippedMixed++;
        console.log(`  ~ ${f.key} trim ${trimId.slice(-6)}: ค่าไม่ known ครบ/ไม่ตรงกัน [${a.values.join(",")}] → ข้าม (unknown)`);
        continue;
      }
      const has = a.values[0] as boolean;
      const marketingName = a.marketing[0]?.slice(0, 180) ?? null;
      if (!DRY) {
        const featureId = featureIds.get(f.key)!;
        const exists = await prisma.trimFeature.findFirst({ where: { trimId, featureId, effectiveFrom: null } });
        if (!exists) {
          const tf = await prisma.trimFeature.create({
            data: {
              trimId, featureId, status: "known", hasFeature: has,
              marketingName: has ? marketingName : null,
              operatingNote: a.notes[0]?.slice(0, 400) ?? null,
            },
          });
          await prisma.evidenceLink.create({
            data: {
              entityType: "TRIM_FEATURE", entityId: tf.id, field: "hasFeature",
              note: `สเปกทางการระบุต่อ grade: ${a.notes[0]?.slice(0, 200)}`,
              evidenceSourceId: seriesEvidence.get(a.seriesCode)!,
            },
          });
        }
      }
      created++;
    }
  }
  console.log(`\n${DRY ? "[DRY] จะ" : ""}สร้าง TrimFeature ${created} แถว (known) · ข้ามเพราะไม่ชัด ${skippedMixed}`);
  if (!DRY) {
    console.log("รวม:", {
      features: await prisma.feature.count(),
      trimFeatures: await prisma.trimFeature.count(),
      evidenceLinks: await prisma.evidenceLink.count(),
    });
  }
}
main().finally(() => prisma.$disconnect());
