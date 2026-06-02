import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Heart, User, Settings, LogOut, ChevronRight, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  pending: { color: 'text-yellow-400', icon: Clock, label: 'Pending' },
  confirmed: { color: 'text-blue-400', icon: CheckCircle, label: 'Confirmed' },
  processing: { color: 'text-blue-400', icon: Package, label: 'Processing' },
  shipped: { color: 'text-purple-400', icon: Truck, label: 'Shipped' },
  out_for_delivery: { color: 'text-indigo-400', icon: Truck, label: 'Out for Delivery' },
  delivered: { color: 'text-green-400', icon: CheckCircle, label: 'Delivered' },
  cancelled: { color: 'text-red-400', icon: XCircle, label: 'Cancelled' },
  refund_requested: { color: 'text-orange-400', icon: Clock, label: 'Refund Requested' },
  refunded: { color: 'text-green-300', icon: CheckCircle, label: 'Refunded' },
};

export default function Account() {
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    api.get('/orders/my').then(({ data }) => setOrders(data.orders)).finally(() => setLoading(false));
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    toast.success('Logged out');
  };

  const handleRefund = async (orderId) => {
    const reason = prompt('Reason for refund?');
    if (!reason) return;
    try {
      await api.put(`/orders/${orderId}/refund`, { reason });
      toast.success('Refund request submitted');
      const { data } = await api.get('/orders/my');
      setOrders(data.orders);
    } catch (err) { toast.error(err.message); }
  };

  if (!user) return null;

  const TABS = [
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="glass rounded-xl p-5">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/5">
              <div className="w-12 h-12 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] font-semibold text-lg">
                {user.name[0].toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-white text-sm">{user.name}</p>
                <p className="text-xs text-white/30">{user.email}</p>
              </div>
            </div>
            <nav className="space-y-1">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setTab(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${tab === id ? 'bg-[#C9A84C]/10 text-[#C9A84C]' : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
                  <Icon size={16} />
                  {label}
                </button>
              ))}
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:text-red-400 hover:bg-red-500/5 transition-all mt-4">
                <LogOut size={16} /> Logout
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {tab === 'orders' && (
            <div className="space-y-4">
              <h2 className="text-xl font-light text-white mb-6">My Orders</h2>
              {loading ? (
                <div className="animate-pulse space-y-3">
                  {[1,2,3].map(i => <div key={i} className="h-28 bg-white/5 rounded-xl" />)}
                </div>
              ) : orders.length === 0 ? (
                <div className="glass rounded-xl p-12 text-center">
                  <Package size={40} className="text-white/10 mx-auto mb-3" />
                  <p className="text-white/30">No orders yet</p>
                  <Link to="/shop" className="text-[#C9A84C] text-sm mt-2 inline-block hover:underline">Start Shopping</Link>
                </div>
              ) : (
                orders.map(order => {
                  const s = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                  const StatusIcon = s.icon;
                  return (
                    <motion.div key={order._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="glass rounded-xl p-5"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-white font-medium text-sm">Order #{order.orderNumber}</p>
                          <p className="text-white/30 text-xs">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusIcon size={14} className={s.color} />
                          <span className={`text-xs font-medium ${s.color}`}>{s.label}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                        {order.items?.slice(0, 3).map(item => (
                          <img key={item._id} src={item.image || item.product?.images?.[0]?.url} alt={item.name}
                            className="w-14 h-14 object-cover rounded shrink-0" />
                        ))}
                        {order.items?.length > 3 && (
                          <div className="w-14 h-14 bg-white/5 rounded flex items-center justify-center text-xs text-white/30 shrink-0">+{order.items.length - 3}</div>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#C9A84C] font-semibold">₹{order.totalPrice?.toLocaleString()}</span>
                        <div className="flex gap-2">
                          {order.status === 'delivered' && (
                            <button onClick={() => handleRefund(order._id)} className="text-xs text-white/30 hover:text-orange-400 transition-colors underline">
                              Request Refund
                            </button>
                          )}
                          {order.trackingNumber && (
                            <span className="text-xs text-white/30">Track: {order.trackingNumber}</span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          )}

          {tab === 'wishlist' && (
            <div>
              <h2 className="text-xl font-light text-white mb-6">Wishlist</h2>
              {user.wishlist?.length === 0 ? (
                <div className="glass rounded-xl p-12 text-center">
                  <Heart size={40} className="text-white/10 mx-auto mb-3" />
                  <p className="text-white/30">No saved items</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                  {user.wishlist?.map((p, i) => p && <div key={p._id || i} className="text-sm text-white">{p.name}</div>)}
                </div>
              )}
            </div>
          )}

          {tab === 'profile' && (
            <div className="glass rounded-xl p-6">
              <h2 className="text-xl font-light text-white mb-6">Profile Settings</h2>
              <div className="space-y-4 max-w-md">
                {[{ label: 'Full Name', value: user.name }, { label: 'Email', value: user.email }].map(({ label, value }) => (
                  <div key={label}>
                    <label className="text-xs tracking-widest uppercase text-white/30 mb-1 block">{label}</label>
                    <input defaultValue={value} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-[#C9A84C] transition-colors" />
                  </div>
                ))}
                <button className="px-6 py-2.5 bg-[#C9A84C] text-black text-sm font-semibold tracking-widest uppercase hover:bg-[#E8C97A] transition-colors rounded-lg mt-2">
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
