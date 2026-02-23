import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { chatWithAI } from '../services/api';

const QUICK_QUESTIONS = [
  'What is a savings account?',
  'How to transfer money?',
  'Explain fixed deposit',
  'What is net banking?',
  'How does KodBank keep my money safe?',
];

const TypingDots = () => (
  <span className="inline-flex items-center gap-1">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"
        style={{ animationDelay: `${i * 0.15}s` }}
      />
    ))}
  </span>
);

export default function AIChat() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'ai',
      text: "👋 Hi! I'm KodBank's AI assistant. Ask me anything about banking — savings accounts, fixed deposits, transfers, and more!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;

    setInput('');
    const userMsg = { id: Date.now(), role: 'user', text: userText };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const { data } = await chatWithAI(userText);
      const aiMsg = { id: Date.now() + 1, role: 'ai', text: data.response };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errMsg =
        err.message?.includes('warming up') || err.message?.includes('503')
          ? 'AI model is warming up. Please wait 20 seconds and try again.'
          : err.message || 'AI service unavailable';
      toast.error(errMsg);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'ai', text: `⚠️ ${errMsg}`, isError: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="glass-card flex flex-col" style={{ height: '520px' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-lg shadow-lg shadow-indigo-500/30">
          🤖
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">KodBank AI Assistant</h3>
          <p className="text-xs text-slate-500">Powered by Llama 3.1 8B · Ask me about banking</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-green-400">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Online
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-0.5">
                  🤖
                </div>
              )}
              <div
                className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-br-sm'
                    : msg.isError
                    ? 'bg-red-500/10 border border-red-500/20 text-red-300 rounded-bl-sm'
                    : 'bg-white/8 border border-white/10 text-slate-200 rounded-bl-sm'
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}

          {loading && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-start items-center gap-2"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-sm flex-shrink-0">
                🤖
              </div>
              <div className="bg-white/8 border border-white/10 px-4 py-3 rounded-2xl rounded-bl-sm">
                <TypingDots />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Quick questions */}
      <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
        {QUICK_QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => sendMessage(q)}
            disabled={loading}
            className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full border border-indigo-500/30 text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-2">
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about savings, transfers, loans…"
            rows={1}
            disabled={loading}
            className="flex-1 resize-none input-field py-2.5 text-sm"
            style={{ maxHeight: '96px' }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:from-indigo-400 hover:to-violet-400 transition-all duration-200 flex-shrink-0"
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
        <p className="text-xs text-slate-600 mt-1.5 text-center">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
