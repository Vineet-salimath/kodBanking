import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { fetchBalance } from '../services/api';
import toast from 'react-hot-toast';

const formatINR = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount);

const burstConfetti = () => {
  const count = 200;
  const defaults = { origin: { y: 0.7 } };
  const fire = (particleRatio, opts) =>
    confetti({ ...defaults, ...opts, particleCount: Math.floor(count * particleRatio) });

  fire(0.25, { spread: 26, startVelocity: 55, colors: ['#818cf8', '#a78bfa', '#c4b5fd'] });
  fire(0.2,  { spread: 60, colors: ['#6366f1', '#8b5cf6', '#7c3aed'] });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ['#e0e7ff', '#c7d2fe', '#a5b4fc'] });
  fire(0.1,  { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1,  { spread: 120, startVelocity: 45, colors: ['#818cf8', '#6366f1'] });
};

export default function BalanceCard() {
  const [state, setState] = useState('idle'); // idle | loading | shown
  const [balance, setBalance] = useState(null);
  const [userName, setUserName] = useState('');
  const hasShown = useRef(false);

  // Pre-fetch name from auth context via API to show on card
  useEffect(() => {
    if (state === 'shown' && !hasShown.current) {
      hasShown.current = true;
      burstConfetti();
    }
  }, [state]);

  const handleCheckBalance = async () => {
    if (state === 'shown') return;
    setState('loading');
    try {
      const { data } = await fetchBalance();
      setBalance(data.data.balance);
      setUserName(data.data.username);
      setState('shown');
    } catch (err) {
      toast.error(err.message);
      setState('idle');
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <AnimatePresence mode="wait">
        {state !== 'shown' ? (
          <motion.button
            key="check-btn"
            onClick={handleCheckBalance}
            disabled={state === 'loading'}
            className="btn-primary max-w-xs"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            {state === 'loading' ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Fetching balance…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Check Balance
              </span>
            )}
          </motion.button>
        ) : (
          <motion.div
            key="balance-card"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="relative w-full max-w-sm"
          >
            {/* Card */}
            <div className="glass-card-strong p-8 text-center relative overflow-hidden balance-glow">
              {/* Inner glow rings */}
              <div className="absolute inset-0 rounded-2xl"
                style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.2) 0%, transparent 70%)' }} />

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 300 }}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-indigo-500/40"
              >
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-slate-400 text-sm uppercase tracking-widest mb-2"
              >
                Available Balance
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <span className="text-4xl font-bold bg-gradient-to-r from-indigo-300 via-violet-300 to-indigo-300 bg-clip-text text-transparent">
                  {formatINR(balance)}
                </span>
              </motion.div>

              {userName && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-slate-500 text-xs mt-4"
                >
                  Account holder: <span className="text-slate-300">{userName}</span>
                </motion.p>
              )}

              {/* Decorative line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-6 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"
              />
            </div>

            {/* Reset button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              onClick={() => { setState('idle'); hasShown.current = false; }}
              className="btn-secondary mt-4"
            >
              Hide Balance
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
