import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, ChevronDown, Star, Shield, Truck, RefreshCw, Award } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import WatchScene from '../components/three/WatchScene';
import ProductCard from '../components/ui/ProductCard';
import api from '../utils/api';

const HERO_WORDS = ['Iconic', 'Timeless', 'Legendary', 'Exclusive'];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [wordIndex, setWordIndex] = useState(0);
  const heroRef = useRef();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  useEffect(() => {
    api.get('/products/featured').then(({ data }) => setFeatured(data.products)).catch(() => {});
    const interval = setInterval(() => setWordIndex(i => (i + 1) % HERO_WORDS.length), 2500);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { value: '50K+', label: 'Happy Customers' },
    { value: '500+', label: 'Premium Designs' },
    { value: '99%', label: 'Satisfaction Rate' },
    { value: '24/7', label: 'Support' },
  ];

  const features = [
    { icon: Shield, title: 'Premium Quality', desc: 'Every piece crafted with precision and care' },
    { icon: Truck, title: 'Fast Delivery', desc: 'Delivered across India in 3-5 business days' },
    { icon: RefreshCw, title: 'Easy Returns', desc: '7-day hassle-free return policy' },
    { icon: Award, title: 'Certified Replicas', desc: 'Inspired by the world\'s finest brands' },
  ];

  const testimonials = [
    { name: 'Rahul Sharma', city: 'Mumbai', rating: 5, text: 'Absolutely stunning quality. The Submariner I ordered looks identical to the real thing. Perfect finish!' },
    { name: 'Priya Mehta', city: 'Delhi', rating: 5, text: 'The Chanel flap bag is flawless. Every stitch is perfect. I get compliments everywhere I go!' },
    { name: 'Arjun Patel', city: 'Bangalore', rating: 5, text: 'Best purchase this year. The AP Royal Oak is incredible. Delivery was fast, packaging premium.' },
    { name: 'Sneha Gupta', city: 'Pune', rating: 5, text: 'LuxeWatches has changed how I shop. Premium quality at a fraction of the price. Highly recommend!' },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0">
          <video
            autoPlay muted loop playsInline
            className="w-full h-full object-cover opacity-20"
            poster="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1920"
          >
            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#0A0A0A]" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/40" />
        </div>

        {/* Gold particle lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent w-full"
              style={{ top: `${25 + i * 25}%` }}
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 8 + i * 2, repeat: Infinity, ease: 'linear', delay: i * 2 }}
            />
          ))}
        </div>

        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center pt-24">
          {/* Left Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-6">Premium Inspired Replicas</p>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light leading-[1.05] tracking-tight text-white mb-2">
                Wear
              </h1>
              <div className="h-[72px] sm:h-[84px] lg:h-[96px] overflow-hidden mb-2">
                <AnimatePresence mode="wait">
                  <motion.h1
                    key={wordIndex}
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -80, opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.05] gold-text"
                  >
                    {HERO_WORDS[wordIndex]}
                  </motion.h1>
                </AnimatePresence>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light leading-[1.05] text-white mb-6">Style</h1>
              <p className="text-white/50 text-lg max-w-md leading-relaxed mb-10">
                Discover our curated collection of premium inspired timepieces and fashion accessories — where luxury meets accessibility.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/shop" className="group flex items-center gap-3 px-8 py-4 bg-[#C9A84C] text-black font-semibold tracking-widest uppercase text-sm hover:bg-[#E8C97A] transition-all duration-300">
                  Shop Now
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/shop?sort=newest" className="flex items-center gap-3 px-8 py-4 glass text-white/70 tracking-widest uppercase text-sm hover:text-[#C9A84C] hover:border-[#C9A84C]/30 transition-all duration-300">
                  <Play size={14} className="fill-current" />
                  New Arrivals
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 mt-14 pt-8 border-t border-white/5">
                {stats.map(({ value, label }) => (
                  <div key={label}>
                    <p className="text-xl font-semibold gold-text">{value}</p>
                    <p className="text-white/30 text-xs tracking-wide mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right — 3D Watch */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="hidden lg:block h-[500px]"
          >
            <WatchScene height="100%" />
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
        >
          <span className="text-[10px] tracking-widest uppercase">Scroll</span>
          <ChevronDown size={16} />
        </motion.div>
      </section>

      {/* Category Showcase */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-3">Curated For You</p>
          <h2 className="text-4xl font-light text-white">Shop By Category</h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Men\'s Watches', href: '/shop?gender=men&type=watch', img: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600', count: '50+ Styles' },
            { label: 'Women\'s Watches', href: '/shop?gender=women&type=watch', img: 'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=600', count: '40+ Styles' },
            { label: 'Designer Bags', href: '/shop?type=bag', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600', count: '60+ Styles' },
            { label: 'Accessories', href: '/shop?type=accessory', img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600', count: '30+ Styles' },
          ].map((cat, i) => (
            <motion.div key={cat.label} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
              <Link to={cat.href} className="relative group block rounded-lg overflow-hidden aspect-[3/4]">
                <img src={cat.img} alt={cat.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-white font-medium tracking-wide">{cat.label}</p>
                  <p className="text-[#C9A84C] text-xs tracking-widest mt-0.5">{cat.count}</p>
                  <div className="flex items-center gap-2 mt-3 text-xs tracking-widest uppercase text-white/60 group-hover:text-[#C9A84C] transition-colors">
                    Shop <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-3">Handpicked</p>
            <h2 className="text-4xl font-light text-white">Featured Collection</h2>
          </div>
          <Link to="/shop?featured=true" className="text-xs tracking-widest uppercase text-white/40 hover:text-[#C9A84C] transition-colors flex items-center gap-2">
            View All <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {(featured.length ? featured : Array(8).fill(null)).map((p, i) => (
            p ? <ProductCard key={p._id} product={p} index={i} /> : (
              <div key={i} className="animate-pulse">
                <div className="bg-white/5 rounded-lg aspect-square" />
                <div className="h-3 bg-white/5 rounded mt-3 w-2/3" />
                <div className="h-3 bg-white/5 rounded mt-2 w-1/2" />
              </div>
            )
          ))}
        </div>
      </section>

      {/* Marquee Banner */}
      <div className="py-5 border-y border-white/5 overflow-hidden my-8">
        <motion.div
          animate={{ x: [0, -1200] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="flex gap-16 whitespace-nowrap"
        >
          {[...Array(4)].flatMap(() =>
            ['Rolex Inspired', 'Patek Philippe', 'Audemars Piguet', 'Cartier', 'Louis Vuitton', 'Chanel', 'Hermès', 'Omega', 'Gucci'].map(b => (
              <span key={b + Math.random()} className="text-xs tracking-[0.4em] uppercase text-white/20">
                {b} <span className="text-[#C9A84C]/30">✦</span>
              </span>
            ))
          )}
        </motion.div>
      </div>

      {/* Features Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
              className="glass-gold rounded-xl p-6 text-center group hover:bg-[#C9A84C]/10 transition-colors"
            >
              <div className="w-12 h-12 rounded-full glass flex items-center justify-center mx-auto mb-4 group-hover:bg-[#C9A84C] transition-colors">
                <Icon size={20} className="text-[#C9A84C] group-hover:text-black transition-colors" />
              </div>
              <h3 className="font-medium text-white text-sm mb-1">{title}</h3>
              <p className="text-white/40 text-xs leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <p className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-3">What Our Customers Say</p>
          <h2 className="text-4xl font-light text-white">Loved By Thousands</h2>
        </motion.div>
        <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 3000 }} pagination={{ clickable: true }} spaceBetween={24}
          breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }} slidesPerView={1}
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={i}>
              <motion.div className="glass rounded-xl p-6 mb-8">
                <div className="flex gap-1 mb-3">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} size={12} className="fill-[#C9A84C] text-[#C9A84C]" />)}
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="text-white font-medium text-sm">{t.name}</p>
                  <p className="text-white/30 text-xs">{t.city}</p>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* CTA Banner */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1622434641406-a158123450f9?w=1920" alt="" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-4">Limited Collection</p>
            <h2 className="text-4xl sm:text-5xl font-light text-white mb-4">New Season Arrivals</h2>
            <p className="text-white/40 max-w-xl mx-auto mb-8">Discover our latest additions — from iconic timepieces to statement bags. Crafted for those who appreciate the finer things.</p>
            <Link to="/shop?sort=newest"
              className="inline-flex items-center gap-3 px-10 py-4 bg-[#C9A84C] text-black font-semibold tracking-widest uppercase text-sm hover:bg-[#E8C97A] transition-all">
              Explore Now <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
