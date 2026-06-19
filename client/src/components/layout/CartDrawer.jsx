import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function CartDrawer() {
  const { cart, removeFromCart, updateQty, totalPrice, totalItems, isOpen, setIsOpen } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#111] z-50 flex flex-col border-l border-white/5"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-[var(--accent)]" />
                <h2 className="text-lg font-light tracking-widest uppercase">Cart ({totalItems})</h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={48} className="text-white/10 mb-4" />
                  <p className="text-white/30 tracking-widest uppercase text-sm">Your cart is empty</p>
                  <Link to="/shop" onClick={() => setIsOpen(false)}
                    className="mt-6 text-xs tracking-widest uppercase text-[var(--accent)] border border-[var(--accent)]/30 px-6 py-2 hover:bg-[var(--accent)] hover:text-black transition-all">
                    Shop Now
                  </Link>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div key={item._id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 p-3 glass rounded-lg"
                  >
                    <img src={item.images?.[0]?.url || 'https://via.placeholder.com/80'} alt={item.name}
                      className="w-20 h-20 object-cover rounded" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-white/90 line-clamp-2">{item.name}</h4>
                      <p className="text-[var(--accent)] font-semibold mt-1">₹{item.price.toLocaleString()}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button onClick={() => updateQty(item._id, item.qty - 1)}
                          className="w-6 h-6 border border-white/20 rounded flex items-center justify-center hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors">
                          <Minus size={10} />
                        </button>
                        <span className="text-sm w-6 text-center">{item.qty}</span>
                        <button onClick={() => updateQty(item._id, item.qty + 1)}
                          className="w-6 h-6 border border-white/20 rounded flex items-center justify-center hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors">
                          <Plus size={10} />
                        </button>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item._id)} className="text-white/20 hover:text-red-400 transition-colors self-start">
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-white/5 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50 tracking-widest uppercase">Subtotal</span>
                  <span className="text-[var(--accent)] font-semibold">₹{totalPrice.toLocaleString()}</span>
                </div>
                <p className="text-xs text-white/30 text-center">Shipping calculated at checkout</p>
                <Link to="/checkout" onClick={() => setIsOpen(false)}
                  className="block w-full text-center py-3.5 bg-[var(--accent)] text-black font-semibold tracking-widest uppercase text-sm hover:bg-[var(--accent-2)] transition-colors">
                  Checkout
                </Link>
                <Link to="/shop" onClick={() => setIsOpen(false)}
                  className="block w-full text-center py-3 border border-white/10 text-white/60 text-sm tracking-widest uppercase hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all">
                  Continue Shopping
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
