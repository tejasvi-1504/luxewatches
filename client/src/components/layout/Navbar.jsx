import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, User, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Brand from '../ui/Brand';

const NAV_LINKS = [
  { label: "Men's Watches", href: '/shop?gender=men&type=watch' },
  { label: "Women's Watches", href: '/shop?gender=women&type=watch' },
  { label: 'New Arrivals', href: '/shop?sort=newest' },
  { label: 'Best Sellers', href: '/shop?sort=popular' },
  { label: 'All Timepieces', href: '/shop' },
];

const TICKER_ITEMS = [
  'Free Shipping Pan-India',
  'Use Code SPARKLE10 for 10% Off',
  '50,000+ Happy Customers',
  '7-Day Hassle-Free Returns',
  'Genuine Premium Craftsmanship',
  'Discreet & Secure Packaging',
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItems, setIsOpen } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setSearchOpen(false); }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const tickerContent = [...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
    <span key={i} className="flex items-center gap-3">
      <span style={{ color: 'rgb(var(--accent-rgb)/0.65)', fontSize: '10px', letterSpacing: '0.3em' }}>{item}</span>
      <span style={{ color: 'rgb(var(--accent-rgb)/0.25)', fontSize: '8px' }}>✦</span>
    </span>
  ));

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'backdrop-blur-xl border-b border-white/6'
            : ''
        }`}
        style={{
          background: scrolled
            ? 'rgba(8,6,4,0.97)'
            : 'linear-gradient(180deg, rgba(8,6,4,0.92) 0%, rgba(8,6,4,0.5) 70%, transparent 100%)',
        }}
      >
        {/* Announcement bar */}
        <div className="overflow-hidden border-b"
          style={{ background: 'linear-gradient(90deg, #0d0a06, #1a1208, #0d0a06)', borderColor: 'rgb(var(--accent-rgb)/0.1)', height: 32 }}>
          <div className="h-full flex items-center overflow-hidden">
            <div className="ticker-animate flex gap-10 whitespace-nowrap uppercase tracking-widest">
              {tickerContent}
            </div>
          </div>
        </div>

        {/* Main nav row */}
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-12 py-2' : 'h-14 py-3'}`}>

          {/* Logo */}
          <Link to="/" className="shrink-0 group">
            <Brand size="sm" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <div key={link.label} className="relative"
                onMouseEnter={() => setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link to={link.href}
                  className="flex items-center gap-1 text-[11px] tracking-[0.18em] uppercase transition-colors duration-300 py-2"
                  style={{ color: activeDropdown === link.label ? 'var(--accent)' : 'rgb(var(--ink-rgb)/0.55)' }}>
                  {link.label}
                  {link.sub && (
                    <ChevronDown size={10} className={`transition-transform duration-300 ${activeDropdown === link.label ? 'rotate-180' : ''}`} />
                  )}
                </Link>

                {/* Active underline */}
                <motion.div
                  className="absolute bottom-0 left-0 h-px"
                  style={{ background: 'linear-gradient(90deg, var(--accent), transparent)' }}
                  animate={{ width: activeDropdown === link.label ? '100%' : '0%' }}
                  transition={{ duration: 0.25 }}
                />

                {link.sub && (
                  <AnimatePresence>
                    {activeDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-1 w-48 rounded-xl overflow-hidden shadow-2xl"
                        style={{ background: 'rgba(10,8,5,0.98)', border: '1px solid rgb(var(--accent-rgb)/0.12)', backdropFilter: 'blur(20px)' }}
                      >
                        {link.sub.map((sub, i) => (
                          <Link key={sub.label} to={sub.href}
                            className="flex items-center justify-between px-4 py-2.5 text-[10px] tracking-[0.18em] uppercase transition-all duration-200 group/sub"
                            style={{ color: 'rgb(var(--ink-rgb)/0.45)', borderBottom: i < link.sub.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'rgb(var(--ink-rgb)/0.45)'}
                          >
                            {sub.label}
                            <span style={{ color: 'rgb(var(--accent-rgb)/0)', transition: 'color 0.2s' }}
                              onMouseEnter={e => e.currentTarget.style.color = 'rgb(var(--accent-rgb)/0.5)'}
                              onMouseLeave={e => e.currentTarget.style.color = 'rgb(var(--accent-rgb)/0)'}
                            >→</span>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button onClick={() => setSearchOpen(true)}
              className="transition-colors p-1 hover:scale-110 transition-transform duration-200"
              style={{ color: 'rgb(var(--ink-rgb)/0.55)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgb(var(--ink-rgb)/0.55)'}>
              <Search size={16} />
            </button>
            <Link to={user ? (user.role === 'admin' ? '/admin' : '/account') : '/login'}
              className="transition-colors p-1"
              style={{ color: 'rgb(var(--ink-rgb)/0.55)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgb(var(--ink-rgb)/0.55)'}>
              <User size={16} />
            </Link>
            <button onClick={() => setIsOpen(true)} className="relative p-1 group">
              <ShoppingBag size={16} className="transition-colors duration-200"
                style={{ color: 'rgb(var(--ink-rgb)/0.55)' }}
                onMouseEnter={e => e.style.color = 'var(--accent)'}
                onMouseLeave={e => e.style.color = 'rgb(var(--ink-rgb)/0.55)'} />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 text-black text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
                  style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}
                >
                  {totalItems > 9 ? '9+' : totalItems}
                </motion.span>
              )}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-1 transition-colors"
              style={{ color: 'rgb(var(--ink-rgb)/0.55)' }}>
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 280, damping: 30 }}
              className="fixed right-0 top-0 h-full w-[280px] z-50 flex flex-col overflow-y-auto"
              style={{ background: '#0c0a07', borderLeft: '1px solid rgb(var(--accent-rgb)/0.1)' }}
            >
              <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="font-cormorant text-lg tracking-[0.2em] uppercase text-white/80">Menu</span>
                <button onClick={() => setMobileOpen(false)} className="text-white/30 hover:text-white p-1 transition-colors"><X size={17} /></button>
              </div>
              <nav className="flex-1 p-5 space-y-0.5">
                {NAV_LINKS.map((link, i) => (
                  <motion.div key={link.label} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                    <Link to={link.href}
                      className="block text-sm font-light tracking-[0.12em] uppercase py-3 transition-colors"
                      style={{ color: 'rgb(var(--ink-rgb)/0.7)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgb(var(--ink-rgb)/0.7)'}>
                      {link.label}
                    </Link>
                    {link.sub && (
                      <div className="ml-3 mt-1 mb-2 space-y-0.5">
                        {link.sub.map(sub => (
                          <Link key={sub.label} to={sub.href}
                            className="block text-[10px] tracking-[0.18em] uppercase py-1.5 transition-colors"
                            style={{ color: 'rgb(var(--ink-rgb)/0.3)' }}
                            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'rgb(var(--ink-rgb)/0.3)'}>
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </nav>
              <div className="p-5 space-y-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {user ? (
                  <>
                    <Link to="/account" className="flex items-center gap-2 text-sm transition-colors"
                      style={{ color: 'rgb(var(--ink-rgb)/0.5)' }}>
                      <User size={14} /> My Account
                    </Link>
                    <button onClick={logout} className="flex items-center gap-2 text-sm text-white/25 hover:text-red-400 transition-colors">
                      Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login"
                    className="block text-center py-3 text-black text-xs font-semibold tracking-[0.25em] uppercase rounded-lg"
                    style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}>
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            style={{ background: 'rgba(8,6,4,0.97)', backdropFilter: 'blur(20px)' }}
            onClick={() => setSearchOpen(false)}
          >
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl" onClick={e => e.stopPropagation()}>
              <p className="text-[9px] tracking-[0.5em] uppercase text-center mb-8" style={{ color: 'rgb(var(--accent-rgb)/0.7)' }}>
                ✦ Search Collection ✦
              </p>
              <form onSubmit={handleSearch} className="relative">
                <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Rolex, Chanel, Bags..."
                  className="w-full bg-transparent text-white text-3xl sm:text-4xl pb-4 pr-14 outline-none tracking-wide font-cormorant font-light"
                  style={{ borderBottom: '1px solid rgb(var(--accent-rgb)/0.4)', color: 'var(--ink)' }}
                />
                <button type="submit" className="absolute right-0 bottom-4 transition-colors" style={{ color: 'var(--accent)' }}>
                  <Search size={20} />
                </button>
              </form>
              <p className="text-[10px] tracking-widest uppercase mt-6" style={{ color: 'rgb(var(--ink-rgb)/0.2)' }}>
                Press Enter to search
              </p>
            </motion.div>
            <button onClick={() => setSearchOpen(false)} className="absolute top-6 right-6 text-white/20 hover:text-white/60 p-2 transition-colors">
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
