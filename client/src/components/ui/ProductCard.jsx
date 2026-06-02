import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart();
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  const handleAdd = (e) => {
    e.preventDefault();
    addToCart(product);
    toast.success('Added to cart', {
      style: { background: '#111', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.3)' },
      iconTheme: { primary: '#C9A84C', secondary: '#000' },
    });
  };

  const discount = product.discount || (product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      className="group"
      style={{ perspective: 1000 }}
    >
      <Link to={`/product/${product.slug}`} className="block">
        <motion.div
          ref={ref}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          className="relative overflow-hidden rounded-xl bg-[#111] aspect-[3/4]"
        >
          {/* Image */}
          <motion.img
            src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: 'linear-gradient(105deg, transparent 40%, rgba(201,168,76,0.08) 50%, transparent 60%)',
            }}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNewArrival && (
              <motion.span initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: index * 0.07 + 0.3 }}
                className="text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 bg-[#C9A84C] text-black font-bold">
                New
              </motion.span>
            )}
            {product.isBestseller && (
              <span className="text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 bg-white/10 backdrop-blur-sm text-white border border-white/20">
                Best Seller
              </span>
            )}
            {discount > 0 && (
              <span className="text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 bg-red-500 text-white font-bold">
                -{discount}%
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button onClick={e => e.preventDefault()} className="absolute top-3 right-3 w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white/60 hover:text-red-400 hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300">
            <Heart size={13} />
          </button>

          {/* Bottom info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
            <p className="text-[9px] tracking-[0.3em] uppercase text-[#C9A84C]/80 mb-1">{product.brand}</p>
            <h3 className="text-white font-medium text-sm leading-tight line-clamp-1 mb-2">{product.name}</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[#C9A84C] font-bold">₹{product.price?.toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="text-white/30 text-xs line-through">₹{product.originalPrice?.toLocaleString()}</span>
                )}
              </div>
              {product.rating > 0 && (
                <div className="flex items-center gap-1">
                  <Star size={9} className="fill-[#C9A84C] text-[#C9A84C]" />
                  <span className="text-[9px] text-white/50">{product.rating}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Add — slides up on hover */}
          <motion.button
            onClick={handleAdd}
            className="absolute bottom-0 left-0 right-0 py-3 bg-[#C9A84C] text-black text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out hover:bg-[#E8C97A]"
          >
            <ShoppingBag size={13} /> Add to Cart
          </motion.button>
        </motion.div>
      </Link>
    </motion.div>
  );
}
