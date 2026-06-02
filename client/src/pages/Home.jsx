import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Star, Shield, Truck, RefreshCw, Award, ChevronDown } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import ProductCard from '../components/ui/ProductCard';
import api from '../utils/api';
import { DUMMY_PRODUCTS } from '../utils/dummyData';

const BRANDS = ['Rolex','Audemars Piguet','Patek Philippe','Cartier','Omega','Chanel','Louis Vuitton','Hermès','Gucci','Montblanc','Versace','Dior'];

const HERO_SLIDES = [
  { img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1920&q=90', tag: "Men's Collection", title: 'Iconic', sub: 'Timepieces', cta: '/shop?gender=men&type=watch' },
  { img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1920&q=90', tag: "Women's Collection", title: 'Designer', sub: 'Handbags', cta: '/shop?gender=women&type=bag' },
  { img: 'https://images.unsplash.com/photo-1622434641406-a158123450f9?w=1920&q=90', tag: 'New Season', title: 'Luxury', sub: 'Redefined', cta: '/shop?sort=newest' },
];

const CATS = [
  { label: "Men's Watches", count: '50+', href: '/shop?gender=men&type=watch', img: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=700' },
  { label: "Women's Watches", count: '40+', href: '/shop?gender=women&type=watch', img: 'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=700' },
  { label: 'Designer Bags', count: '60+', href: '/shop?type=bag', img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=700' },
  { label: 'Accessories', count: '30+', href: '/shop?type=accessory', img: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=700' },
];

const FEATURES = [
  { icon: Shield, title: 'Premium Quality', desc: 'Sapphire glass, steel cases, genuine leather — precision craftsmanship on every piece.' },
  { icon: Truck, title: 'Express Delivery', desc: 'Discreet packaging, delivered pan-India in 3–5 business days.' },
  { icon: RefreshCw, title: '7-Day Returns', desc: 'Not satisfied? Return hassle-free within 7 days.' },
  { icon: Award, title: 'Inspired by Icons', desc: 'Replicas of the world\'s most coveted luxury brands, priced for everyone.' },
];

const TESTIMONIALS = [
  { name: 'Rahul S.', city: 'Mumbai', rating: 5, text: 'Absolutely stunning. The Royal Oak looks identical to the original — got compliments everywhere!' },
  { name: 'Priya M.', city: 'Delhi', rating: 5, text: 'The Chanel bag is flawless. Every stitch is perfect. Packaging was super premium too.' },
  { name: 'Arjun P.', city: 'Bangalore', rating: 5, text: 'Best purchase this year. Fast delivery, incredible quality. Already ordered two more.' },
  { name: 'Sneha G.', city: 'Pune', rating: 5, text: 'Changed how I shop for luxury. Unbelievable quality at a fraction of retail price.' },
  { name: 'Karan T.', city: 'Hyderabad', rating: 5, text: 'Submariner is unreal. Can\'t believe this quality for this price. Highly recommend!' },
];

function AnimatedTitle({ children, className, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });
  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div initial={{ y: '105%' }} animate={inView ? { y: 0 } : {}}
        transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
        className={className}>{children}</motion.div>
    </div>
  );
}

function GoldDivider() {
  return (
    <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="h-px origin-left"
      style={{ background: 'linear-gradient(90deg, #C9A84C, transparent)' }} />
  );
}

export default function Home() {
  const [featured, setFeatured] = useState(DUMMY_PRODUCTS);
  const [activeHero, setActiveHero] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  useEffect(() => {
    api.get('/products/featured').then(({ data }) => {
      if (data.products?.length > 0) setFeatured(data.products);
    }).catch(() => {});
  }, []);

  return (
    <div className="overflow-hidden" style={{ background: '#070707' }}>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
        {/* Slides */}
        <AnimatePresence mode="wait">
          <motion.div key={activeHero}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <motion.img style={{ y: heroY }}
              src={HERO_SLIDES[activeHero].img} alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.2) 100%)' }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, #070707 0%, transparent 35%, transparent 75%, #070707 100%)' }} />
          </motion.div>
        </AnimatePresence>

        {/* Animated grid overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          {[15, 35, 55, 75, 90].map((top, i) => (
            <motion.div key={i} className="absolute h-px w-full"
              style={{ top: `${top}%`, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent)' }}
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 14 + i * 2.5, repeat: Infinity, ease: 'linear', delay: i * 1.5 }}
            />
          ))}
        </div>

        {/* Glowing orb */}
        <motion.div className="absolute right-[10%] top-[20%] w-[400px] h-[400px] rounded-full pointer-events-none hidden lg:block"
          style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full pt-16 sm:pt-0">
          <AnimatePresence mode="wait">
            <motion.div key={activeHero} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7 }} className="max-w-2xl">

              {/* Tag */}
              <motion.div className="flex items-center gap-3 mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <div className="h-px w-8" style={{ background: '#C9A84C' }} />
                <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: '#C9A84C' }}>
                  {HERO_SLIDES[activeHero].tag}
                </span>
              </motion.div>

              <div className="overflow-hidden mb-1">
                <motion.h1 initial={{ y: 100 }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.2, ease: [0.22,1,0.36,1] }}
                  className="text-5xl sm:text-6xl lg:text-8xl font-light text-white leading-[0.95] tracking-tight">
                  {HERO_SLIDES[activeHero].title}
                </motion.h1>
              </div>
              <div className="overflow-hidden mb-8">
                <motion.h1 initial={{ y: 100 }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.35, ease: [0.22,1,0.36,1] }}
                  className="text-5xl sm:text-6xl lg:text-8xl font-bold leading-[0.95] tracking-tight gold-text">
                  {HERO_SLIDES[activeHero].sub}
                </motion.h1>
              </div>

              <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
                className="text-white/40 text-sm sm:text-base leading-relaxed mb-8 max-w-md">
                Curated replicas of the world's most coveted timepieces and accessories — where luxury meets accessibility.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-3">
                <Link to={HERO_SLIDES[activeHero].cta}
                  className="group relative overflow-hidden flex items-center gap-2.5 px-7 py-3.5 text-black text-xs font-bold tracking-[0.18em] uppercase"
                  style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C97A)' }}>
                  <motion.div className="absolute inset-0 bg-white/20" initial={{ x: '-100%' }} whileHover={{ x: '100%' }} transition={{ duration: 0.5 }} />
                  <span className="relative">Shop Collection</span>
                  <ArrowRight size={13} className="relative group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/shop"
                  className="flex items-center gap-2.5 px-7 py-3.5 text-white/60 text-xs tracking-[0.18em] uppercase border border-white/12 hover:border-[#C9A84C]/40 hover:text-[#C9A84C] transition-all duration-300">
                  View All
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
            className="flex gap-8 sm:gap-12 mt-12 sm:mt-16 pt-8 border-t border-white/8 max-w-xs sm:max-w-sm">
            {[['50K+', 'Customers'], ['500+', 'Designs'], ['99%', 'Satisfaction']].map(([v, l]) => (
              <div key={l}>
                <p className="text-xl sm:text-2xl font-bold gold-text">{v}</p>
                <p className="text-[10px] tracking-widest uppercase mt-0.5 text-muted">{l}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Slide controls */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setActiveHero(i)}
              className="transition-all duration-500 rounded-full"
              style={{ width: activeHero === i ? 28 : 6, height: 6, background: activeHero === i ? '#C9A84C' : 'rgba(255,255,255,0.2)' }} />
          ))}
        </div>

        {/* Auto-advance */}
        {/* eslint-disable-next-line react-hooks/exhaustive-deps */}
        {useEffect(() => {
          const t = setInterval(() => setActiveHero(i => (i + 1) % HERO_SLIDES.length), 5000);
          return () => clearInterval(t);
        }, [])}

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute bottom-10 right-8 hidden sm:flex flex-col items-center gap-1.5 text-white/20">
          <span className="text-[9px] tracking-[0.4em] uppercase">Scroll</span>
          <ChevronDown size={13} />
        </motion.div>
      </section>

      {/* ── BRAND STRIP ── */}
      <div className="py-4 border-y border-white/5 overflow-hidden relative" style={{ background: '#0a0a0a' }}>
        <div className="absolute left-0 top-0 bottom-0 w-16 z-10" style={{ background: 'linear-gradient(90deg, #0a0a0a, transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-16 z-10" style={{ background: 'linear-gradient(270deg, #0a0a0a, transparent)' }} />
        <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          className="flex gap-12 whitespace-nowrap">
          {[...BRANDS, ...BRANDS].map((b, i) => (
            <span key={i} className="text-[10px] tracking-[0.35em] uppercase text-white/15 hover:text-[#C9A84C]/50 transition-colors">
              {b} <span style={{ color: 'rgba(201,168,76,0.2)' }}>✦</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── CATEGORIES ── */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10 sm:mb-14">
          <div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-[10px] tracking-[0.4em] uppercase mb-3" style={{ color: '#C9A84C' }}>
              Curated For You
            </motion.p>
            <AnimatedTitle className="text-3xl sm:text-4xl md:text-5xl font-light text-white">
              Shop By Category
            </AnimatedTitle>
          </div>
          <Link to="/shop" className="hidden sm:flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-white/30 hover:text-[#C9A84C] transition-colors group">
            All Products <ArrowUpRight size={11} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {CATS.map((cat, i) => (
            <motion.div key={cat.label}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}>
              <Link to={cat.href} className="group relative block rounded-2xl overflow-hidden aspect-[3/4]">
                <motion.img src={cat.img} alt={cat.label}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                />
                {/* Base overlay */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)' }} />
                {/* Hover color tint */}
                <motion.div className="absolute inset-0" style={{ background: 'rgba(201,168,76,0.08)' }}
                  initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} transition={{ duration: 0.4 }} />
                {/* Gold border */}
                <motion.div className="absolute inset-0 rounded-2xl border-2 border-[#C9A84C]/0 group-hover:border-[#C9A84C]/30 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                  <p className="text-white font-medium text-sm sm:text-base">{cat.label}</p>
                  <p className="text-[10px] tracking-[0.3em] uppercase mt-0.5" style={{ color: '#C9A84C' }}>{cat.count} Styles</p>
                  <div className="flex items-center gap-1.5 mt-3 text-[10px] tracking-widest uppercase text-white/0 group-hover:text-white/50 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                    Explore <ArrowRight size={10} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURED ── */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10 sm:mb-12">
          <div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-[10px] tracking-[0.4em] uppercase mb-3" style={{ color: '#C9A84C' }}>Handpicked</motion.p>
            <AnimatedTitle className="text-3xl sm:text-4xl md:text-5xl font-light text-white" delay={0.1}>
              Featured Collection
            </AnimatedTitle>
          </div>
          <Link to="/shop?featured=true" className="hidden sm:flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-white/30 hover:text-[#C9A84C] transition-colors group">
            View All <ArrowUpRight size={11} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {featured.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
        </div>
      </section>

      {/* ── STATEMENT BANNER ── */}
      <section className="relative py-24 sm:py-36 overflow-hidden my-4">
        <motion.img
          src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=1920"
          alt="" className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.12 }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #070707 0%, rgba(7,7,7,0.7) 50%, #070707 100%)' }} />
        {/* Large BG text */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
          <span className="text-[18vw] font-black tracking-tighter uppercase" style={{ color: 'rgba(255,255,255,0.015)' }}>LUXE</span>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-[10px] tracking-[0.4em] uppercase mb-6" style={{ color: '#C9A84C' }}>Our Promise</motion.p>
            <div className="space-y-0">
              {[['Precision', false], ['Crafted.', true], ['Affordably', false], ['Yours.', true]].map(([word, gold], i) => (
                <AnimatedTitle key={word} delay={i * 0.1}
                  className={`text-4xl sm:text-5xl md:text-6xl leading-[1.1] font-light ${gold ? 'font-bold gold-text' : 'text-white'}`}>
                  {word}
                </AnimatedTitle>
              ))}
            </div>
            <GoldDivider />
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
              className="text-white/35 leading-relaxed mt-6 mb-8 max-w-sm text-sm">
              Every piece mirrors the finest luxury brands, crafted with precision and care. Premium style shouldn't cost a fortune.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }}>
              <Link to="/shop" className="group inline-flex items-center gap-2.5 text-xs tracking-[0.2em] uppercase border-b pb-1 transition-colors"
                style={{ color: '#C9A84C', borderColor: 'rgba(201,168,76,0.35)' }}>
                Discover Collection <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="group p-4 sm:p-5 rounded-2xl border transition-all duration-500 hover:glow-gold"
                style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}
                whileHover={{ borderColor: 'rgba(201,168,76,0.2)', background: 'rgba(201,168,76,0.04)' }}
              >
                <motion.div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all duration-300"
                  style={{ background: 'rgba(201,168,76,0.1)' }}
                  whileHover={{ background: '#C9A84C', scale: 1.05 }}>
                  <Icon size={17} style={{ color: '#C9A84C' }} className="group-hover:text-black transition-colors duration-300" />
                </motion.div>
                <p className="text-white font-medium text-sm mb-1">{title}</p>
                <p className="text-white/30 text-xs leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ── */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-[10px] tracking-[0.4em] uppercase mb-3" style={{ color: '#C9A84C' }}>Just Landed</motion.p>
            <AnimatedTitle className="text-3xl sm:text-4xl md:text-5xl font-light text-white" delay={0.1}>
              New Arrivals
            </AnimatedTitle>
          </div>
          <Link to="/shop?sort=newest" className="hidden sm:flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-white/30 hover:text-[#C9A84C] transition-colors">
            Shop All <ArrowUpRight size={11} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
          {featured.slice(4, 8).length > 0
            ? featured.slice(4, 8).map((p, i) => <ProductCard key={p._id + 'n'} product={p} index={i} />)
            : featured.slice(0, 4).map((p, i) => <ProductCard key={p._id + 'n2'} product={{ ...p, _id: p._id + 'x' }} index={i} />)
          }
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-16 sm:py-20 border-y border-white/5" style={{ background: '#0a0a0a' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-14">
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-[10px] tracking-[0.4em] uppercase mb-3" style={{ color: '#C9A84C' }}>Customer Love</motion.p>
            <div className="overflow-hidden flex justify-center">
              <AnimatedTitle className="text-3xl sm:text-4xl md:text-5xl font-light text-white">Trusted by Thousands</AnimatedTitle>
            </div>
          </div>
          <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 3800, disableOnInteraction: false }}
            pagination={{ clickable: true }} spaceBetween={20}
            breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
            slidesPerView={1} className="pb-10">
            {TESTIMONIALS.map((t, i) => (
              <SwiperSlide key={i}>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }} viewport={{ once: true }}
                  className="relative p-5 sm:p-6 rounded-2xl border border-white/6 h-full"
                  style={{ background: 'rgba(255,255,255,0.02)' }}
                  whileHover={{ borderColor: 'rgba(201,168,76,0.18)', background: 'rgba(201,168,76,0.03)' }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="absolute top-4 right-5 text-5xl font-serif leading-none" style={{ color: 'rgba(201,168,76,0.08)' }}>"</span>
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(t.rating)].map((_, j) => <Star key={j} size={10} className="fill-[#C9A84C] text-[#C9A84C]" />)}
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed mb-5">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: 'rgba(201,168,76,0.15)', color: '#C9A84C' }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{t.name}</p>
                      <p className="text-white/25 text-xs">{t.city}</p>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-28 sm:py-36 overflow-hidden">
        <motion.img src="https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=1920" alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.1 }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #070707, rgba(7,7,7,0.5) 50%, #070707)' }} />

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative z-10 text-center max-w-3xl mx-auto px-4 sm:px-6">
          <p className="text-[10px] tracking-[0.4em] uppercase mb-5" style={{ color: '#C9A84C' }}>Limited Stock</p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-light text-white mb-3 leading-tight">
            Elevate Your
          </h2>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold gold-text mb-8 leading-tight">
            Personal Style
          </h2>
          <GoldDivider />
          <p className="text-white/30 max-w-md mx-auto my-8 text-sm leading-relaxed">
            From iconic timepieces to statement bags — pieces that turn heads and start conversations.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/shop"
              className="group relative overflow-hidden flex items-center gap-2.5 px-8 py-4 text-black text-xs font-bold tracking-[0.18em] uppercase"
              style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C97A)' }}>
              <motion.div className="absolute inset-0 bg-white/20" initial={{ x: '-100%' }} whileHover={{ x: '100%' }} transition={{ duration: 0.5 }} />
              <span className="relative">Shop Now</span>
              <ArrowRight size={13} className="relative group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/shop?gender=men"
              className="px-8 py-4 text-white/50 text-xs tracking-[0.18em] uppercase border border-white/12 hover:border-[#C9A84C]/35 hover:text-[#C9A84C] transition-all duration-300">
              Men's
            </Link>
            <Link to="/shop?gender=women"
              className="px-8 py-4 text-white/50 text-xs tracking-[0.18em] uppercase border border-white/12 hover:border-[#C9A84C]/35 hover:text-[#C9A84C] transition-all duration-300">
              Women's
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
