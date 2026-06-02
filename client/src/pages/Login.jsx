import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
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
      const user = isLogin ? await login(form.email, form.password) : await register(form.name, form.email, form.password);
      toast.success(`Welcome${isLogin ? ' back' : ''}, ${user.name}!`, { style: { background: '#111', color: '#C9A84C', border: '1px solid #C9A84C33' } });
      navigate(user.role === 'admin' ? '/admin' : from, { replace: true });
    } catch (err) {
      toast.error(err.message, { style: { background: '#111', color: '#ef4444' } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10">
      {/* Background */}
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1920" alt="" className="w-full h-full object-cover opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-[#111]" />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-full border border-[#C9A84C] flex items-center justify-center">
              <span className="text-[#C9A84C] font-bold">LW</span>
            </div>
          </Link>
          <h1 className="text-2xl font-light text-white mt-4">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p className="text-white/30 text-sm mt-1">{isLogin ? 'Sign in to your account' : 'Join the LuxeWatches family'}</p>
        </div>

        <div className="glass rounded-2xl p-8">
          {/* Tabs */}
          <div className="flex mb-6 p-1 glass rounded-lg">
            <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 text-sm tracking-widest uppercase rounded transition-all ${isLogin ? 'bg-[#C9A84C] text-black font-semibold' : 'text-white/40 hover:text-white'}`}>
              Login
            </button>
            <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 text-sm tracking-widest uppercase rounded transition-all ${!isLogin ? 'bg-[#C9A84C] text-black font-semibold' : 'text-white/40 hover:text-white'}`}>
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="text" placeholder="Full Name" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-[#C9A84C] transition-colors" />
              </div>
            )}
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input type="email" placeholder="Email Address" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-[#C9A84C] transition-colors" />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input type={showPwd ? 'text' : 'password'} placeholder="Password" required value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-10 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-[#C9A84C] transition-colors" />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70">
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-[#C9A84C] text-black font-semibold tracking-widest uppercase text-sm hover:bg-[#E8C97A] transition-colors disabled:opacity-50 rounded-lg">
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {isLogin && (
            <p className="text-center text-xs text-white/30 mt-4">
              Demo admin: <span className="text-[#C9A84C]">admin@luxewatches.com</span> / <span className="text-[#C9A84C]">admin123</span>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
