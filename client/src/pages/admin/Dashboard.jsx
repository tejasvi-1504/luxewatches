import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Package, DollarSign, TrendingUp, Clock, CheckCircle, Truck, RefreshCw } from 'lucide-react';
import api from '../../utils/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/orders/admin/stats'), api.get('/orders/admin/all?limit=5')]).then(([s, o]) => {
      setStats(s.data.stats);
      setRecentOrders(o.data.orders);
    }).finally(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { label: 'Total Revenue', value: `₹${stats.totalRevenue?.toLocaleString() || 0}`, icon: DollarSign, color: '#C9A84C', change: '+12%' },
    { label: 'Total Orders', value: stats.totalOrders || 0, icon: ShoppingCart, color: '#60a5fa', change: '+8%' },
    { label: 'Pending Orders', value: stats.pendingOrders || 0, icon: Clock, color: '#f59e0b', change: '' },
    { label: 'Delivered', value: stats.deliveredOrders || 0, icon: CheckCircle, color: '#34d399', change: '+15%' },
  ] : [];

  const STATUS_MAP = { pending: 'bg-yellow-500/20 text-yellow-400', confirmed: 'bg-blue-500/20 text-blue-400', shipped: 'bg-purple-500/20 text-purple-400', delivered: 'bg-green-500/20 text-green-400', cancelled: 'bg-red-500/20 text-red-400' };

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-4 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-28 bg-white/5 rounded-xl" />)}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light text-white">Dashboard</h1>
        <p className="text-white/30 text-sm mt-1">Welcome back, here's what's happening</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color, change }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + '20' }}>
                <Icon size={20} style={{ color }} />
              </div>
              {change && <span className="text-xs font-medium text-green-400">{change}</span>}
            </div>
            <p className="text-2xl font-semibold text-white">{value}</p>
            <p className="text-white/40 text-xs mt-1 tracking-wide">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Revenue Chart placeholder */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-xl p-5">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-[#C9A84C] mb-4">Revenue (Last 6 Months)</h2>
          {stats?.revenueByMonth?.length > 0 ? (
            <div className="flex items-end gap-2 h-32">
              {stats.revenueByMonth.map((m, i) => {
                const max = Math.max(...stats.revenueByMonth.map(x => x.revenue));
                const height = max > 0 ? (m.revenue / max) * 100 : 10;
                const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full rounded-t bg-[#C9A84C]/60 hover:bg-[#C9A84C] transition-colors" style={{ height: `${height}%` }} />
                    <span className="text-[9px] text-white/30">{months[m._id.month - 1]}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-white/20 text-sm">No revenue data yet</div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="glass rounded-xl p-5">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-[#C9A84C] mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {recentOrders.map(order => (
              <div key={order._id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div>
                  <p className="text-xs text-white font-medium">#{order.orderNumber}</p>
                  <p className="text-[10px] text-white/30">{order.user?.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#C9A84C]">₹{order.totalPrice?.toLocaleString()}</p>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${STATUS_MAP[order.status] || 'bg-white/5 text-white/30'}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            {recentOrders.length === 0 && <p className="text-white/20 text-sm text-center py-4">No orders yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
