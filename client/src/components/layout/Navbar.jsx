import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, User, Menu, X, Heart, ChevronDown } from 'lucide-react';
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
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

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
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-black/95 backdrop-blur-xl border-b border-white/5 py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full border border-[#C9A84C] flex items-center justify-center group-hover:bg-[#C9A84C] transition-colors duration-300">
              <span className="text-[#C9A84C] group-hover:text-black text-xs font-bold transition-colors">LW</span>
            </div>
            <span className="text-lg font-light tracking-[0.2em] uppercase text-white">
              Luxe<span className="gold-text font-medium">Watches</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <div key={link.label} className="relative group"
                onMouseEnter={() => setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link to={link.href} className="flex items-center gap-1 text-sm tracking-widest uppercase text-white/70 hover:text-[#C9A84C] transition-colors duration-300 py-2">
                  {link.label}
                  {link.sub && <ChevronDown size={12} className="transition-transform group-hover:rotate-180 duration-300" />}
                </Link>
                {link.sub && (
                  <AnimatePresence>
                    {activeDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-1 glass rounded-lg min-w-[160px] overflow-hidden"
                      >
                        {link.sub.map((sub) => (
                          <Link key={sub.label} to={sub.href}
                            className="block px-4 py-2.5 text-xs tracking-widest uppercase text-white/60 hover:text-[#C9A84C] hover:bg-white/5 transition-all"
                          >
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
          <div className="flex items-center gap-4">
            <button onClick={() => setSearchOpen(true)} className="text-white/70 hover:text-[#C9A84C] transition-colors">
              <Search size={18} />
            </button>
            {user ? (
              <div className="relative group">
                <Link to={user.role === 'admin' ? '/admin' : '/account'} className="text-white/70 hover:text-[#C9A84C] transition-colors">
                  <User size={18} />
                </Link>
              </div>
            ) : (
              <Link to="/login" className="text-white/70 hover:text-[#C9A84C] transition-colors">
                <User size={18} />
              </Link>
            )}
            <button onClick={() => setIsOpen(true)} className="relative text-white/70 hover:text-[#C9A84C] transition-colors">
              <ShoppingBag size={18} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#C9A84C] text-black text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-white/70 hover:text-[#C9A84C] transition-colors">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="fixed inset-0 z-40 bg-black/98 backdrop-blur-xl pt-20 px-6 overflow-y-auto"
          >
            <div className="space-y-6">
              {NAV_LINKS.map((link, i) => (
                <motion.div key={link.label} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <Link to={link.href} className="block text-2xl font-light tracking-widest uppercase text-white hover:text-[#C9A84C] transition-colors mb-2">
                    {link.label}
                  </Link>
                  {link.sub && (
                    <div className="ml-4 space-y-2">
                      {link.sub.map(sub => (
                        <Link key={sub.label} to={sub.href} className="block text-sm tracking-widest uppercase text-white/40 hover:text-[#C9A84C] transition-colors">
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
              <div className="pt-6 border-t border-white/10">
                {user ? (
                  <>
                    <Link to="/account" className="block text-lg text-white/70 hover:text-[#C9A84C] mb-3">My Account</Link>
                    <button onClick={logout} className="text-lg text-white/70 hover:text-red-400">Logout</button>
                  </>
                ) : (
                  <Link to="/login" className="block text-lg text-white/70 hover:text-[#C9A84C]">Login / Register</Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center px-6"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl"
              onClick={e => e.stopPropagation()}
            >
              <form onSubmit={handleSearch} className="relative">
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search watches, bags, brands..."
                  className="w-full bg-transparent border-b-2 border-[#C9A84C] text-white text-2xl pb-3 pr-12 outline-none placeholder-white/20 tracking-wide"
                />
                <button type="submit" className="absolute right-0 bottom-3 text-[#C9A84C]">
                  <Search size={24} />
                </button>
              </form>
              <button onClick={() => setSearchOpen(false)} className="absolute top-6 right-6 text-white/50 hover:text-white">
                <X size={24} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
