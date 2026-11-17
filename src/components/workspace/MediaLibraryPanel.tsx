import React, { useState, useRef } from 'react';
import { useProject } from '../../context/ProjectContext';
import { SAMPLE_MEDIA_LIBRARY } from '../../data/mockData';
import { 
  FolderPlus, 
  UploadCloud, 
  Film, 
  Music, 
  Type, 
  Sparkles, 
  Sliders, 
  Plus, 
  Play, 
  Image as ImageIcon,
  Check,
  ChevronRight,
  Wand2
} from 'lucide-react';

export const MediaLibraryPanel: React.FC = () => {
  const { 
    addClip, 
    currentTime, 
    handleUserFileUpload, 
    aiDetectSilences, 
    aiGenerateSubtitles, 
    aiSuggestTransitions, 
    aiEnhanceAudio, 
    addToast 
  } = useProject();

  const [activeTab, setActiveTab] = useState<'media' | 'audio' | 'text' | 'effects' | 'ai'>('media');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUserFileUpload(file);
      e.target.value = ''; // reset
    }
  };

  const handleAddMediaToTimeline = (asset: typeof SAMPLE_MEDIA_LIBRARY[0]) => {
    if (asset.type === 'video') {
      addClip({
        trackId: 'track-v1',
        title: asset.title,
        startTime: currentTime,
        duration: asset.duration || 12,
        sourceStart: 0,
        color: '#6366F1',
        type: 'video',
        videoUrl: asset.url,
        thumbnailUrl: asset.thumbnailUrl,
        volume: 90,
      });
    } else if (asset.type === 'audio') {
      addClip({
        trackId: 'track-a2',
        title: asset.title,
        startTime: currentTime,
        duration: asset.duration || 30,
        sourceStart: 0,
        color: '#3B82F6',
        type: 'audio',
        audioUrl: asset.url,
        waveform: [20, 35, 60, 45, 75, 80, 50, 65, 85, 40, 30, 50, 70, 85, 90, 60, 45, 30],
        volume: 60,
      });
    }
  };

  const handleAddText = (style: string, defaultText: string) => {
    addClip({
      trackId: 'track-t1',
      title: `${style} Text`,
      startTime: currentTime,
      duration: 5,
      sourceStart: 0,
      color: '#EC4899',
      type: 'subtitle',
      text: defaultText,
    });
  };

  const handleAddEffect = (effectName: string) => {
    addClip({
      trackId: 'track-v2',
      title: `FX: ${effectName}`,
      startTime: currentTime,
      duration: 4,
      sourceStart: 0,
      color: '#A855F7',
      type: 'overlay',
      opacity: 0.85,
    });
    addToast('Effect Added', `Applied ${effectName} at current playhead`, 'purple');
  };

  return (
    <div className="w-64 sm:w-72 bg-gray-950 border-r border-gray-800 flex flex-col h-full select-none">
      
      {/* Top Tabs */}
      <div className="flex items-center justify-around bg-gray-900 border-b border-gray-800 p-1">
        <button
          onClick={() => setActiveTab('media')}
          className={`p-2 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'media' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
          title="Video Rushes & Upload"
        >
          <Film className="w-4 h-4" />
          <span className="text-[10px]">Media</span>
        </button>

        <button
          onClick={() => setActiveTab('audio')}
          className={`p-2 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'audio' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
          title="BGM & Sound FX"
        >
          <Music className="w-4 h-4" />
          <span className="text-[10px]">Audio</span>
        </button>

        <button
          onClick={() => setActiveTab('text')}
          className={`p-2 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'text' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
          title="Titles & Subtitles"
        >
          <Type className="w-4 h-4" />
          <span className="text-[10px]">Text</span>
        </button>

        <button
          onClick={() => setActiveTab('effects')}
          className={`p-2 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'effects' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
          title="Transitions & FX"
        >
          <Sliders className="w-4 h-4" />
          <span className="text-[10px]">Effects</span>
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          className={`p-2 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'ai' ? 'bg-purple-600 text-white' : 'text-purple-400 hover:text-purple-300'
          }`}
          title="AI Smart Tools"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-[10px]">AI Tools</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        
        {/* 1. MEDIA TAB */}
        {activeTab === 'media' && (
          <div>
            {/* Upload Video Button */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="video/*,audio/*,image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full mb-3 p-3 rounded-xl border border-dashed border-purple-500/40 bg-purple-950/20 hover:bg-purple-950/40 text-purple-300 hover:text-white transition-all flex items-center justify-center gap-2 group"
            >
              <UploadCloud className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <p className="text-xs font-bold leading-tight">Upload Video / Audio</p>
                <p className="text-[10px] text-slate-400 leading-tight">MP4, WebM, MP3, PNG</p>
              </div>
            </button>

            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Stock Rushes & Rushes
            </h4>
            
            <div className="space-y-2">
              {SAMPLE_MEDIA_LIBRARY.filter(m => m.type === 'video').map(asset => (
                <div
                  key={asset.id}
                  onClick={() => handleAddMediaToTimeline(asset)}
                  className="group relative rounded-xl border border-gray-800 bg-gray-900/70 hover:border-purple-500/50 hover:bg-gray-850 p-2 cursor-pointer transition-all flex items-center gap-2.5"
                >
                  <div className="relative w-16 h-11 rounded-lg overflow-hidden bg-gray-800 shrink-0">
                    <img src={asset.thumbnailUrl} alt={asset.title} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0.5 right-0.5 text-[8px] bg-black/80 text-white font-mono px-1 rounded">
                      {asset.duration}s
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-xs font-semibold text-white truncate group-hover:text-purple-300 transition-colors">
                      {asset.title}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{asset.category} · {asset.resolution}</p>
                  </div>
                  <button className="w-6 h-6 rounded-lg bg-gray-800 group-hover:bg-purple-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. AUDIO TAB */}
        {activeTab === 'audio' && (
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Royalty-Free Soundtracks & SFX
            </h4>
            <div className="space-y-2">
              {SAMPLE_MEDIA_LIBRARY.filter(m => m.type === 'audio').map(asset => (
                <div
                  key={asset.id}
                  onClick={() => handleAddMediaToTimeline(asset)}
                  className="group rounded-xl border border-gray-800 bg-gray-900/70 hover:border-blue-500/50 hover:bg-gray-850 p-2.5 cursor-pointer transition-all flex items-center gap-2.5"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                    <Music className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-xs font-semibold text-white truncate group-hover:text-blue-300">
                      {asset.title}
                    </p>
                    <p className="text-[10px] text-slate-400">{asset.category} · {asset.duration}s</p>
                  </div>
                  <button className="w-6 h-6 rounded-lg bg-gray-800 group-hover:bg-blue-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. TEXT TAB */}
        {activeTab === 'text' && (
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Titles & Dynamic Captions
            </h4>
            <div className="space-y-2">
              {[
                { title: 'Kinetic Header', preview: '⚡ BOLD STATEMENT', desc: 'Punchy animated typography' },
                { title: 'Lower Third Banner', preview: '👤 Speaker Name | Role', desc: 'Professional interview tag' },
                { title: 'Dynamic Subtitle', preview: '✨ Word-by-word Captions', desc: 'High retention Reels subtitle' },
                { title: 'Call To Action', preview: '🚀 Click Link In Bio', desc: 'Promotional overlay card' },
              ].map((t, idx) => (
                <div
                  key={idx}
                  onClick={() => handleAddText(t.title, t.preview)}
                  className="group rounded-xl border border-gray-800 bg-gray-900/70 hover:border-pink-500/50 hover:bg-gray-850 p-2.5 cursor-pointer transition-all text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-pink-300">{t.title}</span>
                    <Plus className="w-3.5 h-3.5 text-slate-500 group-hover:text-pink-400" />
                  </div>
                  <div className="mt-1.5 p-1.5 rounded bg-black/50 border border-white/5 font-bold text-xs text-pink-300 truncate">
                    {t.preview}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. EFFECTS TAB */}
        {activeTab === 'effects' && (
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Transitions & Color LUTs
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'Cross Dissolve', type: 'Transition' },
                { name: 'Glitch Cut', type: 'Transition' },
                { name: 'Zoom Blur', type: 'Transition' },
                { name: 'Dip to Black', type: 'Transition' },
                { name: 'Cyberpunk Neon', type: 'Color LUT' },
                { name: 'Warm Sunset', type: 'Color LUT' },
                { name: 'Moody Film 35mm', type: 'Color LUT' },
                { name: 'B&W High Contrast', type: 'Color LUT' },
              ].map((fx, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAddEffect(fx.name)}
                  className="p-2.5 rounded-xl border border-gray-800 bg-gray-900/70 hover:border-purple-500/50 hover:bg-purple-950/30 text-left transition-all group"
                >
                  <p className="text-xs font-bold text-white group-hover:text-purple-300 truncate">{fx.name}</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">{fx.type}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 5. AI ASSISTANT TAB */}
        {activeTab === 'ai' && (
          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-left">
              <div className="flex items-center gap-1.5 text-purple-300 text-xs font-bold">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>CollabCut AI Assistant</span>
              </div>
              <p className="text-[10px] text-slate-300 mt-1 leading-relaxed">
                Automated intelligent editing suggestions powered by timeline scene heuristics.
              </p>
            </div>

            <div className="space-y-2 text-left">
              <button
                onClick={aiDetectSilences}
                className="w-full p-2.5 rounded-xl border border-gray-800 bg-gray-900 hover:border-purple-500 hover:bg-gray-850 transition-all flex items-start gap-2.5 group"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Wand2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-purple-300">Auto-Cut Awkward Silences</p>
                  <p className="text-[10px] text-slate-400">Scans timeline & trims silent dead air</p>
                </div>
              </button>

              <button
                onClick={aiGenerateSubtitles}
                className="w-full p-2.5 rounded-xl border border-gray-800 bg-gray-900 hover:border-pink-500 hover:bg-gray-850 transition-all flex items-start gap-2.5 group"
              >
                <div className="w-8 h-8 rounded-lg bg-pink-600/20 text-pink-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Type className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-pink-300">Generate Dynamic Captions</p>
                  <p className="text-[10px] text-slate-400">Word-synced subtitles for Reels & TikTok</p>
                </div>
              </button>

              <button
                onClick={aiSuggestTransitions}
                className="w-full p-2.5 rounded-xl border border-gray-800 bg-gray-900 hover:border-indigo-500 hover:bg-gray-850 transition-all flex items-start gap-2.5 group"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-indigo-300">Smart Scene Transitions</p>
                  <p className="text-[10px] text-slate-400">Inserts beat-matched cuts at scene changes</p>
                </div>
              </button>

              <button
                onClick={aiEnhanceAudio}
                className="w-full p-2.5 rounded-xl border border-gray-800 bg-gray-900 hover:border-emerald-500 hover:bg-gray-850 transition-all flex items-start gap-2.5 group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Music className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-emerald-300">AI Voice Isolator & EQ</p>
                  <p className="text-[10px] text-slate-400">Removes reverb, background noise, & hums</p>
                </div>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
