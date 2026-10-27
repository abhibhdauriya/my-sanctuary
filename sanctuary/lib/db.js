import { createClient } from '@libsql/client';
const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});
export const DEFAULTS = {
  diary: [], media: [],
  links: { sheetId: '', sheetRange: 'Sheet1', streamlitUrl: '', audioUrl: '' },
  socials: { instagram: '', youtube: '', facebook: '', github: '' },
};
async function init() {
  await client.execute('CREATE TABLE IF NOT EXISTS kv (k TEXT PRIMARY KEY, v TEXT NOT NULL)');
}
export async function loadContent() {
  await init();
  const r = await client.execute({ sql: 'SELECT v FROM kv WHERE k = ?', args: ['content'] });
  return r.rows.length ? { ...DEFAULTS, ...JSON.parse(r.rows[0].v) } : DEFAULTS;
}
export async function saveContent(data) {
  await init();
  await client.execute({
    sql: 'INSERT INTO kv (k, v) VALUES (?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v',
    args: ['content', JSON.stringify(data)],
  });
}
