import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { 
  VideoProject, 
  TimelineClip, 
  TimelineTrack, 
  FrameComment, 
  ProjectTask, 
  ProjectVersion, 
  Collaborator, 
  UserProfile,
  ProjectAspectRatio,
  TaskStatus,
  TaskPriority
} from '../types';
import { INITIAL_PROJECTS, CURRENT_USER, MOCK_COLLABORATORS } from '../data/mockData';

export type AppView = 'landing' | 'auth' | 'dashboard' | 'workspace' | 'collaboration_hub';

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'purple';
  title: string;
  message: string;
  timestamp: string;
}

interface ProjectContextType {
  // Navigation & User
  view: AppView;
  setView: (view: AppView) => void;
  currentUser: UserProfile;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  loginUser: (email: string, name?: string) => void;
  logoutUser: () => void;
  
  // Projects
  projects: VideoProject[];
  activeProject: VideoProject | null;
  selectProject: (projectId: string) => void;
  createProject: (title: string, aspectRatio: ProjectAspectRatio, resolution: string, template?: string) => VideoProject;
  updateProjectTitle: (newTitle: string) => void;
  duplicateProject: (projectId: string) => void;
  deleteProject: (projectId: string) => void;
  
  // Video Playback & Timeline
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  togglePlayPause: () => void;
  currentTime: number;
  setCurrentTime: (time: number) => void;
  seekTo: (time: number) => void;
  stepFrame: (frames: number) => void; // +1 or -1 frame
  duration: number;
  volume: number;
  setVolume: (vol: number) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
  zoomLevel: number;
  setZoomLevel: (zoom: number) => void;
  activeTool: 'select' | 'split' | 'trim' | 'text' | 'hand';
  setActiveTool: (tool: 'select' | 'split' | 'trim' | 'text' | 'hand') => void;
  isSnapping: boolean;
  setIsSnapping: (snap: boolean) => void;
  selectedClipId: string | null;
  setSelectedClipId: (id: string | null) => void;
  
  // Timeline Clip Manipulations
  addClip: (clip: Omit<TimelineClip, 'id'>) => void;
  updateClip: (clipId: string, updates: Partial<TimelineClip>) => void;
  splitClipAtPlayhead: () => void;
  deleteClip: (clipId: string) => void;
  
  // Collaboration & Multiplayer Cursors
  collaborators: Collaborator[];
  showMultiplayerCursors: boolean;
  setShowMultiplayerCursors: (show: boolean) => void;
  followCollaborator: (collaboratorId: string) => void;
  activeCollaboratorFollow: string | null;
  
  // Comments
  addComment: (text: string, tag?: string) => void;
  resolveComment: (commentId: string) => void;
  deleteComment: (commentId: string) => void;
  addCommentReply: (commentId: string, text: string) => void;
  
  // Tasks
  addTask: (title: string, description: string, assigneeId: string, priority: TaskPriority, timestamp?: number, dueDate?: string) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  deleteTask: (taskId: string) => void;
  
  // Time Machine / Versions
  saveVersionSnapshot: (title: string, summary: string) => void;
  restoreVersion: (versionId: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  
  // AI Assistant Actions
  aiDetectSilences: () => { detectedCount: number; savedSeconds: number };
  aiGenerateSubtitles: () => void;
  aiSuggestTransitions: () => void;
  aiEnhanceAudio: () => void;
  
  // Notifications
  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  
  // Modals & Panels
  isExportModalOpen: boolean;
  setIsExportModalOpen: (open: boolean) => void;
  isShareModalOpen: boolean;
  setIsShareModalOpen: (open: boolean) => void;
  activeRightTab: 'collaboration' | 'comments' | 'tasks' | 'history' | 'ai';
  setActiveRightTab: (tab: 'collaboration' | 'comments' | 'tasks' | 'history' | 'ai') => void;
  isMediaDrawerOpen: boolean;
  setIsMediaDrawerOpen: (open: boolean) => void;
  
  // Custom Media Upload
  handleUserFileUpload: (file: File) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const STORAGE_KEY = 'collabcut_projects_v2';
const USER_KEY = 'collabcut_current_user_v2';

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [view, setView] = useState<AppView>('landing');
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : CURRENT_USER;
    } catch {
      return CURRENT_USER;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // Projects State
  const [projects, setProjects] = useState<VideoProject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed reading projects from localStorage', e);
    }
    return INITIAL_PROJECTS;
  });

  const [activeProjectId, setActiveProjectId] = useState<string>('proj_hero_launch');
  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0] || null;

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
    } catch (e) {
      console.warn('LocalStorage save failed for user', e);
    }
  }, [currentUser]);

  // Video Player & Playback State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(4.5);
  const [volume, setVolume] = useState<number>(85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(24); // px per second
  const [activeTool, setActiveTool] = useState<'select' | 'split' | 'trim' | 'text' | 'hand'>('select');
  const [isSnapping, setIsSnapping] = useState<boolean>(true);
  const [selectedClipId, setSelectedClipId] = useState<string | null>('c1');

  // Collaboration State
  const [collaborators, setCollaborators] = useState<Collaborator[]>(MOCK_COLLABORATORS);
  const [showMultiplayerCursors, setShowMultiplayerCursors] = useState<boolean>(true);
  const [activeCollaboratorFollow, setActiveCollaboratorFollow] = useState<string | null>(null);

  // Modals & Drawers
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [activeRightTab, setActiveRightTab] = useState<'collaboration' | 'comments' | 'tasks' | 'history' | 'ai'>('comments');
  const [isMediaDrawerOpen, setIsMediaDrawerOpen] = useState<boolean>(true);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([
    {
      id: 't-init',
      type: 'purple',
      title: 'CollabCut Multi-User Session Live',
      message: 'Sarah and Alex are actively editing the timeline with you.',
      timestamp: 'Just now'
    }
  ]);

  const addToast = (title: string, message: string, type: ToastMessage['type'] = 'info') => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      title,
      message,
      type,
      timestamp: 'Just now'
    };
    setToasts(prev => [newToast, ...prev.slice(0, 4)]);
    setTimeout(() => {
      removeToast(newToast.id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Undo / Redo history stacks
  const [historyStack, setHistoryStack] = useState<TimelineClip[][]>([]);
  const [redoStack, setRedoStack] = useState<TimelineClip[][]>([]);

  const pushHistory = (clips: TimelineClip[]) => {
    setHistoryStack(prev => [...prev.slice(-20), clips]);
    setRedoStack([]);
  };

  const undo = () => {
    if (historyStack.length === 0 || !activeProject) return;
    const previous = historyStack[historyStack.length - 1];
    setRedoStack(prev => [...prev, activeProject.clips]);
    setHistoryStack(prev => prev.slice(0, prev.length - 1));
    updateActiveProjectClips(previous, false);
    addToast('Undo Action', 'Reverted last timeline edit', 'info');
  };

  const redo = () => {
    if (redoStack.length === 0 || !activeProject) return;
    const next = redoStack[redoStack.length - 1];
    setHistoryStack(prev => [...prev, activeProject.clips]);
    setRedoStack(prev => prev.slice(0, prev.length - 1));
    updateActiveProjectClips(next, false);
    addToast('Redo Action', 'Restored next timeline edit', 'info');
  };

  const canUndo = historyStack.length > 0;
  const canRedo = redoStack.length > 0;

  // Project update helpers
  const updateActiveProjectClips = (newClips: TimelineClip[], recordHistory = true) => {
    if (!activeProject) return;
    if (recordHistory) {
      pushHistory(activeProject.clips);
    }
    setProjects(prev => prev.map(p => {
      if (p.id === activeProject.id) {
        return {
          ...p,
          clips: newClips,
          updatedAt: 'Just now'
        };
      }
      return p;
    }));
  };

  // Playback timer loop
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    lastTimeRef.current = performance.now();

    const loop = (now: number) => {
      const deltaSec = ((now - lastTimeRef.current) / 1000) * playbackSpeed;
      lastTimeRef.current = now;

      setCurrentTime(prevTime => {
        const maxDuration = activeProject ? activeProject.duration : 60;
        const nextTime = prevTime + deltaSec;
        if (nextTime >= maxDuration) {
          setIsPlaying(false);
          return 0;
        }
        return nextTime;
      });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, playbackSpeed, activeProject]);

  // Simulate subtle real-time collaborator movements & edits
  useEffect(() => {
    const interval = setInterval(() => {
      setCollaborators(prev => prev.map(collab => {
        if (!collab.isOnline) return collab;
        // Subtle drift in position
        const delta = (Math.random() - 0.48) * 1.5;
        const nextPos = Math.max(0, Math.min(40, (collab.playheadPosition || 10) + delta));
        
        // Random activity updates
        const activities = [
          'Trimming scene 2',
          'Fine-tuning audio gain',
          'Adjusting subtitle typography',
          'Reviewing playhead cut',
          'Syncing sound effects',
          'Adding keyframe easing'
        ];
        const newAction = Math.random() > 0.7 ? activities[Math.floor(Math.random() * activities.length)] : collab.activeAction;

        return {
          ...collab,
          playheadPosition: parseFloat(nextPos.toFixed(1)),
          cursorX: Math.max(10, Math.min(90, (collab.cursorX || 40) + (Math.random() - 0.5) * 6)),
          cursorY: Math.max(20, Math.min(85, (collab.cursorY || 60) + (Math.random() - 0.5) * 4)),
          activeAction: newAction,
        };
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  const seekTo = (time: number) => {
    const maxDur = activeProject ? activeProject.duration : 60;
    const clamped = Math.max(0, Math.min(maxDur, time));
    setCurrentTime(clamped);
  };

  const stepFrame = (frames: number) => {
    const fps = activeProject ? activeProject.fps : 30;
    const delta = frames * (1 / fps);
    seekTo(currentTime + delta);
  };

  const selectProject = (projectId: string) => {
    setActiveProjectId(projectId);
    setCurrentTime(0);
    setIsPlaying(false);
    setSelectedClipId(null);
    setView('workspace');
    addToast('Project Loaded', 'Switched to workspace editor', 'purple');
  };

  const createProject = (title: string, aspectRatio: ProjectAspectRatio, resolution: string, template?: string): VideoProject => {
    const newProj: VideoProject = {
      id: `proj_${Date.now()}`,
      title: title.trim() || 'Untitled Collaborative Video',
      description: `Created on ${new Date().toLocaleDateString()} with ${aspectRatio} format.`,
      thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&auto=format&fit=crop&q=80',
      aspectRatio,
      fps: 30,
      resolution,
      duration: 30,
      updatedAt: 'Just now',
      createdAt: 'Just now',
      ownerId: currentUser.id,
      isShared: true,
      collaborators: MOCK_COLLABORATORS,
      tracks: [
        { id: 'track-v1', name: 'V1 · Main Video', type: 'video', isMuted: false, isLocked: false, isHidden: false, color: '#6366F1', height: 60 },
        { id: 'track-t1', name: 'T1 · Text & Captions', type: 'subtitle', isMuted: false, isLocked: false, isHidden: false, color: '#EC4899', height: 42 },
        { id: 'track-a1', name: 'A1 · Background Music', type: 'audio', isMuted: false, isLocked: false, isHidden: false, color: '#3B82F6', height: 46 },
      ],
      clips: [
        {
          id: `clip_${Date.now()}_1`,
          trackId: 'track-v1',
          title: 'Opening Shot [4K Ingest]',
          startTime: 0,
          duration: 15,
          sourceStart: 0,
          color: '#6366F1',
          type: 'video',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=300&auto=format&fit=crop&q=80',
          volume: 90,
        },
        {
          id: `clip_${Date.now()}_2`,
          trackId: 'track-t1',
          title: 'Welcome Headline',
          startTime: 1,
          duration: 5,
          sourceStart: 0,
          color: '#EC4899',
          type: 'subtitle',
          text: title || 'New Collaborative Project',
        }
      ],
      comments: [],
      tasks: [],
      versions: [
        {
          id: `v_init_${Date.now()}`,
          versionNumber: 'v1.0 - Initial Project Setup',
          title: 'Project Initialized',
          summary: 'Created new timeline project from template.',
          authorName: currentUser.name,
          authorAvatar: currentUser.avatar,
          createdAt: 'Just now',
          clipCount: 2,
          duration: 30,
          snapshotState: { clips: [], tracks: [] }
        }
      ]
    };

    setProjects(prev => [newProj, ...prev]);
    setActiveProjectId(newProj.id);
    setView('workspace');
    addToast('Project Created', `Ready for real-time collaboration: ${newProj.title}`, 'success');
    return newProj;
  };

  const updateProjectTitle = (newTitle: string) => {
    if (!activeProject || !newTitle.trim()) return;
    setProjects(prev => prev.map(p => p.id === activeProject.id ? { ...p, title: newTitle.trim(), updatedAt: 'Just now' } : p));
  };

  const duplicateProject = (projectId: string) => {
    const target = projects.find(p => p.id === projectId);
    if (!target) return;
    const duplicated: VideoProject = {
      ...target,
      id: `proj_${Date.now()}`,
      title: `${target.title} (Copy)`,
      updatedAt: 'Just now',
      createdAt: 'Just now',
    };
    setProjects(prev => [duplicated, ...prev]);
    addToast('Project Duplicated', `Created a copy of ${target.title}`, 'info');
  };

  const deleteProject = (projectId: string) => {
    if (projects.length <= 1) {
      addToast('Cannot Delete', 'You must have at least one project available.', 'warning');
      return;
    }
    const remaining = projects.filter(p => p.id !== projectId);
    setProjects(remaining);
    if (activeProjectId === projectId) {
      setActiveProjectId(remaining[0].id);
    }
    addToast('Project Removed', 'Project was deleted from your workspace.', 'info');
  };

  // Timeline Clip Manipulations
  const addClip = (clipData: Omit<TimelineClip, 'id'>) => {
    if (!activeProject) return;
    const newClip: TimelineClip = {
      ...clipData,
      id: `clip_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    };
    const updated = [...activeProject.clips, newClip];
    updateActiveProjectClips(updated);
    setSelectedClipId(newClip.id);
    addToast('Clip Added', `Added "${newClip.title}" to timeline`, 'success');
  };

  const updateClip = (clipId: string, updates: Partial<TimelineClip>) => {
    if (!activeProject) return;
    const updated = activeProject.clips.map(c => c.id === clipId ? { ...c, ...updates } : c);
    updateActiveProjectClips(updated, false);
  };

  const splitClipAtPlayhead = () => {
    if (!activeProject) return;
    // Find clip under playhead
    const clip = activeProject.clips.find(c => currentTime > c.startTime && currentTime < (c.startTime + c.duration));
    if (!clip) {
      addToast('Split Tool', 'No clip found under current playhead position', 'warning');
      return;
    }

    const firstDuration = currentTime - clip.startTime;
    const secondDuration = clip.duration - firstDuration;

    if (firstDuration < 0.5 || secondDuration < 0.5) {
      addToast('Split Tool', 'Clips cannot be split into segments under 0.5 seconds', 'warning');
      return;
    }

    const firstClip: TimelineClip = {
      ...clip,
      duration: parseFloat(firstDuration.toFixed(2)),
    };

    const secondClip: TimelineClip = {
      ...clip,
      id: `clip_split_${Date.now()}`,
      title: `${clip.title} (Part 2)`,
      startTime: parseFloat(currentTime.toFixed(2)),
      duration: parseFloat(secondDuration.toFixed(2)),
      sourceStart: clip.sourceStart + firstDuration,
    };

    const updated = activeProject.clips.map(c => c.id === clip.id ? firstClip : c).concat(secondClip);
    updateActiveProjectClips(updated);
    setSelectedClipId(secondClip.id);
    addToast('Razor Cut', `Split "${clip.title}" at ${formatSMPTETime(currentTime)}`, 'purple');
  };

  const deleteClip = (clipId: string) => {
    if (!activeProject) return;
    const target = activeProject.clips.find(c => c.id === clipId);
    const updated = activeProject.clips.filter(c => c.id !== clipId);
    updateActiveProjectClips(updated);
    if (selectedClipId === clipId) setSelectedClipId(null);
    if (target) {
      addToast('Clip Removed', `Deleted "${target.title}" from timeline`, 'info');
    }
  };

  // Follow collaborator playhead
  const followCollaborator = (collaboratorId: string) => {
    const target = collaborators.find(c => c.id === collaboratorId);
    if (!target) return;
    if (activeCollaboratorFollow === collaboratorId) {
      setActiveCollaboratorFollow(null);
      addToast('Unfollowed', `Stopped following ${target.name}`, 'info');
    } else {
      setActiveCollaboratorFollow(collaboratorId);
      if (typeof target.playheadPosition === 'number') {
        seekTo(target.playheadPosition);
      }
      addToast('Following Editor', `Now synced with ${target.name} (${target.role})`, 'purple');
    }
  };

  // Comments
  const addComment = (text: string, tag = 'General') => {
    if (!activeProject || !text.trim()) return;
    const newComment: FrameComment = {
      id: `cm_${Date.now()}`,
      timestamp: parseFloat(currentTime.toFixed(1)),
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorColor: '#8B5CF6',
      content: text.trim(),
      createdAt: 'Just now',
      isResolved: false,
      tag,
      replies: []
    };
    const updatedComments = [newComment, ...activeProject.comments];
    setProjects(prev => prev.map(p => p.id === activeProject.id ? { ...p, comments: updatedComments } : p));
    addToast('Frame Comment Added', `Left feedback at ${formatSMPTETime(currentTime)}`, 'success');
  };

  const resolveComment = (commentId: string) => {
    if (!activeProject) return;
    setProjects(prev => prev.map(p => {
      if (p.id === activeProject.id) {
        return {
          ...p,
          comments: p.comments.map(c => c.id === commentId ? { ...c, isResolved: !c.isResolved } : c)
        };
      }
      return p;
    }));
    addToast('Comment Updated', 'Marked comment status', 'info');
  };

  const deleteComment = (commentId: string) => {
    if (!activeProject) return;
    setProjects(prev => prev.map(p => {
      if (p.id === activeProject.id) {
        return {
          ...p,
          comments: p.comments.filter(c => c.id !== commentId)
        };
      }
      return p;
    }));
    addToast('Comment Deleted', 'Feedback comment removed', 'info');
  };

  const addCommentReply = (commentId: string, replyText: string) => {
    if (!activeProject || !replyText.trim()) return;
    setProjects(prev => prev.map(p => {
      if (p.id === activeProject.id) {
        return {
          ...p,
          comments: p.comments.map(c => {
            if (c.id === commentId) {
              const replies = c.replies || [];
              return {
                ...c,
                replies: [
                  ...replies,
                  {
                    id: `rep_${Date.now()}`,
                    authorName: currentUser.name,
                    authorAvatar: currentUser.avatar,
                    content: replyText.trim(),
                    createdAt: 'Just now'
                  }
                ]
              };
            }
            return c;
          })
        };
      }
      return p;
    }));
    addToast('Reply Sent', 'Added response to comment thread', 'info');
  };

  // Tasks
  const addTask = (title: string, description: string, assigneeId: string, priority: TaskPriority, timestamp?: number, dueDate = 'Tomorrow') => {
    if (!activeProject || !title.trim()) return;
    const assignee = collaborators.find(c => c.id === assigneeId) || { name: 'Unassigned', avatar: currentUser.avatar };
    const newTask: ProjectTask = {
      id: `tsk_${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      assigneeId,
      assigneeName: assignee.name,
      assigneeAvatar: assignee.avatar,
      status: 'todo',
      priority,
      timestamp: typeof timestamp === 'number' ? timestamp : currentTime,
      dueDate,
      createdAt: 'Just now'
    };

    setProjects(prev => prev.map(p => {
      if (p.id === activeProject.id) {
        return {
          ...p,
          tasks: [newTask, ...p.tasks]
        };
      }
      return p;
    }));
    addToast('Task Assigned', `Assigned "${newTask.title}" to ${newTask.assigneeName}`, 'success');
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    if (!activeProject) return;
    setProjects(prev => prev.map(p => {
      if (p.id === activeProject.id) {
        return {
          ...p,
          tasks: p.tasks.map(t => t.id === taskId ? { ...t, status } : t)
        };
      }
      return p;
    }));
    addToast('Task Status Updated', `Status changed to ${status.replace('_', ' ').toUpperCase()}`, 'info');
  };

  const deleteTask = (taskId: string) => {
    if (!activeProject) return;
    setProjects(prev => prev.map(p => {
      if (p.id === activeProject.id) {
        return {
          ...p,
          tasks: p.tasks.filter(t => t.id !== taskId)
        };
      }
      return p;
    }));
    addToast('Task Deleted', 'Task removed from workspace backlog', 'info');
  };

  // Time Machine / Versions
  const saveVersionSnapshot = (title: string, summary: string) => {
    if (!activeProject) return;
    const newVersion: ProjectVersion = {
      id: `ver_${Date.now()}`,
      versionNumber: `v1.${activeProject.versions.length + 1} - ${title.trim()}`,
      title: title.trim() || 'Milestone Snapshot',
      summary: summary.trim() || 'Saved manual state snapshot in Time Machine.',
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      createdAt: 'Just now',
      clipCount: activeProject.clips.length,
      duration: activeProject.duration,
      snapshotState: {
        clips: JSON.parse(JSON.stringify(activeProject.clips)),
        tracks: JSON.parse(JSON.stringify(activeProject.tracks)),
      }
    };

    setProjects(prev => prev.map(p => {
      if (p.id === activeProject.id) {
        return {
          ...p,
          versions: [newVersion, ...p.versions]
        };
      }
      return p;
    }));
    addToast('Time Machine Snapshot Saved', `Saved version "${newVersion.versionNumber}"`, 'purple');
  };

  const restoreVersion = (versionId: string) => {
    if (!activeProject) return;
    const targetVer = activeProject.versions.find(v => v.id === versionId);
    if (!targetVer || !targetVer.snapshotState || !targetVer.snapshotState.clips || targetVer.snapshotState.clips.length === 0) {
      // If snapshot is empty (demo mockup), generate a restored set
      const resetClips = INITIAL_PROJECTS[0].clips;
      updateActiveProjectClips(resetClips);
      addToast('Version Restored', `Restored to ${targetVer?.versionNumber || 'previous milestone'}`, 'purple');
      return;
    }
    updateActiveProjectClips(targetVer.snapshotState.clips);
    addToast('Version Restored', `Restored project state to ${targetVer.versionNumber}`, 'purple');
  };

  // AI Assistant Capabilities
  const aiDetectSilences = () => {
    if (!activeProject) return { detectedCount: 0, savedSeconds: 0 };
    // Simulate detecting pauses and trimming clips
    const detected = 3;
    const saved = 2.4;
    addToast('AI Auto-Cut Completed', `Detected & trimmed 3 awkward pauses (saved 2.4s of airtime)`, 'purple');
    return { detectedCount: detected, savedSeconds: saved };
  };

  const aiGenerateSubtitles = () => {
    if (!activeProject) return;
    const aiSubs: TimelineClip[] = [
      {
        id: `ai_sub_1_${Date.now()}`,
        trackId: 'track-t1',
        title: 'AI Subtitle: "Welcome to CollabCut"',
        startTime: 0.5,
        duration: 4.5,
        sourceStart: 0,
        color: '#EC4899',
        type: 'subtitle',
        text: '✨ Welcome to CollabCut: Video editing is better together.',
      },
      {
        id: `ai_sub_2_${Date.now()}`,
        trackId: 'track-t1',
        title: 'AI Subtitle: "Real-time multiplayer"',
        startTime: 5.5,
        duration: 5.0,
        sourceStart: 0,
        color: '#F472B6',
        type: 'subtitle',
        text: '⚡ Instant multiplayer timeline synchronization with 60 FPS feedback.',
      },
      {
        id: `ai_sub_3_${Date.now()}`,
        trackId: 'track-t1',
        title: 'AI Subtitle: "Publish faster"',
        startTime: 11.0,
        duration: 4.0,
        sourceStart: 0,
        color: '#EC4899',
        type: 'subtitle',
        text: '🚀 Export in 4K Ultra HD and share directly with your audience.',
      }
    ];

    const updatedClips = [...activeProject.clips.filter(c => c.trackId !== 'track-t1'), ...aiSubs];
    updateActiveProjectClips(updatedClips);
    addToast('AI Subtitles Generated', 'Generated 3 synchronized caption cards with 99.4% accuracy', 'purple');
  };

  const aiSuggestTransitions = () => {
    addToast('AI Scene Transitions Applied', 'Added dynamic dip-to-black and cross-dissolve transitions at scene markers', 'purple');
  };

  const aiEnhanceAudio = () => {
    addToast('AI Voice Enhancer', 'Voice isolation filter applied: normalized dialogue to -14 LUFS', 'purple');
  };

  // Custom User File Upload
  const handleUserFileUpload = (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    const isVid = file.type.startsWith('video');
    const isAud = file.type.startsWith('audio');
    const isImg = file.type.startsWith('image');

    const newClip: TimelineClip = {
      id: `user_upload_${Date.now()}`,
      trackId: isAud ? 'track-a1' : 'track-v1',
      title: file.name.substring(0, 24),
      startTime: currentTime,
      duration: 10,
      sourceStart: 0,
      color: isAud ? '#10B981' : '#8B5CF6',
      type: isAud ? 'audio' : (isImg ? 'overlay' : 'video'),
      videoUrl: isVid ? objectUrl : undefined,
      audioUrl: isAud ? objectUrl : undefined,
      imageUrl: isImg ? objectUrl : undefined,
      thumbnailUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=300&auto=format&fit=crop&q=80',
    };

    addClip(newClip);
    addToast('Media Uploaded', `Loaded "${file.name}" into workspace timeline`, 'success');
  };

  const loginUser = (email: string, name?: string) => {
    const updated: UserProfile = {
      ...currentUser,
      email,
      name: name || email.split('@')[0],
    };
    setCurrentUser(updated);
    setIsAuthenticated(true);
    setView('dashboard');
    addToast('Welcome Back', `Logged in as ${updated.name}`, 'purple');
  };

  const logoutUser = () => {
    setIsAuthenticated(false);
    setView('landing');
    addToast('Signed Out', 'You have been logged out of CollabCut.', 'info');
  };

  return (
    <ProjectContext.Provider value={{
      view,
      setView,
      currentUser,
      setCurrentUser,
      isAuthenticated,
      setIsAuthenticated,
      loginUser,
      logoutUser,

      projects,
      activeProject,
      selectProject,
      createProject,
      updateProjectTitle,
      duplicateProject,
      deleteProject,

      isPlaying,
      setIsPlaying,
      togglePlayPause,
      currentTime,
      setCurrentTime,
      seekTo,
      stepFrame,
      duration: activeProject ? activeProject.duration : 60,
      volume,
      setVolume,
      isMuted,
      setIsMuted,
      playbackSpeed,
      setPlaybackSpeed,
      zoomLevel,
      setZoomLevel,
      activeTool,
      setActiveTool,
      isSnapping,
      setIsSnapping,
      selectedClipId,
      setSelectedClipId,

      addClip,
      updateClip,
      splitClipAtPlayhead,
      deleteClip,

      collaborators,
      showMultiplayerCursors,
      setShowMultiplayerCursors,
      followCollaborator,
      activeCollaboratorFollow,

      addComment,
      resolveComment,
      deleteComment,
      addCommentReply,

      addTask,
      updateTaskStatus,
      deleteTask,

      saveVersionSnapshot,
      restoreVersion,
      undo,
      redo,
      canUndo,
      canRedo,

      aiDetectSilences,
      aiGenerateSubtitles,
      aiSuggestTransitions,
      aiEnhanceAudio,

      toasts,
      addToast,
      removeToast,

      isExportModalOpen,
      setIsExportModalOpen,
      isShareModalOpen,
      setIsShareModalOpen,
      activeRightTab,
      setActiveRightTab,
      isMediaDrawerOpen,
      setIsMediaDrawerOpen,

      handleUserFileUpload,
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProject must be used within ProjectProvider');
  return context;
};

// SMPTE Timecode formatting utility: 00:01:23:14 (Hours:Minutes:Seconds:Frames)
export const formatSMPTETime = (secondsTotal: number, fps = 30): string => {
  if (isNaN(secondsTotal) || secondsTotal < 0) secondsTotal = 0;
  const hours = Math.floor(secondsTotal / 3600);
  const minutes = Math.floor((secondsTotal % 3600) / 60);
  const seconds = Math.floor(secondsTotal % 60);
  const frames = Math.floor((secondsTotal % 1) * fps);

  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`;
};
