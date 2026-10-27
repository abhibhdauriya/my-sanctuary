'use client';
import { useState, useEffect } from 'react';
import Scene3D from '@/components/Scene3D';
import ContentModal from '@/components/ContentModal';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function Home() {
  const [activeZone, setActiveZone] = useState(null);
  const [content, setContent] = useState({
    diaryTitle: 'My Coding & Life Journey',
    diaryContent: 'Click Admin Portal to add your story and notes.',
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

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data === 'object') {
          setContent((prev) => ({
            ...prev,
            ...data,
            socials: { ...prev.socials, ...(data.socials || {}) },
          }));
        }
      })
      .catch((err) => console.log('Local state fallback:', err));
  }, []);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#05050a]">
      {/* 3D Scene */}
      <Scene3D onSelectZone={(zone) => setActiveZone(zone)} content={content} />

      {/* 2D Modal */}
      <ContentModal
        activeZone={activeZone}
        onClose={() => setActiveZone(null)}
        content={content}
      />

      {/* Direct Admin Link Button */}
      <div className="fixed bottom-5 right-5 z-50">
        <Link
          href="/admin"
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/90 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 rounded-xl text-xs font-semibold backdrop-blur-md transition shadow-2xl"
        >
          <Shield size={16} />
          <span>Admin Portal</span>
        </Link>
      </div>
    </main>
  );
}
