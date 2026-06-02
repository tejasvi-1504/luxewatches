import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, RefreshCw } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminRefunds() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders/admin/all?status=refund_requested&limit=50');
      setOrders(data.orders);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleRefund = async (orderId, action) => {
    const amount = action === 'approve' ? prompt('Refund amount (leave blank for full refund):') : undefined;
    try {
      await api.put(`/orders/admin/${orderId}/refund`, { action, ...(amount && { amount: Number(amount) }) });
      toast.success(`Refund ${action}d`);
      fetch();
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div>
      <h1 className="text-2xl font-light text-white mb-2">Refund Requests</h1>
      <p className="text-white/30 text-sm mb-6">{orders.length} pending refund requests</p>

      {loading ? (
        <div className="space-y-3 animate-pulse">{[1,2,3].map(i => <div key={i} className="h-28 bg-white/5 rounded-xl" />)}</div>
      ) : orders.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <RefreshCw size={32} className="text-white/10 mx-auto mb-3" />
          <p className="text-white/30">No pending refund requests</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <motion.div key={order._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-5 border border-orange-500/20"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-white font-medium">Order #{order.orderNumber}</p>
                    <span className="text-[9px] px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded-full">Refund Requested</span>
                  </div>
                  <p className="text-white/50 text-xs">{order.user?.name} — {order.user?.email}</p>
                  <p className="text-[#C9A84C] font-semibold mt-1">₹{order.totalPrice?.toLocaleString()}</p>
                  {order.refundReason && (
                    <div className="mt-3 p-3 bg-white/5 rounded-lg">
                      <p className="text-[10px] tracking-widest uppercase text-white/30 mb-1">Reason</p>
                      <p className="text-white/60 text-sm">{order.refundReason}</p>
                    </div>
                  )}
                  <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                    {order.items?.slice(0, 3).map(item => (
                      <img key={item._id} src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded shrink-0" />
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button onClick={() => handleRefund(order._id, 'approve')}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 text-xs font-semibold rounded-lg hover:bg-green-500/20 transition-colors">
                    <Check size={14} /> Approve
                  </button>
                  <button onClick={() => handleRefund(order._id, 'reject')}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 text-xs font-semibold rounded-lg hover:bg-red-500/20 transition-colors">
                    <X size={14} /> Reject
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
