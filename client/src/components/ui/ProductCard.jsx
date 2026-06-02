import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart();
  const ref = useRef(null);
  const [wishlisted, setWishlisted] = useState(false);

  // 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 260, damping: 24 });
  const rotY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 260, damping: 24 });

  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added!`, {
      style: { background: '#0f0f0f', color: '#E8C97A', border: '1px solid rgba(201,168,76,0.25)', fontSize: '13px' },
    });
  };

  const discount = product.discount || (product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: '-5%' }}
      style={{ perspective: 900 }}
      className="group"
    >
      <Link to={`/product/${product.slug}`}>
        {/* Card */}
        <motion.div
          ref={ref}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }}
          className="relative overflow-hidden rounded-2xl bg-[#0f0f0f] border border-white/5 group-hover:border-[#C9A84C]/25 transition-colors duration-500"
        >
          {/* Image container */}
          <div className="relative overflow-hidden aspect-[3/4]">
            <motion.img
              src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'}
              alt={product.name}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.07 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* Permanent subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

            {/* Hover overlay */}
            <motion.div
              className="absolute inset-0 bg-black/40"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />

            {/* Animated shine */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(115deg, transparent 35%, rgba(201,168,76,0.06) 50%, transparent 65%)' }}
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.8 }}
            />

            {/* Top badges — elegant, no red */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.isNewArrival && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.06 + 0.2 }}
                  className="text-[9px] font-bold tracking-[0.25em] uppercase px-2.5 py-1 rounded-full"
                  style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C97A)', color: '#000' }}
                >
                  New
                </motion.span>
              )}
              {product.isBestseller && (
                <span className="text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/80 border border-white/15">
                  Best Seller
                </span>
              )}
            </div>

            {/* Discount — top right, subtle */}
            {discount > 0 && (
              <div className="absolute top-3 right-3">
                <span className="text-[10px] font-bold text-white/90 tracking-wide">−{discount}%</span>
              </div>
            )}

            {/* Wishlist btn */}
            <motion.button
              onClick={(e) => { e.preventDefault(); setWishlisted(!wishlisted); }}
              className="absolute top-10 right-3 w-8 h-8 glass-dark rounded-full flex items-center justify-center transition-all"
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ opacity: 0 }}
              whileInView={{ opacity: 0 }}
            >
              <Heart size={13} className={wishlisted ? 'fill-red-400 text-red-400' : 'text-white/60'} />
            </motion.button>

            {/* Wishlist — visible on hover via group */}
            <div className="absolute top-10 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
              <button onClick={(e) => { e.preventDefault(); setWishlisted(!wishlisted); }}
                className="w-8 h-8 glass-dark rounded-full flex items-center justify-center hover:bg-[#C9A84C]/20 transition-colors">
                <Heart size={13} className={wishlisted ? 'fill-red-400 text-red-400' : 'text-white/50'} />
              </button>
            </div>

            {/* Add to cart — slides up */}
            <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out">
              <button
                onClick={handleAdd}
                className="w-full py-3.5 flex items-center justify-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-black transition-all"
                style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C97A)' }}
              >
                <ShoppingBag size={13} /> Add to Cart
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <p className="text-[9px] tracking-[0.3em] uppercase mb-1" style={{ color: '#C9A84C' }}>
              {product.brand}
              {product.originalBrand && <span className="text-white/25 ml-1">· {product.originalBrand} Inspired</span>}
            </p>
            <h3 className="text-sm font-medium text-white/85 line-clamp-1 group-hover:text-white transition-colors duration-300 mb-2.5">
              {product.name}
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-base font-bold" style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C97A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  ₹{product.price?.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-white/20 line-through">₹{product.originalPrice?.toLocaleString()}</span>
                )}
              </div>
              {product.rating > 0 && (
                <div className="flex items-center gap-1">
                  <Star size={9} className="fill-[#C9A84C] text-[#C9A84C]" />
                  <span className="text-[10px] text-white/35">{product.rating}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
