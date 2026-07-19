// Prisma client singleton — กัน hot-reload สร้าง client ซ้ำจน connection leak (dev)
// Prisma 7 ใช้ driver adapter: ต่อ Supabase Postgres ผ่าน PrismaPg + DATABASE_URL
import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL ?? '',
});

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
