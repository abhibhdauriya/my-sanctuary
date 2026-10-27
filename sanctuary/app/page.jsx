'use client';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence } from 'framer-motion';
import { BookOpen, Table2, Image as Img, Moon, Sun, Play, Pause } from 'lucide-react';
import ContentModal from '@/components/ContentModal';
import AdminOverlay from '@/components/AdminOverlay';

const Scene3D = dynamic(() => import('@/components/Scene3D'), { ssr: false, loading: () => <div className="ui p-6">Loading room…</div> });
const EMPTY = { diary: [], media: [], links: {}, socials: {} };

export default function Page() {
  const [data, setData] = useState(EMPTY);
  const [active, setActive] = useState(null);
  const [night, setNight] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [vol, setVol] = useState(0.4);
  const audio = useRef(null);

  useEffect(() => { fetch('/api/content').then((r) => r.json()).then((d) => !d.error && setData({ ...EMPTY, ...d })).catch(() => {}); }, []);
  useEffect(() => {
    const h = (e) => { if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') { e.preventDefault(); setAdmin((a) => !a); } };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  }, []);
  useEffect(() => { if (audio.current) audio.current.volume = vol; }, [vol]);
  const toggle = () => { const a = audio.current; if (!a || !data.links.audioUrl) return; playing ? a.pause() : a.play().catch(() => {}); setPlaying(!playing); };

  const nav = [['diary', BookOpen, 'Diary'], ['data', Table2, 'Data'], ['media', Img, 'Media']];
  return (
    <main className="fixed inset-0">
      <Scene3D active={active} onOpen={setActive} night={night} socials={data.socials} />

      <div className="glass ui fixed z-20 top-4 left-4 flex items-center gap-2 px-3 py-2 rounded-xl">
        <button className="btn" onClick={() => setNight(!night)} aria-label="Toggle day and night">{night ? <Sun size={16} /> : <Moon size={16} />}</button>
        <button className="btn" onClick={toggle} aria-label={playing ? 'Pause music' : 'Play music'}>{playing ? <Pause size={16} /> : <Play size={16} />}</button>
        <input type="range" min="0" max="1" step="0.05" value={vol} onChange={(e) => setVol(+e.target.value)} aria-label="Volume" className="w-20" />
        <audio ref={audio} src={data.links.audioUrl || undefined} loop />
      </div>

      <nav className="glass ui fixed z-20 bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 rounded-2xl md:hidden">
        {nav.map(([k, Icon, l]) => <button key={k} className="btn flex items-center gap-1" onClick={() => setActive(k)}><Icon size={14} />{l}</button>)}
      </nav>

      <AnimatePresence>{active && <ContentModal key="m" view={active} data={data} onClose={() => setActive(null)} />}</AnimatePresence>
      <AnimatePresence>{admin && <AdminOverlay key="a" data={data} onClose={() => setAdmin(false)} onSaved={setData} />}</AnimatePresence>
    </main>
  );
}
