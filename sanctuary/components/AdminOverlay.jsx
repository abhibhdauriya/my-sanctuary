'use client';
import { useState } from 'react';
import { X, Save, BookOpen, Database, Video, Share2, KeyRound } from 'lucide-react';

export default function AdminOverlay({ isOpen, onClose, content, onSave }) {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('diary');
  const [formData, setFormData] = useState(content || {});

  if (!isOpen) return null;

  const handleAuth = (e) => {
    e.preventDefault();
    if (pin === (process.env.NEXT_PUBLIC_ADMIN_PIN || '1234')) {
      setIsAuthenticated(true);
    } else {
      alert('Galat PIN! Dubara check karein.');
    }
  };

  const handleSave = async () => {
    await onSave(formData);
    alert('Changes kamyabi se save ho gaye!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
      <div className="bg-[#0b0f19] border border-cyan-500/30 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-[#070a12]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></span>
            <h2 className="font-bold tracking-wider text-cyan-400 text-lg">SANCTUARY CONTROL PANEL</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {!isAuthenticated ? (
          <form onSubmit={handleAuth} className="p-10 flex flex-col items-center justify-center gap-4">
            <div className="p-4 bg-cyan-950/40 rounded-full border border-cyan-500/20 text-cyan-400 mb-2">
              <KeyRound size={36} />
            </div>
            <h3 className="text-xl font-semibold">Enter Secret Master PIN</h3>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              className="px-6 py-3 bg-[#131b2e] border border-cyan-500/40 rounded-xl text-center text-2xl tracking-widest text-cyan-300 focus:outline-none focus:border-cyan-400 w-48"
              autoFocus
            />
            <button type="submit" className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl transition">
              Unlock Panel
            </button>
          </form>
        ) : (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-slate-800 bg-[#0c1220]">
              {[
                { id: 'diary', label: 'Diary & Story', icon: BookOpen },
                { id: 'sheets', label: 'Sheets & Apps', icon: Database },
                { id: 'media', label: 'Media & Videos', icon: Video },
                { id: 'socials', label: 'Social Links', icon: Share2 },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition ${
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

            {/* Tab Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {activeTab === 'diary' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400">Story Title</label>
                    <input
                      type="text"
                      value={formData.diaryTitle || ''}
                      onChange={(e) => setFormData({ ...formData, diaryTitle: e.target.value })}
                      placeholder="e.g. My Coding Journey & Reflections"
                      className="w-full mt-1 p-3 bg-slate-900 border border-slate-700 rounded-lg focus:border-cyan-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400">Life Story & Philosophy (Markdown / Text)</label>
                    <textarea
                      rows={8}
                      value={formData.diaryContent || ''}
                      onChange={(e) => setFormData({ ...formData, diaryContent: e.target.value })}
                      placeholder="Apne vichar, life lessons aur journey yahan likhein..."
                      className="w-full mt-1 p-3 bg-slate-900 border border-slate-700 rounded-lg focus:border-cyan-400 outline-none font-mono text-sm"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'sheets' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400">Google Sheet Public Link / CSV Export</label>
                    <input
                      type="text"
                      value={formData.sheetUrl || ''}
                      onChange={(e) => setFormData({ ...formData, sheetUrl: e.target.value })}
                      placeholder="https://docs.google.com/spreadsheets/d/.../export?format=csv"
                      className="w-full mt-1 p-3 bg-slate-900 border border-slate-700 rounded-lg focus:border-cyan-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400">Streamlit Automation App Embed URL</label>
                    <input
                      type="text"
                      value={formData.streamlitUrl || ''}
                      onChange={(e) => setFormData({ ...formData, streamlitUrl: e.target.value })}
                      placeholder="https://my-downtime-analyzer.streamlit.app/?embed=true"
                      className="w-full mt-1 p-3 bg-slate-900 border border-slate-700 rounded-lg focus:border-cyan-400 outline-none"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'media' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400">Featured YouTube Video Embed Link</label>
                    <input
                      type="text"
                      value={formData.youtubeVideo || ''}
                      onChange={(e) => setFormData({ ...formData, youtubeVideo: e.target.value })}
                      placeholder="https://www.youtube.com/embed/..."
                      className="w-full mt-1 p-3 bg-slate-900 border border-slate-700 rounded-lg focus:border-cyan-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400">Photo / Gallery Direct URLs (Comma separated)</label>
                    <textarea
                      rows={4}
                      value={formData.photoUrls || ''}
                      onChange={(e) => setFormData({ ...formData, photoUrls: e.target.value })}
                      placeholder="https://images.unsplash.com/..., https://..."
                      className="w-full mt-1 p-3 bg-slate-900 border border-slate-700 rounded-lg focus:border-cyan-400 outline-none text-sm"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'socials' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400">Instagram Profile Link</label>
                    <input
                      type="text"
                      value={formData.socials?.instagram || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          socials: { ...formData.socials, instagram: e.target.value },
                        })
                      }
                      placeholder="https://instagram.com/yourhandle"
                      className="w-full mt-1 p-3 bg-slate-900 border border-slate-700 rounded-lg focus:border-cyan-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400">YouTube Channel Link</label>
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
                      className="w-full mt-1 p-3 bg-slate-900 border border-slate-700 rounded-lg focus:border-cyan-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400">Facebook Profile Link</label>
                    <input
                      type="text"
                      value={formData.socials?.facebook || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          socials: { ...formData.socials, facebook: e.target.value },
                        })
                      }
                      placeholder="https://facebook.com/..."
                      className="w-full mt-1 p-3 bg-slate-900 border border-slate-700 rounded-lg focus:border-cyan-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400">GitHub / Other Link</label>
                    <input
                      type="text"
                      value={formData.socials?.github || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          socials: { ...formData.socials, github: e.target.value },
                        })
                      }
                      placeholder="https://github.com/..."
                      className="w-full mt-1 p-3 bg-slate-900 border border-slate-700 rounded-lg focus:border-cyan-400 outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="p-4 border-t border-slate-800 bg-[#070a12] flex justify-end">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold rounded-xl transition"
              >
                <Save size={18} />
                Save & Deploy Live
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
