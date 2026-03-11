import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Package, PackageOpen, Loader2, Edit2, Check, X, AlertCircle } from 'lucide-react';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for inline editing
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ basePrice: 0, stock: 0 });
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/products', { withCredentials: true });
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEditClick = (product) => {
    setEditingId(product._id);
    setEditForm({ basePrice: product.basePrice, stock: product.stock });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = async (id) => {
    setIsUpdating(true);
    try {
      const res = await axios.put(`http://localhost:5000/api/admin/products/${id}`, editForm, { withCredentials: true });
      setProducts(products.map(p => p._id === id ? res.data : p));
      setEditingId(null);
    } catch (err) {
      alert('Failed to update product');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <Loader2 className="animate-spin text-primary" size={40} />
      <p className="text-slate-500 font-medium">Loading inventory...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
      <AlertCircle className="text-red-500" size={40} />
      <div>
        <h3 className="text-lg font-bold text-slate-900">Error Accessing Products</h3>
        <p className="text-slate-500 mt-1 max-w-md">{error}</p>
      </div>
      <button onClick={fetchProducts} className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:brightness-110 transition-all">
        Try Again
      </button>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight text-transform uppercase">Inventory Management</h1>
          <p className="text-slate-500 mt-1">Manage product pricing and available stock quantities.</p>
        </div>
        <div className="flex gap-2">
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                    type="text" 
                    placeholder="Search products..." 
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
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Item</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Category</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500 text-right">Base Price (₹)</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500 text-center">Available Stock</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 line-clamp-1">{product.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 max-w-[200px]">{product.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">
                      {product.category || 'Standard'}
                    </span>
                  </td>
                  
                  {/* BASE PRICE COLUMN */}
                  <td className="px-6 py-4 text-right">
                    {editingId === product._id ? (
                      <input 
                        type="number" 
                        value={editForm.basePrice} 
                        onChange={(e) => setEditForm({...editForm, basePrice: Number(e.target.value)})}
                        className="w-24 text-right px-2 py-1 rounded border border-primary/50 outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-900"
                        min="0"
                      />
                    ) : (
                      <span className="font-bold text-slate-900">₹{product.basePrice}</span>
                    )}
                  </td>

                  {/* STOCK COLUMN */}
                  <td className="px-6 py-4 text-center">
                    {editingId === product._id ? (
                      <input 
                        type="number" 
                        value={editForm.stock} 
                        onChange={(e) => setEditForm({...editForm, stock: Number(e.target.value)})}
                        className="w-20 text-center px-2 py-1 rounded border border-primary/50 outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-900"
                        min="0"
                      />
                    ) : (
                      <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-black border ${
                        product.stock > 10 ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                        : product.stock > 0 ? 'bg-amber-50 text-amber-600 border-amber-200'
                        : 'bg-red-50 text-red-600 border-red-200'
                      }`}>
                        {product.stock} {product.isGiftPack ? 'Units' : 'KG'}
                      </span>
                    )}
                  </td>

                  {/* ACTIONS COLUMN */}
                  <td className="px-6 py-4 text-right">
                    {editingId === product._id ? (
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleSaveEdit(product._id)}
                          disabled={isUpdating}
                          className="p-1.5 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors disabled:opacity-50"
                        >
                          {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                        </button>
                        <button 
                          onClick={handleCancelEdit}
                          disabled={isUpdating}
                          className="p-1.5 bg-slate-200 text-slate-600 rounded hover:bg-slate-300 transition-colors disabled:opacity-50"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleEditClick(product)}
                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all border border-transparent hover:border-primary/20"
                      >
                        <Edit2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                  <tr>
                      <td colSpan="5" className="px-6 py-20 text-center text-slate-400">
                          <Package className="mx-auto mb-4 opacity-20" size={48} />
                          No products found in the database.
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
