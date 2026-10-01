import React from 'react';
import { Skull, PlusCircle, Zap, Table, HelpCircle, RefreshCw, Compass } from 'lucide-react';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  onOpenUpload, 
  onOpenFrankenstein,
  selectedForFrankenstein,
  onOpenHowItWorks,
  onResetDemo
}) {
  return (
    <header className="sticky top-0 z-40 cemetery-glass border-b border-purple-900/30 px-4 lg:px-8 py-3.5 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <div 
          onClick={() => setCurrentTab('cemetery')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-400 group-hover:scale-105 group-hover:border-purple-400 transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <Skull className="w-5 h-5 group-hover:rotate-12 transition-transform text-purple-300" />
          </div>
          <div>
            <span className="text-lg font-black tracking-wider text-slate-100 uppercase font-mono flex items-center gap-1.5">
              PROJECT <span className="text-purple-400">CEMETERY</span>
            </span>
            <p className="text-[10px] text-purple-300/70 tracking-widest font-mono uppercase">
              AI Software Autopsy & Resurrection
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center bg-slate-900/60 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setCurrentTab('cemetery')}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
              currentTab === 'cemetery' 
                ? 'bg-purple-600/90 text-white shadow-lg shadow-purple-900/40' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Cemetery Dashboard
          </button>

          <button
            onClick={() => setCurrentTab('comparison')}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
              currentTab === 'comparison' 
                ? 'bg-purple-600/90 text-white shadow-lg shadow-purple-900/40' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            Compare Projects
          </button>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          
          {/* Frankenstein Fusion Button */}
          <button
            onClick={onOpenFrankenstein}
            className={`relative px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
              selectedForFrankenstein.length >= 2
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.5)] animate-pulse'
                : 'bg-slate-900/80 text-purple-300 border-purple-900/40 hover:bg-purple-950/40'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            Frankenstein Mode
            {selectedForFrankenstein.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-purple-400 text-slate-950 font-black text-[10px] flex items-center justify-center ml-0.5">
                {selectedForFrankenstein.length}
              </span>
            )}
          </button>

          {/* Bury Project Button */}
          <button
            onClick={onOpenUpload}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            + BURY A PROJECT
          </button>

          {/* How It Works & Reset Demo */}
          <button
            onClick={onOpenHowItWorks}
            title="See How It Works"
            className="p-2 text-slate-400 hover:text-purple-300 bg-slate-900/60 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            onClick={onResetDemo}
            title="Reset Demo Projects"
            className="p-2 text-slate-400 hover:text-amber-400 bg-slate-900/60 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
