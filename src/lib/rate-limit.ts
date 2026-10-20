import { hashIP } from '@/lib/utils';
import { createServiceRoleClient } from '@/lib/supabase/server';

const IP_HASH_SALT = process.env.IP_HASH_SALT || 'gba_secure_salt_2026';
const MAX_REQUESTS_PER_WINDOW = 5;
const WINDOW_DURATION_MS = 60 * 60 * 1000; // 1 hour

// In-memory fallback if database rate limiting table is unavailable
const memoryRateLimits = new Map<string, { count: number; windowStart: number }>();

export async function checkRateLimit(ip: string, bucket: string = 'leads'): Promise<boolean> {
  const ipHash = hashIP(ip, IP_HASH_SALT);
  const now = Date.now();

  try {
    const supabase = createServiceRoleClient();
    const oneHourAgo = new Date(now - WINDOW_DURATION_MS).toISOString();

    // Query active rate limit window
    const { data, error } = await supabase
      .from('rate_limits')
      .select('id, count, window_start')
      .eq('ip_hash', ipHash)
      .eq('bucket', bucket)
      .gte('window_start', oneHourAgo)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    if (!data) {
      // First request in window
      await supabase.from('rate_limits').insert({
        ip_hash: ipHash,
        bucket,
        count: 1,
        window_start: new Date(now).toISOString(),
      });
      return true;
    }

    if (data.count >= MAX_REQUESTS_PER_WINDOW) {
      return false; // Rate limit exceeded
    }

    // Increment count
    await supabase
      .from('rate_limits')
      .update({ count: data.count + 1 })
      .eq('id', data.id);

    return true;
  } catch {
    // In-memory fallback
    const key = `${ipHash}:${bucket}`;
    const entry = memoryRateLimits.get(key);

    if (!entry || now - entry.windowStart > WINDOW_DURATION_MS) {
      memoryRateLimits.set(key, { count: 1, windowStart: now });
      return true;
    }

    if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
      return false;
    }

    entry.count += 1;
    return true;
  }
}
