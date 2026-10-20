import { createServerSupabaseClient } from '@/lib/supabase/server';
import { AssetsManager } from '@/components/admin/assets-manager';

export const dynamic = 'force-dynamic';

export default async function AdminAssetsPage() {
  const supabase = await createServerSupabaseClient();

  const { data: assets } = await supabase
    .from('site_assets')
    .select('*');

  return <AssetsManager initialAssets={assets || []} />;
}
