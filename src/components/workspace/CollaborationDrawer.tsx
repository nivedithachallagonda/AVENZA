import React, { useState } from 'react';
import { useProject, formatSMPTETime } from '../../context/ProjectContext';
import { TaskStatus, TaskPriority } from '../../types';
import { 
  Users, 
  MessageSquare, 
  CheckSquare, 
  Clock, 
  Sparkles, 
  Plus, 
  Check, 
  CornerDownRight, 
  RotateCcw, 
  Send, 
  Trash2, 
  ArrowRight, 
  Sliders, 
  Wand2, 
  Play, 
  Tag, 
  Calendar, 
  AlertCircle 
} from 'lucide-react';

export const CollaborationDrawer: React.FC = () => {
  const { 
    activeProject, 
    activeRightTab, 
    setActiveRightTab, 
    collaborators, 
    followCollaborator, 
    activeCollaboratorFollow,
    addComment, 
    resolveComment, 
    deleteComment, 
    addCommentReply, 
    addTask, 
    updateTaskStatus, 
    deleteTask, 
    currentTime, 
    seekTo, 
    saveVersionSnapshot, 
    restoreVersion,
    aiDetectSilences,
    aiGenerateSubtitles,
    aiSuggestTransitions,
    aiEnhanceAudio,
    currentUser,
    addToast
  } = useProject();

  // Comments State
  const [commentText, setCommentText] = useState('');
  const [commentTag, setCommentTag] = useState('Feedback');
  const [replyInputId, setReplyInputId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Task Creation State
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskAssignee, setTaskAssignee] = useState(collaborators[0]?.id || '');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('medium');
  const [taskDueDate, setTaskDueDate] = useState('Tomorrow');

  // Time Machine State
  const [snapshotTitle, setSnapshotTitle] = useState('');
  const [snapshotSummary, setSnapshotSummary] = useState('');
  const [isSavingSnapshot, setIsSavingSnapshot] = useState(false);

  // AI Assistant Chat State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiChatMessages, setAiChatMessages] = useState<{ sender: 'user' | 'ai'; text: string; actionType?: string }[]>([
    {
      sender: 'ai',
      text: 'Hello Marcus! I analyzed your timeline. I found 3 pauses in speaker audio between 00:08 and 00:15 that can be trimmed for higher retention. Would you like me to auto-cut them?'
    }
  ]);

  if (!activeProject) return null;

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(commentText, commentTag);
    setCommentText('');
  };

  const handleSendReply = (commentId: string) => {
    if (!replyText.trim()) return;
    addCommentReply(commentId, replyText);
    setReplyText('');
    setReplyInputId(null);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addTask(taskTitle, taskDesc, taskAssignee, taskPriority, currentTime, taskDueDate);
    setTaskTitle('');
    setTaskDesc('');
    setIsCreatingTask(false);
  };

  const handleSaveSnapshot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!snapshotTitle.trim()) return;
    saveVersionSnapshot(snapshotTitle, snapshotSummary);
    setSnapshotTitle('');
    setSnapshotSummary('');
    setIsSavingSnapshot(false);
  };

  const handleAiSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    const userMsg = aiPrompt.trim();
    setAiChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setAiPrompt('');

    setTimeout(() => {
      let aiReply = "I reviewed your project tracks. I recommend adding a 0.5s cross-dissolve at 00:12 to smooth the scene transition.";
      if (userMsg.toLowerCase().includes('subtitle') || userMsg.toLowerCase().includes('caption')) {
        aiReply = "Generated word-level captions across Track T1. You can inspect the text clips on the timeline.";
        aiGenerateSubtitles();
      } else if (userMsg.toLowerCase().includes('silence') || userMsg.toLowerCase().includes('cut') || userMsg.toLowerCase().includes('pause')) {
        aiReply = "Trimmed 3 silent pauses (saved 2.4s). Timeline has been updated.";
        aiDetectSilences();
      } else if (userMsg.toLowerCase().includes('audio') || userMsg.toLowerCase().includes('sound')) {
        aiReply = "Audio ducking applied to BGM on Track A2 during dialogue on Track A1.";
        aiEnhanceAudio();
      }

      setAiChatMessages(prev => [...prev, { sender: 'ai', text: aiReply }]);
    }, 600);
  };

  return (
    <div className="w-80 sm:w-96 bg-gray-950 border-l border-gray-800 flex flex-col h-full select-none">
      
      {/* Top Tab Bar */}
      <div className="flex items-center justify-around bg-gray-900 border-b border-gray-800 p-1">
        <button
          onClick={() => setActiveRightTab('collaboration')}
          className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            activeRightTab === 'collaboration' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
          title="Live Multiplayer Team"
        >
          <Users className="w-4 h-4" />
          <span className="text-[10px]">Team</span>
        </button>

        <button
          onClick={() => setActiveRightTab('comments')}
          className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors relative ${
            activeRightTab === 'comments' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
          title="Frame Comments"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="text-[10px]">Comments</span>
          {activeProject.comments.filter(c => !c.isResolved).length > 0 && (
            <span className="w-4 h-4 rounded-full bg-pink-500 text-[9px] font-bold text-white flex items-center justify-center">
              {activeProject.comments.filter(c => !c.isResolved).length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveRightTab('tasks')}
          className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            activeRightTab === 'tasks' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
          title="Smart Tasks"
        >
          <CheckSquare className="w-4 h-4" />
          <span className="text-[10px]">Tasks</span>
        </button>

        <button
          onClick={() => setActiveRightTab('history')}
          className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            activeRightTab === 'history' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
          title="Time Machine (Version History)"
        >
          <Clock className="w-4 h-4" />
          <span className="text-[10px]">History</span>
        </button>

        <button
          onClick={() => setActiveRightTab('ai')}
          className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            activeRightTab === 'ai' ? 'bg-purple-600 text-white' : 'text-purple-400 hover:text-purple-300'
          }`}
          title="AI Assistant Copilot"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-[10px]">AI</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-y-auto p-3 text-slate-200">
        
        {/* 1. COLLABORATION / LIVE TEAM TAB */}
        {activeRightTab === 'collaboration' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Multiplayer Session
              </h4>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Sync
              </span>
            </div>

            <div className="space-y-2.5">
              {collaborators.map(c => {
                const isFollowing = activeCollaboratorFollow === c.id;

                return (
                  <div
                    key={c.id}
                    className="p-3 rounded-xl bg-gray-900 border border-gray-800 hover:border-purple-500/30 transition-all text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="relative">
                          <img src={c.avatar} alt={c.name} className="w-9 h-9 rounded-full object-cover" />
                          <span
                            className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-gray-950"
                            style={{ backgroundColor: c.isOnline ? '#10B981' : '#6B7280' }}
                          />
                        </div>
                        <div>
                          <p className="font-bold text-white flex items-center gap-1.5">
                            {c.name}
                            <span 
                              className="w-2 h-2 rounded-full inline-block"
                              style={{ backgroundColor: c.color }}
                              title={`Cursor Color: ${c.color}`}
                            />
                          </p>
                          <p className="text-[11px] text-purple-400">{c.role}</p>
                        </div>
                      </div>

                      {c.isOnline && typeof c.playheadPosition === 'number' && (
                        <button
                          onClick={() => followCollaborator(c.id)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                            isFollowing
                              ? 'bg-purple-600 text-white shadow-sm'
                              : 'bg-gray-800 hover:bg-gray-750 text-slate-300'
                          }`}
                        >
                          {isFollowing ? '✓ Following' : 'Follow Playhead'}
                        </button>
                      )}
                    </div>

                    {c.isOnline ? (
                      <div className="p-2 rounded-lg bg-gray-950/60 border border-gray-850 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 truncate max-w-[170px]">
                          {c.activeAction}
                        </span>
                        {typeof c.playheadPosition === 'number' && (
                          <button
                            onClick={() => seekTo(c.playheadPosition!)}
                            className="font-mono text-purple-300 font-bold hover:underline"
                            title="Jump to their playhead"
                          >
                            @{formatSMPTETime(c.playheadPosition)}
                          </button>
                        )}
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-500 italic">Offline · Left 3 comments</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. FRAME COMMENTS TAB */}
        {activeRightTab === 'comments' && (
          <div className="space-y-4">
            
            {/* Add Comment Box */}
            <form onSubmit={handlePostComment} className="p-3 rounded-xl bg-gray-900 border border-gray-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                  Leave Frame Comment
                </span>
                <span className="font-mono text-purple-300 font-bold bg-purple-950/60 px-2 py-0.5 rounded text-[10px] border border-purple-500/30">
                  @{formatSMPTETime(currentTime)}
                </span>
              </div>

              <textarea
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="What should be tweaked at this timestamp? (e.g. punch in 10%, trim silence...)"
                rows={2}
                className="w-full p-2 bg-gray-950 border border-gray-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
              />

              <div className="flex items-center justify-between">
                <select
                  value={commentTag}
                  onChange={e => setCommentTag(e.target.value)}
                  className="px-2 py-1 bg-gray-800 border border-gray-700 rounded-lg text-[10px] text-slate-300 focus:outline-none"
                >
                  <option value="Framing">Framing / Scale</option>
                  <option value="Audio Mix">Audio Mix</option>
                  <option value="Color">Color Grade</option>
                  <option value="Pacing">Pacing & Cut</option>
                  <option value="Feedback">General Feedback</option>
                </select>

                <button
                  type="submit"
                  className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  Pin Comment
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Timeline Threads ({activeProject.comments.length})
              </h4>

              {activeProject.comments.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs">
                  No comments left yet. Scrub timeline and leave feedback.
                </div>
              ) : (
                activeProject.comments.map(c => (
                  <div
                    key={c.id}
                    className={`p-3 rounded-xl border transition-all text-xs space-y-2 ${
                      c.isResolved
                        ? 'bg-gray-900/40 border-gray-800/60 opacity-60'
                        : 'bg-gray-900 border-gray-800 hover:border-purple-500/40'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={c.authorAvatar} alt={c.authorName} className="w-6 h-6 rounded-full object-cover" />
                        <div>
                          <span className="font-bold text-white leading-none">{c.authorName}</span>
                          <span className="text-[10px] text-slate-500 ml-1.5">{c.createdAt}</span>
                        </div>
                      </div>

                      {/* Jump to Frame button */}
                      <button
                        onClick={() => seekTo(c.timestamp)}
                        className="font-mono text-[10px] bg-purple-950/60 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded font-bold hover:bg-purple-900 transition-colors flex items-center gap-1"
                      >
                        <Play className="w-2.5 h-2.5 fill-purple-300" />
                        {formatSMPTETime(c.timestamp)}
                      </button>
                    </div>

                    {/* Content */}
                    <p className="text-slate-200 leading-relaxed text-xs pl-8">{c.content}</p>

                    {/* Tag & Actions */}
                    <div className="flex items-center justify-between pl-8 pt-1 border-t border-gray-800/60 text-[10px]">
                      {c.tag && (
                        <span className="text-purple-400 bg-purple-950/50 px-1.5 py-0.5 rounded border border-purple-500/20">
                          {c.tag}
                        </span>
                      )}

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => resolveComment(c.id)}
                          className={`px-2 py-0.5 rounded font-medium flex items-center gap-1 transition-colors ${
                            c.isResolved
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <Check className="w-3 h-3" />
                          {c.isResolved ? 'Resolved' : 'Resolve'}
                        </button>

                        <button
                          onClick={() => setReplyInputId(replyInputId === c.id ? null : c.id)}
                          className="text-slate-400 hover:text-white"
                        >
                          Reply
                        </button>

                        <button
                          onClick={() => deleteComment(c.id)}
                          className="text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Replies */}
                    {c.replies && c.replies.length > 0 && (
                      <div className="pl-8 pt-2 space-y-1.5">
                        {c.replies.map(r => (
                          <div key={r.id} className="p-2 rounded bg-gray-950/80 border border-gray-800 text-[11px]">
                            <div className="flex items-center justify-between text-slate-400 mb-0.5">
                              <span className="font-bold text-slate-300">{r.authorName}</span>
                              <span className="text-[9px]">{r.createdAt}</span>
                            </div>
                            <p className="text-slate-200">{r.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Input */}
                    {replyInputId === c.id && (
                      <div className="pl-8 pt-2 flex items-center gap-1.5">
                        <input
                          type="text"
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                          placeholder="Write reply..."
                          className="flex-1 px-2.5 py-1 bg-gray-950 border border-gray-700 rounded text-xs text-white focus:outline-none focus:border-purple-500"
                        />
                        <button
                          onClick={() => handleSendReply(c.id)}
                          className="px-2.5 py-1 bg-purple-600 text-white rounded text-xs font-semibold"
                        >
                          Send
                        </button>
                      </div>
                    )}

                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* 3. SMART TASKS TAB */}
        {activeRightTab === 'tasks' && (
          <div className="space-y-4">
            
            {/* Create Task Toggle */}
            {!isCreatingTask ? (
              <button
                onClick={() => setIsCreatingTask(true)}
                className="w-full p-2.5 rounded-xl border border-dashed border-purple-500/40 bg-purple-950/20 hover:bg-purple-950/40 text-purple-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Assign New Task at Current Frame
              </button>
            ) : (
              <form onSubmit={handleCreateTask} className="p-3 rounded-xl bg-gray-900 border border-purple-500/30 space-y-2.5 text-xs">
                <div className="flex items-center justify-between font-bold text-white">
                  <span>Create & Assign Task</span>
                  <button type="button" onClick={() => setIsCreatingTask(false)} className="text-slate-500 hover:text-white">✕</button>
                </div>

                <input
                  type="text"
                  required
                  placeholder="Task title (e.g. Master dialogue on Track A1)"
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  className="w-full p-2 bg-gray-950 border border-gray-800 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500"
                />

                <textarea
                  placeholder="Description & details..."
                  rows={2}
                  value={taskDesc}
                  onChange={e => setTaskDesc(e.target.value)}
                  className="w-full p-2 bg-gray-950 border border-gray-800 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
                />

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Assignee</label>
                    <select
                      value={taskAssignee}
                      onChange={e => setTaskAssignee(e.target.value)}
                      className="w-full p-1.5 bg-gray-950 border border-gray-800 rounded text-xs text-white"
                    >
                      {collaborators.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.role})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Priority</label>
                    <select
                      value={taskPriority}
                      onChange={e => setTaskPriority(e.target.value as any)}
                      className="w-full p-1.5 bg-gray-950 border border-gray-800 rounded text-xs text-white"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsCreatingTask(false)}
                    className="px-3 py-1 bg-gray-800 rounded text-slate-400 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-semibold"
                  >
                    Assign Task
                  </button>
                </div>
              </form>
            )}

            {/* Task List */}
            <div className="space-y-2.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Project Backlog ({activeProject.tasks.length})
              </h4>

              {activeProject.tasks.map(task => {
                const getPriorityBadge = () => {
                  switch (task.priority) {
                    case 'urgent': return 'bg-rose-950 text-rose-300 border-rose-500/30';
                    case 'high': return 'bg-amber-950 text-amber-300 border-amber-500/30';
                    default: return 'bg-gray-800 text-slate-300 border-gray-700';
                  }
                };

                return (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl bg-gray-900 border border-gray-800 hover:border-purple-500/30 transition-all text-xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${getPriorityBadge()}`}>
                          {task.priority}
                        </span>
                        <h5 className="font-bold text-white mt-1">{task.title}</h5>
                      </div>

                      {typeof task.timestamp === 'number' && (
                        <button
                          onClick={() => seekTo(task.timestamp!)}
                          className="font-mono text-[10px] text-purple-300 bg-purple-950/60 border border-purple-500/30 px-1.5 py-0.5 rounded flex items-center gap-1 font-bold shrink-0 hover:bg-purple-900"
                          title="Jump to frame"
                        >
                          <Play className="w-2.5 h-2.5 fill-purple-300" />
                          {formatSMPTETime(task.timestamp)}
                        </button>
                      )}
                    </div>

                    <p className="text-slate-300 text-[11px] leading-relaxed">{task.description}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-800 text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <img src={task.assigneeAvatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                        <span className="text-slate-300">{task.assigneeName}</span>
                      </div>

                      {/* Status Dropdown */}
                      <select
                        value={task.status}
                        onChange={e => updateTaskStatus(task.id, e.target.value as any)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border focus:outline-none cursor-pointer ${
                          task.status === 'done' ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30' :
                          task.status === 'in_progress' ? 'bg-purple-950/80 text-purple-300 border-purple-500/30' :
                          'bg-gray-800 text-slate-300 border-gray-700'
                        }`}
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="review">Needs Review</option>
                        <option value="done">Completed ✓</option>
                      </select>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* 4. TIME MACHINE (VERSION HISTORY) TAB */}
        {activeRightTab === 'history' && (
          <div className="space-y-4">
            
            {/* Save Milestone Snapshot Box */}
            {!isSavingSnapshot ? (
              <button
                onClick={() => setIsSavingSnapshot(true)}
                className="w-full p-2.5 rounded-xl border border-dashed border-purple-500/40 bg-purple-950/20 hover:bg-purple-950/40 text-purple-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Save Time Machine Snapshot
              </button>
            ) : (
              <form onSubmit={handleSaveSnapshot} className="p-3 rounded-xl bg-gray-900 border border-purple-500/30 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-white">
                  <span>Save Version Milestone</span>
                  <button type="button" onClick={() => setIsSavingSnapshot(false)} className="text-slate-500 hover:text-white">✕</button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Version name (e.g. Director Cut v2)"
                  value={snapshotTitle}
                  onChange={e => setSnapshotTitle(e.target.value)}
                  className="w-full p-2 bg-gray-950 border border-gray-800 rounded text-xs text-white focus:outline-none focus:border-purple-500"
                />
                <textarea
                  placeholder="Summary of changes..."
                  rows={2}
                  value={snapshotSummary}
                  onChange={e => setSnapshotSummary(e.target.value)}
                  className="w-full p-2 bg-gray-950 border border-gray-800 rounded text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button type="button" onClick={() => setIsSavingSnapshot(false)} className="px-3 py-1 bg-gray-800 rounded text-slate-400">Cancel</button>
                  <button type="submit" className="px-3 py-1 bg-purple-600 text-white rounded font-semibold">Save Milestone</button>
                </div>
              </form>
            )}

            {/* Version History Timeline */}
            <div className="space-y-3 relative before:absolute before:inset-y-0 before:left-3.5 before:w-0.5 before:bg-gray-800">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 pl-8">
                Version History Milestones
              </h4>

              {activeProject.versions.map((ver, idx) => (
                <div key={ver.id} className="relative pl-8 space-y-1">
                  {/* Timeline Dot */}
                  <div className={`absolute left-2.5 top-2.5 w-2.5 h-2.5 rounded-full ring-4 ring-gray-950 ${
                    idx === 0 ? 'bg-purple-500' : 'bg-gray-600'
                  }`} />

                  <div className="p-3 rounded-xl bg-gray-900 border border-gray-800 hover:border-purple-500/40 transition-all text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{ver.versionNumber}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{ver.createdAt}</span>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed">{ver.summary}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-800 text-[10px]">
                      <div className="flex items-center gap-1 text-slate-400">
                        <img src={ver.authorAvatar} alt="" className="w-4 h-4 rounded-full object-cover" />
                        <span>{ver.authorName}</span>
                      </div>

                      <button
                        onClick={() => restoreVersion(ver.id)}
                        className="px-2.5 py-1 rounded bg-purple-950/60 hover:bg-purple-900 text-purple-300 border border-purple-500/30 font-semibold flex items-center gap-1 transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Restore Version
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* 5. AI EDITING ASSISTANT TAB */}
        {activeRightTab === 'ai' && (
          <div className="h-full flex flex-col justify-between space-y-3">
            
            {/* Quick AI Action Pills */}
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={aiDetectSilences}
                className="p-2 rounded-lg bg-gray-900 border border-gray-800 hover:border-purple-500 text-left text-[11px] text-purple-300 transition-colors"
              >
                ✂️ Auto-Cut Silence
              </button>
              <button
                onClick={aiGenerateSubtitles}
                className="p-2 rounded-lg bg-gray-900 border border-gray-800 hover:border-pink-500 text-left text-[11px] text-pink-300 transition-colors"
              >
                ✨ Sync Subtitles
              </button>
              <button
                onClick={aiSuggestTransitions}
                className="p-2 rounded-lg bg-gray-900 border border-gray-800 hover:border-indigo-500 text-left text-[11px] text-indigo-300 transition-colors"
              >
                🎬 Add Transitions
              </button>
              <button
                onClick={aiEnhanceAudio}
                className="p-2 rounded-lg bg-gray-900 border border-gray-800 hover:border-emerald-500 text-left text-[11px] text-emerald-300 transition-colors"
              >
                🎙️ Master Voice
              </button>
            </div>

            {/* Chat History Box */}
            <div className="flex-1 overflow-y-auto space-y-2 p-1 min-h-[200px]">
              {aiChatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-2.5 rounded-xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-purple-600 text-white rounded-br-none shadow-md'
                        : 'bg-gray-900 border border-purple-500/20 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    {msg.sender === 'ai' && (
                      <p className="text-[10px] font-bold text-purple-400 mb-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> CollabCut AI
                      </p>
                    )}
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input Prompt */}
            <form onSubmit={handleAiSend} className="flex items-center gap-1.5 pt-2 border-t border-gray-800">
              <input
                type="text"
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                placeholder="Ask CollabCut AI to edit or analyze..."
                className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                className="p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-md transition-all shrink-0"
                title="Send Prompt"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>
        )}

      </div>

    </div>
  );
};
