import React from 'react';
import { X, Upload, Skull, ShieldCheck, Zap } from 'lucide-react';

export default function HowItWorksModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="cemetery-glass border border-purple-500/30 rounded-2xl w-full max-w-2xl p-6 sm:p-8 relative shadow-[0_0_50px_rgba(168,85,247,0.3)] animate-in fade-in zoom-in duration-200">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-1.5 rounded-lg bg-slate-900"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-black uppercase font-mono tracking-wide text-slate-100 mb-2">
          How Project Cemetery Works
        </h2>
        <p className="text-xs text-purple-300 font-mono mb-6">
          Turn your unfinished software graveyard into usable code and innovative hackathon concepts.
        </p>

        <div className="space-y-4 text-xs font-mono">
          
          <div className="bg-slate-950/80 p-4 rounded-xl border border-purple-900/40 flex items-start gap-4">
            <div className="w-8 h-8 rounded-lg bg-purple-950 border border-purple-500/40 text-purple-400 flex items-center justify-center shrink-0 font-bold">
              1
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm mb-1 flex items-center gap-2">
                <Upload className="w-4 h-4 text-purple-400" />
                Upload Repository ZIP
              </h3>
              <p className="text-slate-400 font-sans text-xs leading-relaxed">
                Upload any abandoned project archive. The engine safely extracts files, strips bloat (node_modules, .git objects, binaries), and builds a structured structural summary.
              </p>
            </div>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-purple-900/40 flex items-start gap-4">
            <div className="w-8 h-8 rounded-lg bg-purple-950 border border-purple-500/40 text-purple-400 flex items-center justify-center shrink-0 font-bold">
              2
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm mb-1 flex items-center gap-2">
                <Skull className="w-4 h-4 text-purple-400" />
                AI Forensic Autopsy & DNA Breakdown
              </h3>
              <p className="text-slate-400 font-sans text-xs leading-relaxed">
                AI evaluates observed repository facts (TODO counts, broken backend endpoints, unwritten routes, test coverage) to explain why the project died without making speculative claims.
              </p>
            </div>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-purple-900/40 flex items-start gap-4">
            <div className="w-8 h-8 rounded-lg bg-purple-950 border border-purple-500/40 text-purple-400 flex items-center justify-center shrink-0 font-bold">
              3
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm mb-1 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Extract Reusable Survivors
              </h3>
              <p className="text-slate-400 font-sans text-xs leading-relaxed">
                Identifies surviving JWT auth middleware, database schemas, API routes, and React UI components that can be extracted cleanly into your next project.
              </p>
            </div>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-purple-900/40 flex items-start gap-4">
            <div className="w-8 h-8 rounded-lg bg-purple-950 border border-purple-500/40 text-purple-400 flex items-center justify-center shrink-0 font-bold">
              4
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm mb-1 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                Resurrection & Frankenstein Mode
              </h3>
              <p className="text-slate-400 font-sans text-xs leading-relaxed">
                Generate an architectural resurrection blueprint for a single project, OR stitch 2–4 dead projects together in Frankenstein Mode to forge a winning hackathon hybrid app.
              </p>
            </div>
          </div>

        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-lg"
          >
            Got it! Enter Cemetery →
          </button>
        </div>

      </div>
    </div>
  );
}
