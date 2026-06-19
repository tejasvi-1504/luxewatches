import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'];
const STATUS_COLORS = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  confirmed: 'bg-blue-500/20 text-blue-400',
  processing: 'bg-blue-600/20 text-blue-300',
  shipped: 'bg-purple-500/20 text-purple-400',
  out_for_delivery: 'bg-indigo-500/20 text-indigo-400',
  delivered: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-red-500/20 text-red-400',
  refund_requested: 'bg-orange-500/20 text-orange-400',
  refunded: 'bg-green-400/20 text-green-300',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [selected, setSelected] = useState(null);
  const [statusForm, setStatusForm] = useState({ status: '', trackingNumber: '', trackingUrl: '', message: '' });
  const [saving, setSaving] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/orders/admin/all?page=${page}&limit=15${filterStatus ? '&status=' + filterStatus : ''}`);
      setOrders(data.orders);
      setTotal(data.total);
      setPages(data.pages);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [page, filterStatus]);

  const openOrder = (order) => {
    setSelected(order);
    setStatusForm({ status: order.status, trackingNumber: order.trackingNumber || '', trackingUrl: order.trackingUrl || '', message: '' });
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/orders/admin/${selected._id}/status`, statusForm);
      toast.success('Order status updated');
      setSelected(null);
      fetchOrders();
    } catch (err) { toast.error(err.message); } finally { setSaving(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-light text-white">Orders</h1>
          <p className="text-white/30 text-sm">{total} total orders</p>
        </div>
        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
          className="glass text-white/70 text-xs tracking-widest uppercase px-4 py-2 rounded-lg bg-transparent outline-none cursor-pointer">
          <option value="" className="bg-[#111]">All Status</option>
          {STATUSES.map(s => <option key={s} value={s} className="bg-[#111] capitalize">{s.replace('_', ' ')}</option>)}
        </select>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-white/5">
            <tr className="text-left text-[10px] tracking-widest uppercase text-white/30">
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Manage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? [1,2,3,4,5].map(i => (
              <tr key={i}><td colSpan={7} className="px-4 py-3 animate-pulse"><div className="h-8 bg-white/5 rounded" /></td></tr>
            )) : orders.map(order => (
              <tr key={order._id} className="hover:bg-white/2 transition-colors">
                <td className="px-4 py-3 text-white font-medium text-xs">#{order.orderNumber}</td>
                <td className="px-4 py-3">
                  <p className="text-white/80 text-xs">{order.user?.name}</p>
                  <p className="text-white/30 text-[10px]">{order.user?.email}</p>
                </td>
                <td className="px-4 py-3 text-white/50 text-xs">{order.items?.length} items</td>
                <td className="px-4 py-3 text-[var(--accent)] font-medium text-xs">₹{order.totalPrice?.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`text-[9px] px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[order.status] || 'bg-white/10 text-white/40'}`}>
                    {order.status?.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-3 text-white/30 text-xs">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openOrder(order)} className="text-xs text-[var(--accent)] hover:text-[var(--accent-2)] transition-colors underline">
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="flex gap-2 mt-4 justify-center">
          {Array.from({ length: pages }).map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className={`w-8 h-8 text-xs rounded transition-all ${page === i + 1 ? 'bg-[var(--accent)] text-black' : 'glass text-white/50 hover:text-[var(--accent)]'}`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="w-full max-w-xl bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 overflow-y-auto max-h-[90vh]"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-light text-white">Order #{selected.orderNumber}</h2>
                <button onClick={() => setSelected(null)} className="text-white/30 hover:text-white"><X size={20} /></button>
              </div>

              {/* Items */}
              <div className="space-y-2 mb-5">
                {selected.items?.map(item => (
                  <div key={item._id} className="flex items-center gap-3 glass rounded-lg p-3">
                    <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded" />
                    <div className="flex-1">
                      <p className="text-xs text-white">{item.name}</p>
                      <p className="text-[10px] text-white/30">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-xs text-[var(--accent)]">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              {/* Shipping */}
              <div className="glass rounded-xl p-4 mb-5 text-xs text-white/50 space-y-1">
                <p className="text-[var(--accent)] font-semibold text-[10px] uppercase tracking-widest mb-2">Shipping Address</p>
                <p>{selected.shippingAddress?.name} — {selected.shippingAddress?.phone}</p>
                <p>{selected.shippingAddress?.street}, {selected.shippingAddress?.city}</p>
                <p>{selected.shippingAddress?.state} — {selected.shippingAddress?.zip}</p>
              </div>

              {/* Status History */}
              <div className="mb-5">
                <p className="text-[var(--accent)] font-semibold text-[10px] uppercase tracking-widest mb-2">Status History</p>
                <div className="space-y-1 max-h-28 overflow-y-auto">
                  {selected.statusHistory?.map((h, i) => (
                    <div key={i} className="flex gap-3 text-xs">
                      <span className="text-white/20 shrink-0">{new Date(h.timestamp).toLocaleDateString()}</span>
                      <span className={`capitalize ${STATUS_COLORS[h.status]?.split(' ')[1] || 'text-white/50'}`}>{h.status?.replace('_', ' ')}</span>
                      <span className="text-white/30">{h.message}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Update Status */}
              <form onSubmit={handleUpdateStatus} className="space-y-3">
                <p className="text-[var(--accent)] font-semibold text-[10px] uppercase tracking-widest">Update Status</p>
                <select value={statusForm.status} onChange={e => setStatusForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[var(--accent)]">
                  {[...STATUSES, 'refund_requested', 'refunded'].map(s => (
                    <option key={s} value={s} className="bg-[#0f0f0f] capitalize">{s.replace('_', ' ')}</option>
                  ))}
                </select>
                <input value={statusForm.trackingNumber} onChange={e => setStatusForm(f => ({ ...f, trackingNumber: e.target.value }))}
                  placeholder="Tracking Number (optional)"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[var(--accent)] placeholder-white/20" />
                <input value={statusForm.message} onChange={e => setStatusForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Status message..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[var(--accent)] placeholder-white/20" />
                <button type="submit" disabled={saving}
                  className="w-full py-3 bg-[var(--accent)] text-black font-semibold text-sm tracking-widest uppercase hover:bg-[var(--accent-2)] transition-colors disabled:opacity-50 rounded-lg">
                  {saving ? 'Updating...' : 'Update Order'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
