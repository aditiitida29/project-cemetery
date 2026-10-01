import React from 'react';
import { Skull, Sparkles, ArrowRight, Zap, Play, Search, Code2, Flame } from 'lucide-react';

export default function Hero({ onEnterCemetery, onOpenHowItWorks, onTryDemo }) {
  return (
    <section className="relative pt-12 pb-20 px-4 max-w-7xl mx-auto text-center z-10">
      
      {/* Atmosphere Glow Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-mono mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.2)]">
        <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
        <span>HACKATHON-READY AI CODE AUTOPSY & RESURRECTION PLATFORM</span>
      </div>

      {/* Main Title */}
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight uppercase font-mono mb-6 leading-tight">
        PROJECT <span className="text-gradient-purple">CEMETERY</span>
      </h1>

      {/* Primary Quote Tagline */}
      <p className="text-xl sm:text-2xl font-serif italic text-purple-200/90 mb-4 max-w-3xl mx-auto">
        "Some projects were never finished. That doesn't mean they were useless."
      </p>

      {/* Subtitle */}
      <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
        AI that digs through abandoned software projects, performs an automated forensic autopsy, discovers what survived, and gives forgotten code a second life.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
        
        {/* Enter Cemetery */}
        <button
          onClick={onEnterCemetery}
          className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-extrabold uppercase tracking-wider bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 border border-purple-400/40"
        >
          <Skull className="w-5 h-5 text-purple-200" />
          ENTER THE CEMETERY
          <ArrowRight className="w-4 h-4 text-purple-200" />
        </button>

        {/* See How It Works */}
        <button
          onClick={onOpenHowItWorks}
          className="w-full sm:w-auto px-6 py-4 rounded-xl text-sm font-bold bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all flex items-center justify-center gap-2 hover:border-purple-500/50"
        >
          <Play className="w-4 h-4 text-purple-400 fill-purple-400/20" />
          SEE HOW IT WORKS
        </button>

        {/* Try Demo Project */}
        <button
          onClick={onTryDemo}
          className="w-full sm:w-auto px-6 py-4 rounded-xl text-sm font-bold bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-500/40 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
        >
          <Flame className="w-4 h-4 text-emerald-400 animate-bounce" />
          TRY DEMO PROJECT
        </button>
      </div>

      {/* 4 Feature Graveyard Cards Preview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto text-left">
        
        <div className="cemetery-glass p-5 rounded-2xl border border-purple-900/30 relative overflow-hidden group hover:border-purple-500/50 transition-all">
          <div className="w-10 h-10 rounded-xl bg-purple-950/80 text-purple-400 flex items-center justify-center mb-3">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-200 mb-1 font-mono uppercase">1. AI Forensic Autopsy</h3>
          <p className="text-xs text-slate-400 leading-normal">
            Extracts repository facts, pinpoints why the project likely died, and surfaces missing endpoints & TODO debt.
          </p>
        </div>

        <div className="cemetery-glass p-5 rounded-2xl border border-purple-900/30 relative overflow-hidden group hover:border-purple-500/50 transition-all">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 text-emerald-400 flex items-center justify-center mb-3">
            <Code2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-200 mb-1 font-mono uppercase">2. Reusable Survivors</h3>
          <p className="text-xs text-slate-400 leading-normal">
            Identifies surviving JWT auth, database models, UI components, and API routes that can be extracted cleanly.
          </p>
        </div>

        <div className="cemetery-glass p-5 rounded-2xl border border-purple-900/30 relative overflow-hidden group hover:border-purple-500/50 transition-all">
          <div className="w-10 h-10 rounded-xl bg-indigo-950/80 text-indigo-400 flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-200 mb-1 font-mono uppercase">3. Resurrection Plan</h3>
          <p className="text-xs text-slate-400 leading-normal">
            Generates actionable blueprints mapping what to keep, modify, and build for fresh production or hackathon apps.
          </p>
        </div>

        <div className="cemetery-glass p-5 rounded-2xl border border-purple-900/30 relative overflow-hidden group hover:border-purple-500/50 transition-all">
          <div className="w-10 h-10 rounded-xl bg-yellow-950/80 text-yellow-400 flex items-center justify-center mb-3">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-200 mb-1 font-mono uppercase">4. Frankenstein Mode</h3>
          <p className="text-xs text-slate-400 leading-normal">
            Combines 2–4 dead projects into an innovative, high-impact hybrid product concept.
          </p>
        </div>

      </div>
    </section>
  );
}
