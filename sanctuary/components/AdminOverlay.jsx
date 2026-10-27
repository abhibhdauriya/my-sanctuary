'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Trash2 } from 'lucide-react';

const TABS = ['Diary', 'Data links', 'Media', 'Socials'];
const blankDiary = { title: '', body: '', tags: [], date: new Date().toISOString().slice(0, 10), milestone: false };
const blankMedia = { type: 'photo', url: '', title: '', desc: '' };

export default function AdminOverlay({ data, onClose, onSaved }) {
  const [pin, setPin] = useState(''); const [ok, setOk] = useState(false);
  const [draft, setDraft] = useState(() => JSON.parse(JSON.stringify(data)));
  const [tab, setTab] = useState(0); const [msg, setMsg] = useState('');

  const post = (body, p = pin) => fetch('/api/content', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-pin': p }, body: JSON.stringify(body) });
  const unlock = async () => {
    const r = await post({ action: 'verify' });
    if (r.ok) { setOk(true); setMsg(''); } else { setMsg('Wrong PIN'); setPin(''); }
  };
  const save = async () => {
    const r = await post(draft);
    if (r.ok) { setMsg('Saved'); onSaved(draft); } else setMsg('Save failed');
  };
  const upd = (path, val) => setDraft((d) => { const n = { ...d }; let o = n; for (let i = 0; i < path.length - 1; i++) { o[path[i]] = Array.isArray(o[path[i]]) ? [...o[path[i]]] : { ...o[path[i]] }; o = o[path[i]]; } o[path[path.length - 1]] = val; return n; });
  const list = (key, blank) => ({
    add: () => upd([key], [...draft[key], { ...blank }]),
    del: (i) => upd([key], draft[key].filter((_, j) => j !== i)),
  });

  const shell = (children) => (
    <motion.div initial={{ y: '-100%' }} animate={{ y: 0 }} exit={{ y: '-100%' }} transition={{ type: 'spring', damping: 26, stiffness: 220 }}
      className="glass ui fixed z-40 inset-x-0 top-0 max-h-[92vh] overflow-y-auto p-5 md:mx-auto md:max-w-3xl md:rounded-b-2xl">
      <div className="flex justify-between mb-4"><h2 className="text-lg">Admin</h2><button className="btn" onClick={onClose} aria-label="Close"><X size={16} /></button></div>
      {children}
    </motion.div>
  );

  if (!ok) return shell(
    <div className="max-w-[240px] mx-auto text-center">
      <div className="text-2xl tracking-[.4em] h-9">{'•'.repeat(pin.length)}</div>
      <div className="grid grid-cols-3 gap-2 my-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, 'OK'].map((k) => (
          <button key={k} className="btn" onClick={() => k === 'C' ? setPin('') : k === 'OK' ? unlock() : setPin(pin + k)}>{k}</button>
        ))}
      </div>
      <p className="text-rose-300 text-sm h-5">{msg}</p>
    </div>
  );

  const diary = list('diary', blankDiary), media = list('media', blankMedia);
  return shell(<>
    <div className="flex gap-2 mb-4 flex-wrap">{TABS.map((t, i) => <button key={t} className="btn" style={i === tab ? { background: 'rgba(34,211,238,.28)' } : {}} onClick={() => setTab(i)}>{t}</button>)}</div>

    {tab === 0 && <div className="space-y-4">
      {draft.diary.map((d, i) => (<div key={i} className="p-3 rounded-lg border border-white/10 space-y-2">
        <div className="flex gap-2"><input className="inp" placeholder="Title" value={d.title} onChange={(e) => upd(['diary', i, 'title'], e.target.value)} />
          <input className="inp !w-40" type="date" value={d.date} onChange={(e) => upd(['diary', i, 'date'], e.target.value)} /></div>
        <textarea className="inp" rows={5} placeholder="Write here (plain text / markdown)" value={d.body} onChange={(e) => upd(['diary', i, 'body'], e.target.value)} />
        <div className="flex gap-2 items-center"><input className="inp" placeholder="tags, comma separated" value={(d.tags || []).join(', ')} onChange={(e) => upd(['diary', i, 'tags'], e.target.value.split(',').map((t) => t.trim()).filter(Boolean))} />
          <label className="whitespace-nowrap text-sm"><input type="checkbox" checked={!!d.milestone} onChange={(e) => upd(['diary', i, 'milestone'], e.target.checked)} /> Milestone</label>
          <button className="btn" onClick={() => diary.del(i)} aria-label="Delete entry"><Trash2 size={14} /></button></div>
      </div>))}
      <button className="btn" onClick={diary.add}><Plus size={14} className="inline" /> New entry</button>
    </div>}

    {tab === 1 && <div className="space-y-2">
      <input className="inp" placeholder="Google Sheet ID" value={draft.links.sheetId} onChange={(e) => upd(['links', 'sheetId'], e.target.value)} />
      <input className="inp" placeholder="Sheet tab name (e.g. Sheet1)" value={draft.links.sheetRange} onChange={(e) => upd(['links', 'sheetRange'], e.target.value)} />
      <input className="inp" placeholder="Streamlit URL (https://….streamlit.app/?embed=true)" value={draft.links.streamlitUrl} onChange={(e) => upd(['links', 'streamlitUrl'], e.target.value)} />
      <input className="inp" placeholder="Lo-fi audio URL (direct .mp3)" value={draft.links.audioUrl} onChange={(e) => upd(['links', 'audioUrl'], e.target.value)} />
      <p className="text-xs opacity-60">The API key stays in the server env (GOOGLE_API_KEY), never in this form.</p>
    </div>}

    {tab === 2 && <div className="space-y-3">
      {draft.media.map((m, i) => (<div key={i} className="p-3 rounded-lg border border-white/10 space-y-2">
        <div className="flex gap-2"><select className="inp !w-28" value={m.type} onChange={(e) => upd(['media', i, 'type'], e.target.value)}><option value="photo">Photo</option><option value="video">Video</option></select>
          <input className="inp" placeholder="URL (image, YouTube or direct video)" value={m.url} onChange={(e) => upd(['media', i, 'url'], e.target.value)} />
          <button className="btn" onClick={() => media.del(i)} aria-label="Delete media"><Trash2 size={14} /></button></div>
        <input className="inp" placeholder="Title" value={m.title} onChange={(e) => upd(['media', i, 'title'], e.target.value)} />
        <input className="inp" placeholder="Description" value={m.desc} onChange={(e) => upd(['media', i, 'desc'], e.target.value)} />
      </div>))}
      <button className="btn" onClick={media.add}><Plus size={14} className="inline" /> Add media</button>
    </div>}

    {tab === 3 && <div className="space-y-2">
      {['instagram', 'youtube', 'facebook', 'github'].map((k) => <input key={k} className="inp" placeholder={`${k} URL`} value={draft.socials[k] || ''} onChange={(e) => upd(['socials', k], e.target.value)} />)}
    </div>}

    <div className="flex items-center gap-3 mt-5"><button className="btn" onClick={save}>Save changes</button><span className="text-sm opacity-80">{msg}</span></div>
  </>);
}
