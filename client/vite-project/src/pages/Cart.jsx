import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import useStore from '../store/useStore';
import { parseWeightToKg } from '../utils/weightUtils';
export default function Cart() {
  const { cart, removeFromCart, addToCart, cartTotal, discount, setDiscount } = useStore();
  const navigate = useNavigate();
  const [discountCode, setDiscountCode] = useState('');

  const handleUpdateQuantity = (item, delta) => {
    if (item.quantity + delta <= 0) {
      removeFromCart(item.product._id, item.weight);
    } else {
      // Prevent adding more than available stock across ALL weights in cart
      if (delta > 0) {
        const totalStockUsedInCart = cart
          .filter(cartItem => cartItem.product._id === item.product._id)
          .reduce((total, cartItem) => total + (cartItem.quantity * parseWeightToKg(cartItem.weight)), 0);
          
        const additionalWeight = parseWeightToKg(item.weight);
        if (totalStockUsedInCart + additionalWeight > item.product.stock) {
          return; // Max reached
        }
      }
      addToCart(item.product, delta, item.weight, item.priceAtTime);
    }
  };

  const subtotal = cartTotal();
  const discountAmount = subtotal * (discount / 100);
  const netSubtotal = subtotal - discountAmount;
  const tax = netSubtotal * 0.08;
  const total = netSubtotal + tax; // Shipping calculated in checkout based on option

  const handleApplyDiscount = () => {
    if (discountCode.trim().toUpperCase() === 'SWEET15') {
      setDiscount(15);
    } else {
      alert('Invalid or expired discount code.');
      setDiscount(0);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 max-w-7xl mx-auto px-4">
        <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-16 h-16 text-primary" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="text-slate-500 mb-8 text-center max-w-md">Looks like you haven't added any artisanal sweets to your collection yet.</p>
        <Link to="/sweets" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-primary/20">
          Browse Sweets
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 w-full">
      <div className="flex flex-col gap-2 mb-10">
        <h2 className="text-4xl font-black tracking-tight tracking-tight text-slate-900 dark:text-white">Your Cart</h2>
        <p className="text-slate-500 dark:text-slate-400">
          {cart.reduce((t, i) => t + i.quantity, 0)} artisanal items curated for your sweet collection
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-8">
          {cart.map((item, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-6 pb-8 border-b border-primary/10 items-center sm:items-start group">
              <div className="w-32 h-32 bg-primary/5 rounded-xl overflow-hidden shrink-0 border border-primary/10 group-hover:border-primary/30 transition-colors">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 space-y-1 text-center sm:text-left">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.product.name}</h3>
                <p className="text-sm text-slate-500">{item.weight}</p>
                <p className="text-primary font-semibold">${item.priceAtTime.toFixed(2)}</p>

                <div className="pt-4 flex flex-wrap items-center justify-center sm:justify-start gap-6">
                  <div className="flex items-center border border-primary/20 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
                    <button
                      onClick={() => handleUpdateQuantity(item, -1)}
                      className="px-3 py-1 hover:bg-primary/10 transition-colors border-r border-primary/20"
                    >-</button>
                    <span className="px-4 py-1 text-sm font-bold text-slate-900 dark:text-white w-12 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item, 1)}
                      disabled={(() => {
                        const totalUsed = cart
                          .filter(cartItem => cartItem.product._id === item.product._id)
                          .reduce((total, cartItem) => total + (cartItem.quantity * parseWeightToKg(cartItem.weight)), 0);
                        return totalUsed + parseWeightToKg(item.weight) > item.product.stock;
                      })()}
                      title="Add one more"
                      className="px-3 py-1 hover:bg-primary/10 transition-colors border-l border-primary/20 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                    >+</button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product._id, item.weight)}
                    className="flex items-center gap-1 text-sm text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="text-lg w-4 h-4" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>

              <div className="text-right hidden sm:block pt-2">
                <p className="text-lg font-black text-slate-900 dark:text-white">
                  ${(item.priceAtTime * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary Sidebar */}
        <div className="lg:col-span-4">
          <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-8 lg:sticky lg:top-28 border border-primary/10">
            <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Order Summary</h3>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900 dark:text-white">${subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="font-bold">Discount (SWEET15)</span>
                  <span className="font-medium">-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1">Shipping</span>
                <span className="font-medium text-xs bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-300">
                  Calculated at Checkout
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Estimated Tax (8%)</span>
                <span className="font-medium text-slate-900 dark:text-white">${tax.toFixed(2)}</span>
              </div>

              <div className="pt-4 border-t border-primary/20 flex justify-between items-end">
                <span className="text-lg font-bold text-slate-900 dark:text-white">Total</span>
                <span className="text-3xl font-black text-primary">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Discount Code */}
            <div className="space-y-3 mb-8">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Discount Code</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="Enter code"
                  className="flex-1 rounded-lg border border-primary/20 bg-background-light dark:bg-slate-800 focus:ring-1 focus:ring-primary focus:border-primary text-sm uppercase px-4 py-2"
                />
                <button
                  onClick={handleApplyDiscount}
                  className="bg-primary/20 hover:bg-primary/30 text-primary px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
