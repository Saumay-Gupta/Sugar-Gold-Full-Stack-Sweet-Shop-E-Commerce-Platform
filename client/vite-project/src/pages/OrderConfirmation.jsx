import { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { Home, Printer, CheckCircle, Store, MapPin, Truck, Box, Smartphone } from 'lucide-react';
import useStore from '../store/useStore';

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useStore();

  // The checkout page should pass state: { orderId, method, address, total, items, time }
  const orderDetails = location.state;

  useEffect(() => {
    // If someone visits /confirmation directly without placing an order, redirect home
    if (!orderDetails) {
      navigate('/');
    }
  }, [orderDetails, navigate]);

  if (!orderDetails) return null;

  const { orderId, method, address, total, items, time } = orderDetails;

  // Unique QR string containing phone number and order ID
  const qrString = `${user?.phoneNumber || 'GUEST'}-${orderId}`;

  return (
    <main className="flex-1 px-4 py-8 lg:px-40 bg-background-light dark:bg-background-dark min-h-screen">
      <div className="max-w-[800px] mx-auto">

        {/* Success Message */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4 text-white shadow-lg shadow-primary/20">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h1 className="text-slate-900 dark:text-slate-100 text-3xl lg:text-4xl font-black mb-2 uppercase tracking-tight">Order Confirmed!</h1>
          <p className="text-primary font-bold text-lg tracking-widest uppercase">Order #{orderId.substring(orderId.length - 8).toUpperCase()}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

          {/* Conditional Delivery/Pickup Block */}
          {method === 'pickup' ? (
            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl border border-primary/20 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10"></div>
              <div className="flex items-center gap-2 mb-6 text-primary border-b border-primary/10 pb-4">
                <Store className="w-6 h-6" />
                <h2 className="text-lg font-black uppercase tracking-wider">Pickup Details</h2>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <MapPin className="text-primary mt-1 w-5 h-5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Store</p>
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-lg">Downtown Flagship Store</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">123 Golden Sands Avenue, Suite 400</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <Box className="text-primary mt-1 w-5 h-5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Estimated Ready Time</p>
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-lg">Within 2 Hours</p>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="w-full h-32 bg-slate-100 dark:bg-slate-700 rounded-xl overflow-hidden relative border border-primary/10">
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-80"
                      style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB7uHgjsqNq1r8Iyq5nKmVsCWGUKpGhdOSWIs9JOcFDMNHvAqPLRqLxoTiPxwGQfM2R10E8VCi6TlrNBj04ragYgdkkToeVXy2hsQzkpp_rM430k0CyDxzeqyP4Nl-tJF4OTiS36BxhghwMes7yoBkK42MdHPzZQgF9fQEfhb7zLufhLUjZn_v3AjOL_QcZot_r9qfBeLkPt19XrFkZNYUYWAYEfiC5WFq_g2JvULCcSmV5mgNOfRr0oZ3CcveUfHdWO3ZDussKFIhi')" }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white p-2 rounded-full shadow-lg">
                        <MapPin className="text-primary w-6 h-6" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl border border-primary/20 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10"></div>
              <div className="flex items-center gap-2 mb-6 text-primary border-b border-primary/10 pb-4">
                <Truck className="w-6 h-6" />
                <h2 className="text-lg font-black uppercase tracking-wider">Delivery Details</h2>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <MapPin className="text-primary mt-1 w-5 h-5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Shipping To</p>
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-lg">{address?.street}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{address?.city}, {address?.state} {address?.zipCode}</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <Box className="text-primary mt-1 w-5 h-5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Estimated Delivery</p>
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-lg">Tomorrow by 8:00 PM</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-primary/10">
                  <div className="flex items-center gap-3 w-full bg-primary/10 rounded-lg p-4">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                    <p className="font-bold text-sm text-slate-900 dark:text-white">Processing your artisanal order...</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Conditional QR Code / Status */}
          {method === 'pickup' ? (
            <div className="bg-slate-900 p-6 rounded-2xl border border-primary/20 shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/5"></div>
              <h2 className="text-lg font-black uppercase tracking-wider text-white mb-6 relative z-10">Your Pickup Code</h2>

              <div className="bg-white p-6 rounded-xl shadow-2xl mb-6 border-4 border-primary/20 relative z-10">
                <QRCode
                  value={qrString}
                  size={160}
                  level="H"
                  fgColor="#221d10"
                />
              </div>

              <div className="relative z-10 space-y-2">
                <p className="text-sm text-slate-400 font-medium">Present this code at the counter</p>
                <div className="bg-white/10 px-4 py-2 rounded-lg inline-block border border-white/5">
                  <p className="text-xl font-mono font-black tracking-widest text-primary">{user?.phoneNumber || 'GUEST'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 p-6 rounded-2xl border border-primary/20 shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/5"></div>
              <h2 className="text-lg font-black uppercase tracking-wider text-white mb-6 relative z-10">Tracking Status</h2>

              <div className="w-full max-w-[250px] space-y-8 relative z-10 my-8">
                {/* Timeline */}
                <div className="flex items-center gap-4 opacity-100">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</div>
                  <div className="text-left">
                    <p className="font-bold text-white text-lg">Order Placed</p>
                    <p className="text-sm text-slate-400">{new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 opacity-50">
                  <div className="w-8 h-8 rounded-full bg-slate-700 text-slate-400 flex items-center justify-center font-bold">2</div>
                  <div className="text-left">
                    <p className="font-bold text-white text-lg">Baking & Prep</p>
                    <p className="text-sm text-slate-400">Pending</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 opacity-50">
                  <div className="w-8 h-8 rounded-full bg-slate-700 text-slate-400 flex items-center justify-center font-bold">3</div>
                  <div className="text-left">
                    <p className="font-bold text-white text-lg">Out for Delivery</p>
                    <p className="text-sm text-slate-400">Pending</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Order Summary Summary (Compact) */}
        <div className="mb-12">
          <h2 className="text-xl font-black mb-6 uppercase tracking-wider text-slate-900 dark:text-white">Order Summary</h2>
          <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-primary/20 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-primary/10">
              <p className="text-slate-500 font-medium mb-1">Total Paid (Secure SSL)</p>
              <p className="text-4xl font-black text-primary">${total.toFixed(2)}</p>
            </div>
            <div className="bg-primary/5 p-6 space-y-3">
              <p className="text-sm font-bold text-slate-900 dark:text-white flex justify-between">
                <span>Items ({items.length})</span>
                <span className="text-primary font-black uppercase cursor-pointer hover:underline">View Receipt Details</span>
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pb-20">
          <Link to="/" className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 tracking-wider uppercase text-sm w-full sm:w-auto">
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-slate-800 border-2 border-primary text-primary rounded-xl font-bold hover:bg-primary/5 transition-all tracking-wider uppercase text-sm w-full sm:w-auto"
          >
            <Printer className="w-5 h-5" />
            Print Receipt
          </button>
        </div>

      </div>
    </main>
  );
}
