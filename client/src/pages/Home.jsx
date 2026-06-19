import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Star, Shield, Truck, RefreshCw, Award, ChevronDown } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import ProductCard from '../components/ui/ProductCard';
import api from '../utils/api';
import { DUMMY_PRODUCTS } from '../utils/dummyData';

const BRANDS = ['Rolex','Audemars Piguet','Patek Philippe','Cartier','Omega','Chanel','Louis Vuitton','Hermès','Gucci','Montblanc','Versace','Dior'];

const HERO_SLIDES = [
  {
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1920&q=95',
    tag: "Men's Collection",
    title: 'Iconic',
    sub: 'Timepieces',
    desc: "Curated replicas of the world's finest watches — where precision meets accessibility.",
    cta: '/shop?gender=men&type=watch',
  },
  {
    img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1920&q=95',
    tag: "Women's Collection",
    title: 'Designer',
    sub: 'Handbags',
    desc: 'Statement pieces for the discerning woman — crafted to mirror the world\'s most coveted brands.',
    cta: '/shop?gender=women&type=bag',
  },
  {
    img: 'https://images.unsplash.com/photo-1622434641406-a158123450f9?w=1920&q=95',
    tag: 'New Season',
    title: 'Luxury',
    sub: 'Redefined',
    desc: 'New arrivals that redefine what accessible luxury looks and feels like.',
    cta: '/shop?sort=newest',
  },
];

const CATS = [
  { label: "Men's Watches", count: '50+', href: '/shop?gender=men&type=watch', img: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&q=90' },
  { label: "Women's Watches", count: '40+', href: '/shop?gender=women&type=watch', img: 'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=800&q=90' },
  { label: 'Designer Bags', count: '60+', href: '/shop?type=bag', img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=90' },
  { label: 'Accessories', count: '30+', href: '/shop?type=accessory', img: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=90' },
];

const METRICS = [
  { value: '50K+', label: 'Happy Customers' },
  { value: '500+', label: 'Unique Designs' },
  { value: '4.9', label: 'Average Rating' },
  { value: '48h', label: 'Pan-India Delivery' },
  { value: '7-Day', label: 'Easy Returns' },
];

const FEATURES = [
  { icon: Shield, title: 'Premium Quality', desc: 'Sapphire glass, steel cases, genuine leather — precision on every piece.' },
  { icon: Truck, title: 'Express Delivery', desc: 'Discreet packaging, delivered pan-India in 3–5 business days.' },
  { icon: RefreshCw, title: '7-Day Returns', desc: 'Return hassle-free within 7 days if you\'re not satisfied.' },
  { icon: Award, title: 'Inspired by Icons', desc: 'Replicas of the world\'s most coveted luxury brands, priced for everyone.' },
];

const TESTIMONIALS = [
  { name: 'Rahul S.', city: 'Mumbai', rating: 5, text: 'Absolutely stunning. The Royal Oak looks identical to the original — got compliments everywhere I went!' },
  { name: 'Priya M.', city: 'Delhi', rating: 5, text: 'The Chanel bag is flawless. Every stitch is perfect. Packaging was incredibly premium too.' },
  { name: 'Arjun P.', city: 'Bangalore', rating: 5, text: 'Best purchase this year. Fast delivery, incredible quality. Already ordered two more pieces.' },
  { name: 'Sneha G.', city: 'Pune', rating: 5, text: 'Changed how I shop for luxury. Unbelievable quality at a fraction of the retail price.' },
  { name: 'Karan T.', city: 'Hyderabad', rating: 5, text: 'The Submariner is unreal. Can\'t believe this quality for this price. Highly recommend!' },
];

function AnimatedTitle({ children, className, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });
  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div
        initial={{ y: '105%' }}
        animate={inView ? { y: 0 } : {}}
        transition={{ duration: 1.05, delay, ease: [0.22, 1, 0.36, 1] }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
}

function GoldDivider({ className = '' }) {
  return (
    <motion.div
      initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={`h-px origin-left ${className}`}
      style={{ background: 'linear-gradient(90deg, var(--accent), rgb(var(--accent-rgb)/0.3), transparent)' }}
    />
  );
}

function SectionLabel({ children }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="text-[9px] tracking-[0.55em] uppercase mb-4 flex items-center gap-3"
      style={{ color: 'var(--accent)' }}
    >
      <span className="inline-block w-5 h-px" style={{ background: 'var(--accent)' }} />
      {children}
    </motion.p>
  );
}

export default function Home() {
  const [featured, setFeatured] = useState(DUMMY_PRODUCTS);
  const [activeHero, setActiveHero] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    api.get('/products/featured').then(({ data }) => {
      if (data.products?.length > 0) setFeatured(data.products);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveHero(i => (i + 1) % HERO_SLIDES.length), 5500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="overflow-hidden" style={{ background: '#0a0709' }}>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative h-screen min-h-[640px] flex items-center overflow-hidden">

        {/* Background slides */}
        <AnimatePresence mode="wait">
          <motion.div key={activeHero}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <motion.img style={{ y: heroY }}
              src={HERO_SLIDES[activeHero].img} alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg, rgba(8,6,4,0.88) 0%, rgba(8,6,4,0.55) 55%, rgba(8,6,4,0.2) 100%)' }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, #0a0709 0%, transparent 30%, transparent 80%, #0a0709 100%)' }} />
          </motion.div>
        </AnimatePresence>

        {/* Soft baby-pink glow — single, subtle */}
        <motion.div className="absolute right-[10%] top-[18%] w-[420px] h-[420px] rounded-full pointer-events-none hidden lg:block"
          style={{ background: 'radial-gradient(circle, rgb(var(--accent-rgb)/0.06) 0%, transparent 70%)' }}
          animate={{ opacity: [0.4, 0.75, 0.4] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Hero content */}
        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full pt-16 sm:pt-0">
          <AnimatePresence mode="wait">
            <motion.div key={activeHero}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.65 }}
              className="max-w-2xl"
            >
              {/* Tag */}
              <motion.div className="flex items-center gap-3 mb-7" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <span className="twinkle text-[11px]" style={{ color: 'var(--accent)' }}>✦</span>
                <div className="h-px w-10" style={{ background: 'var(--accent)' }} />
                <span className="text-[9px] tracking-[0.5em] uppercase" style={{ color: 'var(--accent)' }}>
                  {HERO_SLIDES[activeHero].tag}
                </span>
              </motion.div>

              {/* Main heading — Cormorant serif */}
              <div className="overflow-hidden mb-0">
                <motion.h1
                  initial={{ y: 110 }} animate={{ y: 0 }}
                  transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="font-cormorant leading-[0.9] tracking-tight text-white"
                  style={{ fontSize: 'clamp(64px, 10vw, 128px)', fontWeight: 300 }}
                >
                  {HERO_SLIDES[activeHero].title}
                </motion.h1>
              </div>
              <div className="overflow-hidden mb-8">
                <motion.h1
                  initial={{ y: 110 }} animate={{ y: 0 }}
                  transition={{ duration: 1, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
                  className="font-cormorant leading-[0.9] tracking-tight sparkle-text"
                  style={{ fontSize: 'clamp(64px, 10vw, 128px)', fontWeight: 600, fontStyle: 'italic' }}
                >
                  {HERO_SLIDES[activeHero].sub}
                </motion.h1>
              </div>

              <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                className="text-sm leading-relaxed mb-9 max-w-md"
                style={{ color: 'rgb(var(--ink-rgb)/0.42)', lineHeight: 1.8 }}>
                {HERO_SLIDES[activeHero].desc}
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
                className="flex flex-wrap gap-3">
                <Link to={HERO_SLIDES[activeHero].cta}
                  className="group relative overflow-hidden flex items-center gap-2.5 px-8 py-3.5 text-black text-[10px] font-bold tracking-[0.22em] uppercase"
                  style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}>
                  <motion.div className="absolute inset-0 bg-white/20" initial={{ x: '-100%' }} whileHover={{ x: '100%' }} transition={{ duration: 0.55 }} />
                  <span className="relative">Shop Collection</span>
                  <ArrowRight size={12} className="relative group-hover:translate-x-1.5 transition-transform duration-300" />
                </Link>
                <Link to="/shop"
                  className="flex items-center gap-2.5 px-8 py-3.5 text-[10px] tracking-[0.22em] uppercase transition-all duration-300"
                  style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgb(var(--ink-rgb)/0.5)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgb(var(--accent-rgb)/0.4)'; e.currentTarget.style.color = 'var(--accent)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgb(var(--ink-rgb)/0.5)'; }}>
                  View All
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
            className="flex gap-8 sm:gap-14 mt-14 sm:mt-20 pt-7 max-w-xs sm:max-w-md"
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            {[['50K+', 'Customers'], ['500+', 'Designs'], ['4.9★', 'Rating']].map(([v, l]) => (
              <div key={l}>
                <p className="font-cormorant text-2xl sm:text-3xl gold-text font-medium">{v}</p>
                <p className="text-[9px] tracking-[0.3em] uppercase mt-0.5 text-muted">{l}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Slide controls — bottom center */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setActiveHero(i)}
              className="transition-all duration-500 rounded-full"
              style={{
                width: activeHero === i ? 30 : 6,
                height: 5,
                background: activeHero === i
                  ? 'linear-gradient(90deg, var(--accent), var(--accent-2))'
                  : 'rgba(255,255,255,0.18)',
              }} />
          ))}
        </div>

        {/* Slide counter — bottom right */}
        <div className="absolute bottom-9 right-8 hidden sm:flex items-center gap-2 z-10">
          <span className="font-cormorant text-2xl font-light gold-text">{String(activeHero + 1).padStart(2, '0')}</span>
          <div className="w-8 h-px" style={{ background: 'rgb(var(--accent-rgb)/0.3)' }} />
          <span className="font-cormorant text-lg font-light" style={{ color: 'rgb(var(--ink-rgb)/0.25)' }}>
            {String(HERO_SLIDES.length).padStart(2, '0')}
          </span>
        </div>

        {/* Scroll indicator */}
        <motion.div animate={{ y: [0, 9, 0] }} transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute bottom-10 left-8 hidden sm:flex flex-col items-center gap-1.5"
          style={{ color: 'rgb(var(--ink-rgb)/0.2)' }}>
          <span className="text-[8px] tracking-[0.45em] uppercase">Scroll</span>
          <ChevronDown size={12} />
        </motion.div>
      </section>

      {/* ── BRAND STRIP ── */}
      <div className="py-4 overflow-hidden relative" style={{ background: '#0f0c11', borderTop: '1px solid rgb(var(--accent-rgb)/0.06)', borderBottom: '1px solid rgb(var(--accent-rgb)/0.06)' }}>
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10" style={{ background: 'linear-gradient(90deg, #0f0c11, transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10" style={{ background: 'linear-gradient(270deg, #0f0c11, transparent)' }} />
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
          className="flex gap-12 whitespace-nowrap"
        >
          {[...BRANDS, ...BRANDS].map((b, i) => (
            <span key={i} className="text-[9px] tracking-[0.45em] uppercase transition-colors duration-300"
              style={{ color: 'rgb(var(--ink-rgb)/0.12)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgb(var(--accent-rgb)/0.45)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgb(var(--ink-rgb)/0.12)'}>
              {b}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── CATEGORIES ── */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-12 sm:mb-16">
          <div>
            <SectionLabel>Curated For You</SectionLabel>
            <AnimatedTitle className="font-cormorant text-4xl sm:text-5xl md:text-6xl font-light text-white leading-none">
              Shop By Category
            </AnimatedTitle>
          </div>
          <Link to="/shop"
            className="hidden sm:flex items-center gap-2 text-[9px] tracking-[0.4em] uppercase transition-colors group"
            style={{ color: 'rgb(var(--ink-rgb)/0.3)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgb(var(--ink-rgb)/0.3)'}>
            All Products
            <ArrowUpRight size={11} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {CATS.map((cat, i) => (
            <motion.div key={cat.label}
              initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}>
              <Link to={cat.href} className="group relative block rounded-2xl overflow-hidden" style={{ aspectRatio: '3/4' }}>
                <motion.img src={cat.img} alt={cat.label}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
                {/* Gradient */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, rgba(8,6,4,0.9) 0%, rgba(8,6,4,0.1) 55%, transparent 100%)' }} />
                {/* Hover gold tint */}
                <motion.div className="absolute inset-0" style={{ background: 'rgb(var(--accent-rgb)/0.07)' }}
                  initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} transition={{ duration: 0.4 }} />
                {/* Gold border on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ border: '1px solid rgb(var(--accent-rgb)/0.28)' }} />
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                  <p className="text-white font-cormorant text-lg sm:text-xl font-medium leading-tight">{cat.label}</p>
                  <p className="text-[9px] tracking-[0.35em] uppercase mt-1" style={{ color: 'var(--accent)' }}>{cat.count} Styles</p>
                  <div className="flex items-center gap-1.5 mt-3 text-[9px] tracking-[0.3em] uppercase overflow-hidden"
                    style={{ height: '0px', opacity: 0 }}
                    ref={el => {
                      if (!el) return;
                      const parent = el.closest('.group');
                      if (parent) {
                        parent.addEventListener('mouseenter', () => { el.style.height = '16px'; el.style.opacity = '1'; el.style.transition = 'all 0.3s'; });
                        parent.addEventListener('mouseleave', () => { el.style.height = '0px'; el.style.opacity = '0'; });
                      }
                    }}
                  >
                    <span style={{ color: 'rgb(var(--accent-rgb)/0.7)' }}>Explore</span>
                    <ArrowRight size={9} style={{ color: 'var(--accent)' }} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── METRICS STRIP ── */}
      <section style={{ background: '#0f0c11', borderTop: '1px solid rgb(var(--accent-rgb)/0.07)', borderBottom: '1px solid rgb(var(--accent-rgb)/0.07)' }} className="py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-6">
            {METRICS.map(({ value, label }, i) => (
              <motion.div key={label}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.6 }} viewport={{ once: true }}
                className="text-center"
              >
                <p className="font-cormorant text-3xl sm:text-4xl font-light gold-text leading-none">{value}</p>
                <p className="text-[8px] tracking-[0.35em] uppercase mt-2" style={{ color: 'rgb(var(--ink-rgb)/0.3)' }}>{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED ── */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-12 sm:mb-14">
          <div>
            <SectionLabel>Handpicked</SectionLabel>
            <AnimatedTitle className="font-cormorant text-4xl sm:text-5xl md:text-6xl font-light text-white" delay={0.1}>
              Featured Collection
            </AnimatedTitle>
          </div>
          <Link to="/shop?featured=true"
            className="hidden sm:flex items-center gap-2 text-[9px] tracking-[0.4em] uppercase transition-colors group"
            style={{ color: 'rgb(var(--ink-rgb)/0.3)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgb(var(--ink-rgb)/0.3)'}>
            View All <ArrowUpRight size={11} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {featured.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
        </div>
      </section>

      {/* ── STATEMENT BANNER ── */}
      <section className="relative py-24 sm:py-40 overflow-hidden my-4">
        <motion.img
          src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=1920&q=90"
          alt="" className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.1 }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0a0709 0%, rgba(8,6,4,0.65) 50%, #0a0709 100%)' }} />

        {/* Giant background word */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
          <span className="font-cormorant font-bold tracking-tighter uppercase" style={{ fontSize: '20vw', color: 'rgba(255,255,255,0.012)' }}>SPARKLE</span>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-16 sm:gap-24 items-center">
          <div>
            <SectionLabel>Our Promise</SectionLabel>
            <div className="space-y-0 mb-8">
              {[['Precision', false], ['Crafted.', true], ['Affordably', false], ['Yours.', true]].map(([word, gold], i) => (
                <AnimatedTitle key={word} delay={i * 0.1}
                  className={`font-cormorant leading-[1.05] ${gold ? 'font-semibold sparkle-text italic' : 'font-light text-white'}`}
                  style={{ fontSize: 'clamp(40px, 6vw, 80px)' }}>
                  {word}
                </AnimatedTitle>
              ))}
            </div>
            <GoldDivider className="mb-7" />
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
              className="leading-relaxed mb-9 max-w-sm text-sm" style={{ color: 'rgb(var(--ink-rgb)/0.32)', lineHeight: 1.9 }}>
              Every piece mirrors the finest luxury brands, crafted with precision and care. Premium style shouldn't cost a fortune.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.65 }}>
              <Link to="/shop"
                className="group inline-flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase pb-1 transition-colors"
                style={{ color: 'var(--accent)', borderBottom: '1px solid rgb(var(--accent-rgb)/0.3)' }}>
                Discover Collection
                <ArrowRight size={11} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
            </motion.div>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="group p-5 sm:p-6 rounded-2xl transition-all duration-500 cursor-default"
                style={{ background: 'rgba(255,255,255,0.018)', border: '1px solid rgba(255,255,255,0.055)' }}
                whileHover={{ borderColor: 'rgb(var(--accent-rgb)/0.22)', background: 'rgb(var(--accent-rgb)/0.035)' }}
              >
                <motion.div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all duration-400"
                  style={{ background: 'rgb(var(--accent-rgb)/0.1)' }}
                  whileHover={{ background: 'var(--accent)', scale: 1.07 }}
                >
                  <Icon size={16} style={{ color: 'var(--accent)' }} />
                </motion.div>
                <p className="text-white font-medium text-sm mb-1.5 leading-snug">{title}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgb(var(--ink-rgb)/0.28)' }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ── */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <SectionLabel>Just Landed</SectionLabel>
            <AnimatedTitle className="font-cormorant text-4xl sm:text-5xl md:text-6xl font-light text-white" delay={0.1}>
              New Arrivals
            </AnimatedTitle>
          </div>
          <Link to="/shop?sort=newest"
            className="hidden sm:flex items-center gap-2 text-[9px] tracking-[0.4em] uppercase transition-colors"
            style={{ color: 'rgb(var(--ink-rgb)/0.3)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgb(var(--ink-rgb)/0.3)'}>
            Shop All <ArrowUpRight size={11} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
          {(featured.slice(4, 8).length > 0 ? featured.slice(4, 8) : featured.slice(0, 4))
            .map((p, i) => <ProductCard key={p._id + 'n'} product={{ ...p, _id: p._id + 'x' + i }} index={i} />)}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 sm:py-24" style={{ background: '#0f0c11', borderTop: '1px solid rgb(var(--accent-rgb)/0.06)', borderBottom: '1px solid rgb(var(--accent-rgb)/0.06)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <SectionLabel>Customer Love</SectionLabel>
            <div className="overflow-hidden flex justify-center">
              <AnimatedTitle className="font-cormorant text-4xl sm:text-5xl md:text-6xl font-light text-white">
                Trusted by Thousands
              </AnimatedTitle>
            </div>
            {/* Ornamental stars */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
              className="flex justify-center gap-1 mt-5">
              {[...Array(5)].map((_, i) => <Star key={i} size={11} className="fill-[var(--accent)] text-[var(--accent)]" />)}
            </motion.div>
          </div>

          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            spaceBetween={20}
            breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
            slidesPerView={1}
            className="pb-12"
          >
            {TESTIMONIALS.map((t, i) => (
              <SwiperSlide key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }} viewport={{ once: true }}
                  className="relative p-6 sm:p-7 rounded-2xl h-full transition-all duration-400"
                  style={{ background: 'rgba(255,255,255,0.018)', border: '1px solid rgba(255,255,255,0.055)' }}
                  whileHover={{ borderColor: 'rgb(var(--accent-rgb)/0.2)', background: 'rgb(var(--accent-rgb)/0.03)' }}
                >
                  {/* Giant quote mark */}
                  <span className="absolute top-3 right-5 font-cormorant leading-none select-none pointer-events-none"
                    style={{ fontSize: 80, color: 'rgb(var(--accent-rgb)/0.07)', lineHeight: 1 }}>"</span>

                  <div className="flex gap-0.5 mb-5">
                    {[...Array(t.rating)].map((_, j) => <Star key={j} size={9} className="fill-[var(--accent)] text-[var(--accent)]" />)}
                  </div>
                  <p className="text-sm leading-relaxed mb-6 italic font-cormorant"
                    style={{ color: 'rgb(var(--ink-rgb)/0.55)', fontSize: 16, lineHeight: 1.7 }}>
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold font-cormorant shrink-0"
                      style={{ background: 'rgb(var(--accent-rgb)/0.12)', color: 'var(--accent)', border: '1px solid rgb(var(--accent-rgb)/0.2)' }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{t.name}</p>
                      <p className="text-[10px] tracking-widest uppercase" style={{ color: 'rgb(var(--ink-rgb)/0.25)' }}>{t.city}</p>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-32 sm:py-44 overflow-hidden">
        <motion.img
          src="https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=1920&q=90"
          alt="" className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.09 }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #0a0709 0%, rgba(8,6,4,0.5) 50%, #0a0709 100%)' }} />

        {/* Background type */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="font-cormorant font-bold" style={{ fontSize: '18vw', color: 'rgba(255,255,255,0.012)', letterSpacing: '-0.05em' }}>STYLE</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative z-10 text-center max-w-3xl mx-auto px-4 sm:px-6"
        >
          <SectionLabel>Limited Stock</SectionLabel>
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: 60 }} whileInView={{ y: 0 }} viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="font-cormorant font-light text-white mb-1 leading-none"
              style={{ fontSize: 'clamp(48px, 7vw, 90px)' }}>
              Elevate Your
            </motion.h2>
          </div>
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: 60 }} whileInView={{ y: 0 }} viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="font-cormorant font-semibold sparkle-text italic mb-8 leading-none"
              style={{ fontSize: 'clamp(48px, 7vw, 90px)' }}>
              Personal Style
            </motion.h2>
          </div>

          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px flex-1 max-w-[80px]" style={{ background: 'linear-gradient(90deg, transparent, rgb(var(--accent-rgb)/0.4))' }} />
            <span style={{ color: 'rgb(var(--accent-rgb)/0.5)', fontSize: 10 }}>✦</span>
            <div className="h-px flex-1 max-w-[80px]" style={{ background: 'linear-gradient(270deg, transparent, rgb(var(--accent-rgb)/0.4))' }} />
          </div>

          <p className="max-w-md mx-auto mb-10 text-sm leading-relaxed" style={{ color: 'rgb(var(--ink-rgb)/0.3)', lineHeight: 1.9 }}>
            From iconic timepieces to statement bags — pieces that turn heads and start conversations.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/shop"
              className="group relative overflow-hidden flex items-center gap-3 px-9 py-4 text-black text-[10px] font-bold tracking-[0.25em] uppercase"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}>
              <motion.div className="absolute inset-0 bg-white/20" initial={{ x: '-100%' }} whileHover={{ x: '100%' }} transition={{ duration: 0.55 }} />
              <span className="relative">Shop Now</span>
              <ArrowRight size={12} className="relative group-hover:translate-x-1.5 transition-transform" />
            </Link>
            <Link to="/shop?gender=men"
              className="px-9 py-4 text-[10px] tracking-[0.25em] uppercase transition-all duration-300"
              style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgb(var(--ink-rgb)/0.45)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgb(var(--accent-rgb)/0.35)'; e.currentTarget.style.color = 'var(--accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgb(var(--ink-rgb)/0.45)'; }}>
              Men's
            </Link>
            <Link to="/shop?gender=women"
              className="px-9 py-4 text-[10px] tracking-[0.25em] uppercase transition-all duration-300"
              style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgb(var(--ink-rgb)/0.45)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgb(var(--accent-rgb)/0.35)'; e.currentTarget.style.color = 'var(--accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgb(var(--ink-rgb)/0.45)'; }}>
              Women's
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
