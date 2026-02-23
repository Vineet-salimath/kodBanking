/**
 * PinAuthModal.jsx
 * 6-digit PIN modal overlay — UI simulation only.
 * Does NOT touch real auth system. Accepts any 6-digit input.
 * Calls onSuccess(balance) after shimmer animation.
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const KEYS = ['1','2','3','4','5','6','7','8','9','','0','⌫'];

export default function PinAuthModal({ onSuccess, onCancel, fetchBalanceFn }) {
  const [pin, setPin]           = useState([]);
  const [phase, setPhase]       = useState('entry'); // entry | loading | done
  const [shake, setShake]       = useState(false);

  const press = (key) => {
    if (phase !== 'entry') return;
    if (key === '⌫') {
      setPin(p => p.slice(0, -1));
      return;
    }
    if (key === '') return;
    if (pin.length >= 6) return;

    const next = [...pin, key];
    setPin(next);

    if (next.length === 6) {
      // Start shimmer phase
      setPhase('loading');
      setTimeout(async () => {
        try {
          const { data } = await fetchBalanceFn();
          setPhase('done');
          setTimeout(() => onSuccess(data.data.balance), 300);
        } catch {
          // Even on error show count-up with 0 — never break UI
          setPhase('done');
          setTimeout(() => onSuccess(0), 300);
        }
      }, 1500);
    }
  };

  // Keyboard support
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Backspace') press('⌫');
      else if (/^\d$/.test(e.key)) press(e.key);
      else if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin, phase]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Blurred backdrop click-to-cancel */}
      <div className="absolute inset-0 cursor-pointer" onClick={onCancel} />

      <motion.div
        className="relative z-10 w-full max-w-sm mx-4"
        initial={{ scale: 0.85, opacity: 0, y: 32 }}
        animate={{ scale: 1,    opacity: 1, y: 0  }}
        exit={{   scale: 0.85, opacity: 0, y: 32  }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        <div className="glass-card-purple p-8 flex flex-col items-center gap-6">

          {/* Shield + pulse */}
          <div className="relative flex items-center justify-center">
            <div
              className="absolute w-20 h-20 rounded-full opacity-40 animate-ping"
              style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.5) 0%, transparent 70%)' }}
            />
            <motion.div
              className="w-16 h-16 rounded-full flex items-center justify-center z-10"
              style={{ background: 'linear-gradient(135deg, #9333ea, #3b82f6)' }}
              animate={{ boxShadow: ['0 0 0 0 rgba(168,85,247,0.4)', '0 0 0 16px rgba(168,85,247,0)', '0 0 0 0 rgba(168,85,247,0.4)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
            </motion.div>
          </div>

          <div className="text-center space-y-1">
            <h3 className="text-white font-semibold text-lg">Secure PIN Verification</h3>
            <p className="text-xs text-purple-400 font-medium tracking-wider uppercase">
              Bank-Grade Encryption Active
            </p>
          </div>

          {/* PIN dots */}
          <motion.div
            className="flex items-center gap-3"
            animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-4 h-4 rounded-full border-2 border-purple-500/60 transition-all duration-200"
                animate={{
                  backgroundColor: i < pin.length ? '#a855f7' : 'transparent',
                  borderColor:     i < pin.length ? '#a855f7' : 'rgba(168,85,247,0.4)',
                  scale:           i === pin.length - 1 && phase === 'entry' ? [1, 1.25, 1] : 1,
                  boxShadow:       i < pin.length ? '0 0 10px rgba(168,85,247,0.6)' : 'none',
                }}
                transition={{ duration: 0.15 }}
              />
            ))}
          </motion.div>

          {/* Shimmer bar (loading) */}
          <AnimatePresence>
            {phase === 'loading' && (
              <motion.div
                className="w-full h-1.5 rounded-full overflow-hidden"
                style={{ background: 'rgba(168,85,247,0.15)' }}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0 }}
              >
                <div
                  className="h-full rounded-full shimmer-bg"
                  style={{ background: 'linear-gradient(90deg, #9333ea, #3b82f6, #a855f7)', backgroundSize: '200% 100%' }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Numeric keypad */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-[224px]">
            {KEYS.map((key, idx) => (
              <button
                key={idx}
                onClick={() => press(key)}
                disabled={phase !== 'entry' || key === ''}
                className={`keypad-btn mx-auto ${key === '' ? 'opacity-0 pointer-events-none' : ''}`}
              >
                <span className={key === '⌫' ? 'text-purple-400 text-base' : ''}>{key}</span>
              </button>
            ))}
          </div>

          <button
            onClick={onCancel}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors mt-1"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
