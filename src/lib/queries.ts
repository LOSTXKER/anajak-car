// Data access ของหน้าเว็บ — query ผ่าน prisma singleton แล้ว map เป็น DTO ล้วน
// (string/number/null เท่านั้น) ก่อนส่งเข้า client component

import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { ASPIRATION_LABEL, FUEL_TYPE_LABEL, powertrainLabel } from "@/lib/labels";
import { generationKey, derivativeKey, trimKey, variantKey, dedupeKeys } from "@/lib/slugs";

export type ConfidenceLevel = "HIGH" | "MEDIUM" | "LOW";

export type NameplateRow = {
  slug: string;
  name: string;
  brand: string;
  brandSlug: string; // ใช้หาโลโก้แบรนด์ในตาราง (BRAND_LOGO registry)
  segment: string | null;
  lifecycleStatus: string;
  generationCode: string | null;
  launchYear: number | null;
  bodyTypes: string[];
  powertrainLabels: string[];
  priceMin: number | null;
  priceMax: number | null;
  variantCount: number;
  pricedVariantCount: number;
  sourceCount: number;
  latestChecked: string | null;
  confidence: ConfidenceLevel | null;
};

export type DatabaseIndex = {
  rows: NameplateRow[];
  variantRows: VariantIndexRow[];
  stats: {
    nameplates: number;
    variants: number;
    prices: number;
    sources: number;
    latestChecked: string | null;
  };
};

export type EvidenceRef = {
  url: string | null;
  publisher: string | null;
  sourceType: string;
  confidence: ConfidenceLevel;
  checkedDate: string | null;
};

// สเปกเสริม (BEV/รหัสเกรด) — known เท่านั้น (ไม่มี = null · ไม่โชว์เลขปลอม)
export type VariantSpecExtras = {
  gradeCode: string | null;
  motorKw: number | null;
  batteryKwh: number | null;
  rangeKm: number | null;
  rangeStandard: string | null; // WLTP/NEDC/CLTC — มาตรฐานวัด (ห้ามแปลงข้าม)
  acKw: number | null;
  dcKw: number | null;
};

export type VariantRow = {
  id: string;
  name: string;
  trimName: string;
  powertrainType: string;
  powertrainText: string;
  engineText: string | null;
  powerText: string | null;
  transmissionText: string | null;
  drivetrain: string | null;
  seatCount: number | null;
  price: number | null;
  priceAsOf: string | null;
  evidence: EvidenceRef | null;
} & VariantSpecExtras;

export type VariantGroup = {
  key: string;
  label: string;
  bodyType: string;
  rows: VariantRow[];
};

// ระบบช่วยขับขี่ (ADAS) ต่อ trim — จาก TrimFeature (VOCABULARY.md Phase 4)
// has: true=มี · false=ไม่มี (สเปกทางการระบุชัด) · null=ยังไม่ยืนยัน (สเปกไม่ระบุ)
export type AdasFeatureCol = {
  key: string;
  nameTh: string;
  nameEn: string;
  definition: string | null;
};
export type AdasTrimRow = {
  label: string; // ชื่อ trim (+ชื่อตัวถังเมื่อชื่อซ้ำข้ามแค็บ)
  values: { key: string; has: boolean | null; marketing: string | null }[];
};
export type AdasSection = {
  features: AdasFeatureCol[];
  trims: AdasTrimRow[];
} | null;

export type ChangeEventRow = {
  id: string;
  changeType: string;
  title: string;
  summary: string | null;
  beforeValue: string | null;
  afterValue: string | null;
  effectiveDate: string | null;
  evidence: EvidenceRef | null;
};

export type SourceRow = {
  id: string;
  publisher: string | null;
  title: string | null;
  url: string | null;
  sourceType: string;
  confidence: ConfidenceLevel;
  publishedDate: string | null;
  checkedDate: string | null;
};

export type NameplateDetail = {
  slug: string;
  name: string;
  brand: string;
  brandSlug: string;
  segment: string | null;
  lifecycleStatus: string;
  summary: string | null;
  generationCode: string | null;
  generationName: string | null;
  launchYear: number | null;
  generationSummary: string | null;
  priceMin: number | null;
  priceMax: number | null;
  latestChecked: string | null;
  groups: VariantGroup[];
  adas: AdasSection;
  changeEvents: ChangeEventRow[];
  sources: SourceRow[];
};

const CONFIDENCE_ORDER: Record<ConfidenceLevel, number> = {
  LOW: 0,
  MEDIUM: 1,
  HIGH: 2,
};

const nameplateInclude = {
  marketPresence: { include: { brand: true } },
  generations: {
    orderBy: { launchYear: { sort: "desc" as const, nulls: "last" as const } },
    include: {
      derivatives: {
        include: {
          phases: {
            include: {
              trims: {
                orderBy: { name: "asc" as const },
                include: {
                  variantRevisions: {
                    include: {
                      engine: true,
                      motor: true,
                      battery: true,
                      transmission: true,
                      drivetrain: true,
                      officialPriceObservations: {
                        where: { priceType: "OFFICIAL_LIST_PRICE" as const },
                        orderBy: { observedDate: "desc" as const },
                        include: { evidenceSource: true },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
} satisfies NonNullable<Parameters<typeof prisma.nameplate.findMany>[0]>["include"];

type NameplateWithTree = NonNullable<
  Awaited<ReturnType<typeof prisma.nameplate.findFirst<{ include: typeof nameplateInclude }>>>
>;

type FlatVariant = {
  variant: NameplateWithTree["generations"][number]["derivatives"][number]["phases"][number]["trims"][number]["variantRevisions"][number];
  trim: NameplateWithTree["generations"][number]["derivatives"][number]["phases"][number]["trims"][number];
  derivative: NameplateWithTree["generations"][number]["derivatives"][number];
};

// เฉพาะแถวที่ยัง effective อยู่ (effectiveTo = null) — กันรวม revision อดีตเข้ากับไลน์อัปปัจจุบัน
function flattenVariants(nameplate: NameplateWithTree): FlatVariant[] {
  return nameplate.generations.flatMap((generation) =>
    generation.derivatives.flatMap((derivative) =>
      derivative.phases
        .filter((phase) => phase.effectiveTo == null)
        .flatMap((phase) =>
          phase.trims
            .filter((trim) => trim.effectiveTo == null)
            .flatMap((trim) =>
              trim.variantRevisions
                .filter((variant) => variant.effectiveTo == null)
                .map((variant) => ({ variant, trim, derivative })),
            ),
        ),
    ),
  );
}

function latestPrice(flat: FlatVariant) {
  return flat.variant.officialPriceObservations[0] ?? null;
}

function worstConfidence(levels: ConfidenceLevel[]): ConfidenceLevel | null {
  if (levels.length === 0) return null;
  return levels.reduce((worst, level) =>
    CONFIDENCE_ORDER[level] < CONFIDENCE_ORDER[worst] ? level : worst,
  );
}

function maxDate(dates: (Date | null)[]): string | null {
  const times = dates.filter((d): d is Date => d != null).map((d) => d.getTime());
  if (times.length === 0) return null;
  return new Date(Math.max(...times)).toISOString();
}

// แปลงสเปก powertrain เป็นข้อความอ่านง่าย — ใช้ร่วมทั้งหน้า detail และมุมมองรุ่นย่อย
function describePowertrain(flat: FlatVariant): {
  engineText: string | null;
  powerText: string | null;
  transmissionText: string | null;
} {
  const engine = flat.variant.engine;
  const motor = flat.variant.motor;
  const battery = flat.variant.battery;
  const transmission = flat.variant.transmission;

  const engineParts: string[] = [];
  if (engine) {
    if (engine.displacementCc != null) {
      engineParts.push(`${(engine.displacementCc / 1000).toFixed(1)}L`);
    }
    // คำกลางเท่านั้นบนผิวหลัก (VOCABULARY.md §3) — ชื่อการตลาด (aspirationRaw) ต่อท้ายในวงเล็บ
    // เพราะ engineText ใช้เป็น tooltip (ข้อมูลรอง) เท่านั้น ไม่เข้า specLine
    if (engine.fuelType) {
      engineParts.push(FUEL_TYPE_LABEL[engine.fuelType] ?? engine.fuelType);
    }
    if (engine.aspiration && engine.aspiration !== "NA" && engine.aspiration !== "OTHER") {
      const aspLabel = ASPIRATION_LABEL[engine.aspiration] ?? engine.aspiration;
      engineParts.push(
        engine.aspirationRaw ? `${aspLabel} (${engine.aspirationRaw})` : aspLabel,
      );
    }
  }
  if (motor && flat.variant.powertrainType !== "ICE") {
    engineParts.push(
      motor.maxPowerKw != null ? `มอเตอร์ ${motor.maxPowerKw} kW` : "มอเตอร์ไฟฟ้า",
    );
  }
  if (battery?.capacityKwh != null) {
    engineParts.push(`แบต ${battery.capacityKwh} kWh`);
  }

  const powerParts: string[] = [];
  if (engine?.maxPowerPs != null) powerParts.push(`${engine.maxPowerPs} PS`);
  else if (motor?.maxPowerKw != null && flat.variant.powertrainType === "BEV") {
    powerParts.push(`${motor.maxPowerKw} kW`);
  }

  let transmissionText: string | null = null;
  if (transmission) {
    switch (transmission.type) {
      case "MANUAL":
        transmissionText = transmission.gears
          ? `ธรรมดา ${transmission.gears} สปีด`
          : "ธรรมดา";
        break;
      case "AUTOMATIC":
        transmissionText = transmission.gears
          ? `อัตโนมัติ ${transmission.gears} สปีด`
          : "อัตโนมัติ";
        break;
      case "CVT":
        transmissionText = "CVT";
        break;
      case "DCT":
        transmissionText = transmission.gears ? `DCT ${transmission.gears} สปีด` : "DCT";
        break;
      case "E_CVT_POWER_SPLIT":
      case "E_CVT_DIRECT_DRIVE":
        // คำกลางบนผิวหลักคือ "E-CVT" — กลไกที่ต่างกัน (power-split/direct-drive) อยู่ในข้อมูลรอง ไม่ยัดใส่ specLine
        transmissionText = "E-CVT";
        break;
      case "SINGLE_SPEED":
        transmissionText = "เกียร์เดียว (EV)";
        break;
      default:
        // คำกลางเท่านั้น — ห้าม fallback ไปที่ transmission.name (ชื่อการตลาด) เข้า specLine (VOCABULARY.md §3 ข้อ 2)
        transmissionText = transmission.type;
    }
  }

  return {
    engineText: engineParts.length ? engineParts.join(" ") : null,
    powerText: powerParts.length ? powerParts.join(" ") : null,
    transmissionText,
  };
}

// สเปกเสริม BEV/รหัสเกรด จาก variant — known เท่านั้น (range เลือกมาตรฐานเดียว ไม่แปลงข้าม)
function specExtras(flat: FlatVariant): VariantSpecExtras {
  const v = flat.variant;
  const range =
    v.rangeKmWltp != null ? { km: v.rangeKmWltp, std: "WLTP" }
    : v.rangeKmNedc != null ? { km: v.rangeKmNedc, std: "NEDC" }
    : v.rangeKmCltc != null ? { km: v.rangeKmCltc, std: "CLTC" }
    : null;
  return {
    gradeCode: v.gradeCode ?? null,
    motorKw: v.motor?.maxPowerKw ?? null,
    batteryKwh: v.battery?.capacityKwh ?? null,
    rangeKm: range?.km ?? null,
    rangeStandard: range?.std ?? null,
    acKw: v.battery?.acStatus === "known" ? v.battery.acMaxKw : null,
    dcKw: v.battery?.dcStatus === "known" ? v.battery.dcMaxKw : null,
  };
}

// หนึ่งแถวของ "มุมมองรุ่นย่อย" (ตารางแบบหุ้น — ทุกแถวมีราคาตัวเลขเดียว)
export type VariantIndexRow = {
  id: string;
  nameplateSlug: string;
  nameplateName: string;
  brand: string;
  name: string;
  trimName: string;
  derivativeName: string | null; // ชื่อตัวถัง เช่น "Travo Smart Cab" — ใช้แยกรุ่นย่อยชื่อซ้ำข้ามแค็บตอนกางในตารางรวม
  bodyType: string;
  lifecycleStatus: string;
  powertrainLabel: string;
  powerText: string | null;
  transmissionText: string | null;
  price: number | null;
  priceAsOf: string | null;
  confidence: ConfidenceLevel | null;
};

// สรุปหนึ่ง nameplate เป็นแถวของตาราง + แถวรุ่นย่อย + ตัวเลขประกอบสถิติ — ใช้ร่วมทั้งหน้าแรกและ Brand Hub
function buildNameplateSummary(nameplate: NameplateWithTree): {
  row: NameplateRow;
  variantRows: VariantIndexRow[];
  priceObsCount: number;
  checkedDates: Date[];
} {
  const flats = flattenVariants(nameplate);
  const priced = flats
    .map((flat) => ({ flat, obs: latestPrice(flat) }))
    .filter((x): x is typeof x & { obs: NonNullable<ReturnType<typeof latestPrice>> } =>
      Boolean(x.obs && x.obs.amount != null),
    );

  const amounts = priced.map((x) => Number(x.obs.amount));
  const sourceIds = new Set(priced.map((x) => x.obs.evidenceSourceId));
  const checkedDates = priced.map(
    (x) => x.obs.evidenceSource.checkedDate ?? x.obs.observedDate,
  );
  const confidences = priced.map((x) => x.obs.evidenceSource.confidence as ConfidenceLevel);
  const currentGeneration = nameplate.generations[0] ?? null;

  return {
    row: {
      slug: nameplate.slug,
      name: nameplate.name,
      brand: nameplate.marketPresence.brand.name,
      brandSlug: nameplate.marketPresence.brand.slug,
      segment: nameplate.segment,
      lifecycleStatus: nameplate.lifecycleStatus,
      generationCode: currentGeneration?.code ?? null,
      launchYear: currentGeneration?.launchYear ?? null,
      bodyTypes: [...new Set(flats.map((f) => f.derivative.bodyType as string))],
      powertrainLabels: [
        ...new Set(
          flats.map((f) =>
            powertrainLabel(f.variant.powertrainType, f.variant.engine?.fuelType),
          ),
        ),
      ],
      priceMin: amounts.length ? Math.min(...amounts) : null,
      priceMax: amounts.length ? Math.max(...amounts) : null,
      variantCount: flats.length,
      pricedVariantCount: priced.length,
      sourceCount: sourceIds.size,
      latestChecked: maxDate(checkedDates),
      confidence: worstConfidence(confidences),
    },
    variantRows: flats.map((flat) => {
      const obs = latestPrice(flat);
      const described = describePowertrain(flat);
      return {
        id: flat.variant.id,
        nameplateSlug: nameplate.slug,
        nameplateName: nameplate.name,
        brand: nameplate.marketPresence.brand.name,
        name: flat.variant.name ?? flat.trim.name,
        trimName: flat.trim.name,
        derivativeName: flat.derivative.name,
        bodyType: flat.derivative.bodyType,
        lifecycleStatus: nameplate.lifecycleStatus,
        powertrainLabel: powertrainLabel(
          flat.variant.powertrainType,
          flat.variant.engine?.fuelType,
        ),
        powerText: described.powerText,
        transmissionText: described.transmissionText,
        price: obs?.amount != null ? Number(obs.amount) : null,
        priceAsOf: obs ? (obs.effectiveFrom ?? obs.observedDate).toISOString() : null,
        confidence: obs ? (obs.evidenceSource.confidence as ConfidenceLevel) : null,
      };
    }),
    priceObsCount: flats.reduce(
      (n, flat) => n + flat.variant.officialPriceObservations.length,
      0,
    ),
    checkedDates,
  };
}

export async function getDatabaseIndex(): Promise<DatabaseIndex> {
  const [nameplates, totalSources] = await Promise.all([
    prisma.nameplate.findMany({
      orderBy: { name: "asc" },
      include: nameplateInclude,
    }),
    // นับแหล่งอ้างอิงทั้ง ledger (ราคา + change event + brand/generation) ไม่ใช่แค่ที่ผูกราคา
    prisma.evidenceSource.count(),
  ]);

  const summaries = nameplates.map(buildNameplateSummary);
  const rows = summaries.map((s) => s.row);
  const allChecked = summaries.flatMap((s) => s.checkedDates);

  return {
    rows,
    variantRows: summaries.flatMap((s) => s.variantRows),
    stats: {
      nameplates: nameplates.length,
      variants: rows.reduce((n, r) => n + r.variantCount, 0),
      prices: summaries.reduce((n, s) => n + s.priceObsCount, 0),
      sources: totalSources,
      latestChecked: maxDate(allChecked),
    },
  };
}

type EvidenceSourceRecord = NameplateWithTree["generations"][number]["derivatives"][number]["phases"][number]["trims"][number]["variantRevisions"][number]["officialPriceObservations"][number]["evidenceSource"];

function toEvidenceRef(source: EvidenceSourceRecord): EvidenceRef {
  return {
    url: source.url,
    publisher: source.publisher,
    sourceType: source.sourceType,
    confidence: source.confidence as ConfidenceLevel,
    checkedDate: source.checkedDate?.toISOString() ?? null,
  };
}

// cache() — dedupe ภายใน request เดียว (generateMetadata + page เรียกซ้ำ)
export const getNameplateDetail = cache(async (slug: string): Promise<NameplateDetail | null> => {
  const nameplate = await prisma.nameplate.findUnique({
    where: { slug },
    include: nameplateInclude,
  });
  if (!nameplate) return null;

  const changeEvents = await prisma.changeEvent.findMany({
    where: { nameplateId: nameplate.id },
    orderBy: [{ effectiveDate: "desc" }, { createdAt: "desc" }],
    include: { evidenceSource: true },
  });

  const flats = flattenVariants(nameplate);
  const sourceMap = new Map<string, EvidenceSourceRecord>();

  const groupMap = new Map<string, VariantGroup>();
  for (const flat of flats) {
    const key = flat.derivative.id;
    if (!groupMap.has(key)) {
      groupMap.set(key, {
        key,
        label: flat.derivative.name ?? "",
        bodyType: flat.derivative.bodyType,
        rows: [],
      });
    }

    const obs = latestPrice(flat);
    if (obs) sourceMap.set(obs.evidenceSourceId, obs.evidenceSource);

    const described = describePowertrain(flat);

    groupMap.get(key)!.rows.push({
      id: flat.variant.id,
      name: flat.variant.name ?? flat.trim.name,
      trimName: flat.trim.name,
      powertrainType: flat.variant.powertrainType,
      powertrainText: powertrainLabel(
        flat.variant.powertrainType,
        flat.variant.engine?.fuelType,
      ),
      engineText: described.engineText,
      powerText: described.powerText,
      transmissionText: described.transmissionText,
      drivetrain: flat.variant.drivetrain?.type ?? null,
      seatCount:
        flat.variant.seatCountStatus === "known" ? flat.variant.seatCount : null,
      price: obs?.amount != null ? Number(obs.amount) : null,
      priceAsOf: obs
        ? (obs.effectiveFrom ?? obs.observedDate).toISOString()
        : null,
      evidence: obs ? toEvidenceRef(obs.evidenceSource) : null,
      ...specExtras(flat),
    });
  }

  for (const event of changeEvents) sourceMap.set(event.evidenceSourceId, event.evidenceSource);

  const groups = [...groupMap.values()].map((group) => ({
    ...group,
    rows: group.rows.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity)),
  }));

  const prices = groups.flatMap((g) => g.rows.map((r) => r.price)).filter(
    (p): p is number => p != null,
  );
  const checked = flats
    .map((flat) => {
      const obs = latestPrice(flat);
      return obs ? (obs.evidenceSource.checkedDate ?? obs.observedDate) : null;
    })
    .filter(Boolean) as Date[];

  const currentGeneration = nameplate.generations[0] ?? null;

  // ── ADAS ต่อ trim (TrimFeature — VOCABULARY.md Phase 4) ──
  const trimFeatures = await prisma.trimFeature.findMany({
    where: { trim: { phase: { derivative: { generation: { nameplateId: nameplate.id } } } } },
    include: { feature: true },
  });
  let adas: AdasSection = null;
  if (trimFeatures.length > 0) {
    const FEATURE_ORDER = ["AEB", "ACC", "LKA"];
    const features: AdasFeatureCol[] = [...new Map(
      trimFeatures.map((tf) => [tf.feature.category, {
        key: tf.feature.category,
        nameTh: tf.feature.canonicalNameTh,
        nameEn: tf.feature.canonicalNameEn,
        definition: tf.feature.definition,
      }]),
    ).values()].sort((a, b) => FEATURE_ORDER.indexOf(a.key) - FEATURE_ORDER.indexOf(b.key));

    // ไล่ trim ตามลำดับที่ปรากฏในบันไดราคา (ราคาต่ำ→สูง) · ชื่อ trim ซ้ำข้ามแค็บ → เติมชื่อตัวถัง
    const byTrimId = new Map<string, typeof trimFeatures>();
    for (const tf of trimFeatures) {
      if (!byTrimId.has(tf.trimId)) byTrimId.set(tf.trimId, []);
      byTrimId.get(tf.trimId)!.push(tf);
    }
    const seenTrimIds = new Set<string>();
    const orderedTrims: { id: string; name: string; derivativeLabel: string }[] = [];
    for (const flat of flats.slice().sort((a, b) => {
      const pa = latestPrice(a)?.amount, pb = latestPrice(b)?.amount;
      return (pa != null ? Number(pa) : Infinity) - (pb != null ? Number(pb) : Infinity);
    })) {
      if (!seenTrimIds.has(flat.trim.id)) {
        seenTrimIds.add(flat.trim.id);
        orderedTrims.push({
          id: flat.trim.id,
          name: flat.trim.name,
          derivativeLabel: flat.derivative.name ?? "",
        });
      }
    }
    const nameCounts = new Map<string, number>();
    for (const t of orderedTrims) nameCounts.set(t.name, (nameCounts.get(t.name) ?? 0) + 1);

    const trims: AdasTrimRow[] = orderedTrims.map((t) => {
      const tfs = byTrimId.get(t.id) ?? [];
      return {
        label: (nameCounts.get(t.name) ?? 0) > 1 && t.derivativeLabel
          ? `${t.name} — ${t.derivativeLabel}`
          : t.name,
        values: features.map((f) => {
          const tf = tfs.find((x) => x.feature.category === f.key);
          return {
            key: f.key,
            has: tf && tf.status === "known" ? tf.hasFeature : null,
            marketing: tf?.marketingName ?? null,
          };
        }),
      };
    });
    adas = { features, trims };
  }

  return {
    slug: nameplate.slug,
    name: nameplate.name,
    brand: nameplate.marketPresence.brand.name,
    brandSlug: nameplate.marketPresence.brand.slug,
    segment: nameplate.segment,
    lifecycleStatus: nameplate.lifecycleStatus,
    summary: nameplate.summary,
    generationCode: currentGeneration?.code ?? null,
    generationName: currentGeneration?.name ?? null,
    launchYear: currentGeneration?.launchYear ?? null,
    generationSummary: currentGeneration?.summary ?? null,
    priceMin: prices.length ? Math.min(...prices) : null,
    priceMax: prices.length ? Math.max(...prices) : null,
    latestChecked: maxDate(checked),
    groups,
    adas,
    changeEvents: changeEvents.map((event) => ({
      id: event.id,
      changeType: event.changeType,
      title: event.title,
      summary: event.summary,
      beforeValue: event.beforeValue,
      afterValue: event.afterValue,
      effectiveDate: event.effectiveDate?.toISOString() ?? null,
      evidence: toEvidenceRef(event.evidenceSource),
    })),
    sources: [...sourceMap.values()].map((source) => ({
      id: source.id,
      publisher: source.publisher,
      title: source.title,
      url: source.url,
      sourceType: source.sourceType,
      confidence: source.confidence as ConfidenceLevel,
      publishedDate: source.publishedDate?.toISOString() ?? null,
      checkedDate: source.checkedDate?.toISOString() ?? null,
    })),
  };
});

export type BrandTile = {
  slug: string;
  name: string;
  logoUrl: string | null;
  nameplateCount: number;
};

export async function getBrandTiles(): Promise<BrandTile[]> {
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
    include: {
      marketPresences: { include: { _count: { select: { nameplates: true } } } },
    },
  });
  return brands.map((brand) => ({
    slug: brand.slug,
    name: brand.name,
    logoUrl: brand.logoUrl,
    nameplateCount: brand.marketPresences.reduce(
      (n, presence) => n + presence._count.nameplates,
      0,
    ),
  }));
}

export type BrandDetail = {
  slug: string;
  name: string;
  officialName: string | null;
  countryOrigin: string | null;
  parentCompany: string | null;
  distributorName: string | null;
  channel: string | null;
  operationFrom: string | null;
  rows: NameplateRow[];
  variantRows: VariantIndexRow[];
  sources: SourceRow[];
  stats: {
    nameplates: number;
    variants: number;
    priceMin: number | null;
    priceMax: number | null;
    latestChecked: string | null;
  };
};

export const getBrandDetail = cache(async (slug: string): Promise<BrandDetail | null> => {
  const brand = await prisma.brand.findUnique({
    where: { slug },
    include: {
      // เฉพาะ presence ไทยที่ยัง active ล่าสุด — กันหยิบ presence เก่า/ต่างตลาดแบบสุ่ม
      marketPresences: {
        where: { market: "TH", operationTo: null },
        orderBy: { operationFrom: "desc" },
        take: 1,
      },
    },
  });
  if (!brand) return null;

  const [nameplates, evidenceLinks] = await Promise.all([
    prisma.nameplate.findMany({
      where: { marketPresence: { brandId: brand.id } },
      orderBy: { name: "asc" },
      include: nameplateInclude,
    }),
    prisma.evidenceLink.findMany({
      where: { entityType: "BRAND", entityId: brand.id },
      include: { evidenceSource: true },
    }),
  ]);

  const summaries = nameplates.map(buildNameplateSummary);
  const rows = summaries.map((s) => s.row);
  const prices = rows.flatMap((r) => [r.priceMin, r.priceMax]).filter(
    (p): p is number => p != null,
  );
  const presence = brand.marketPresences[0] ?? null;

  const sourceMap = new Map<string, SourceRow>();
  for (const link of evidenceLinks) {
    const source = link.evidenceSource;
    sourceMap.set(source.id, {
      id: source.id,
      publisher: source.publisher,
      title: source.title,
      url: source.url,
      sourceType: source.sourceType,
      confidence: source.confidence as ConfidenceLevel,
      publishedDate: source.publishedDate?.toISOString() ?? null,
      checkedDate: source.checkedDate?.toISOString() ?? null,
    });
  }

  return {
    slug: brand.slug,
    name: brand.name,
    officialName: brand.officialName,
    countryOrigin: brand.countryOrigin,
    parentCompany: brand.parentCompany,
    distributorName: presence?.distributorName ?? null,
    channel: presence?.channel ?? null,
    operationFrom: presence?.operationFrom?.toISOString() ?? null,
    rows,
    variantRows: summaries.flatMap((s) => s.variantRows),
    sources: [...sourceMap.values()],
    stats: {
      nameplates: rows.length,
      variants: rows.reduce((n, r) => n + r.variantCount, 0),
      priceMin: prices.length ? Math.min(...prices) : null,
      priceMax: prices.length ? Math.max(...prices) : null,
      latestChecked: maxDate(summaries.flatMap((s) => s.checkedDates)),
    },
  };
});

// ── ดัชนีนำทางแบบเบา (แบรนด์ + รุ่นในแต่ละแบรนด์) — ป้อน navbar switcher + mobile drawer ──
// เลือกเฉพาะ field ที่ nav ใช้ (ไม่ลาก tree ราคา/สเปก) · cache() = ทุก layout ในรีเควสต์เดียวจ่าย DB ครั้งเดียว
export type NavNameplate = { slug: string; name: string; lifecycleStatus: string };
export type NavBrand = { slug: string; name: string; nameplates: NavNameplate[] };

export const getNavIndex = cache(async (): Promise<NavBrand[]> => {
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
    select: {
      slug: true,
      name: true,
      marketPresences: {
        select: {
          nameplates: {
            orderBy: { name: "asc" },
            select: { slug: true, name: true, lifecycleStatus: true },
          },
        },
      },
    },
  });
  return brands.map((b) => ({
    slug: b.slug,
    name: b.name,
    // แบรนด์เดียวอาจมีหลาย presence (ตลาด/ช่วงเวลา) — รวมรุ่นให้ตรงกับที่ getBrandDetail แสดง
    nameplates: b.marketPresences.flatMap((p) => p.nameplates),
  }));
});

// ── ต้นไม้ตัวตนรถ (คงชั้น Generation→Derivative→Phase→Trim→Variant) สำหรับหน้าย่อย §7.4–7.5 ──
// ต่างจาก flattenVariants ที่ยุบชั้น — อันนี้เก็บโครงเพื่อทำหน้าเจน/ตัวถัง/รุ่นย่อยแยก · reuse helper เดิม
// ประวัติราคา (append-only observation) — โชว์ทุกแถวในหน้า SKU ไม่ทับอดีต
export type PriceHistoryRow = {
  amount: number | null;
  observedDate: string;
  effectiveFrom: string | null;
  evidence: EvidenceRef;
};
export type TreeVariant = VariantRow & { skuKey: string; priceHistory: PriceHistoryRow[] };
export type TreeTrim = {
  key: string;
  name: string;
  standardName: string | null;
  marketingLine: string | null;
  rideHeightClass: string | null;
  variants: TreeVariant[];
  priceMin: number | null;
  priceMax: number | null;
};
export type TreeDerivative = {
  key: string;
  bodyType: string;
  name: string | null;
  cabType: string | null;
  doors: number | null;
  wheelbaseMm: number | null;
  phaseType: string | null;
  phaseName: string | null;
  changeSummary: string | null;
  trims: TreeTrim[];
  priceMin: number | null;
  priceMax: number | null;
  variantCount: number;
};
export type TreeGeneration = {
  key: string;
  code: string | null;
  name: string | null;
  launchYear: number | null;
  platformName: string | null;
  chassisType: string | null;
  ecoCarPhase: string | null;
  summary: string | null;
  derivatives: TreeDerivative[];
  priceMin: number | null;
  priceMax: number | null;
  variantCount: number;
};
export type NameplateTree = {
  slug: string;
  name: string;
  brand: string;
  brandSlug: string;
  segment: string | null;
  lifecycleStatus: string;
  summary: string | null;
  generations: TreeGeneration[];
};

function priceRangeOf(prices: (number | null)[]): { min: number | null; max: number | null } {
  const p = prices.filter((x): x is number => x != null);
  return { min: p.length ? Math.min(...p) : null, max: p.length ? Math.max(...p) : null };
}

export const getNameplateTree = cache(async (slug: string): Promise<NameplateTree | null> => {
  const nameplate = await prisma.nameplate.findUnique({ where: { slug }, include: nameplateInclude });
  if (!nameplate) return null;

  const generations: TreeGeneration[] = nameplate.generations.map((generation, gi) => {
    // ตัวถังของเจนนี้ · คีย์ dedupe ต่อเจน
    const derivKeys = dedupeKeys(generation.derivatives, (d, i) => derivativeKey(d, i));
    // คีย์ SKU dedupe ระดับทั้งเจน (ชื่อ trim ซ้ำข้ามตัวถังได้) — ต้อง filter เหมือนตอน map จริงเป๊ะ ให้ index ตรงกัน
    const genFlat = generation.derivatives.flatMap((derivative) => {
      const phase = derivative.phases.find((p) => p.effectiveTo == null) ?? derivative.phases[0] ?? null;
      return (phase?.trims ?? [])
        .filter((t) => t.effectiveTo == null)
        .flatMap((trim) =>
          trim.variantRevisions.filter((v) => v.effectiveTo == null).map((variant) => ({ variant, trim })),
        );
    });
    const skuKeyByVariantId = new Map<string, string>();
    for (const [fv, key] of dedupeKeys(genFlat, (fv, i) => variantKey(fv.variant, fv.trim, i))) {
      skuKeyByVariantId.set(fv.variant.id, key);
    }
    const derivatives: TreeDerivative[] = generation.derivatives.map((derivative) => {
      const phase = derivative.phases.find((p) => p.effectiveTo == null) ?? derivative.phases[0] ?? null;
      const rawTrims = (phase?.trims ?? []).filter((t) => t.effectiveTo == null);
      const trimKeys = dedupeKeys(rawTrims, (t, i) => trimKey(t, i));
      const trims: TreeTrim[] = rawTrims.map((trim) => {
        const variants: TreeVariant[] = trim.variantRevisions
          .filter((v) => v.effectiveTo == null)
          .map((variant) => {
            const flat: FlatVariant = { variant, trim, derivative };
            const obs = latestPrice(flat);
            const described = describePowertrain(flat);
            return {
              id: variant.id,
              name: variant.name ?? trim.name,
              trimName: trim.name,
              powertrainType: variant.powertrainType,
              powertrainText: powertrainLabel(variant.powertrainType, variant.engine?.fuelType),
              engineText: described.engineText,
              powerText: described.powerText,
              transmissionText: described.transmissionText,
              drivetrain: variant.drivetrain?.type ?? null,
              seatCount: variant.seatCountStatus === "known" ? variant.seatCount : null,
              price: obs?.amount != null ? Number(obs.amount) : null,
              priceAsOf: obs ? (obs.effectiveFrom ?? obs.observedDate).toISOString() : null,
              evidence: obs ? toEvidenceRef(obs.evidenceSource) : null,
              ...specExtras(flat),
              skuKey: skuKeyByVariantId.get(variant.id) ?? variant.id,
              priceHistory: variant.officialPriceObservations.map((o) => ({
                amount: o.amount != null ? Number(o.amount) : null,
                observedDate: o.observedDate.toISOString(),
                effectiveFrom: o.effectiveFrom?.toISOString() ?? null,
                evidence: toEvidenceRef(o.evidenceSource),
              })),
            };
          });
        const range = priceRangeOf(variants.map((v) => v.price));
        return {
          key: trimKeys.get(trim)!,
          name: trim.name,
          standardName: trim.standardName,
          marketingLine: trim.marketingLine,
          rideHeightClass: trim.rideHeightClass,
          variants,
          priceMin: range.min,
          priceMax: range.max,
        };
      });
      const allPrices = trims.flatMap((t) => t.variants.map((v) => v.price));
      const range = priceRangeOf(allPrices);
      return {
        key: derivKeys.get(derivative)!,
        bodyType: derivative.bodyType,
        name: derivative.name,
        cabType: derivative.cabType,
        doors: derivative.doors,
        wheelbaseMm: derivative.wheelbaseMm,
        phaseType: phase?.phaseType ?? null,
        phaseName: phase?.name ?? null,
        changeSummary: phase?.changeSummary ?? null,
        trims,
        priceMin: range.min,
        priceMax: range.max,
        variantCount: trims.reduce((n, t) => n + t.variants.length, 0),
      };
    });
    const range = priceRangeOf(derivatives.flatMap((d) => [d.priceMin, d.priceMax]));
    return {
      key: generationKey(generation, gi),
      code: generation.code,
      name: generation.name,
      launchYear: generation.launchYear,
      platformName: generation.platformName,
      chassisType: generation.chassisType,
      ecoCarPhase: generation.ecoCarPhase,
      summary: generation.summary,
      derivatives,
      priceMin: range.min,
      priceMax: range.max,
      variantCount: derivatives.reduce((n, d) => n + d.variantCount, 0),
    };
  });

  return {
    slug: nameplate.slug,
    name: nameplate.name,
    brand: nameplate.marketPresence.brand.name,
    brandSlug: nameplate.marketPresence.brand.slug,
    segment: nameplate.segment,
    lifecycleStatus: nameplate.lifecycleStatus,
    summary: nameplate.summary,
    generations,
  };
});

// selector (pure · หน้าเรียก getNameplateTree แล้วหา node ตามคีย์)
export function selectGeneration(tree: NameplateTree, genKey: string): TreeGeneration | null {
  return tree.generations.find((g) => g.key === genKey) ?? null;
}
export function selectDerivative(gen: TreeGeneration, derivKey: string): TreeDerivative | null {
  return gen.derivatives.find((d) => d.key === derivKey) ?? null;
}
export function selectTrim(deriv: TreeDerivative, tKey: string): TreeTrim | null {
  return deriv.trims.find((t) => t.key === tKey) ?? null;
}
// หา SKU (variant) ตามคีย์ในเจนปัจจุบัน — คืน context ทั้งสาย ไว้ทำ breadcrumb/สลับรุ่นพี่น้อง
export function selectVariant(
  tree: NameplateTree,
  skuKey: string,
): { variant: TreeVariant; trim: TreeTrim; derivative: TreeDerivative; generation: TreeGeneration } | null {
  const gen = tree.generations[0];
  if (!gen) return null;
  for (const derivative of gen.derivatives) {
    for (const trim of derivative.trims) {
      const variant = trim.variants.find((v) => v.skuKey === skuKey);
      if (variant) return { variant, trim, derivative, generation: gen };
    }
  }
  return null;
}

// ── ไทม์ไลน์ระดับแบรนด์ — รวม change event ของทุก nameplate ในแบรนด์ (§7.2) ──
export type BrandChangeRow = ChangeEventRow & { nameplateSlug: string; nameplateName: string };

export const getBrandTimeline = cache(async (slug: string): Promise<BrandChangeRow[]> => {
  const brand = await prisma.brand.findUnique({ where: { slug }, select: { id: true } });
  if (!brand) return [];
  const events = await prisma.changeEvent.findMany({
    where: { nameplate: { marketPresence: { brandId: brand.id } } },
    orderBy: [{ effectiveDate: "desc" }, { createdAt: "desc" }],
    include: { evidenceSource: true, nameplate: { select: { slug: true, name: true } } },
  });
  return events.map((event) => ({
    id: event.id,
    changeType: event.changeType,
    title: event.title,
    summary: event.summary,
    beforeValue: event.beforeValue,
    afterValue: event.afterValue,
    effectiveDate: event.effectiveDate?.toISOString() ?? null,
    evidence: toEvidenceRef(event.evidenceSource),
    nameplateSlug: event.nameplate?.slug ?? "",
    nameplateName: event.nameplate?.name ?? "",
  }));
});
