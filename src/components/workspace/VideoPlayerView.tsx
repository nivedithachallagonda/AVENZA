import React, { useRef, useEffect, useState } from 'react';
import { useProject, formatSMPTETime } from '../../context/ProjectContext';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Grid, 
  Sparkles, 
  Tv, 
  Eye, 
  MousePointer2 
} from 'lucide-react';

export const VideoPlayerView: React.FC = () => {
  const { 
    activeProject, 
    isPlaying, 
    togglePlayPause, 
    currentTime, 
    duration, 
    seekTo, 
    stepFrame, 
    volume, 
    setVolume, 
    isMuted, 
    setIsMuted, 
    playbackSpeed, 
    setPlaybackSpeed,
    collaborators,
    showMultiplayerCursors
  } = useProject();

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showSafeAreas, setShowSafeAreas] = useState(false);
  const [previewResolution, setPreviewResolution] = useState('1080p');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Find active video clip at current playhead
  const activeVideoClip = activeProject?.clips.find(c => 
    c.trackId === 'track-v1' && 
    currentTime >= c.startTime && 
    currentTime <= (c.startTime + c.duration)
  );

  // Find active subtitle/caption clip at current playhead
  const activeSubtitleClip = activeProject?.clips.find(c => 
    c.trackId === 'track-t1' && 
    currentTime >= c.startTime && 
    currentTime <= (c.startTime + c.duration)
  );

  // Sync HTML5 video element with context playback
  useEffect(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!videoRef.current) return;
    // Sync time offset with active clip source start
    if (activeVideoClip) {
      const clipOffset = (currentTime - activeVideoClip.startTime) + (activeVideoClip.sourceStart || 0);
      if (Math.abs(videoRef.current.currentTime - clipOffset) > 0.4) {
        videoRef.current.currentTime = Math.max(0, clipOffset);
      }
    }
  }, [currentTime, activeVideoClip]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume / 100;
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [volume, isMuted, playbackSpeed]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="flex-1 flex flex-col justify-between bg-[#0F131D] p-3 select-none relative overflow-hidden"
    >
      
      {/* Top Player Info Bar */}
      <div className="flex items-center justify-between mb-2 px-1 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-purple-300 font-bold bg-purple-950/60 border border-purple-500/30 px-2 py-0.5 rounded text-[11px] flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            SMPTE {formatSMPTETime(currentTime, activeProject?.fps || 30)}
          </span>
          <span className="text-slate-500 text-[11px]">
            / {formatSMPTETime(duration, activeProject?.fps || 30)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Safe Areas Guide Toggle */}
          <button
            onClick={() => setShowSafeAreas(!showSafeAreas)}
            className={`p-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 ${
              showSafeAreas ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white bg-gray-900 border border-gray-800'
            }`}
            title="Safe Title / Action Grid Guides"
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden sm:inline">Safe Guides</span>
          </button>

          {/* Preview Resolution Selector */}
          <select
            value={previewResolution}
            onChange={e => setPreviewResolution(e.target.value)}
            className="px-2 py-1 bg-gray-900 border border-gray-800 rounded-lg text-[11px] text-slate-300 focus:outline-none focus:border-purple-500"
          >
            <option value="4k">4K (Full Res)</option>
            <option value="1080p">1080p (Half)</option>
            <option value="720p">720p (Fast Proxy)</option>
          </select>
        </div>
      </div>

      {/* Main Video Stage Canvas */}
      <div className="relative flex-1 flex items-center justify-center min-h-[220px] max-h-[460px] rounded-2xl bg-black border border-gray-800/80 shadow-2xl overflow-hidden group">
        
        {/* Safe Area Overlays */}
        {showSafeAreas && (
          <div className="absolute inset-0 pointer-events-none z-20">
            {/* 90% Action Safe */}
            <div className="absolute inset-[5%] border border-cyan-400/30">
              <span className="absolute top-1 left-1 text-[8px] font-mono text-cyan-400/70">ACTION SAFE (90%)</span>
            </div>
            {/* 80% Title Safe */}
            <div className="absolute inset-[10%] border border-purple-400/30">
              <span className="absolute top-1 left-1 text-[8px] font-mono text-purple-400/70">TITLE SAFE (80%)</span>
            </div>
            {/* Center Crosshair */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10" />
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10" />
          </div>
        )}

        {/* Video Element or Canvas Fallback */}
        <div className="relative w-full h-full flex items-center justify-center bg-gray-950">
          <video
            ref={videoRef}
            src={activeVideoClip?.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
            poster={activeVideoClip?.thumbnailUrl || activeProject?.thumbnail}
            playsInline
            muted={isMuted}
            className="w-full h-full object-contain pointer-events-none"
          />

          {/* If no video clip active at playhead, show black slate / standby notice */}
          {!activeVideoClip && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950/90 text-slate-500">
              <Tv className="w-10 h-10 mb-2 opacity-40 text-purple-400" />
              <p className="text-xs font-mono">STANDBY · NO MEDIA ON TRACK V1 AT THIS TIMECODE</p>
              <p className="text-[10px] text-slate-600 mt-1">Scrub playhead or insert media from library</p>
            </div>
          )}

          {/* Dynamic Captions / Subtitles Overlay */}
          {activeSubtitleClip && activeSubtitleClip.text && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 max-w-lg px-4 py-2 bg-black/80 backdrop-blur-md border border-purple-500/30 rounded-xl text-center shadow-2xl z-20 animate-in fade-in zoom-in-95">
              <p className="text-sm sm:text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-200 to-white drop-shadow-md tracking-wide">
                {activeSubtitleClip.text}
              </p>
            </div>
          )}

          {/* Simulated Collaborator Cursors & Presence on Video Player */}
          {showMultiplayerCursors && collaborators.map(c => {
            if (!c.isOnline || !c.cursorX || !c.cursorY) return null;
            return (
              <div
                key={c.id}
                className="absolute pointer-events-none transition-all duration-700 ease-out z-30 flex items-start gap-1"
                style={{ top: `${c.cursorY}%`, left: `${c.cursorX}%` }}
              >
                <MousePointer2 
                  className="w-4 h-4 filter drop-shadow" 
                  style={{ fill: c.color, color: c.color }}
                />
                <div 
                  className="px-1.5 py-0.5 rounded text-[9px] font-bold text-white shadow-md whitespace-nowrap"
                  style={{ backgroundColor: c.color }}
                >
                  {c.name}: {c.activeAction}
                </div>
              </div>
            );
          })}
        </div>

        {/* Video Canvas Click-to-Play Overlay */}
        <div 
          onClick={togglePlayPause}
          className="absolute inset-0 cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20"
        >
          <div className="w-14 h-14 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-xl backdrop-blur-sm transform group-hover:scale-105 transition-transform">
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 translate-x-0.5" />}
          </div>
        </div>

      </div>

      {/* Video Player Bottom Controls Toolbar */}
      <div className="mt-2 py-1.5 px-3 bg-gray-900/90 border border-gray-800 rounded-xl flex items-center justify-between text-xs">
        
        {/* Playback Transport Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => seekTo(0)}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-gray-800"
            title="Jump to Start"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={() => stepFrame(-1)}
            className="px-1.5 py-1 text-[11px] font-mono text-slate-400 hover:text-white rounded hover:bg-gray-800"
            title="Step Back 1 Frame"
          >
            -1F
          </button>

          <button
            onClick={togglePlayPause}
            className="w-8 h-8 rounded-lg bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-md shadow-purple-600/30 transition-all hover:scale-105"
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 translate-x-0.5" />}
          </button>

          <button
            onClick={() => stepFrame(1)}
            className="px-1.5 py-1 text-[11px] font-mono text-slate-400 hover:text-white rounded hover:bg-gray-800"
            title="Step Forward 1 Frame"
          >
            +1F
          </button>

          <button
            onClick={() => seekTo(duration)}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-gray-800"
            title="Jump to End"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Speed & Volume */}
        <div className="flex items-center gap-3">
          
          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded-lg">
            <span className="text-[10px] text-slate-400">Speed:</span>
            <select
              value={playbackSpeed}
              onChange={e => setPlaybackSpeed(parseFloat(e.target.value))}
              className="bg-transparent text-purple-300 font-bold text-xs focus:outline-none cursor-pointer"
            >
              <option value="0.5">0.5x</option>
              <option value="1">1.0x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2.0x</option>
            </select>
          </div>

          {/* Volume Slider */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1 text-slate-400 hover:text-white rounded"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={e => {
                setVolume(parseInt(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="w-16 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-gray-800"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

        </div>

      </div>

    </div>
  );
};
