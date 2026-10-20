import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const target =
    'https://wa.me/918883838363?text=Hi%20Growth%20Bridge%20Accelerator%2C%20I%20want%20to%20discuss%20my%20business';

  return NextResponse.redirect(target, 302);
}
