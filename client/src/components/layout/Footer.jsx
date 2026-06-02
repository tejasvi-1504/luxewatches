import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

// Social icons as inline SVG since lucide-react v0.x removed brand icons
const SocialIcons = [
  { label: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
  { label: 'X (Twitter)', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.735-8.835L1.254 2.25H8.08l4.213 5.567zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
  { label: 'WhatsApp', path: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z' },
  { label: 'YouTube', path: 'M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z' },
];

export default function Footer() {
  return (
    <footer className="bg-[#080808] border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full border border-[#C9A84C] flex items-center justify-center">
                <span className="text-[#C9A84C] text-xs font-bold">LW</span>
              </div>
              <span className="text-lg font-light tracking-[0.2em] uppercase text-white">
                Luxe<span className="gold-text font-medium">Watches</span>
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">
              Premium inspired replicas of the world's most coveted timepieces and fashion accessories.
            </p>
            <div className="flex gap-3 mt-6">
              {SocialIcons.map(({ label, path }) => (
                <a key={label} href="#" title={label} className="w-9 h-9 glass rounded-full flex items-center justify-center text-white/40 hover:text-[#C9A84C] hover:border-[#C9A84C]/30 transition-all">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d={path} /></svg>
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-[#C9A84C] mb-5">Shop</h4>
            <ul className="space-y-3">
              {[['Men Watches', '/shop?gender=men&type=watch'], ['Women Watches', '/shop?gender=women&type=watch'], ['Men Bags', '/shop?gender=men&type=bag'], ['Women Bags', '/shop?gender=women&type=bag'], ['Accessories', '/shop?type=accessory'], ['New Arrivals', '/shop?sort=newest']].map(([label, href]) => (
                <li key={label}>
                  <Link to={href} className="text-white/40 hover:text-[#C9A84C] text-sm transition-colors tracking-wide">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-[#C9A84C] mb-5">Support</h4>
            <ul className="space-y-3">
              {[['My Account', '/account'], ['Track Order', '/account/orders'], ['Return Policy', '/returns'], ['FAQ', '/faq'], ['Contact Us', '/contact']].map(([label, href]) => (
                <li key={label}>
                  <Link to={href} className="text-white/40 hover:text-[#C9A84C] text-sm transition-colors tracking-wide">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-[#C9A84C] mb-5">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-white/40 text-sm">
                <Mail size={14} className="text-[#C9A84C] shrink-0" />
                support@luxewatches.in
              </li>
              <li className="flex items-center gap-2 text-white/40 text-sm">
                <Phone size={14} className="text-[#C9A84C] shrink-0" />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-2 text-white/40 text-sm">
                <MapPin size={14} className="text-[#C9A84C] shrink-0" />
                Mumbai, Maharashtra, India
              </li>
            </ul>
            <div className="mt-6 p-4 glass-gold rounded-lg">
              <p className="text-xs text-white/40 mb-2">Newsletter</p>
              <div className="flex">
                <input type="email" placeholder="Your email" className="flex-1 bg-transparent text-xs text-white border-b border-white/20 pb-1.5 outline-none placeholder-white/20 focus:border-[#C9A84C]" />
                <button className="text-[#C9A84C] text-xs tracking-widest uppercase ml-2 hover:text-white transition-colors">→</button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/20 text-xs tracking-wide">© 2024 LuxeWatches. All rights reserved.</p>
          <p className="text-white/20 text-xs">All products are inspired replicas for fashion purposes only.</p>
        </div>
      </div>
    </footer>
  );
}
