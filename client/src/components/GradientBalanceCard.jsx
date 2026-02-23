/**
 * GradientBalanceCard.jsx
 * Premium full-width balance card with purple halo and animated count-up.
 * Triggers PinAuthModal on "Check Balance". Does NOT modify real auth flow.
 */
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import { fetchBalance } from '../services/api';
import PinAuthModal from './PinAuthModal';

const formatINR = (n) =>
  new Intl.NumberFormat('en-IN', {
    style:                 'currency',
    currency:              'INR',
    maximumFractionDigits: 2,
  }).format(n);

function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!target) return;
    const start     = Date.now();
    const startVal  = 0;
    const tick = () => {
      const elapsed  = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      setValue(Math.floor(startVal + eased * (target - startVal)));
      if (progress < 1) requestAnimationFrame(tick);
      else setValue(target);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return value;
}

const burstPurpleConfetti = () => {
  confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 }, colors: ['#a855f7','#9333ea','#3b82f6','#e0e7ff'] });
};

export default function GradientBalanceCard({ onBalanceRevealed }) {
  const [phase,       setPhase]       = useState('idle'); // idle | modal | revealed
  const [rawBalance,  setRawBalance]  = useState(null);
  const [showModal,   setShowModal]   = useState(false);
  const hasConfetti                   = useRef(false);
  const displayBalance                = useCountUp(phase === 'revealed' ? rawBalance : 0);

  const handleSuccess = (bal) => {
    setRawBalance(bal);
    setShowModal(false);
    setPhase('revealed');
    if (!hasConfetti.current) {
      hasConfetti.current = true;
      burstPurpleConfetti();
    }
    onBalanceRevealed?.(bal);
  };

  const handleHide = () => {
    setPhase('idle');
    setRawBalance(null);
    hasConfetti.current = false;
  };

  return (
    <>
      {/* PIN Modal + blur overlay */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Dashboard blur backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              style={{ backdropFilter: 'blur(40px)', backgroundColor: 'rgba(14,14,18,0.7)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <PinAuthModal
              fetchBalanceFn={fetchBalance}
              onSuccess={handleSuccess}
              onCancel={() => { setShowModal(false); setPhase('idle'); }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Card */}
      <div className="relative w-full">
        {/* Purple halo behind card */}
        <div className="purple-halo" />

        <div
          className="relative w-full rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #9333ea 0%, #4f46e5 50%, #3b82f6 100%)',
            boxShadow: '0 20px 60px rgba(147,51,234,0.4), 0 8px 24px rgba(0,0,0,0.4)',
          }}
        >
          {/* Noise overlay for texture */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Inner glassmorphic layer */}
          <div className="relative p-8 sm:p-10">
            {/* Top row */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-white/60 text-xs font-medium uppercase tracking-[0.15em] mb-1">
                  Available Balance
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-white/70 text-xs">Live · Updated now</span>
                </div>
              </div>

              {/* Kodbank chip */}
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-3 py-2">
                <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                  K
                </div>
                <span className="text-white/90 text-sm font-semibold tracking-wide">Kodbank</span>
              </div>
            </div>

            {/* Balance amount */}
            <AnimatePresence mode="wait">
              {phase === 'revealed' ? (
                <motion.div
                  key="amount"
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0,  scale: 1    }}
                  className="mb-6"
                >
                  <span className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
                    {formatINR(displayBalance)}
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-1 mb-6"
                >
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="w-5 h-5 rounded-full bg-white/30" />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Divider */}
            <div className="h-px bg-white/15 mb-6" />

            {/* Bottom row */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-xs text-white/60">
                <div>
                  <p className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">Account</p>
                  <p className="text-white/80 font-medium">●●●● ●●●● 4291</p>
                </div>
                <div className="w-px h-8 bg-white/15" />
                <div>
                  <p className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">Type</p>
                  <p className="text-white/80 font-medium">Savings</p>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {phase !== 'revealed' ? (
                  <motion.button
                    key="check-btn"
                    onClick={() => { setPhase('modal'); setShowModal(true); }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200"
                    style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.25)', scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Check Balance
                  </motion.button>
                ) : (
                  <motion.button
                    key="hide-btn"
                    onClick={handleHide}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-white/60 hover:text-white transition-colors"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Hide
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
