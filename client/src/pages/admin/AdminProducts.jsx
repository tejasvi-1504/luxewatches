import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, X, ChevronDown } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const EMPTY_PRODUCT = { name: '', slug: '', brand: '', originalBrand: '', gender: 'men', type: 'watch', description: '', shortDescription: '', price: '', originalPrice: '', stock: '', sku: '', isFeatured: false, isNewArrival: true, isBestseller: false, isActive: true, warranty: '6 months', material: '', images: [{ url: '', alt: '' }], specifications: [], features: [], tags: [] };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/products/admin/all?page=${page}&search=${search}&limit=15`);
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [page, search]);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.categories));
  }, []);

  const openCreate = () => { setEditing(null); setForm({ ...EMPTY_PRODUCT, category: categories[0]?._id || '' }); setModal(true); };
  const openEdit = (p) => { setEditing(p); setForm({ ...p, category: p.category?._id || p.category }); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/products/admin/${editing._id}`, form);
        toast.success('Product updated');
      } else {
        await api.post('/products/admin/create', form);
        toast.success('Product created');
      }
      setModal(false);
      fetchProducts();
    } catch (err) { toast.error(err.message); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this product?')) return;
    await api.delete(`/products/admin/${id}`);
    toast.success('Product removed');
    fetchProducts();
  };

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-light text-white">Products</h1>
          <p className="text-white/30 text-sm">{total} total products</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-[#C9A84C] text-black text-sm font-semibold tracking-widest uppercase hover:bg-[#E8C97A] transition-colors rounded-lg">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search products..."
          className="w-full max-w-sm bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white outline-none focus:border-[#C9A84C] placeholder-white/20" />
      </div>

      {/* Table */}
      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-white/5">
            <tr className="text-left text-[10px] tracking-widest uppercase text-white/30">
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              [1,2,3,4,5].map(i => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-3" colSpan={6}><div className="h-8 bg-white/5 rounded" /></td>
                </tr>
              ))
            ) : products.map(p => (
              <tr key={p._id} className="hover:bg-white/2 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.images?.[0]?.url} alt="" className="w-10 h-10 object-cover rounded" />
                    <div>
                      <p className="text-white font-medium text-xs">{p.name}</p>
                      <p className="text-white/30 text-[10px]">{p.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-white/50 text-xs">{p.category?.name}</td>
                <td className="px-4 py-3 text-[#C9A84C] font-medium">₹{p.price?.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs ${p.stock > 5 ? 'text-green-400' : p.stock > 0 ? 'text-yellow-400' : 'text-red-400'}`}>{p.stock}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {p.isFeatured && <span className="text-[9px] px-1.5 py-0.5 bg-[#C9A84C]/20 text-[#C9A84C] rounded">Featured</span>}
                    {p.isNewArrival && <span className="text-[9px] px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded">New</span>}
                    {!p.isActive && <span className="text-[9px] px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded">Hidden</span>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => openEdit(p)} className="text-white/30 hover:text-[#C9A84C] transition-colors"><Pencil size={15} /></button>
                    <button onClick={() => handleDelete(p._id)} className="text-white/30 hover:text-red-400 transition-colors"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex gap-2 mt-4 justify-center">
          {Array.from({ length: pages }).map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className={`w-8 h-8 text-xs rounded transition-all ${page === i + 1 ? 'bg-[#C9A84C] text-black' : 'glass text-white/50 hover:text-[#C9A84C]'}`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto p-4"
            onClick={() => setModal(false)}
          >
            <motion.form initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onSubmit={handleSave} onClick={e => e.stopPropagation()}
              className="w-full max-w-2xl bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 my-4 space-y-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-light text-white">{editing ? 'Edit Product' : 'Add Product'}</h2>
                <button type="button" onClick={() => setModal(false)} className="text-white/30 hover:text-white"><X size={20} /></button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Product Name', key: 'name', col: 2 },
                  { label: 'Slug', key: 'slug' },
                  { label: 'Brand', key: 'brand' },
                  { label: 'Original Brand', key: 'originalBrand' },
                  { label: 'SKU', key: 'sku' },
                  { label: 'Material', key: 'material' },
                  { label: 'Price (₹)', key: 'price', type: 'number' },
                  { label: 'Original Price (₹)', key: 'originalPrice', type: 'number' },
                  { label: 'Stock', key: 'stock', type: 'number' },
                  { label: 'Warranty', key: 'warranty' },
                ].map(({ label, key, col, type = 'text' }) => (
                  <div key={key} className={col === 2 ? 'col-span-2' : ''}>
                    <label className="text-[10px] tracking-widest uppercase text-white/30 mb-1 block">{label}</label>
                    <input type={type} value={form[key] || ''} onChange={e => setField(key, e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#C9A84C] placeholder-white/20" />
                  </div>
                ))}

                {/* Selects */}
                {[
                  { label: 'Gender', key: 'gender', options: ['men', 'women', 'unisex'] },
                  { label: 'Type', key: 'type', options: ['watch', 'bag', 'accessory', 'wallet', 'belt', 'sunglasses'] },
                ].map(({ label, key, options }) => (
                  <div key={key}>
                    <label className="text-[10px] tracking-widest uppercase text-white/30 mb-1 block">{label}</label>
                    <select value={form[key]} onChange={e => setField(key, e.target.value)}
                      className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#C9A84C]">
                      {options.map(o => <option key={o} value={o} className="bg-[#0f0f0f]">{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
                    </select>
                  </div>
                ))}

                <div>
                  <label className="text-[10px] tracking-widest uppercase text-white/30 mb-1 block">Category</label>
                  <select value={form.category || ''} onChange={e => setField('category', e.target.value)}
                    className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#C9A84C]">
                    {categories.map(c => <option key={c._id} value={c._id} className="bg-[#0f0f0f]">{c.name}</option>)}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] tracking-widest uppercase text-white/30 mb-1 block">Image URL</label>
                  <input value={form.images?.[0]?.url || ''} onChange={e => setField('images', [{ url: e.target.value, alt: form.name }])}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#C9A84C] placeholder-white/20"
                    placeholder="https://..." />
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] tracking-widest uppercase text-white/30 mb-1 block">Description</label>
                  <textarea value={form.description || ''} onChange={e => setField('description', e.target.value)} rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#C9A84C] resize-none" />
                </div>

                {/* Checkboxes */}
                <div className="col-span-2 flex gap-6">
                  {[['isFeatured', 'Featured'], ['isNewArrival', 'New'], ['isBestseller', 'Bestseller'], ['isActive', 'Active']].map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2 text-sm text-white/50 cursor-pointer">
                      <input type="checkbox" checked={!!form[key]} onChange={e => setField(key, e.target.checked)}
                        className="rounded border-white/20 bg-transparent accent-[#C9A84C]" />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 bg-[#C9A84C] text-black font-semibold text-sm tracking-widest uppercase hover:bg-[#E8C97A] transition-colors disabled:opacity-50 rounded-lg">
                  {saving ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}
                </button>
                <button type="button" onClick={() => setModal(false)} className="px-6 glass rounded-lg text-white/50 hover:text-white transition-colors">
                  Cancel
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
