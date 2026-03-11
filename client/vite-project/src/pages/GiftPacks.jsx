import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Gift, Loader, ChevronLeft, Plus, Minus, Check } from 'lucide-react';
import useStore from '../store/useStore';

export default function GiftPacks() {
  const [giftPacks, setGiftPacks] = useState([]);
  const [sweetsList, setSweetsList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Custom box state
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [selectedBox, setSelectedBox] = useState(null);
  const [customItems, setCustomItems] = useState({}); // { sweetId: quantity }
  
  const { addToCart } = useStore();

  const boxOptions = [
    { id: 'standard', name: 'Standard Elegant Box', price: 10.00, desc: 'A beautiful minimal box.' },
    { id: 'premium', name: 'Premium Velvet Box', price: 25.00, desc: 'Wrapped in rich emerald velvet.' },
    { id: 'luxury', name: 'Luxury Gold Heritage Box', price: 50.00, desc: 'Hand-carved wooden box with gold accents.' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [packsRes, sweetsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/products?category=gift-pack'),
          axios.get('http://localhost:5000/api/products')
        ]);
        setGiftPacks(packsRes.data);
        setSweetsList(sweetsRes.data.filter(p => !p.isGiftPack));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddPreCurated = (pack) => {
    const weight = pack.weights?.[0]?.weight || 'Standard Box';
    const price = pack.basePrice * (pack.weights?.[0]?.multiplier || 1);
    addToCart(pack, 1, weight, price);
  };

  const handleAddCustomItem = (sweetId, delta) => {
    setCustomItems(prev => {
      const current = prev[sweetId] || 0;
      const next = Math.max(0, current + delta);
      const updated = { ...prev };
      if (next === 0) {
        delete updated[sweetId];
      } else {
        updated[sweetId] = next;
      }
      return updated;
    });
  };

  const getCustomTotal = () => {
    let total = selectedBox ? selectedBox.price : 0;
    Object.keys(customItems).forEach(sweetId => {
      const sweet = sweetsList.find(s => s._id === sweetId);
      if (sweet) {
        total += (sweet.basePrice * customItems[sweetId]);
      }
    });
    return total;
  };

  const submitCustomBox = () => {
    if (!selectedBox) return alert('Please select a box first.');
    const totalQty = Object.values(customItems).reduce((sum, q) => sum + q, 0);
    if (totalQty === 0) return alert('Please add at least one sweet to your box.');

    const nameStr = `Custom: ${selectedBox.name} (${totalQty} items)`;
    const price = getCustomTotal();
    const customProductObj = {
      _id: 'custom-' + Date.now(),
      name: nameStr,
      description: 'Hand-picked selection of our finest sweets in a custom box.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDigEJlJo9xSo0qvKbRNmQrM2QhbPkV67l6sOUOtjgusBIKE8UHqG4JHB7BKi32ypfBiKk3DK1FAt1mhdiLpclovYa5nJjKvKzTowVmL6jSCpmbnQHmh_E4ruYXlJ8OvyTf8q_YU1QF4TjI4JEIhzWkfOZ4BwImpx60jQoR0yedSlcF4SNWdZZN8LHBFroqnu624GJm9gfGnu33WpSvIDGnnuuGlkAYuwYh_D73mbTJBKciRQGvlAyyex-YECKpqOUTF_gYeXLPGCrC', // Use the custom box bg image
      basePrice: price,
      isGiftPack: true
    };
    
    addToCart(customProductObj, 1, 'Custom Box', price);
    setIsCustomizing(false);
    setSelectedBox(null);
    setCustomItems({});
    alert('Custom box built and added to cart!');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full px-6 py-8">
      {/* Breadcrumbs & Title */}
      <div className="mb-12">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
          Curated Collections & Custom Creations
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl text-lg">
          Indulge in our masterfully crafted assortments or express your heart by building a bespoke treasure box.
        </p>
      </div>

      {isCustomizing ? (
        // --- CUSTOM UI ---
        <div className="bg-white dark:bg-background-dark/50 border border-primary/20 rounded-2xl p-6 lg:p-10 shadow-xl">
          <button 
            onClick={() => setIsCustomizing(false)}
            className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-8 font-bold"
          >
            <ChevronLeft className="w-5 h-5" /> Back to Collections
          </button>
          
          <h2 className="text-3xl font-black mb-2 text-slate-900 dark:text-white">Build Your Custom Box</h2>
          <p className="text-slate-500 mb-8">Select your presentation box and fill it with your favorite artisanal sweets.</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-12">
              
              {/* Step 1: Select Box */}
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary border-b border-primary/10 pb-2">
                  <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span> 
                  Select a Box
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {boxOptions.map(box => (
                    <div 
                      key={box.id} 
                      onClick={() => setSelectedBox(box)}
                      className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${selectedBox?.id === box.id ? 'border-primary bg-primary/5 select-none shadow-md shadow-primary/20' : 'border-primary/10 hover:border-primary/50 bg-transparent'}`}
                    >
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1">{box.name}</h4>
                      <p className="text-primary font-black text-lg mb-2">${box.price.toFixed(2)}</p>
                      <p className="text-xs text-slate-500">{box.desc}</p>
                      {selectedBox?.id === box.id && <Check className="w-5 h-5 text-primary mt-3" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 2: Select Sweets */}
              <div className={!selectedBox ? "opacity-50 pointer-events-none transition-opacity" : "transition-opacity"}>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary border-b border-primary/10 pb-2">
                  <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span> 
                  Select Sweets
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {sweetsList.map(sweet => (
                    <div key={sweet._id} className="flex gap-4 items-center p-3 border border-primary/10 rounded-xl bg-white dark:bg-slate-800">
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                        <img src={sweet.image} alt={sweet.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{sweet.name}</h5>
                        <p className="text-primary text-sm font-semibold">${sweet.basePrice.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-3 bg-primary/5 rounded-lg px-2 py-1">
                        <button onClick={() => handleAddCustomItem(sweet._id, -1)} className="text-slate-500 hover:text-primary"><Minus className="w-4 h-4" /></button>
                        <span className="text-sm font-bold w-4 text-center">{customItems[sweet._id] || 0}</span>
                        <button onClick={() => handleAddCustomItem(sweet._id, 1)} className="text-slate-500 hover:text-primary"><Plus className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Custom Box Summary Panel */}
            <div className="lg:col-span-4">
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 sticky top-28">
                <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Your Custom Box</h3>
                
                <div className="space-y-4 mb-6 min-h-[150px]">
                  {selectedBox ? (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">{selectedBox.name}</span>
                      <span className="font-bold">${selectedBox.price.toFixed(2)}</span>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic">No box selected.</p>
                  )}
                  
                  {Object.keys(customItems).map(id => {
                    const sweet = sweetsList.find(s => s._id === id);
                    if (!sweet) return null;
                    const qty = customItems[id];
                    return (
                      <div key={id} className="flex justify-between text-sm items-start">
                        <span className="text-slate-600 dark:text-slate-400 pr-4">
                          <span className="text-primary font-bold">{qty}x</span> {sweet.name}
                        </span>
                        <span className="font-bold">${(sweet.basePrice * qty).toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-primary/20 pt-4 mb-6 flex justify-between items-end">
                  <span className="font-bold text-slate-900 dark:text-white">Total</span>
                  <span className="text-3xl font-black text-primary">${getCustomTotal().toFixed(2)}</span>
                </div>

                <button 
                  onClick={submitCustomBox}
                  className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary/20"
                >
                  <ShoppingCart className="w-5 h-5" /> Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // --- STANDARD UI ---
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Curated Collections Side */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Gift className="text-primary w-6 h-6" />
                Pre-curated Gift Packs
              </h2>
            </div>
  
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {giftPacks.map(pack => (
                <div key={pack._id} className="group bg-white dark:bg-background-dark/50 rounded-xl overflow-hidden border border-primary/10 hover:shadow-xl transition-all duration-300 flex flex-col">
                  <div className="relative aspect-square overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                      style={{ backgroundImage: `url(${pack.image})` }}
                    ></div>
                    <div className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                      {pack.name.includes('Royal') ? 'Best Seller' : 'New'}
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{pack.name}</h3>
                    <p className="text-slate-500 text-xs mt-1 mb-4 line-clamp-2 flex-1">{pack.description}</p>
  
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-lg font-black text-primary">${pack.basePrice.toFixed(2)}</span>
                      <button
                        onClick={() => handleAddPreCurated(pack)}
                        className="flex items-center justify-center bg-primary text-white p-2 px-4 rounded-lg hover:bg-primary/90 transition-colors font-bold text-sm gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" /> Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
  
              {giftPacks.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-500">
                  No gift packs found.
                </div>
              )}
            </div>
          </div>
  
          {/* Build Your Own Side */}
          <div className="relative flex flex-col justify-center rounded-2xl overflow-hidden min-h-[400px] border border-primary/20 shadow-2xl bg-slate-900 group">
            <div className="absolute inset-0 bg-primary/10 opacity-40"></div>
            <div
              className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30 transition-transform duration-[2s] group-hover:scale-110"
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDigEJlJo9xSo0qvKbRNmQrM2QhbPkV67l6sOUOtjgusBIKE8UHqG4JHB7BKi32ypfBiKk3DK1FAt1mhdiLpclovYa5nJjKvKzTowVmL6jSCpmbnQHmh_E4ruYXlJ8OvyTf8q_YU1QF4TjI4JEIhzWkfOZ4BwImpx60jQoR0yedSlcF4SNWdZZN8LHBFroqnu624GJm9gfGnu33WpSvIDGnnuuGlkAYuwYh_D73mbTJBKciRQGvlAyyex-YECKpqOUTF_gYeXLPGCrC')" }}
            ></div>
            <div className="relative z-10 p-8 md:p-12 text-center lg:text-left flex flex-col h-full">
              <span className="text-primary font-bold tracking-widest text-sm mb-2 uppercase">Custom Gifting</span>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">Personalize Your Own Box</h2>
  
              <div className="space-y-6 mb-10">
                <div className="flex items-start gap-4 text-left">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="font-bold text-white">Pick a Box</h4>
                    <p className="text-sm text-slate-400">Select from premium finishes.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 text-left">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="font-bold text-white">Choose Sweets</h4>
                    <p className="text-sm text-slate-400">Fill it with handpicked treats.</p>
                  </div>
                </div>
              </div>
  
              <button 
                onClick={() => setIsCustomizing(true)}
                className="w-full lg:w-max bg-primary text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-2 mt-auto"
              >
                Start Building
              </button>
            </div>
          </div>
  
        </div>
      )}
    </div>
  );
}
