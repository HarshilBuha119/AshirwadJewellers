import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, ShoppingBag, Sparkles, ArrowRight } from 'lucide-react';
import { favoritesAPI, metalRatesAPI } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Favorites = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
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
      const [favData, ratesData] = await Promise.all([
        favoritesAPI.getFavorites(user.uid),
        metalRatesAPI.getRates()
      ]);
      setFavorites(favData);
      setMetalRates(ratesData);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Unable to access your vault');
    } finally {
      setLoading(false);
    }
  };

  const calculateLivePrice = (item) => {
    const product = item.jewellary;
    const rateObj = metalRates.find(r => r.metal_type.toLowerCase() === product?.metal_type?.toLowerCase());
    if (!rateObj || !product?.weight) return product?.price || 0;
    
    return (parseFloat(product.weight) * rateObj.rate_per_gm_24k) + 
           parseFloat(product.making_charges || 0) + 
           parseFloat(product.stone_charges || 0);
  };

  const removeFromFavorites = async (favoriteId) => {
    try {
      await favoritesAPI.removeFromFavorites(favoriteId);
      setFavorites(favorites.filter(item => item.id !== favoriteId));
      toast.success('Piece removed from vault');
    } catch (error) {
      toast.error('Action failed');
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#FCFAFA]">
      <Sparkles className="text-[#C5A059] w-10 h-10 animate-pulse mb-4" />
      <p className="font-['Golden'] text-[10px] tracking-[0.5em] uppercase text-slate-400">Authenticating Vault</p>
    </div>
  );

  if (favorites.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FCFAFA] px-6 text-center">
      <div className="w-24 h-24 mb-8 relative">
        <Heart className="w-full h-full text-[#C5A059]/10" strokeWidth={1} />
        <Heart className="absolute inset-0 w-full h-full text-[#C5A059]/20 scale-75 blur-sm" />
      </div>
      <h2 className="text-4xl font-['AnticDidone-Regular'] text-[#111] mb-4 italic">Your Vault is Empty</h2>
      <p className="font-['Tapestry-Regular'] text-slate-400 mb-10 max-w-xs text-lg">Curate your legacy by adding pieces from our signature collections.</p>
      <Link to="/products" className="group flex items-center space-x-3 bg-[#111] text-white px-10 py-4 font-['Golden'] text-[10px] tracking-widest uppercase hover:bg-[#C5A059] transition-all duration-500">
        <span>Explore Collections</span>
        <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
      </Link>
    </div>
  );

  return (
    <div className="bg-[#FCFAFA] min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-20 text-center md:text-left">
          <span className="text-[#C5A059] font-['Golden'] text-[10px] tracking-[0.5em] uppercase block mb-4">Personal Curator</span>
          <h1 className="text-5xl md:text-7xl font-['AnticDidone-Regular'] text-[#111] italic mb-4">Your Private Vault</h1>
          <div className="h-[1px] w-20 bg-[#C5A059] mb-4 mx-auto md:mx-0" />
          <p className="text-slate-400 font-light italic">{favorites.length} Masterpieces Reserved</p>
        </div>

        {/* Favorites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          <AnimatePresence>
            {favorites.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group relative"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-white mb-6 border border-slate-100 shadow-sm group-hover:shadow-2xl transition-all duration-700">
                  <img
                    src={item.jewellary?.main_image}
                    alt={item.jewellary?.name}
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                  />
                  
                  {/* Remove Button Overlay */}
                  <button
                    onClick={() => removeFromFavorites(item.id)}
                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md rounded-full text-slate-400 hover:text-red-600 transition-colors z-20 border border-slate-100"
                  >
                    <Trash2 size={16} strokeWidth={1.5} />
                  </button>

                  {/* View Details Overlay */}
                  <Link to={`/products/${item.product_id}`} className="absolute inset-0 z-10">
                    <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-white/90 backdrop-blur-sm border-t border-[#C5A059]/20">
                      <div className="flex items-center justify-center space-x-2 text-[10px] font-['Golden'] tracking-widest uppercase text-black">
                        <ShoppingBag size={14} />
                        <span>View Piece</span>
                      </div>
                    </div>
                  </Link>
                </div>

                <div className="text-center px-2">
                  <h3 className="font-['AnticDidone-Regular'] text-xl text-[#111] mb-2 group-hover:text-[#C5A059] transition-colors">
                    {item.jewellary?.name}
                  </h3>
                  
                  <div className="flex flex-col items-center space-y-1">
                    <span className="text-[9px] font-['Golden'] text-[#C5A059] tracking-[0.2em] uppercase">
                      Current Valuation
                    </span>
                    <p className="text-lg font-light tracking-tighter text-[#111]">
                      ₹{Math.round(calculateLivePrice(item)).toLocaleString('en-IN')}
                    </p>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-2">
                      <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                      <span className="italic font-light">Market Linked Price</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Favorites;