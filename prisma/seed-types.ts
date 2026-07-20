// ชนิดข้อมูลของชุด seed — แยกจาก logic เพื่อให้ข้อมูล (seed-data.ts) ตรวจ type ได้
// หลัก evidence-first: ทุกราคาอ้าง evidenceKey ที่ต้องมีอยู่จริงใน evidences

import type {
  BodyType,
  ChangeType,
  Confidence,
  DrivetrainType,
  EvidenceSourceType,
  LifecycleStatus,
  PhaseType,
  PowertrainType,
  Segment,
  TransmissionType,
} from "../src/generated/prisma/enums";

export type SeedEvidence = {
  key: string;
  sourceType: EvidenceSourceType;
  publisher: string;
  title: string;
  url: string;
  publishedDate?: string;
  checkedDate: string;
  confidence: Confidence;
  notes?: string;
};

export type SeedEngine = {
  code?: string;
  displacementCc?: number;
  cylinders?: number;
  aspiration?: string;
  fuelType?: string;
  maxPowerPs?: number; // ค่าจริงจากสเปกไทยเป็น PS (เดิมชื่อ maxPowerHp)
  maxTorqueNm?: number;
};

export type SeedMotor = {
  count?: number;
  maxPowerKw?: number;
  maxTorqueNm?: number;
  location?: string;
};

export type SeedBattery = {
  chemistry?: string;
  capacityKwh?: number;
};

export type SeedVariant = {
  name: string;
  powertrainType: PowertrainType;
  modelYear?: number;
  seatCount?: number;
  engine?: SeedEngine;
  motor?: SeedMotor;
  battery?: SeedBattery;
  transmission?: { type: TransmissionType; gears?: number };
  drivetrain?: { type: DrivetrainType };
  price: {
    amount: number;
    observedDate: string;
    effectiveFrom?: string;
    evidenceKey: string;
    notes?: string;
  };
  notes?: string;
};

export type SeedTrim = {
  name: string;
  variants: SeedVariant[];
};

export type SeedPhase = {
  phaseType: PhaseType;
  name?: string;
  effectiveFrom?: string;
  trims: SeedTrim[];
};

export type SeedDerivative = {
  bodyType: BodyType;
  name?: string;
  phases: SeedPhase[];
};

export type SeedGeneration = {
  code?: string;
  name?: string;
  launchYear?: number;
  summary?: string;
  evidenceKeys?: string[];
  derivatives: SeedDerivative[];
};

export type SeedNameplate = {
  slug: string;
  name: string;
  segment?: Segment;
  lifecycleStatus: LifecycleStatus;
  summary?: string;
  generations: SeedGeneration[];
};

export type SeedChangeEvent = {
  changeType: ChangeType;
  title: string;
  summary?: string;
  beforeValue?: string;
  afterValue?: string;
  announcedDate?: string;
  effectiveDate?: string;
  nameplateSlug: string;
  evidenceKey: string;
};

export type SeedData = {
  brand: {
    slug: string;
    name: string;
    officialName?: string;
    countryOrigin?: string;
    parentCompany?: string;
  };
  marketPresence: {
    market: string;
    distributorName?: string;
    importerName?: string;
    channel?: string;
    operationFrom?: string;
    notes?: string;
  };
  brandEvidenceKeys: string[];
  evidences: SeedEvidence[];
  nameplates: SeedNameplate[];
  changeEvents: SeedChangeEvent[];
};
