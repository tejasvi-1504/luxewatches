import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart();

  const handleAdd = (e) => {
    e.preventDefault();
    addToCart(product);
    toast.success('Added to cart', { style: { background: '#111', color: '#C9A84C', border: '1px solid #C9A84C33' } });
  };

  const discount = product.discount || (product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      viewport={{ once: true }}
      className="group relative"
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative overflow-hidden rounded-lg bg-[#111] aspect-square">
          <img
            src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNewArrival && (
              <span className="text-[10px] tracking-widest uppercase px-2 py-0.5 bg-[#C9A84C] text-black font-semibold">New</span>
            )}
            {product.isBestseller && (
              <span className="text-[10px] tracking-widest uppercase px-2 py-0.5 glass text-[#C9A84C]">Best Seller</span>
            )}
            {discount > 0 && (
              <span className="text-[10px] tracking-widest uppercase px-2 py-0.5 bg-red-500/80 text-white">-{discount}%</span>
            )}
          </div>

          {/* Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
            <button className="w-8 h-8 glass rounded-full flex items-center justify-center text-white hover:text-[#C9A84C] transition-colors">
              <Heart size={14} />
            </button>
            <button className="w-8 h-8 glass rounded-full flex items-center justify-center text-white hover:text-[#C9A84C] transition-colors">
              <Eye size={14} />
            </button>
          </div>

          {/* Quick Add */}
          <button
            onClick={handleAdd}
            className="absolute bottom-3 left-3 right-3 py-2 bg-[#C9A84C] text-black text-xs font-semibold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-3 group-hover:translate-y-0 hover:bg-[#E8C97A]"
          >
            Quick Add
          </button>
        </div>

        <div className="mt-3 space-y-1">
          <p className="text-[10px] tracking-widest uppercase text-white/30">{product.brand}</p>
          <h3 className="text-sm font-medium text-white/85 line-clamp-1 group-hover:text-[#C9A84C] transition-colors">{product.name}</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[#C9A84C] font-semibold">₹{product.price?.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-white/25 text-xs line-through">₹{product.originalPrice?.toLocaleString()}</span>
              )}
            </div>
            {product.rating > 0 && (
              <div className="flex items-center gap-1">
                <Star size={10} className="fill-[#C9A84C] text-[#C9A84C]" />
                <span className="text-[10px] text-white/40">{product.rating} ({product.numReviews})</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
