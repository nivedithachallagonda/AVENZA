import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { NewProjectModal } from './NewProjectModal';
import { 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  Film, 
  Users, 
  MoreVertical, 
  Copy, 
  Trash2, 
  ExternalLink, 
  Sparkles, 
  Share2, 
  HardDrive, 
  Tv, 
  FolderGit2,
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    currentUser, 
    projects, 
    selectProject, 
    duplicateProject, 
    deleteProject, 
    setView, 
    collaborators, 
    addToast 
  } = useProject();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'recent' | 'shared'>('all');
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Filter projects
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'shared') return matchesSearch && p.isShared;
    return matchesSearch;
  });

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#111827] text-slate-100 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {currentUser.name}
            </h1>
            <span className="text-xs bg-purple-950/60 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-semibold">
              Pro Studio
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time multi-track video projects and team collaboration hub.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setView('collaboration_hub')}
            className="px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700 hover:bg-gray-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Users className="w-4 h-4 text-purple-400" />
            Manage Team ({collaborators.length})
          </button>
          <button
            onClick={() => setIsNewProjectOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            Create New Project
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800">
          <p className="text-xs text-slate-400">Total Video Projects</p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-extrabold text-white font-mono">{projects.length}</span>
            <span className="text-xs text-purple-400 font-medium">3 active</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800">
          <p className="text-xs text-slate-400">Live Team Seats</p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-extrabold text-white font-mono">{collaborators.length}</span>
            <span className="text-xs text-emerald-400 font-medium">3 online now</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800">
          <p className="text-xs text-slate-400">Cloud Storage</p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-extrabold text-white font-mono">{currentUser.storageUsedGb} GB</span>
            <span className="text-xs text-slate-400 font-mono">/ {currentUser.storageMaxGb} GB</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800">
          <p className="text-xs text-slate-400">Cloud WebGL Render Engine</p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-extrabold text-emerald-400 font-mono">60 FPS</span>
            <span className="text-xs text-slate-400">Multi-threaded</span>
          </div>
        </div>
      </div>

      {/* Search and Tabs Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 mb-6">
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-gray-900 p-1 rounded-xl border border-gray-800 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'all' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('recent')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'recent' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Recent Cuts
          </button>
          <button
            onClick={() => setActiveTab('shared')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'shared' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Shared With Me
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search projects or tags..."
            className="w-full pl-9 pr-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(proj => (
          <div
            key={proj.id}
            className="group rounded-2xl bg-gray-900 border border-gray-800 hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden shadow-lg flex flex-col justify-between"
          >
            {/* Thumbnail Header */}
            <div 
              className="relative aspect-video w-full bg-gray-950 cursor-pointer overflow-hidden"
              onClick={() => selectProject(proj.id)}
            >
              <img
                src={proj.thumbnail}
                alt={proj.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-80" />
              
              {/* Aspect Ratio Badge */}
              <span className="absolute top-2.5 left-2.5 text-[10px] font-mono font-semibold bg-black/75 backdrop-blur-md px-2 py-0.5 rounded text-white border border-white/10">
                {proj.aspectRatio} · {proj.fps} FPS
              </span>

              {/* Duration Badge */}
              <span className="absolute bottom-2.5 right-2.5 text-[10px] font-mono font-semibold bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-purple-300 border border-purple-500/30">
                00:00:{proj.duration < 10 ? `0${proj.duration}` : proj.duration}:00
              </span>

              {/* Play Overlay On Hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-purple-900/30 backdrop-blur-[2px]">
                <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-xl shadow-purple-600/40">
                  <Film className="w-5 h-5 translate-x-0.5" />
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 
                    onClick={() => selectProject(proj.id)}
                    className="text-sm font-bold text-white hover:text-purple-400 transition-colors cursor-pointer line-clamp-1"
                  >
                    {proj.title}
                  </h3>

                  {/* Options Menu */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === proj.id ? null : proj.id);
                      }}
                      className="p-1 text-slate-400 hover:text-white rounded hover:bg-gray-800"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {activeMenuId === proj.id && (
                      <div 
                        className="absolute right-0 mt-1 w-36 rounded-xl bg-gray-850 border border-gray-700 shadow-xl py-1 z-30 animate-in fade-in zoom-in-95"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => {
                            selectProject(proj.id);
                            setActiveMenuId(null);
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-gray-800 flex items-center gap-2"
                        >
                          <Film className="w-3.5 h-3.5 text-purple-400" /> Open Editor
                        </button>
                        <button
                          onClick={() => {
                            duplicateProject(proj.id);
                            setActiveMenuId(null);
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-gray-800 flex items-center gap-2"
                        >
                          <Copy className="w-3.5 h-3.5" /> Duplicate
                        </button>
                        <button
                          onClick={() => {
                            deleteProject(proj.id);
                            setActiveMenuId(null);
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-950/30 flex items-center gap-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {proj.description}
                </p>
              </div>

              {/* Bottom Meta */}
              <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between text-[11px] text-slate-400">
                {/* Collaborators Avatars */}
                <div className="flex items-center -space-x-1.5">
                  {proj.collaborators.slice(0, 3).map(c => (
                    <img
                      key={c.id}
                      src={c.avatar}
                      alt={c.name}
                      title={`${c.name} (${c.role})`}
                      className="w-6 h-6 rounded-full object-cover ring-2 ring-gray-900"
                    />
                  ))}
                  {proj.collaborators.length > 3 && (
                    <span className="w-6 h-6 rounded-full bg-gray-800 text-[10px] text-slate-300 font-bold flex items-center justify-center ring-2 ring-gray-900">
                      +{proj.collaborators.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Edited {proj.updatedAt}</span>
                </div>
              </div>

            </div>
          </div>
        ))}

        {/* Create Project Card Placeholder */}
        <div
          onClick={() => setIsNewProjectOpen(true)}
          className="rounded-2xl border-2 border-dashed border-gray-800 hover:border-purple-500/50 hover:bg-purple-950/10 transition-all p-6 flex flex-col items-center justify-center text-center cursor-pointer min-h-[280px] group"
        >
          <div className="w-12 h-12 rounded-2xl bg-gray-800 group-hover:bg-purple-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all shadow-md mb-3">
            <Plus className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
            Start Blank Video Project
          </h4>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            16:9 Landscape, 9:16 Vertical Reels, or 1:1 Square
          </p>
        </div>
      </div>

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
      />
    </div>
  );
};
