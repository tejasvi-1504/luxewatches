import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Check, X, Trash2 } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminReviews() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products/admin/all?limit=50');
      const withReviews = data.products.filter(p => p.reviews?.length > 0);
      setProducts(withReviews);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleReview = async (productId, reviewId, action) => {
    try {
      await api.put(`/products/admin/${productId}/reviews/${reviewId}`, { action });
      toast.success(`Review ${action}d`);
      fetch();
    } catch (err) { toast.error(err.message); }
  };

  const allReviews = products.flatMap(p => p.reviews?.map(r => ({ ...r, productId: p._id, productName: p.name })) || []);

  return (
    <div>
      <h1 className="text-2xl font-light text-white mb-6">Reviews Management</h1>

      {loading ? (
        <div className="space-y-3 animate-pulse">{[1,2,3].map(i => <div key={i} className="h-24 bg-white/5 rounded-xl" />)}</div>
      ) : allReviews.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center text-white/30">No reviews yet</div>
      ) : (
        <div className="space-y-3">
          {allReviews.map(review => (
            <motion.div key={review._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`glass rounded-xl p-4 border-l-4 ${review.isApproved ? 'border-green-500/30' : 'border-yellow-500/30'}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-white text-sm font-medium">{review.name}</p>
                    <div className="flex gap-0.5">{[1,2,3,4,5].map(s => <Star key={s} size={10} className={s <= review.rating ? 'fill-[#C9A84C] text-[#C9A84C]' : 'text-white/20'} />)}</div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${review.isApproved ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {review.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-xs text-white/30 mb-1">Product: {review.productName}</p>
                  <p className="text-white/60 text-sm">{review.comment}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {!review.isApproved && (
                    <button onClick={() => handleReview(review.productId, review._id, 'approve')}
                      className="w-8 h-8 bg-green-500/10 text-green-400 rounded-lg flex items-center justify-center hover:bg-green-500/20 transition-colors">
                      <Check size={14} />
                    </button>
                  )}
                  {review.isApproved && (
                    <button onClick={() => handleReview(review.productId, review._id, 'reject')}
                      className="w-8 h-8 bg-yellow-500/10 text-yellow-400 rounded-lg flex items-center justify-center hover:bg-yellow-500/20 transition-colors">
                      <X size={14} />
                    </button>
                  )}
                  <button onClick={() => handleReview(review.productId, review._id, 'delete')}
                    className="w-8 h-8 bg-red-500/10 text-red-400 rounded-lg flex items-center justify-center hover:bg-red-500/20 transition-colors">
                    <Trash2 size={14} />
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
