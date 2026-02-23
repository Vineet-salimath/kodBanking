import { useState, useEffect, useMemo, useRef } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { fetchTransactions } from '../services/api';

import GradientBalanceCard from '../components/GradientBalanceCard';
import SupportOverlay      from '../components/SupportOverlay';
import ProfileDropdown     from '../components/ProfileDropdown';

/* ── helpers ─────────────────────────────────────────────────── */
const formatINR = (n) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 2,
  }).format(n || 0);

function now() {
  return new Date().toLocaleString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long',
    hour:    '2-digit', minute: '2-digit', hour12: true,
  });
}

/* ── SVG Icon library ──────────────────────────────────────── */
const Ico = {
  dashboard:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
  transfer:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l10-10M17 7H7v10"/></svg>,
  transactions: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg>,
  mycard:       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>,
  profile:      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
  market:       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  credit:       <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 7H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  debit:        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/></svg>,
  pending:      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  chart:        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  send:         <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  history:      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>,
  statement:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  ai:           <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/></svg>,
  lightning:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  list:         <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  arrowIn:      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>,
  arrowOut:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>,
  refresh:      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>,
};

/* ── Monthly Bar Chart (Credit vs Debit flow) ──────────────── */
function MonthlyChart({ transactions = [] }) {
  const [hovered, setHovered] = useState(null);

  const months = useMemo(() => {
    const map = {};
    transactions.forEach(tx => {
      if (!tx.created_at) return;
      const d = new Date(tx.created_at);
      const key = d.toLocaleString('en-IN', { month: 'short', year: '2-digit' });
      if (!map[key]) map[key] = { label: d.toLocaleString('en-IN', { month: 'short' }), credit: 0, debit: 0 };
      const amt = Math.abs(Number(tx.amount));
      if (tx.type === 'credit' || tx.type === 'deposit') map[key].credit += amt;
      else map[key].debit += amt;
    });
    return Object.values(map).slice(-7); // last 7 months
  }, [transactions]);

  const maxVal = useMemo(() => Math.max(...months.flatMap(m => [m.credit, m.debit]), 1), [months]);
  const fmt = (n) => n >= 1000 ? `₹${(n / 1000).toFixed(0)}k` : `₹${n}`;

  // Fallback bars if no real data
  const bars = months.length > 0 ? months : [
    { label: 'Oct', credit: 55000, debit: 30000 },
    { label: 'Nov', credit: 42000, debit: 38000 },
    { label: 'Dec', credit: 80000, debit: 55000 },
    { label: 'Jan', credit: 70000, debit: 45000 },
    { label: 'Feb', credit: 60000, debit: 35000 },
    { label: 'Mar', credit: 95000, debit: 60000 },
    { label: 'Apr', credit: 48000, debit: 29000 },
  ];
  const maxV = Math.max(...bars.flatMap(m => [m.credit, m.debit]), 1);

  return (
    <div className="rounded-2xl p-5" style={{ background: '#1a1a22', border: '1px solid #2a2a35' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span style={{ color: '#a855f7' }}>{Ico.chart}</span>
          <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">Monthly Flow</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-sm inline-block" style={{ background: '#22c55e' }} /> Credit
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-sm inline-block" style={{ background: '#ef4444' }} /> Debit
          </span>
        </div>
      </div>

      {/* Bars */}
      <div className="flex items-end gap-1.5" style={{ height: 88 }}>
        {bars.map((m, i) => {
          const creditH = Math.round((m.credit / maxV) * 80);
          const debitH  = Math.round((m.debit  / maxV) * 80);
          const isHov   = hovered === i;
          return (
            <div
              key={m.label + i}
              className="flex-1 flex items-end gap-0.5 cursor-pointer"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ position: 'relative' }}
            >
              {/* Credit bar */}
              <motion.div
                style={{
                  flex: 1, borderRadius: '3px 3px 0 0',
                  background: isHov ? '#22c55e' : 'rgba(34,197,94,0.55)',
                  minHeight: 3,
                  transition: 'background 0.15s',
                }}
                initial={{ height: 0 }}
                animate={{ height: creditH }}
                transition={{ delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
              {/* Debit bar */}
              <motion.div
                style={{
                  flex: 1, borderRadius: '3px 3px 0 0',
                  background: isHov ? '#ef4444' : 'rgba(239,68,68,0.55)',
                  minHeight: 3,
                  transition: 'background 0.15s',
                }}
                initial={{ height: 0 }}
                animate={{ height: debitH }}
                transition={{ delay: i * 0.07 + 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
              {/* Tooltip on hover */}
              {isHov && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    position: 'absolute', bottom: '100%', left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#111118', border: '1px solid #333340',
                    borderRadius: 7, padding: '5px 8px',
                    fontSize: 10, color: '#e2e8f0', whiteSpace: 'nowrap',
                    pointerEvents: 'none', zIndex: 20, marginBottom: 4,
                  }}
                >
                  <span style={{ color: '#22c55e' }}>{fmt(m.credit)}</span>
                  <span style={{ color: '#475569', margin: '0 3px' }}>/</span>
                  <span style={{ color: '#ef4444' }}>{fmt(m.debit)}</span>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {/* Month labels */}
      <div className="flex gap-1.5 mt-1.5">
        {bars.map((m, i) => (
          <div key={i} className="flex-1 text-center" style={{ fontSize: 9, color: hovered === i ? '#cbd5e1' : '#475569' }}>
            {m.label}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Stat card ────────────────────────────────────────────────── */
function StatCard({ icon, label, value, sub, subColor }) {
  return (
    <div className="rounded-2xl p-4 flex items-center gap-3"
      style={{ background: '#1a1a22', border: '1px solid #2a2a35' }}>
      <div className="w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0"
        style={{ background: '#252530' }}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 uppercase tracking-wide font-medium truncate">{label}</p>
        <p className="text-white font-bold text-sm mt-0.5">{value}</p>
        {sub && (
          <p className="text-xs mt-0.5 font-medium" style={{ color: subColor || '#a855f7' }}>{sub}</p>
        )}
      </div>
    </div>
  );
}

/* ── Sidebar nav items ────────────────────────────────────────── */
const NAV_MAIN = [
  { id: 'dashboard',    label: 'Dashboard',    icon: 'dashboard'    },
  { id: 'transfer',     label: 'Transfer',     icon: 'transfer'     },
  { id: 'transactions', label: 'Transactions', icon: 'transactions' },
  { id: 'mycard',       label: 'My Card',      icon: 'mycard'       },
  { id: 'profile',      label: 'Profile',      icon: 'profile'      },
];

/* ── Compact transaction row ──────────────────────────────────── */
function TxRow({ tx }) {
  const isCredit  = tx.type === 'credit' || tx.type === 'deposit';
  const amount    = Math.abs(Number(tx.amount));
  const status    = (tx.status || 'success').toLowerCase();
  const statusMap = {
    success: { label: 'DEBIT',   color: '#ef4444' },
    pending: { label: 'PENDING', color: '#f59e0b' },
    failed:  { label: 'FAILED',  color: '#6b7280' },
    credit:  { label: 'CREDIT',  color: '#22c55e' },
  };
  const badge = isCredit
    ? { label: 'CREDIT', color: '#22c55e' }
    : (statusMap[status] || statusMap.success);

  const txIconSvg = isCredit
    ? <span style={{ color: '#22c55e' }}>{Ico.arrowIn}</span>
    : tx.type === 'withdrawal' ? <span style={{ color: '#f59e0b' }}>{Ico.arrowOut}</span>
    : <span style={{ color: '#ef4444' }}>{Ico.arrowOut}</span>;
  const date = tx.created_at
    ? new Date(tx.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '';
  const peer = tx.counterparty || tx.peer || '';

  return (
    <div className="flex items-center gap-3 py-3 border-b" style={{ borderColor: '#1e1e28' }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: '#252530' }}>
        {txIconSvg}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white font-medium truncate">{tx.description || tx.type}</p>
        <p className="text-xs text-slate-500 truncate">
          {date}{peer ? ` · ${peer}` : ''}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold" style={{ color: isCredit ? '#22c55e' : '#ef4444' }}>
          {isCredit ? '+' : '-'}{formatINR(amount)}
        </p>
        <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ color: badge.color, background: badge.color + '22' }}>
          {badge.label}
        </span>
      </div>
    </div>
  );
}

/* ── Dummy transactions (25) – used as fallback when API is offline ── */
const DUMMY_TRANSACTIONS = [
  { id: 1,  type: 'credit',     amount: 85000,   description: 'Salary Credit — March 2026',       icon: '💼', status: 'success', counterparty: 'KodNest Technologies',  created_at: '2026-03-01T09:00:00Z' },
  { id: 2,  type: 'debit',      amount: 18500,   description: 'House Rent Payment',                icon: '🏠', status: 'success', counterparty: 'Landlord – Ramesh K',   created_at: '2026-03-02T11:30:00Z' },
  { id: 3,  type: 'credit',     amount: 5200,    description: 'Freelance Transfer – UI Project',  icon: '💻', status: 'success', counterparty: 'Arjun Mehta',          created_at: '2026-03-03T14:00:00Z' },
  { id: 4,  type: 'debit',      amount: 3499,    description: 'Amazon Prime Subscription',        icon: '🛒', status: 'success', counterparty: 'Amazon IN',            created_at: '2026-03-04T08:15:00Z' },
  { id: 5,  type: 'debit',      amount: 1200,    description: 'Swiggy — Lunch Order',             icon: '🍔', status: 'success', counterparty: 'Swiggy',               created_at: '2026-03-04T13:45:00Z' },
  { id: 6,  type: 'debit',      amount: 7800,    description: 'BESCOM Electricity Bill',          icon: '⚡', status: 'success', counterparty: 'BESCOM',               created_at: '2026-03-05T10:00:00Z' },
  { id: 7,  type: 'credit',     amount: 2000,    description: 'GPay Transfer Received',           icon: '📲', status: 'success', counterparty: 'Priya Sharma',         created_at: '2026-03-05T17:20:00Z' },
  { id: 8,  type: 'debit',      amount: 499,     description: 'Netflix Monthly Plan',             icon: '🎬', status: 'success', counterparty: 'Netflix India',        created_at: '2026-03-06T00:00:00Z' },
  { id: 9,  type: 'debit',      amount: 15000,   description: 'LIC Premium Payment — Q1',        icon: '🛡️', status: 'success', counterparty: 'LIC of India',         created_at: '2026-03-06T11:00:00Z' },
  { id: 10, type: 'debit',      amount: 2340,    description: 'PhonePe Recharge — Jio 84d',      icon: '📱', status: 'success', counterparty: 'PhonePe / Jio',        created_at: '2026-03-07T09:30:00Z' },
  { id: 11, type: 'credit',     amount: 10000,   description: 'UPI Transfer — Friend',            icon: '🤝', status: 'success', counterparty: 'Rahul Verma',          created_at: '2026-03-08T15:00:00Z' },
  { id: 12, type: 'debit',      amount: 4200,    description: 'Zomato Weekend Dinner',            icon: '🍕', status: 'success', counterparty: 'Zomato',               created_at: '2026-03-08T20:00:00Z' },
  { id: 13, type: 'debit',      amount: 3200,    description: 'Blinkit Grocery Run',              icon: '🛍️', status: 'pending', counterparty: 'Blinkit',              created_at: '2026-03-09T08:00:00Z' },
  { id: 14, type: 'deposit',    amount: 50000,   description: 'FD Maturity Credited',             icon: '🏦', status: 'success', counterparty: 'Kodbank FD Desk',      created_at: '2026-03-10T09:00:00Z' },
  { id: 15, type: 'debit',      amount: 1500,    description: 'Spotify + YouTube Premium',        icon: '🎵', status: 'success', counterparty: 'Google & Spotify',     created_at: '2026-03-10T12:00:00Z' },
  { id: 16, type: 'withdrawal', amount: 20000,   description: 'ATM Cash Withdrawal',              icon: '🏧', status: 'success', counterparty: 'SBI ATM · MG Road',    created_at: '2026-03-11T10:30:00Z' },
  { id: 17, type: 'debit',      amount: 8900,    description: 'Myntra — Clothing Purchase',       icon: '👗', status: 'success', counterparty: 'Myntra Fashion',       created_at: '2026-03-11T14:00:00Z' },
  { id: 18, type: 'debit',      amount: 600,     description: 'Ola Auto — Airport Drop',         icon: '🚗', status: 'success', counterparty: 'Ola Cabs',             created_at: '2026-03-12T06:00:00Z' },
  { id: 19, type: 'credit',     amount: 3750,    description: 'Cashback — HDFC Credit Card',     icon: '💳', status: 'success', counterparty: 'HDFC Rewards',         created_at: '2026-03-12T18:00:00Z' },
  { id: 20, type: 'debit',      amount: 5500,    description: 'IRCTC Train Ticket — BLR→MUM',    icon: '🚆', status: 'pending', counterparty: 'IRCTC',                created_at: '2026-03-13T11:00:00Z' },
  { id: 21, type: 'debit',      amount: 29999,   description: 'MacBook Accessory — Apple Store', icon: '💻', status: 'success', counterparty: 'Apple India',          created_at: '2026-03-14T13:00:00Z' },
  { id: 22, type: 'credit',     amount: 1500,    description: 'Interest Credited — Savings A/C', icon: '📈', status: 'success', counterparty: 'Kodbank Treasury',     created_at: '2026-03-15T00:00:00Z' },
  { id: 23, type: 'debit',      amount: 2200,    description: 'BookMyShow — Movie Tickets x4',   icon: '🎟️', status: 'success', counterparty: 'BookMyShow',           created_at: '2026-03-15T19:00:00Z' },
  { id: 24, type: 'debit',      amount: 11200,   description: 'Airtel DTH + Fibre Bill',         icon: '📡', status: 'failed',  counterparty: 'Airtel India',         created_at: '2026-03-16T09:00:00Z' },
  { id: 25, type: 'credit',     amount: 75000,   description: 'Salary Credit — April 2026',      icon: '💼', status: 'success', counterparty: 'KodNest Technologies', created_at: '2026-03-31T09:00:00Z' },
];

/* ── Dummy notifications ─────────────────────────────────────── */
const DUMMY_NOTIFS = [
  { id: 1, type: 'credit',  title: 'Salary Credited',       body: '₹85,000 has been credited to your account from KodNest Technologies.', time: '2h ago',  unread: true  },
  { id: 2, type: 'pending', title: 'Bill Payment Due',       body: 'BESCOM electricity bill of ₹7,800 is due tomorrow. Pay now to avoid late fees.', time: '5h ago',  unread: true  },
  { id: 3, type: 'debit',   title: 'Transaction Under Review', body: 'IRCTC booking of ₹5,500 is pending confirmation. Expected by midnight.', time: '1d ago',  unread: false },
];

/* ══════════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [txLoading,   setTxLoading]   = useState(false);
  const [aiOpen,      setAiOpen]      = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNav,   setActiveNav]   = useState('dashboard');
  const [currentTime, setCurrentTime] = useState(now());
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [readNotifs,  setReadNotifs]  = useState(new Set());
  const notifRef = useRef(null);

  const firstName    = user?.username || 'User';
  const unreadCount  = DUMMY_NOTIFS.filter(n => n.unread && !readNotifs.has(n.id)).length;

  /* Auto-navigate to transactions view when user types a search query */
  useEffect(() => {
    if (searchQuery.trim()) setActiveNav('transactions');
  }, [searchQuery]);

  /* Click-outside to close notification panel */
  useEffect(() => {
    if (!notifOpen) return;
    function onOut(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    }
    document.addEventListener('mousedown', onOut);
    return () => document.removeEventListener('mousedown', onOut);
  }, [notifOpen]);

  useEffect(() => {
    setTxLoading(true);
    fetchTransactions(25)
      .then(res => {
        const live = res.data?.data?.transactions || [];
        // If API returns real data, use it; otherwise fall back to dummy set
        setTransactions(live.length > 0 ? live : DUMMY_TRANSACTIONS);
      })
      .catch(() => setTransactions(DUMMY_TRANSACTIONS))
      .finally(() => setTxLoading(false));
  }, []);

  /* keep clock ticking */
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(now()), 30_000);
    return () => clearInterval(t);
  }, []);

  /* derived stats */
  const stats = useMemo(() => {
    const credits  = transactions.filter(t => t.type === 'credit' || t.type === 'deposit');
    const debits   = transactions.filter(t => t.type === 'debit' || t.type === 'withdrawal');
    const pending  = transactions.filter(t => (t.status || '').toLowerCase() === 'pending');
    return {
      totalCredit:  credits.reduce((s, t) => s + Math.abs(Number(t.amount)), 0),
      creditCount:  credits.length,
      totalDebit:   debits.reduce((s, t)  => s + Math.abs(Number(t.amount)), 0),
      debitCount:   debits.length,
      pendingAmt:   pending.reduce((s, t) => s + Math.abs(Number(t.amount)), 0),
      pendingCount: pending.length,
      totalTx:      transactions.length,
    };
  }, [transactions]);

  /* filtered recent */
  const recentFiltered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return (q
      ? transactions.filter(t => (t.description || '').toLowerCase().includes(q))
      : transactions
    ).slice(0, 7);
  }, [transactions, searchQuery]);

  /* ── render ───────────────────────────────────────────────── */
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#13131a', color: '#fff' }}>

      {/* ══ SIDEBAR ══════════════════════════════════════════════ */}
      <aside className="flex flex-col w-56 flex-shrink-0 border-r"
        style={{ background: '#181820', borderColor: '#252530', position: 'sticky', top: 0, height: '100vh' }}>

        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b" style={{ borderColor: '#252530' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-base"
            style={{ background: 'linear-gradient(135deg,#9333ea,#3b82f6)' }}>
            K
          </div>
          <span className="font-bold text-white text-lg tracking-tight">Kodbank</span>
        </div>

        {/* MAIN nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-xs text-slate-600 uppercase tracking-widest font-medium px-2 mb-2">Main</p>
          {NAV_MAIN.map(item => {
            const active = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                style={active
                  ? { background: 'linear-gradient(135deg,rgba(147,51,234,0.25),rgba(59,130,246,0.15))', color: '#fff', border: '1px solid rgba(168,85,247,0.3)' }
                  : { color: '#6b7280', background: 'transparent', border: '1px solid transparent' }}
              >
                <span className="flex-shrink-0">{Ico[item.icon]}</span>
                {item.label}
              </button>
            );
          })}


        </nav>

        {/* User footer – profile dropdown */}
        <ProfileDropdown />
      </aside>

      {/* ══ MAIN AREA ════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* ── Top bar ─────────────────────────────────────────── */}
        <header className="flex items-center justify-between px-8 py-4 border-b flex-shrink-0"
          style={{ background: '#181820', borderColor: '#252530' }}>
          <h1 className="text-lg font-bold text-white">
            {activeNav.charAt(0).toUpperCase() + activeNav.slice(1)}
          </h1>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
              style={{ background: '#252530', border: '1px solid #333340' }}>
              <svg className="w-4 h-4 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-slate-300 placeholder-slate-600 text-sm w-44"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0">
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              )}
            </div>

            {/* Bell / Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(o => !o)}
                className="relative w-9 h-9 flex items-center justify-center rounded-xl transition-colors hover:bg-white/5"
                style={{ background: notifOpen ? '#2d2d3a' : '#252530', border: '1px solid #333340' }}>
                <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-orange-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="absolute right-0 mt-2 w-80 rounded-2xl shadow-2xl z-50 overflow-hidden"
                  style={{ background: '#1a1a22', border: '1px solid #2d2d3a', top: '100%' }}>

                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: '#2d2d3a' }}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-400">{unreadCount} new</span>
                      )}
                    </div>
                    <button
                      onClick={() => setReadNotifs(new Set(DUMMY_NOTIFS.map(n => n.id)))}
                      className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Mark all read</button>
                  </div>

                  {/* Notification list */}
                  <div>
                    {DUMMY_NOTIFS.map((n, idx) => {
                      const isUnread = n.unread && !readNotifs.has(n.id);
                      const iconColor = n.type === 'credit' ? '#22c55e' : n.type === 'pending' ? '#f59e0b' : '#ef4444';
                      return (
                        <div key={n.id}
                          onClick={() => setReadNotifs(prev => new Set([...prev, n.id]))}
                          className="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors"
                          style={{ borderBottom: idx < DUMMY_NOTIFS.length - 1 ? '1px solid #252530' : 'none', background: isUnread ? 'rgba(147,51,234,0.04)' : 'transparent' }}>
                          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ background: iconColor + '22', color: iconColor }}>
                            {n.type === 'credit' ? Ico.credit : n.type === 'pending' ? Ico.pending : Ico.debit}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-semibold text-white truncate">{n.title}</span>
                              {isUnread && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{n.body}</p>
                            <p className="text-xs text-slate-600 mt-1">{n.time}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-2.5 border-t text-center" style={{ borderColor: '#2d2d3a' }}>
                    <button className="text-xs text-purple-400 hover:text-purple-300 transition-colors">View all notifications</button>
                  </div>
                </motion.div>
              )}
              </AnimatePresence>
            </div>

            {/* Profile shortcut */}
            <button
              onClick={() => setActiveNav('profile')}
              title="My Profile"
              className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors hover:bg-white/5"
              style={{ background: activeNav === 'profile' ? '#2d2d3a' : '#252530', border: activeNav === 'profile' ? '1px solid rgba(168,85,247,0.4)' : '1px solid #333340' }}>
              <svg className="w-4 h-4" style={{ color: activeNav === 'profile' ? '#a78bfa' : '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>
        </header>

        {/* ── Page body ────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto px-8 py-6" style={{ background: '#13131a' }}>

          {/* ═══ DASHBOARD VIEW ════════════════════════════════ */}
          <AnimatePresence mode="wait">
          {activeNav === 'dashboard' && (
            <motion.div key="dash" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>

              {/* Greeting row */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Hello, <span style={{ color: '#a855f7' }}>{firstName}</span>
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">Here's your financial overview</p>
                </div>
                <p className="text-right text-slate-400 text-sm leading-snug">
                  {currentTime.split(' · ')[0]}<br />
                  <span className="text-slate-500">{currentTime.split(' · ')[1]}</span>
                </p>
              </div>

              {/* Balance card */}
              <div className="mb-6">
                <GradientBalanceCard />
              </div>

              {/* 4-stat grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                  icon={<span style={{ color: '#22c55e' }}>{Ico.credit}</span>} label="Total Credit"
                  value={formatINR(stats.totalCredit)}
                  sub={`${stats.creditCount} entries`}
                  subColor="#22c55e"
                />
                <StatCard
                  icon={<span style={{ color: '#ef4444' }}>{Ico.debit}</span>} label="Total Debit"
                  value={formatINR(stats.totalDebit)}
                  sub={`${stats.debitCount} entries`}
                  subColor="#ef4444"
                />
                <StatCard
                  icon={<span style={{ color: '#f59e0b' }}>{Ico.pending}</span>} label="Pending"
                  value={formatINR(stats.pendingAmt)}
                  sub={`${stats.pendingCount} pending`}
                  subColor="#f59e0b"
                />
                <StatCard
                  icon={<span style={{ color: '#a855f7' }}>{Ico.chart}</span>} label="Transactions"
                  value={stats.totalTx}
                  sub="Total"
                  subColor="#a855f7"
                />
              </div>

              {/* Lower two-column grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT – Recent Transactions (2/3 width) */}
                <div className="lg:col-span-2 rounded-2xl overflow-hidden" style={{ background: '#1a1a22', border: '1px solid #2a2a35' }}>
                  <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#2a2a35' }}>
                    <p className="flex items-center gap-2 text-sm font-semibold text-white">
                      <span style={{ color: '#a855f7' }}>{Ico.list}</span> Recent Transactions
                    </p>
                    <button
                      onClick={() => setActiveNav('transactions')}
                      className="text-xs font-medium transition-colors"
                      style={{ color: '#a855f7' }}>
                      View all
                    </button>
                  </div>
                  <div className="px-5">
                    {txLoading
                      ? Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="h-14 my-2 rounded-xl animate-pulse" style={{ background: '#252530' }} />
                        ))
                      : recentFiltered.length > 0
                        ? recentFiltered.map(tx => <TxRow key={tx.id} tx={tx} />)
                        : <p className="py-8 text-center text-slate-600 text-sm">No transactions found.</p>
                    }
                  </div>
                </div>

                {/* RIGHT – Chart + Quick Actions (1/3 width) */}
                <div className="flex flex-col gap-4">
                  <MonthlyChart transactions={transactions} />

                  {/* Quick Actions */}
                  <div className="rounded-2xl p-5" style={{ background: '#1a1a22', border: '1px solid #2a2a35' }}>
                    <p className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-widest font-medium mb-3">
                      <span style={{ color: '#f59e0b' }}>{Ico.lightning}</span> Quick Actions
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Send Money',   svgKey: 'send'      },
                        { label: 'History',      svgKey: 'history'   },
                        { label: 'Statements',   svgKey: 'statement' },
                        { label: 'AI Assistant', svgKey: 'ai'        },
                      ].map(({ label, svgKey }) => (
                        <button
                          key={label}
                          onClick={() => {
                            if (label === 'AI Assistant') setAiOpen(true);
                            else if (label === 'History') setActiveNav('transactions');
                            else toast(`${label} coming soon!`);
                          }}
                          className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl text-xs font-medium text-slate-400 transition-all hover:text-white"
                          style={{ background: '#252530', border: '1px solid #333340' }}
                        >
                          <span>{Ico[svgKey]}</span>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══ TRANSACTIONS VIEW ═════════════════════════════ */}
          {activeNav === 'transactions' && (() => {
            const q = searchQuery.toLowerCase().trim();
            const txList = q
              ? transactions.filter(t =>
                  (t.description || '').toLowerCase().includes(q) ||
                  (t.counterparty  || '').toLowerCase().includes(q) ||
                  String(t.amount).includes(q)
                )
              : transactions;
            return (
              <motion.div key="tx" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                {/* Header row */}
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-xl font-bold text-white">Transaction History</h2>
                  {searchQuery && (
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ background: 'rgba(168,85,247,0.15)', color: '#c4b5fd', border: '1px solid rgba(168,85,247,0.25)' }}>
                      {txList.length} result{txList.length !== 1 ? 's' : ''} for "{searchQuery}"
                    </span>
                  )}
                </div>
                <p className="text-slate-500 text-sm mb-4">
                  {searchQuery ? 'Showing filtered results' : 'All your recent activity'}
                </p>

                {/* Inline search bar */}
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl mb-4"
                  style={{ background: '#1a1a22', border: '1px solid #2a2a35' }}>
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#6b7280' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by description, merchant, or amount…"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-slate-300 placeholder-slate-600 text-sm"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0">
                      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  )}
                </div>

                {/* Transaction list */}
                <div className="rounded-2xl overflow-hidden" style={{ background: '#1a1a22', border: '1px solid #2a2a35' }}>
                  <div className="px-6">
                    {txLoading
                      ? Array.from({ length: 10 }).map((_, i) => (
                          <div key={i} className="h-14 my-2 rounded-xl animate-pulse" style={{ background: '#252530' }} />
                        ))
                      : txList.length > 0
                        ? txList.map(tx => <TxRow key={tx.id} tx={tx} />)
                        : (
                          <div className="py-14 text-center">
                            <svg className="w-12 h-12 mx-auto mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                            <p className="text-slate-600 text-sm mb-2">
                              {searchQuery ? `No transactions match "${searchQuery}"` : 'No transactions yet.'}
                            </p>
                            {searchQuery && (
                              <button onClick={() => setSearchQuery('')}
                                className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                                Clear search
                              </button>
                            )}
                          </div>
                        )
                    }
                  </div>
                </div>
              </motion.div>
            );
          })()}

          {/* ═══ TRANSFER VIEW ══════════════════════════════ */}
          {activeNav === 'transfer' && (
            <motion.div key="transfer" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <h2 className="text-xl font-bold text-white mb-1">Send Money</h2>
              <p className="text-slate-500 text-sm mb-6">Transfer funds securely to any account</p>
              <div className="max-w-lg rounded-2xl p-6" style={{ background: '#1a1a22', border: '1px solid #2a2a35' }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">Recipient Account No.</label>
                    <input
                      type="text" placeholder="Enter account number"
                      className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600 outline-none"
                      style={{ background: '#252530', border: '1px solid #333340' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">Recipient Name</label>
                    <input
                      type="text" placeholder="Full name"
                      className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600 outline-none"
                      style={{ background: '#252530', border: '1px solid #333340' }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">Amount (₹)</label>
                      <input
                        type="number" placeholder="0.00"
                        className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600 outline-none"
                        style={{ background: '#252530', border: '1px solid #333340' }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">IFSC Code</label>
                      <input
                        type="text" placeholder="HDFC0001234"
                        className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600 outline-none"
                        style={{ background: '#252530', border: '1px solid #333340' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">Remark (optional)</label>
                    <input
                      type="text" placeholder="e.g. Rent, Groceries…"
                      className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600 outline-none"
                      style={{ background: '#252530', border: '1px solid #333340' }}
                    />
                  </div>
                  <button
                    onClick={() => toast('Transfer feature coming soon!', { icon: '🚧' })}
                    className="w-full py-3.5 rounded-xl font-semibold text-sm text-white mt-2 transition-all hover:opacity-90 active:scale-95"
                    style={{ background: 'linear-gradient(135deg,#9333ea,#3b82f6)', boxShadow: '0 4px 20px rgba(147,51,234,0.35)' }}
                  >
                    ↗&nbsp; Send Money
                  </button>
                </div>
                <p className="flex items-center justify-center gap-1.5 text-xs text-slate-600 mt-4">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  256-bit encrypted · RBI compliant
                </p>
              </div>
            </motion.div>
          )}

          {/* ═══ MY CARD VIEW ══════════════════════════════════ */}
          {activeNav === 'mycard' && (
            <motion.div key="mycard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <h2 className="text-xl font-bold text-white mb-1">My Card</h2>
              <p className="text-slate-500 text-sm mb-6">Your virtual debit card</p>
              <div className="flex flex-col lg:flex-row gap-6 items-start">
                {/* Card visual */}
                <motion.div
                  className="rounded-3xl p-6 w-80 flex-shrink-0 relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg,#9333ea 0%,#3b82f6 60%,#06b6d4 100%)',
                    boxShadow: '0 20px 60px rgba(147,51,234,0.45)',
                    minHeight: 190,
                  }}
                  whileHover={{ scale: 1.02, rotateY: 4 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {/* decorative circles */}
                  <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }} />
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
                  {/* chip */}
                  <div className="w-10 h-7 rounded-md mb-6" style={{ background: 'linear-gradient(135deg,#fbbf24,#f59e0b)', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }} />
                  {/* number */}
                  <p className="text-white text-lg font-mono tracking-widest mb-4">4532 •••• •••• 7841</p>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-white/50 text-xs uppercase tracking-wider">Card Holder</p>
                      <p className="text-white font-semibold text-sm mt-0.5">{user?.username?.toUpperCase() || 'KODBANK USER'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/50 text-xs uppercase tracking-wider">Expires</p>
                      <p className="text-white font-semibold text-sm mt-0.5">08 / 28</p>
                    </div>
                    <div className="text-3xl font-bold italic text-white/80" style={{ fontFamily: 'serif' }}>VISA</div>
                  </div>
                </motion.div>

                {/* Card details panel */}
                <div className="flex-1 space-y-3">
                  {[
                    { label: 'Card Type',    value: 'Visa Debit' },
                    { label: 'Card Number',  value: '4532 •••• •••• 7841' },
                    { label: 'CVV',          value: '•••' },
                    { label: 'Expiry',       value: '08 / 2028' },
                    { label: 'Network',      value: 'Visa International' },
                    { label: 'Status',       value: '🟢 Active' },
                    { label: 'Daily Limit',  value: '₹1,00,000' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between px-4 py-3 rounded-xl"
                      style={{ background: '#1a1a22', border: '1px solid #2a2a35' }}>
                      <span className="text-xs text-slate-500 uppercase tracking-wider">{label}</span>
                      <span className="text-sm text-white font-medium">{value}</span>
                    </div>
                  ))}
                  <button
                    onClick={() => toast('Card controls coming soon!', { icon: '🚧' })}
                    className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                    style={{ background: '#252530', border: '1px solid #333340' }}
                  >
                    🔒 &nbsp;Block Card
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══ PROFILE VIEW ══════════════════════════════════ */}
          {activeNav === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <h2 className="text-xl font-bold text-white mb-1">My Profile</h2>
              <p className="text-slate-500 text-sm mb-6">Account info & preferences</p>
              <div className="max-w-2xl space-y-4">
                {/* Avatar block */}
                <div className="flex items-center gap-5 p-5 rounded-2xl" style={{ background: '#1a1a22', border: '1px solid #2a2a35' }}>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,#9333ea,#3b82f6)' }}>
                    {(user?.username?.[0] || 'K').toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">{user?.username || 'Kodbank User'}</p>
                    <p className="text-slate-500 text-sm">{user?.email || 'user@kodbank.in'}</p>
                    <span className="inline-flex items-center gap-1 mt-1 text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e' }}>
                      ● Verified Account
                    </span>
                  </div>
                  <button
                    onClick={() => toast('Edit profile coming soon!', { icon: '✏️' })}
                    className="ml-auto px-4 py-2 rounded-xl text-xs font-medium text-slate-300 transition hover:text-white"
                    style={{ background: '#252530', border: '1px solid #333340' }}
                  >
                    Edit Profile
                  </button>
                </div>

                {/* Details grid */}
                {[
                  { label: 'Full Name',        value: user?.username || 'Kodbank User',     icon: '👤' },
                  { label: 'Email',            value: user?.email || 'user@kodbank.in',     icon: '📧' },
                  { label: 'Phone',            value: '+91 98•• ••7210',                   icon: '📱' },
                  { label: 'Account Number',   value: `KOD${(user?.id || '0001').toString().padStart(8,'0')}`, icon: '🏦' },
                  { label: 'Account Type',     value: 'Savings Account',                   icon: '💼' },
                  { label: 'IFSC Code',        value: 'KODB0001001',                       icon: '🔑' },
                  { label: 'Branch',           value: 'Kodbank Digital HQ, Bengaluru',     icon: '📍' },
                  { label: 'Member Since',     value: 'January 2025',                      icon: '📅' },
                  { label: 'KYC Status',       value: '✅ Completed',                       icon: '🛡️' },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="flex items-center gap-4 px-5 py-3.5 rounded-xl"
                    style={{ background: '#1a1a22', border: '1px solid #2a2a35' }}>
                    <span className="text-lg w-7 text-center flex-shrink-0">{icon}</span>
                    <span className="text-xs text-slate-500 uppercase tracking-wider w-36 flex-shrink-0">{label}</span>
                    <span className="text-sm text-white font-medium">{value}</span>
                  </div>
                ))}

                {/* Danger zone */}
                <div className="p-4 rounded-xl flex items-center justify-between" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)' }}>
                  <div>
                    <p className="text-sm font-medium text-red-400">Close Account</p>
                    <p className="text-xs text-slate-600 mt-0.5">Permanently delete your Kodbank account</p>
                  </div>
                  <button
                    onClick={() => toast('Please contact support to close your account.', { icon: '☎️' })}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-red-400 transition hover:bg-red-500/10"
                    style={{ border: '1px solid rgba(239,68,68,0.3)' }}
                  >
                    Request Closure
                  </button>
                </div>
              </div>
            </motion.div>
          )}


          </AnimatePresence>
        </main>
      </div>

      {/* ── Floating AI button ──────────────────────────────────── */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center"
        style={{ width: 54, height: 54, borderRadius: '50%', background: 'linear-gradient(135deg,#9333ea,#3b82f6)', boxShadow: '0 8px 32px rgba(147,51,234,0.5)' }}
        onClick={() => setAiOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Open AI Assistant"
        aria-label="Open AI Assistant"
      >
        {/* Inner wrapper gives the pulse-dot a positioned anchor */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          {/* Chat bubble / message icon */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <line x1="8" y1="10" x2="16" y2="10" />
            <line x1="8" y1="14" x2="12" y2="14" />
          </svg>
          {/* Pulsing dot — indicates AI is live */}
          <span
            style={{
              position: 'absolute',
              top: 6, right: 6,
              width: 9, height: 9,
              borderRadius: '50%',
              background: '#22c55e',
              border: '1.5px solid #9333ea',
              boxShadow: '0 0 6px #22c55e',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          />
        </div>
      </motion.button>

      <SupportOverlay open={aiOpen} onClose={() => setAiOpen(false)} />
    </div>
  );
}

