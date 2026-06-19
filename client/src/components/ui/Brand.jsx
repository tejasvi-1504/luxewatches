import { useSettings } from '../../context/SettingsContext';

/* Sizes tuned per placement: nav (compact), footer (medium), admin sidebar. */
const SIZES = {
  sm: { logo: 26, badge: 28, badgeText: 9, script: 'text-2xl' },
  md: { logo: 34, badge: 36, badgeText: 11, script: 'text-3xl' },
  lg: { logo: 46, badge: 44, badgeText: 13, script: 'text-4xl' },
};

const initials = (name) =>
  (name || 'Sparkle Time')
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export default function Brand({ size = 'md', variant = 'full', className = '' }) {
  const { brandName, logo } = useSettings();
  const s = SIZES[size] || SIZES.md;

  // Uploaded logo wins — render it directly.
  if (logo) {
    return (
      <span className={`flex items-center ${className}`}>
        <img
          src={logo}
          alt={brandName}
          style={{ height: s.logo, width: 'auto', maxWidth: 220, objectFit: 'contain' }}
          className="select-none"
        />
      </span>
    );
  }

  // Fallback: monogram badge + cursive wordmark.
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <span
        className="rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
        style={{
          width: s.badge,
          height: s.badge,
          border: '1px solid var(--accent)',
          background: 'rgb(var(--accent-rgb)/0.08)',
        }}
      >
        <span className="font-bold" style={{ color: 'var(--accent)', fontSize: s.badgeText, letterSpacing: '0.04em' }}>
          {initials(brandName)}
        </span>
      </span>
      {variant === 'full' && (
        <span className={`brand-script ${s.script} whitespace-nowrap`} style={{ paddingBottom: 2 }}>
          {brandName}
        </span>
      )}
    </span>
  );
}
