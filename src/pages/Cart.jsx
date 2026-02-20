import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, Sparkles, ChevronRight, Scale, Info } from 'lucide-react';
import { cartAPI, metalRatesAPI } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Cart = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [metalRates, setMetalRates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    } else {
      login().then(() => loadData()).catch(() => navigate('/'));
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [cartData, ratesData] = await Promise.all([
        cartAPI.getCart(user.uid),
        metalRatesAPI.getRates()
      ]);
      setCart(cartData);
      setMetalRates(ratesData);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to sync boutique bag');
    } finally {
      setLoading(false);
    }
  };

  const calculateItemPrice = (item) => {
    const product = item.jewellary;
    const rateObj = metalRates.find(r => r.metal_type.toLowerCase() === product?.metal_type?.toLowerCase());
    if (!rateObj || !product?.weight) return (product?.price || 0) * item.quantity;
    
    const singleUnitPrice = (parseFloat(product.weight) * rateObj.rate_per_gm_24k) + 
                           parseFloat(product.making_charges || 0) + 
                           parseFloat(product.stone_charges || 0);
    
    return singleUnitPrice * item.quantity;
  };

  const calculateTotal = () => cart.reduce((acc, item) => acc + calculateItemPrice(item), 0);

  const updateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await cartAPI.updateQuantity(cartId, newQuantity);
      setCart(cart.map(item => item.id === cartId ? { ...item, quantity: newQuantity } : item));
    } catch (error) {
      toast.error('Could not update quantity');
    }
  };

  const removeItem = async (cartId) => {
    try {
      await cartAPI.removeFromCart(cartId);
      setCart(cart.filter(item => item.id !== cartId));
      toast.success('Removed from bag');
    } catch (error) {
      toast.error('Action failed');
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#FCFAFA]">
      <Sparkles className="text-[#C5A059] w-10 h-10 animate-pulse mb-4" />
      <p className="font-['Golden'] text-[10px] tracking-[0.5em] uppercase text-slate-400">Updating Live Market Prices</p>
    </div>
  );

  if (cart.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FCFAFA] px-6">
      <div className="mb-8 p-10 bg-white rounded-full border border-slate-100 shadow-inner">
        <ShoppingBag className="w-16 h-16 text-[#C5A059]/30" strokeWidth={1} />
      </div>
      <h2 className="text-4xl font-['AnticDidone-Regular'] text-[#111] mb-4 italic">Your Bag is Empty</h2>
      <p className="font-['Tapestry-Regular'] text-slate-400 mb-10 max-w-xs text-center text-lg">Every masterpiece begins with a single selection.</p>
      <Link to="/products" className="group flex items-center space-x-3 bg-[#111] text-white px-12 py-4 font-['Golden'] text-[10px] tracking-widest uppercase hover:bg-[#C5A059] transition-all duration-500">
        <span>Explore Boutique</span>
        <ChevronRight size={14} />
      </Link>
    </div>
  );

  return (
    <div className="bg-[#FCFAFA] min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 lg:px-12">
        <h1 className="text-5xl md:text-7xl font-['AnticDidone-Regular'] text-[#111] italic mb-12">Boutique Bag</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* --- ITEMS LIST --- */}
          <div className="lg:col-span-8 space-y-8">
            <AnimatePresence>
              {cart.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white p-6 md:p-8 flex flex-col md:flex-row gap-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <Link to={`/products/${item.product_id}`} className="w-full md:w-40 aspect-square overflow-hidden bg-slate-50 flex-shrink-0">
                    <img src={item.jewellary?.main_image} alt={item.jewellary?.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                  </Link>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <Link to={`/products/${item.product_id}`}>
                          <h3 className="font-['AnticDidone-Regular'] text-2xl text-[#111] hover:text-[#C5A059] transition-colors">
                            {item.jewellary?.name}
                          </h3>
                        </Link>
                        <p className="text-xl font-light tracking-tighter">
                          ₹{Math.round(calculateItemPrice(item)).toLocaleString('en-IN')}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-4">
                        <span className="text-[9px] font-['Golden'] tracking-widest uppercase text-[#C5A059]">{item.jewellary?.metal_type}</span>
                        <div className="flex items-center space-x-1 text-slate-400">
                          <Scale size={10} />
                          <span className="text-[10px] font-light">{item.jewellary?.weight}g</span>
                        </div>
                      </div>

                      {item.options && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {Object.entries(item.options).map(([key, value]) => (
                            <span key={key} className="text-[9px] font-['Golden'] px-3 py-1 border border-slate-100 text-slate-500 uppercase">
                              {key}: {value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-slate-200">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-3 hover:bg-slate-50 disabled:opacity-30" disabled={item.quantity <= 1}>
                          <Minus size={14} />
                        </button>
                        <span className="px-6 font-['Golden'] text-xs">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-3 hover:bg-slate-50">
                          <Plus size={14} />
                        </button>
                      </div>

                      <button onClick={() => removeItem(item.id)} className="flex items-center space-x-2 text-[9px] font-['Golden'] tracking-widest uppercase text-red-400 hover:text-red-600 transition-colors">
                        <Trash2 size={14} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* --- ORDER SUMMARY --- */}
          <div className="lg:col-span-4">
            <div className="bg-white p-8 border border-[#C5A059]/20 sticky top-32 shadow-xl">
              <h3 className="font-['AnticDidone-Regular'] text-3xl italic mb-8">Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal (Market Value)</span>
                  <span className="font-medium text-[#111]">₹{Math.round(calculateTotal()).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Shipping (Fully Insured)</span>
                  <span className="text-green-600 font-['Golden'] text-[10px] tracking-widest">Complimentary</span>
                </div>
                <div className="pt-4 border-t border-slate-100 flex justify-between items-end">
                  <span className="font-['Golden'] text-[11px] tracking-widest uppercase">Estimated Total</span>
                  <span className="text-3xl font-light tracking-tighter text-[#C5A059]">₹{Math.round(calculateTotal()).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="bg-[#FCFAFA] p-4 rounded-sm flex gap-3 items-start mb-8">
                <Info size={16} className="text-[#C5A059] flex-shrink-0 mt-0.5" />
                <p className="text-[10px] leading-relaxed text-slate-500 italic">
                  Prices are linked to the live market rate of gold/silver and may fluctuate until the order is confirmed by our concierge team.
                </p>
              </div>

              <button className="w-full bg-[#111] text-white py-5 font-['Golden'] text-[10px] tracking-[0.3em] uppercase hover:bg-[#C5A059] transition-all duration-500 mb-6">
                Request Concierge Checkout
              </button>

              <Link to="/products" className="flex items-center justify-center space-x-2 text-[9px] font-['Golden'] tracking-widest uppercase text-slate-400 hover:text-black transition-colors">
                <span>Continue Exploring</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;