import React, { useState, useEffect } from 'react';
import { useProject } from '../../context/ProjectContext';
import confetti from 'canvas-confetti';
import { 
  X, 
  Download, 
  Film, 
  Sparkles, 
  CheckCircle2, 
  Cpu, 
  Layers, 
  HardDrive, 
  ArrowRight,
  Loader2
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { activeProject, addToast } = useProject();
  const [resolution, setResolution] = useState('1080p');
  const [format, setFormat] = useState('mp4');
  const [quality, setQuality] = useState('high');
  const [fps, setFps] = useState('30');
  
  // Rendering simulation state
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusLog, setStatusLog] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsExporting(false);
      setProgress(0);
      setIsCompleted(false);
      setStatusLog('');
    }
  }, [isOpen]);

  if (!isOpen || !activeProject) return null;

  const startExport = () => {
    setIsExporting(true);
    setProgress(0);
    setIsCompleted(false);

    const steps = [
      { pct: 15, msg: 'Initializing cloud render worker node...' },
      { pct: 35, msg: 'Rendering Track V1 & V2 60FPS video layers...' },
      { pct: 55, msg: 'Normalizing & mixing 3 audio stems (-14 LUFS)...' },
      { pct: 75, msg: 'Baking synchronized captions & subtitles...' },
      { pct: 90, msg: `Multiplexing final ${format.toUpperCase()} container at ${resolution}...` },
      { pct: 100, msg: 'Render complete! Ready for download.' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep].pct);
        setStatusLog(steps[currentStep].msg);
        currentStep++;
      } else {
        clearInterval(interval);
        setIsExporting(false);
        setIsCompleted(true);
        addToast('Export Successful', `Exported "${activeProject.title}" in ${resolution}`, 'success');
        
        // Confetti celebration!
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8B5CF6', '#EC4899', '#10B981', '#3B82F6']
        });
      }
    }, 700);
  };

  const handleDownloadFile = () => {
    // Trigger simulated download of project metadata / dummy file
    const content = `CollabCut Project Export\nTitle: ${activeProject.title}\nResolution: ${resolution}\nFormat: ${format}\nDuration: ${activeProject.duration}s\nExported: ${new Date().toISOString()}\nCollaborators: ${activeProject.collaborators.map(c => c.name).join(', ')}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeProject.title.toLowerCase().replace(/\s+/g, '_')}_${resolution}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast('Download Started', 'Saved exported video package to your device', 'purple');
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

        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shadow-inner">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Export Video Project</h3>
            <p className="text-xs text-slate-400">Render your multi-track timeline into a publishable file</p>
          </div>
        </div>

        {!isExporting && !isCompleted ? (
          <div className="space-y-4">
            {/* Resolution */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Resolution</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: '4k', label: '4K Ultra HD', desc: '3840 x 2160' },
                  { id: '1080p', label: '1080p Full HD', desc: '1920 x 1080' },
                  { id: '720p', label: '720p Proxy', desc: '1280 x 720' },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setResolution(item.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      resolution === item.id
                        ? 'border-purple-500 bg-purple-950/40 text-white shadow-sm shadow-purple-600/20'
                        : 'border-gray-800 bg-gray-850 hover:bg-gray-800 text-slate-300'
                    }`}
                  >
                    <p className="text-xs font-bold">{item.label}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Format & Framerate */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Format</label>
                <select
                  value={format}
                  onChange={e => setFormat(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="mp4">MP4 (H.264 / AAC) — Best for Web</option>
                  <option value="prores">Apple ProRes 422 — Broadcast</option>
                  <option value="webm">WebM VP9 — Modern Browsers</option>
                  <option value="gif">Animated GIF — Social Looping</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Framerate</label>
                <select
                  value={fps}
                  onChange={e => setFps(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="60">60 FPS (Ultra Smooth Motion)</option>
                  <option value="30">30 FPS (Standard Digital)</option>
                  <option value="24">24 FPS (Cinematic Look)</option>
                </select>
              </div>
            </div>

            {/* Estimated File Size */}
            <div className="p-3 rounded-xl bg-gray-850 border border-gray-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-purple-400" />
                Estimated file size:
              </span>
              <span className="font-mono text-purple-300 font-semibold">
                {resolution === '4k' ? '~148 MB' : resolution === '1080p' ? '~42 MB' : '~18 MB'}
              </span>
            </div>

            {/* Render Button */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={startExport}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Start Cloud Render
              </button>
            </div>
          </div>
        ) : isExporting ? (
          /* Rendering In-Progress View */
          <div className="py-8 text-center space-y-5">
            <div className="relative inline-flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-gray-800 border-t-purple-500 animate-spin" />
              <span className="absolute font-mono font-bold text-sm text-purple-300">{progress}%</span>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white flex items-center justify-center gap-2">
                <Cpu className="w-4 h-4 text-purple-400 animate-pulse" />
                Rendering Timeline In Cloud
              </h4>
              <p className="text-xs text-slate-400 font-mono mt-1.5 h-4 transition-all">
                {statusLog}
              </p>
            </div>

            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden max-w-sm mx-auto">
              <div
                className="bg-gradient-to-r from-purple-600 to-indigo-400 h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          /* Export Completed View */
          <div className="py-6 text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-white">Your Video is Ready!</h4>
              <p className="text-xs text-slate-300 mt-1">
                Successfully encoded in {resolution.toUpperCase()} ({format.toUpperCase()})
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-850 border border-gray-800 text-left text-xs space-y-1 font-mono">
              <div className="flex justify-between text-slate-400">
                <span>File:</span>
                <span className="text-slate-200">{activeProject.title}.{format}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Duration:</span>
                <span className="text-slate-200">{activeProject.duration} seconds</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Cloud Status:</span>
                <span className="text-emerald-400 font-semibold">Ready for Distribution</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleDownloadFile}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Export File
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2.5 bg-gray-800 hover:bg-gray-750 text-slate-300 text-xs font-semibold rounded-xl border border-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
