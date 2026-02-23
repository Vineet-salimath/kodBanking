/**
 * SupportOverlay.jsx
 * Full-screen premium AI support overlay.
 * Wraps existing chatWithAI API — does NOT modify routes or auth.
 * Left sidebar = history, main = conversation, bottom = input.
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { chatWithAI } from '../services/api';

const QUICK = [
  'What is a savings account?',
  'How to transfer money?',
  'Explain fixed deposit',
  'What is net banking?',
  'Tell me about UPI payments',
  'How does interest work?',
];

const TypingDots = () => (
  <span className="inline-flex items-center gap-1.5">
    {[0, 1, 2].map(i => (
      <span key={i} className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce"
        style={{ animationDelay: `${i * 0.15}s` }} />
    ))}
  </span>
);

export default function SupportOverlay({ open, onClose }) {
  const INIT_MSG = {
    id: 'welcome', role: 'ai',
    text: "👋 Hi! I'm Kodbank's AI assistant powered by Llama 3.1. Ask me anything about banking — savings, transfers, loans, investments, and more!",
  };

  const [messages,  setMessages]  = useState([INIT_MSG]);
  const [input,     setInput]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [history,   setHistory]   = useState([{ id: 'h1', label: 'General Banking' }]);
  const [copied,    setCopied]    = useState(null);
  const bottomRef                 = useRef(null);
  const textareaRef               = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open) setTimeout(() => textareaRef.current?.focus(), 300);
  }, [open]);

  const send = useCallback(async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;
    setInput('');

    const userMsg = { id: Date.now(), role: 'user', text: userText };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const { data } = await chatWithAI(userText);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: data.response }]);

      // Add to sidebar history (simplified)
      setHistory(prev => {
        const label = userText.slice(0, 28) + (userText.length > 28 ? '…' : '');
        const exists = prev.some(h => h.label === label);
        return exists ? prev : [{ id: Date.now(), label }, ...prev].slice(0, 8);
      });
    } catch (err) {
      const msg = err.message?.includes('503') ? 'AI warming up — retry in 20s' : err.message || 'AI unavailable';
      toast.error(msg);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: `⚠️ ${msg}`, isError: true }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading]);

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const copyMsg = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const regenerate = () => {
    const lastUser = [...messages].reverse().find(m => m.role === 'user');
    if (lastUser) {
      setMessages(prev => prev.slice(0, -1));
      send(lastUser.text);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 cursor-pointer"
            style={{ backdropFilter: 'blur(24px)', backgroundColor: 'rgba(14,14,18,0.85)' }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="relative z-10 flex w-full max-w-5xl mx-auto my-6 rounded-2xl overflow-hidden"
            style={{ border: '1px solid #26262a', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}
            initial={{ scale: 0.93, opacity: 0, y: 24 }}
            animate={{ scale: 1,    opacity: 1, y: 0  }}
            exit={{   scale: 0.93, opacity: 0, y: 24  }}
            transition={{ type: 'spring', stiffness: 240, damping: 24 }}
          >
            {/* ── LEFT SIDEBAR ─────────────────────────────────────────── */}
            <div
              className="hidden md:flex flex-col w-64 flex-shrink-0 border-r"
              style={{ background: 'rgba(14,14,18,0.95)', borderColor: '#26262a' }}
            >
              {/* Sidebar header */}
              <div className="p-4 border-b" style={{ borderColor: '#26262a' }}>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                    style={{ background: 'linear-gradient(135deg, #9333ea, #3b82f6)' }}>
                    🤖
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">Kodbank AI</p>
                    <p className="text-green-400 text-[10px] flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse inline-block" />
                      Online
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => { setMessages([INIT_MSG]); setInput(''); }}
                  className="w-full text-xs py-2 rounded-xl text-purple-300 font-medium transition-all duration-200"
                  style={{ background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.25)' }}
                >
                  + New Chat
                </button>
              </div>

              {/* History */}
              <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-hide">
                <p className="text-[10px] text-slate-600 uppercase tracking-widest px-2 mb-2">History</p>
                {history.map(h => (
                  <div key={h.id}
                    className="px-3 py-2 rounded-lg text-xs text-slate-400 cursor-pointer hover:text-white transition-colors truncate"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                  >
                    💬 {h.label}
                  </div>
                ))}
              </div>

              {/* File upload note */}
              <div className="p-4 border-t" style={{ borderColor: '#26262a' }}>
                <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer hover:text-slate-300 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  Attach document
                  <input type="file" className="hidden" accept=".pdf,.csv,.txt"
                    onChange={() => toast('Document upload coming soon', { icon: '📎' })} />
                </label>
              </div>
            </div>

            {/* ── MAIN CHAT AREA ───────────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0" style={{ background: 'rgba(22,22,26,0.95)' }}>
              {/* Chat header */}
              <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
                style={{ borderColor: '#26262a' }}>
                <div>
                  <h3 className="text-white font-semibold">Kodbank AI Support</h3>
                  <p className="text-slate-500 text-xs mt-0.5">Powered by Llama 3.1 8B · Ask anything</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="glass-icon-btn"
                    onClick={() => toast('Search coming soon', { icon: '🔍' })}
                    title="Search conversation"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                  <button className="glass-icon-btn" onClick={onClose}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                <AnimatePresence initial={false}>
                  {messages.map(msg => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-3`}
                    >
                      {msg.role === 'ai' && (
                        <div className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center text-base mt-0.5"
                          style={{ background: 'linear-gradient(135deg, #9333ea, #3b82f6)' }}>
                          🤖
                        </div>
                      )}

                      <div className="group relative max-w-[75%]">
                        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                          msg.role === 'user'
                            ? 'text-white rounded-br-sm'
                            : msg.isError
                            ? 'text-red-300 rounded-bl-sm'
                            : 'text-slate-200 rounded-bl-sm'
                        }`}
                          style={msg.role === 'user'
                            ? { background: 'linear-gradient(135deg, #9333ea, #4f46e5)', boxShadow: '0 4px 16px rgba(147,51,234,0.35)' }
                            : msg.isError
                            ? { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }
                            : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }
                          }
                        >
                          {msg.text}
                        </div>

                        {/* AI message controls */}
                        {msg.role === 'ai' && !msg.isError && (
                          <div className="flex items-center gap-2 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => copyMsg(msg.text, msg.id)}
                              className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-purple-400 transition-colors"
                            >
                              {copied === msg.id ? (
                                <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg> Copied</>
                              ) : (
                                <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg> Copy</>
                              )}
                            </button>
                            <button
                              onClick={regenerate}
                              disabled={loading}
                              className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-purple-400 transition-colors disabled:opacity-40"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Regenerate
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {loading && (
                    <motion.div
                      key="typing"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-base"
                        style={{ background: 'linear-gradient(135deg, #9333ea, #3b82f6)' }}>
                        🤖
                      </div>
                      <div className="px-4 py-3 rounded-2xl rounded-bl-sm"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <TypingDots />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={bottomRef} />
              </div>

              {/* Quick questions */}
              <div className="px-6 pb-2 flex gap-2 overflow-x-auto scrollbar-hide flex-shrink-0">
                {QUICK.map(q => (
                  <button key={q} onClick={() => send(q)} disabled={loading}
                    className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full transition-colors duration-200 disabled:opacity-40"
                    style={{ border: '1px solid rgba(168,85,247,0.3)', color: '#d8b4fe', background: 'rgba(168,85,247,0.08)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(168,85,247,0.18)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(168,85,247,0.08)'}
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Input bar */}
              <div className="px-6 pb-6 pt-2 flex-shrink-0">
                <div className="flex gap-3 items-end p-3 rounded-2xl"
                  style={{ background: 'rgba(38,38,42,0.8)', border: '1px solid #26262a' }}
                >
                  {/* File attach */}
                  <label className="flex-shrink-0 glass-icon-btn cursor-pointer mb-0.5" title="Attach file">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <input type="file" className="hidden"
                      onChange={() => toast('File upload coming soon', { icon: '📎' })} />
                  </label>

                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Ask about savings, transfers, loans, investments…"
                    rows={1}
                    disabled={loading}
                    className="flex-1 resize-none bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
                    style={{ maxHeight: '120px' }}
                  />

                  <button
                    onClick={() => send()}
                    disabled={!input.trim() || loading}
                    className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl text-white disabled:opacity-40 transition-all duration-200 mb-0.5"
                    style={{ background: 'linear-gradient(135deg, #9333ea, #3b82f6)' }}
                    title="Send"
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-600 mt-1.5 text-center">Enter to send · Shift+Enter for new line</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
