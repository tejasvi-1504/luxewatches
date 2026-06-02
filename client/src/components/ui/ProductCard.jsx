import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart();
  const ref = useRef(null);
  const [wishlisted, setWishlisted] = useState(false);
  const [hovered, setHovered] = useState(false);

  // 3D tilt physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), { stiffness: 240, damping: 22 });
  const rotY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), { stiffness: 240, damping: 22 });

  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { x.set(0); y.set(0); setHovered(false); };
  const onEnter = () => setHovered(true);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added!`, {
      style: { background: '#0c0a07', color: '#E8C97A', border: '1px solid rgba(201,168,76,0.2)', fontSize: '12px', fontFamily: 'Inter' },
    });
  };

  const discount = product.discount || (product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: '-5%' }}
      style={{ perspective: 1000 }}
      className="group"
    >
      <Link to={`/product/${product.slug}`}>
        <motion.div
          ref={ref}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          onMouseEnter={onEnter}
          style={{
            rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d',
            background: '#0e0b08',
            border: hovered ? '1px solid rgba(201,168,76,0.22)' : '1px solid rgba(255,255,255,0.045)',
            transition: 'border-color 0.4s, box-shadow 0.4s',
            boxShadow: hovered ? '0 25px 60px rgba(0,0,0,0.6), 0 0 30px rgba(201,168,76,0.06)' : '0 4px 20px rgba(0,0,0,0.3)',
            borderRadius: '1rem', overflow: 'hidden', position: 'relative',
          }}
        >
          {/* Image */}
          <div className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
            <motion.img
              src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=90'}
              alt={product.name}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, rgba(8,6,4,0.8) 0%, rgba(8,6,4,0.08) 50%, transparent 100%)' }} />

            {/* Hover dark overlay */}
            <motion.div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.35)' }}
              initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} transition={{ duration: 0.35 }} />

            {/* Gold shine sweep */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(115deg, transparent 30%, rgba(201,168,76,0.07) 50%, transparent 70%)' }}
              initial={{ x: '-100%' }} whileHover={{ x: '100%' }}
              transition={{ duration: 0.9 }}
            />

            {/* Badges — top left */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.isNewArrival && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.07 + 0.2 }}
                  className="text-[8px] font-bold tracking-[0.3em] uppercase px-2.5 py-1 rounded-full"
                  style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C97A)', color: '#000' }}
                >
                  New
                </motion.span>
              )}
              {product.isBestseller && (
                <span className="text-[8px] tracking-[0.25em] uppercase px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', color: 'rgba(237,232,223,0.8)', border: '1px solid rgba(255,255,255,0.12)' }}>
                  Best Seller
                </span>
              )}
            </div>

            {/* Discount — top right */}
            {discount > 0 && (
              <div className="absolute top-3 right-3">
                <span className="text-[10px] font-semibold tracking-wide" style={{ color: 'rgba(237,232,223,0.85)' }}>−{discount}%</span>
              </div>
            )}

            {/* Wishlist — visible on hover */}
            <div className="absolute top-10 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
              <button
                onClick={(e) => { e.preventDefault(); setWishlisted(!wishlisted); }}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Heart size={12} className={wishlisted ? 'fill-red-400 text-red-400' : 'text-white/50'} />
              </button>
            </div>

            {/* Add to Cart — slides up */}
            <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-350 ease-out">
              <button
                onClick={handleAdd}
                className="w-full py-3.5 flex items-center justify-center gap-2 text-[10px] font-bold tracking-[0.25em] uppercase text-black transition-all"
                style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C97A)' }}>
                <ShoppingBag size={12} />
                Add to Cart
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <p className="text-[8px] tracking-[0.4em] uppercase mb-1.5 leading-none" style={{ color: '#C9A84C' }}>
              {product.brand}
              {product.originalBrand && (
                <span className="ml-1.5" style={{ color: 'rgba(237,232,223,0.2)' }}>· {product.originalBrand} Inspired</span>
              )}
            </p>
            <h3 className="font-cormorant text-base font-medium leading-tight mb-3 transition-colors duration-300 line-clamp-1"
              style={{ color: hovered ? '#EDE8DF' : 'rgba(237,232,223,0.8)', fontSize: 17 }}>
              {product.name}
            </h3>

            {/* Divider */}
            <div className="mb-3" style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />

            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-base font-semibold"
                  style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C97A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontSize: 16 }}>
                  ₹{product.price?.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-xs line-through" style={{ color: 'rgba(237,232,223,0.18)' }}>
                    ₹{product.originalPrice?.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              {product.rating > 0 && (
                <div className="flex items-center gap-1">
                  <Star size={8} className="fill-[#C9A84C] text-[#C9A84C]" />
                  <span className="text-[10px]" style={{ color: 'rgba(237,232,223,0.3)' }}>{product.rating}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
