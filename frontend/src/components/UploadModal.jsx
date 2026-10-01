import React, { useState } from 'react';
import { Upload, X, FileArchive, Loader2, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';
import { uploadProjectZip } from '../services/api';

export default function UploadModal({ isOpen, onClose, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (!selected.name.endsWith('.zip')) {
        setError('Please select a valid .ZIP archive of your project repository.');
        return;
      }
      setFile(selected);
      setError(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) {
      if (!dropped.name.endsWith('.zip')) {
        setError('Please drop a valid .ZIP archive.');
        return;
      }
      setFile(dropped);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    setStep(1);

    try {
      // Animated step indicator simulation for realistic hackathon experience
      setTimeout(() => setStep(2), 700);
      setTimeout(() => setStep(3), 1500);

      const result = await uploadProjectZip(file);

      setTimeout(() => {
        setUploading(false);
        setStep(0);
        setFile(null);
        onUploadSuccess(result.project_id);
      }, 2200);

    } catch (err) {
      setUploading(false);
      setStep(0);
      setError(err.message || 'Failed to upload and analyze project archive.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="cemetery-glass border border-purple-500/30 rounded-2xl w-full max-w-lg p-6 relative shadow-[0_0_50px_rgba(168,85,247,0.3)] animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={uploading}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-1 rounded-lg bg-slate-900/60"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black uppercase font-mono tracking-wide text-slate-100">
              Bury a Project
            </h2>
            <p className="text-xs text-purple-300/80">
              Upload a ZIP archive to perform an AI forensic autopsy.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {!uploading ? (
          <div>
            {/* Drag and Drop Zone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-purple-500/30 hover:border-purple-400 rounded-2xl p-8 text-center bg-slate-950/60 transition-all cursor-pointer group mb-5"
            >
              <input
                type="file"
                accept=".zip"
                onChange={handleFileChange}
                className="hidden"
                id="zip-input"
              />
              <label htmlFor="zip-input" className="cursor-pointer block">
                <FileArchive className="w-12 h-12 text-purple-400/70 group-hover:text-purple-300 group-hover:scale-110 transition-all mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-200 mb-1">
                  {file ? file.name : "Drag & Drop project ZIP here"}
                </p>
                <p className="text-xs text-slate-400">
                  or <span className="text-purple-400 underline">browse files</span> from your computer
                </p>
                <p className="text-[10px] text-slate-500 mt-3 font-mono">
                  (Automatically ignores node_modules, .git objects, binaries & secrets)
                </p>
              </label>
            </div>

            {/* Submit Action */}
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!file}
                className="px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white disabled:opacity-40 shadow-lg shadow-purple-950 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-purple-200" />
                ANALYZE REPOSITORY
              </button>
            </div>
          </div>
        ) : (
          /* Upload & AI Analysis Progress Steps */
          <div className="py-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-purple-950/80 border border-purple-500/50 flex items-center justify-center mx-auto text-purple-300 shadow-[0_0_30px_rgba(168,85,247,0.4)] animate-pulse">
              <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
            </div>

            <div>
              <h3 className="text-base font-bold font-mono text-slate-100 uppercase mb-1">
                Performing AI Forensic Autopsy...
              </h3>
              <p className="text-xs text-purple-300">
                Scanning code structures, TODO debt, and surviving modules.
              </p>
            </div>

            {/* Step Progress Bar */}
            <div className="space-y-3 max-w-sm mx-auto text-left text-xs font-mono">
              <div className={`flex items-center gap-2 transition-opacity ${step >= 1 ? 'text-emerald-400' : 'text-slate-600'}`}>
                <CheckCircle2 className="w-4 h-4" />
                <span>1. Safely extracting ZIP & scanning file tree</span>
              </div>
              <div className={`flex items-center gap-2 transition-opacity ${step >= 2 ? 'text-emerald-400' : 'text-slate-600'}`}>
                <CheckCircle2 className="w-4 h-4" />
                <span>2. Detecting TODOs, API routes & dependency schemas</span>
              </div>
              <div className={`flex items-center gap-2 transition-opacity ${step >= 3 ? 'text-emerald-400' : 'text-slate-600'}`}>
                <CheckCircle2 className="w-4 h-4 animate-spin" />
                <span>3. Running AI Autopsy & identifying reusable survivors</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
