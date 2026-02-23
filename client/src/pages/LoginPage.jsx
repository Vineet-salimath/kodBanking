import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

/* ── animation presets ───────────────────────────────────────── */
const rise = (delay = 0) => ({
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
});

/* ── tiny sub-components ─────────────────────────────────────── */

function LockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function EyeIcon({ open }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

/* ── main page ───────────────────────────────────────────────── */
export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form,    setForm]    = useState({ username: '', password: '' });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [showPw,  setShowPw]  = useState(false);
  const [focused, setFocused] = useState('');

  const validate = () => {
    const e = {};
    if (!form.username || form.username.trim().length < 3)
      e.username = 'Username must be at least 3 characters';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length) { setErrors(fieldErrors); return; }
    setLoading(true);
    try {
      const { data } = await loginUser(form);
      login(data.user);
      toast.success(`Welcome back, ${data.user.username}!`);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* shared field border style */
  const fieldBorder = (name, hasErr) => ({
    background:  'rgba(255,255,255,0.05)',
    border:      `1px solid ${hasErr ? '#ef444460' : focused === name ? '#a855f7' : 'rgba(255,255,255,0.08)'}`,
    borderRadius: 12,
    color:       '#e2e8f0',
    fontSize:    14,
    outline:     'none',
    transition:  'border-color 0.2s',
    boxShadow:   focused === name && !hasErr ? '0 0 0 3px rgba(168,85,247,0.12)' : 'none',
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        background: [
          'radial-gradient(circle at 20% 30%, rgba(181,33,255,0.35), transparent 40%)',
          'radial-gradient(circle at 80% 70%, rgba(0,102,255,0.35), transparent 40%)',
          'linear-gradient(135deg, #22242B 0%, #1c1f26 100%)',
        ].join(', '),
        backgroundAttachment: 'fixed',
        fontFamily: "'Inter', 'Geist', system-ui, sans-serif",
      }}
      className="flex items-center justify-center px-4 py-12"
    >

      {/* ── Card ─────────────────────────────────────────────── */}
      <motion.div
        initial="hidden"
        animate="visible"
        style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 10 }}
      >
        {/* ── Logo block ────────────────────────────────────── */}
        <motion.div variants={rise(0)} style={{ textAlign: 'center', marginBottom: 36 }}>
          {/* K mark */}
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: 'linear-gradient(135deg, #9333ea 0%, #3b82f6 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 0 1px rgba(168,85,247,0.3), 0 16px 40px rgba(147,51,234,0.35)',
              fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: -1,
            }}>
              K
            </div>
            <div>
              <p style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.5px', lineHeight: 1 }}>
                Kodbank
              </p>
              <p style={{ fontSize: 12, color: '#475569', marginTop: 4, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Private Banking Portal
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Glass card ────────────────────────────────────── */}
        <motion.div variants={rise(0.08)} style={{
          background:   'rgba(255,255,255,0.04)',
          border:       '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20,
          padding:      '40px 36px',
          backdropFilter: 'blur(25px)',
          boxShadow:    '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(0,102,255,0.2)',
        }}>

          {/* heading */}
          <motion.div variants={rise(0.12)} style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 20, fontWeight: 600, color: '#f1f5f9', margin: 0, letterSpacing: '-0.3px' }}>
              Welcome back
            </h1>
            <p style={{ fontSize: 13, color: '#64748b', marginTop: 5 }}>
              Sign in to your secure account
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} noValidate>

            {/* ── Username ─────────────────────────────────── */}
            <motion.div variants={rise(0.16)} style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#94a3b8', marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Username
              </label>
              <div style={{ position: 'relative' }}>
                {/* user icon */}
                <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569' }}
                  width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <input
                  id="username" name="username" type="text"
                  placeholder="your username"
                  value={form.username}
                  onChange={handleChange}
                  onFocus={() => setFocused('username')}
                  onBlur={() => setFocused('')}
                  autoComplete="username"
                  style={{
                    ...fieldBorder('username', !!errors.username),
                    width: '100%', padding: '13px 14px 13px 38px',
                  }}
                />
              </div>
              {errors.username && (
                <p style={{ fontSize: 12, color: '#f87171', marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span>⚠</span> {errors.username}
                </p>
              )}
            </motion.div>

            {/* ── Password ──────────────────────────────────── */}
            <motion.div variants={rise(0.20)} style={{ marginBottom: 26 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#94a3b8', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Password
                </label>
                <span style={{ fontSize: 12, color: '#a855f7', cursor: 'default' }}>Forgot password?</span>
              </div>
              <div style={{ position: 'relative' }}>
                {/* lock icon */}
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569' }}>
                  <LockIcon />
                </span>
                <input
                  id="password" name="password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                  autoComplete="current-password"
                  style={{
                    ...fieldBorder('password', !!errors.password),
                    width: '100%', padding: '13px 44px 13px 38px',
                  }}
                />
                {/* eye toggle */}
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  style={{
                    position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#475569',
                    display: 'flex', alignItems: 'center', padding: 2,
                  }}
                  tabIndex={-1}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  <EyeIcon open={showPw} />
                </button>
              </div>
              {errors.password && (
                <p style={{ fontSize: 12, color: '#f87171', marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span>⚠</span> {errors.password}
                </p>
              )}
            </motion.div>

            {/* ── Submit ────────────────────────────────────── */}
            <motion.div variants={rise(0.24)}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '14px 0',
                  background: loading
                    ? 'linear-gradient(135deg,#6b21a8,#1d4ed8)'
                    : 'linear-gradient(135deg,#9333ea 0%,#3b82f6 100%)',
                  border: 'none', borderRadius: 12,
                  color: '#fff', fontSize: 14, fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 20px rgba(147,51,234,0.4)',
                  transition: 'opacity 0.2s, transform 0.15s',
                  letterSpacing: '0.02em',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  opacity: loading ? 0.75 : 1,
                  fontFamily: 'inherit',
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {loading ? (
                  <>
                    <span style={{
                      width: 16, height: 16, borderRadius: '50%',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#fff',
                      animation: 'spin 0.7s linear infinite',
                      display: 'inline-block',
                    }} />
                    Signing in…
                  </>
                ) : (
                  <>
                    <LockIcon /> Log In
                  </>
                )}
              </button>
            </motion.div>

            {/* ── Divider ───────────────────────────────────── */}
            <motion.div variants={rise(0.28)} style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0 0' }}>
              <div style={{ flex: 1, height: 1, background: '#ffffff08' }} />
              <span style={{ fontSize: 11, color: '#334155', letterSpacing: '0.05em', textTransform: 'uppercase' }}>or</span>
              <div style={{ flex: 1, height: 1, background: '#ffffff08' }} />
            </motion.div>

            {/* ── Register link ─────────────────────────────── */}
            <motion.p variants={rise(0.32)} style={{ textAlign: 'center', fontSize: 13, color: '#475569', marginTop: 18 }}>
              New to Kodbank?{' '}
              <Link to="/register" style={{ color: '#a855f7', fontWeight: 600, textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = '#c084fc'}
                onMouseLeave={e => e.currentTarget.style.color = '#a855f7'}>
                Open an account
              </Link>
            </motion.p>
          </form>
        </motion.div>

        {/* ── Security badge ────────────────────────────────── */}
        <motion.div variants={rise(0.36)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 24 }}>
          <span style={{ color: '#22c55e', display: 'flex', alignItems: 'center' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </span>
          <span style={{ fontSize: 11, color: '#334155', letterSpacing: '0.05em' }}>256-bit encrypted · Secure Session</span>
          <span style={{ fontSize: 11, color: '#1e293b' }}>·</span>
          <span style={{ fontSize: 11, color: '#334155' }}>RBI compliant</span>
        </motion.div>
      </motion.div>

      {/* spinner keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
