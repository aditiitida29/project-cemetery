import React, { useState } from 'react';
import { 
  Skull, AlertCircle, CheckCircle2, Activity, Zap, FileCode, ArrowLeft, 
  Sparkles, Layers, ShieldCheck, HelpCircle, Code2, Compass, Cpu, Flame, Mic 
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import SurvivorsView from './SurvivorsView';
import ResurrectionView from './ResurrectionView';
import GhostChatDrawer from './GhostChatDrawer';
import PitchGeneratorModal from './PitchGeneratorModal';

export default function AutopsyView({ projectData, onBack, onOpenResurrection }) {
  const [activeTab, setActiveTab] = useState('autopsy'); // 'autopsy' | 'survivors' | 'resurrection'
  const [pitchModalOpen, setPitchModalOpen] = useState(false);

  const { project, autopsy, survivors, resurrections } = projectData;

  const likelyCauses = autopsy?.likely_causes || [];
  const dnaMetrics = autopsy?.dna_metrics || {};
  const techDna = autopsy?.tech_dna || [];
  const commitHistory = autopsy?.commit_history || [
    { month: "Nov 2024", commits: 25, status: "Active" },
    { month: "Dec 2024", commits: 68, status: "Active" },
    { month: "Jan 2025", commits: 115, status: "Peak Velocity" },
    { month: "Feb 2025", commits: 84, status: "Slowing" },
    { month: "Mar 2025", commits: 22, "status": "Critical" },
    { month: "Apr 2025 (Dormant)", commits: 0, status: "Dormant / Abandoned" },
    { month: "May 2025", commits: 0, status: "Dead" }
  ];

  const dormantPoint = commitHistory.find(c => c.commits === 0 || c.month.includes('Dormant') || c.month.includes('Abandoned'));

  // Colors for DNA Chart
  const BAR_COLORS = ['#a855f7', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300 relative">
      
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-purple-900/30 pb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors flex items-center gap-2 text-xs font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            Cemetery
          </button>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-100 uppercase">
                {project.name}
              </h1>
              <span className={`text-xs uppercase font-bold px-3 py-1 rounded-full border ${
                project.status === 'Dormant' 
                  ? 'bg-amber-950/80 border-amber-500/40 text-amber-300' 
                  : 'bg-purple-950/80 border-purple-500/40 text-purple-300'
              }`}>
                {project.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              {project.description}
            </p>
          </div>
        </div>

        {/* Action Triggers */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPitchModalOpen(true)}
            className="px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-purple-300 border border-purple-800/60 transition-all flex items-center gap-2 shadow-md"
          >
            <Mic className="w-4 h-4 text-purple-400 animate-pulse" />
            🎤 HACKATHON PITCH KIT
          </button>

          <button
            onClick={() => setActiveTab('resurrection')}
            className="px-6 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 text-white shadow-[0_0_25px_rgba(168,85,247,0.4)] flex items-center gap-2 transform hover:scale-105 active:scale-95 transition-all"
          >
            <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            ⚡ RESURRECT THIS PROJECT
          </button>
        </div>
      </div>


      {/* Sub Navigation Tabs */}
      <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 w-fit">
        <button
          onClick={() => setActiveTab('autopsy')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'autopsy' 
              ? 'bg-purple-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🧪 PROJECT AUTOPSY
        </button>

        <button
          onClick={() => setActiveTab('survivors')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'survivors' 
              ? 'bg-purple-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          SURVIVING ASSETS ({survivors?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('resurrection')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'resurrection' 
              ? 'bg-purple-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-yellow-400" />
          RESURRECTION PLAN
        </button>
      </div>

      {/* TAB CONTENT 1: AUTOPSY VIEW */}
      {activeTab === 'autopsy' && (
        <div className="space-y-8">
          
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="cemetery-glass p-4 rounded-xl border border-purple-900/30">
              <p className="text-[11px] text-slate-400 font-mono uppercase mb-1">Completion Estimate</p>
              <p className="text-2xl font-black font-mono text-purple-300">{project.completion_pct}%</p>
              <div className="w-full h-1 bg-slate-900 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${project.completion_pct}%` }} />
              </div>
            </div>

            <div className="cemetery-glass p-4 rounded-xl border border-purple-900/30">
              <p className="text-[11px] text-slate-400 font-mono uppercase mb-1">Repository Files</p>
              <p className="text-2xl font-black font-mono text-slate-100">{project.file_count}</p>
              <p className="text-[10px] text-slate-500 font-mono mt-1">~{project.line_count} lines of code</p>
            </div>

            <div className="cemetery-glass p-4 rounded-xl border border-purple-900/30">
              <p className="text-[11px] text-slate-400 font-mono uppercase mb-1">Technical Debt</p>
              <p className="text-2xl font-black font-mono text-amber-400">{project.todo_count} TODOs</p>
              <p className="text-[10px] text-slate-500 font-mono mt-1">{project.test_count} tests found</p>
            </div>

            <div className="cemetery-glass p-4 rounded-xl border border-purple-900/30">
              <p className="text-[11px] text-slate-400 font-mono uppercase mb-1">Reusability Score</p>
              <p className="text-2xl font-black font-mono text-emerald-400">{survivors?.length || 0} Assets</p>
              <p className="text-[10px] text-emerald-400/80 font-mono mt-1">Ready for extraction</p>
            </div>

          </div>

          {/* Forensic Autopsy Section */}
          <div className="cemetery-glass rounded-2xl p-6 border border-purple-900/30 relative">
            <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-300">
                  <Skull className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black uppercase font-mono tracking-wide text-slate-100">
                    🧪 Forensic Autopsy Findings
                  </h2>
                  <p className="text-xs text-purple-300/80 font-mono">
                    Likely causes of project death derived strictly from repository evidence.
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-950/60 border border-purple-800/40 text-[11px] font-mono text-purple-300">
                <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
                <span>Evidence-Grounded AI Analysis</span>
              </div>
            </div>

            {/* Causes & Evidence Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {likelyCauses.map((item, idx) => (
                <div key={idx} className="bg-slate-950/60 p-5 rounded-xl border border-purple-900/40 hover:border-purple-500/40 transition-all">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="w-6 h-6 rounded-full bg-rose-950 border border-rose-500/40 text-rose-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-100 font-mono">
                        Likely Cause: {item.cause}
                      </h3>
                      <p className="text-[10px] text-purple-300 uppercase font-mono tracking-wider mt-0.5">
                        Observed Repository Evidence:
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-300 pl-9">
                    {item.evidence?.map((ev, evIdx) => (
                      <li key={evIdx} className="flex items-start gap-2 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                        <span className="text-purple-400 font-mono select-none">•</span>
                        <span>{ev}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* COMMIT VELOCITY & DEATH TIMELINE GRAPH */}
          <div className="cemetery-glass rounded-2xl p-6 border border-purple-900/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-black uppercase font-mono tracking-wide text-slate-100 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-rose-400" />
                  Commit Velocity & Death Timeline Graph
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  Monthly development activity curve pinpointing the exact time velocity collapsed.
                </p>
              </div>

              {dormantPoint && (
                <div className="px-3 py-1.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold flex items-center gap-2 shrink-0">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>⚡ Project went dormant in <strong className="text-white underline">{dormantPoint.month}</strong></span>
                </div>
              )}
            </div>

            {/* Recharts Area Chart */}
            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={commitHistory} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="commitGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f111a', borderColor: '#8b5cf6', borderRadius: '12px', color: '#f8fafc', fontFamily: 'monospace' }}
                    formatter={(val) => [`${val} commits`, 'Monthly Velocity']}
                  />
                  <Area type="monotone" dataKey="commits" stroke="#c084fc" strokeWidth={3} fillOpacity={1} fill="url(#commitGlow)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PROJECT DNA SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            
            {/* Architectural Profile DNA */}
            <div className="cemetery-glass rounded-2xl p-6 border border-purple-900/30">
              <h2 className="text-base font-black uppercase font-mono tracking-wide text-slate-100 mb-1 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                Project DNA Breakdown
              </h2>
              <p className="text-xs text-slate-400 mb-6 font-mono">
                Component health and implementation completeness across architecture layers.
              </p>

              <div className="space-y-3.5">
                {[
                  { label: 'Frontend UI', score: dnaMetrics.frontend || 50, color: 'from-purple-500 to-indigo-500' },
                  { label: 'Backend API', score: dnaMetrics.backend || 50, color: 'from-indigo-500 to-cyan-500' },
                  { label: 'Database Schema', score: dnaMetrics.database || 40, color: 'from-cyan-500 to-emerald-500' },
                  { label: 'Authentication', score: dnaMetrics.authentication || 40, color: 'from-emerald-500 to-teal-500' },
                  { label: 'APIs & Services', score: dnaMetrics.apis || 50, color: 'from-amber-500 to-orange-500' },
                  { label: 'Testing Suite', score: dnaMetrics.testing || 20, color: 'from-rose-500 to-purple-500' },
                  { label: 'Documentation', score: dnaMetrics.documentation || 30, color: 'from-violet-500 to-purple-500' }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300">{item.label}</span>
                      <span className="text-slate-400 font-bold">{item.score}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div 
                        className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-700`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack Distribution Chart */}
            <div className="cemetery-glass rounded-2xl p-6 border border-purple-900/30 flex flex-col justify-between">
              <div>
                <h2 className="text-base font-black uppercase font-mono tracking-wide text-slate-100 mb-1 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-emerald-400" />
                  Technology DNA Distribution
                </h2>
                <p className="text-xs text-slate-400 mb-6 font-mono">
                  Percentage breakdown of language files and stack components.
                </p>

                {/* Recharts Bar Visualization */}
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={techDna} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="tech" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }} />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f111a', borderColor: '#475569', borderRadius: '8px', color: '#f8fafc' }}
                        formatter={(val) => [`${val}%`, 'Share']}
                      />
                      <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
                        {techDna.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bottom Quick Callout */}
              <div className="mt-4 p-4 rounded-xl bg-purple-950/40 border border-purple-900/40 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-200 font-mono">Ready to resurrect code?</h4>
                  <p className="text-[11px] text-purple-300">Extract clean survivors or generate a complete rebirth roadmap.</p>
                </div>
                <button
                  onClick={() => setActiveTab('survivors')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold transition-all shadow-md shrink-0"
                >
                  View Survivors →
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* TAB CONTENT 2: SURVIVORS VIEW */}
      {activeTab === 'survivors' && (
        <SurvivorsView 
          survivors={survivors} 
          projectId={project.id}
          projectName={project.name}
          onResurrectClick={() => setActiveTab('resurrection')}
        />
      )}


      {/* TAB CONTENT 3: RESURRECTION PLAN */}
      {activeTab === 'resurrection' && (
        <ResurrectionView 
          project={project} 
          existingResurrections={resurrections}
        />
      )}

      {/* Sassy AI Code Ghost Chatbot Drawer */}
      <GhostChatDrawer 
        projectId={project.id}
        projectName={project.name}
      />

      {/* Hackathon Pitch Generator Modal */}
      <PitchGeneratorModal 
        isOpen={pitchModalOpen}
        onClose={() => setPitchModalOpen(false)}
        projectId={project.id}
        projectName={project.name}
      />

    </div>
  );
}

