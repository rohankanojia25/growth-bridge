import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { SupabaseClient } from '@supabase/supabase-js';

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return false;
  if (url.includes('placeholder') || url === 'https://placeholder.supabase.co') return false;
  return true;
}

export function createEmptySupabaseProxy(): any {
  const dummyResult = { data: null, error: null, count: null };

  const handler: ProxyHandler<any> = {
    get(_target, prop) {
      if (prop === 'then') {
        return (resolve: (val: any) => void) => resolve(dummyResult);
      }
      if (prop === 'catch') {
        return () => Promise.resolve(dummyResult);
      }
      if (prop === 'auth') {
        return {
          getUser: async () => ({ data: { user: null }, error: null }),
          getSession: async () => ({ data: { session: null }, error: null }),
          signOut: async () => ({ error: null }),
        };
      }
      return new Proxy(() => {}, handler);
    },
    apply() {
      return new Proxy(() => {}, handler);
    },
  };

  return new Proxy(() => {}, handler);
}

/**
 * Public client for static & ISR pages.
 * DOES NOT call cookies(), allowing Next.js to prerender and cache at Vercel CDN Edge.
 */
export function createPublicSupabaseClient(): SupabaseClient<any, "public", any> {
  if (!isSupabaseConfigured()) {
    return createEmptySupabaseProxy() as unknown as SupabaseClient<any, "public", any>;
  }

  const { createClient } = require('@supabase/supabase-js');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Authenticated client for server components that need user session (Admin portal).
 * Reads and sets cookies.
 */
export async function createServerSupabaseClient(): Promise<SupabaseClient<any, "public", any>> {
  if (!isSupabaseConfigured()) {
    return createEmptySupabaseProxy() as unknown as SupabaseClient<any, "public", any>;
  }

  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing sessions.
        }
      },
    },
  });
}

/**
 * Service role client for API route handlers and server actions with full DB privileges.
 */
export function createServiceRoleClient(): SupabaseClient<any, "public", any> {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!isSupabaseConfigured() || !serviceKey || serviceKey.includes('placeholder')) {
    return createEmptySupabaseProxy() as unknown as SupabaseClient<any, "public", any>;
  }

  const { createClient } = require('@supabase/supabase-js');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

  return createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
