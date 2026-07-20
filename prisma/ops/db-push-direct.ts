// รัน prisma db push ผ่าน DIRECT_URL (5432) — pooler 6543 ใช้กับ prisma CLI ไม่ได้ (ค้าง — ดู PROGRESS.md)
// ส่ง URL ผ่าน --url จาก .env โดยตรง ไม่พิมพ์ค่า URL ออก log
import "dotenv/config";
import { spawnSync } from "node:child_process";

const direct = process.env.DIRECT_URL;
if (!direct) throw new Error("DIRECT_URL missing in .env");
const extra = process.argv.slice(2);
const res = spawnSync("npx", ["prisma", "db", "push", "--url", direct, ...extra], {
  stdio: "inherit",
  env: process.env as NodeJS.ProcessEnv,
});
process.exit(res.status ?? 1);
