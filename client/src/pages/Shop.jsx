import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import api from '../utils/api';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

const TYPES = ['watch', 'bag', 'wallet', 'sunglasses', 'accessory', 'belt'];
const PRICE_RANGES = [
  { label: 'Under ₹2,000', min: 0, max: 2000 },
  { label: '₹2,000 – ₹5,000', min: 2000, max: 5000 },
  { label: '₹5,000 – ₹10,000', min: 5000, max: 10000 },
  { label: 'Above ₹10,000', min: 10000, max: 99999 },
];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const gender = params.get('gender') || '';
  const type = params.get('type') || '';
  const sort = params.get('sort') || 'newest';
  const search = params.get('search') || '';
  const page = parseInt(params.get('page') || '1');
  const minPrice = params.get('minPrice') || '';
  const maxPrice = params.get('maxPrice') || '';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ gender, type, sort, search, page, ...(minPrice && { minPrice }), ...(maxPrice && { maxPrice }), limit: 12 });
      const { data } = await api.get(`/products?${q}`);
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } catch { } finally {
      setLoading(false);
    }
  }, [gender, type, sort, search, page, minPrice, maxPrice]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    next.delete('page');
    setParams(next);
  };

  const setPriceRange = (min, max) => {
    const next = new URLSearchParams(params);
    next.set('minPrice', min); next.set('maxPrice', max); next.delete('page');
    setParams(next);
  };

  const clearFilters = () => setParams({});

  const activeFilters = [gender, type, minPrice].filter(Boolean).length;

  return (
    <div className="min-h-screen pt-28 sm:pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-light text-white mb-1">
            {gender ? `${gender.charAt(0).toUpperCase() + gender.slice(1)}'s ` : ''}{type ? type.charAt(0).toUpperCase() + type.slice(1) + 's' : 'All Products'}
          </h1>
          <p className="text-white/30 text-sm">{total} products{search ? ` for "${search}"` : ''}</p>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <button onClick={() => setFiltersOpen(!filtersOpen)}
          className="flex items-center gap-2 glass px-4 py-2 rounded-lg text-sm text-white/70 hover:text-[#C9A84C] transition-colors">
          <SlidersHorizontal size={15} />
          Filters {activeFilters > 0 && <span className="bg-[#C9A84C] text-black text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">{activeFilters}</span>}
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          {['men', 'women'].map(g => (
            <button key={g} onClick={() => setParam('gender', gender === g ? '' : g)}
              className={`text-[10px] tracking-widest uppercase px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all ${gender === g ? 'bg-[#C9A84C] text-black font-bold' : 'glass text-white/50 hover:text-[#C9A84C]'}`}>
              {g}
            </button>
          ))}
          <select value={sort} onChange={e => setParam('sort', e.target.value)}
            className="glass text-white/60 text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-lg bg-[#111] outline-none cursor-pointer border border-white/10">
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-[#111]">{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* Active filter chips */}
      <AnimatePresence>
        {activeFilters > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 mb-4"
          >
            {gender && <FilterChip label={gender} onRemove={() => setParam('gender', '')} />}
            {type && <FilterChip label={type} onRemove={() => setParam('type', '')} />}
            {minPrice && <FilterChip label={`₹${minPrice}–₹${maxPrice}`} onRemove={() => { setParam('minPrice', ''); setParam('maxPrice', ''); }} />}
            <button onClick={clearFilters} className="text-xs text-white/30 hover:text-red-400 underline transition-colors">Clear all</button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-6">
        {/* Sidebar Filters */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.aside initial={{ width: 0, opacity: 0 }} animate={{ width: 240, opacity: 1 }} exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }} className="shrink-0 overflow-hidden"
            >
              <div className="w-60 space-y-6">
                {/* Type */}
                <div>
                  <h3 className="text-xs tracking-widest uppercase text-[#C9A84C] mb-3">Product Type</h3>
                  <div className="space-y-2">
                    {TYPES.map(t => (
                      <button key={t} onClick={() => setParam('type', type === t ? '' : t)}
                        className={`block w-full text-left text-sm px-3 py-2 rounded transition-all ${type === t ? 'bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/30' : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}s
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <h3 className="text-xs tracking-widest uppercase text-[#C9A84C] mb-3">Price Range</h3>
                  <div className="space-y-2">
                    {PRICE_RANGES.map(r => (
                      <button key={r.label} onClick={() => setPriceRange(r.min, r.max)}
                        className={`block w-full text-left text-sm px-3 py-2 rounded transition-all ${minPrice == r.min ? 'bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/30' : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {Array(12).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white/5 rounded-lg aspect-square" />
                  <div className="h-3 bg-white/5 rounded mt-3 w-2/3" />
                  <div className="h-3 bg-white/5 rounded mt-2 w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-white/20 text-xl mb-2">No products found</p>
              <button onClick={clearFilters} className="text-[#C9A84C] text-sm tracking-widest uppercase">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
              {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {Array.from({ length: pages }).map((_, i) => (
                <button key={i} onClick={() => setParam('page', i + 1)}
                  className={`w-9 h-9 text-sm rounded transition-all ${page === i + 1 ? 'bg-[#C9A84C] text-black' : 'glass text-white/50 hover:text-[#C9A84C]'}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterChip({ label, onRemove }) {
  return (
    <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
      className="flex items-center gap-1.5 px-3 py-1 glass-gold rounded-full text-xs text-[#C9A84C] capitalize">
      {label}
      <button onClick={onRemove} className="hover:text-white transition-colors"><X size={10} /></button>
    </motion.span>
  );
}
