import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { ShieldCheck, Truck, CreditCard } from 'lucide-react';

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: user?.name || '', phone: '', street: '', city: '', state: '', zip: '', country: 'India',
    paymentMethod: 'cod',
  });

  const shipping = totalPrice > 5000 ? 0 : 99;
  const tax = Math.round(totalPrice * 0.03);
  const total = totalPrice + shipping + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    setLoading(true);
    try {
      const items = cart.map(i => ({ product: i._id, name: i.name, image: i.images?.[0]?.url, price: i.price, quantity: i.qty }));
      const { data } = await api.post('/orders', { items, shippingAddress: form, paymentMethod: form.paymentMethod, itemsPrice: totalPrice, shippingPrice: shipping, taxPrice: tax, totalPrice: total });
      clearCart();
      toast.success('Order placed successfully!', { style: { background: '#111', color: 'var(--accent)', border: '1px solid var(--accent)33' } });
      navigate(`/account/orders/${data.order._id}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) return (
    <div className="min-h-screen flex items-center justify-center text-white/30 pt-20">
      <div className="text-center">
        <p className="text-xl mb-3">Your cart is empty</p>
        <button onClick={() => navigate('/shop')} className="text-[var(--accent)] text-sm tracking-widest uppercase">Shop Now</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6">
      <h1 className="text-3xl font-light text-white mb-8">Checkout</h1>
      <div className="grid lg:grid-cols-3 gap-10">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div className="glass rounded-xl p-6">
            <h2 className="text-sm font-semibold tracking-widest uppercase text-[var(--accent)] mb-5">Delivery Address</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Full Name', key: 'name', col: 2 },
                { label: 'Phone Number', key: 'phone', col: 2 },
                { label: 'Street Address', key: 'street', col: 2 },
                { label: 'City', key: 'city' },
                { label: 'State', key: 'state' },
                { label: 'PIN Code', key: 'zip' },
                { label: 'Country', key: 'country' },
              ].map(({ label, key, col }) => (
                <div key={key} className={col === 2 ? 'col-span-2' : ''}>
                  <label className="text-xs tracking-widest uppercase text-white/30 mb-1 block">{label}</label>
                  <input type="text" required value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-[var(--accent)] transition-colors placeholder-white/20" />
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-xl p-6">
            <h2 className="text-sm font-semibold tracking-widest uppercase text-[var(--accent)] mb-5">Payment Method</h2>
            <div className="space-y-3">
              {[
                { value: 'cod', label: 'Cash on Delivery', icon: Truck, desc: 'Pay when you receive your order' },
                { value: 'upi', label: 'UPI Payment', icon: CreditCard, desc: 'Pay via UPI (PhonePe, GPay, Paytm)' },
                { value: 'online', label: 'Credit / Debit Card', icon: ShieldCheck, desc: 'Secure online payment' },
              ].map(({ value, label, icon: Icon, desc }) => (
                <label key={value} className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all ${form.paymentMethod === value ? 'border-[var(--accent)] bg-[var(--accent)]/5' : 'border-white/10 hover:border-white/30'}`}>
                  <input type="radio" name="payment" value={value} checked={form.paymentMethod === value} onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value }))} className="sr-only" />
                  <Icon size={20} className={form.paymentMethod === value ? 'text-[var(--accent)]' : 'text-white/30'} />
                  <div>
                    <p className="text-sm font-medium text-white">{label}</p>
                    <p className="text-xs text-white/30">{desc}</p>
                  </div>
                  <div className={`ml-auto w-4 h-4 rounded-full border-2 ${form.paymentMethod === value ? 'border-[var(--accent)] bg-[var(--accent)]' : 'border-white/20'}`} />
                </label>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-4 bg-[var(--accent)] text-black font-semibold tracking-widest uppercase hover:bg-[var(--accent-2)] transition-colors disabled:opacity-50">
            {loading ? 'Placing Order...' : `Place Order — ₹${total.toLocaleString()}`}
          </button>
        </form>

        {/* Order Summary */}
        <div className="glass rounded-xl p-6 h-fit sticky top-24">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-[var(--accent)] mb-5">Order Summary</h2>
          <div className="space-y-3 mb-5">
            {cart.map(item => (
              <div key={item._id} className="flex gap-3">
                <img src={item.images?.[0]?.url} alt={item.name} className="w-14 h-14 object-cover rounded" />
                <div className="flex-1">
                  <p className="text-sm text-white/80 line-clamp-1">{item.name}</p>
                  <p className="text-xs text-white/30">Qty: {item.qty}</p>
                  <p className="text-sm text-[var(--accent)]">₹{(item.price * item.qty).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-2 pt-4 border-t border-white/5 text-sm">
            <div className="flex justify-between text-white/50"><span>Subtotal</span><span>₹{totalPrice.toLocaleString()}</span></div>
            <div className="flex justify-between text-white/50"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span></div>
            <div className="flex justify-between text-white/50"><span>Tax (3%)</span><span>₹{tax.toLocaleString()}</span></div>
            <div className="flex justify-between text-white font-semibold pt-2 border-t border-white/5"><span>Total</span><span className="text-[var(--accent)]">₹{total.toLocaleString()}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
