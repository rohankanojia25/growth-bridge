import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get('date');

  if (!dateParam || !/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
    return NextResponse.json({ error: 'Valid date query required (YYYY-MM-DD)' }, { status: 400 });
  }

  try {
    const supabase = createServiceRoleClient();

    // Query booked slots for the requested date (in UTC range covering IST day)
    // IST is UTC+5:30. Day begins at 00:00 IST = previous day 18:30 UTC
    // Day ends at 23:59 IST = current day 18:29 UTC
    const startRange = `${dateParam}T00:00:00+05:30`;
    const endRange = `${dateParam}T23:59:59+05:30`;

    const { data: bookedRows } = await supabase
      .from('bookings')
      .select('slot_start, slot_end')
      .gte('slot_start', new Date(startRange).toISOString())
      .lte('slot_start', new Date(endRange).toISOString())
      .neq('status', 'cancelled');

    const bookedStarts = new Set(
      (bookedRows || []).map((b: { slot_start: string; slot_end: string }) =>
        new Date(b.slot_start).toISOString()
      )
    );

    // Generate 30-minute intervals between 10:00 and 18:30 IST
    const slots = [];
    const now = new Date();

    for (let hour = 10; hour <= 18; hour++) {
      for (const minute of [0, 30]) {
        // Stop after 18:30 slot (finishes at 19:00)
        if (hour === 18 && minute > 30) continue;

        const hh = String(hour).padStart(2, '0');
        const mm = String(minute).padStart(2, '0');

        // ISO string with IST offset (+05:30)
        const startString = `${dateParam}T${hh}:${mm}:00+05:30`;
        const startDate = new Date(startString);

        const endMinute = minute === 30 ? 0 : 30;
        const endHour = minute === 30 ? hour + 1 : hour;
        const endString = `${dateParam}T${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}:00+05:30`;
        const endDate = new Date(endString);

        // Format label in 12-hour format
        const hour12 = hour % 12 || 12;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const timeLabel = `${hour12}:${String(minute).padStart(2, '0')} ${ampm}`;

        const isPast = startDate.getTime() <= now.getTime();
        const isBooked = bookedStarts.has(startDate.toISOString());

        slots.push({
          time: timeLabel,
          isoStart: startDate.toISOString(),
          isoEnd: endDate.toISOString(),
          available: !isPast && !isBooked,
        });
      }
    }

    return NextResponse.json({ date: dateParam, slots });
  } catch (err) {
    console.error('Availability check failed:', err);
    return NextResponse.json({ error: 'Failed to check availability' }, { status: 500 });
  }
}
