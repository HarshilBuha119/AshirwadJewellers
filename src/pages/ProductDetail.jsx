import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Sparkles, Scale, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { jewelryAPI, cartAPI, favoritesAPI, metalRatesAPI } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, login } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [metalRates, setMetalRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isFavorite, setIsFavorite] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    loadProductData();
  }, [id]);

  useEffect(() => {
    if (user && product) {
      checkFavorite();
    }
  }, [user, product]);

  const loadProductData = async () => {
    try {
      const [data, rates] = await Promise.all([
        jewelryAPI.getById(id),
        metalRatesAPI.getRates()
      ]);
      
      setProduct(data);
      setMetalRates(rates);
      
      // Initialize options based on DB fields
      setSelectedOptions({
        purity: data.purity?.[0] || '',
        weight: data.weight || '',
      });
    } catch (error) {
      toast.error('Masterpiece not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };


  const handleAddToCart = async () => {
    if (!user) {
      try {
        await login();
      } catch (error) {
        return;
      }
    }

    setAddingToCart(true);
    try {
      await cartAPI.addToCart(user.uid, product.id, 1, selectedOptions);
      toast.success('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };
  // --- IMAGE PARSING LOGIC ---
  // This extracts the URLs from the JSON structure shown in your spreadsheet
  const getAllImages = () => {
    if (!product) return [];
    const list = [product.main_image];
    
    if (product.images) {
      try {
        // If it's a string, parse it; if already an array, use it
        const extraImages = typeof product.images === 'string' 
          ? JSON.parse(product.images) 
          : product.images;
        
        // Extract the "image" property from each object in the array
        const urls = extraImages.map(imgObj => imgObj.image);
        list.push(...urls);
      } catch (e) {
        console.error("Error parsing images column:", e);
      }
    }
    return list.filter(Boolean);
  };

  const calculateLivePrice = () => {
    const rateObj = metalRates.find(r => r.metal_type.toLowerCase() === product?.metal_type?.toLowerCase());
    if (!rateObj || !product?.weight) return product?.price || 0;
    
    const base = parseFloat(product.weight) * rateObj.rate_per_gm_24k;
    const making = parseFloat(product.making_charges || 0);
    const stones = parseFloat(product.stone_charges || 0);
    return base + making + stones;
  };

  const checkFavorite = async () => {
    try {
      const result = await favoritesAPI.isFavorite(user.uid, product.id);
      setIsFavorite(result);
    } catch (error) { console.error(error); }
  };

  const handleToggleFavorite = async () => {
    if (!user) return login();
    try {
      if (isFavorite) {
        const favs = await favoritesAPI.getFavorites(user.uid);
        const fav = favs.find(f => f.product_id === product.id);
        if (fav) await favoritesAPI.removeFromFavorites(fav.id);
        setIsFavorite(false);
        toast.success('Removed from Vault');
      } else {
        await favoritesAPI.addToFavorites(user.uid, product.id);
        setIsFavorite(true);
        toast.success('Added to Vault');
      }
    } catch (e) { toast.error('Action failed'); }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#FCFAFA]">
      <Sparkles className="w-10 h-10 text-[#C5A059] animate-pulse" />
    </div>
  );

  const images = getAllImages();
  const livePrice = calculateLivePrice();

  return (
    <div className="bg-[#FCFAFA] min-h-screen pt-10 pb-20">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* LEFT: GALLERY SECTION (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative aspect-square bg-white border border-slate-100 overflow-hidden group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={images[selectedImage]}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              
              <button 
                onClick={handleToggleFavorite}
                className="absolute top-6 right-6 p-4 bg-white/90 backdrop-blur-md rounded-full shadow-lg z-10 hover:scale-110 transition-transform"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
              </button>
            </div>

            {/* THUMBNAILS */}
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-24 h-24 flex-shrink-0 border-2 transition-all duration-500 ${
                    selectedImage === idx ? 'border-[#C5A059]' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="Gallery preview" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: PRODUCT INFO (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="mb-8">
              <span className="font-['Golden'] text-[10px] tracking-[0.4em] text-[#C5A059] uppercase block mb-4">
                {product.brand || 'Ashirwad Boutique'} • {product.category}
              </span>
              <h1 className="text-5xl font-['AnticDidone-Regular'] text-[#111] italic mb-4">
                {product.name}
              </h1>
              <div className="flex items-end space-x-4 mb-6">
                <p className="text-3xl font-light tracking-tighter text-[#111]">
                  ₹{Math.round(livePrice).toLocaleString('en-IN')}
                </p>
                <span className="text-[10px] text-slate-400 font-['Golden'] mb-1.5 uppercase tracking-widest flex items-center">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse" />
                  Live Market Price
                </span>
              </div>
              <p className="text-slate-500 leading-relaxed font-['Tapestry-Regular'] italic text-lg mb-8">
                {product.description}
              </p>
            </div>

            {/* SPECS GRID */}
            <div className="grid grid-cols-2 gap-6 mb-10 border-y border-slate-100 py-8">
              <div className="space-y-1">
                <p className="font-['Golden'] text-[9px] tracking-widest text-slate-400 uppercase">Weight</p>
                <p className="text-sm font-medium flex items-center gap-2"><Scale size={14} className="text-[#C5A059]" /> {product.weight}g</p>
              </div>
              <div className="space-y-1">
                <p className="font-['Golden'] text-[9px] tracking-widest text-slate-400 uppercase">Metal</p>
                <p className="text-sm font-medium flex items-center gap-2"><Sparkles size={14} className="text-[#C5A059]" /> {product.metal_type}</p>
              </div>
              <div className="space-y-1">
                <p className="font-['Golden'] text-[9px] tracking-widest text-slate-400 uppercase">Product ID</p>
                <p className="text-sm font-medium">{product.item_number || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="font-['Golden'] text-[9px] tracking-widest text-slate-400 uppercase">Purity</p>
                <p className="text-sm font-medium">{product.purity?.[0] || '22K Standard'}</p>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="w-full bg-[#111] text-white py-5 font-['Golden'] text-[10px] tracking-[0.3em] uppercase hover:bg-[#C5A059] transition-all duration-500 flex items-center justify-center space-x-3"
              >
                <ShoppingCart size={16} />
                <span>{addingToCart ? 'Placing in Bag...' : 'Add to Boutique Bag'}</span>
              </button>
            </div>

            {/* TRUST BADGES */}
            <div className="mt-12 grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center">
                <ShieldCheck size={18} className="text-[#C5A059] mb-2" />
                <span className="text-[8px] font-['Golden'] tracking-widest uppercase text-slate-400">Hallmarked</span>
              </div>
              <div className="flex flex-col items-center">
                <Truck size={18} className="text-[#C5A059] mb-2" />
                <span className="text-[8px] font-['Golden'] tracking-widest uppercase text-slate-400">Insured Delivery</span>
              </div>
              <div className="flex flex-col items-center">
                <RefreshCw size={18} className="text-[#C5A059] mb-2" />
                <span className="text-[8px] font-['Golden'] tracking-widest uppercase text-slate-400">Lifetime Exchange</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;