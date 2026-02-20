import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import BalanceCard from '../components/BalanceCard';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    toast.success('Signed out successfully');
    navigate('/login', { replace: true });
  };

  const firstName = user?.name?.split(' ')[0] || user?.sub?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/30">
              K
            </div>
            <span className="font-bold text-white text-lg">Kodbank</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Secure session
            </div>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-200 disabled:opacity-50"
            >
              {loggingOut ? (
                <span className="w-3.5 h-3.5 border border-slate-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              )}
              Sign out
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="space-y-10"
        >
          {/* Welcome header */}
          <motion.div variants={fadeUp} className="text-center space-y-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-4 text-3xl font-bold text-white shadow-xl shadow-indigo-500/30 animate-float"
            >
              {firstName[0]?.toUpperCase()}
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Welcome back,{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                {firstName}!
              </span>
            </h1>
            <p className="text-slate-400 text-sm">
              Your finances are secure and up to date.
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Account Status', value: 'Active', icon: '✅', color: 'text-green-400' },
              { label: 'Account Type', value: 'Customer', icon: '🏦', color: 'text-indigo-400' },
              { label: 'Security', value: 'SSL Secured', icon: '🔒', color: 'text-violet-400' },
            ].map(({ label, value, icon, color }) => (
              <div key={label} className="glass-card px-5 py-4 flex items-center gap-3">
                <span className="text-2xl">{icon}</span>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">{label}</p>
                  <p className={`text-sm font-semibold ${color}`}>{value}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Balance section */}
          <motion.div variants={fadeUp} className="glass-card p-8 sm:p-10">
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-white mb-1">Account Balance</h2>
              <p className="text-slate-400 text-sm">
                Click below to securely fetch your real-time balance
              </p>
            </div>
            <BalanceCard />
          </motion.div>

          {/* Quick actions */}
          <motion.div variants={fadeUp}>
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Transfer', icon: '↗️', desc: 'Send money' },
                { label: 'History', icon: '📋', desc: 'View transactions' },
                { label: 'Statements', icon: '📄', desc: 'Download PDF' },
                { label: 'Support', icon: '💬', desc: 'Get help' },
              ].map(({ label, icon, desc }) => (
                <button
                  key={label}
                  className="glass-card px-4 py-5 flex flex-col items-center gap-2 hover:bg-white/10 hover:border-white/20 transition-all duration-200 group"
                  onClick={() => toast('Coming soon!', { icon: '🚧' })}
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{icon}</span>
                  <span className="text-sm font-medium text-white">{label}</span>
                  <span className="text-xs text-slate-500">{desc}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-xs text-slate-600 border-t border-white/5 mt-12">
        © {new Date().getFullYear()} Kodbank · All data encrypted · Powered by Aiven MySQL
      </footer>
    </div>
  );
}
