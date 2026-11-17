import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Shield, 
  Mail, 
  UserPlus, 
  Globe, 
  Lock, 
  Eye, 
  Edit3, 
  MessageSquare 
} from 'lucide-react';

interface ShareProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareProjectModal: React.FC<ShareProjectModalProps> = ({ isOpen, onClose }) => {
  const { activeProject, addToast, collaborators } = useProject();
  const [role, setRole] = useState<'editor' | 'commenter' | 'viewer'>('editor');
  const [inviteEmail, setInviteEmail] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [requirePassword, setRequirePassword] = useState(false);

  if (!isOpen || !activeProject) return null;

  const shareUrl = `https://collabcut.io/project/${activeProject.id}?invite=tok_${activeProject.id.slice(5, 12)}&role=${role}`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(shareUrl);
    setIsCopied(true);
    addToast('Link Copied', `Collaboration link copied with ${role.toUpperCase()} access`, 'purple');
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleInviteEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    addToast('Invitation Sent', `Sent ${role.toUpperCase()} invite to ${inviteEmail}`, 'success');
    setInviteEmail('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-gray-900 border border-purple-500/30 rounded-2xl shadow-2xl p-6 sm:p-7 text-slate-100"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Share Project & Invite Team</h3>
            <p className="text-xs text-slate-400 truncate max-w-sm">{activeProject.title}</p>
          </div>
        </div>

        {/* Share Link Generation */}
        <div className="p-4 rounded-xl bg-gray-850 border border-gray-800 mb-5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-purple-400" />
              General Share Link
            </span>
            <div className="flex items-center gap-1 bg-gray-900 px-2 py-1 rounded-lg border border-gray-750">
              <span className="text-slate-400 text-[11px]">Permission:</span>
              <select
                value={role}
                onChange={e => setRole(e.target.value as any)}
                className="bg-transparent text-purple-300 font-semibold text-xs focus:outline-none cursor-pointer"
              >
                <option value="editor">Can Edit Timeline</option>
                <option value="commenter">Can Leave Comments</option>
                <option value="viewer">Can Only View</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700/80 rounded-xl text-xs text-slate-300 font-mono focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                isCopied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/20'
              }`}
            >
              {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {isCopied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>

        {/* Invite by Email */}
        <form onSubmit={handleInviteEmail} className="mb-5">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Invite by Email</label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                placeholder="colleague@agency.com"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-800 hover:bg-gray-750 text-white text-xs font-semibold rounded-xl border border-gray-700 flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5 text-purple-400" />
              Send Invite
            </button>
          </div>
        </form>

        {/* Current Collaborators List */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
            Current Collaborators ({collaborators.length})
          </h4>
          <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
            {collaborators.map(c => (
              <div key={c.id} className="flex items-center justify-between p-2 rounded-xl bg-gray-850/60 border border-gray-800/80 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <img src={c.avatar} alt={c.name} className="w-7 h-7 rounded-full object-cover" />
                    <span 
                      className="absolute bottom-0 right-0 w-2 h-2 rounded-full ring-1 ring-gray-900"
                      style={{ backgroundColor: c.isOnline ? '#10B981' : '#6B7280' }}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{c.name}</p>
                    <p className="text-[10px] text-slate-400">{c.role}</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-medium border"
                  style={{ color: c.color, borderColor: `${c.color}40`, backgroundColor: `${c.color}15` }}>
                  {c.isOnline ? 'Active on Timeline' : 'Offline'}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
