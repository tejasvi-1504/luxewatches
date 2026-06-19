import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Upload, Trash2, Image as ImageIcon, Cloud } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import toast from 'react-hot-toast';

// Mirrors the palettes defined in index.css (keep in sync).
const THEME_META = [
  { key: 'rose',     name: 'Rose Pink',  accent: '#E68BA3', accent2: '#F4B8C8', bg: '#090608' },
  { key: 'gold',     name: 'Royal Gold', accent: '#C9A84C', accent2: '#E8C97A', bg: '#080604' },
  { key: 'emerald',  name: 'Emerald',    accent: '#45C495', accent2: '#8FE3C2', bg: '#060A08' },
  { key: 'sapphire', name: 'Sapphire',   accent: '#5B9BD5', accent2: '#A9CCE8', bg: '#06080C' },
  { key: 'platinum', name: 'Platinum',   accent: '#C8C8D0', accent2: '#E4E4EA', bg: '#0A0A0B' },
];

const MAX_BYTES = 2 * 1024 * 1024; // 2MB

export default function AdminSettings() {
  const { brandName, theme, logo, updateSettings, previewTheme, resetTheme } = useSettings();

  const [name, setName] = useState(brandName);
  const [selectedTheme, setSelectedTheme] = useState(theme);
  // logoData: null = unchanged | '' = remove | 'data:...' = new upload
  const [logoData, setLogoData] = useState(null);
  const [logoUrlInput, setLogoUrlInput] = useState(logo && !logo.startsWith('data:') ? logo : '');
  const [saving, setSaving] = useState(false);

  // Keep local state in sync once settings finish loading.
  useEffect(() => { setName(brandName); }, [brandName]);
  useEffect(() => { setSelectedTheme(theme); }, [theme]);
  useEffect(() => { setLogoUrlInput(logo && !logo.startsWith('data:') ? logo : ''); }, [logo]);

  // Restore the saved theme if the admin leaves without saving a preview.
  useEffect(() => () => resetTheme(), []); // eslint-disable-line react-hooks/exhaustive-deps

  const pickTheme = (key) => {
    setSelectedTheme(key);
    previewTheme(key); // live preview without persisting
  };

  const onFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!/^image\/(png|jpeg|jpg|svg\+xml|webp|gif)$/.test(file.type)) {
      return toast.error('Use a PNG, JPG, SVG, WEBP or GIF image.');
    }
    if (file.size > MAX_BYTES) return toast.error('Image too large — keep it under 2MB.');
    const reader = new FileReader();
    reader.onload = () => { setLogoData(reader.result); setLogoUrlInput(''); };
    reader.onerror = () => toast.error('Could not read that file.');
    reader.readAsDataURL(file);
  };

  const removeLogo = () => { setLogoData(''); setLogoUrlInput(''); };

  // What the preview should display right now.
  const previewLogo =
    logoUrlInput.trim() ? logoUrlInput.trim()
    : logoData === '' ? ''
    : logoData != null ? logoData
    : logo;

  const save = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Brand name cannot be empty.');
    setSaving(true);
    try {
      const payload = { brandName: name.trim(), theme: selectedTheme };
      if (logoUrlInput.trim()) {
        payload.logoUrl = logoUrlInput.trim();
      } else if (logoData != null) {
        payload.logo = logoData; // data URL, or '' to remove
      }
      await updateSettings(payload);
      setLogoData(null);
      toast.success('Appearance updated');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const fieldCls = 'w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[var(--accent)] transition-colors';

  return (
    <form onSubmit={save} className="max-w-3xl">
      <div className="mb-7">
        <h1 className="text-2xl font-light text-white">Appearance</h1>
        <p className="text-white/30 text-xs mt-1">Customize your store's brand name, color theme and logo.</p>
      </div>

      {/* Brand name */}
      <section className="glass rounded-xl p-5 mb-5">
        <h2 className="text-[10px] tracking-[0.3em] uppercase text-[var(--accent)] mb-4">Brand Name</h2>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Sparkle Time" className={fieldCls} />
        <p className="text-white/25 text-xs mt-2">
          Shown in the navbar, footer, login page and browser tab. Preview:{' '}
          <span className="font-script text-xl align-middle" style={{ color: 'var(--accent)' }}>{name || 'Sparkle Time'}</span>
        </p>
      </section>

      {/* Theme */}
      <section className="glass rounded-xl p-5 mb-5">
        <h2 className="text-[10px] tracking-[0.3em] uppercase text-[var(--accent)] mb-1">Color Theme</h2>
        <p className="text-white/25 text-xs mb-4">Select a premium palette — the whole site updates instantly. Default is Rose Pink.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {THEME_META.map((t) => {
            const active = selectedTheme === t.key;
            return (
              <button type="button" key={t.key} onClick={() => pickTheme(t.key)}
                className="relative rounded-xl p-3 text-left transition-all"
                style={{
                  background: t.bg,
                  border: `1px solid ${active ? t.accent : 'rgba(255,255,255,0.08)'}`,
                  boxShadow: active ? `0 0 0 1px ${t.accent}, 0 10px 30px ${t.accent}22` : 'none',
                }}>
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="w-6 h-6 rounded-full" style={{ background: t.accent }} />
                  <span className="w-4 h-4 rounded-full" style={{ background: t.accent2 }} />
                </div>
                <p className="text-xs font-medium" style={{ color: t.accent }}>{t.name}</p>
                {active && (
                  <span className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: t.accent }}>
                    <Check size={11} className="text-black" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Logo */}
      <section className="glass rounded-xl p-5 mb-6">
        <h2 className="text-[10px] tracking-[0.3em] uppercase text-[var(--accent)] mb-1">Logo</h2>
        <p className="text-white/25 text-xs mb-4">
          Upload your logo (stored securely for now). When you're ready, paste a Cloudinary URL instead for long-term hosting.
        </p>

        <div className="flex items-center gap-5 flex-wrap">
          {/* Preview */}
          <div className="w-32 h-20 rounded-lg border border-white/10 flex items-center justify-center shrink-0 overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.03)' }}>
            {previewLogo
              ? <img src={previewLogo} alt="Logo preview" className="max-h-16 max-w-28 object-contain" />
              : <ImageIcon size={22} className="text-white/20" />}
          </div>

          <div className="space-y-2">
            <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--accent)] text-black text-xs font-semibold tracking-widest uppercase rounded-lg cursor-pointer hover:bg-[var(--accent-2)] transition-colors">
              <Upload size={14} /> Upload Image
              <input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp,image/gif" onChange={onFile} className="hidden" />
            </label>
            {previewLogo && (
              <button type="button" onClick={removeLogo}
                className="flex items-center gap-2 text-xs text-white/40 hover:text-red-400 transition-colors">
                <Trash2 size={13} /> Remove logo
              </button>
            )}
            <p className="text-white/20 text-[11px]">PNG, JPG, SVG, WEBP or GIF · max 2MB</p>
          </div>
        </div>

        {/* Cloudinary URL (long-term path) */}
        <div className="mt-5">
          <label className="text-[10px] tracking-widest uppercase text-white/30 mb-1.5 flex items-center gap-1.5">
            <Cloud size={12} /> Hosted logo URL (Cloudinary) — optional
          </label>
          <input value={logoUrlInput} onChange={(e) => { setLogoUrlInput(e.target.value); if (e.target.value) setLogoData(null); }}
            placeholder="https://res.cloudinary.com/your-cloud/.../logo.png" className={fieldCls} />
        </div>
      </section>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving}
          className="px-7 py-3 bg-[var(--accent)] text-black font-semibold text-sm tracking-widest uppercase rounded-lg hover:bg-[var(--accent-2)] transition-colors disabled:opacity-50">
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
        <motion.span className="text-white/25 text-xs" />
      </div>
    </form>
  );
}
