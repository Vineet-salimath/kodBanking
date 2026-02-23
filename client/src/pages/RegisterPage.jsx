import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { registerUser } from '../services/api';

const rise = (d = 0) => ({
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { delay: d, duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
});

/* â”€â”€â”€ Field icons â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const ICONS = {
  username: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  email:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  phone:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.29 6.29l1.49-.89a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  password: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form,    setForm]    = useState({ username: '', email: '', phone: '', password: '' });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');
  const [showPw,  setShowPw]  = useState(false);

  const validate = () => {
    const e = {};
    if (!form.username.trim() || form.username.length < 3) e.username = 'Min 3 characters';
    else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) e.username = 'Letters, numbers and underscores only';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone || !/^[0-9+\-\s]{7,20}$/.test(form.phone)) e.phone = 'Valid phone number required';
    if (!form.password || form.password.length < 8) e.password = 'Minimum 8 characters';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) e.password = 'Needs uppercase, lowercase & number';
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
      await registerUser({ ...form, role: 'customer' });
      toast.success('Account created! Please log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const FIELDS = [
    { label: 'Username',     name: 'username', type: 'text',     placeholder: 'johndoe123',       auto: 'username' },
    { label: 'Email Address',name: 'email',    type: 'email',    placeholder: 'you@example.com',  auto: 'email' },
    { label: 'Phone Number', name: 'phone',    type: 'tel',      placeholder: '+91 98765 43210',  auto: 'tel' },
    { label: 'Password',     name: 'password', type: showPw ? 'text' : 'password', placeholder: 'â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢', auto: 'new-password' },
  ];

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
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg,#9333ea,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: '#fff', boxShadow: '0 0 24px rgba(147,51,234,0.5)' }}>K</div>
              <div>
                <p style={{ fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '-0.4px', lineHeight: 1 }}>Kodbank</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 3 }}>Private Banking</p>
              </div>
            </div>

            <h2 style={{ fontSize: 26, fontWeight: 700, color: '#fff', lineHeight: 1.3, letterSpacing: '-0.5px', marginBottom: 12 }}>
              Start your banking<br/>
              <span style={{ background: 'linear-gradient(90deg,#60a5fa,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                journey today.
              </span>
            </h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, marginBottom: 32 }}>
              Open your account in under 2 minutes and get access to powerful financial tools designed for modern India.
            </p>

            {/* Steps */}
            {[
              { step: '01', title: 'Create account',    desc: 'Fill in your basic details' },
              { step: '02', title: 'Verify identity',   desc: 'Quick KYC verification' },
              { step: '03', title: 'Start banking',     desc: 'Transfers, analytics & AI' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(147,51,234,0.3)', border: '1px solid rgba(168,85,247,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#c084fc', flexShrink: 0 }}>{s.step}</div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0 }}>{s.title}</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: 0, marginTop: 2 }}>{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* â”€â”€ RIGHT: Form â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div style={{ padding: '48px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <motion.div variants={rise(0.08)} initial="hidden" animate="visible" style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.4px', margin: 0 }}>Create your account</h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6 }}>Start your modern banking journey</p>
          </motion.div>

          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {FIELDS.map(({ label, name, type, placeholder, auto }, i) => (
              <motion.div key={name} variants={rise(0.12 + i * 0.06)} initial="hidden" animate="visible">
                <label className="label">{label}</label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">{ICONS[name]}</span>
                  <input
                    name={name} type={type} placeholder={placeholder}
                    value={form[name]} onChange={handleChange}
                    onFocus={() => setFocused(name)} onBlur={() => setFocused('')}
                    autoComplete={auto}
                    className="input-field"
                    style={{ borderColor: errors[name] ? 'var(--color-danger)' : focused === name ? 'var(--accent-purple)' : undefined }}
                  />
                  {name === 'password' && (
                    <button type="button" className="auth-eye-btn" onClick={() => setShowPw(v => !v)} tabIndex={-1}>
                      {showPw
                        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>}
                    </button>
                  )}
                </div>
                {errors[name] && <p className="error-text">âš  {errors[name]}</p>}
              </motion.div>
            ))}

            <motion.div variants={rise(0.42)} initial="hidden" animate="visible" style={{ marginTop: 4 }}>
              <button type="submit" disabled={loading} className="btn-primary"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 0' }}>
                {loading
                  ? <><span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> Creating accountâ€¦</>
                  : 'Create Account â†’'}
              </button>
            </motion.div>

            <motion.div variants={rise(0.48)} initial="hidden" animate="visible"
              style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '6px 0 12px' }}>
              <div className="auth-divider" style={{ flex: 1 }} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>or</span>
              <div className="auth-divider" style={{ flex: 1 }} />
            </motion.div>

            <motion.p variants={rise(0.54)} initial="hidden" animate="visible"
              style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">Sign in</Link>
            </motion.p>

            <motion.div variants={rise(0.6)} initial="hidden" animate="visible"
              className="trust-strip" style={{ marginTop: 20 }}>
              <span style={{ color: '#22c55e', display: 'flex' }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></span>
              256-bit encrypted
              <span style={{ color: 'var(--border-color)' }}>·</span>
              Secure session
              <span style={{ color: 'var(--border-color)' }}>·</span>
              RBI compliant
            </motion.div>
          </form>
        </div>
      </motion.div>

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

