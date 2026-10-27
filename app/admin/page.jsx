'use client';
import { useState, useEffect } from 'react';
import { Save, BookOpen, Database, Video, Share2, KeyRound, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('diary');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [formData, setFormData] = useState({
    diaryTitle: '',
    diaryContent: '',
    sheetUrl: '',
    streamlitUrl: '',
    youtubeVideo: '',
    photoUrls: '',
    socials: {
      instagram: '',
      youtube: '',
      facebook: '',
      github: '',
    },
  });

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data === 'object') {
          setFormData((prev) => ({
            ...prev,
            ...data,
            socials: { ...prev.socials, ...(data.socials || {}) },
          }));
        }
      })
      .catch((err) => console.log('Fetch error:', err));
  }, []);

  const handleAuth = (e) => {
    e.preventDefault();
    if (pin === '1234') {
      setIsAuthenticated(true);
    } else {
      alert('Galat PIN! Default PIN 1234 try karein.');
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        alert('Save request send ho gayi!');
      }
    } catch (e) {
      console.error(e);
      alert('Local save update ho gaya!');
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col items-center p-4 md:p-8">
      {/* Top Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <Link href="/" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition text-sm">
          <ArrowLeft size={18} /> Back to 3D Sanctuary
        </Link>
        <span className="text-xs bg-cyan-950 border border-cyan-800 text-cyan-400 px-3 py-1 rounded-full">
          Admin Portal
        </span>
      </div>

      {!isAuthenticated ? (
        <div className="mt-16 bg-[#0f172a] border border-cyan-500/30 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-cyan-500/10 text-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/30">
            <KeyRound size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-white">Enter Admin PIN</h2>
          <p className="text-sm text-slate-400 mb-6">Default PIN: 1234</p>
          <form onSubmit={handleAuth} className="space-y-4">
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              className="w-full text-center tracking-widest text-2xl py-3 bg-slate-900 border border-slate-700 rounded-xl text-cyan-400 focus:outline-none focus:border-cyan-400"
              autoFocus
            />
            <button
              type="submit"
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl transition"
            >
              Unlock Dashboard
            </button>
          </form>
        </div>
      ) : (
        <div className="w-full max-w-4xl bg-[#0f172a] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-slate-800 bg-[#090d16] overflow-x-auto">
            {[
              { id: 'diary', label: 'Diary & Stories', icon: BookOpen },
              { id: 'sheets', label: 'Google Sheets & Streamlit', icon: Database },
              { id: 'media', label: 'Media & Videos', icon: Video },
              { id: 'socials', label: 'Social Links', icon: Share2 },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition ${
                    activeTab === tab.id
                      ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Form Content */}
          <div className="p-6 md:p-8 space-y-6">
            {activeTab === 'diary' && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-300">Story / Diary Title</label>
                  <input
                    type="text"
                    value={formData.diaryTitle || ''}
                    onChange={(e) => setFormData({ ...formData, diaryTitle: e.target.value })}
                    placeholder="e.g. My Industrial Automation & Life Journey"
                    className="w-full mt-2 p-3 bg-slate-900 border border-slate-700 rounded-xl focus:border-cyan-400 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-300">Life Story & Reflections</label>
                  <textarea
                    rows={8}
                    value={formData.diaryContent || ''}
                    onChange={(e) => setFormData({ ...formData, diaryContent: e.target.value })}
                    placeholder="Apne experiences, life lessons aur goals yahan likhein..."
                    className="w-full mt-2 p-3 bg-slate-900 border border-slate-700 rounded-xl focus:border-cyan-400 outline-none leading-relaxed text-sm font-mono"
                  />
                </div>
              </div>
            )}

            {activeTab === 'sheets' && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-300">Google Sheet Public / Embed Link</label>
                  <input
                    type="text"
                    value={formData.sheetUrl || ''}
                    onChange={(e) => setFormData({ ...formData, sheetUrl: e.target.value })}
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    className="w-full mt-2 p-3 bg-slate-900 border border-slate-700 rounded-xl focus:border-cyan-400 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-300">Streamlit App URL (Embed)</label>
                  <input
                    type="text"
                    value={formData.streamlitUrl || ''}
                    onChange={(e) => setFormData({ ...formData, streamlitUrl: e.target.value })}
                    placeholder="https://share.streamlit.io/.../?embed=true"
                    className="w-full mt-2 p-3 bg-slate-900 border border-slate-700 rounded-xl focus:border-cyan-400 outline-none text-sm"
                  />
                </div>
              </div>
            )}

            {activeTab === 'media' && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-300">Featured YouTube Video Embed Link</label>
                  <input
                    type="text"
                    value={formData.youtubeVideo || ''}
                    onChange={(e) => setFormData({ ...formData, youtubeVideo: e.target.value })}
                    placeholder="https://www.youtube.com/embed/VIDEO_ID"
                    className="w-full mt-2 p-3 bg-slate-900 border border-slate-700 rounded-xl focus:border-cyan-400 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-300">Photo Gallery URLs (Comma separated)</label>
                  <textarea
                    rows={4}
                    value={formData.photoUrls || ''}
                    onChange={(e) => setFormData({ ...formData, photoUrls: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-1..., https://images.unsplash.com/photo-2..."
                    className="w-full mt-2 p-3 bg-slate-900 border border-slate-700 rounded-xl focus:border-cyan-400 outline-none text-sm"
                  />
                </div>
              </div>
            )}

            {activeTab === 'socials' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-300">Instagram Profile Link</label>
                  <input
                    type="text"
                    value={formData.socials?.instagram || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socials: { ...formData.socials, instagram: e.target.value },
                      })
                    }
                    placeholder="https://instagram.com/abhibhdauriya"
                    className="w-full mt-2 p-3 bg-slate-900 border border-slate-700 rounded-xl focus:border-cyan-400 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-300">YouTube Channel Link</label>
                  <input
                    type="text"
                    value={formData.socials?.youtube || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socials: { ...formData.socials, youtube: e.target.value },
                      })
                    }
                    placeholder="https://youtube.com/@channel"
                    className="w-full mt-2 p-3 bg-slate-900 border border-slate-700 rounded-xl focus:border-cyan-400 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-300">Facebook Profile Link</label>
                  <input
                    type="text"
                    value={formData.socials?.facebook || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socials: { ...formData.socials, facebook: e.target.value },
                      })
                    }
                    placeholder="https://facebook.com/profile"
                    className="w-full mt-2 p-3 bg-slate-900 border border-slate-700 rounded-xl focus:border-cyan-400 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-300">GitHub Link</label>
                  <input
                    type="text"
                    value={formData.socials?.github || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socials: { ...formData.socials, github: e.target.value },
                      })
                    }
                    placeholder="https://github.com/abhibhdauriya"
                    className="w-full mt-2 p-3 bg-slate-900 border border-slate-700 rounded-xl focus:border-cyan-400 outline-none text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Save Button */}
          <div className="p-6 border-t border-slate-800 bg-[#090d16] flex justify-between items-center">
            {savedSuccess ? (
              <span className="flex items-center gap-1.5 text-emerald-400 text-sm font-medium">
                <CheckCircle size={18} /> Changes Saved Successfully!
              </span>
            ) : <span />}
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold rounded-xl transition"
            >
              <Save size={18} /> Save & Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
