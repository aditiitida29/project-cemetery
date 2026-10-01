import React, { useState } from 'react';
import { 
  Zap, Sparkles, CheckCircle2, ArrowRight, Layers, Trash2, Edit3, PlusCircle, 
  Loader2, GitBranch, Terminal, ShieldCheck, ListOrdered, ArrowLeftRight 
} from 'lucide-react';
import { resurrectProject } from '../services/api';

export default function ResurrectionView({ project, existingResurrections = [] }) {
  const [mode, setMode] = useState('hackathon'); // continue | convert | extract | portfolio | hackathon
  const [targetGoal, setTargetGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(existingResurrections[0] || null);

  const MODES = [
    { id: 'hackathon', label: 'Hackathon Concept', desc: 'Transform into a winning high-impact demo MVP' },
    { id: 'convert', label: 'Convert to New Project', desc: 'Pivot target domain while reusing core code' },
    { id: 'continue', label: 'Continue Original', desc: 'Fix bugs, bridge APIs, and finalize project' },
    { id: 'extract', label: 'Extract Components', desc: 'Isolate surviving auth/DB modules for library export' },
    { id: 'portfolio', label: 'Portfolio Showpiece', desc: 'Polish documentation, tests, and deployment' }
  ];

  const handleGeneratePlan = async () => {
    setLoading(true);
    try {
      const res = await resurrectProject(project.id, mode, targetGoal);
      setCurrentPlan(res.plan);
    } catch (err) {
      alert('Failed to generate resurrection plan: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Wizard Control Panel */}
      <div className="cemetery-glass p-6 rounded-2xl border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
        
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-400/50 flex items-center justify-center text-yellow-400">
            <Zap className="w-5 h-5 fill-yellow-400" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase font-mono tracking-wide text-slate-100">
              ⚡ RESURRECTION PLAN GENERATOR
            </h2>
            <p className="text-xs text-purple-300/80 font-mono">
              Define your resurrection target and generate a step-by-step architectural blueprint.
            </p>
          </div>
        </div>

        {/* Mode Selector Buttons */}
        <div className="mb-6">
          <label className="block text-xs font-mono uppercase text-slate-400 mb-3">
            Select Resurrection Strategy:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  mode === m.id
                    ? 'bg-purple-950/80 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)] ring-1 ring-purple-400'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-purple-900/50 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-bold font-mono text-slate-200 mb-1">{m.label}</div>
                <div className="text-[10px] text-slate-400 leading-tight">{m.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Goal Input & Generate Action */}
        <div className="space-y-3">
          <label className="block text-xs font-mono uppercase text-slate-300">
            What do you want to build from this project?
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={targetGoal}
              onChange={(e) => setTargetGoal(e.target.value)}
              placeholder={`e.g., Build a hackathon collaboration platform reusing ${project.name}'s auth & chat...`}
              className="flex-1 bg-slate-950/90 border border-slate-700/80 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-purple-400 font-sans"
            />

            <button
              onClick={handleGeneratePlan}
              disabled={loading}
              className="px-8 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 text-white shadow-lg shadow-purple-950 flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Plan...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-purple-200" />
                  GENERATE BLUEPRINT
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* PLAN OUTPUT RESULT */}
      {currentPlan ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Header Banner */}
          <div className="cemetery-glass p-6 rounded-2xl border border-purple-500/40 bg-gradient-to-r from-purple-950/60 via-indigo-950/40 to-slate-950">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded bg-purple-900/80 text-purple-300 border border-purple-700">
                  Target Blueprint
                </span>
                <h2 className="text-2xl font-black font-mono text-slate-100 mt-2 uppercase">
                  {currentPlan.new_project_name}
                </h2>
                <p className="text-xs text-purple-300 italic font-serif mt-1">
                  "{currentPlan.tagline}"
                </p>
              </div>

              <div className="text-right font-mono text-xs text-slate-400">
                <span>Strategy Mode: <strong className="text-emerald-400 uppercase">{currentPlan.resurrection_mode}</strong></span>
              </div>
            </div>
          </div>

          {/* Before -> After Visual Mapping */}
          <div className="cemetery-glass p-6 rounded-2xl border border-purple-900/30">
            <h3 className="text-sm font-bold font-mono text-slate-200 uppercase mb-4 flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-purple-400" />
              Before → After Transformation Mapping
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-slate-950/80 p-4 rounded-xl border border-rose-950">
                <span className="text-rose-400 uppercase text-[10px] font-bold tracking-widest block mb-2">
                  OLD ABANDONED PROJECT ({project.name})
                </span>
                <ul className="space-y-2 text-slate-400">
                  {project.tech_stack?.map((t, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-rose-500">✕</span>
                      <span>{t} legacy implementation</span>
                    </li>
                  ))}
                  <li className="flex items-center gap-2 text-rose-300">
                    <span className="text-rose-500">✕</span>
                    <span>{project.todo_count} pending TODO technical debt items</span>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-xl border border-emerald-950">
                <span className="text-emerald-400 uppercase text-[10px] font-bold tracking-widest block mb-2">
                  NEW RESURRECTED PRODUCT ({currentPlan.new_project_name})
                </span>
                <ul className="space-y-2 text-slate-200">
                  {currentPlan.components_to_keep?.slice(0, 3).map((c, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span>Reused: {c}</span>
                    </li>
                  ))}
                  {currentPlan.new_components_required?.slice(0, 2).map((c, i) => (
                    <li key={i} className="flex items-center gap-2 text-cyan-300">
                      <span className="text-cyan-400">+</span>
                      <span>Added: {c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 4 Architectural Component Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 1. Components to Keep */}
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-emerald-900/40">
              <div className="flex items-center gap-2 mb-3 text-emerald-400 text-xs font-mono font-bold uppercase">
                <CheckCircle2 className="w-4 h-4" />
                1. Components to Keep
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {currentPlan.components_to_keep?.map((item, idx) => (
                  <li key={idx} className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. Components to Modify */}
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-amber-900/40">
              <div className="flex items-center gap-2 mb-3 text-amber-400 text-xs font-mono font-bold uppercase">
                <Edit3 className="w-4 h-4" />
                2. Components to Modify
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {currentPlan.components_to_modify?.map((item, idx) => (
                  <li key={idx} className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Components to Remove */}
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-rose-900/40">
              <div className="flex items-center gap-2 mb-3 text-rose-400 text-xs font-mono font-bold uppercase">
                <Trash2 className="w-4 h-4" />
                3. Components to Remove
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {currentPlan.components_to_remove?.map((item, idx) => (
                  <li key={idx} className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. New Required */}
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-cyan-900/40">
              <div className="flex items-center gap-2 mb-3 text-cyan-400 text-xs font-mono font-bold uppercase">
                <PlusCircle className="w-4 h-4" />
                4. New Required
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {currentPlan.new_components_required?.map((item, idx) => (
                  <li key={idx} className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Architecture & Implementation Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Suggested Architecture */}
            <div className="cemetery-glass p-6 rounded-2xl border border-purple-900/30">
              <h3 className="text-sm font-bold font-mono text-slate-200 uppercase mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                Suggested System Architecture
              </h3>
              <div className="bg-slate-950/90 p-4 rounded-xl border border-purple-900/30 font-mono text-xs text-purple-200 leading-relaxed">
                {currentPlan.suggested_architecture}
              </div>
            </div>

            {/* Implementation Order */}
            <div className="cemetery-glass p-6 rounded-2xl border border-purple-900/30">
              <h3 className="text-sm font-bold font-mono text-slate-200 uppercase mb-3 flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-emerald-400" />
                Recommended Implementation Steps
              </h3>
              <div className="space-y-2">
                {currentPlan.implementation_steps?.map((stepText, sIdx) => (
                  <div key={sIdx} className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-[11px] font-bold font-mono flex items-center justify-center shrink-0 mt-0.5">
                      {sIdx + 1}
                    </span>
                    <span>{stepText}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className="text-center py-12 text-slate-500 font-mono text-xs">
          Click "GENERATE BLUEPRINT" above to create an AI resurrection plan.
        </div>
      )}

    </div>
  );
}
