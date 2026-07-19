// Supabase client (browser/anon) — ใช้ env public keys · ต่อ Supabase Postgres/Auth/Storage
// หมายเหตุ: การอ่าน/เขียน DB หลักผ่าน Prisma (src/lib/prisma.ts) · client นี้ไว้ auth/storage/realtime
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
