import React from 'react';
import { Skull, Activity, Calendar, ShieldCheck, Check, Sparkles, AlertCircle } from 'lucide-react';

export default function GraveCard({ 
  project, 
  onSelect, 
  isFrankensteinSelected, 
  onToggleFrankenstein 
}) {
  const isDormant = project.status === 'Dormant';
  const isCritical = project.status === 'Critical';

  return (
    <div 
      className={`cemetery-glass cemetery-glass-hover rounded-2xl p-5 border relative flex flex-col justify-between transition-all group ${
        isFrankensteinSelected 
          ? 'border-purple-400 bg-purple-950/40 ring-2 ring-purple-500/50 shadow-[0_0_25px_rgba(168,85,247,0.3)]' 
          : 'border-purple-900/30 hover:border-purple-500/40'
      }`}
    >
      {/* Frankenstein Checkbox Overlay */}
      <div className="absolute top-4 right-4 z-10 flex items-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFrankenstein(project.id);
          }}
          title={isFrankensteinSelected ? "Remove from Frankenstein Selection" : "Select for Frankenstein Mode"}
          className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
            isFrankensteinSelected
              ? 'bg-purple-600 border-purple-300 text-white shadow-md'
              : 'border-slate-700 bg-slate-900/80 text-transparent hover:border-purple-400 hover:text-purple-400'
          }`}
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </button>
      </div>

      {/* Top Header */}
      <div>
        <div className="flex items-center gap-3 mb-3 cursor-pointer" onClick={() => onSelect(project.id)}>
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl font-bold border transition-transform group-hover:scale-105 ${
            isDormant 
              ? 'bg-amber-950/60 border-amber-500/30 text-amber-400' 
              : isCritical 
                ? 'bg-rose-950/60 border-rose-500/30 text-rose-400'
                : 'bg-purple-950/60 border-purple-500/30 text-purple-400'
          }`}>
            🪦
          </div>

          <div className="pr-6">
            <h3 className="text-base font-extrabold text-slate-100 font-mono tracking-tight group-hover:text-purple-300 transition-colors flex items-center gap-2">
              {project.name}
              {project.is_demo && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950/80 border border-purple-700/50 text-purple-300 font-sans">
                  DEMO
                </span>
              )}
            </h3>
            
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                isDormant 
                  ? 'bg-amber-950/70 border-amber-500/40 text-amber-300' 
                  : isCritical 
                    ? 'bg-rose-950/70 border-rose-500/40 text-rose-300'
                    : 'bg-purple-950/70 border-purple-500/40 text-purple-300'
              }`}>
                {project.status}
              </span>

              <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                <Calendar className="w-3 h-3 text-slate-500" />
                {project.last_activity}
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed cursor-pointer" onClick={() => onSelect(project.id)}>
          {project.description || "Abandoned software repository sitting dormant in storage."}
        </p>
      </div>

      {/* Tech Stack Pills */}
      <div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tech_stack?.slice(0, 4).map((tech, idx) => (
            <span 
              key={idx}
              className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-900/90 text-slate-300 border border-slate-800"
            >
              {tech}
            </span>
          ))}
          {project.tech_stack?.length > 4 && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-500">
              +{project.tech_stack.length - 4}
            </span>
          )}
        </div>

        {/* Completion Progress & Health Score */}
        <div className="space-y-2 pt-3 border-t border-slate-800/80 cursor-pointer" onClick={() => onSelect(project.id)}>
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Completion:</span>
            <span className="font-bold text-slate-200">{project.completion_pct}%</span>
          </div>

          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div 
              className={`h-full transition-all duration-500 rounded-full ${
                project.completion_pct > 70 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                  : project.completion_pct > 45 
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400' 
                    : 'bg-gradient-to-r from-rose-500 to-purple-500'
              }`}
              style={{ width: `${project.completion_pct}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1">
            <div className="flex items-center gap-1 text-slate-400 font-mono">
              <Activity className="w-3 h-3 text-purple-400" />
              <span>Health Score: <strong className="text-purple-300">{project.health_score}/100</strong></span>
            </div>

            <span className="text-emerald-400 font-mono flex items-center gap-1 text-[10px] bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/50">
              <ShieldCheck className="w-3 h-3" />
              {project.survivor_count || 3} Survivors
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
