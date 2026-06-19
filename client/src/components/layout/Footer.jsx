import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import Brand from '../ui/Brand';

const SocialIcons = [
  { label: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
  { label: 'X (Twitter)', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.735-8.835L1.254 2.25H8.08l4.213 5.567zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
  { label: 'WhatsApp', path: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z' },
  { label: 'YouTube', path: 'M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z' },
];

const SHOP_LINKS = [["Men's Watches", '/shop?gender=men&type=watch'], ["Women's Watches", '/shop?gender=women&type=watch'], ['New Arrivals', '/shop?sort=newest'], ['Best Sellers', '/shop?sort=popular'], ['All Timepieces', '/shop']];
const SUPPORT_LINKS = [['My Account', '/account'], ['Track Order', '/account'], ['Return Policy', '/returns'], ['FAQ', '/faq'], ['Contact Us', '/contact']];

export default function Footer() {
  const { brandName } = useSettings();
  return (
    <footer style={{ background: '#0a0806', borderTop: '1px solid rgb(var(--accent-rgb)/0.08)' }}>

      {/* Top ornament */}
      <div className="flex items-center justify-center py-8 px-6">
        <div className="flex items-center gap-6 max-w-xs w-full">
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgb(var(--accent-rgb)/0.2))' }} />
          <div className="flex items-center gap-2">
            <span style={{ color: 'rgb(var(--accent-rgb)/0.25)', fontSize: 8 }}>✦</span>
            <span className="font-script text-2xl" style={{ color: 'rgb(var(--accent-rgb)/0.7)' }}>{brandName}</span>
            <span style={{ color: 'rgb(var(--accent-rgb)/0.25)', fontSize: 8 }}>✦</span>
          </div>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(270deg, transparent, rgb(var(--accent-rgb)/0.2))' }} />
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand column */}
          <div>
            <div className="mb-5">
              <Brand size="md" />
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgb(var(--ink-rgb)/0.32)', lineHeight: 1.85 }}>
              Fine timepieces inspired by the great houses of horology — crafted for those who keep time in style.
            </p>
            <div className="flex gap-2.5">
              {SocialIcons.map(({ label, path }) => (
                <motion.a key={label} href="#" title={label}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.07)' }}
                  whileHover={{ borderColor: 'rgb(var(--accent-rgb)/0.35)', background: 'rgb(var(--accent-rgb)/0.08)', y: -2 }}>
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" style={{ color: 'rgb(var(--ink-rgb)/0.4)' }}>
                    <path d={path} />
                  </svg>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-[9px] font-semibold tracking-[0.45em] uppercase mb-6 flex items-center gap-2" style={{ color: 'var(--accent)' }}>
              <span className="w-3 h-px inline-block" style={{ background: 'var(--accent)' }} />
              Shop
            </h4>
            <ul className="space-y-2.5">
              {SHOP_LINKS.map(([label, href]) => (
                <li key={label}>
                  <Link to={href}
                    className="text-sm transition-colors duration-200 flex items-center gap-0 group"
                    style={{ color: 'rgb(var(--ink-rgb)/0.35)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgb(var(--ink-rgb)/0.35)'; }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-[9px] font-semibold tracking-[0.45em] uppercase mb-6 flex items-center gap-2" style={{ color: 'var(--accent)' }}>
              <span className="w-3 h-px inline-block" style={{ background: 'var(--accent)' }} />
              Support
            </h4>
            <ul className="space-y-2.5">
              {SUPPORT_LINKS.map(([label, href]) => (
                <li key={label}>
                  <Link to={href}
                    className="text-sm transition-colors duration-200"
                    style={{ color: 'rgb(var(--ink-rgb)/0.35)' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgb(var(--ink-rgb)/0.35)'}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div>
            <h4 className="text-[9px] font-semibold tracking-[0.45em] uppercase mb-6 flex items-center gap-2" style={{ color: 'var(--accent)' }}>
              <span className="w-3 h-px inline-block" style={{ background: 'var(--accent)' }} />
              Contact
            </h4>
            <ul className="space-y-3 mb-7">
              <li className="flex items-center gap-2.5 text-sm" style={{ color: 'rgb(var(--ink-rgb)/0.35)' }}>
                <Mail size={12} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                support@sparkletime.in
              </li>
              <li className="flex items-center gap-2.5 text-sm" style={{ color: 'rgb(var(--ink-rgb)/0.35)' }}>
                <Phone size={12} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-2.5 text-sm" style={{ color: 'rgb(var(--ink-rgb)/0.35)' }}>
                <MapPin size={12} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                Mumbai, Maharashtra, India
              </li>
            </ul>

            {/* Newsletter */}
            <div className="p-4 rounded-xl" style={{ background: 'rgb(var(--accent-rgb)/0.04)', border: '1px solid rgb(var(--accent-rgb)/0.1)' }}>
              <p className="text-[9px] tracking-[0.35em] uppercase mb-3" style={{ color: 'rgb(var(--accent-rgb)/0.65)' }}>Newsletter</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Your email"
                  className="flex-1 bg-transparent text-xs outline-none pb-1.5 min-w-0"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.12)', color: 'var(--ink)' }}
                  onFocus={e => e.target.style.borderBottomColor = 'rgb(var(--accent-rgb)/0.5)'}
                  onBlur={e => e.target.style.borderBottomColor = 'rgba(255,255,255,0.12)'}
                />
                <button className="text-[var(--accent)] hover:text-[var(--accent-2)] transition-colors shrink-0">
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-4 sm:px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <p className="text-[10px] tracking-wide" style={{ color: 'rgb(var(--ink-rgb)/0.18)' }}>
          © {new Date().getFullYear()} {brandName}. All rights reserved.
        </p>
        <p className="text-[10px]" style={{ color: 'rgb(var(--ink-rgb)/0.15)' }}>
          All products are fashion-inspired replicas only.
        </p>
      </div>
    </footer>
  );
}
