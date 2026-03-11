import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Clock, CheckCircle, Package, ArrowRight, TrendingUp, DollarSign, Users } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ totalOrders: 0, totalUsers: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/stats', { withCredentials: true });
        setStats(res.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to load statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-emerald-500' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'bg-primary' },
    { label: 'Active Customers', value: stats.totalUsers, icon: Users, color: 'bg-blue-500' },
    { label: 'Completion Rate', value: '98.5%', icon: TrendingUp, color: 'bg-purple-500' },
  ];

  if (loading) return <div className="p-20 text-center">Loading stats...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">DASHBOARD</h1>
          <p className="text-slate-500 mt-1">Welcome back. Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
            <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 text-sm font-bold flex items-center gap-2">
                <Clock size={16} className="text-slate-400" />
                Updated Just Now
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} opacity-[0.03] rounded-bl-[100px] -z-0 transition-all group-hover:opacity-[0.06]`}></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-black text-slate-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-xl text-white shadow-lg shadow-current/10`}>
                <stat.icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase mb-6">Recent Performance</h2>
              <div className="h-64 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-slate-400">
                  Analytics Chart Placeholder
              </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col">
              <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase mb-6">Quick Actions</h2>
              <div className="space-y-4 flex-1">
                  <button className="w-full h-14 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-primary/20">
                      Add New Product
                      <ArrowRight size={18} />
                  </button>
                  <button className="w-full h-14 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                      Export Reports
                  </button>
                  <button className="w-full h-14 bg-white border-2 border-slate-200 text-slate-900 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                      Site Settings
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
}
