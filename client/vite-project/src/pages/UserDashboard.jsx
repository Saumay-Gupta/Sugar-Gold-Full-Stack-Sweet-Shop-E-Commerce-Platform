import React, { useState, useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import axios from 'axios';
import { Package2, MapPin, CreditCard, Settings, User, LogOut, Loader2, History, Truck, Clock, CheckCircle, Store, Home, Briefcase, ChevronDown, ChevronUp } from 'lucide-react';
import QRCode from 'react-qr-code';

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useStore();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'addresses' | 'settings'
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ street: '', city: '', state: '', zipCode: '' });

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/orders/me', {
          withCredentials: true
        });
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch orders', err);
        setError('Failed to load orders.');
      } finally {
        setIsLoading(false);
      }
    };

    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [user, navigate, activeTab]);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
      logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('http://localhost:5000/api/auth/me/address', {
        address: newAddress
      }, { withCredentials: true });
      updateUser(res.data);
      setIsAddingAddress(false);
      setNewAddress({ street: '', city: '', state: '', zipCode: '' });
    } catch (err) {
      console.error('Failed to update address', err);
      // Handle error visually if needed
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-1 flex-col lg:flex-row max-w-[1440px] mx-auto w-full min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 py-8 lg:py-12 px-4 lg:px-8">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-72 flex flex-col border-r border-primary/10 pr-0 lg:pr-6 pb-6 lg:pb-0 mb-8 lg:mb-0">
        <div className="flex flex-col gap-6 h-full">
          {/* User Info Card */}
          <div className="flex gap-4 items-center p-4 bg-white/50 dark:bg-zinc-900/30 rounded-xl border border-primary/10 shadow-sm">
            <div className="bg-primary/20 rounded-full w-12 h-12 flex items-center justify-center text-primary overflow-hidden flex-shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <h1 className="text-slate-900 dark:text-slate-100 text-base font-semibold truncate">
                {user.name || 'Valued Guest'}
              </h1>
              <p className="text-primary text-xs font-medium uppercase tracking-wider truncate">
                {user.phoneNumber}
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'orders' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-600 dark:text-slate-400 hover:bg-primary/5'}`}
            >
              <Package2 className="w-5 h-5" />
              <span className="text-sm font-medium">My Orders</span>
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'addresses' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-600 dark:text-slate-400 hover:bg-primary/5'}`}
            >
              <MapPin className="w-5 h-5" />
              <span className="text-sm font-medium">Addresses</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'settings' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-600 dark:text-slate-400 hover:bg-primary/5'}`}
            >
              <Settings className="w-5 h-5" />
              <span className="text-sm font-medium">Account Settings</span>
            </button>
          </nav>

          <div className="mt-auto pt-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 rounded-lg h-12 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/10 dark:hover:bg-red-900/20 dark:text-red-400 font-bold text-sm tracking-wide transition-all border border-red-200 dark:border-red-900/30"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:pl-8 gap-8">

        {activeTab === 'orders' && (
          <>
            <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-slate-900 dark:text-slate-100 text-3xl font-black tracking-tight">My Orders</h1>
                <p className="text-slate-500 dark:text-slate-400 text-base">Track your premium sweet selections and order history.</p>
              </div>
            </section>

            <section className="bg-white dark:bg-zinc-900 rounded-xl border border-primary/10 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-primary/10 flex justify-between items-center">
                <h2 className="text-lg font-bold">Order History</h2>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center p-12">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : error ? (
                <div className="p-8 text-center text-red-500">{error}</div>
              ) : orders.length === 0 ? (
                <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-4">
                  <Package2 className="w-12 h-12 text-slate-300" />
                  <p>You haven't placed any orders yet.</p>
                  <button onClick={() => navigate('/sweets')} className="text-primary hover:underline font-bold mt-2">Browse Sweets</button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-primary/5 text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4 font-semibold">Order ID</th>
                        <th className="px-6 py-4 font-semibold">Date</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primary/10">
                      {orders.map(order => (
                        <Fragment key={order._id}>
                          <tr
                            className={`transition-colors cursor-pointer ${expandedOrderId === order._id ? 'bg-primary/10' : 'hover:bg-primary/5'}`}
                            onClick={() => setExpandedOrderId(expandedOrderId === order._id ? null : order._id)}
                          >
                            <td className="px-6 py-4 font-medium text-sm flex items-center gap-2">
                              {expandedOrderId === order._id ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                              #{order._id.slice(-6).toUpperCase()}
                            </td>
                            <td className="px-6 py-4 text-slate-500 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'Ready for Pickup' || order.status === 'Delivered'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200'
                                }`}>
                                {order.status || 'Processing'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right font-semibold">₹{order.totalAmount}</td>
                          </tr>

                          {/* Expandable Details Row */}
                          {expandedOrderId === order._id && (
                            <tr>
                              <td colSpan="4" className="p-0 border-b border-primary/10 bg-slate-50/50 dark:bg-zinc-900/50">
                                <div className="p-6 md:p-8 animate-in slide-in-from-top-2 duration-200">

                                  {(order.status === 'Delivered' || order.status === 'Completed') ? (
                                    /* --- Delivered / Completed View --- */
                                    <div className="bg-white dark:bg-zinc-800 rounded-xl border border-green-200 dark:border-green-900/30 shadow-sm p-6 max-w-2xl mx-auto">
                                      <div className="flex flex-col items-center text-center mb-6">
                                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-3">
                                          <CheckCircle className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Order Delivered Successfully</h3>
                                        <p className="text-sm text-slate-500 mt-1">
                                          Delivered on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                      </div>

                                      <div className="border-t border-dashed border-slate-200 dark:border-slate-700 pt-6">
                                        <h4 className="font-bold text-sm uppercase tracking-wider text-slate-500 mb-4">Final Receipt</h4>
                                        <div className="space-y-4 mb-6">
                                          {order.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-start text-sm">
                                              <div>
                                                <p className="font-semibold text-slate-800 dark:text-slate-200">{item.product.name}</p>
                                                <p className="text-slate-500 dark:text-slate-400">{item.weight} • Qty: {item.quantity}</p>
                                              </div>
                                              <p className="font-semibold text-slate-800 dark:text-slate-200">₹{item.priceAtTime * item.quantity}</p>
                                            </div>
                                          ))}
                                        </div>

                                        <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-700 pt-4">
                                          <span className="font-bold text-slate-800 dark:text-slate-200">Total Paid</span>
                                          <span className="font-black text-lg text-primary">₹{order.totalAmount}</span>
                                        </div>
                                      </div>
                                    </div>

                                  ) : order.shippingMethod === 'pickup' ? (
                                    /* --- Pickup Flow View --- */
                                    <div className="flex flex-col md:flex-row gap-8 items-center justify-center max-w-2xl mx-auto bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-primary/20 p-8">
                                      <div className="flex flex-col items-center text-center">
                                        <div className="bg-slate-50 dark:bg-zinc-900 p-4 rounded-xl border-2 border-primary/10 mb-4">
                                          <QRCode
                                            value={`${user?.phoneNumber || 'GUEST'}-${order._id}`}
                                            size={140}
                                            level="L"
                                            fgColor="#b3850f"
                                            bgColor="transparent"
                                          />
                                        </div>
                                        <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">Pickup Code</p>
                                        <p className="text-lg font-mono font-black text-primary mt-1">{order._id.slice(-6).toUpperCase()}</p>
                                      </div>

                                      <div className="flex flex-col gap-4 flex-1">
                                        <div className="flex items-center gap-3 text-primary border-b border-primary/10 pb-3">
                                          <Store className="w-5 h-5" />
                                          <h3 className="font-bold uppercase tracking-wider">Store Pickup</h3>
                                        </div>
                                        <div>
                                          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Status</p>
                                          <div className="flex items-center gap-2">
                                            <span className="relative flex h-3 w-3">
                                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                                            </span>
                                            <p className="font-bold text-amber-600 dark:text-amber-500">{order.status}</p>
                                          </div>
                                        </div>
                                        <div>
                                          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Location</p>
                                          <p className="font-bold text-slate-800 dark:text-slate-200">Downtown Flagship Store</p>
                                          <p className="text-sm text-slate-500 mt-1">123 Golden Sands Avenue, Suite 400</p>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    /* --- Delivery Flow View --- */
                                    <div className="flex flex-col gap-8 max-w-2xl mx-auto bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-primary/20 p-8">
                                      <div className="flex items-center gap-3 text-primary border-b border-primary/10 pb-3">
                                        <Truck className="w-5 h-5" />
                                        <h3 className="font-bold uppercase tracking-wider">Delivery Tracking</h3>
                                      </div>

                                      <div className="relative pl-6 lg:pl-10 space-y-8">
                                        <div className="absolute left-[15px] lg:left-[31px] top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-700"></div>

                                        <div className="relative z-10 flex items-start gap-4">
                                          <div className="w-8 h-8 -ml-[40px] lg:-ml-[48px] rounded-full bg-primary text-white flex items-center justify-center font-bold ring-4 ring-white dark:ring-zinc-800 mt-1 shadow-sm">
                                            <CheckCircle className="w-4 h-4" />
                                          </div>
                                          <div>
                                            <p className="font-bold text-slate-900 dark:text-white">Order Placed</p>
                                            <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                          </div>
                                        </div>

                                        <div className="relative z-10 flex items-start gap-4 opacity-75">
                                          <div className="w-8 h-8 -ml-[40px] lg:-ml-[48px] rounded-full bg-amber-500 text-white flex items-center justify-center font-bold ring-4 ring-white dark:ring-zinc-800 mt-1 shadow-sm">
                                            <Clock className="w-4 h-4" />
                                          </div>
                                          <div>
                                            <p className="font-bold text-slate-900 dark:text-white">Baking & Preparation</p>
                                            <p className="text-sm text-amber-600 dark:text-amber-500 font-medium tracking-wide">In Progress</p>
                                          </div>
                                        </div>

                                        <div className="relative z-10 flex items-start gap-4 opacity-40">
                                          <div className="w-8 h-8 -ml-[40px] lg:-ml-[48px] rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 flex items-center justify-center font-bold ring-4 ring-white dark:ring-zinc-800 mt-1 shadow-sm">
                                            <Truck className="w-4 h-4" />
                                          </div>
                                          <div>
                                            <p className="font-bold text-slate-900 dark:text-white">Out for Delivery</p>
                                            <p className="text-sm text-slate-500">Pending</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}

        {activeTab === 'addresses' && (
          <section className="flex flex-col gap-8">
            <div className="flex flex-col gap-1">
              <h1 className="text-slate-900 dark:text-slate-100 text-3xl font-black tracking-tight">Saved Addresses</h1>
              <p className="text-slate-500 dark:text-slate-400 text-base">Manage your delivery locations.</p>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-primary/10 shadow-sm flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Your Addresses
                </h2>
                {!isAddingAddress && (
                  <button onClick={() => setIsAddingAddress(true)} className="text-primary text-sm font-bold bg-primary/10 px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors">
                    Add New
                  </button>
                )}
              </div>

              {isAddingAddress ? (
                <form onSubmit={handleAddAddress} className="bg-primary/5 p-6 rounded-xl border border-primary/20 flex flex-col gap-4">
                  <h3 className="font-bold text-sm mb-2">Add New Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input required type="text" placeholder="Street Address" value={newAddress.street} onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} className="bg-white dark:bg-zinc-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none text-sm" />
                    <input required type="text" placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} className="bg-white dark:bg-zinc-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none text-sm" />
                    <input required type="text" placeholder="State" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} className="bg-white dark:bg-zinc-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none text-sm" />
                    <input required type="text" placeholder="ZIP Code" value={newAddress.zipCode} onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })} className="bg-white dark:bg-zinc-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none text-sm" />
                  </div>
                  <div className="flex justify-end gap-3 mt-4">
                    <button type="button" onClick={() => setIsAddingAddress(false)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">Save Address</button>
                  </div>
                </form>
              ) : user.addresses && user.addresses.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {user.addresses.map((addr, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-5 rounded-xl bg-white dark:bg-zinc-800 border border-primary/10 hover:border-primary/30 transition-colors shadow-sm">
                      <div className="text-primary pt-1 bg-primary/10 p-2 rounded-lg">
                        <Home className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <p className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-1">Saved Address {idx + 1}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                          {addr.street}<br />
                          {addr.city}, {addr.state} {addr.zipCode}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  <MapPin className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                  <p>You haven't saved any addresses yet.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === 'settings' && (
          <section className="flex flex-col gap-8">
            <div className="flex flex-col gap-1">
              <h1 className="text-slate-900 dark:text-slate-100 text-3xl font-black tracking-tight">Account Settings</h1>
              <p className="text-slate-500 dark:text-slate-400 text-base">Manage your personal information.</p>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-primary/10 shadow-sm">
              <p className="text-slate-500 mb-6">Update your profile details below.</p>
              {/* Provide simple form to update name */}
              <form onSubmit={async (e) => {
                e.preventDefault();
                const name = e.target.name.value;
                try {
                  const res = await axios.put('http://localhost:5000/api/auth/me/address', { name }, { withCredentials: true });
                  updateUser(res.data);
                  alert('Profile updated successfully!');
                } catch (err) {
                  console.error(err);
                  alert('Failed to update profile.');
                }
              }} className="max-w-md flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input name="name" type="text" defaultValue={user.name} className="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input type="text" disabled value={user.phoneNumber} className="w-full bg-slate-100 dark:bg-zinc-800/50 border border-slate-200 dark:border-slate-800 text-slate-500 rounded-lg px-4 py-2 cursor-not-allowed" />
                </div>
                <button type="submit" className="mt-2 bg-primary text-white font-bold py-2 px-6 rounded-lg w-fit hover:bg-primary/90 transition-colors">
                  Save Changes
                </button>
              </form>
            </div>
          </section>
        )}

      </main>
    </div>
  );
}
