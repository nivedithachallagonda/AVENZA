import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { WorkspaceMockup } from './WorkspaceMockup';
import { 
  Users, 
  MessageSquare, 
  Clock, 
  Sparkles, 
  Share2, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  Sliders, 
  Film, 
  Zap, 
  ShieldCheck, 
  Download, 
  Check, 
  Star,
  Globe,
  Share2 as ShareIcon,
  MessageCircle,
  Video as VideoIcon,
  Layers,
  Award,
  Video
} from 'lucide-react';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth }) => {
  const { setView, selectProject } = useProject();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const handleLaunchEditor = () => {
    selectProject('proj_hero_launch');
  };

  return (
    <div className="relative min-h-screen bg-[#111827] text-slate-100 overflow-x-hidden">
      
      {/* Background Glows & Subtle Grids */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-purple-600/20 via-purple-900/10 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[800px] left-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute top-[1800px] right-0 w-[600px] h-[600px] bg-purple-600/10 blur-[140px] pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6 lg:px-8 text-center max-w-7xl mx-auto">
        
        {/* Release Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-900/40 border border-purple-500/30 text-purple-300 text-xs font-medium mb-6 shadow-sm hover:border-purple-400/50 transition-colors">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
          <span className="font-semibold text-white">CollabCut 2.0</span>
          <span className="text-purple-400/80">· Real-Time Multi-User Video Editing</span>
          <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
          Video Editing Is <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
            Better Together.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          The first browser-native collaborative video editor. Edit different parts of the same timeline concurrently, pin frame-specific comments, track version history, and publish together with your entire creative team.
        </p>

        {/* CTA Buttons */}
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onOpenAuth('signup')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-[1.02] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-purple-200" />
            Start Creating for Free
          </button>
          <button
            onClick={handleLaunchEditor}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gray-900/80 hover:bg-gray-800 text-slate-200 hover:text-white border border-gray-700/80 font-semibold text-sm transition-all flex items-center justify-center gap-2 group"
          >
            <Play className="w-4 h-4 text-purple-400 fill-purple-400 group-hover:scale-110 transition-transform" />
            Launch Interactive Editor Demo
          </button>
        </div>

        {/* Active Collaborators Social Proof Avatars */}
        <div className="mt-8 flex items-center justify-center gap-3 text-xs text-slate-400">
          <div className="flex items-center -space-x-2">
            <img className="w-7 h-7 rounded-full ring-2 ring-purple-600 object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Sarah" />
            <img className="w-7 h-7 rounded-full ring-2 ring-blue-600 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Alex" />
            <img className="w-7 h-7 rounded-full ring-2 ring-emerald-600 object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80" alt="Elena" />
            <img className="w-7 h-7 rounded-full ring-2 ring-amber-600 object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="Jordan" />
          </div>
          <span>Trusted by <strong>14,000+</strong> video teams & digital studios</span>
        </div>

        {/* Interactive Workspace Mockup Preview */}
        <div className="mt-14">
          <WorkspaceMockup />
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-gray-800/80">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-950/60 border border-purple-500/30 px-3 py-1 rounded-full">
            Engineered For High-Velocity Teams
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-4 tracking-tight">
            Everything You Need To Cut Videos Like Google Docs
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-4">
            No more rendering huge preview files, exporting endless revisions, or losing edits in messy cloud storage folders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl bg-gray-900/70 border border-gray-800 hover:border-purple-500/40 transition-all hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Live Multi-User Editing</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Work on the same timeline with multiple teammates at the same time. Colored cursors and activity indicators show who is trimming video, adjusting audio, or adding titles.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-2xl bg-gray-900/70 border border-gray-800 hover:border-purple-500/40 transition-all hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-xl bg-pink-600/20 text-pink-400 border border-pink-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Frame-Specific Comments</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Leave feedback right on exact timestamps. Click a comment marker to jump the playhead directly to that frame, reply in threads, and resolve feedback when completed.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl bg-gray-900/70 border border-gray-800 hover:border-purple-500/40 transition-all hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Time Machine Versioning</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Every milestone is safely snapshotted. Compare historical cuts side-by-side, view author summaries, and restore any previous version with a single click.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-2xl bg-gray-900/70 border border-gray-800 hover:border-purple-500/40 transition-all hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Smart Task Assignment</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Assign subtitles, color grading, audio normalization, and cut revisions directly to specific team members with due dates and linked frame timestamps.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-6 rounded-2xl bg-gray-900/70 border border-gray-800 hover:border-purple-500/40 transition-all hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">AI Editing Copilot</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Automatically detect awkward pauses, silence, and filler words. Generate synchronized multilingual subtitles and get smart scene transition recommendations.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-6 rounded-2xl bg-gray-900/70 border border-gray-800 hover:border-purple-500/40 transition-all hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Share2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Shareable Collaboration Links</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Generate invite links instantly. Granular permissions allow you to specify Viewer, Commenter, or Co-Editor access for clients and external partners.
            </p>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-gray-800/80 bg-gray-950/40">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-950/60 border border-purple-500/30 px-3 py-1 rounded-full">
            Simple 4-Step Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
            How Teams Ship 5x Faster With CollabCut
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Create Project & Ingest',
              desc: 'Select your aspect ratio (16:9, 9:16 Reels, 1:1) and upload 4K video footage or pick from stock media.',
              icon: Film,
            },
            {
              step: '02',
              title: 'Invite Teammates',
              desc: 'Share a collaboration link. Set permissions as Editors, Sound Mixers, or Reviewers with zero friction.',
              icon: Share2,
            },
            {
              step: '03',
              title: 'Edit Concurrently',
              desc: 'While one person trims dialogue on V1, another polishes audio on A1 and adds kinetic captions on T1.',
              icon: Users,
            },
            {
              step: '04',
              title: 'Instant 4K Export',
              desc: 'Review frame-by-frame approval markers, run AI audio mastering, and export in 4K ProRes or MP4.',
              icon: Download,
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="relative p-6 rounded-2xl bg-gray-900/60 border border-gray-800 text-left">
                <span className="font-mono text-3xl font-extrabold text-purple-500/30 block mb-3">
                  {item.step}
                </span>
                <div className="w-10 h-10 rounded-xl bg-purple-950/50 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">{item.title}</h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-gray-800/80">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-950/60 border border-purple-500/30 px-3 py-1 rounded-full">
            Loved By Creative Teams
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
            Built For YouTube Creators & Video Agencies
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote: "CollabCut completely removed the 'exporting v3_final_final.mp4' nightmare. My sound designer mixes audio in real-time while I am still trimming B-roll.",
              author: "Marcus Chen",
              role: "Head of Video, HyperGrowth Studio",
              avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
              rating: 5,
            },
            {
              quote: "The frame-specific timestamp comments are a lifesaver. Clients can pinpoint exact moments without sending messy bulleted emails.",
              author: "Elena Rostova",
              role: "Motion Designer & Director",
              avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
              rating: 5,
            },
            {
              quote: "The Time Machine version history feature saved us when we had to roll back a client cut 20 minutes before a national broadcast premiere.",
              author: "Alex Rivera",
              role: "Commercial Post-Production Lead",
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
              rating: 5,
            }
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-800/80">
                <img src={item.avatar} alt={item.author} className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/40" />
                <div>
                  <h5 className="text-xs font-bold text-white">{item.author}</h5>
                  <p className="text-[11px] text-slate-400">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-gray-800/80">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-950/60 border border-purple-500/30 px-3 py-1 rounded-full">
            Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
            Scale From Solo Creator To Full Studio
          </h2>
          
          {/* Billing Switch */}
          <div className="inline-flex items-center p-1 rounded-xl bg-gray-900 border border-gray-800 mt-6">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                billingCycle === 'monthly' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                billingCycle === 'annual' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Annual Billing
              <span className="text-[10px] bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded font-bold border border-purple-500/40">
                20% OFF
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Plan 1 */}
          <div className="p-7 rounded-2xl bg-gray-900/60 border border-gray-800 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Starter</h3>
              <p className="text-xs text-slate-400 mt-1">For individual creators starting collaborative cuts</p>
              <div className="my-6">
                <span className="text-4xl font-extrabold text-white">$0</span>
                <span className="text-xs text-slate-400 ml-1">/ month forever</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> 2 Active Team Projects</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Up to 2 Live Collaborators</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> 1080p Full HD Exports</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> 5GB High-Speed Cloud Storage</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> 7-Day Version History</li>
              </ul>
            </div>
            <button
              onClick={() => onOpenAuth('signup')}
              className="mt-8 w-full py-2.5 rounded-xl border border-gray-700 bg-gray-800 hover:bg-gray-750 text-xs font-semibold text-white transition-colors"
            >
              Get Started Free
            </button>
          </div>

          {/* Plan 2: Popular */}
          <div className="p-7 rounded-2xl bg-gray-900 border-2 border-purple-500 shadow-2xl shadow-purple-600/20 relative flex flex-col justify-between">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-0.5 rounded-full shadow">
              Most Popular
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">Creator Team</h3>
              <p className="text-xs text-slate-400 mt-1">For YouTube channels, creative agencies, and production pods</p>
              <div className="my-6">
                <span className="text-4xl font-extrabold text-white">
                  ${billingCycle === 'annual' ? '19' : '24'}
                </span>
                <span className="text-xs text-slate-400 ml-1">/ seat / month</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Unlimited Video Projects</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Up to 10 Concurrent Collaborators</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> 4K Ultra HD & 60 FPS Exports</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> AI Auto-Caption & Silence Removal</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> 30-Day Time Machine Revisions</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Frame Timestamp Comment Threads</li>
              </ul>
            </div>
            <button
              onClick={() => onOpenAuth('signup')}
              className="mt-8 w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white shadow-lg shadow-purple-600/30 transition-all"
            >
              Start 14-Day Free Trial
            </button>
          </div>

          {/* Plan 3 */}
          <div className="p-7 rounded-2xl bg-gray-900/60 border border-gray-800 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Studio Pro</h3>
              <p className="text-xs text-slate-400 mt-1">For broadcast studios, enterprise brands, and film houses</p>
              <div className="my-6">
                <span className="text-4xl font-extrabold text-white">
                  ${billingCycle === 'annual' ? '59' : '69'}
                </span>
                <span className="text-xs text-slate-400 ml-1">/ seat / month</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Unlimited Everything</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Apple ProRes & Avid DNxHR Exports</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Unlimited Time Machine Versioning</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Custom Domain & White-Label Sharing</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> SSO, SAML & SOC-2 Compliance</li>
              </ul>
            </div>
            <button
              onClick={() => onOpenAuth('signup')}
              className="mt-8 w-full py-2.5 rounded-xl border border-gray-700 bg-gray-800 hover:bg-gray-750 text-xs font-semibold text-white transition-colors"
            >
              Contact Studio Sales
            </button>
          </div>

        </div>
      </section>

      {/* Final Call To Action */}
      <section className="py-20 px-4 text-center max-w-5xl mx-auto">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-tr from-purple-950/80 via-gray-900 to-indigo-950/80 border border-purple-500/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready To Never Edit Video Alone Again?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-4 max-w-xl mx-auto">
            Join thousands of creators who cut, review, and publish their videos 5x faster with CollabCut.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onOpenAuth('signup')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm shadow-xl shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
            >
              Start Creating Free Today
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleLaunchEditor}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-slate-200 border border-gray-700 text-sm font-semibold transition-all"
            >
              Open Instant Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/80 bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
          
          <div className="col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/30">
                <Play className="w-3.5 h-3.5 fill-white text-white translate-x-0.5" />
              </div>
              <span className="font-extrabold text-lg text-white">Collab<span className="text-purple-400">Cut</span></span>
            </div>
            <p className="text-xs text-slate-400 mt-3 max-w-sm leading-relaxed">
              Create Together. Edit Together. Publish Together. The next-generation cloud video editing suite for modern creators and distributed teams.
            </p>
            <div className="flex items-center gap-3 mt-4 text-slate-400">
              <a href="#social" className="hover:text-purple-400 transition-colors p-1.5 rounded-lg bg-gray-900 border border-gray-800"><Globe className="w-4 h-4" /></a>
              <a href="#social" className="hover:text-purple-400 transition-colors p-1.5 rounded-lg bg-gray-900 border border-gray-800"><ShareIcon className="w-4 h-4" /></a>
              <a href="#social" className="hover:text-purple-400 transition-colors p-1.5 rounded-lg bg-gray-900 border border-gray-800"><VideoIcon className="w-4 h-4" /></a>
              <a href="#social" className="hover:text-purple-400 transition-colors p-1.5 rounded-lg bg-gray-900 border border-gray-800"><MessageCircle className="w-4 h-4" /></a>
            </div>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Product</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><button onClick={handleLaunchEditor} className="hover:text-white transition-colors">Video Workspace</button></li>
              <li><a href="#features" className="hover:text-white transition-colors">Multiplayer Timeline</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Time Machine Snapshots</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">AI Auto-Cut & Captions</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing Plans</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Company</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#careers" className="hover:text-white transition-colors">Careers (We're Hiring!)</a></li>
              <li><a href="#blog" className="hover:text-white transition-colors">Engineering Blog</a></li>
              <li><a href="#press" className="hover:text-white transition-colors">Press Kit</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-3">System Status</h5>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                All Systems Operational
              </div>
              <p className="text-[11px] text-slate-500">Cloud WebGL Render: 60 FPS</p>
              <p className="text-[11px] text-slate-500">Global Sync Latency: 12ms</p>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-gray-800/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
          <p>© 2026 CollabCut Inc. Designed for Collaborative Video Innovation.</p>
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <a href="#privacy" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-400">Terms of Service</a>
            <a href="#security" className="hover:text-slate-400">Security Architecture</a>
          </div>
        </div>
      </footer>

    </div>
  );
};
