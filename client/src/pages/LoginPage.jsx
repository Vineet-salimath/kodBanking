import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' },
  }),
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email is required';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      return;
    }
    setLoading(true);
    try {
      const { data } = await loginUser(form);
      login(data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute -top-60 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        className="w-full max-w-md"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      >
        {/* Logo */}
        <motion.div variants={fadeUp} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/30">
              K
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Kodbank
            </span>
          </div>
          <h1 className="text-xl font-semibold text-white">Welcome back</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to your account</p>
        </motion.div>

        <motion.form
          variants={fadeUp}
          onSubmit={handleSubmit}
          className="glass-card p-8 space-y-5"
          noValidate
        >
          <motion.div custom={0} variants={fadeUp}>
            <label htmlFor="email" className="label">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              className={`input-field ${errors.email ? 'border-red-500/60 focus:ring-red-500' : ''}`}
              autoComplete="email"
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </motion.div>

          <motion.div custom={1} variants={fadeUp}>
            <label htmlFor="password" className="label">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className={`input-field ${errors.password ? 'border-red-500/60 focus:ring-red-500' : ''}`}
              autoComplete="current-password"
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </motion.div>

          <motion.div custom={2} variants={fadeUp}>
            <button type="submit" disabled={loading} className="btn-primary mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : 'Sign In'}
            </button>
          </motion.div>

          <motion.p custom={3} variants={fadeUp} className="text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Create one
            </Link>
          </motion.p>
        </motion.form>

        <motion.p custom={4} variants={fadeUp} className="text-center text-xs text-slate-600 mt-6">
          Protected with end-to-end encryption · SSL secured
        </motion.p>
      </motion.div>
    </div>
  );
}
