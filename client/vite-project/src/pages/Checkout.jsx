import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Truck, Store, Info, Map, Clock, ArrowRight } from 'lucide-react';
import useStore from '../store/useStore';

export default function Checkout() {
  const [method, setMethod] = useState('pickup'); // 'pickup' | 'delivery'
  const { cart, cartTotal, user, clearCart, openAuthModal, discount, setDiscount } = useStore();
  const navigate = useNavigate();
  const [discountCode, setDiscountCode] = useState('');

  const subtotal = cartTotal();
  const discountAmount = subtotal * (discount / 100);
  const netSubtotal = subtotal - discountAmount;

  // Requirement: shipping cost applied if total < 500
  // For aesthetic consistency with $ signs in the design, we use $500 threshold
  const shippingFee = (method === 'delivery' && netSubtotal < 500) ? 15.00 : 0.00;
  const tax = netSubtotal * 0.08;
  const total = netSubtotal + shippingFee + tax;

  const handleApplyDiscount = () => {
    if (discountCode.trim().toUpperCase() === 'SWEET15') {
      setDiscount(15);
    } else {
      alert('Invalid or expired discount code.');
      setDiscount(0);
    }
  };

  const [address, setAddress] = useState({
    street: '', city: '', state: '', zipCode: ''
  });

  const handlePlaceOrder = async () => {
    if (!user) {
      openAuthModal();
      return;
    }
    if (cart.length === 0) return;

    try {
      const orderPayload = {
        items: cart.map(c => ({
          product: c.product._id,
          quantity: c.quantity,
          weight: c.weight,
          priceAtTime: c.priceAtTime
        })),
        totalAmount: total,
        shippingMethod: method,
        shippingFee: shippingFee,
        shippingAddress: method === 'delivery' ? address : null
      };

      const res = await axios.post('http://localhost:5000/api/orders', orderPayload, { withCredentials: true });

      clearCart();

      const orderData = res.data;
      navigate('/confirmation', {
        state: {
          orderId: orderData._id || 'SG-' + Date.now(),
          method,
          address,
          total,
          items: cart,
          time: new Date()
        }
      });
    } catch (err) {
      console.error(err);
      alert('Failed to place order.');
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center py-12 px-6 lg:px-20">
      <div className="w-full max-w-5xl space-y-12">
        <div className="text-center">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase mb-4">Secure Checkout</h2>
          <p className="text-slate-500">Complete your artisanal order.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">

          <div className="flex-1 space-y-8">
            {/* Fulfillment Toggle Section */}
            <section className="bg-white dark:bg-slate-800 rounded-xl border border-primary/20 overflow-hidden shadow-sm">
              <div className="flex border-b border-primary/20">
                <button
                  onClick={() => setMethod('delivery')}
                  className={`flex-1 py-5 flex items-center justify-center gap-2 transition-all font-bold ${method === 'delivery' ? 'text-primary border-b-4 border-primary bg-primary/5' : 'text-slate-400 hover:bg-primary/5'}`}
                >
                  <Truck />
                  <span>Delivery</span>
                </button>
                <button
                  onClick={() => setMethod('pickup')}
                  className={`flex-1 py-5 flex items-center justify-center gap-2 transition-all font-bold ${method === 'pickup' ? 'text-primary border-b-4 border-primary bg-primary/5' : 'text-slate-400 hover:bg-primary/5'}`}
                >
                  <Store />
                  <span>Store Pickup</span>
                </button>
              </div>

              <div className="p-6 space-y-6">
                {method === 'pickup' ? (
                  <>
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <Info className="text-primary w-6 h-6 shrink-0" />
                      <div>
                        <p className="text-slate-900 dark:text-slate-100 text-base font-bold">Pickup Only</p>
                        <p className="text-primary/80 text-sm">Selected boutique exclusives are best picked up in-store to ensure premium quality handling.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Select Boutique Location</label>
                        <select className="w-full rounded-lg border border-primary/20 bg-background-light dark:bg-slate-700 px-4 py-3.5 focus:ring-2 focus:ring-primary outline-none">
                          <option>Flagship Store - Madison Ave, NYC</option>
                          <option>Downtown Atelier - SoHo, NYC</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Pickup Window</label>
                        <select className="w-full rounded-lg border border-primary/20 bg-background-light dark:bg-slate-700 px-4 py-3.5 focus:ring-2 focus:ring-primary outline-none">
                          <option>Morning (10:00 AM - 1:00 PM)</option>
                          <option>Afternoon (1:00 PM - 4:00 PM)</option>
                        </select>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white pb-2 border-b border-primary/10">Shipping Address</h3>
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={address.street}
                      onChange={e => setAddress({ ...address, street: e.target.value })}
                      className="w-full rounded-lg border border-primary/20 bg-background-light dark:bg-slate-700 px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="City"
                        value={address.city}
                        onChange={e => setAddress({ ...address, city: e.target.value })}
                        className="w-full rounded-lg border border-primary/20 bg-background-light dark:bg-slate-700 px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={address.state}
                        onChange={e => setAddress({ ...address, state: e.target.value })}
                        className="w-full rounded-lg border border-primary/20 bg-background-light dark:bg-slate-700 px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Zip Code"
                        value={address.zipCode}
                        onChange={e => setAddress({ ...address, zipCode: e.target.value })}
                        className="w-full rounded-lg border border-primary/20 bg-background-light dark:bg-slate-700 px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                    {netSubtotal < 500 && (
                      <p className="text-red-500 text-sm mt-2 font-medium">Orders under $500 incur a $15.00 shipping fee.</p>
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="w-full lg:w-96 bg-primary/5 dark:bg-slate-800 p-8 rounded-2xl border border-primary/20 h-fit">
            <h3 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">Summary</h3>
            <div className="space-y-4 text-sm mb-8">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium text-slate-900 dark:text-white">${subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-green-600 font-bold">Discount (SWEET15)</span>
                  <span className="text-green-600 font-medium">-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-slate-500">{method === 'pickup' ? 'Pickup Fee' : 'Shipping'}</span>
                <span className="text-primary font-medium">{shippingFee === 0 ? 'Free' : `$${shippingFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tax (8%)</span>
                <span className="font-medium text-slate-900 dark:text-white">${tax.toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t border-primary/20 flex justify-between text-lg font-black text-slate-900 dark:text-white">
                <span>Total</span>
                <span className="text-primary">${total.toFixed(2)}</span>
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
                  className="flex-1 rounded-lg border border-primary/20 bg-background-light dark:bg-slate-700 focus:ring-1 focus:ring-primary focus:border-primary text-sm uppercase px-4 py-2"
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
              onClick={handlePlaceOrder}
              disabled={cart.length === 0}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {user ? 'Place Secure Order' : 'Login to Order'}
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-[10px] text-center mt-4 text-slate-400 tracking-widest uppercase">SSL Secure Encrypted Checkout</p>
          </div>

        </div>
      </div>
    </main>
  );
}
