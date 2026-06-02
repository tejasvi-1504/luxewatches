import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Package, ShoppingCart, Tag, Star, BarChart2, LogOut, Menu, X, RefreshCw, Truck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/categories', label: 'Categories', icon: Tag },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
  { to: '/admin/refunds', label: 'Refunds', icon: RefreshCw },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => { await logout(); navigate('/'); };

  const isActive = (to, exact) => exact ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <div className="flex h-screen bg-[#080808] overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 70 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="h-full bg-[#0f0f0f] border-r border-white/5 flex flex-col shrink-0 overflow-hidden"
      >
        <div className="p-4 flex items-center gap-3 border-b border-white/5 min-h-16">
          <div className="w-8 h-8 shrink-0 rounded-full border border-[#C9A84C] flex items-center justify-center">
            <span className="text-[#C9A84C] text-xs font-bold">LW</span>
          </div>
          {sidebarOpen && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-light tracking-widest uppercase text-white whitespace-nowrap">
              Admin Panel
            </motion.span>
          )}
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV.map(({ to, label, icon: Icon, exact }) => (
            <Link key={to} to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${isActive(to, exact) ? 'bg-[#C9A84C]/10 text-[#C9A84C]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
              <Icon size={18} className="shrink-0" />
              {sidebarOpen && <span className="text-sm whitespace-nowrap">{label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-white/5">
          {sidebarOpen && (
            <div className="flex items-center gap-2 px-3 py-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-[#C9A84C]/10 flex items-center justify-center text-[#C9A84C] text-xs font-bold">
                {user?.name?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-white/30 truncate">{user?.email}</p>
              </div>
            </div>
          )}
          <button onClick={handleLogout}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/5 transition-all w-full`}>
            <LogOut size={18} className="shrink-0" />
            {sidebarOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-[#0f0f0f] border-b border-white/5 flex items-center px-6 gap-4 shrink-0">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white/40 hover:text-white transition-colors">
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <Link to="/" className="text-xs text-white/30 hover:text-[#C9A84C] tracking-widest uppercase transition-colors">
            View Site →
          </Link>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
