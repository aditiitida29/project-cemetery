import React, { useState } from 'react';
import { ShieldCheck, Copy, Check, FileCode, ArrowRight, Zap, Filter, Box, Download, PackageCheck } from 'lucide-react';
import { exportSurvivorBundle } from '../services/api';

export default function SurvivorsView({ survivors = [], projectId, projectName, onResurrectClick }) {
  const [filterType, setFilterType] = useState('All');
  const [copiedId, setCopiedId] = useState(null);
  const [exporting, setExporting] = useState(false);

  const types = ['All', ...new Set(survivors.map(s => s.type))];

  const filtered = filterType === 'All' 
    ? survivors 
    : survivors.filter(s => s.type === filterType);

  const handleCopyPath = (path, id) => {
    navigator.clipboard.writeText(path);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportBundle = async () => {
    if (!projectId) return;
    setExporting(true);
    try {
      await exportSurvivorBundle(projectId, projectName);
    } catch (err) {
      alert('Failed to export survivor bundle: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Title & Filter Bar */}
      <div className="cemetery-glass p-6 rounded-2xl border border-purple-900/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase font-mono tracking-wide text-slate-100">
                SURVIVING ASSETS
              </h2>
              <p className="text-xs text-emerald-400/90 font-mono">
                Isolated, high-quality modules discovered in the dead codebase ready for reuse.
              </p>
            </div>
          </div>
        </div>

        {/* Export Bundle & Filter Pills */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportBundle}
            disabled={exporting}
            className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2 transform hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-slate-950" />
            {exporting ? 'Exporting...' : '📦 EXPORT CLEAN SURVIVOR BUNDLE'}
          </button>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter className="w-4 h-4 text-slate-500 mr-1" />
            {types.map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                  filterType === t 
                    ? 'bg-emerald-600 text-slate-950 font-bold' 
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>


      {/* Survivor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item, idx) => (
          <div 
            key={item.id || idx}
            className="cemetery-glass cemetery-glass-hover rounded-2xl p-6 border border-emerald-900/30 relative flex flex-col justify-between"
          >
            <div>
              {/* Type Badge & Copy Button */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-mono uppercase font-bold px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center gap-1.5">
                  <Box className="w-3 h-3 text-emerald-400" />
                  {item.type}
                </span>

                <button
                  onClick={() => handleCopyPath(item.file_location, item.id || idx)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-1.5 transition-colors"
                  title="Copy File Location"
                >
                  {copiedId === (item.id || idx) ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Path</span>
                    </>
                  )}
                </button>
              </div>

              {/* Name */}
              <h3 className="text-lg font-black text-slate-100 font-mono tracking-tight mb-2">
                ✓ {item.name}
              </h3>

              {/* Reusability Rationale */}
              <div className="mb-4 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
                <p className="text-xs font-mono text-purple-300 uppercase tracking-wider mb-1">
                  Why it survived & appears reusable:
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  "{item.reusability_reason}"
                </p>
              </div>

              {/* Location & Dependencies */}
              <div className="space-y-2 text-xs font-mono mb-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <FileCode className="w-4 h-4 text-purple-400 shrink-0" />
                  <span className="text-slate-500">Location:</span>
                  <code className="text-purple-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 truncate">
                    {item.file_location}
                  </code>
                </div>

                {item.dependencies?.length > 0 && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="text-slate-500">Dependencies:</span>
                    <div className="flex flex-wrap gap-1">
                      {item.dependencies.map((dep, dIdx) => (
                        <span key={dIdx} className="text-[10px] bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800">
                          {dep}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Suggested Reuse Box */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-emerald-400/90 font-mono uppercase">Suggested Reuse:</span>
                <p className="text-xs font-medium text-slate-200 mt-0.5">
                  {item.suggested_reuse}
                </p>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Bottom CTA Banner */}
      <div className="cemetery-glass p-6 rounded-2xl border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-950">
        <div>
          <h3 className="text-base font-bold font-mono text-slate-100 uppercase">
            Ready to integrate these survivors?
          </h3>
          <p className="text-xs text-slate-400">
            Generate an AI Resurrection Plan mapping how to stitch these components into a brand-new application.
          </p>
        </div>

        <button
          onClick={onResurrectClick}
          className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-950 flex items-center gap-2 shrink-0"
        >
          <Zap className="w-4 h-4 text-yellow-400" />
          Generate Resurrection Plan →
        </button>
      </div>

    </div>
  );
}
