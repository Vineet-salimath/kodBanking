import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

/* â”€â”€â”€ Icons â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function UserIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}
function LockIcon({ size = 15 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
}
function EyeIcon({ open }) {
  return open
    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
}
function ShieldIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
}

/* â”€â”€â”€ Animation helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const rise = (delay = 0) => ({
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
});

/* â•â• Main component â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
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
    if (!form.username || form.username.trim().length < 3) e.username = 'At least 3 characters required';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fe = validate();
    if (Object.keys(fe).length) { setErrors(fe); return; }
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

  return (
    <div className="auth-bg" style={{ padding: '24px 16px' }}>
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: '100%', maxWidth: 900,
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          minHeight: 580, borderRadius: 28, overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
        }}
        className="auth-card"
      >
        {/* â”€â”€ LEFT: Brand panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div style={{
          background: 'linear-gradient(145deg, #1a0533 0%, #0d1b4a 50%, #001030 100%)',
          padding: '48px 40px', display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -80, left: -80, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(147,51,234,0.4) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -60, right: -60, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.32) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg,#9333ea,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: '#fff', boxShadow: '0 0 24px rgba(147,51,234,0.5)' }}>K</div>
              <div>
                <p style={{ fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '-0.4px', lineHeight: 1 }}>Kodbank</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 3 }}>Private Banking</p>
              </div>
            </div>

            <h2 style={{ fontSize: 28, fontWeight: 700, color: '#fff', lineHeight: 1.3, letterSpacing: '-0.5px', marginBottom: 12 }}>
              Your money,<br/>
              <span style={{ background: 'linear-gradient(90deg,#c084fc,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                beautifully managed.
              </span>
            </h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, marginBottom: 28 }}>
              Next-generation banking with real-time insights, AI-powered advice, and bank-grade security.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { icon: 'ðŸ›¡ï¸', text: '256-bit end-to-end encryption' },
                { icon: 'ðŸ¤–', text: 'AI financial assistant built-in' },
                { icon: 'âš¡', text: 'Instant transfers & analytics' },
                { icon: 'ðŸ¦', text: 'RBI compliant & insured deposits' },
              ].map((f, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.18 + i * 0.08 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', fontSize: 13, color: 'rgba(255,255,255,0.82)' }}>
                  <span style={{ fontSize: 16 }}>{f.icon}</span> {f.text}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
            style={{ display: 'flex', gap: 24, marginTop: 36, position: 'relative', zIndex: 1 }}>
            {[['â‚¹2.4Cr+', 'Managed'], ['12K+', 'Customers'], ['99.9%', 'Uptime']].map(([v, l]) => (
              <div key={l}>
                <p style={{ fontSize: 18, fontWeight: 700, color: '#c084fc' }}>{v}</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{l}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* â”€â”€ RIGHT: Form panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div style={{ padding: '48px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

          <motion.div variants={rise(0.1)} initial="hidden" animate="visible" style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.4px', margin: 0 }}>Welcome back</h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6 }}>Sign in to your secure account</p>
          </motion.div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Username */}
            <motion.div variants={rise(0.15)} initial="hidden" animate="visible" style={{ marginBottom: 18 }}>
              <label className="label">Username</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon"><UserIcon /></span>
                <input name="username" type="text" placeholder="your username"
                  value={form.username} onChange={handleChange}
                  onFocus={() => setFocused('username')} onBlur={() => setFocused('')}
                  autoComplete="username"
                  className="input-field"
                  style={{ borderColor: errors.username ? 'var(--color-danger)' : focused === 'username' ? 'var(--accent-purple)' : undefined }}
                />
              </div>
              {errors.username && <p className="error-text">âš  {errors.username}</p>}
            </motion.div>

            {/* Password */}
            <motion.div variants={rise(0.2)} initial="hidden" animate="visible" style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label className="label" style={{ margin: 0 }}>Password</label>
                <span style={{ fontSize: 12, color: 'var(--accent-purple)', fontWeight: 500, cursor: 'default' }}>Forgot password?</span>
              </div>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon"><LockIcon /></span>
                <input name="password" type={showPw ? 'text' : 'password'} placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                  value={form.password} onChange={handleChange}
                  onFocus={() => setFocused('password')} onBlur={() => setFocused('')}
                  autoComplete="current-password"
                  className="input-field pr-10"
                  style={{ borderColor: errors.password ? 'var(--color-danger)' : focused === 'password' ? 'var(--accent-purple)' : undefined }}
                />
                <button type="button" className="auth-eye-btn" onClick={() => setShowPw(v => !v)} tabIndex={-1}>
                  <EyeIcon open={showPw} />
                </button>
              </div>
              {errors.password && <p className="error-text">âš  {errors.password}</p>}
            </motion.div>

            {/* Submit */}
            <motion.div variants={rise(0.25)} initial="hidden" animate="visible" style={{ marginTop: 24 }}>
              <button type="submit" disabled={loading} className="btn-primary"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 0' }}>
                {loading
                  ? <><span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> Signing inâ€¦</>
                  : <><LockIcon size={14} /> Log In</>}
              </button>
            </motion.div>

            {/* Divider + register link */}
            <motion.div variants={rise(0.3)} initial="hidden" animate="visible"
              style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '22px 0 18px' }}>
              <div className="auth-divider" style={{ flex: 1 }} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>or</span>
              <div className="auth-divider" style={{ flex: 1 }} />
            </motion.div>

            <motion.p variants={rise(0.35)} initial="hidden" animate="visible"
              style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
              New to Kodbank?{' '}
              <Link to="/register" className="auth-link">Open an account</Link>
            </motion.p>
          </form>

          {/* Trust strip */}
          <motion.div variants={rise(0.4)} initial="hidden" animate="visible"
            className="trust-strip" style={{ marginTop: 28 }}>
            <span style={{ color: '#22c55e', display: 'flex' }}><ShieldIcon /></span>
            256-bit encrypted
            <span style={{ color: 'var(--border-color)' }}>Â·</span>
            Secure session
            <span style={{ color: 'var(--border-color)' }}>Â·</span>
            RBI compliant
          </motion.div>
        </div>
      </motion.div>

      {/* Responsive: collapse left panel on mobile */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 680px) {
          .auth-card { grid-template-columns: 1fr !important; }
          .auth-card > div:first-child { display: none !important; }
        }
      `}</style>
    </div>
  );
}
