import { createServerSupabaseClient } from '@/lib/supabase/server';
import { BookingsManager } from '@/components/admin/bookings-manager';

export const dynamic = 'force-dynamic';

export default async function AdminBookingsPage() {
  const supabase = await createServerSupabaseClient();

  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      id,
      slot_start,
      slot_end,
      meeting_mode,
      meet_link,
      status,
      public_token,
      created_at,
      leads:lead_id (
        name,
        phone,
        email,
        service,
        business_name
      )
    `)
    .order('slot_start', { ascending: false });

  return <BookingsManager initialBookings={(bookings as any) || []} />;
}
