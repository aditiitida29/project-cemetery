import React from 'react';
import { Table, ShieldCheck, Activity, Calendar, Zap, ArrowRight } from 'lucide-react';

export default function ComparisonTable({ projects = [], onSelectProject }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="cemetery-glass p-6 rounded-2xl border border-purple-900/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-300">
            <Table className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase font-mono tracking-wide text-slate-100">
              Project Comparison Matrix
            </h1>
            <p className="text-xs text-purple-300/80 font-mono">
              Empirical side-by-side analysis of completion, health score, reusable assets, and resurrection viability.
            </p>
          </div>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="cemetery-glass rounded-2xl border border-purple-900/30 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-purple-900/40 text-[11px] font-mono uppercase text-slate-400">
                <th className="p-4">Project Name</th>
                <th className="p-4">Status</th>
                <th className="p-4">Completion %</th>
                <th className="p-4">Health Score</th>
                <th className="p-4">Survivors</th>
                <th className="p-4">Tech Stack</th>
                <th className="p-4 text-right">Resurrection Potential</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs font-mono">
              {projects.map((p) => {
                const potential = p.completion_pct > 70 ? 'High' : p.completion_pct > 40 ? 'Medium' : 'Low';
                const potentialColor = potential === 'High' ? 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40' : potential === 'Medium' ? 'text-amber-400 bg-amber-950/60 border-amber-500/40' : 'text-rose-400 bg-rose-950/60 border-rose-500/40';

                return (
                  <tr 
                    key={p.id}
                    onClick={() => onSelectProject(p.id)}
                    className="hover:bg-slate-900/70 transition-colors cursor-pointer group"
                  >
                    {/* Name */}
                    <td className="p-4 font-bold text-slate-100 flex items-center gap-2">
                      <span className="text-base">🪦</span>
                      <span className="group-hover:text-purple-300 transition-colors">{p.name}</span>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                        p.status === 'Dormant' ? 'bg-amber-950/80 text-amber-300 border-amber-500/30' : 'bg-purple-950/80 text-purple-300 border-purple-500/30'
                      }`}>
                        {p.status}
                      </span>
                    </td>

                    {/* Completion */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: `${p.completion_pct}%` }} />
                        </div>
                        <span className="font-bold text-slate-200">{p.completion_pct}%</span>
                      </div>
                    </td>

                    {/* Health Score */}
                    <td className="p-4 text-purple-300 font-bold">
                      {p.health_score}/100
                    </td>

                    {/* Survivors */}
                    <td className="p-4 text-emerald-400 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {p.survivor_count || 3} Assets
                    </td>

                    {/* Tech Stack */}
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {p.tech_stack?.slice(0, 3).map((t, idx) => (
                          <span key={idx} className="text-[10px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Resurrection Potential */}
                    <td className="p-4 text-right">
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${potentialColor}`}>
                        ⚡ {potential} Potential
                      </span>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
