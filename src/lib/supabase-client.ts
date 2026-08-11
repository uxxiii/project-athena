import { createClient } from '@supabase/supabase-js';

interface SupabaseClientLike {
  from: (table: string) => {
    select: (columns: string) => Promise<{ data: unknown; error: unknown }>;
    upsert: (
      rows: Array<{ id: string; data: unknown }>,
      options: { onConflict: string; ignoreDuplicates: boolean }
    ) => Promise<{ error: unknown }>;
  };
}

export interface SupabaseConfig {
  enabled: boolean;
  url?: string;
  serviceRoleKey?: string;
  client?: SupabaseClientLike;
}

export function buildSupabaseConfig(env: Record<string, string | undefined> = process.env): SupabaseConfig {
  const url = env.SUPABASE_URL?.trim();
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !serviceRoleKey) {
    return { enabled: false };
  }

  const client = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  }) as unknown as SupabaseClientLike;

  return {
    enabled: true,
    url,
    serviceRoleKey,
    client,
  };
}

export const supabaseConfig = buildSupabaseConfig();
export const supabase = supabaseConfig.client;
