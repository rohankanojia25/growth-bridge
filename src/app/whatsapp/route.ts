import { NextRequest, NextResponse } from 'next/server';
import {
  PATH_IDEA_WHATSAPP_TEXT,
  PATH_BUSINESS_WHATSAPP_TEXT,
  DEFAULT_WHATSAPP_TEXT,
} from '@/lib/config';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get('topic');

  let text = DEFAULT_WHATSAPP_TEXT;
  if (topic === 'idea') {
    text = PATH_IDEA_WHATSAPP_TEXT;
  } else if (topic === 'business') {
    text = PATH_BUSINESS_WHATSAPP_TEXT;
  }

  const target = `https://wa.me/918883838363?text=${encodeURIComponent(text)}`;

  return NextResponse.redirect(target, 302);
}
