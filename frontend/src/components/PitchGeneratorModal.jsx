import React, { useState, useEffect } from 'react';
import { Mic, X, Copy, Check, Sparkles, Presentation, MessageSquare, CheckSquare, Clock, Loader2 } from 'lucide-react';
import { generateHackathonPitch } from '../services/api';

export default function PitchGeneratorModal({ isOpen, onClose, projectId, projectName }) {
  const [loading, setLoading] = useState(false);
  const [pitch, setPitch] = useState(null);
  const [copiedSection, setCopiedSection] = useState(null);

  useEffect(() => {
    if (isOpen && !pitch && projectId && !loading) {
      handleGenerate();
    }
  }, [isOpen, projectId]);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const res = await generateHackathonPitch(projectId);
      setPitch(res.pitch);
    } catch (err) {
      console.error('Failed to generate pitch:', err);
    } finally {
      setLoading(false);
    }
  };


  const handleCopyText = (text, sectionKey) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="cemetery-glass border border-purple-400/50 rounded-2xl w-full max-w-4xl p-6 sm:p-8 relative shadow-[0_0_60px_rgba(168,85,247,0.4)] my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-1.5 rounded-lg bg-slate-900 border border-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-purple-950 border border-purple-400/60 flex items-center justify-center text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
            <Mic className="w-6 h-6 text-purple-400 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase font-mono tracking-wider text-slate-100 flex items-center gap-2">
              🎤 HACKATHON PITCH DECK & SCRIPT GENERATOR
            </h2>
            <p className="text-xs text-purple-300 font-mono">
              AI-generated 1-minute elevator pitch, slide deck outlines, judge Q&A prep, and winning demo sequence for {projectName}.
            </p>
          </div>
        </div>

        {!pitch ? (
          <div className="text-center py-12 space-y-4">
            {loading ? (
              <div className="flex flex-col items-center gap-3 text-purple-300 font-mono text-xs">
                <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                <span className="font-bold uppercase tracking-wider">Formulating winning pitch deck, elevator pitch & judge Q&A prep...</span>
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-400 max-w-md mx-auto font-mono">
                  Click below to generate a pitch deck outline, judge Q&A prep script, and 20-second demo sequence.
                </p>

                <button
                  onClick={handleGenerate}
                  className="px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 text-white shadow-[0_0_30px_rgba(168,85,247,0.4)] flex items-center justify-center gap-2.5 mx-auto transform hover:scale-105 active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-purple-200" />
                  GENERATE PITCH KIT
                </button>
              </>
            )}
          </div>
        ) : (

          <div className="space-y-6 animate-in fade-in duration-300 font-sans text-xs">
            
            {/* 1. ELEVATOR PITCH SCRIPT */}
            <div className="bg-slate-950/90 p-5 rounded-2xl border border-purple-900/40 relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold font-mono uppercase text-purple-400 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  1-Minute Elevator Pitch Script (for Presentation)
                </span>

                <button
                  onClick={() => handleCopyText(pitch.elevator_pitch_1min, 'elevator')}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-1.5 transition-colors"
                >
                  {copiedSection === 'elevator' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied Script!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Script</span>
                    </>
                  )}
                </button>
              </div>

              <blockquote className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 italic leading-relaxed text-sm font-serif">
                "{pitch.elevator_pitch_1min}"
              </blockquote>
            </div>

            {/* 2. PITCH DECK SLIDES */}
            <div className="cemetery-glass p-5 rounded-2xl border border-purple-900/30">
              <span className="text-xs font-bold font-mono uppercase text-slate-200 mb-3 flex items-center gap-2">
                <Presentation className="w-4 h-4 text-emerald-400" />
                5-Slide Presentation Deck Outline
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mt-3">
                {pitch.pitch_deck_slides?.map((slide, idx) => (
                  <div key={idx} className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-purple-400 uppercase font-bold block mb-1">
                        Slide {slide.slide}
                      </span>
                      <h4 className="text-xs font-bold font-mono text-slate-100 mb-2">{slide.title}</h4>
                      <p className="text-[11px] text-slate-400 leading-normal">{slide.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. JUDGE Q&A PREP */}
            <div className="bg-slate-950/90 p-5 rounded-2xl border border-purple-900/40">
              <span className="text-xs font-bold font-mono uppercase text-amber-400 mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Hackathon Judge Q&A Prep (Anticipated Questions & Winning Answers)
              </span>

              <div className="space-y-3 mt-3">
                {pitch.judge_qna_prep?.map((qna, idx) => (
                  <div key={idx} className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                    <p className="text-xs font-bold font-mono text-purple-300 mb-1">
                      Q: "{qna.question}"
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      A: {qna.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. DEMO CHECKLIST */}
            <div className="bg-slate-950/90 p-5 rounded-2xl border border-emerald-900/40">
              <span className="text-xs font-bold font-mono uppercase text-emerald-400 mb-3 flex items-center gap-2">
                <CheckSquare className="w-4 h-4" />
                20-Second Winning Demo Sequence Checklist
              </span>

              <ul className="space-y-2 mt-3 font-mono text-xs text-slate-300">
                {pitch.demo_checklist?.map((item, idx) => (
                  <li key={idx} className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-lg"
              >
                Close Pitch Kit
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
