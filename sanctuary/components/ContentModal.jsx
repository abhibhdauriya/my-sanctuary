'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const yt = (u) => { const m = u.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/); return m ? `https://www.youtube.com/embed/${m[1]}` : null; };

function Diary({ items }) {
  if (!items.length) return <p className="opacity-70">No entries yet. Open the admin panel (Ctrl + Shift + A) to write the first one.</p>;
  return [...items].sort((a, b) => (b.date || '').localeCompare(a.date || '')).map((d, i) => (
    <article key={i} className="mb-8">
      <time className="ui text-xs opacity-60">{d.date}</time>
      <h3 className="text-2xl mt-1">{d.milestone && '★ '}{d.title}</h3>
      <p className="mt-2 leading-7 whitespace-pre-wrap max-w-[68ch]">{d.body}</p>
      <div className="mt-2 flex gap-2 flex-wrap">{(d.tags || []).map((t) => <span key={t} className="ui text-xs px-2 py-0.5 rounded-full border border-cyan-400/30">{t}</span>)}</div>
    </article>
  ));
}

function Data({ links }) {
  const [rows, setRows] = useState(null); const [err, setErr] = useState('');
  useEffect(() => {
    if (!links.sheetId) { setRows([]); return; }
    fetch('/api/sheets').then((r) => r.json()).then((j) => { setRows(j.rows || []); setErr(j.error || ''); }).catch(() => setErr('Could not load sheet'));
  }, [links.sheetId]);
  return (<div className="ui">
    {err && <p className="text-rose-300 mb-3">{err}</p>}
    {rows === null ? <p>Loading sheet…</p> : rows.length > 0 ? (
      <div className="overflow-x-auto mb-6"><table className="text-sm w-full">
        <thead><tr>{rows[0].map((h, i) => <th key={i} className="text-left p-2 border-b border-white/20">{h}</th>)}</tr></thead>
        <tbody>{rows.slice(1).map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className="p-2 border-b border-white/10">{c}</td>)}</tr>)}</tbody>
      </table></div>
    ) : <p className="opacity-70 mb-6">No sheet connected yet.</p>}
    {links.streamlitUrl && <iframe src={links.streamlitUrl} className="w-full h-[60vh] rounded-lg border border-white/10" title="Streamlit app" />}
  </div>);
}

function Media({ items }) {
  if (!items.length) return <p className="opacity-70">No media yet.</p>;
  const vids = items.filter((m) => m.type === 'video'), pics = items.filter((m) => m.type !== 'video');
  return (<div>
    {vids.map((v, i) => (<div key={i} className="mb-6">
      {yt(v.url) ? <iframe src={yt(v.url)} className="w-full aspect-video rounded-lg" allowFullScreen title={v.title} /> : <video src={v.url} controls className="w-full rounded-lg" />}
      <h4 className="mt-2 text-lg">{v.title}</h4><p className="opacity-70 text-sm">{v.desc}</p>
    </div>))}
    <div style={{ columnWidth: 180, columnGap: 12 }}>
      {pics.map((p, i) => (<figure key={i} className="mb-3 break-inside-avoid">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.url} alt={p.title} loading="lazy" className="w-full rounded-lg" />
        <figcaption className="ui text-xs opacity-70 mt-1">{p.title}</figcaption>
      </figure>))}
    </div>
  </div>);
}

export default function ContentModal({ view, data, onClose }) {
  const titles = { diary: 'Diary & life lessons', data: 'Data terminal', media: 'Media' };
  return (
    <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 240 }}
      className="glass fixed z-30 right-0 top-0 h-full w-full md:w-[480px] max-md:top-auto max-md:h-[78vh] max-md:rounded-t-2xl p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl">{titles[view]}</h2>
        <button className="btn" onClick={onClose} aria-label="Close"><X size={16} /></button>
      </div>
      {view === 'diary' && <Diary items={data.diary} />}
      {view === 'data' && <Data links={data.links} />}
      {view === 'media' && <Media items={data.media} />}
    </motion.aside>
  );
}
