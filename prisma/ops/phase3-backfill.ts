// Phase 3 (VOCABULARY.md §2.1/§5): gradeCode + range + charging spec + HybridArchitecture
// ดึงจาก notes ที่จดจากหน้าทางการไว้แล้ว (ไม่ใช่ข้อมูลใหม่ — แค่ยกให้ query ได้) + EvidenceLink คู่ทุกจุด
import "dotenv/config";
import { prisma } from "../../src/lib/prisma";

async function officialEvidenceOf(variantId: string): Promise<string | null> {
  const obs = await prisma.officialPriceObservation.findFirst({
    where: { variantRevisionId: variantId, evidenceSource: { sourceType: "MANUFACTURER_OFFICIAL" } },
    select: { evidenceSourceId: true },
  });
  return obs?.evidenceSourceId ?? null;
}

async function linkOnce(entityType: "VARIANT_REVISION" | "BATTERY", entityId: string, field: string, evidenceSourceId: string, note: string) {
  const existing = await prisma.evidenceLink.findFirst({ where: { entityType, entityId, field, evidenceSourceId } });
  if (existing) return;
  await prisma.evidenceLink.create({ data: { entityType, entityId, field, note, evidenceSourceId } });
}

async function main() {
  const editorial = await prisma.evidenceSource.findFirstOrThrow({
    where: { sourceType: "EDITORIAL", documentRef: "VOCABULARY.md rev.1" },
  });

  const variants = await prisma.variantRevision.findMany({ include: { battery: true } });
  let gradeCount = 0;
  let rangeCount = 0;
  const batteryCharge = new Map<string, { ac: number | null; acPort: "TYPE_2" | null; dc: number | null; dcPort: "CCS2" | null; evidence: string | null }[]>();

  for (const v of variants) {
    const notes = v.notes ?? "";
    const ev = await officialEvidenceOf(v.id);

    // 1) gradeCode — "grade_code ทางการ XEAM11R-MWDHQW/N4" / "grade_code ZRE211R-GEXGKT/C4"
    const grade = notes.match(/grade_code (?:ทางการ )?([A-Z0-9][A-Z0-9\-/]+)/);
    if (grade && !v.gradeCode) {
      await prisma.variantRevision.update({ where: { id: v.id }, data: { gradeCode: grade[1] } });
      if (ev) await linkOnce("VARIANT_REVISION", v.id, "gradeCode", ev, `รหัสรุ่นทางการจากหน้าสเปก (เดิมจดใน notes): ${grade[1]}`);
      gradeCount++;
    }

    // 2) ระยะทาง — เก็บเฉพาะมาตรฐานที่แหล่งประกาศตรงๆ ห้ามแปลงข้าม (no false precision)
    const nedc = notes.match(/NEDC (\d+(?:\.\d+)?) กม/);
    if (nedc && ["BEV", "PHEV", "EREV"].includes(v.powertrainType)) {
      await prisma.variantRevision.update({
        where: { id: v.id },
        data: { rangeKmNedc: parseFloat(nedc[1]), rangeKmNedcStatus: ev ? "known" : "unknown" },
      });
      if (ev) await linkOnce("VARIANT_REVISION", v.id, "rangeKmNedc", ev, `ระยะทาง NEDC ${nedc[1]} กม. ตามหน้าทางการ (เดิมจดใน notes) — ห้ามเทียบกับตัวเลข WLTP/CLTC`);
      rangeCount++;
    }

    // 3) สเปกชาร์จ (บน Battery — รวบรวมก่อน กันค่าขัดแย้งเมื่อ battery ถูกแชร์)
    if (v.batteryId) {
      const ac = notes.match(/AC Type 2 สูงสุด (\d+(?:\.\d+)?) kW/);
      const dc = notes.match(/DC CCS2 สูงสุด (\d+(?:\.\d+)?) kW/);
      if (ac || dc) {
        const list = batteryCharge.get(v.batteryId) ?? [];
        list.push({
          ac: ac ? parseFloat(ac[1]) : null,
          acPort: ac ? "TYPE_2" : null,
          dc: dc ? parseFloat(dc[1]) : null,
          dcPort: dc ? "CCS2" : null,
          evidence: ev,
        });
        batteryCharge.set(v.batteryId, list);
      }
    }

    // 4) HybridArchitecture
    if (v.powertrainType === "HEV") {
      // Toyota full hybrid = THS power-split — หน้าทางการระบุ E-CVT + จัดประเภทตาม §6 (editorial)
      await prisma.variantRevision.update({
        where: { id: v.id },
        data: { hybridArchitecture: "POWER_SPLIT", hybridArchitectureStatus: ev ? "known" : "unknown" },
      });
      if (ev) {
        await linkOnce("VARIANT_REVISION", v.id, "hybridArchitecture", ev, "หน้าทางการระบุระบบ full hybrid + เกียร์ E-CVT");
        await linkOnce("VARIANT_REVISION", v.id, "hybridArchitecture", editorial.id, "จัดเป็น POWER_SPLIT (Toyota THS) ตามนิยาม §6 — ≠ Honda e:HEV (series-parallel)");
      }
    } else if (v.powertrainType === "ICE" || v.powertrainType === "BEV") {
      await prisma.variantRevision.update({
        where: { id: v.id },
        data: { hybridArchitectureStatus: "not_applicable" },
      });
    }
  }

  // apply battery charging (ตรวจความสอดคล้องเมื่อแชร์)
  for (const [batteryId, entries] of batteryCharge) {
    const acVals = [...new Set(entries.map((e) => e.ac).filter((x): x is number => x != null))];
    const dcVals = [...new Set(entries.map((e) => e.dc).filter((x): x is number => x != null))];
    if (acVals.length > 1 || dcVals.length > 1) {
      console.log(`⚠️ battery ${batteryId.slice(-6)}: ค่าชาร์จขัดแย้งกันระหว่าง variant ที่แชร์ — ข้าม (ต้องตรวจมือ)`, acVals, dcVals);
      continue;
    }
    const ev = entries.find((e) => e.evidence)?.evidence ?? null;
    await prisma.battery.update({
      where: { id: batteryId },
      data: {
        acMaxKw: acVals[0] ?? null,
        acChargePort: acVals.length ? "TYPE_2" : null,
        acStatus: acVals.length && ev ? "known" : "unknown",
        dcMaxKw: dcVals[0] ?? null,
        dcChargePort: dcVals.length ? "CCS2" : null,
        dcStatus: dcVals.length && ev ? "known" : "unknown",
      },
    });
    if (ev) {
      if (acVals.length) await linkOnce("BATTERY", batteryId, "acCharging", ev, `AC Type 2 สูงสุด ${acVals[0]} kW ตามหน้าทางการ (เดิมจดใน notes)`);
      if (dcVals.length) await linkOnce("BATTERY", batteryId, "dcCharging", ev, `DC CCS2 สูงสุด ${dcVals[0]} kW ตามหน้าทางการ (เดิมจดใน notes)`);
    }
    console.log(`battery ${batteryId.slice(-6)}: AC ${acVals[0] ?? "-"} kW · DC ${dcVals[0] ?? "-"} kW`);
  }

  const summary = {
    gradeCodes: gradeCount,
    nedcRanges: rangeCount,
    hevPowerSplit: await prisma.variantRevision.count({ where: { hybridArchitecture: "POWER_SPLIT" } }),
    notApplicableArch: await prisma.variantRevision.count({ where: { hybridArchitectureStatus: "not_applicable" } }),
    evidenceLinks: await prisma.evidenceLink.count(),
  };
  console.log("สรุป Phase 3:", JSON.stringify(summary));
}
main().finally(() => prisma.$disconnect());
