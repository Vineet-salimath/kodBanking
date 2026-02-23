import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { fetchTransactions } from '../services/api';

// New premium components
import AmbientParticles      from '../components/AmbientParticles';
import GradientBalanceCard   from '../components/GradientBalanceCard';
import StatusAnalyticsGrid   from '../components/StatusAnalyticsCard';
import TransactionHistory    from '../components/TransactionHistory';
import StatementsSection     from '../components/StatementsSection';
import WorldBankGDP          from '../components/WorldBankGDP';
import SupportOverlay        from '../components/SupportOverlay';

// Existing component (unchanged — still available)
import AIChat from '../components/AIChat';

const fadeUp = {
  hidden:   { opacity: 0, y: 20 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function DashboardPage() {
  const { user, logout }  = useAuth();
  const navigate          = useNavigate();
  const [loggingOut,      setLoggingOut]      = useState(false);
  const [balanceRevealed, setBalanceRevealed] = useState(false);
  const [transactions,    setTransactions]    = useState([]);
  const [txLoading,       setTxLoading]       = useState(false);
  const [aiOpen,          setAiOpen]          = useState(false);
  const [searchQuery,     setSearchQuery]     = useState('');
  const [activeTab,       setActiveTab]       = useState('overview'); // overview | transactions | statements | insights

  const firstName = user?.username || 'User';

  // Fetch transactions (real API — falls back gracefully if empty)
  useEffect(() => {
    setTxLoading(true);
    fetchTransactions(20)
      .then(res => setTransactions(res.data?.data?.transactions || []))
      .catch(() => setTransactions([]))
      .finally(() => setTxLoading(false));
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    toast.success('Signed out successfully');
    navigate('/login', { replace: true });
  };

  const handleBalanceRevealed = () => {
    setBalanceRevealed(true);
  };

  const TABS = [
    { id: 'overview',      label: 'Overview'     },
    { id: 'transactions',  label: 'Transactions' },
    { id: 'statements',    label: 'Statements'   },
    { id: 'insights',      label: 'GDP Insights' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0e0e12' }}>
      {/* Ambient particles + orbs */}
      <AmbientParticles />

      {/* ── NAV ──────────────────────────────────────────────────────── */}
      <nav
        className="relative z-20 border-b"
        style={{ background: 'rgba(14,14,18,0.85)', backdropFilter: 'blur(20px)', borderColor: '#26262a' }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* LEFT – Logo + greeting */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ background: 'linear-gradient(135deg, #9333ea, #3b82f6)' }}
              >
                K
              </div>
              <span className="font-bold text-white text-lg hidden sm:block">Kodbank</span>
            </div>

            <div className="hidden md:flex items-center gap-1.5 text-sm">
              <span className="text-slate-400">Hello,</span>
              <span className="font-semibold" style={{ color: '#a855f7' }}>
                {firstName}
              </span>
              <span className="text-base">👋</span>
            </div>
          </div>

          {/* RIGHT – Search + icons + logout */}
          <div className="flex items-center gap-2">
            {/* Glass search bar */}
            <div className="glass-pill hidden sm:flex">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-slate-300 placeholder-slate-600 text-xs w-28 focus:w-40 transition-all duration-200"
              />
            </div>

            {/* Notification bell */}
            <button
              className="glass-icon-btn"
              onClick={() => toast('No new notifications', { icon: '🔔' })}
              title="Notifications"
            >
              <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            {/* Settings gear */}
            <button
              className="glass-icon-btn"
              onClick={() => toast('Settings coming soon', { icon: '⚙️' })}
              title="Settings"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            {/* Sign out */}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-white transition-all duration-200 disabled:opacity-50"
              style={{ background: 'rgba(22,22,26,0.8)', border: '1px solid #26262a' }}
            >
              {loggingOut ? (
                <span className="w-3.5 h-3.5 border border-slate-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              )}
              <span className="hidden sm:block">Sign out</span>
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-1 pb-0">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative px-4 py-2.5 text-sm font-medium transition-colors duration-200"
              style={{ color: activeTab === tab.id ? '#a855f7' : '#64748b' }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ background: '#a855f7' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* ── MAIN CONTENT ────────────────────────────────────────────── */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <AnimatePresence mode="wait">

          {/* ━━ OVERVIEW TAB ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              variants={stagger}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Greeting */}
              <motion.div variants={fadeUp} className="flex items-center gap-3">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">
                    Good morning,{' '}
                    <span style={{ color: '#a855f7' }}>{firstName}</span> 👋
                  </h1>
                  <p className="text-slate-500 text-sm mt-1">
                    Here's your financial overview for February 2026
                  </p>
                </div>
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0 animate-float"
                  style={{ background: 'linear-gradient(135deg, #9333ea, #3b82f6)', boxShadow: '0 8px 24px rgba(147,51,234,0.4)' }}
                >
                  {firstName[0]?.toUpperCase()}
                </div>
              </motion.div>

              {/* Gradient Balance Card */}
              <motion.div variants={fadeUp}>
                <GradientBalanceCard onBalanceRevealed={handleBalanceRevealed} />
              </motion.div>

              {/* Analytics grid */}
              <motion.div variants={fadeUp}>
                <StatusAnalyticsGrid transactions={transactions} />
              </motion.div>

              {/* Recent transactions (compact — first 5) */}
              <AnimatePresence>
                {!txLoading && (
                  <motion.div variants={fadeUp}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white font-semibold text-sm">Recent Transactions</h3>
                      <button
                        onClick={() => setActiveTab('transactions')}
                        className="text-xs transition-colors"
                        style={{ color: '#a855f7' }}
                      >
                        View all →
                      </button>
                    </div>
                    <TransactionHistory
                      transactions={transactions.slice ? transactions.slice(0, 5) : []}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Quick actions */}
              <motion.div variants={fadeUp}>
                <h3 className="text-slate-500 text-xs uppercase tracking-widest font-medium mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Transfer',    icon: '↗️',  desc: 'Send money',         tab: null   },
                    { label: 'Transactions',icon: '📋',  desc: 'View history',        tab: 'transactions' },
                    { label: 'Statements',  icon: '📄',  desc: 'Download PDF',        tab: 'statements'   },
                    { label: 'AI Support',  icon: '🤖',  desc: 'Ask our AI',          tab: 'ai'   },
                  ].map(({ label, icon, desc, tab }) => (
                    <motion.button
                      key={label}
                      className="glass-card px-4 py-5 flex flex-col items-center gap-2 group"
                      onClick={() => {
                        if (tab === 'ai') setAiOpen(true);
                        else if (tab) setActiveTab(tab);
                        else toast('Coming soon!', { icon: '🚧' });
                      }}
                      whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(168,85,247,0.15)' }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{icon}</span>
                      <span className="text-sm font-medium text-white">{label}</span>
                      <span className="text-xs text-slate-500">{desc}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ━━ TRANSACTIONS TAB ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {activeTab === 'transactions' && (
            <motion.div
              key="transactions"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-xl font-bold text-white">Transaction History</h2>
                <p className="text-slate-500 text-sm mt-0.5">All your recent activity</p>
              </div>
              {txLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-16 rounded-xl shimmer-bg" />
                  ))}
                </div>
              ) : (
                <TransactionHistory transactions={transactions} />
              )}
            </motion.div>
          )}

          {/* ━━ STATEMENTS TAB ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {activeTab === 'statements' && (
            <motion.div
              key="statements"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-xl font-bold text-white">Account Statements</h2>
                <p className="text-slate-500 text-sm mt-0.5">Download monthly statements</p>
              </div>
              <StatementsSection />
            </motion.div>
          )}

          {/* ━━ GDP INSIGHTS TAB ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {activeTab === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-xl font-bold text-white">Global GDP Insights</h2>
                <p className="text-slate-500 text-sm mt-0.5">Live world economic data via RapidAPI</p>
              </div>
              <WorldBankGDP />

              {/* Partner institutions */}
              <div className="glass-card p-6">
                <h3 className="text-white font-semibold text-sm mb-4">Partner Institutions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['🏦 World Bank', '📊 IMF', '🌐 RapidAPI', '🇮🇳 RBI'].map(p => (
                    <div key={p}
                      className="flex items-center justify-center py-3 px-4 rounded-xl text-sm text-slate-400"
                      style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.12)' }}
                    >
                      {p}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* ── FLOATING AI BUTTON ──────────────────────────────────────── */}
      <motion.button
        className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full text-white text-xl flex items-center justify-center"
        style={{
          background:  'linear-gradient(135deg, #9333ea, #3b82f6)',
          boxShadow:   '0 8px 32px rgba(147,51,234,0.5)',
        }}
        onClick={() => setAiOpen(true)}
        whileHover={{ scale: 1.1, boxShadow: '0 12px 40px rgba(147,51,234,0.7)' }}
        whileTap={{ scale: 0.95 }}
        title="Open AI Support"
      >
        🤖
      </motion.button>

      {/* ── AI SUPPORT OVERLAY ─────────────────────────────────────── */}
      <SupportOverlay open={aiOpen} onClose={() => setAiOpen(false)} />

      {/* ── FOOTER ──────────────────────────────────────────────────── */}
      <footer
        className="relative z-10 text-center py-6 text-xs mt-12 border-t"
        style={{ borderColor: '#26262a', color: '#3f3f47' }}
      >
        © {new Date().getFullYear()} Kodbank · Powered by Aiven MySQL · All data encrypted
      </footer>
    </div>
  );
}

