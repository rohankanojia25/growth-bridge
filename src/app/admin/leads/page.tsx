import { Suspense } from 'react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { LeadsManager } from '@/components/admin/leads-manager';

export const dynamic = 'force-dynamic';

export default async function AdminLeadsPage() {
  const supabase = await createServerSupabaseClient();

  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <Suspense fallback={<div className="text-sm text-text-muted">Loading leads...</div>}>
      <LeadsManager initialLeads={leads || []} />
    </Suspense>
  );
}
