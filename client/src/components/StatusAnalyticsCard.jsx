/**
 * StatusAnalyticsCard.jsx
 * Reusable premium stat card with colored accent + hover glow.
 * Grid of credit / debit / monthly insight cards.
 * Accepts existing data via props — does NOT modify any backend logic.
 */
import { motion } from 'framer-motion';

const ICONS = {
  credit: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M7 11l5-5m0 0l5 5m-5-5v12" />
    </svg>
  ),
  debit: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M17 13l-5 5m0 0l-5-5m5 5V6" />
    </svg>
  ),
  monthly: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
};

const ACCENT = {
  green:  { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)', icon: '#10b981', text: '#6ee7b7', glow: 'rgba(16,185,129,0.18)' },
  red:    { bg: 'rgba(239,68,68,0.10)',  border: 'rgba(239,68,68,0.22)',  icon: '#ef4444', text: '#fca5a5', glow: 'rgba(239,68,68,0.15)' },
  purple: { bg: 'rgba(168,85,247,0.10)', border: 'rgba(168,85,247,0.25)', icon: '#a855f7', text: '#d8b4fe', glow: 'rgba(168,85,247,0.15)' },
};

function SingleCard({ label, value, subLabel, iconType, color, delay = 0 }) {
  const ac = ACCENT[color] || ACCENT.purple;

  return (
    <motion.div
      className="stat-card-hover relative rounded-2xl p-5 flex flex-col gap-3"
      style={{ background: 'rgba(22,22,26,0.85)', border: `1px solid ${ac.border}` }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: 'easeOut' }}
      whileHover={{ boxShadow: `0 12px 40px ${ac.glow}`, y: -3 }}
    >
      {/* Top row */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">{label}</p>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: ac.bg, border: `1px solid ${ac.border}`, color: ac.icon }}
        >
          {ICONS[iconType]}
        </div>
      </div>

      {/* Value */}
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        {subLabel && <p className="text-xs mt-1" style={{ color: ac.text }}>{subLabel}</p>}
      </div>

      {/* Sparkle line */}
      <div className="h-px" style={{ background: `linear-gradient(to right, transparent, ${ac.icon}55, transparent)` }} />
    </motion.div>
  );
}

const formatINR = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);

export default function StatusAnalyticsGrid({ transactions = [] }) {
  // Compute from real transactions, fall back to zeroes
  const totalCredit = transactions
    .filter(t => t.type === 'credit' || t.type === 'deposit' || Number(t.amount) > 0 && t.type !== 'debit')
    .reduce((s, t) => s + Math.abs(Number(t.amount)), 0);

  const totalDebit = transactions
    .filter(t => t.type === 'debit' || t.type === 'withdrawal')
    .reduce((s, t) => s + Math.abs(Number(t.amount)), 0);

  const monthlyNet    = totalCredit - totalDebit;
  const monthlyLabel  = monthlyNet >= 0 ? `+${formatINR(monthlyNet)} net gain` : `${formatINR(monthlyNet)} net loss`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <SingleCard
        label="Total Credit"
        value={formatINR(totalCredit)}
        subLabel="Incoming funds"
        iconType="credit"
        color="green"
        delay={0}
      />
      <SingleCard
        label="Total Debit"
        value={formatINR(totalDebit)}
        subLabel="Outgoing funds"
        iconType="debit"
        color="red"
        delay={0.07}
      />
      <SingleCard
        label="Monthly Insights"
        value={formatINR(Math.abs(monthlyNet))}
        subLabel={monthlyLabel}
        iconType="monthly"
        color="purple"
        delay={0.14}
      />
    </div>
  );
}
