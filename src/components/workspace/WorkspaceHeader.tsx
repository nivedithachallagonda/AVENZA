import React, { useState } from 'react';
import { useProject, formatSMPTETime } from '../../context/ProjectContext';
import { 
  ArrowLeft, 
  Cloud, 
  Share2, 
  Download, 
  Undo2, 
  Redo2, 
  Users, 
  Clock, 
  Sparkles, 
  Save, 
  Check, 
  Sliders, 
  Eye, 
  MousePointer2 
} from 'lucide-react';

export const WorkspaceHeader: React.FC = () => {
  const { 
    activeProject, 
    updateProjectTitle, 
    setView, 
    collaborators, 
    undo, 
    redo, 
    canUndo, 
    canRedo, 
    setIsExportModalOpen, 
    setIsShareModalOpen, 
    activeRightTab, 
    setActiveRightTab, 
    showMultiplayerCursors, 
    setShowMultiplayerCursors,
    addToast,
    saveVersionSnapshot
  } = useProject();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(activeProject?.title || '');
  const [isSaved, setIsSaved] = useState(true);

  if (!activeProject) return null;

  const handleTitleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempTitle.trim()) {
      updateProjectTitle(tempTitle);
      setIsEditingTitle(false);
      addToast('Project Renamed', `New title: ${tempTitle}`, 'info');
    }
  };

  const handleManualSave = () => {
    setIsSaved(false);
    setTimeout(() => {
      setIsSaved(true);
      saveVersionSnapshot('Manual Cloud Save', 'User triggered manual checkpoint save.');
    }, 400);
  };

  return (
    <header className="h-14 bg-gray-950 border-b border-gray-800 px-3 sm:px-4 flex items-center justify-between select-none z-30">
      
      {/* Left: Back & Project Title */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => setView('dashboard')}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-gray-800 transition-colors"
          title="Back to Dashboard"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-gray-800 hidden sm:block" />

        {/* Project Title with inline edit */}
        {isEditingTitle ? (
          <form onSubmit={handleTitleSubmit} className="flex items-center gap-1">
            <input
              type="text"
              autoFocus
              value={tempTitle}
              onChange={e => setTempTitle(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              className="px-2 py-0.5 bg-gray-800 border border-purple-500 rounded text-xs text-white font-semibold focus:outline-none"
            />
            <button type="submit" className="text-purple-400 hover:text-purple-300 p-1">
              <Check className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          <div 
            onClick={() => { setTempTitle(activeProject.title); setIsEditingTitle(true); }}
            className="flex items-center gap-1.5 cursor-pointer group"
          >
            <h2 className="text-xs sm:text-sm font-bold text-white group-hover:text-purple-300 transition-colors truncate max-w-[140px] sm:max-w-xs">
              {activeProject.title}
            </h2>
            <span className="text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
              ✏️
            </span>
          </div>
        )}

        {/* Cloud Auto-save Status */}
        <div className="hidden md:flex items-center gap-1 text-[11px] text-slate-400 bg-gray-900 px-2 py-0.5 rounded-md border border-gray-800">
          <Cloud className={`w-3 h-3 ${isSaved ? 'text-emerald-400' : 'text-amber-400 animate-spin'}`} />
          <span>{isSaved ? 'Cloud Synced' : 'Saving...'}</span>
        </div>
      </div>

      {/* Center: Undo/Redo & Multiplayer Cursors Toggle */}
      <div className="flex items-center gap-1 sm:gap-2">
        <div className="flex items-center bg-gray-900 p-0.5 rounded-lg border border-gray-800">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`p-1.5 rounded text-xs transition-colors ${
              canUndo ? 'text-slate-300 hover:text-white hover:bg-gray-800' : 'text-slate-600 cursor-not-allowed'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className={`p-1.5 rounded text-xs transition-colors ${
              canRedo ? 'text-slate-300 hover:text-white hover:bg-gray-800' : 'text-slate-600 cursor-not-allowed'
            }`}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Multiplayer Cursors Toggle */}
        <button
          onClick={() => {
            setShowMultiplayerCursors(!showMultiplayerCursors);
            addToast('Multiplayer Cursors', showMultiplayerCursors ? 'Live cursors hidden' : 'Live cursors enabled', 'info');
          }}
          className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
            showMultiplayerCursors
              ? 'bg-purple-950/50 border-purple-500/40 text-purple-300'
              : 'bg-gray-900 border-gray-800 text-slate-400 hover:text-slate-200'
          }`}
          title="Toggle visibility of team cursors"
        >
          <MousePointer2 className="w-3.5 h-3.5 text-purple-400" />
          <span>Multiplayer Cursors</span>
        </button>

        {/* Time Machine Quick Button */}
        <button
          onClick={() => setActiveRightTab('history')}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border transition-colors ${
            activeRightTab === 'history'
              ? 'bg-purple-600 text-white border-purple-500'
              : 'bg-gray-900 border-gray-800 text-slate-300 hover:text-white hover:bg-gray-850'
          }`}
          title="Time Machine (Version History)"
        >
          <Clock className="w-3.5 h-3.5 text-purple-300" />
          <span className="hidden sm:inline">Time Machine</span>
        </button>
      </div>

      {/* Right: Live Avatars, Share & Export */}
      <div className="flex items-center gap-2">
        {/* Active Collaborators Avatars */}
        <div 
          onClick={() => setActiveRightTab('collaboration')}
          className="flex items-center -space-x-1.5 cursor-pointer bg-gray-900/90 hover:bg-gray-800/80 p-1 rounded-full border border-gray-800 transition-colors"
          title="Click to view all collaborators"
        >
          {collaborators.map(c => (
            <div key={c.id} className="relative group">
              <img
                src={c.avatar}
                alt={c.name}
                className="w-6 h-6 rounded-full object-cover ring-2 ring-gray-950"
                style={{ borderColor: c.color }}
              />
              <span 
                className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ring-1 ring-gray-950"
                style={{ backgroundColor: c.isOnline ? '#10B981' : '#6B7280' }}
              />
            </div>
          ))}
          <span className="text-[10px] font-bold text-purple-300 pl-2 pr-1.5">
            {collaborators.filter(c => c.isOnline).length} Live
          </span>
        </div>

        {/* Save Snapshot Button */}
        <button
          onClick={handleManualSave}
          className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-gray-850 text-slate-300 hover:text-white text-xs font-semibold rounded-xl border border-gray-800 transition-colors"
          title="Save manual milestone"
        >
          <Save className="w-3.5 h-3.5 text-purple-400" />
          <span>Save</span>
        </button>

        {/* Share Button */}
        <button
          onClick={() => setIsShareModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-gray-850 text-slate-200 hover:text-white text-xs font-semibold rounded-xl border border-gray-700 transition-all shadow-sm"
        >
          <Share2 className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden sm:inline">Share</span>
        </button>

        {/* Export Button */}
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02]"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>
      </div>

    </header>
  );
};
