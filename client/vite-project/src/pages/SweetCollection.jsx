import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Heart, Filter, Loader } from 'lucide-react';
import useStore from '../store/useStore';
import { parseWeightToKg } from '../utils/weightUtils';

export default function SweetCollection() {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategories, setActiveCategories] = useState(['sweet', 'sugar-free', 'gut-free']);
  const { addToCart, cart } = useStore();
  
  // Selection states mapped by product ID
  const [selections, setSelections] = useState({});

  useEffect(() => {
    const fetchSweets = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        // Filter out gift packs
        const sweetsList = res.data.filter(p => !p.isGiftPack);
        setAllProducts(sweetsList);
        
        // Initialize default selections
        const initialSelections = {};
        sweetsList.forEach(p => {
          if (p.weights && p.weights.length > 0) {
            initialSelections[p._id] = p.weights[0];
          }
        });
        setSelections(initialSelections);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSweets();
  }, []);

  const handleWeightChange = (productId, weightObj) => {
    setSelections(prev => ({
      ...prev,
      [productId]: weightObj
    }));
  };

  const toggleCategory = (cat) => {
    setActiveCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleAddToCart = (product) => {
    const selection = selections[product._id];
    if (!selection) return;

    const price = product.basePrice * selection.multiplier;
    addToCart(product, 1, selection.weight, price);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full px-4 md:px-10 py-8 lg:py-12">
      {/* Page Heading Segment */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-slate-100 mb-4 tracking-tight">
          Sweets Collection
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          Experience the finest artisanal sweets crafted with gold-standard ingredients and centuries of tradition.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-12">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 space-y-8 shrink-0">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Filter className="text-primary w-4 h-4" />
              Categories
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" checked={activeCategories.includes('sweet')} onChange={() => toggleCategory('sweet')} className="rounded border-primary/30 text-primary focus:ring-primary/20 bg-transparent" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-primary">Traditional</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" checked={activeCategories.includes('sugar-free')} onChange={() => toggleCategory('sugar-free')} className="rounded border-primary/30 text-primary focus:ring-primary/20 bg-transparent" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-primary">Sugar-Free</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" checked={activeCategories.includes('gut-free')} onChange={() => toggleCategory('gut-free')} className="rounded border-primary/30 text-primary focus:ring-primary/20 bg-transparent" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-primary">Gut-Free</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-slate-500 font-medium">Showing {allProducts.filter(p => activeCategories.includes(p.category) || (!p.category && activeCategories.includes('sweet'))).length} artisanal sweets</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {allProducts.filter(p => activeCategories.includes(p.category) || (!p.category && activeCategories.includes('sweet'))).map(product => {
              const currentSelection = selections[product._id];
              const price = currentSelection ? (product.basePrice * currentSelection.multiplier).toFixed(2) : product.basePrice.toFixed(2);
              
              const currentWeightOption = currentSelection?.weight || '';
              
              // Calculate total kg of this product currently in the cart
              const totalStockUsedInCart = cart
                .filter(item => item.product._id === product._id)
                .reduce((total, item) => total + (item.quantity * parseWeightToKg(item.weight)), 0);

              const currentSelectionKg = parseWeightToKg(currentWeightOption);

              const isOutOfStock = product.stock === 0;
              const isMaxReached = !isOutOfStock && (totalStockUsedInCart + currentSelectionKg > product.stock);

              return (
                <div key={product._id} className="bg-white dark:bg-background-dark/40 border border-primary/5 rounded-xl overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all flex flex-col">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      src={product.image} 
                    />
                    <button className="absolute top-3 right-3 size-8 rounded-full bg-white/90 dark:bg-slate-800/90 text-slate-400 hover:text-red-500 flex items-center justify-center shadow-sm">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">{product.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{product.description}</p>
                    
                    {/* Weight Selector */}
                    {product.weights && product.weights.length > 0 && (
                      <div className="mb-4">
                        <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Select Weight</label>
                        <select 
                          className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm rounded outline-none p-2"
                          value={currentSelection?.weight || ''}
                          onChange={(e) => {
                            const weightObj = product.weights.find(w => w.weight === e.target.value);
                            if (weightObj) handleWeightChange(product._id, weightObj);
                          }}
                        >
                          {product.weights.map(w => (
                            <option key={w.weight} value={w.weight}>{w.weight}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xl font-black text-primary">${price}</span>
                      
                      {isOutOfStock ? (
                        <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold border border-red-200">
                          Out of Stock
                        </div>
                      ) : isMaxReached ? (
                        <div className="bg-slate-100 text-slate-500 px-4 py-2 rounded-lg text-sm font-bold border border-slate-200 cursor-not-allowed">
                          Max Reached
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleAddToCart(product)}
                          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:brightness-110 transition-all active:scale-95"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {allProducts.filter(p => activeCategories.includes(p.category) || (!p.category && activeCategories.includes('sweet'))).length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500">
                No sweets found matching the selected categories.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
