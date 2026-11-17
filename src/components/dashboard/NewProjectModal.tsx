import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { ProjectAspectRatio } from '../../types';
import { 
  X, 
  Film, 
  Sparkles, 
  Smartphone, 
  Tv, 
  Square, 
  Video, 
  Check, 
  Layers 
} from 'lucide-react';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({ isOpen, onClose }) => {
  const { createProject, addToast } = useProject();
  const [title, setTitle] = useState('');
  const [aspectRatio, setAspectRatio] = useState<ProjectAspectRatio>('16:9');
  const [resolution, setResolution] = useState('4K (3840x2160)');
  const [template, setTemplate] = useState('cinematic');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      addToast('Project Name Required', 'Please provide a title for your project.', 'warning');
      return;
    }

    createProject(title, aspectRatio, resolution, template);
    onClose();
  };

  const aspectOptions: { ratio: ProjectAspectRatio; label: string; sub: string; icon: any }[] = [
    { ratio: '16:9', label: '16:9 Widescreen', sub: 'YouTube, Web, TV', icon: Tv },
    { ratio: '9:16', label: '9:16 Vertical', sub: 'TikTok, Reels, Shorts', icon: Smartphone },
    { ratio: '1:1', label: '1:1 Square', sub: 'Instagram, Feeds', icon: Square },
    { ratio: '4:5', label: '4:5 Portrait', sub: 'Social Media Posts', icon: Video },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-gray-900 border border-purple-500/30 rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-100"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shadow-inner">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Create New Video Project</h3>
            <p className="text-xs text-slate-400">Initialize a collaborative multi-track timeline</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Project Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Project Title</label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Brand Anthem 2026 - Director Cut"
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Aspect Ratio Options */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Aspect Ratio & Format</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {aspectOptions.map(opt => {
                const Icon = opt.icon;
                const isSelected = aspectRatio === opt.ratio;
                return (
                  <button
                    key={opt.ratio}
                    type="button"
                    onClick={() => setAspectRatio(opt.ratio)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-purple-500 bg-purple-950/40 text-white shadow-md shadow-purple-600/20'
                        : 'border-gray-800 bg-gray-850 hover:bg-gray-800 text-slate-300'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-purple-400' : 'text-slate-400'}`} />
                    <div>
                      <p className="text-xs font-bold leading-tight">{opt.label}</p>
                      <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{opt.sub}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Resolution & FPS */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Resolution</label>
              <select
                value={resolution}
                onChange={e => setResolution(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="4K (3840x2160)">4K Ultra HD (3840x2160)</option>
                <option value="1080p (1920x1080)">1080p Full HD (1920x1080)</option>
                <option value="720p Proxy (1280x720)">720p Fast Proxy (1280x720)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Starter Template</label>
              <select
                value={template}
                onChange={e => setTemplate(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="cinematic">Cinematic B-Roll & Titles</option>
                <option value="podcast">Podcast & Talking Head</option>
                <option value="reels">High Retention TikTok Hook</option>
                <option value="blank">Blank Timeline Rushes</option>
              </select>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Create & Launch Workspace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
