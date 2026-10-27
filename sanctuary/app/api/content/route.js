import { NextResponse } from 'next/server';
import { loadContent, saveContent } from '@/lib/db';
import { timingSafeEqual } from 'crypto';
export const dynamic = 'force-dynamic';

function pinOk(req) {
  const given = Buffer.from(req.headers.get('x-admin-pin') || '');
  const real = Buffer.from(process.env.ADMIN_PIN || '');
  return real.length > 0 && given.length === real.length && timingSafeEqual(given, real);
}
export async function GET() {
  try { return NextResponse.json(await loadContent()); }
  catch (e) { return NextResponse.json({ error: 'DB error: ' + e.message }, { status: 500 }); }
}
export async function POST(req) {
  if (!pinOk(req)) return NextResponse.json({ error: 'Wrong PIN' }, { status: 401 });
  const body = await req.json();
  if (body.action === 'verify') return NextResponse.json({ ok: true });
  const { diary, media, links, socials } = body;
  await saveContent({ diary: diary || [], media: media || [], links: links || {}, socials: socials || {} });
  return NextResponse.json({ ok: true });
}
