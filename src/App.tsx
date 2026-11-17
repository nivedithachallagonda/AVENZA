import React, { useState } from 'react';
import { useProject } from './context/ProjectContext';
import { Navbar } from './components/common/Navbar';
import { ToastContainer } from './components/common/ToastContainer';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardView } from './components/dashboard/DashboardView';
import { WorkspaceLayout } from './components/workspace/WorkspaceLayout';
import { CollaborationHubView } from './components/collaboration/CollaborationHubView';
import { AuthModal } from './components/auth/AuthModal';

export const App: React.FC = () => {
  const { view, setView } = useProject();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#111827] text-slate-100 font-sans selection:bg-purple-600 selection:text-white flex flex-col">
      {/* Global Navigation Bar */}
      <Navbar onOpenAuth={handleOpenAuth} />

      {/* Main Dynamic View */}
      <main className="flex-1 flex flex-col">
        {view === 'landing' && <LandingPage onOpenAuth={handleOpenAuth} />}
        {view === 'dashboard' && <DashboardView />}
        {view === 'workspace' && <WorkspaceLayout />}
        {view === 'collaboration_hub' && <CollaborationHubView />}
      </main>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
      />

      {/* Global Toast Stack */}
      <ToastContainer />
    </div>
  );
};

export default App;
