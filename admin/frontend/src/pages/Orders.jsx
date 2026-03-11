import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, MoreVertical, CheckCircle, Clock, Truck, Package, PackageOpen, ChevronRight, Loader2, AlertCircle } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null); // ID of order being updated
  const [activeMenuId, setActiveMenuId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/orders', { withCredentials: true });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to fetch orders. Are you logged in as an admin?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // If clicking outside, close menu. We do a simple check.
      if (!event.target.closest('.action-menu-container')) {
        setActiveMenuId(null);
      }
    };
    
    if (activeMenuId) {
        document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
        document.addEventListener('mousedown', handleClickOutside);
    };
  }, [activeMenuId]);

  const updateStatus = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await axios.put(`http://localhost:5000/api/admin/orders/${orderId}/status`, { status: newStatus }, { withCredentials: true });
      // Update local state
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const statusColors = {
    'Processing': 'bg-amber-100 text-amber-700 border-amber-200',
    'Ready for Pickup': 'bg-blue-100 text-blue-700 border-blue-200',
    'Out for Delivery': 'bg-purple-100 text-purple-700 border-purple-200',
    'Delivered': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Completed': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Cancelled': 'bg-red-100 text-red-700 border-red-200',
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <Loader2 className="animate-spin text-primary" size={40} />
      <p className="text-slate-500 font-medium">Fetching artisanal orders...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
      <AlertCircle className="text-red-500" size={40} />
      <div>
        <h3 className="text-lg font-bold text-slate-900">Error Accessing Orders</h3>
        <p className="text-slate-500 mt-1 max-w-md">{error}</p>
      </div>
      <button onClick={fetchOrders} className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:brightness-110 transition-all">
        Try Again
      </button>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">ORDERS MANAGEMENT</h1>
          <p className="text-slate-500 mt-1">Manage and track all customer orders in real-time.</p>
        </div>
        <div className="flex gap-2">
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                    type="text" 
                    placeholder="Search by ID or Phone..." 
                    className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-primary focus:border-primary outline-none text-sm min-w-[280px] shadow-sm"
                />
            </div>
            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-primary hover:border-primary transition-all shadow-sm">
                <Filter size={20} />
            </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Order Ref</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Customer</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Method</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500 text-right">Amount</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Status</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <p className="font-bold text-slate-900 truncate max-w-[120px]">#{order._id.toUpperCase().slice(-8)}</p>
                    <p className="text-xs text-slate-400 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="font-bold text-slate-900">{order.user?.name || 'Guest User'}</p>
                    <p className="text-xs text-slate-500 mt-1">{order.user?.phoneNumber}</p>
                  </td>
                  <td className="px-6 py-5">
                     <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${statusColors[order.status] || 'border-slate-200 text-slate-600'}`}>
                        {order.shippingMethod === 'pickup' ? <Clock size={12} /> : <Truck size={12} />}
                        {order.shippingMethod.toUpperCase()}
                     </span>
                  </td>
                  <td className="px-6 py-5 text-right font-black text-slate-900">
                    ₹{order.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-5">
                    {updating === order._id ? (
                        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase animate-pulse">
                            <Loader2 size={12} className="animate-spin" /> Updating...
                        </div>
                    ) : (
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold border ${statusColors[order.status] || 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                            {order.status || 'Processing'}
                        </span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-right relative action-menu-container">
                    <button 
                      onClick={() => setActiveMenuId(activeMenuId === order._id ? null : order._id)}
                      className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <MoreVertical size={20} />
                    </button>
                    
                    {/* Action Menu Dropdown */}
                    {activeMenuId === order._id && (
                      <div className="absolute right-10 top-5 w-48 bg-white rounded-xl shadow-xl shadow-slate-900/10 border border-slate-200 py-2 z-50 text-left animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-2 border-b border-slate-100 mb-1">
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Update Status</p>
                        </div>
                        
                        <button onClick={() => { updateStatus(order._id, 'Processing'); setActiveMenuId(null); }} className="w-full text-left px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors">
                          Processing
                        </button>
                        
                        {order.shippingMethod === 'pickup' && (
                          <button onClick={() => { updateStatus(order._id, 'Ready for Pickup'); setActiveMenuId(null); }} className="w-full text-left px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                            Ready for Pickup
                          </button>
                        )}

                        {order.shippingMethod === 'delivery' && (
                          <button onClick={() => { updateStatus(order._id, 'Out for Delivery'); setActiveMenuId(null); }} className="w-full text-left px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-purple-600 transition-colors">
                            Out for Delivery
                          </button>
                        )}
                        
                        <div className="h-px bg-slate-100 my-1"></div>

                        <button onClick={() => { updateStatus(order._id, order.shippingMethod === 'pickup' ? 'Completed' : 'Delivered'); setActiveMenuId(null); }} className="w-full text-left px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 transition-colors flex items-center gap-2">
                          <CheckCircle size={14} /> Handle Complete
                        </button>
                        
                        <button onClick={() => { updateStatus(order._id, 'Cancelled'); setActiveMenuId(null); }} className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-1">
                          Cancel Order
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                  <tr>
                      <td colSpan="6" className="px-6 py-20 text-center text-slate-400">
                          <Package className="mx-auto mb-4 opacity-20" size={48} />
                          No orders found in the system.
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 tracking-wider">SHOWING {orders.length} ORDERS</p>
            <div className="flex gap-2">
                <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-400 cursor-not-allowed">PREV</button>
                <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-900 hover:border-primary transition-all">NEXT</button>
            </div>
        </div>
      </div>
    </div>
  );
}
