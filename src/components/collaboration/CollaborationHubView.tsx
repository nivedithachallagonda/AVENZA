import React, { useState } from 'react';
import { useProject, formatSMPTETime } from '../../context/ProjectContext';
import { CollaboratorRole, TaskStatus } from '../../types';
import { 
  Users, 
  UserPlus, 
  CheckSquare, 
  MessageSquare, 
  Activity, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  Share2, 
  Film, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  ChevronRight
} from 'lucide-react';

export const CollaborationHubView: React.FC = () => {
  const { 
    activeProject, 
    collaborators, 
    currentUser, 
    setView, 
    selectProject, 
    setIsShareModalOpen, 
    seekTo, 
    addToast 
  } = useProject();

  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterTask, setFilterTask] = useState<string>('all');

  if (!activeProject) return null;

  // Calculate project metrics
  const totalTasks = activeProject.tasks.length;
  const completedTasks = activeProject.tasks.filter(t => t.status === 'done').length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 75;
  const unresolvedComments = activeProject.comments.filter(c => !c.isResolved);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#111827] text-slate-100 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950/60 border border-purple-500/30 px-2 py-0.5 rounded">
              PROJECT TEAM WORKSPACE
            </span>
            <span className="text-xs text-slate-400">· {activeProject.title}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight">
            Team Collaboration Hub & Audit Log
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage team roles, track live project burndown, and review pending approval comments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setView('workspace')}
            className="px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700 hover:bg-gray-800 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Film className="w-4 h-4 text-purple-400" />
            Jump Back to Editor
          </button>

          <button
            onClick={() => setIsShareModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02]"
          >
            <UserPlus className="w-4 h-4" />
            Invite Teammates
          </button>
        </div>
      </div>

      {/* Progress & Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Progress Card */}
        <div className="p-5 rounded-2xl bg-gray-900 border border-gray-800 flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-400">Project Cut Progress</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-white font-mono">{progressPercent}%</span>
              <span className="text-xs text-emerald-400 font-semibold">{completedTasks} of {totalTasks} tasks done</span>
            </div>
          </div>
          <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden mt-4">
            <div 
              className="bg-gradient-to-r from-purple-600 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Team Seats */}
        <div className="p-5 rounded-2xl bg-gray-900 border border-gray-800">
          <span className="text-xs text-slate-400">Collaborator Seats</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold text-white font-mono">{collaborators.length}</span>
            <span className="text-xs text-purple-400 font-medium">3 active now</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-3">All editors synced via WebRTC</p>
        </div>

        {/* Pending Review Comments */}
        <div className="p-5 rounded-2xl bg-gray-900 border border-gray-800">
          <span className="text-xs text-slate-400">Unresolved Frame Feedback</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold text-pink-400 font-mono">{unresolvedComments.length}</span>
            <span className="text-xs text-slate-400">threads open</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-3">Pinned on video timeline</p>
        </div>

        {/* Render Quality */}
        <div className="p-5 rounded-2xl bg-gray-900 border border-gray-800">
          <span className="text-xs text-slate-400">Target Output Resolution</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold text-white font-mono">4K UHD</span>
            <span className="text-xs text-emerald-400 font-medium">60 FPS</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-3">Color Space: Rec. 709 Wide Gamut</p>
        </div>
      </div>

      {/* Main Grid: Team Members & Tasks / Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 spans): Team Members & Role Permissions */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Member Roles & Permissions Table */}
          <div className="rounded-2xl bg-gray-900 border border-gray-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                Team Members & Granular Permissions
              </h3>
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
              >
                + Add Member
              </button>
            </div>

            <div className="divide-y divide-gray-800/80">
              {collaborators.map(c => (
                <div key={c.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-800" />
                      <span 
                        className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-gray-950"
                        style={{ backgroundColor: c.isOnline ? '#10B981' : '#6B7280' }}
                      />
                    </div>
                    <div>
                      <p className="font-bold text-white flex items-center gap-2">
                        {c.name}
                        {c.id === 'usr_me' && (
                          <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1 rounded font-normal">You</span>
                        )}
                      </p>
                      <p className="text-[11px] text-slate-400">{c.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span 
                      className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold border"
                      style={{ color: c.color, borderColor: `${c.color}40`, backgroundColor: `${c.color}15` }}
                    >
                      {c.isOnline ? 'Online on V1' : 'Offline'}
                    </span>

                    <select
                      defaultValue={c.role}
                      className="px-2.5 py-1 bg-gray-800 border border-gray-700 rounded-lg text-xs text-slate-200 focus:outline-none"
                    >
                      <option value="Lead Editor">Lead Editor (Full Access)</option>
                      <option value="Sound Engineer">Sound Engineer (Audio Tracks)</option>
                      <option value="Motion Designer">Motion Designer (Overlays)</option>
                      <option value="Reviewer">Reviewer (Comment Only)</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assigned & Pending Tasks Board */}
          <div className="rounded-2xl bg-gray-900 border border-gray-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                Assigned Team Deliverables ({activeProject.tasks.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeProject.tasks.map(task => (
                <div 
                  key={task.id}
                  className="p-3.5 rounded-xl bg-gray-850/80 border border-gray-800 space-y-2 text-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-gray-800 text-slate-300 border border-gray-700">
                        {task.priority} Priority
                      </span>
                      {typeof task.timestamp === 'number' && (
                        <button
                          onClick={() => {
                            seekTo(task.timestamp!);
                            setView('workspace');
                          }}
                          className="font-mono text-[10px] text-purple-300 hover:underline flex items-center gap-1"
                        >
                          Frame {formatSMPTETime(task.timestamp)}
                        </button>
                      )}
                    </div>
                    <h5 className="font-bold text-white">{task.title}</h5>
                    <p className="text-[11px] text-slate-400 mt-1">{task.description}</p>
                  </div>

                  <div className="pt-2 border-t border-gray-800 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <img src={task.assigneeAvatar} alt="" className="w-4 h-4 rounded-full object-cover" />
                      <span>{task.assigneeName}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      task.status === 'done' ? 'bg-emerald-950 text-emerald-400' :
                      task.status === 'in_progress' ? 'bg-purple-950 text-purple-300' :
                      'bg-gray-800 text-slate-400'
                    }`}>
                      {task.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Live Team Activity Feed */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-gray-900 border border-gray-800 p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400" />
              Live Project Audit Stream
            </h3>

            <div className="space-y-3.5 relative before:absolute before:inset-y-0 before:left-3 before:w-px before:bg-gray-800">
              {[
                { time: '2m ago', user: 'Sarah Chen', action: 'trimmed Keynote Intro clip on Track V1', icon: '✂️' },
                { time: '8m ago', user: 'Alex Rivera', action: 'equalized vocal track and added -18dB ducking', icon: '🎙️' },
                { time: '14m ago', user: 'CollabCut AI', action: 'auto-cut 3 awkward silences (saved 2.4s)', icon: '✨' },
                { time: '25m ago', user: 'Jordan Lee', action: 'left comment: "Punch in 10% on intro speaker"', icon: '💬' },
                { time: '40m ago', user: 'Elena Rostova', action: 'added kinetic lower-third overlay on Track T1', icon: '🎬' },
                { time: '1h ago', user: 'Marcus Vance', action: 'initialized Time Machine checkpoint v1.2', icon: '💾' },
              ].map((item, idx) => (
                <div key={idx} className="relative pl-7 text-xs space-y-0.5">
                  <span className="absolute left-1.5 top-0.5 text-xs">{item.icon}</span>
                  <p className="text-slate-300">
                    <strong className="text-white font-semibold">{item.user}</strong> {item.action}
                  </p>
                  <span className="text-[10px] text-slate-500 font-mono">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Share Link Widget */}
          <div className="rounded-2xl bg-gradient-to-tr from-purple-950/60 to-gray-900 border border-purple-500/30 p-5 space-y-3">
            <h4 className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
              <Share2 className="w-4 h-4" />
              Quick Invite Link
            </h4>
            <p className="text-xs text-slate-300">
              Anyone with this link can join this project as an editor in their browser.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={`https://collabcut.io/join/${activeProject.id}?token=live_multi`}
                className="flex-1 px-3 py-1.5 bg-black/60 border border-purple-500/30 rounded-lg text-[11px] font-mono text-purple-200"
              />
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(`https://collabcut.io/join/${activeProject.id}?token=live_multi`);
                  addToast('Link Copied', 'Invitation URL copied to clipboard', 'purple');
                }}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold shrink-0"
              >
                Copy
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
