// Data access ของหน้าเว็บ — query ผ่าน prisma singleton แล้ว map เป็น DTO ล้วน
// (string/number/null เท่านั้น) ก่อนส่งเข้า client component

import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { ASPIRATION_LABEL, FUEL_TYPE_LABEL, powertrainLabel } from "@/lib/labels";

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
};

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
