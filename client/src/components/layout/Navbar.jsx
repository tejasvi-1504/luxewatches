import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, User, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { label: 'Men', href: '/shop?gender=men', sub: [
    { label: 'Watches', href: '/shop?gender=men&type=watch' },
    { label: 'Bags', href: '/shop?gender=men&type=bag' },
    { label: 'Accessories', href: '/shop?gender=men&type=accessory' },
  ]},
  { label: 'Women', href: '/shop?gender=women', sub: [
    { label: 'Watches', href: '/shop?gender=women&type=watch' },
    { label: 'Bags', href: '/shop?gender=women&type=bag' },
    { label: 'Accessories', href: '/shop?gender=women&type=accessory' },
    { label: 'Wallets', href: '/shop?gender=women&type=wallet' },
    { label: 'Sunglasses', href: '/shop?gender=women&type=sunglasses' },
  ]},
  { label: 'New Arrivals', href: '/shop?sort=newest' },
  { label: 'Best Sellers', href: '/shop?sort=popular' },
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

  // Lock body scroll when mobile menu open
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

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-black/98 backdrop-blur-xl border-b border-white/8 py-3'
            : 'bg-gradient-to-b from-black/70 to-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-12">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-7 h-7 rounded-full border border-[#C9A84C] flex items-center justify-center group-hover:bg-[#C9A84C] transition-colors duration-300">
              <span className="text-[#C9A84C] group-hover:text-black text-[10px] font-bold transition-colors">LW</span>
            </div>
            <span className="text-base font-light tracking-[0.15em] uppercase text-white hidden sm:block">
              Luxe<span className="text-[#C9A84C] font-semibold">Watches</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <div key={link.label} className="relative"
                onMouseEnter={() => setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link to={link.href}
                  className="flex items-center gap-1 text-xs tracking-[0.15em] uppercase text-white/65 hover:text-[#C9A84C] transition-colors duration-300 py-2">
                  {link.label}
                  {link.sub && <ChevronDown size={11} className={`transition-transform duration-300 ${activeDropdown === link.label ? 'rotate-180' : ''}`} />}
                </Link>
                {link.sub && (
                  <AnimatePresence>
                    {activeDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.18 }}
                        className="absolute top-full left-0 mt-0 w-44 bg-black/98 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl"
                      >
                        {link.sub.map((sub) => (
                          <Link key={sub.label} to={sub.href}
                            className="block px-4 py-2.5 text-[11px] tracking-[0.15em] uppercase text-white/55 hover:text-[#C9A84C] hover:bg-white/5 transition-all">
                            {sub.label}
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
          <div className="flex items-center gap-3 sm:gap-4">
            <button onClick={() => setSearchOpen(true)} className="text-white/65 hover:text-[#C9A84C] transition-colors p-1">
              <Search size={17} />
            </button>
            <Link to={user ? (user.role === 'admin' ? '/admin' : '/account') : '/login'}
              className="text-white/65 hover:text-[#C9A84C] transition-colors p-1">
              <User size={17} />
            </Link>
            <button onClick={() => setIsOpen(true)} className="relative text-white/65 hover:text-[#C9A84C] transition-colors p-1">
              <ShoppingBag size={17} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C9A84C] text-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-white/65 hover:text-[#C9A84C] transition-colors p-1">
              {mobileOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              className="fixed right-0 top-0 h-full w-[280px] bg-[#0a0a0a] border-l border-white/8 z-50 flex flex-col overflow-y-auto"
            >
              <div className="flex items-center justify-between p-5 border-b border-white/8">
                <span className="text-sm font-light tracking-[0.2em] uppercase text-white">Menu</span>
                <button onClick={() => setMobileOpen(false)} className="text-white/40 hover:text-white p-1"><X size={18} /></button>
              </div>
              <nav className="flex-1 p-5 space-y-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.div key={link.label} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                    <Link to={link.href} className="block text-base font-light tracking-[0.1em] uppercase text-white hover:text-[#C9A84C] transition-colors py-3 border-b border-white/5">
                      {link.label}
                    </Link>
                    {link.sub && (
                      <div className="ml-3 mt-1 mb-2 space-y-1">
                        {link.sub.map(sub => (
                          <Link key={sub.label} to={sub.href} className="block text-xs tracking-[0.15em] uppercase text-white/35 hover:text-[#C9A84C] transition-colors py-1.5">
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </nav>
              <div className="p-5 border-t border-white/8 space-y-3">
                {user ? (
                  <>
                    <Link to="/account" className="flex items-center gap-2 text-sm text-white/60 hover:text-[#C9A84C] transition-colors">
                      <User size={15} /> My Account
                    </Link>
                    <button onClick={logout} className="flex items-center gap-2 text-sm text-white/40 hover:text-red-400 transition-colors">
                      Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login" className="block text-center py-3 bg-[#C9A84C] text-black text-xs font-bold tracking-[0.2em] uppercase rounded-lg">
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center px-6"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
              className="w-full max-w-2xl" onClick={e => e.stopPropagation()}>
              <p className="text-xs tracking-[0.3em] uppercase text-[#C9A84C] mb-6 text-center">Search Collection</p>
              <form onSubmit={handleSearch} className="relative">
                <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Rolex, Chanel, Bags..."
                  className="w-full bg-transparent border-b-2 border-[#C9A84C] text-white text-2xl sm:text-3xl pb-3 pr-12 outline-none placeholder-white/15 tracking-wide" />
                <button type="submit" className="absolute right-0 bottom-3 text-[#C9A84C] hover:text-white transition-colors">
                  <Search size={22} />
                </button>
              </form>
            </motion.div>
            <button onClick={() => setSearchOpen(false)} className="absolute top-5 right-5 text-white/30 hover:text-white p-2">
              <X size={22} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
