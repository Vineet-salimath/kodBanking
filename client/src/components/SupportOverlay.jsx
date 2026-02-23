/**
 * SupportOverlay.jsx — ChatGPT-style AI support overlay for Kodbank.
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { chatWithAI } from '../services/api';

/* ── Suggestion chips for empty/hero state ─────────────────── */
const SUGGESTIONS = [
  { label: 'What is a savings account?',   icon: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg> },
  { label: 'How to transfer money?',        icon: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M7 17l10-10M17 7H7v10"/></svg> },
  { label: 'Explain fixed deposit',         icon: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12h8M12 8v8"/></svg> },
  { label: 'What is net banking?',          icon: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg> },
  { label: 'Tell me about UPI payments',    icon: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg> },
  { label: 'How does loan interest work?',  icon: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 2v20M17 7H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg> },
];

/* ── AI avatar ─────────────────────────────────────────────── */
const AIAvatar = ({ size = 32 }) => (
  <div style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0,
    background: 'linear-gradient(135deg,#9333ea,#3b82f6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none"
      stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 017 4.5v0A2.5 2.5 0 019.5 7h5A2.5 2.5 0 0117 4.5v0A2.5 2.5 0 0114.5 2h-5z"/>
      <path d="M6 7h12a2 2 0 012 2v8a4 4 0 01-4 4H8a4 4 0 01-4-4V9a2 2 0 012-2z"/>
      <circle cx="9" cy="13" r="1.2" fill="white" stroke="none"/>
      <circle cx="15" cy="13" r="1.2" fill="white" stroke="none"/>
    </svg>
  </div>
);

/* ── Typing dots ───────────────────────────────────────────── */
const TypingDots = () => (
  <span className="inline-flex items-center gap-1.5">
    {[0, 1, 2].map(i => (
      <span key={i} className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"
        style={{ animationDelay: `${i * 0.15}s` }} />
    ))}
  </span>
);

/* ═══════════════════════════════════════════════════════════ */
export default function SupportOverlay({ open, onClose }) {
  const [messages,  setMessages]  = useState([]);
  const [input,     setInput]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [history,   setHistory]   = useState([{ id: 'h1', label: 'General Banking' }]);
  const [copied,    setCopied]    = useState(null);
  const bottomRef                 = useRef(null);
  const textareaRef               = useRef(null);
  const hasMessages               = messages.length > 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open) setTimeout(() => textareaRef.current?.focus(), 300);
  }, [open]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 140) + 'px';
  };

  const send = useCallback(async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    const userMsg = { id: Date.now(), role: 'user', text: userText };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const { data } = await chatWithAI(userText);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: data.response }]);
      setHistory(prev => {
        const label = userText.slice(0, 30) + (userText.length > 30 ? '…' : '');
        return [{ id: Date.now(), label }, ...prev.filter(h => h.label !== label)].slice(0, 8);
      });
    } catch (err) {
      const msg = err.message?.includes('503') ? 'AI warming up — retry in 20s' : err.message || 'AI unavailable';
      toast.error(msg);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: msg, isError: true }]);
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
    if (lastUser) { setMessages(prev => prev.slice(0, -1)); send(lastUser.text); }
  };

  const startNewChat = () => {
    setMessages([]);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 cursor-pointer"
            style={{ backdropFilter: 'blur(20px)', backgroundColor: 'rgba(8,8,12,0.9)' }}
            onClick={onClose}
          />

          {/* Main panel */}
          <motion.div
            className="relative z-10 flex w-full max-w-5xl rounded-2xl overflow-hidden"
            style={{
              height: 'min(calc(100vh - 48px), 760px)',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(147,51,234,0.08)',
              background: '#0f0f13',
            }}
            initial={{ scale: 0.94, opacity: 0, y: 28 }}
            animate={{ scale: 1,    opacity: 1, y: 0  }}
            exit={{   scale: 0.94, opacity: 0, y: 28  }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          >
            {/* ── LEFT SIDEBAR ─────────────────────────────── */}
            <div className="hidden md:flex flex-col w-60 flex-shrink-0 border-r"
              style={{ background: '#080810', borderColor: 'rgba(255,255,255,0.06)' }}>

              <div className="p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,#9333ea,#3b82f6)' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9.5 2A2.5 2.5 0 017 4.5v0A2.5 2.5 0 019.5 7h5A2.5 2.5 0 0117 4.5v0A2.5 2.5 0 0114.5 2h-5z"/>
                      <path d="M6 7h12a2 2 0 012 2v8a4 4 0 01-4 4H8a4 4 0 01-4-4V9a2 2 0 012-2z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold leading-tight">Kodbank AI</p>
                    <p className="text-[10px] flex items-center gap-1 mt-0.5" style={{ color: '#4ade80' }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                      Online
                    </p>
                  </div>
                </div>
                <button onClick={startNewChat}
                  className="w-full text-xs py-2.5 rounded-xl font-medium transition-all duration-200"
                  style={{ background: 'linear-gradient(135deg,rgba(147,51,234,0.18),rgba(59,130,246,0.1))', border: '1px solid rgba(168,85,247,0.22)', color: '#c4b5fd' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  + New Chat
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-0.5" style={{ scrollbarWidth: 'none' }}>
                <p className="text-[10px] uppercase tracking-widest px-2 py-2 font-medium" style={{ color: '#3d3d4d' }}>History</p>
                {history.map(h => (
                  <div key={h.id}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs cursor-pointer transition-all duration-150"
                    style={{ color: '#55556a' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#d1d5db'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#55556a'; }}
                  >
                    <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                    </svg>
                    <span className="truncate">{h.label}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <label className="flex items-center gap-2 text-xs cursor-pointer transition-colors"
                  style={{ color: '#3d3d4d' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#9ca3af'}
                  onMouseLeave={e => e.currentTarget.style.color = '#3d3d4d'}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
                  </svg>
                  Attach document
                  <input type="file" className="hidden" accept=".pdf,.csv,.txt"
                    onChange={() => toast('Document upload coming soon')} />
                </label>
              </div>
            </div>

            {/* ── MAIN AREA ────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0">

              {/* Header — search button removed */}
              <div className="flex items-center justify-between px-6 py-3.5 border-b flex-shrink-0"
                style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div>
                  <h3 className="text-white font-semibold text-sm">Kodbank AI Support</h3>
                  <p className="text-xs mt-0.5" style={{ color: '#44445a' }}>Powered by Llama 3.1 8B · Ask anything</p>
                </div>
                <button onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-xl transition-colors hover:bg-white/5"
                  style={{ color: '#55556a', border: '1px solid rgba(255,255,255,0.07)' }}
                  title="Close">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              {/* ── BODY: hero when empty, chat when messages exist ── */}
              <AnimatePresence mode="wait">

                {/* EMPTY / HERO STATE */}
                {!hasMessages && (
                  <motion.div key="hero"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.28 }}
                    className="flex-1 flex flex-col items-center justify-center px-6 pb-6"
                  >
                    {/* Orb icon */}
                    <div className="relative mb-5">
                      <div className="absolute inset-0 rounded-full blur-3xl opacity-35"
                        style={{ background: 'radial-gradient(circle,#9333ea,#3b82f6)', transform: 'scale(1.8)' }} />
                      <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg,#9333ea,#3b82f6)', boxShadow: '0 8px 36px rgba(147,51,234,0.5)' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9.5 2A2.5 2.5 0 017 4.5v0A2.5 2.5 0 019.5 7h5A2.5 2.5 0 0117 4.5v0A2.5 2.5 0 0114.5 2h-5z"/>
                          <path d="M6 7h12a2 2 0 012 2v8a4 4 0 01-4 4H8a4 4 0 01-4-4V9a2 2 0 012-2z"/>
                          <circle cx="9" cy="13" r="1.2" fill="white" stroke="none"/>
                          <circle cx="15" cy="13" r="1.2" fill="white" stroke="none"/>
                        </svg>
                      </div>
                    </div>

                    <h2 className="text-[22px] font-bold text-white mb-2 tracking-tight">How can I help you?</h2>
                    <p className="text-sm mb-8 text-center max-w-sm leading-relaxed" style={{ color: '#55556a' }}>
                      Ask me anything about banking — savings, transfers, loans, investments, and more.
                    </p>

                    {/* Suggestion grid */}
                    <div className="grid grid-cols-2 gap-2.5 w-full max-w-lg">
                      {SUGGESTIONS.map(s => (
                        <button key={s.label} onClick={() => send(s.label)} disabled={loading}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm transition-all duration-200 disabled:opacity-40"
                          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#c9cad4' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(147,51,234,0.1)'; e.currentTarget.style.borderColor = 'rgba(168,85,247,0.3)'; e.currentTarget.style.color = '#fff'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#c9cad4'; }}
                        >
                          <span style={{ color: '#a78bfa', flexShrink: 0 }}>{s.icon}</span>
                          <span className="leading-snug">{s.label}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* CHAT STATE */}
                {hasMessages && (
                  <motion.div key="chat"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.18 }}
                    className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
                    style={{ scrollbarWidth: 'thin', scrollbarColor: '#2a2a35 transparent' }}
                  >
                    <AnimatePresence initial={false}>
                      {messages.map(msg => (
                        <motion.div key={msg.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.22 }}
                          className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          {msg.role === 'ai' && <AIAvatar size={32} />}

                          <div className="group relative max-w-[78%]">
                            <div className="px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap"
                              style={msg.role === 'user'
                                ? { background: 'linear-gradient(135deg,#9333ea,#4f46e5)', color: '#fff', borderRadius: '18px 18px 4px 18px', boxShadow: '0 4px 20px rgba(147,51,234,0.28)' }
                                : msg.isError
                                ? { background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5', borderRadius: '4px 18px 18px 18px' }
                                : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', color: '#e5e7eb', borderRadius: '4px 18px 18px 18px' }
                              }
                            >
                              {msg.text}
                            </div>

                            {msg.role === 'ai' && !msg.isError && (
                              <div className="flex items-center gap-3 mt-1.5 px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                <button onClick={() => copyMsg(msg.text, msg.id)}
                                  className="flex items-center gap-1 text-[10px] transition-colors"
                                  style={{ color: '#4b5563' }}
                                  onMouseEnter={e => e.currentTarget.style.color = '#a78bfa'}
                                  onMouseLeave={e => e.currentTarget.style.color = '#4b5563'}>
                                  {copied === msg.id
                                    ? <><svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg> Copied</>
                                    : <><svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg> Copy</>
                                  }
                                </button>
                                <button onClick={regenerate} disabled={loading}
                                  className="flex items-center gap-1 text-[10px] transition-colors disabled:opacity-30"
                                  style={{ color: '#4b5563' }}
                                  onMouseEnter={e => e.currentTarget.style.color = '#a78bfa'}
                                  onMouseLeave={e => e.currentTarget.style.color = '#4b5563'}>
                                  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                                  </svg>
                                  Regenerate
                                </button>
                              </div>
                            )}
                          </div>

                          {msg.role === 'user' && (
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5"
                              style={{ background: 'linear-gradient(135deg,#475569,#334155)' }}>
                              U
                            </div>
                          )}
                        </motion.div>
                      ))}

                      {loading && (
                        <motion.div key="typing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className="flex items-start gap-3">
                          <AIAvatar size={32} />
                          <div className="px-4 py-3.5 rounded-2xl"
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px 18px 18px 18px' }}>
                            <TypingDots />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div ref={bottomRef} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── INPUT BAR ────────────────────────────────── */}
              <div className="px-6 pb-5 pt-3 flex-shrink-0"
                style={{ borderTop: hasMessages ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <div className="flex items-end gap-3 px-4 py-3 rounded-2xl transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {/* Attach */}
                  <label className="flex-shrink-0 mb-0.5 cursor-pointer" style={{ color: '#44445a' }} title="Attach file"
                    onMouseEnter={e => e.currentTarget.style.color = '#9ca3af'}
                    onMouseLeave={e => e.currentTarget.style.color = '#44445a'}>
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
                    </svg>
                    <input type="file" className="hidden" onChange={() => toast('File upload coming soon')} />
                  </label>

                  <textarea ref={textareaRef} value={input}
                    onChange={handleInputChange} onKeyDown={handleKey}
                    placeholder="Ask about savings, transfers, loans, investments…"
                    rows={1} disabled={loading}
                    className="flex-1 resize-none bg-transparent text-sm focus:outline-none placeholder-slate-600"
                    style={{ color: '#f3f4f6', caretColor: '#a78bfa', maxHeight: '140px', lineHeight: '1.55' }}
                  />

                  <button onClick={() => send()} disabled={!input.trim() || loading}
                    className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl text-white transition-all duration-200 mb-0.5"
                    style={{
                      background: input.trim() ? 'linear-gradient(135deg,#9333ea,#4f46e5)' : 'rgba(255,255,255,0.06)',
                      boxShadow: input.trim() ? '0 4px 18px rgba(147,51,234,0.38)' : 'none',
                      opacity: (!input.trim() && !loading) ? 0.4 : 1,
                    }} title="Send">
                    {loading
                      ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                        </svg>
                    }
                  </button>
                </div>
                <p className="text-center text-xs mt-2" style={{ color: '#2d2d3a' }}>
                  Enter to send · Shift+Enter for new line
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

