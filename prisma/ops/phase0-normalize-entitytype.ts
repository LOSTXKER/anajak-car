// Phase 0 (VOCABULARY.md §2.0): normalize ค่า polymorphic entityType เป็น enum label ก่อน ALTER TYPE
import "dotenv/config";
import { prisma } from "../../src/lib/prisma";

async function main() {
  const a = await prisma.$executeRawUnsafe(
    `UPDATE "EvidenceLink" SET "entityType" = 'BRAND' WHERE "entityType" = 'Brand'`,
  );
  const b = await prisma.$executeRawUnsafe(
    `UPDATE "EvidenceLink" SET "entityType" = 'GENERATION' WHERE "entityType" = 'Generation'`,
  );
  console.log(`updated: Brand→BRAND ${a} แถว · Generation→GENERATION ${b} แถว`);
  const check = await prisma.$queryRawUnsafe(
    `SELECT "entityType", count(*) FROM "EvidenceLink" GROUP BY "entityType"`,
  );
  console.log("หลัง update:", JSON.stringify(check, (_, v) => (typeof v === "bigint" ? Number(v) : v)));
}
main().finally(() => prisma.$disconnect());
