import React from 'react';
import { useProject } from '../../context/ProjectContext';
import { WorkspaceHeader } from './WorkspaceHeader';
import { MediaLibraryPanel } from './MediaLibraryPanel';
import { VideoPlayerView } from './VideoPlayerView';
import { TimelineView } from './TimelineView';
import { CollaborationDrawer } from './CollaborationDrawer';
import { ExportModal } from './ExportModal';
import { ShareProjectModal } from './ShareProjectModal';

export const WorkspaceLayout: React.FC = () => {
  const { 
    isExportModalOpen, 
    setIsExportModalOpen, 
    isShareModalOpen, 
    setIsShareModalOpen 
  } = useProject();

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full bg-[#0E121C] text-slate-100 overflow-hidden">
      
      {/* Workspace Header */}
      <WorkspaceHeader />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left: Media & Tools Library */}
        <MediaLibraryPanel />

        {/* Center: Video Preview + Timeline */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0F131D] overflow-hidden">
          {/* Top Half: Video Player */}
          <VideoPlayerView />

          {/* Bottom Half: Multi-Track Timeline */}
          <TimelineView />
        </div>

        {/* Right: Collaboration & Inspector Drawer */}
        <CollaborationDrawer />

      </div>

      {/* Modals */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      <ShareProjectModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

    </div>
  );
};
