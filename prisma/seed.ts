// CARMETA seed — ใส่ข้อมูลจริงที่ผ่านการ verify แล้วเท่านั้น (ดู prisma/seed-data.ts)
// กติกา: ทำงานเฉพาะฐานข้อมูลว่างเท่านั้น (append-only — ห้ามเขียนทับข้อมูลเดิม)
// รันผ่าน DIRECT_URL (Supabase pooler session 5432) จะเสถียรกว่า transaction pooler
//   npm run db:seed

import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { seedData } from "./seed-data";
import type { SeedVariant } from "./seed-types";
import {
  aspirationFromRaw,
  batteryChemistryFromRaw,
  fuelTypeFromRaw,
  motorLayoutFromRaw,
} from "./vocab";

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
});
const prisma = new PrismaClient({ adapter });

const date = (iso: string | undefined) => (iso ? new Date(iso) : undefined);

async function main() {
  const [brands, nameplates, sources] = await Promise.all([
    prisma.brand.count(),
    prisma.nameplate.count(),
    prisma.evidenceSource.count(),
  ]);
  if (brands > 0 || nameplates > 0 || sources > 0) {
    throw new Error(
      `ฐานข้อมูลไม่ว่าง (brand=${brands}, nameplate=${nameplates}, source=${sources}) — ` +
        "seed นี้ทำงานเฉพาะฐานว่างเพื่อรักษาหลัก append-only · ถ้าตั้งใจ reseed ให้ล้างฐานก่อนด้วยตัวเอง",
    );
  }

  const summary = await prisma.$transaction(
    async (tx) => {
      // 1) Evidence ledger — สร้างก่อน เพราะทุกราคาต้องอ้างถึง
      const evidenceIds = new Map<string, string>();
      for (const ev of seedData.evidences) {
        const created = await tx.evidenceSource.create({
          data: {
            sourceType: ev.sourceType,
            publisher: ev.publisher,
            title: ev.title,
            url: ev.url,
            publishedDate: date(ev.publishedDate),
            checkedDate: date(ev.checkedDate),
            checkedBy: "CARMETA data team (AI-assisted, human-directed)",
            confidence: ev.confidence,
            notes: ev.notes,
          },
        });
        evidenceIds.set(ev.key, created.id);
      }
      const evidenceId = (key: string): string => {
        const id = evidenceIds.get(key);
        if (!id) throw new Error(`ไม่พบ evidenceKey "${key}" ใน seed-data.evidences`);
        return id;
      };

      // 2) Brand + MarketPresence
      const brand = await tx.brand.create({
        data: {
          slug: seedData.brand.slug,
          name: seedData.brand.name,
          officialName: seedData.brand.officialName,
          countryOrigin: seedData.brand.countryOrigin,
          parentCompany: seedData.brand.parentCompany,
        },
      });
      const presence = await tx.marketPresence.create({
        data: {
          brandId: brand.id,
          market: seedData.marketPresence.market,
          distributorName: seedData.marketPresence.distributorName,
          importerName: seedData.marketPresence.importerName,
          channel: seedData.marketPresence.channel,
          operationFrom: date(seedData.marketPresence.operationFrom),
          notes: seedData.marketPresence.notes,
        },
      });
      for (const key of seedData.brandEvidenceKeys) {
        await tx.evidenceLink.create({
          data: {
            entityType: "BRAND",
            entityId: brand.id,
            field: "profile",
            evidenceSourceId: evidenceId(key),
          },
        });
      }

      // 3) Powertrain entities — dedup ด้วยลายเซ็น JSON ของสเปก
      const engineIds = new Map<string, string>();
      const motorIds = new Map<string, string>();
      const batteryIds = new Map<string, string>();
      const transmissionIds = new Map<string, string>();
      const drivetrainIds = new Map<string, string>();

      async function resolvePowertrain(variant: SeedVariant) {
        let engineId: string | undefined;
        if (variant.engine) {
          const sig = JSON.stringify(variant.engine);
          if (!engineIds.has(sig)) {
            const e = variant.engine;
            // แพตเทิร์นภาษากลาง (VOCABULARY.md §2.1): เก็บข้อความดิบที่ *Raw + map คำกลางด้วย vocab.ts
            // status=known เมื่อ map ได้ (ที่มาของ raw คือหน้า spec ทางการที่ verify แล้วระดับ generation/price)
            const fuel = fuelTypeFromRaw(e.fuelType);
            const asp = aspirationFromRaw(e.aspiration);
            const created = await tx.engine.create({
              data: {
                code: e.code,
                displacementCc: e.displacementCc,
                cylinders: e.cylinders,
                aspirationRaw: e.aspiration,
                aspiration: asp,
                aspirationStatus: asp != null ? "known" : "unknown",
                fuelTypeRaw: e.fuelType,
                fuelType: fuel,
                fuelTypeStatus: fuel != null ? "known" : "unknown",
                maxPowerPs: e.maxPowerPs,
                maxTorqueNm: e.maxTorqueNm,
                powerStatus: e.maxPowerPs != null ? "known" : "unknown",
              },
            });
            engineIds.set(sig, created.id);
          }
          engineId = engineIds.get(sig);
        }

        let motorId: string | undefined;
        if (variant.motor) {
          const sig = JSON.stringify(variant.motor);
          if (!motorIds.has(sig)) {
            const m = variant.motor;
            const created = await tx.motor.create({
              data: {
                count: m.count,
                maxPowerKw: m.maxPowerKw,
                maxTorqueNm: m.maxTorqueNm,
                locationRaw: m.location,
                layout: motorLayoutFromRaw(m.location),
                layoutStatus: motorLayoutFromRaw(m.location) != null ? "known" : "unknown",
                powerStatus: m.maxPowerKw != null ? "known" : "unknown",
              },
            });
            motorIds.set(sig, created.id);
          }
          motorId = motorIds.get(sig);
        }

        let batteryId: string | undefined;
        if (variant.battery) {
          const sig = JSON.stringify(variant.battery);
          if (!batteryIds.has(sig)) {
            const b = variant.battery;
            const created = await tx.battery.create({
              data: {
                chemistryRaw: b.chemistry,
                chemistry: batteryChemistryFromRaw(b.chemistry),
                chemistryStatus:
                  batteryChemistryFromRaw(b.chemistry) != null ? "known" : "unknown",
                capacityKwh: b.capacityKwh,
                capacityStatus: b.capacityKwh != null ? "known" : "unknown",
              },
            });
            batteryIds.set(sig, created.id);
          }
          batteryId = batteryIds.get(sig);
        }

        let transmissionId: string | undefined;
        if (variant.transmission) {
          const sig = JSON.stringify(variant.transmission);
          if (!transmissionIds.has(sig)) {
            const created = await tx.transmission.create({
              data: { type: variant.transmission.type, gears: variant.transmission.gears },
            });
            transmissionIds.set(sig, created.id);
          }
          transmissionId = transmissionIds.get(sig);
        }

        let drivetrainId: string | undefined;
        if (variant.drivetrain) {
          const sig = JSON.stringify(variant.drivetrain);
          if (!drivetrainIds.has(sig)) {
            const created = await tx.drivetrain.create({
              data: { type: variant.drivetrain.type },
            });
            drivetrainIds.set(sig, created.id);
          }
          drivetrainId = drivetrainIds.get(sig);
        }

        return { engineId, motorId, batteryId, transmissionId, drivetrainId };
      }

      // 4) Taxonomy + ราคา
      const nameplateIds = new Map<string, string>();
      let variantCount = 0;
      let priceCount = 0;

      for (const np of seedData.nameplates) {
        const nameplate = await tx.nameplate.create({
          data: {
            slug: np.slug,
            name: np.name,
            marketPresenceId: presence.id,
            segment: np.segment,
            segmentStatus: np.segment ? "known" : "unknown",
            lifecycleStatus: np.lifecycleStatus,
            summary: np.summary,
          },
        });
        nameplateIds.set(np.slug, nameplate.id);

        for (const gen of np.generations) {
          const generation = await tx.generation.create({
            data: {
              nameplateId: nameplate.id,
              code: gen.code,
              name: gen.name,
              launchYear: gen.launchYear,
              summary: gen.summary,
            },
          });
          for (const key of gen.evidenceKeys ?? []) {
            await tx.evidenceLink.create({
              data: {
                entityType: "GENERATION",
                entityId: generation.id,
                field: "code/launchYear",
                evidenceSourceId: evidenceId(key),
              },
            });
          }

          for (const der of gen.derivatives) {
            const derivative = await tx.derivative.create({
              data: { generationId: generation.id, bodyType: der.bodyType, name: der.name },
            });

            for (const [phaseIndex, ph] of der.phases.entries()) {
              const phase = await tx.phase.create({
                data: {
                  derivativeId: derivative.id,
                  phaseType: ph.phaseType,
                  name: ph.name,
                  sequence: phaseIndex + 1,
                  effectiveFrom: date(ph.effectiveFrom),
                },
              });

              for (const tr of ph.trims) {
                const trim = await tx.trim.create({
                  data: { phaseId: phase.id, name: tr.name },
                });

                for (const v of tr.variants) {
                  const powertrain = await resolvePowertrain(v);
                  const variant = await tx.variantRevision.create({
                    data: {
                      trimId: trim.id,
                      name: v.name,
                      powertrainType: v.powertrainType,
                      modelYear: v.modelYear,
                      modelYearStatus: v.modelYear != null ? "known" : "unknown",
                      seatCount: v.seatCount,
                      seatCountStatus: v.seatCount != null ? "known" : "unknown",
                      notes: v.notes,
                      engineId: powertrain.engineId,
                      motorId: powertrain.motorId,
                      batteryId: powertrain.batteryId,
                      transmissionId: powertrain.transmissionId,
                      drivetrainId: powertrain.drivetrainId,
                    },
                  });
                  variantCount += 1;

                  await tx.officialPriceObservation.create({
                    data: {
                      variantRevisionId: variant.id,
                      priceType: "OFFICIAL_LIST_PRICE",
                      currency: "THB",
                      amount: v.price.amount,
                      amountStatus: "known",
                      observedDate: new Date(v.price.observedDate),
                      effectiveFrom: date(v.price.effectiveFrom),
                      notes: v.price.notes,
                      evidenceSourceId: evidenceId(v.price.evidenceKey),
                    },
                  });
                  priceCount += 1;
                }
              }
            }
          }
        }
      }

      // 5) Change events (เฉพาะที่มีหลักฐาน)
      for (const ce of seedData.changeEvents) {
        const nameplateId = nameplateIds.get(ce.nameplateSlug);
        if (!nameplateId) {
          throw new Error(`ChangeEvent อ้าง nameplateSlug "${ce.nameplateSlug}" ที่ไม่มีใน seed`);
        }
        await tx.changeEvent.create({
          data: {
            changeType: ce.changeType,
            title: ce.title,
            summary: ce.summary,
            beforeValue: ce.beforeValue,
            afterValue: ce.afterValue,
            announcedDate: date(ce.announcedDate),
            effectiveDate: date(ce.effectiveDate),
            nameplateId,
            evidenceSourceId: evidenceId(ce.evidenceKey),
          },
        });
      }

      return {
        evidences: seedData.evidences.length,
        nameplates: seedData.nameplates.length,
        variants: variantCount,
        prices: priceCount,
        changeEvents: seedData.changeEvents.length,
      };
    },
    { timeout: 120_000 },
  );

  console.log("✅ seed สำเร็จ:", summary);
}

main()
  .catch((err) => {
    console.error("❌ seed ล้มเหลว — rollback ทั้งชุด:", err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
