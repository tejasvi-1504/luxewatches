import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const EMPTY = { name: '', slug: '', gender: 'men', description: '', image: '', isActive: true };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const fetch = async () => {
    const { data } = await api.get('/categories');
    setCategories(data.categories);
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (c) => { setEditing(c); setForm(c); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) { await api.put(`/categories/${editing._id}`, form); toast.success('Category updated'); }
      else { await api.post('/categories', form); toast.success('Category created'); }
      setModal(false); fetch();
    } catch (err) { toast.error(err.message); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    await api.delete(`/categories/${id}`);
    toast.success('Deleted'); fetch();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-light text-white">Categories</h1>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-[var(--accent)] text-black text-sm font-semibold tracking-widest uppercase hover:bg-[var(--accent-2)] transition-colors rounded-lg">
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => (
          <motion.div key={cat._id} className="glass rounded-xl p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-white font-medium text-sm">{cat.name}</p>
                <p className="text-white/30 text-xs capitalize">{cat.gender} • /{cat.slug}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(cat)} className="text-white/30 hover:text-[var(--accent)] transition-colors"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(cat._id)} className="text-white/30 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
            {cat.description && <p className="text-white/30 text-xs">{cat.description}</p>}
            <span className={`text-[9px] px-2 py-0.5 rounded-full mt-2 inline-block ${cat.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {cat.isActive ? 'Active' : 'Hidden'}
            </span>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setModal(false)}
          >
            <motion.form initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onSubmit={handleSave} onClick={e => e.stopPropagation()}
              className="w-full max-w-md bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 space-y-4"
            >
              <div className="flex justify-between">
                <h2 className="text-lg font-light text-white">{editing ? 'Edit' : 'Add'} Category</h2>
                <button type="button" onClick={() => setModal(false)} className="text-white/30 hover:text-white"><X size={20} /></button>
              </div>
              {[{ label: 'Name', key: 'name' }, { label: 'Slug', key: 'slug' }, { label: 'Description', key: 'description' }, { label: 'Image URL', key: 'image' }].map(({ label, key }) => (
                <div key={key}>
                  <label className="text-[10px] tracking-widest uppercase text-white/30 mb-1 block">{label}</label>
                  <input value={form[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[var(--accent)]" />
                </div>
              ))}
              <div>
                <label className="text-[10px] tracking-widest uppercase text-white/30 mb-1 block">Gender</label>
                <select value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}
                  className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[var(--accent)]">
                  {['men', 'women', 'unisex'].map(g => <option key={g} value={g} className="bg-[#0f0f0f] capitalize">{g.charAt(0).toUpperCase() + g.slice(1)}</option>)}
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm text-white/50 cursor-pointer">
                <input type="checkbox" checked={!!form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="accent-[var(--accent)]" />
                Active
              </label>
              <button type="submit" disabled={saving}
                className="w-full py-3 bg-[var(--accent)] text-black font-semibold text-sm tracking-widest uppercase hover:bg-[var(--accent-2)] transition-colors disabled:opacity-50 rounded-lg">
                {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
