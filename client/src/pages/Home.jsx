import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, Star, Shield, Truck, RefreshCw, Award, ArrowUpRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import ProductCard from '../components/ui/ProductCard';
import api from '../utils/api';
import { DUMMY_PRODUCTS } from '../utils/dummyData';

// Animated text reveal
function SplitText({ text, className, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });
  return (
    <span ref={ref} className={`inline-block overflow-hidden ${className}`}>
      <motion.span
        className="inline-block"
        initial={{ y: '100%' }}
        animate={inView ? { y: 0 } : {}}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {text}
      </motion.span>
    </span>
  );
}

const BRANDS = ['Rolex', 'Audemars Piguet', 'Patek Philippe', 'Cartier', 'Omega', 'Chanel', 'Louis Vuitton', 'Hermès', 'Gucci', 'Montblanc'];

const CATEGORIES = [
  { label: "Men's Watches", sub: '50+ Styles', href: '/shop?gender=men&type=watch', img: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800', span: 'col-span-1 row-span-2' },
  { label: "Women's Watches", sub: '40+ Styles', href: '/shop?gender=women&type=watch', img: 'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=800', span: 'col-span-1' },
  { label: 'Designer Bags', sub: '60+ Styles', href: '/shop?type=bag', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800', span: 'col-span-1' },
  { label: 'Accessories', sub: '30+ Styles', href: '/shop?type=accessory', img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800', span: 'col-span-1' },
];

const TESTIMONIALS = [
  { name: 'Rahul S.', city: 'Mumbai', rating: 5, text: 'Absolutely stunning quality. The Royal Oak looks identical to the real thing. Gets compliments everywhere!' },
  { name: 'Priya M.', city: 'Delhi', rating: 5, text: 'The Chanel flap bag is flawless. Every stitch is perfect. Packaging was also super premium.' },
  { name: 'Arjun P.', city: 'Bangalore', rating: 5, text: 'Best purchase this year. Delivery was fast, the watch looks and feels incredible.' },
  { name: 'Sneha G.', city: 'Pune', rating: 5, text: 'LuxeWatches changed how I shop. Premium quality at a fraction of the price. 10/10!' },
  { name: 'Vikram N.', city: 'Chennai', rating: 5, text: 'The Submariner is unreal. Can\'t believe the price for this quality. Ordered two more!' },
];

export default function Home() {
  const [featured, setFeatured] = useState(DUMMY_PRODUCTS);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  useEffect(() => {
    api.get('/products/featured').then(({ data }) => {
      if (data.products?.length > 0) setFeatured(data.products);
    }).catch(() => {});
  }, []);

  return (
    <div className="overflow-hidden bg-[#080808]">
      {/* ── HERO ── */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background image with parallax */}
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1920&q=90"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-black/30" />
        </motion.div>

        {/* Animated gold grid lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <motion.div key={i}
              className="absolute h-px w-full"
              style={{ top: `${20 + i * 20}%`, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.15), transparent)' }}
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 12 + i * 3, repeat: Infinity, ease: 'linear', delay: i * 2 }}
            />
          ))}
          {[...Array(3)].map((_, i) => (
            <motion.div key={i}
              className="absolute w-px h-full"
              style={{ left: `${25 + i * 25}%`, background: 'linear-gradient(180deg, transparent, rgba(201,168,76,0.1), transparent)' }}
              animate={{ y: ['-100%', '100%'] }}
              transition={{ duration: 15 + i * 4, repeat: Infinity, ease: 'linear', delay: i * 3 }}
            />
          ))}
        </div>

        {/* Floating gold orb */}
        <motion.div
          className="absolute right-[15%] top-1/4 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full pt-20 sm:pt-0">
          <div className="max-w-2xl">
            {/* Label */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="flex items-center gap-3 mb-6 sm:mb-8">
              <div className="h-px w-8 bg-[#C9A84C]" />
              <span className="text-[#C9A84C] text-[10px] tracking-[0.35em] uppercase">Premium Inspired Collection</span>
            </motion.div>

            {/* Headline */}
            <div className="overflow-hidden mb-2">
              <motion.h1 initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white leading-[1.0] tracking-tight">
                Wear What
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-2">
              <motion.h1 initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.52, ease: [0.22, 1, 0.36, 1] }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.0] tracking-tight"
                style={{ background: 'linear-gradient(135deg, #C9A84C 0%, #F5E6C8 50%, #C9A84C 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                The World
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-7 sm:mb-10">
              <motion.h1 initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.64, ease: [0.22, 1, 0.36, 1] }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white leading-[1.0] tracking-tight">
                Admires
              </motion.h1>
            </div>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}
              className="text-white/40 text-sm sm:text-base max-w-sm leading-relaxed mb-7 sm:mb-10">
              Curated replicas of the world's finest timepieces and fashion pieces — crafted for those who appreciate the extraordinary.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}
              className="flex flex-wrap gap-3">
              <Link to="/shop" className="group relative overflow-hidden flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-[#C9A84C] text-black font-bold tracking-[0.15em] uppercase text-xs sm:text-sm">
                <motion.div className="absolute inset-0 bg-[#E8C97A]" initial={{ x: '-100%' }} whileHover={{ x: 0 }} transition={{ duration: 0.3 }} />
                <span className="relative">Explore Collection</span>
                <ArrowRight size={14} className="relative group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/shop?gender=women" className="flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 border border-white/15 text-white/55 tracking-[0.15em] uppercase text-xs sm:text-sm hover:border-[#C9A84C]/50 hover:text-[#C9A84C] transition-all duration-300">
                Women's Edit
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
              className="flex gap-8 mt-10 sm:mt-14 pt-8 border-t border-white/8">
              {[['50K+', 'Customers'], ['500+', 'Designs'], ['99%', 'Satisfied']].map(([v, l]) => (
                <div key={l}>
                  <p className="text-xl sm:text-2xl font-bold" style={{ background: 'linear-gradient(135deg, #C9A84C, #F5E6C8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{v}</p>
                  <p className="text-white/30 text-[10px] tracking-widest uppercase mt-0.5">{l}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20 z-10">
          <span className="text-[9px] tracking-[0.4em] uppercase">Scroll</span>
          <ChevronDown size={14} />
        </motion.div>
      </section>

      {/* ── BRAND MARQUEE ── */}
      <div className="relative py-5 border-y border-white/5 overflow-hidden bg-[#0a0a0a]">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="flex gap-16 whitespace-nowrap"
        >
          {[...BRANDS, ...BRANDS].map((b, i) => (
            <span key={i} className="text-xs tracking-[0.35em] uppercase text-white/20 hover:text-[#C9A84C]/60 transition-colors cursor-default">
              {b} <span className="text-[#C9A84C]/20">✦</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── CATEGORY GRID ── */}
      <section className="py-14 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-14">
          <div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-3">Curated For You</motion.p>
            <div className="overflow-hidden">
              <SplitText text="Shop By Category" className="text-4xl md:text-5xl font-light text-white" />
            </div>
          </div>
          <Link to="/shop" className="hidden sm:flex items-center gap-2 text-xs tracking-widest uppercase text-white/30 hover:text-[#C9A84C] transition-colors group">
            View All <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4" style={{ gridAutoRows: '220px' }}>
          {CATEGORIES.map((cat, i) => (
            <motion.div key={cat.label}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className={i === 0 ? 'row-span-2' : ''}
            >
              <Link to={cat.href} className="group relative block w-full h-full rounded-2xl overflow-hidden">
                <motion.img src={cat.img} alt={cat.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                {/* Gold border reveal */}
                <div className="absolute inset-0 border-2 border-[#C9A84C]/0 group-hover:border-[#C9A84C]/30 rounded-2xl transition-all duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <motion.div className="overflow-hidden">
                    <p className="text-white font-medium text-lg tracking-wide">{cat.label}</p>
                  </motion.div>
                  <p className="text-[#C9A84C] text-xs tracking-widest uppercase mt-1">{cat.sub}</p>
                  <div className="flex items-center gap-2 mt-4 text-xs tracking-widest uppercase text-white/0 group-hover:text-white/60 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    Shop Now <ArrowRight size={11} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10 sm:mb-14">
          <div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-3">Handpicked</motion.p>
            <div className="overflow-hidden">
              <SplitText text="Featured Collection" className="text-4xl md:text-5xl font-light text-white" delay={0.1} />
            </div>
          </div>
          <Link to="/shop?featured=true" className="hidden sm:flex items-center gap-2 text-xs tracking-widest uppercase text-white/30 hover:text-[#C9A84C] transition-colors group">
            View All <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {featured.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
        </div>
      </section>

      {/* ── BIG STATEMENT SECTION ── */}
      <section className="relative py-32 overflow-hidden my-10">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=1920" alt=""
            className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/60 to-[#080808]" />
        </div>
        {/* Large background text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <span className="text-[20vw] font-bold text-white/[0.02] tracking-tighter uppercase select-none whitespace-nowrap">LUXE</span>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.p initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-6">Our Promise</motion.p>
            <div className="space-y-2 mb-8">
              {['Precision', 'Crafted.', 'Affordably', 'Yours.'].map((word, i) => (
                <div key={word} className="overflow-hidden">
                  <SplitText text={word}
                    className={`text-5xl md:text-6xl font-light leading-tight ${i % 2 === 1 ? 'gold-text font-semibold' : 'text-white'}`}
                    delay={i * 0.1}
                  />
                </div>
              ))}
            </div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
              className="text-white/40 leading-relaxed max-w-md mb-8">
              Every piece in our collection is meticulously crafted to mirror the finest luxury brands. We believe exceptional style shouldn't cost a fortune.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }}>
              <Link to="/shop" className="group inline-flex items-center gap-3 text-sm tracking-[0.2em] uppercase text-[#C9A84C] border-b border-[#C9A84C]/40 pb-1 hover:border-[#C9A84C] transition-colors">
                Discover Collection <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Shield, title: 'Premium Quality', desc: 'Sapphire glass, steel cases, genuine leather' },
              { icon: Truck, title: 'Fast Delivery', desc: '3-5 days across India, discreet packaging' },
              { icon: RefreshCw, title: 'Easy Returns', desc: '7-day hassle-free return policy' },
              { icon: Award, title: 'Certified', desc: 'Inspired by the world\'s finest brands' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }} viewport={{ once: true }}
                className="group p-5 rounded-xl border border-white/5 bg-white/2 hover:border-[#C9A84C]/20 hover:bg-[#C9A84C]/5 transition-all duration-400"
              >
                <div className="w-10 h-10 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center mb-3 group-hover:bg-[#C9A84C] transition-colors duration-300">
                  <Icon size={18} className="text-[#C9A84C] group-hover:text-black transition-colors duration-300" />
                </div>
                <p className="text-white font-medium text-sm mb-1">{title}</p>
                <p className="text-white/30 text-xs leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS STRIP ── */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10 sm:mb-14">
          <div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-3">Just Landed</motion.p>
            <div className="overflow-hidden">
              <SplitText text="New Arrivals" className="text-4xl md:text-5xl font-light text-white" delay={0.1} />
            </div>
          </div>
          <Link to="/shop?sort=newest" className="hidden sm:flex items-center gap-2 text-xs tracking-widest uppercase text-white/30 hover:text-[#C9A84C] transition-colors group">
            View All <ArrowUpRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
          {featured.slice(0, 4).map((p, i) => <ProductCard key={p._id + 'n'} product={p} index={i} />)}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-14 sm:py-20 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-3">Customer Stories</motion.p>
            <div className="overflow-hidden flex justify-center">
              <SplitText text="Loved By Thousands" className="text-4xl md:text-5xl font-light text-white" />
            </div>
          </div>
          <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 3500, disableOnInteraction: false }}
            pagination={{ clickable: true }} spaceBetween={24}
            breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }} slidesPerView={1}
            className="pb-10"
          >
            {TESTIMONIALS.map((t, i) => (
              <SwiperSlide key={i}>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                  className="relative p-6 rounded-2xl border border-white/8 bg-white/2 hover:border-[#C9A84C]/20 transition-colors duration-500 h-full"
                >
                  {/* Quote mark */}
                  <span className="absolute top-4 right-5 text-5xl text-[#C9A84C]/10 font-serif leading-none">"</span>
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, j) => <Star key={j} size={11} className="fill-[#C9A84C] text-[#C9A84C]" />)}
                  </div>
                  <p className="text-white/55 text-sm leading-relaxed mb-5 relative z-10">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#C9A84C]/20 flex items-center justify-center text-[#C9A84C] text-xs font-bold">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{t.name}</p>
                      <p className="text-white/25 text-xs">{t.city}</p>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1622434641406-a158123450f9?w=1920" alt=""
            className="w-full h-full object-cover opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-transparent to-[#080808]" />
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative z-10 text-center max-w-3xl mx-auto px-6"
        >
          <p className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-5">Limited Stock</p>
          <h2 className="text-5xl md:text-6xl font-light text-white mb-4 leading-tight">
            Elevate Your<br />
            <span className="font-semibold" style={{ background: 'linear-gradient(135deg, #C9A84C, #F5E6C8, #C9A84C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Personal Style
            </span>
          </h2>
          <p className="text-white/35 max-w-lg mx-auto mb-10 leading-relaxed">
            From iconic timepieces to statement bags — discover pieces that turn heads and start conversations.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/shop" className="group relative overflow-hidden flex items-center gap-3 px-10 py-4 bg-[#C9A84C] text-black font-bold tracking-[0.2em] uppercase text-sm">
              <motion.div className="absolute inset-0 bg-[#E8C97A]" initial={{ x: '-100%' }} whileHover={{ x: 0 }} transition={{ duration: 0.3 }} />
              <span className="relative">Shop Now</span>
              <ArrowRight size={15} className="relative group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/shop?gender=men" className="px-10 py-4 border border-white/15 text-white/50 tracking-[0.2em] uppercase text-sm hover:border-[#C9A84C]/40 hover:text-[#C9A84C] transition-all">
              Men's Edit
            </Link>
            <Link to="/shop?gender=women" className="px-10 py-4 border border-white/15 text-white/50 tracking-[0.2em] uppercase text-sm hover:border-[#C9A84C]/40 hover:text-[#C9A84C] transition-all">
              Women's Edit
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
