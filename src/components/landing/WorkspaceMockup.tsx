import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Scissors, 
  Layers, 
  Sparkles, 
  MessageSquare, 
  Clock, 
  CheckSquare, 
  Volume2, 
  Share2, 
  Sliders, 
  MousePointer2 
} from 'lucide-react';

export const WorkspaceMockup: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [scrubberX, setScrubberX] = useState(38); // percentage

  // Animate playback scrubber across mockup timeline
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setScrubberX(prev => (prev >= 85 ? 15 : prev + 0.35));
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="relative mx-auto max-w-6xl rounded-2xl border border-purple-500/30 bg-gray-950/90 shadow-[0_0_50px_-10px_rgba(139,92,246,0.25)] overflow-hidden transition-all duration-500">
      
      {/* Window Title Bar */}
      <div className="h-10 px-4 bg-gray-900/90 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span className="text-[11px] font-mono text-slate-400 ml-2">CollabCut — Launch_Campaign_Hero_4K.collab</span>
        </div>

        {/* Live Collaborators in Mockup */}
        <div className="flex items-center gap-2">
          <div className="flex items-center -space-x-1.5">
            <div className="w-6 h-6 rounded-full ring-2 ring-purple-500 bg-purple-600 text-[10px] font-bold text-white flex items-center justify-center">
              SC
            </div>
            <div className="w-6 h-6 rounded-full ring-2 ring-blue-500 bg-blue-600 text-[10px] font-bold text-white flex items-center justify-center">
              AR
            </div>
            <div className="w-6 h-6 rounded-full ring-2 ring-emerald-500 bg-emerald-600 text-[10px] font-bold text-white flex items-center justify-center">
              ER
            </div>
          </div>
          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            3 Active Live
          </span>
        </div>
      </div>

      {/* Main Workspace Preview Content */}
      <div className="grid grid-cols-12 h-[380px] sm:h-[440px] bg-gray-950">
        
        {/* Left Toolbar / Assets */}
        <div className="col-span-3 sm:col-span-2 border-r border-gray-800/80 p-2.5 flex flex-col justify-between bg-gray-900/40">
          <div className="space-y-1.5">
            <div className="p-2 rounded-lg bg-purple-600/20 text-purple-300 text-xs font-semibold flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>Project Media</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 mt-2">
              <div className="aspect-video bg-gray-800 rounded-md border border-gray-700/60 overflow-hidden relative group">
                <img src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=200&auto=format&fit=crop&q=80" alt="Clip 1" className="w-full h-full object-cover" />
                <span className="absolute bottom-1 right-1 text-[8px] bg-black/80 px-1 rounded text-white font-mono">00:15</span>
              </div>
              <div className="aspect-video bg-gray-800 rounded-md border border-gray-700/60 overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=200&auto=format&fit=crop&q=80" alt="Clip 2" className="w-full h-full object-cover" />
                <span className="absolute bottom-1 right-1 text-[8px] bg-black/80 px-1 rounded text-white font-mono">00:24</span>
              </div>
            </div>
            <div className="pt-2 text-[10px] text-slate-400 font-medium space-y-1">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Sparkles className="w-3 h-3 text-purple-400" /> AI Auto-Captions
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Volume2 className="w-3 h-3 text-blue-400" /> Beat Sync Active
              </div>
            </div>
          </div>
          <div className="p-2 rounded-xl bg-purple-950/30 border border-purple-500/20 text-[10px] text-purple-300">
            <p className="font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-400" /> AI Assistant
            </p>
            <p className="text-slate-400 text-[9px] mt-0.5">3 awkward silences cut</p>
          </div>
        </div>

        {/* Center Player */}
        <div className="col-span-9 sm:col-span-7 flex flex-col justify-between p-3 bg-gray-950/90 relative">
          
          {/* Simulated Video Canvas */}
          <div className="relative w-full h-[180px] sm:h-[230px] rounded-xl bg-gray-900 border border-gray-800/80 overflow-hidden flex items-center justify-center shadow-inner group">
            <img 
              src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1000&auto=format&fit=crop&q=80" 
              alt="Live Canvas" 
              className="w-full h-full object-cover brightness-90"
            />
            
            {/* Realtime Collaborator Overlay Badges on Canvas */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="bg-black/70 backdrop-blur-md border border-purple-500/40 text-[10px] text-purple-300 px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                REC · 4K 60FPS
              </span>
            </div>

            {/* Kinetic Caption Overlay */}
            <div className="absolute bottom-6 px-4 py-1.5 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-center max-w-sm">
              <p className="text-xs sm:text-sm font-bold text-white tracking-wide">
                "Video editing is 10x faster when everyone edits simultaneously."
              </p>
            </div>

            {/* Simulated Live Cursor 1: Sarah */}
            <div 
              className="absolute pointer-events-none transition-all duration-700 ease-out z-20 flex items-start gap-1"
              style={{ top: '35%', left: '48%' }}
            >
              <MousePointer2 className="w-4 h-4 fill-purple-500 text-purple-400 filter drop-shadow-md" />
              <div className="bg-purple-600 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded shadow">
                Sarah Chen: Trimming Intro
              </div>
            </div>

            {/* Simulated Live Cursor 2: Alex */}
            <div 
              className="absolute pointer-events-none transition-all duration-700 ease-out z-20 flex items-start gap-1"
              style={{ top: '65%', left: '72%' }}
            >
              <MousePointer2 className="w-4 h-4 fill-blue-500 text-blue-400 filter drop-shadow-md" />
              <div className="bg-blue-600 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded shadow">
                Alex: Voice EQ
              </div>
            </div>
          </div>

          {/* Player Controls Bar */}
          <div className="flex items-center justify-between px-2 py-1 bg-gray-900/60 rounded-lg border border-gray-800">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-7 h-7 rounded-lg bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center transition-all"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 translate-x-0.5" />}
              </button>
              <span className="font-mono text-[11px] text-purple-300 font-semibold">
                00:00:14:18
              </span>
              <span className="text-[10px] text-slate-500">/ 00:00:42:00</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <span className="text-[10px] bg-gray-800 px-1.5 py-0.5 rounded text-slate-300">1080p 60fps</span>
              <span className="text-[10px] text-emerald-400">100% Synced</span>
            </div>
          </div>
        </div>

        {/* Right Collaboration Inspector */}
        <div className="hidden sm:block col-span-3 border-l border-gray-800/80 p-3 bg-gray-900/30 space-y-3">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
            <span className="text-xs font-semibold text-white flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
              Frame Comments
            </span>
            <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-mono">
              3 new
            </span>
          </div>

          {/* Comment Thread 1 */}
          <div className="p-2 rounded-xl bg-gray-900/80 border border-gray-800 text-left space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-purple-300">Jordan Lee</span>
              <span className="text-[9px] font-mono text-purple-400 bg-purple-950/60 px-1 rounded">00:04.5</span>
            </div>
            <p className="text-[10px] text-slate-300">"Punch in 10% on speaker frame for mobile view."</p>
            <div className="text-[9px] text-emerald-400 flex items-center gap-1">
              ✓ Sarah Chen applied
            </div>
          </div>

          {/* Task Widget */}
          <div className="p-2 rounded-xl bg-gray-900/80 border border-gray-800 text-left space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-200 flex items-center gap-1">
                <CheckSquare className="w-3 h-3 text-emerald-400" /> Smart Task
              </span>
              <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 rounded font-semibold">URGENT</span>
            </div>
            <p className="text-[10px] text-slate-300">Master audio & balance background music</p>
            <p className="text-[9px] text-slate-400">Assigned to: Alex Rivera</p>
          </div>
        </div>
      </div>

      {/* Bottom Timeline Mockup */}
      <div className="border-t border-gray-800/80 bg-gray-950 p-2.5 relative select-none">
        {/* Timeline Tracks Header */}
        <div className="flex items-center justify-between mb-1.5 px-1">
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
            <span>TRACKS (5)</span>
            <span className="text-purple-400">· MULTI-USER SYNC ON</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-slate-500 font-mono">ZOOM 100%</span>
          </div>
        </div>

        {/* Timeline Tracks Container */}
        <div className="relative space-y-1 h-[90px] rounded-lg bg-gray-900/60 p-1.5 border border-gray-800/60 overflow-hidden">
          
          {/* Animated Playhead Line */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-pink-500 z-30 shadow-[0_0_8px_rgba(236,72,153,0.8)] pointer-events-none transition-all duration-75"
            style={{ left: `${scrubberX}%` }}
          >
            <div className="w-3 h-3 bg-pink-500 rotate-45 -translate-x-[5px] -translate-y-1 rounded-sm shadow-md" />
          </div>

          {/* Track 1: Video V1 */}
          <div className="h-6 w-full bg-gray-950/60 rounded flex items-center gap-1 px-1">
            <span className="text-[8px] font-mono text-slate-400 w-5">V1</span>
            <div className="h-4 w-36 bg-purple-600/70 border border-purple-400/40 rounded text-[8px] font-semibold px-1.5 flex items-center text-white truncate shadow-sm">
              Keynote Intro [Sarah]
            </div>
            <div className="h-4 w-44 bg-indigo-600/70 border border-indigo-400/40 rounded text-[8px] font-semibold px-1.5 flex items-center text-white truncate shadow-sm">
              Live Product Demo [Marcus]
            </div>
            <div className="h-4 flex-1 bg-purple-700/60 border border-purple-500/40 rounded text-[8px] font-semibold px-1.5 flex items-center text-white truncate shadow-sm">
              Call to Action
            </div>
          </div>

          {/* Track 2: Subtitles T1 */}
          <div className="h-5 w-full bg-gray-950/60 rounded flex items-center gap-1 px-1">
            <span className="text-[8px] font-mono text-slate-400 w-5">T1</span>
            <div className="h-3.5 w-28 ml-10 bg-pink-600/70 border border-pink-400/40 rounded text-[7px] font-semibold px-1 flex items-center text-white truncate">
              Dynamic Kinetic Captions
            </div>
            <div className="h-3.5 w-36 ml-6 bg-pink-600/70 border border-pink-400/40 rounded text-[7px] font-semibold px-1 flex items-center text-white truncate">
              Auto-Translated Subs
            </div>
          </div>

          {/* Track 3: Audio A1 */}
          <div className="h-5 w-full bg-gray-950/60 rounded flex items-center gap-1 px-1">
            <span className="text-[8px] font-mono text-slate-400 w-5">A1</span>
            <div className="h-3.5 w-60 bg-emerald-600/60 border border-emerald-400/40 rounded text-[7px] font-semibold px-1 flex items-center text-white truncate">
              Dialogue Master Clean (Alex Rivera)
            </div>
            <div className="h-3.5 flex-1 bg-blue-600/60 border border-blue-400/40 rounded text-[7px] font-semibold px-1 flex items-center text-white truncate">
              Synthwave BGM Pulse
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
