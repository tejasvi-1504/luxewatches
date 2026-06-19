import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import Brand from '../components/ui/Brand';
import toast from 'react-hot-toast';

export default function Login() {
  const { brandName } = useSettings();
  const [isLogin, setIsLogin] = useState(true);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = isLogin
        ? await login(form.email, form.password)
        : await register(form.name, form.email, form.password);
      toast.success(`Welcome${isLogin ? ' back' : ''}, ${user.name}!`, {
        style: { background: '#0c0a07', color: 'var(--accent)', border: '1px solid rgb(var(--accent-rgb)/0.2)' },
      });
      navigate(user.role === 'admin' ? '/admin' : from, { replace: true });
    } catch (err) {
      toast.error(err.message, { style: { background: '#0c0a07', color: '#ef4444' } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#080604' }}>

      {/* Left Panel — luxury image (desktop only) */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden flex-col justify-between p-12">
        <img
          src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=1200&q=95"
          alt="Luxury Watch"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.35 }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(8,6,4,0.7) 0%, rgba(8,6,4,0.4) 60%, rgba(8,6,4,0.85) 100%)' }} />

        {/* Animated grid lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          {[20, 45, 70].map((top, i) => (
            <motion.div key={i} className="absolute h-px w-full"
              style={{ top: `${top}%`, background: 'linear-gradient(90deg, transparent, rgb(var(--accent-rgb)/0.3), transparent)' }}
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 12 + i * 3, repeat: Infinity, ease: 'linear', delay: i * 2 }}
            />
          ))}
        </div>

        {/* Logo */}
        <Link to="/" className="relative z-10 group">
          <Brand size="md" />
        </Link>

        {/* Center quote */}
        <div className="relative z-10 max-w-sm">
          <div className="mb-6">
            <span className="font-cormorant text-7xl leading-none" style={{ color: 'rgb(var(--accent-rgb)/0.25)' }}>"</span>
          </div>
          <p className="font-cormorant text-3xl sm:text-4xl font-light text-white leading-tight mb-6">
            Precision is not just a skill —{' '}
            <span className="gold-text font-medium italic">it's a luxury.</span>
          </p>
          <div className="h-px w-12 mb-5" style={{ background: 'linear-gradient(90deg, var(--accent), transparent)' }} />
          <p className="text-xs tracking-[0.3em] uppercase" style={{ color: 'rgb(var(--ink-rgb)/0.35)' }}>
            {brandName} — Est. 2024
          </p>
        </div>

        {/* Bottom stats */}
        <div className="relative z-10 flex gap-10">
          {[['50K+', 'Customers'], ['500+', 'Designs'], ['4.9★', 'Rating']].map(([v, l]) => (
            <div key={l}>
              <p className="font-cormorant text-2xl gold-text font-medium">{v}</p>
              <p className="text-[9px] tracking-[0.3em] uppercase" style={{ color: 'rgb(var(--ink-rgb)/0.3)' }}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:py-0 pt-28 lg:pt-0">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex items-center justify-center mb-8 group">
            <Brand size="md" variant="badge" />
          </Link>

          {/* Heading */}
          <div className="mb-9">
            <p className="text-[9px] tracking-[0.5em] uppercase mb-3" style={{ color: 'rgb(var(--accent-rgb)/0.7)' }}>
              — {brandName}
            </p>
            <h1 className="font-cormorant text-4xl sm:text-5xl font-light text-white leading-tight">
              {isLogin ? (
                <>Welcome<br /><span className="gold-text font-medium italic">Back.</span></>
              ) : (
                <>Create Your<br /><span className="gold-text font-medium italic">Account.</span></>
              )}
            </h1>
            <p className="text-sm mt-3" style={{ color: 'rgb(var(--ink-rgb)/0.35)' }}>
              {isLogin ? 'Sign in to access your account' : `Join the ${brandName} family today`}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex mb-8 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {['Login', 'Register'].map((tab, i) => (
              <button key={tab} onClick={() => setIsLogin(i === 0)}
                className="flex-1 py-2.5 text-[10px] font-semibold tracking-[0.25em] uppercase rounded-lg transition-all duration-300"
                style={{
                  background: (isLogin ? i === 0 : i === 1) ? 'linear-gradient(135deg, var(--accent), var(--accent-2))' : 'transparent',
                  color: (isLogin ? i === 0 : i === 1) ? '#000' : 'rgb(var(--ink-rgb)/0.35)',
                }}>
                {tab}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence>
              {!isLogin && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="relative">
                  <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'rgb(var(--accent-rgb)/0.5)' }} />
                  <input type="text" placeholder="Full Name" required value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full rounded-xl pl-11 pr-4 py-3.5 text-sm outline-none transition-all duration-300"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'var(--ink)',
                      fontFamily: 'Inter',
                    }}
                    onFocus={e => e.target.style.borderColor = 'rgb(var(--accent-rgb)/0.4)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'rgb(var(--accent-rgb)/0.5)' }} />
              <input type="email" placeholder="Email Address" required value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full rounded-xl pl-11 pr-4 py-3.5 text-sm outline-none transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--ink)' }}
                onFocus={e => e.target.style.borderColor = 'rgb(var(--accent-rgb)/0.4)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>

            <div className="relative">
              <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'rgb(var(--accent-rgb)/0.5)' }} />
              <input
                type={showPwd ? 'text' : 'password'} placeholder="Password" required value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full rounded-xl pl-11 pr-12 py-3.5 text-sm outline-none transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--ink)' }}
                onFocus={e => e.target.style.borderColor = 'rgb(var(--accent-rgb)/0.4)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: 'rgb(var(--ink-rgb)/0.25)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgb(var(--ink-rgb)/0.7)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgb(var(--ink-rgb)/0.25)'}>
                {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            <button type="submit" disabled={loading}
              className="group relative overflow-hidden w-full py-4 text-black text-[10px] font-bold tracking-[0.3em] uppercase rounded-xl mt-2 flex items-center justify-center gap-2.5 transition-opacity disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}>
              <motion.div className="absolute inset-0 bg-white/15" initial={{ x: '-100%' }} whileHover={{ x: '100%' }} transition={{ duration: 0.55 }} />
              <span className="relative">{loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}</span>
              {!loading && <ArrowRight size={12} className="relative group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          {isLogin && (
            <p className="text-center text-[11px] mt-5" style={{ color: 'rgb(var(--ink-rgb)/0.25)' }}>
              Demo admin:{' '}
              <span style={{ color: 'rgb(var(--accent-rgb)/0.7)' }}>admin@luxewatches.com</span>
              {' '}/ <span style={{ color: 'rgb(var(--accent-rgb)/0.7)' }}>admin123</span>
            </p>
          )}

          <p className="text-center mt-6 text-xs" style={{ color: 'rgb(var(--ink-rgb)/0.2)' }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setIsLogin(!isLogin)} className="transition-colors" style={{ color: 'var(--accent)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-2)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--accent)'}>
              {isLogin ? 'Register' : 'Sign In'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
