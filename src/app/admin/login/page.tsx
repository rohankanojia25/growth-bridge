'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Lock, AlertCircle } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const nextParam = searchParams.get('next');
  const errorParam = searchParams.get('error');

  useEffect(() => {
    if (errorParam === 'unauthorized') {
      setErrorMessage('Access denied. Your account is not registered as an administrator.');
    }
  }, [errorParam]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error('Authentication failed.');
      }

      // Check admin status in admin_users table
      const { data: adminRecord, error: adminErr } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', data.user.id)
        .maybeSingle();

      if (adminErr || !adminRecord) {
        await supabase.auth.signOut();
        throw new Error('You do not have administrative privileges for Growth Bridge.');
      }

      let destination = '/admin/dashboard';
      if (nextParam && nextParam.startsWith('/admin') && !nextParam.startsWith('//')) {
        destination = nextParam;
      }

      router.push(destination);
      router.refresh();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Invalid login credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-md rounded-3xl border-gradient bg-surface p-8 sm:p-10 shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-green/10 border border-green/30 flex items-center justify-center text-green mx-auto mb-2">
          <Lock className="w-6 h-6" />
        </div>
        <Eyebrow pill>Restricted Access</Eyebrow>
        <h1 className="text-h2 text-2xl text-text">Admin Login</h1>
        <p className="text-xs text-text-muted">
          Growth Bridge Accelerator management portal.
        </p>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="rounded-xl border border-danger/40 bg-danger/10 p-3.5 text-xs text-danger flex items-start gap-2.5"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          id="admin-email"
          type="email"
          label="Admin Email"
          placeholder="admin@growthbridgeaccelerator.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          id="admin-pass"
          type="password"
          label="Password"
          placeholder="••••••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="pt-2">
          <Button type="submit" className="w-full" loading={loading} showArrow>
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </Button>
        </div>
      </form>

      <div className="text-center pt-2 border-t border-border">
        <p className="text-[11px] text-text-dim">
          Credentials managed via Supabase Auth & admin_users RLS.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="fixed inset-0 z-50 bg-bg flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />
      <div
        className="orb orb-green top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] pointer-events-none opacity-20"
        aria-hidden="true"
      />
      <Suspense fallback={<div className="text-sm text-text-muted">Loading login...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
