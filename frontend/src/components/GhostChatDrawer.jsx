import React, { useState, useRef, useEffect } from 'react';
import { Ghost, Send, X, Sparkles, MessageSquare, Loader2, Bot, User } from 'lucide-react';
import { sendGhostChatMessage } from '../services/api';

export default function GhostChatDrawer({ projectId, projectName }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ghost',
      text: `👻 *Floating around the code grave* Boo! I am the sassy digital ghost haunting '${projectName || 'this project'}'. Ask me why I died, ask about my surviving code, or apologize for abandoning me!`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const msg = textToSend || input;
    if (!msg.trim() || !projectId) return;

    const userMsg = { sender: 'user', text: msg };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const recentHistory = messages.slice(-6).map(m => ({ sender: m.sender, text: m.text }));
      const res = await sendGhostChatMessage(projectId, msg, recentHistory);
      const ghostReply = { sender: 'ghost', text: res.reply };
      setMessages(prev => [...prev, ghostReply]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ghost', text: '👻 *Rattles digital chains* My spectral server link flickered... try asking again!' }]);
    } finally {
      setLoading(false);
    }
  };

  const PROMPT_CHIPS = [
    "Why did this project die?",
    "How do I reuse your auth code?",
    "Be honest, was my code bad?",
    "What survived in this codebase?"
  ];

  return (
    <>
      {/* Floating Ghost Drawer Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full bg-gradient-to-r from-purple-700 via-indigo-600 to-violet-700 hover:from-purple-600 hover:to-indigo-500 text-white shadow-[0_0_30px_rgba(168,85,247,0.5)] border border-purple-400/50 flex items-center gap-2.5 transform hover:scale-105 active:scale-95 transition-all group font-mono text-xs font-bold"
        title="Talk to the Project Ghost"
      >
        <Ghost className="w-5 h-5 text-purple-200 group-hover:rotate-12 transition-transform animate-bounce" />
        <span className="hidden sm:inline">TALK TO PROJECT GHOST</span>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
      </button>

      {/* Floating Sassy Ghost Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-full max-w-md cemetery-glass border border-purple-400/50 rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.4)] overflow-hidden flex flex-col h-[520px] animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-950 p-4 border-b border-purple-900/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-900/80 border border-purple-400/60 flex items-center justify-center text-purple-300 shadow-md">
                <Ghost className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-black font-mono uppercase text-slate-100 flex items-center gap-1.5">
                  The Ghost of {projectName}
                </h3>
                <p className="text-[10px] text-purple-300/80 font-mono">
                  Sassy Code Spectre • Haunting Repository Logs
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-100 p-1 rounded-lg bg-slate-900/80"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompt Chips */}
          <div className="bg-slate-950/90 p-2.5 border-b border-slate-800 flex gap-1.5 overflow-x-auto text-[11px] font-mono">
            {PROMPT_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                disabled={loading}
                className="px-2.5 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900/80 border border-purple-800/50 text-purple-300 shrink-0 transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Message Thread */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-950/60 text-xs font-sans">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ghost' && (
                  <div className="w-6 h-6 rounded-full bg-purple-950 border border-purple-500/40 text-purple-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Ghost className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-purple-600 text-white rounded-tr-none font-medium shadow-md'
                      : 'bg-slate-900/90 border border-purple-900/40 text-slate-200 rounded-tl-none font-mono text-[11.5px]'
                  }`}
                >
                  {m.text}
                </div>

                {m.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-500/40 text-indigo-300 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-purple-300 font-mono text-xs p-2">
                <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                <span>The Ghost is formulating a sassy response...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask the project ghost anything..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-purple-400 font-mono"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-40 transition-colors flex items-center justify-center"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}
    </>
  );
}
