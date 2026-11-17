import React, { useRef, useState, useEffect } from 'react';
import { useProject, formatSMPTETime } from '../../context/ProjectContext';
import { 
  Play, 
  Pause, 
  Scissors, 
  Trash2, 
  ZoomIn, 
  ZoomOut, 
  Magnet, 
  MousePointer, 
  MessageSquare, 
  CheckSquare, 
  Layers, 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX, 
  Lock, 
  Unlock,
  Plus
} from 'lucide-react';

export const TimelineView: React.FC = () => {
  const { 
    activeProject, 
    isPlaying, 
    togglePlayPause, 
    currentTime, 
    duration, 
    seekTo, 
    zoomLevel, 
    setZoomLevel, 
    activeTool, 
    setActiveTool, 
    isSnapping, 
    setIsSnapping, 
    selectedClipId, 
    setSelectedClipId, 
    splitClipAtPlayhead, 
    deleteClip,
    collaborators,
    showMultiplayerCursors,
    setActiveRightTab,
    addToast
  } = useProject();

  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const [isScrubbing, setIsScrubbing] = useState(false);

  if (!activeProject) return null;

  // Total width of timeline in pixels based on zoom
  const timelinePixelWidth = Math.max(900, duration * zoomLevel);

  // Position of playhead in pixels
  const playheadPixelX = (currentTime / duration) * timelinePixelWidth;

  // Handle timeline scrubbing on click / drag
  const handleTimelineScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineContainerRef.current) return;
    const rect = timelineContainerRef.current.getBoundingClientRect();
    const scrollLeft = timelineContainerRef.current.scrollLeft;
    const clickX = e.clientX - rect.left + scrollLeft;
    const clampedX = Math.max(0, Math.min(timelinePixelWidth, clickX));
    const newTime = (clampedX / timelinePixelWidth) * duration;
    seekTo(newTime);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsScrubbing(true);
    handleTimelineScrub(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isScrubbing) {
      handleTimelineScrub(e);
    }
  };

  const handleMouseUp = () => {
    setIsScrubbing(false);
  };

  // Generate ruler tick marks
  const tickIntervalSec = zoomLevel > 35 ? 1 : zoomLevel > 18 ? 2 : 5;
  const tickCount = Math.ceil(duration / tickIntervalSec);

  return (
    <div 
      className="h-[270px] sm:h-[300px] bg-[#0E121C] border-t border-gray-800 flex flex-col select-none relative"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      
      {/* 1. Timeline Toolbar */}
      <div className="h-10 px-3 bg-gray-900/90 border-b border-gray-800 flex items-center justify-between text-xs">
        
        {/* Editing Tools */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTool('select')}
            className={`p-1.5 rounded-lg flex items-center gap-1 transition-colors ${
              activeTool === 'select'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-gray-800'
            }`}
            title="Selection Tool (V)"
          >
            <MousePointer className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden sm:inline">Select</span>
          </button>

          <button
            onClick={splitClipAtPlayhead}
            className={`p-1.5 rounded-lg flex items-center gap-1 transition-colors ${
              activeTool === 'split'
                ? 'bg-purple-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-gray-800'
            }`}
            title="Razor Split Tool at Playhead (C)"
          >
            <Scissors className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[10px]">Split at Playhead</span>
          </button>

          {selectedClipId && (
            <button
              onClick={() => deleteClip(selectedClipId)}
              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 flex items-center gap-1 transition-colors"
              title="Delete Selected Clip (Del)"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="text-[10px]">Delete</span>
            </button>
          )}

          <div className="h-4 w-px bg-gray-800 mx-1 hidden sm:block" />

          {/* Magnetic Snapping Toggle */}
          <button
            onClick={() => {
              setIsSnapping(!isSnapping);
              addToast('Snapping', isSnapping ? 'Timeline snapping off' : 'Magnetic snapping enabled', 'info');
            }}
            className={`p-1.5 rounded-lg flex items-center gap-1 transition-colors ${
              isSnapping ? 'bg-purple-950/50 text-purple-300 border border-purple-500/30' : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Magnetic Snapping (S)"
          >
            <Magnet className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden sm:inline">Snap</span>
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoomLevel(Math.max(12, zoomLevel - 6))}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-gray-800"
            title="Zoom Out (-)"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <input
            type="range"
            min="12"
            max="60"
            value={zoomLevel}
            onChange={e => setZoomLevel(parseInt(e.target.value))}
            className="w-20 sm:w-28 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            title="Zoom Timeline"
          />

          <button
            onClick={() => setZoomLevel(Math.min(60, zoomLevel + 6))}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-gray-800"
            title="Zoom In (+)"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setZoomLevel(24)}
            className="text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-gray-800"
            title="Fit to Screen"
          >
            Fit
          </button>
        </div>

      </div>

      {/* 2. Timeline Tracks Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Track Headers Sidebar */}
        <div className="w-40 sm:w-48 bg-gray-950 border-r border-gray-800 shrink-0 flex flex-col justify-between py-1 z-20">
          
          {/* Header Top Spacer for Ruler */}
          <div className="h-7 border-b border-gray-800/80 px-2.5 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>TRACK HEADER</span>
            <span className="text-purple-400 font-bold">5 CHANNELS</span>
          </div>

          {/* Track Labels List */}
          <div className="flex-1 space-y-1.5 pt-1 px-1.5 overflow-y-auto">
            {activeProject.tracks.map(track => (
              <div 
                key={track.id} 
                className="h-10 rounded-lg bg-gray-900/80 border border-gray-800/80 px-2 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: track.color }} />
                  <span className="font-semibold text-slate-200 text-[11px] truncate">{track.name}</span>
                </div>
                
                <div className="flex items-center gap-1 text-slate-500">
                  <button className="hover:text-slate-200 p-0.5" title="Lock Track">
                    <Lock className="w-3 h-3" />
                  </button>
                  <button className="hover:text-slate-200 p-0.5" title="Mute/Hide Track">
                    <Eye className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Scrollable Timeline Canvas */}
        <div 
          ref={timelineContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          className="flex-1 overflow-x-auto overflow-y-hidden relative bg-[#0B0E17] cursor-crosshair"
        >
          {/* Timeline Inner Container */}
          <div 
            style={{ width: `${timelinePixelWidth}px` }} 
            className="h-full relative flex flex-col"
          >
            
            {/* Timeline Ruler */}
            <div className="h-7 border-b border-gray-800/80 bg-gray-950/90 relative flex items-center">
              {Array.from({ length: tickCount + 1 }).map((_, i) => {
                const sec = i * tickIntervalSec;
                const leftPx = (sec / duration) * timelinePixelWidth;
                return (
                  <div 
                    key={sec} 
                    className="absolute top-0 bottom-0 border-l border-gray-800 flex flex-col justify-end pb-1 pl-1"
                    style={{ left: `${leftPx}px` }}
                  >
                    <span className="text-[9px] font-mono text-slate-500 select-none">
                      {sec < 10 ? `00:0${sec}` : `00:${sec}`}
                    </span>
                  </div>
                );
              })}

              {/* Comment Timestamp Pins on Ruler */}
              {activeProject.comments.map(c => {
                const pinX = (c.timestamp / duration) * timelinePixelWidth;
                return (
                  <button
                    key={c.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      seekTo(c.timestamp);
                      setActiveRightTab('comments');
                    }}
                    className="absolute -top-0.5 z-30 transform -translate-x-1/2 p-0.5 group"
                    style={{ left: `${pinX}px` }}
                    title={`Comment at ${formatSMPTETime(c.timestamp)}: "${c.content}"`}
                  >
                    <div 
                      className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-md transition-transform group-hover:scale-125 ${
                        c.isResolved ? 'bg-emerald-500 text-white' : 'bg-purple-500 text-white animate-bounce'
                      }`}
                    >
                      <MessageSquare className="w-2 h-2 fill-white" />
                    </div>
                  </button>
                );
              })}

              {/* Task Timestamp Pins on Ruler */}
              {activeProject.tasks.map(t => {
                if (typeof t.timestamp !== 'number') return null;
                const pinX = (t.timestamp / duration) * timelinePixelWidth;
                return (
                  <button
                    key={t.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (typeof t.timestamp === 'number') seekTo(t.timestamp);
                      setActiveRightTab('tasks');
                    }}
                    className="absolute -top-0.5 z-30 transform -translate-x-1/2 p-0.5 group"
                    style={{ left: `${pinX}px` }}
                    title={`Task: "${t.title}" (${t.status})`}
                  >
                    <div className="w-3.5 h-3.5 rounded-sm bg-amber-500 text-black flex items-center justify-center shadow-md group-hover:scale-125">
                      <CheckSquare className="w-2 h-2 fill-black" />
                    </div>
                  </button>
                );
              })}

              {/* Collaborator Live Playheads on Ruler */}
              {showMultiplayerCursors && collaborators.map(c => {
                if (!c.isOnline || typeof c.playheadPosition !== 'number') return null;
                const collabX = (c.playheadPosition / duration) * timelinePixelWidth;
                return (
                  <div
                    key={c.id}
                    className="absolute top-0 z-30 pointer-events-none transform -translate-x-1/2 flex flex-col items-center"
                    style={{ left: `${collabX}px` }}
                  >
                    <div 
                      className="px-1.5 py-0.5 rounded text-[8px] font-bold text-white shadow-lg whitespace-nowrap flex items-center gap-1"
                      style={{ backgroundColor: c.color }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      {c.name.split(' ')[0]}
                    </div>
                    <div 
                      className="w-0.5 h-3 shadow-md"
                      style={{ backgroundColor: c.color }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Playhead Scrubber Vertical Needle */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-pink-500 z-40 shadow-[0_0_10px_rgba(236,72,153,0.9)] pointer-events-none"
              style={{ left: `${playheadPixelX}px` }}
            >
              {/* Playhead Scrubber Diamond Top Handle */}
              <div className="w-4 h-4 bg-pink-500 rotate-45 -translate-x-[7px] -translate-y-1 rounded-sm shadow-xl flex items-center justify-center pointer-events-auto cursor-ew-resize">
                <div className="w-1.5 h-1.5 bg-white rounded-full -rotate-45" />
              </div>
            </div>

            {/* Track Lanes */}
            <div className="flex-1 space-y-1.5 pt-1 px-1">
              {activeProject.tracks.map(track => {
                const trackClips = activeProject.clips.filter(c => c.trackId === track.id);

                return (
                  <div 
                    key={track.id}
                    className="h-10 rounded-lg bg-gray-900/40 border border-gray-800/40 relative flex items-center"
                  >
                    {/* Render Clips for this track */}
                    {trackClips.map(clip => {
                      const clipLeftPx = (clip.startTime / duration) * timelinePixelWidth;
                      const clipWidthPx = (clip.duration / duration) * timelinePixelWidth;
                      const isSelected = selectedClipId === clip.id;

                      return (
                        <div
                          key={clip.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedClipId(clip.id);
                          }}
                          style={{
                            left: `${clipLeftPx}px`,
                            width: `${Math.max(28, clipWidthPx)}px`,
                            backgroundColor: `${clip.color}35`,
                            borderColor: isSelected ? '#F43F5E' : `${clip.color}90`,
                          }}
                          className={`absolute h-8 rounded-md border-2 px-2 flex items-center justify-between text-xs transition-shadow cursor-pointer select-none overflow-hidden ${
                            isSelected ? 'ring-2 ring-pink-500/80 shadow-lg shadow-pink-500/30' : 'hover:brightness-110'
                          }`}
                        >
                          {/* Thumbnail or Waveform Preview */}
                          <div className="flex items-center gap-1.5 truncate">
                            {clip.thumbnailUrl && (
                              <img src={clip.thumbnailUrl} alt="" className="w-5 h-5 rounded object-cover shrink-0" />
                            )}
                            <span className="font-semibold text-[11px] text-white truncate drop-shadow">
                              {clip.title}
                            </span>
                          </div>

                          {/* Audio Waveform visualization */}
                          {clip.type === 'audio' && clip.waveform && (
                            <div className="flex items-center gap-0.5 h-4 opacity-75 shrink-0 ml-1">
                              {clip.waveform.slice(0, 14).map((h, i) => (
                                <div
                                  key={i}
                                  className="w-0.5 bg-blue-300 rounded-full"
                                  style={{ height: `${(h / 100) * 16}px` }}
                                />
                              ))}
                            </div>
                          )}

                          {/* Collaborator Assignment Tag */}
                          {clip.assignedTo && (
                            <span className="text-[8px] bg-black/60 px-1 py-0.5 rounded text-purple-300 font-mono shrink-0 ml-1">
                              {clip.assignedTo.replace('usr_', '@')}
                            </span>
                          )}

                          {/* Trim Handles on ends */}
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/20 hover:bg-white cursor-ew-resize opacity-0 hover:opacity-100" />
                          <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/20 hover:bg-white cursor-ew-resize opacity-0 hover:opacity-100" />
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
