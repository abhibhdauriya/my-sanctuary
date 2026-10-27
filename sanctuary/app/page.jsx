'use client';
import { useState, useEffect } from 'react';
import Scene3D from '@/components/Scene3D';
import ContentModal from '@/components/ContentModal';
import AdminOverlay from '@/components/AdminOverlay';
import { Settings, ShieldCheck } from 'lucide-react';

export default function Home() {
  const [activeZone, setActiveZone] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [content, setContent] = useState({
    diaryTitle: 'My Coding & Life Journey',
    diaryContent: 'Yahan aapke thoughts aur experiences aayenge.',
    sheetUrl: '',
    streamlitUrl: '',
    youtubeVideo: '',
    photoUrls: '',
    socials: {
      instagram: 'https://instagram.com/abhibhdauriya',
      youtube: '',
      facebook: '',
      github: 'https://github.com/abhibhdauriya',
    },
  });

  // 1. Fetch live content from DB/API
  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => {
        if (data && Object.keys(data).length > 0) {
          setContent(data);
        }
      })
      .catch((err) => console.log('Using local fallback state:', err));

    // 2. Secret URL check (?admin=true ya ?secret=1234)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('admin') === 'true' || params.get('secret') === 'true') {
        setIsAdminOpen(true);
      }
    }
  }, []);

  // 3. Fallback Keyboard Shortcuts: `Ctrl + Shift + A` OR simple backtick key ( ` )
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Direct backtick key (tilde key below Esc) ya Ctrl+Shift+A
      if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') || e.key === '`') {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Save content handler
  const handleSaveContent = async (newContent) => {
    setContent(newContent);
    try {
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContent),
      });
    } catch (e) {
      console.error('Error saving data:', e);
    }
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#05050a]">
      {/* 3D Interactive World */}
      <Scene3D onSelectZone={(zone) => setActiveZone(zone)} content={content} />

      {/* 2D Reading & Media Modal */}
      <ContentModal
        activeZone={activeZone}
        onClose={() => setActiveZone(null)}
        content={content}
      />

      {/* Secret Admin Overlay */}
      <AdminOverlay
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        content={content}
        onSave={handleSaveContent}
      />

      {/* Fail-proof Admin Button (Bottom Right corner) */}
      <div className="fixed bottom-4 right-4 z-30">
        <button
          onClick={() => setIsAdminOpen(true)}
          title="Open Admin Panel (Shortcut: ` or Ctrl+Shift+A)"
          className="p-3 bg-slate-900/80 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-500 rounded-full text-slate-400 hover:text-cyan-400 backdrop-blur-md transition shadow-lg flex items-center gap-2 group"
        >
          <Settings size={18} className="group-hover:rotate-90 transition-transform duration-300" />
          <span className="text-xs font-semibold pr-1 hidden group-hover:inline">Admin Hub</span>
        </button>
      </div>
    </main>
  );
}
