import React, { useState } from 'react';
import { Zap, X, Sparkles, Check, Loader2, Skull, Layers, Flame, AlertCircle, Mic } from 'lucide-react';
import { createFrankenstein } from '../services/api';
import PitchGeneratorModal from './PitchGeneratorModal';

export default function FrankensteinModal({ 
  isOpen, 
  onClose, 
  projects = [], 
  selectedIds = [], 
  onToggleSelect 
}) {
  const [loading, setLoading] = useState(false);
  const [fusion, setFusion] = useState(null);
  const [error, setError] = useState(null);
  const [pitchOpen, setPitchOpen] = useState(false);

  if (!isOpen) return null;

  const selectedProjects = projects.filter(p => selectedIds.includes(p.id));

  const handleCreateFusion = async () => {
    if (selectedIds.length < 2 || selectedIds.length > 4) {
      setError('Please select between 2 and 4 abandoned projects to fuse.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await createFrankenstein(selectedIds);
      setFusion(res.fusion);
    } catch (err) {
      setError(err.message || 'Failed to generate Frankenstein fusion');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="cemetery-glass border border-purple-400/50 rounded-2xl w-full max-w-4xl p-6 sm:p-8 relative shadow-[0_0_60px_rgba(168,85,247,0.4)] my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-1.5 rounded-lg bg-slate-900/80 border border-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-purple-950 border border-purple-400/60 flex items-center justify-center text-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.4)] animate-pulse">
            <Zap className="w-6 h-6 fill-yellow-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase font-mono tracking-wider text-slate-100 flex items-center gap-2">
              ⚡ FRANKENSTEIN MODE
            </h2>
            <p className="text-xs text-purple-300 font-mono">
              Combine surviving assets from multiple dead projects to forge a brand new hybrid concept.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* PROJECT SELECTION GRID */}
        {!fusion ? (
          <div className="space-y-6">
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-300">
                Select 2 to 4 Projects to Fuse ({selectedIds.length}/4 selected):
              </span>

              {selectedIds.length > 0 && (
                <button
                  onClick={() => selectedIds.forEach(id => onToggleSelect(id))}
                  className="text-[11px] text-purple-400 hover:underline font-mono"
                >
                  Clear Selection
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map((p) => {
                const isSelected = selectedIds.includes(p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => onToggleSelect(p.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                      isSelected
                        ? 'bg-purple-950/60 border-purple-400 ring-2 ring-purple-500/40 shadow-lg'
                        : 'bg-slate-950/60 border-slate-800 hover:border-purple-900/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🪦</span>
                        <h4 className="text-sm font-bold font-mono text-slate-100">{p.name}</h4>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {p.tech_stack?.slice(0, 3).map((t, idx) => (
                          <span key={idx} className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-400 border border-slate-800">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      isSelected ? 'bg-purple-600 border-purple-300 text-white' : 'border-slate-700 bg-slate-900 text-transparent'
                    }`}>
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Fusion Action Button */}
            <div className="pt-4 border-t border-purple-900/30 flex justify-end">
              <button
                onClick={handleCreateFusion}
                disabled={loading || selectedIds.length < 2}
                className="px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-purple-600 via-indigo-600 to-yellow-500 hover:from-purple-500 hover:to-yellow-400 text-slate-950 shadow-[0_0_30px_rgba(234,179,8,0.4)] flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-40"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    STITCHING CODE & AI FUSION...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-slate-950" />
                    ⚡ CREATE FRANKENSTEIN FUSION
                  </>
                )}
              </button>
            </div>

          </div>
        ) : (
          /* FRANKENSTEIN FUSION RESULT DISPLAY */
          <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            
            {/* Fusion Title Header */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-950 border border-purple-400/60 shadow-[0_0_40px_rgba(168,85,247,0.3)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 font-black text-7xl text-purple-400 pointer-events-none select-none font-mono">
                HYBRID
              </div>

              <span className="text-[10px] font-mono uppercase font-bold tracking-widest px-3 py-1 rounded bg-yellow-950 text-yellow-300 border border-yellow-500/40">
                ⚡ Frankenstein Stitched Product
              </span>

              <h3 className="text-3xl font-black font-mono text-slate-100 uppercase tracking-tight mt-3">
                {fusion.fusion_name}
              </h3>
              <p className="text-sm font-serif italic text-purple-200 mt-1">
                "{fusion.tagline}"
              </p>
            </div>

            {/* Concept & Why Fits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-purple-900/40">
                <h4 className="text-xs font-mono font-bold uppercase text-purple-400 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Fused Product Concept
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {fusion.concept}
                </p>
              </div>

              <div className="bg-slate-950/80 p-5 rounded-2xl border border-emerald-900/40">
                <h4 className="text-xs font-mono font-bold uppercase text-emerald-400 mb-2 flex items-center gap-2">
                  <Flame className="w-4 h-4" />
                  Why These Components Fit Together
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {fusion.why_fits}
                </p>
              </div>

            </div>

            {/* DNA From Each Parent Project */}
            <div className="cemetery-glass p-5 rounded-2xl border border-purple-900/30">
              <h4 className="text-xs font-mono font-bold uppercase text-slate-200 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                DNA From Each Parent Project
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {fusion.dna_breakdown?.map((item, idx) => (
                  <div key={idx} className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-xs font-bold text-slate-100 font-mono block">🪦 {item.project}</span>
                    <div className="flex justify-between items-center text-[11px] text-purple-300 mt-1 font-mono">
                      <span>Contribution:</span>
                      <span className="font-bold">{item.contribution_pct}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reused vs New Components */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-emerald-900/40">
                <h4 className="text-xs font-mono font-bold uppercase text-emerald-400 mb-3">
                  ✓ Reused Surviving Assets
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {fusion.reused_components?.map((rc, idx) => (
                    <li key={idx} className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                      <span className="font-semibold text-slate-200">{rc.component}</span>
                      <span className="text-[10px] font-mono text-purple-400">from {rc.project}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-950/80 p-5 rounded-2xl border border-cyan-900/40">
                <h4 className="text-xs font-mono font-bold uppercase text-cyan-400 mb-3">
                  + New Components Required
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {fusion.new_components_required?.map((nc, idx) => (
                    <li key={idx} className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                      {nc}
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Architecture & Challenges */}
            <div className="bg-slate-950/90 p-5 rounded-2xl border border-purple-900/40 space-y-3 font-mono text-xs">
              <div>
                <span className="text-purple-400 font-bold uppercase block mb-1">Stitched Architecture Overview:</span>
                <p className="text-slate-300">{fusion.architecture}</p>
              </div>

              <div>
                <span className="text-amber-400 font-bold uppercase block mb-1">Potential Technical Challenges:</span>
                <ul className="list-disc list-inside text-slate-400 space-y-1">
                  {fusion.technical_challenges?.map((tc, idx) => (
                    <li key={idx}>{tc}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Reset / New Frankenstein Action */}
            <div className="flex flex-wrap justify-end gap-3 pt-2">
              <button
                onClick={() => setPitchOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 border border-purple-800/60 text-xs font-bold text-purple-300 hover:text-white flex items-center gap-2"
              >
                <Mic className="w-4 h-4 text-purple-400 animate-pulse" />
                🎤 HACKATHON PITCH KIT
              </button>

              <button
                onClick={() => setFusion(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white"
              >
                ← Fuse Different Projects
              </button>

              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-lg"
              >
                Close & Return to Cemetery
              </button>
            </div>

            {/* Pitch Kit Generator Modal */}
            <PitchGeneratorModal 
              isOpen={pitchOpen}
              onClose={() => setPitchOpen(false)}
              projectId={selectedIds[0]}
              projectName={fusion.fusion_name}
            />

          </div>
        )}

      </div>
    </div>

  );
}
