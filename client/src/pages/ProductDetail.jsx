import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingBag, Heart, Share2, Shield, Truck, RefreshCw, ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ui/ProductCard';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${slug}`).then(({ data }) => {
      setProduct(data.product);
      setActiveImg(0);
      return api.get(`/products/${data.product._id}/related`);
    }).then(({ data }) => setRelated(data.products)).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen pt-24 max-w-7xl mx-auto px-4 sm:px-6 animate-pulse">
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="bg-white/5 rounded-xl aspect-square" />
        <div className="space-y-4"><div className="h-8 bg-white/5 rounded w-3/4" /><div className="h-4 bg-white/5 rounded w-1/2" /></div>
      </div>
    </div>
  );

  if (!product) return <div className="min-h-screen flex items-center justify-center text-white/30">Product not found</div>;

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success('Added to cart!', { style: { background: '#111', color: '#C9A84C', border: '1px solid #C9A84C33' } });
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to review');
    try {
      await api.post(`/products/${product._id}/reviews`, review);
      toast.success('Review submitted!');
      const { data } = await api.get(`/products/${slug}`);
      setProduct(data.product);
    } catch (err) { toast.error(err.message); }
  };

  const discount = product.discount || (product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-white/30 mb-8 tracking-widest uppercase">
          <Link to="/" className="hover:text-[#C9A84C] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#C9A84C] transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-white/60">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden bg-[#111] aspect-square">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  src={product.images?.[activeImg]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'}
                  alt={product.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              {product.images?.length > 1 && (
                <>
                  <button onClick={() => setActiveImg(i => (i - 1 + product.images.length) % product.images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 glass rounded-full flex items-center justify-center hover:bg-[#C9A84C] hover:text-black transition-all">
                    <ChevronLeft size={16} />
                  </button>
                  <button onClick={() => setActiveImg(i => (i + 1) % product.images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 glass rounded-full flex items-center justify-center hover:bg-[#C9A84C] hover:text-black transition-all">
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs px-3 py-1 font-semibold">-{discount}% OFF</div>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-all ${activeImg === i ? 'border-[#C9A84C]' : 'border-transparent'}`}>
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="text-xs tracking-widest uppercase text-[#C9A84C] mb-2">{product.brand}</p>
            <h1 className="text-3xl font-light text-white mb-3">{product.name}</h1>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex gap-1">
                {[1,2,3,4,5].map(s => <Star key={s} size={14} className={s <= product.rating ? 'fill-[#C9A84C] text-[#C9A84C]' : 'text-white/20'} />)}
              </div>
              <span className="text-white/40 text-sm">({product.numReviews} reviews)</span>
              {product.isBestseller && <span className="text-xs px-2 py-0.5 bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/30 rounded-full">Best Seller</span>}
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-semibold gold-text">₹{product.price?.toLocaleString()}</span>
              {product.originalPrice && <span className="text-lg text-white/25 line-through">₹{product.originalPrice?.toLocaleString()}</span>}
              {discount > 0 && <span className="text-green-400 text-sm font-medium">Save {discount}%</span>}
            </div>

            <p className="text-white/50 text-sm leading-relaxed mb-6">{product.shortDescription || product.description}</p>

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className="mb-5">
                <p className="text-xs tracking-widest uppercase text-white/40 mb-2">Color</p>
                <div className="flex gap-2">
                  {product.colors.map(c => (
                    <button key={c.name} title={c.name} className="w-6 h-6 rounded-full border-2 border-white/20 hover:border-[#C9A84C] transition-colors"
                      style={{ backgroundColor: c.hex }} />
                  ))}
                </div>
              </div>
            )}

            {/* Qty */}
            <div className="flex items-center gap-4 mb-6">
              <p className="text-xs tracking-widest uppercase text-white/40">Quantity</p>
              <div className="flex items-center gap-3 glass rounded-lg px-3 py-2">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="text-white/50 hover:text-[#C9A84C] transition-colors"><Minus size={14} /></button>
                <span className="text-white w-6 text-center">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="text-white/50 hover:text-[#C9A84C] transition-colors"><Plus size={14} /></button>
              </div>
              <span className="text-xs text-white/30">{product.stock} in stock</span>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mb-8">
              <button onClick={handleAddToCart} disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#C9A84C] text-black font-semibold tracking-widest uppercase text-sm hover:bg-[#E8C97A] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                <ShoppingBag size={16} />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button className="px-4 glass rounded hover:border-[#C9A84C]/30 hover:text-[#C9A84C] transition-all">
                <Heart size={18} />
              </button>
              <button className="px-4 glass rounded hover:border-[#C9A84C]/30 hover:text-[#C9A84C] transition-all">
                <Share2 size={18} />
              </button>
            </div>

            {/* Perks */}
            <div className="grid grid-cols-3 gap-3 p-4 glass-gold rounded-xl">
              {[
                { icon: Shield, label: `${product.warranty} Warranty` },
                { icon: Truck, label: 'Free Delivery' },
                { icon: RefreshCw, label: '7-Day Returns' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1 text-center">
                  <Icon size={16} className="text-[#C9A84C]" />
                  <span className="text-[10px] tracking-wide text-white/50">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-16">
          <div className="flex border-b border-white/5 gap-8 mb-8">
            {['description', 'specifications', 'reviews'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`text-xs tracking-widest uppercase pb-4 border-b-2 transition-all ${activeTab === tab ? 'border-[#C9A84C] text-[#C9A84C]' : 'border-transparent text-white/30 hover:text-white/70'}`}>
                {tab} {tab === 'reviews' && `(${product.numReviews})`}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {activeTab === 'description' && (
                <div className="text-white/50 text-sm leading-relaxed max-w-3xl space-y-3">
                  <p>{product.description}</p>
                  {product.features?.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {product.features.map(f => <li key={f} className="flex items-center gap-2"><span className="text-[#C9A84C]">→</span>{f}</li>)}
                    </ul>
                  )}
                </div>
              )}
              {activeTab === 'specifications' && (
                <div className="max-w-xl">
                  {product.specifications?.map(spec => (
                    <div key={spec.key} className="flex border-b border-white/5 py-3">
                      <span className="w-40 text-xs tracking-widest uppercase text-white/30">{spec.key}</span>
                      <span className="flex-1 text-sm text-white/70">{spec.value}</span>
                    </div>
                  ))}
                  {product.material && <div className="flex border-b border-white/5 py-3"><span className="w-40 text-xs tracking-widest uppercase text-white/30">Material</span><span className="text-sm text-white/70">{product.material}</span></div>}
                </div>
              )}
              {activeTab === 'reviews' && (
                <div className="space-y-6 max-w-2xl">
                  {product.reviews?.filter(r => r.isApproved).map(r => (
                    <div key={r._id} className="glass rounded-xl p-5">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-white font-medium text-sm">{r.name}</p>
                          <div className="flex gap-0.5 mt-1">{[1,2,3,4,5].map(s => <Star key={s} size={10} className={s <= r.rating ? 'fill-[#C9A84C] text-[#C9A84C]' : 'text-white/20'} />)}</div>
                        </div>
                        <span className="text-xs text-white/20">{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-white/50 text-sm">{r.comment}</p>
                    </div>
                  ))}
                  {user && (
                    <form onSubmit={handleReview} className="glass-gold rounded-xl p-5 space-y-3">
                      <h3 className="text-sm font-medium text-white">Write a Review</h3>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(s => (
                          <button type="button" key={s} onClick={() => setReview(r => ({ ...r, rating: s }))}>
                            <Star size={20} className={s <= review.rating ? 'fill-[#C9A84C] text-[#C9A84C]' : 'text-white/20 hover:text-[#C9A84C]'} />
                          </button>
                        ))}
                      </div>
                      <textarea value={review.comment} onChange={e => setReview(r => ({ ...r, comment: e.target.value }))} required
                        placeholder="Share your experience..." rows={3}
                        className="w-full bg-transparent border border-white/10 rounded p-3 text-sm text-white/70 outline-none focus:border-[#C9A84C] placeholder-white/20 resize-none" />
                      <button type="submit" className="px-6 py-2.5 bg-[#C9A84C] text-black text-xs font-semibold tracking-widest uppercase hover:bg-[#E8C97A] transition-colors">
                        Submit Review
                      </button>
                    </form>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-light text-white mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {related.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
