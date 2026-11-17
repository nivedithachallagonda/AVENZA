import React from 'react';
import { useProject } from '../../context/ProjectContext';
import { CheckCircle2, AlertCircle, Info, Sparkles, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useProject();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      {toasts.map(toast => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
            case 'warning':
              return <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />;
            case 'purple':
              return <Sparkles className="w-5 h-5 text-purple-400 shrink-0" />;
            default:
              return <Info className="w-5 h-5 text-blue-400 shrink-0" />;
          }
        };

        const getBorderColor = () => {
          switch (toast.type) {
            case 'purple':
              return 'border-purple-500/40 bg-purple-950/80 shadow-[0_4px_25px_rgba(139,92,246,0.25)]';
            case 'success':
              return 'border-emerald-500/40 bg-gray-900/90 shadow-[0_4px_25px_rgba(16,185,129,0.2)]';
            case 'warning':
              return 'border-amber-500/40 bg-gray-900/90 shadow-[0_4px_25px_rgba(245,158,11,0.2)]';
            default:
              return 'border-blue-500/30 bg-gray-900/90 shadow-lg';
          }
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border backdrop-blur-xl text-slate-100 transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-bottom-2 ${getBorderColor()}`}
          >
            <div className="pt-0.5">{getIcon()}</div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold tracking-wide text-white flex items-center justify-between">
                <span>{toast.title}</span>
                <span className="text-[10px] font-normal text-slate-400 ml-2">{toast.timestamp}</span>
              </h4>
              <p className="text-xs text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
