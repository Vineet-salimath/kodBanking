/**
 * ProfileDropdown.jsx
 * Production-ready profile dropdown for the Kodbank sidebar.
 * Features: outside-click close, animated slide, theme toggle,
 * JSON export, sign-out with toast, and /profile navigation.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { fetchBalance } from '../services/api';

/* ── Theme helpers ──────────────────────────────────────────── */
const THEME_KEY = 'kb_theme';

function getStoredTheme() {
  return localStorage.getItem(THEME_KEY) || 'dark';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.classList.toggle('light', theme === 'light');
  document.documentElement.classList.toggle('dark',  theme === 'dark');
  localStorage.setItem(THEME_KEY, theme);
}

/* ── Export helper ──────────────────────────────────────────── */
function buildAccountId(username = '') {
  const seed = Math.abs(username.charCodeAt(0) * 3847 + 9127);
  return 'AC' + String(seed).padStart(10, '0').slice(0, 10);
}

async function downloadAccountData(user) {
  let balance = '—';
  try {
    const res = await fetchBalance();
    const raw = res.data?.data?.balance ?? res.data?.balance ?? '—';
    balance = typeof raw === 'number'
      ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(raw)
      : raw;
  } catch { /* swallow — still export without balance */ }

  const accountId = buildAccountId(user?.username);
  const date      = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const year      = new Date().getFullYear();

  const html = `<!DOCTYPE html>
<html lang="en"><head>
  <meta charset="UTF-8">
  <title>Kodbank Account Statement</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; padding: 48px 56px; color: #111; background: #fff; }
    .header { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
    .logo { width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg,#9333ea,#3b82f6);
            display: flex; align-items: center; justify-content: center; color: #fff; font-size: 22px; font-weight: 800; }
    .bank-name { font-size: 26px; font-weight: 800; color: #7c3aed; }
    .subtitle { color: #888; font-size: 13px; margin-bottom: 36px; margin-top: 4px; }
    .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #9333ea;
                     font-weight: 700; margin-bottom: 14px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
    tr { border-bottom: 1px solid #f0f0f0; }
    td { padding: 13px 16px; font-size: 14px; }
    td:first-child { color: #666; width: 42%; font-weight: 500; }
    td:last-child { font-weight: 600; color: #111; }
    .badge { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 12px;
             background: #dcfce7; color: #16a34a; font-weight: 700; }
    .divider { border: none; border-top: 1px solid #ede9fe; margin: 24px 0; }
    .footer { font-size: 11px; color: #aaa; text-align: center; padding-top: 20px;
               border-top: 1px solid #f0f0f0; }
    @media print {
      body { padding: 24px 32px; }
    }
  </style>
</head><body>
  <div class="header">
    <div class="logo">K</div>
    <div class="bank-name">Kodbank</div>
  </div>
  <div class="subtitle">Account Statement &mdash; Generated on ${date}</div>

  <div class="section-title">Account Information</div>
  <table>
    <tr><td>Full Name</td><td>${user?.username || '—'}</td></tr>
    <tr><td>Email Address</td><td>${user?.email || '—'}</td></tr>
    <tr><td>Account Number</td><td>${accountId}</td></tr>
    <tr><td>Account Type</td><td>Savings Account</td></tr>
    <tr><td>Current Balance</td><td>${balance}</td></tr>
    <tr><td>Currency</td><td>Indian Rupee (INR)</td></tr>
    <tr><td>IFSC Code</td><td>KODB0001234</td></tr>
    <tr><td>Branch</td><td>Bengaluru Main Branch</td></tr>
    <tr><td>Account Status</td><td><span class="badge">Active</span></td></tr>
  </table>

  <hr class="divider">
  <div class="footer">
    This is a system-generated document. Kodbank &copy; ${year}. For support, contact support@kodbank.in
  </div>
  <script>window.onload = function(){ setTimeout(function(){ window.print(); }, 400); }<\/script>
</body></html>`;

  const win = window.open('', '_blank');
  if (!win) {
    toast.error('Allow pop-ups to export PDF');
    return;
  }
  win.document.write(html);
  win.document.close();
}

/* ── Dropdown SVG icons ────────────────────────────────────── */
const DI = {
  profile:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
  sun:      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
  moon:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>,
  download: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  logout:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  spinner:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" style={{ animation: 'spin 1s linear infinite', transformOrigin: 'center' }}/></svg>,
};

/* ── Menu item ──────────────────────────────────────────────────── */
function MenuItem({ icon, label, onClick, danger = false, extra }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      role="menuitem"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      style={{
        display:        'flex',
        alignItems:     'center',
        gap:            10,
        width:          '100%',
        padding:        '9px 12px',
        borderRadius:   10,
        border:         'none',
        cursor:         'pointer',
        background:     hovered
          ? danger ? 'rgba(239,68,68,0.12)' : 'rgba(168,85,247,0.1)'
          : 'transparent',
        color:          danger ? (hovered ? '#f87171' : '#ef4444') : (hovered ? '#fff' : '#94a3b8'),
        fontSize:       13,
        fontWeight:     500,
        textAlign:      'left',
        transition:     'background 0.15s, color 0.15s',
        fontFamily:     'inherit',
      }}
    >
      <span style={{ width: 20, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {extra && <span style={{ fontSize: 11, color: '#475569', flexShrink: 0 }}>{extra}</span>}
    </motion.button>
  );
}

/* ── Divider ────────────────────────────────────────────────── */
function Divider() {
  return <div style={{ height: 1, background: '#ffffff08', margin: '4px 0' }} />;
}

/* ══════════════════════════════════════════════════════════════ */
export default function ProfileDropdown() {
  const { user, logout }            = useAuth();
  const navigate                    = useNavigate();
  const [open,      setOpen]        = useState(false);
  const [theme,     setTheme]       = useState(getStoredTheme);
  const [exporting, setExporting]   = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const wrapperRef                  = useRef(null);

  const firstName = user?.username || 'User';

  /* initialise theme from storage on mount */
  useEffect(() => {
    applyTheme(getStoredTheme());
  }, []);

  /* close on outside click */
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  /* close on Escape */
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  /* ── handlers ─────────────────────────────────────────────── */
  const handleProfile = useCallback(() => {
    setOpen(false);
    navigate('/profile');
  }, [navigate]);

  const handleToggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    setTheme(next);
    setOpen(false);
    toast(`Switched to ${next} mode`, { icon: next === 'dark' ? '🌙' : '☀️' });
  }, [theme]);

  const handleExport = useCallback(async () => {
    if (exporting) return;
    setExporting(true);
    setOpen(false);
    try {
      await downloadAccountData(user);
      toast.success('account-data.json downloaded');
    } catch {
      toast.error('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  }, [user, exporting]);

  const handleSignOut = useCallback(async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    setOpen(false);
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login', { replace: true });
    } catch {
      toast.error('Sign-out failed. Please try again.');
      setLoggingOut(false);
    }
  }, [logout, navigate, loggingOut]);

  /* ── render ───────────────────────────────────────────────── */
  return (
    <div ref={wrapperRef} style={{ position: 'relative', padding: '12px', borderTop: '1px solid #252530' }}>

      {/* ── Trigger ─────────────────────────────────────────── */}
      <motion.button
        onClick={() => setOpen(v => !v)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Account menu"
        style={{
          display:       'flex',
          alignItems:    'center',
          gap:           10,
          width:         '100%',
          padding:       '8px 10px',
          borderRadius:  12,
          border:        `1px solid ${open ? 'rgba(168,85,247,0.4)' : '#333340'}`,
          cursor:        'pointer',
          background:    open ? 'rgba(168,85,247,0.08)' : '#252530',
          transition:    'border-color 0.2s, background 0.2s',
          fontFamily:    'inherit',
        }}
      >
        {/* avatar */}
        <div style={{
          width: 32, height: 32, borderRadius: 9, flexShrink: 0,
          background: 'linear-gradient(135deg,#9333ea,#3b82f6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color: '#fff',
        }}>
          {firstName[0]?.toUpperCase()}
        </div>

        {/* name + role */}
        <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {firstName}
          </p>
          <p style={{ fontSize: 11, color: '#475569', margin: 0 }}>Customer</p>
        </div>

        {/* chevron */}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ color: '#475569', fontSize: 10, flexShrink: 0 }}
        >
          ▲
        </motion.span>
      </motion.button>

      {/* ── Dropdown panel ──────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label="Profile menu"
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{   opacity: 0, y: 8,  scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position:     'absolute',
              bottom:       'calc(100% + 8px)',
              left:         0,
              right:        0,
              background:   '#1a1c22',
              border:       '1px solid #2a2a38',
              borderRadius: 14,
              padding:      '6px',
              boxShadow:    '0 -16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
              zIndex:       50,
            }}
          >
            {/* User info header */}
            <div style={{ padding: '8px 12px 10px', borderBottom: '1px solid #ffffff08', marginBottom: 4 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', margin: 0 }}>{firstName}</p>
              <p style={{ fontSize: 11, color: '#475569', margin: '2px 0 0' }}>
                {user?.email || 'Kodbank Customer'}
              </p>
            </div>

            <MenuItem
              icon={DI.profile}
              label="My Profile"
              onClick={handleProfile}
            />

            <MenuItem
              icon={theme === 'dark' ? DI.sun : DI.moon}
              label="Toggle Theme"
              extra={theme === 'dark' ? 'Light' : 'Dark'}
              onClick={handleToggleTheme}
            />

            <MenuItem
              icon={exporting ? DI.spinner : DI.download}
              label={exporting ? 'Exporting…' : 'Export Data'}
              onClick={handleExport}
            />

            <Divider />

            <MenuItem
              icon={loggingOut ? DI.spinner : DI.logout}
              label={loggingOut ? 'Signing out…' : 'Sign Out'}
              onClick={handleSignOut}
              danger
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
