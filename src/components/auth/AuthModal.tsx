import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { 
  X, 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Check, 
  ShieldCheck,
  Zap
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const { loginUser, addToast } = useProject();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  
  // Form State
  const [fullName, setFullName] = useState('Marcus Vance');
  const [email, setEmail] = useState('marcus@collabcut.io');
  const [password, setPassword] = useState('••••••••••••');
  const [confirmPassword, setConfirmPassword] = useState('••••••••••••');
  const [forgotSent, setForgotSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'forgot') {
      setForgotSent(true);
      addToast('Reset Email Dispatched', `Password instructions sent to ${email}`, 'purple');
      setTimeout(() => {
        setForgotSent(false);
        setMode('login');
      }, 2500);
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      addToast('Password Mismatch', 'Passwords do not match. Please verify.', 'warning');
      return;
    }

    loginUser(email, mode === 'signup' ? fullName : undefined);
    onClose();
  };

  const handleInstantDemo = () => {
    loginUser('marcus@collabcut.io', 'Marcus Vance');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-gray-900 border border-purple-500/25 rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 bg-purple-600/30 blur-3xl pointer-events-none rounded-full" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 mb-3 shadow-inner">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white">
            {mode === 'login' && 'Welcome Back to CollabCut'}
            {mode === 'signup' && 'Create Your Creator Account'}
            {mode === 'forgot' && 'Reset Your Password'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login' && 'Log in to continue your collaborative video projects'}
            {mode === 'signup' && 'Start editing with teammates in real-time within seconds'}
            {mode === 'forgot' && 'Enter your email to receive recovery instructions'}
          </p>
        </div>

        {/* Instant Demo Pill */}
        <div className="mb-5 p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-400 fill-purple-400/20" />
            <span className="text-xs text-purple-200 font-medium">Design Project Demo</span>
          </div>
          <button
            type="button"
            onClick={handleInstantDemo}
            className="px-2.5 py-1 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-lg shadow-sm transition-all"
          >
            1-Click Demo Login →
          </button>
        </div>

        {/* Google OAuth Simulation */}
        {mode !== 'forgot' && (
          <div className="mb-5">
            <button
              type="button"
              onClick={handleInstantDemo}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-gray-700 bg-gray-800/80 hover:bg-gray-800 text-xs font-medium text-slate-200 hover:text-white transition-all shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Continue with Google
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider text-slate-500">
                <span className="bg-gray-900 px-3">or continue with email</span>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full pl-9 pr-3 py-2 bg-gray-800/80 border border-gray-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-9 pr-3 py-2 bg-gray-800/80 border border-gray-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-300">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-purple-400 hover:text-purple-300"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-gray-800/80 border border-gray-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-gray-800/80 border border-gray-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>
          )}

          {forgotSent && (
            <div className="p-3 rounded-xl bg-purple-900/30 border border-purple-500/40 text-xs text-purple-200 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              Reset link sent! Returning to login...
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-2 py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
          >
            {mode === 'login' && 'Sign In to Workspace'}
            {mode === 'signup' && 'Create Free Account'}
            {mode === 'forgot' && 'Send Recovery Email'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer switch */}
        <div className="mt-5 text-center text-xs text-slate-400">
          {mode === 'login' && (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => setMode('signup')}
                className="text-purple-400 hover:text-purple-300 font-medium"
              >
                Sign up free
              </button>
            </p>
          )}
          {mode === 'signup' && (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-purple-400 hover:text-purple-300 font-medium"
              >
                Sign in
              </button>
            </p>
          )}
          {mode === 'forgot' && (
            <p>
              Remember your password?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-purple-400 hover:text-purple-300 font-medium"
              >
                Back to Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
