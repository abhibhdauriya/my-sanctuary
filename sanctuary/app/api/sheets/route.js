import { NextResponse } from 'next/server';
import { loadContent } from '@/lib/db';
export const dynamic = 'force-dynamic';

function parseCsv(t) {
  const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) { if (c === '"' && t[i + 1] === '"') { cell += '"'; i++; } else if (c === '"') q = false; else cell += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (c !== '\r') cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}
export async function GET() {
  const { links } = await loadContent();
  const id = links.sheetId;
  if (!id) return NextResponse.json({ rows: [] });
  try {
    const key = process.env.GOOGLE_API_KEY;
    if (key) {
      const range = encodeURIComponent(links.sheetRange || 'Sheet1');
      const r = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${range}?key=${key}`, { cache: 'no-store' });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error?.message || 'Sheets API error');
      return NextResponse.json({ rows: j.values || [] });
    }
    const r = await fetch(`https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(links.sheetRange || 'Sheet1')}`, { cache: 'no-store' });
    if (!r.ok) throw new Error('Sheet not public or ID wrong');
    return NextResponse.json({ rows: parseCsv(await r.text()) });
  } catch (e) { return NextResponse.json({ rows: [], error: e.message }, { status: 502 }); }
}
