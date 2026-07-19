// CARMETA — seed demo data (Toyota + 5 nameplate ครอบ 3 ประเภทตัวถัง)
// ─────────────────────────────────────────────────────────────
// หลักการที่ยึด (product doc §10.1 + evidence-first):
//  - ข้อมูลนี้เป็น SEED DEMO: ราคา/สเปกโดยประมาณ ยังไม่ verify กับ price list ทางการ
//  - ทุก OfficialPriceObservation + ChangeEvent ผูก EvidenceSource (required · confidence LOW)
//  - ค่าที่ไม่มีข้อมูลจริง → DataStatus = unknown + ปล่อย field เป็น null (ไม่เดา 0)
//  - idempotent: ล้างข้อมูลเดิม (deleteMany ตามลำดับ FK) ก่อน insert → รันซ้ำได้ไม่ error
//
// รันผ่าน DIRECT_URL (Supabase pooler session 5432) จะเสถียรกว่า transaction pooler
//   npm run db:seed
// ─────────────────────────────────────────────────────────────
import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// seed insert เยอะ → ใช้ DIRECT_URL (session 5432) ถ้ามี, fallback DATABASE_URL
const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? '';
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// วันที่สังเกตราคาแบบคงที่ (อย่าใช้ new Date() ปัจจุบันแบบสุ่ม)
const OBSERVED = new Date('2026-01-15T00:00:00.000Z');
const PRICE_NOTE =
  'ราคาโดยประมาณ (seed demo) — ยังไม่ verify กับ price list ทางการ';

// ล้างข้อมูลเดิมตามลำดับ FK (child → parent) ให้รันซ้ำได้
async function clearAll() {
  await prisma.marketStatisticSnapshot.deleteMany();
  await prisma.listingSnapshot.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.physicalVehicle.deleteMany();
  await prisma.changeEvent.deleteMany();
  await prisma.promotionObservation.deleteMany();
  await prisma.officialPriceObservation.deleteMany();
  await prisma.evidenceLink.deleteMany();
  await prisma.variantRevision.deleteMany();
  await prisma.engine.deleteMany();
  await prisma.motor.deleteMany();
  await prisma.battery.deleteMany();
  await prisma.transmission.deleteMany();
  await prisma.drivetrain.deleteMany();
  await prisma.trim.deleteMany();
  await prisma.phase.deleteMany();
  await prisma.derivative.deleteMany();
  await prisma.generation.deleteMany();
  await prisma.nameplate.deleteMany();
  await prisma.marketPresence.deleteMany();
  await prisma.globalModelFamily.deleteMany();
  await prisma.aliasMapping.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.evidenceSource.deleteMany();
}

async function main() {
  console.log('เริ่ม seed — ล้างข้อมูลเดิม...');
  await clearAll();

  // ── EvidenceSource (seed demo · LOW confidence) ────────────────
  const evidence = await prisma.evidenceSource.create({
    data: {
      sourceType: 'EDITORIAL',
      publisher: 'CARMETA seed',
      title: 'Seed demo data',
      confidence: 'LOW',
      checkedDate: OBSERVED,
      checkedBy: 'CARMETA seed script',
      notes:
        'ข้อมูล seed สำหรับ prototype — ราคา/สเปกโดยประมาณ ยังไม่ verify กับแหล่งทางการ',
    },
  });

  // ── Brand + MarketPresence ─────────────────────────────────────
  const toyota = await prisma.brand.create({
    data: {
      slug: 'toyota',
      name: 'Toyota',
      officialName: 'Toyota Motor Corporation',
      countryOrigin: 'Japan',
      parentCompany: 'Toyota Motor Corporation',
    },
  });

  const marketTH = await prisma.marketPresence.create({
    data: {
      brandId: toyota.id,
      market: 'TH',
      importerName: 'Toyota Motor Thailand',
      distributorName: 'Toyota Motor Thailand',
      channel: 'authorized dealer',
    },
  });

  // ── Powertrain entities (VariantRevision อ้างอิง) ──────────────
  // Engine — ค่ากำลังเป็น approximate (powerStatus known = "มีค่า" · ความไม่ชัวร์สื่อผ่าน evidence LOW)
  const eng16 = await prisma.engine.create({
    data: {
      name: '1.6L Dual VVT-i',
      displacementCc: 1598,
      cylinders: 4,
      aspiration: 'NA',
      fuelType: 'Petrol',
      maxPowerHp: 140,
      maxTorqueNm: 139,
      powerStatus: 'known',
      notes: 'Corolla Altis 1.6 (ค่าโดยประมาณ)',
    },
  });
  const eng12 = await prisma.engine.create({
    data: {
      name: '1.2L NA',
      displacementCc: 1197,
      // จำนวนสูบไม่แน่ใจ → ปล่อย null (ไม่เดา)
      aspiration: 'NA',
      fuelType: 'Petrol',
      maxPowerHp: 86,
      maxTorqueNm: 112,
      powerStatus: 'known',
      notes: 'Yaris Ativ 1.2 (ค่าโดยประมาณ)',
    },
  });
  const eng24d = await prisma.engine.create({
    data: {
      name: '2.4L GD Turbo Diesel',
      displacementCc: 2393,
      cylinders: 4,
      aspiration: 'Turbo',
      fuelType: 'Diesel',
      maxPowerHp: 150,
      maxTorqueNm: 400,
      powerStatus: 'known',
      notes: 'Hilux/Fortuner 2.4 (ค่าโดยประมาณ)',
    },
  });
  const eng28d = await prisma.engine.create({
    data: {
      name: '2.8L GD Turbo Diesel',
      displacementCc: 2755,
      cylinders: 4,
      aspiration: 'Turbo',
      fuelType: 'Diesel',
      maxPowerHp: 204,
      maxTorqueNm: 500,
      powerStatus: 'known',
      notes: 'Hilux/Fortuner 2.8 (ค่าโดยประมาณ)',
    },
  });
  const engHev18 = await prisma.engine.create({
    data: {
      name: '1.8L HEV Petrol',
      displacementCc: 1798,
      cylinders: 4,
      aspiration: 'NA',
      fuelType: 'Petrol',
      maxPowerHp: 98,
      powerStatus: 'known',
      notes: 'Corolla HEV — เครื่องยนต์ส่วนสันดาป (กำลังรวมระบบ ~122hp · ค่าโดยประมาณ)',
    },
  });

  // Motor
  const motorHev = await prisma.motor.create({
    data: {
      name: 'Corolla HEV motor',
      count: 1,
      maxPowerKw: 53,
      location: 'front',
      powerStatus: 'known',
      notes: 'มอเตอร์เสริมระบบ HEV (ค่าโดยประมาณ)',
    },
  });
  const motorBz4x = await prisma.motor.create({
    data: {
      name: 'bZ4X front motor',
      count: 1,
      maxPowerKw: 150,
      location: 'front',
      powerStatus: 'known',
      notes: 'bZ4X FWD single motor (ค่าโดยประมาณ)',
    },
  });

  // Battery (bZ4X)
  const batBz4x = await prisma.battery.create({
    data: {
      chemistry: 'NMC',
      capacityKwh: 71.4,
      capacityStatus: 'known',
      // usableKwh ไม่แน่ใจ → null
      notes: 'bZ4X 71.4 kWh (ค่าโดยประมาณ)',
    },
  });

  // Transmission
  const cvt = await prisma.transmission.create({
    data: { type: 'CVT', name: 'CVT' },
  });
  const eCvt = await prisma.transmission.create({
    data: { type: 'CVT', name: 'e-CVT (HEV)' },
  });
  const auto6 = await prisma.transmission.create({
    data: { type: 'AUTOMATIC', gears: 6, name: '6-speed AT' },
  });
  const singleSpeed = await prisma.transmission.create({
    data: { type: 'SINGLE_SPEED', name: 'Single-speed reduction (EV)' },
  });

  // Drivetrain
  const fwd = await prisma.drivetrain.create({
    data: { type: 'FWD', name: 'FWD' },
  });
  const rwd = await prisma.drivetrain.create({
    data: { type: 'RWD', name: 'RWD (2WD)' },
  });
  const fourwd = await prisma.drivetrain.create({
    data: { type: 'FOUR_WD', name: '4WD' },
  });

  // ── helper: สร้าง VariantRevision + ราคา 1 รายการ ───────────────
  type VariantOpts = {
    trimId: string;
    name?: string;
    powertrainType:
      | 'ICE'
      | 'MHEV'
      | 'HEV'
      | 'PHEV'
      | 'BEV'
      | 'FCEV';
    engineId?: string;
    motorId?: string;
    batteryId?: string;
    transmissionId?: string;
    drivetrainId?: string;
    seatCount?: number;
    price: number;
  };
  async function makeVariant(o: VariantOpts) {
    const vr = await prisma.variantRevision.create({
      data: {
        trimId: o.trimId,
        name: o.name,
        powertrainType: o.powertrainType,
        modelYear: 2026,
        modelYearStatus: 'known',
        seatCount: o.seatCount ?? null,
        seatCountStatus: o.seatCount != null ? 'known' : 'unknown',
        engineId: o.engineId,
        motorId: o.motorId,
        batteryId: o.batteryId,
        transmissionId: o.transmissionId,
        drivetrainId: o.drivetrainId,
      },
    });
    await prisma.officialPriceObservation.create({
      data: {
        variantRevisionId: vr.id,
        priceType: 'OFFICIAL_LIST_PRICE',
        currency: 'THB',
        amount: o.price,
        amountStatus: 'known',
        observedDate: OBSERVED,
        evidenceSourceId: evidence.id,
        notes: PRICE_NOTE,
      },
    });
    return vr;
  }

  // helper: สร้าง trim แล้ว return id
  async function makeTrim(phaseId: string, name: string) {
    const t = await prisma.trim.create({ data: { phaseId, name } });
    return t.id;
  }

  // ── 1) Corolla Altis (COMPACT · SEDAN) ─────────────────────────
  const corolla = await prisma.nameplate.create({
    data: {
      slug: 'corolla-altis',
      name: 'Corolla Altis',
      marketPresenceId: marketTH.id,
      segment: 'COMPACT',
      segmentStatus: 'known',
      lifecycleStatus: 'CURRENT',
      summary: 'ซีดานคอมแพกต์ · เครื่อง 1.6 และ HEV 1.8',
    },
  });
  const corollaGen = await prisma.generation.create({
    data: {
      nameplateId: corolla.id,
      code: 'E210',
      name: '12th generation',
      launchYear: 2019,
      lifecycleStatus: 'CURRENT',
    },
  });
  const corollaDeriv = await prisma.derivative.create({
    data: { generationId: corollaGen.id, bodyType: 'SEDAN', name: 'Sedan', doors: 4 },
  });
  const corollaPhase = await prisma.phase.create({
    data: {
      derivativeId: corollaDeriv.id,
      phaseType: 'FACELIFT',
      name: '2022 facelift',
      sequence: 2,
    },
  });
  const corollaSport = await makeTrim(corollaPhase.id, '1.6 Sport');
  const corollaHev = await makeTrim(corollaPhase.id, '1.8 HEV Premium');
  const corollaSportVr = await makeVariant({
    trimId: corollaSport,
    name: '1.6 Sport CVT',
    powertrainType: 'ICE',
    engineId: eng16.id,
    transmissionId: cvt.id,
    drivetrainId: fwd.id,
    seatCount: 5,
    price: 899000,
  });
  await makeVariant({
    trimId: corollaHev,
    name: '1.8 HEV Premium',
    powertrainType: 'HEV',
    engineId: engHev18.id,
    motorId: motorHev.id,
    transmissionId: eCvt.id,
    drivetrainId: fwd.id,
    seatCount: 5,
    price: 1199000,
  });

  // ── 2) Yaris Ativ (ECO_CAR · SEDAN) ────────────────────────────
  const yaris = await prisma.nameplate.create({
    data: {
      slug: 'yaris-ativ',
      name: 'Yaris Ativ',
      marketPresenceId: marketTH.id,
      segment: 'ECO_CAR',
      segmentStatus: 'known',
      lifecycleStatus: 'CURRENT',
      summary: 'อีโคคาร์ซีดาน · เครื่อง 1.2',
    },
  });
  const yarisGen = await prisma.generation.create({
    data: {
      nameplateId: yaris.id,
      name: '2nd generation (DNGA)',
      launchYear: 2022,
      lifecycleStatus: 'CURRENT',
    },
  });
  const yarisDeriv = await prisma.derivative.create({
    data: { generationId: yarisGen.id, bodyType: 'SEDAN', name: 'Sedan', doors: 4 },
  });
  const yarisPhase = await prisma.phase.create({
    data: {
      derivativeId: yarisDeriv.id,
      phaseType: 'INITIAL',
      name: '2022 launch',
      sequence: 1,
    },
  });
  const yarisTrims: Array<[string, number]> = [
    ['Sport', 539000],
    ['Smart', 599000],
    ['Premium', 649000],
    ['Premium Luxury', 689000],
  ];
  for (const [tname, price] of yarisTrims) {
    const tid = await makeTrim(yarisPhase.id, tname);
    await makeVariant({
      trimId: tid,
      name: `${tname} 1.2 CVT`,
      powertrainType: 'ICE',
      engineId: eng12.id,
      transmissionId: cvt.id,
      drivetrainId: fwd.id,
      seatCount: 5,
      price,
    });
  }

  // ── 3) Hilux Revo (PICKUP · PICKUP) ────────────────────────────
  const hilux = await prisma.nameplate.create({
    data: {
      slug: 'hilux-revo',
      name: 'Hilux Revo',
      marketPresenceId: marketTH.id,
      segment: 'PICKUP',
      segmentStatus: 'known',
      lifecycleStatus: 'CURRENT',
      summary: 'กระบะ · ดีเซล 2.4/2.8',
    },
  });
  const hiluxGen = await prisma.generation.create({
    data: {
      nameplateId: hilux.id,
      code: 'AN120/AN130',
      name: '8th generation (Revo)',
      launchYear: 2015,
      lifecycleStatus: 'CURRENT',
    },
  });
  const hiluxDeriv = await prisma.derivative.create({
    data: { generationId: hiluxGen.id, bodyType: 'PICKUP', name: 'Pickup' },
  });
  const hiluxPhase = await prisma.phase.create({
    data: {
      derivativeId: hiluxDeriv.id,
      phaseType: 'FACELIFT',
      name: '2020 minorchange',
      sequence: 2,
    },
  });
  const hiluxEntry = await makeTrim(hiluxPhase.id, 'Entry (Single Cab 2.4)');
  const hiluxPre = await makeTrim(hiluxPhase.id, 'Prerunner 2.4 (Double Cab)');
  const hiluxRocco = await makeTrim(hiluxPhase.id, 'Double Cab Rocco 2.8');
  await makeVariant({
    trimId: hiluxEntry,
    name: 'Single Cab 2.4 6AT',
    powertrainType: 'ICE',
    engineId: eng24d.id,
    transmissionId: auto6.id,
    drivetrainId: rwd.id,
    // seatCount single cab ไม่แน่ใจ → unknown
    price: 569000,
  });
  await makeVariant({
    trimId: hiluxPre,
    name: 'Prerunner 2.4 Double Cab 6AT',
    powertrainType: 'ICE',
    engineId: eng24d.id,
    transmissionId: auto6.id,
    drivetrainId: rwd.id,
    seatCount: 5,
    price: 899000,
  });
  await makeVariant({
    trimId: hiluxRocco,
    name: 'Double Cab Rocco 2.8 4WD 6AT',
    powertrainType: 'ICE',
    engineId: eng28d.id,
    transmissionId: auto6.id,
    drivetrainId: fourwd.id,
    seatCount: 5,
    price: 1350000,
  });

  // ── 4) Fortuner (PPV · PPV) ────────────────────────────────────
  const fortuner = await prisma.nameplate.create({
    data: {
      slug: 'fortuner',
      name: 'Fortuner',
      marketPresenceId: marketTH.id,
      segment: 'PPV',
      segmentStatus: 'known',
      lifecycleStatus: 'CURRENT',
      summary: 'PPV · ดีเซล 2.4/2.8',
    },
  });
  const fortunerGen = await prisma.generation.create({
    data: {
      nameplateId: fortuner.id,
      code: 'AN160',
      name: '2nd generation',
      launchYear: 2015,
      lifecycleStatus: 'CURRENT',
    },
  });
  const fortunerDeriv = await prisma.derivative.create({
    data: { generationId: fortunerGen.id, bodyType: 'PPV', name: 'PPV', doors: 5 },
  });
  const fortunerPhase = await prisma.phase.create({
    data: {
      derivativeId: fortunerDeriv.id,
      phaseType: 'FACELIFT',
      name: '2020 minorchange',
      sequence: 2,
    },
  });
  const fortuner24 = await makeTrim(fortunerPhase.id, '2.4');
  const fortunerLeg = await makeTrim(fortunerPhase.id, '2.8 Legender');
  const fortunerGr = await makeTrim(fortunerPhase.id, 'GR Sport');
  await makeVariant({
    trimId: fortuner24,
    name: '2.4 2WD 6AT',
    powertrainType: 'ICE',
    engineId: eng24d.id,
    transmissionId: auto6.id,
    drivetrainId: rwd.id,
    seatCount: 7,
    price: 1319000,
  });
  await makeVariant({
    trimId: fortunerLeg,
    name: '2.8 Legender 4WD 6AT',
    powertrainType: 'ICE',
    engineId: eng28d.id,
    transmissionId: auto6.id,
    drivetrainId: fourwd.id,
    seatCount: 7,
    price: 1799000,
  });
  await makeVariant({
    trimId: fortunerGr,
    name: '2.8 GR Sport 4WD 6AT',
    powertrainType: 'ICE',
    engineId: eng28d.id,
    transmissionId: auto6.id,
    drivetrainId: fourwd.id,
    seatCount: 7,
    price: 1899000,
  });

  // ── 5) bZ4X (SUV_COMPACT · SUV · BEV) ──────────────────────────
  const bz4x = await prisma.nameplate.create({
    data: {
      slug: 'bz4x',
      name: 'bZ4X',
      marketPresenceId: marketTH.id,
      segment: 'SUV_COMPACT',
      segmentStatus: 'known',
      lifecycleStatus: 'CURRENT',
      summary: 'SUV ไฟฟ้า (BEV) · แบต 71.4 kWh',
    },
  });
  const bz4xGen = await prisma.generation.create({
    data: {
      nameplateId: bz4x.id,
      name: '1st generation',
      launchYear: 2022,
      lifecycleStatus: 'CURRENT',
    },
  });
  const bz4xDeriv = await prisma.derivative.create({
    data: { generationId: bz4xGen.id, bodyType: 'SUV', name: 'SUV', doors: 5 },
  });
  const bz4xPhase = await prisma.phase.create({
    data: {
      derivativeId: bz4xDeriv.id,
      phaseType: 'INITIAL',
      name: 'Launch',
      sequence: 1,
    },
  });
  const bz4xPure = await makeTrim(bz4xPhase.id, 'Pure');
  const bz4xPremium = await makeTrim(bz4xPhase.id, 'Premium');
  const bz4xPureVr = await makeVariant({
    trimId: bz4xPure,
    name: 'Pure FWD',
    powertrainType: 'BEV',
    motorId: motorBz4x.id,
    batteryId: batBz4x.id,
    transmissionId: singleSpeed.id,
    drivetrainId: fwd.id,
    seatCount: 5,
    price: 1836000,
  });
  await makeVariant({
    trimId: bz4xPremium,
    name: 'Premium FWD',
    powertrainType: 'BEV',
    motorId: motorBz4x.id,
    batteryId: batBz4x.id,
    transmissionId: singleSpeed.id,
    drivetrainId: fwd.id,
    seatCount: 5,
    price: 1960000,
  });

  // ── ChangeEvents (evidence-first · ผูก nameplate + evidenceSource) ─
  await prisma.changeEvent.createMany({
    data: [
      {
        changeType: 'LAUNCH',
        title: 'Toyota bZ4X เปิดตัวในไทย',
        summary: 'เปิดตัว SUV ไฟฟ้ารุ่นแรกของ Toyota ในไทย',
        announcedDate: new Date('2022-10-31T00:00:00.000Z'),
        effectiveDate: new Date('2022-10-31T00:00:00.000Z'),
        brandId: toyota.id,
        nameplateId: bz4x.id,
        generationId: bz4xGen.id,
        evidenceSourceId: evidence.id,
      },
      {
        changeType: 'LAUNCH',
        title: 'Yaris Ativ ใหม่ (DNGA) เปิดตัว 2022',
        summary: 'เปลี่ยนโฉมใหม่บนแพลตฟอร์ม DNGA',
        announcedDate: new Date('2022-08-09T00:00:00.000Z'),
        brandId: toyota.id,
        nameplateId: yaris.id,
        generationId: yarisGen.id,
        evidenceSourceId: evidence.id,
      },
      {
        changeType: 'FACELIFT',
        title: 'Fortuner ไมเนอร์เชนจ์ 2020',
        summary: 'ปรับหน้าตา + เพิ่มรุ่น Legender/GR Sport',
        announcedDate: new Date('2020-06-04T00:00:00.000Z'),
        brandId: toyota.id,
        nameplateId: fortuner.id,
        generationId: fortunerGen.id,
        phaseId: fortunerPhase.id,
        evidenceSourceId: evidence.id,
      },
      {
        changeType: 'FACELIFT',
        title: 'Hilux Revo ไมเนอร์เชนจ์ 2020',
        summary: 'ปรับโฉม Revo + เพิ่มรุ่น Rocco',
        announcedDate: new Date('2020-06-04T00:00:00.000Z'),
        brandId: toyota.id,
        nameplateId: hilux.id,
        generationId: hiluxGen.id,
        phaseId: hiluxPhase.id,
        evidenceSourceId: evidence.id,
      },
      {
        changeType: 'PRICE_CHANGE',
        title: 'ปรับราคา Corolla Altis (seed demo)',
        summary: 'ตัวอย่างเหตุการณ์ปรับราคาสำหรับ prototype',
        beforeValue: '879,000',
        afterValue: '899,000',
        announcedDate: OBSERVED,
        effectiveDate: OBSERVED,
        brandId: toyota.id,
        nameplateId: corolla.id,
        variantRevisionId: corollaSportVr.id,
        evidenceSourceId: evidence.id,
      },
    ],
  });

  console.log('seed สำเร็จ ✓  (bZ4X Pure VR id:', bz4xPureVr.id, ')');
  void corollaSportVr;
}

main()
  .catch((e) => {
    console.error('seed ล้มเหลว:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
