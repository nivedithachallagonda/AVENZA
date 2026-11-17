import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { 
  Play, 
  Sparkles, 
  Users, 
  LayoutDashboard, 
  Film, 
  LogOut, 
  ChevronDown, 
  Menu, 
  X,
  Share2
} from 'lucide-react';

interface NavbarProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const { view, setView, currentUser, isAuthenticated, logoutUser, activeProject } = useProject();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    if (view !== 'landing') {
      setView('landing');
      setTimeout(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-800/80 bg-[#111827]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('landing')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-600/30 ring-1 ring-purple-400/30">
            <div className="flex items-center -space-x-1">
              <Play className="w-4 h-4 fill-white text-white translate-x-0.5" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-200 bg-clip-text text-transparent">
                Collab<span className="text-purple-400">Cut</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block tracking-wide">
              Create Together · Edit Together
            </p>
          </div>
        </div>

        {/* Center Navigation Links (Landing Page) */}
        {view === 'landing' && (
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => scrollToSection('features')}
              className="px-3.5 py-2 text-sm text-slate-300 hover:text-white rounded-lg hover:bg-gray-800/60 transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="px-3.5 py-2 text-sm text-slate-300 hover:text-white rounded-lg hover:bg-gray-800/60 transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="px-3.5 py-2 text-sm text-slate-300 hover:text-white rounded-lg hover:bg-gray-800/60 transition-colors"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className="px-3.5 py-2 text-sm text-slate-300 hover:text-white rounded-lg hover:bg-gray-800/60 transition-colors"
            >
              Creators
            </button>
          </nav>
        )}

        {/* Active View Quick Switcher if authenticated */}
        {view !== 'landing' && (
          <div className="hidden md:flex items-center gap-1.5 bg-gray-900/90 p-1 rounded-xl border border-gray-800">
            <button
              onClick={() => setView('dashboard')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                view === 'dashboard'
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-gray-800/50'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </button>
            <button
              onClick={() => setView('workspace')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                view === 'workspace'
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-gray-800/50'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              Editor Workspace
              {activeProject && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
              )}
            </button>
            <button
              onClick={() => setView('collaboration_hub')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                view === 'collaboration_hub'
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-gray-800/50'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Team Hub
            </button>
          </div>
        )}

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {view === 'landing' && (
                <button
                  onClick={() => setView('dashboard')}
                  className="hidden sm:flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/25 transition-all"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Go to Dashboard
                </button>
              )}

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-gray-800/60 border border-transparent hover:border-gray-700 transition-all text-left"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-500/40"
                  />
                  <div className="hidden lg:block">
                    <p className="text-xs font-semibold text-slate-200 leading-tight">{currentUser.name}</p>
                    <p className="text-[10px] text-purple-400 leading-tight">{currentUser.plan}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-64 rounded-2xl bg-gray-900 border border-purple-500/20 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <div className="px-3 py-2.5 border-b border-gray-800">
                      <p className="text-xs font-semibold text-white">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                      <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
                        <span>Cloud Storage</span>
                        <span className="text-purple-300 font-mono">{currentUser.storageUsedGb} / {currentUser.storageMaxGb} GB</span>
                      </div>
                      <div className="w-full bg-gray-800 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div
                          className="bg-purple-500 h-full rounded-full"
                          style={{ width: `${(currentUser.storageUsedGb / currentUser.storageMaxGb) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => setView('dashboard')}
                        className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-gray-800/60 rounded-lg flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-4 h-4 text-purple-400" />
                        My Projects
                      </button>
                      <button
                        onClick={() => setView('workspace')}
                        className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-gray-800/60 rounded-lg flex items-center gap-2"
                      >
                        <Film className="w-4 h-4 text-purple-400" />
                        Open Editor
                      </button>
                      <button
                        onClick={() => setView('collaboration_hub')}
                        className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-gray-800/60 rounded-lg flex items-center gap-2"
                      >
                        <Users className="w-4 h-4 text-purple-400" />
                        Team & Permissions
                      </button>
                    </div>

                    <div className="pt-1 border-t border-gray-800">
                      <button
                        onClick={() => logoutUser()}
                        className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/30 rounded-lg flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onOpenAuth('login')}
                className="text-xs font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="text-xs font-semibold px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Start Creating Free
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-gray-800/60"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-gray-800 bg-[#111827] px-4 pt-2 pb-4 space-y-2">
          <button
            onClick={() => scrollToSection('features')}
            className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-gray-800/50 rounded-lg"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-gray-800/50 rounded-lg"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('pricing')}
            className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-gray-800/50 rounded-lg"
          >
            Pricing
          </button>
          <div className="pt-2 border-t border-gray-800 flex flex-col gap-2">
            <button
              onClick={() => { setView('dashboard'); setIsMobileMenuOpen(false); }}
              className="w-full text-center px-4 py-2 text-sm bg-purple-600 text-white rounded-xl font-medium"
            >
              Open Dashboard
            </button>
            <button
              onClick={() => { setView('workspace'); setIsMobileMenuOpen(false); }}
              className="w-full text-center px-4 py-2 text-sm bg-gray-800 text-slate-200 rounded-xl font-medium"
            >
              Launch Editor Workspace
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
