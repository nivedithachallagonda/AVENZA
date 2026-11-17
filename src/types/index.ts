export type ProjectAspectRatio = '16:9' | '9:16' | '1:1' | '4:5';

export type CollaboratorRole = 'Owner' | 'Director' | 'Lead Editor' | 'Sound Engineer' | 'Motion Designer' | 'Reviewer';

export interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  color: string;
  role: CollaboratorRole;
  isOnline: boolean;
  currentTrack?: string;
  playheadPosition?: number; // timestamp in seconds
  activeAction?: string;
  cursorX?: number; // percentage
  cursorY?: number;
}

export type TrackType = 'video' | 'overlay' | 'audio' | 'subtitle' | 'effect';

export interface TimelineClip {
  id: string;
  trackId: string;
  title: string;
  startTime: number; // in seconds on timeline
  duration: number; // in seconds
  sourceStart: number; // offset in source media
  color: string;
  type: TrackType;
  videoUrl?: string;
  audioUrl?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  text?: string;
  volume?: number;
  opacity?: number;
  speed?: number;
  waveform?: number[];
  assignedTo?: string; // Collaborator id
  isLocked?: boolean;
}

export interface TimelineTrack {
  id: string;
  name: string;
  type: TrackType;
  isMuted: boolean;
  isLocked: boolean;
  isHidden: boolean;
  color: string;
  height: number;
}

export interface FrameComment {
  id: string;
  timestamp: number; // in seconds
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorColor: string;
  content: string;
  createdAt: string;
  isResolved: boolean;
  replies?: {
    id: string;
    authorName: string;
    authorAvatar: string;
    content: string;
    createdAt: string;
  }[];
  tag?: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  assigneeId: string;
  assigneeName: string;
  assigneeAvatar: string;
  status: TaskStatus;
  priority: TaskPriority;
  timestamp?: number; // linked video frame
  dueDate: string;
  createdAt: string;
}

export interface ProjectVersion {
  id: string;
  versionNumber: string;
  title: string;
  summary: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
  clipCount: number;
  duration: number;
  snapshotState: {
    clips: TimelineClip[];
    tracks: TimelineTrack[];
  };
}

export interface MediaAsset {
  id: string;
  title: string;
  type: 'video' | 'audio' | 'image';
  duration?: number;
  url: string;
  thumbnailUrl: string;
  aspectRatio?: string;
  resolution?: string;
  category: string;
  fileSize?: string;
}

export interface VideoProject {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  aspectRatio: ProjectAspectRatio;
  fps: number;
  resolution: string;
  duration: number; // in seconds
  updatedAt: string;
  createdAt: string;
  ownerId: string;
  isShared: boolean;
  collaborators: Collaborator[];
  tracks: TimelineTrack[];
  clips: TimelineClip[];
  comments: FrameComment[];
  tasks: ProjectTask[];
  versions: ProjectVersion[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  plan: 'Free Starter' | 'Creator Team' | 'Studio Pro';
  storageUsedGb: number;
  storageMaxGb: number;
}
