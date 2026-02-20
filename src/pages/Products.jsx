import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ShoppingBag, Sparkles, Scale, ChevronDown } from 'lucide-react';
import { jewelryAPI, metalRatesAPI } from '../config/supabase';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [metalRates, setMetalRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    metalType: '',
    brand: '',
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, filters, metalRates]);

  const loadInitialData = async () => {
    try {
      const [productsData, ratesData] = await Promise.all([
        jewelryAPI.getAll(),
        metalRatesAPI.getRates(),
      ]);
      setProducts(productsData);
      setMetalRates(ratesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- PRICE CALCULATION ENGINE ---
  const calculateLivePrice = (product) => {
    const rateObj = metalRates.find(r => r.metal_type.toLowerCase() === product.metal_type?.toLowerCase());
    if (!rateObj || !product.weight) return product.price || 0;
    
    const base = parseFloat(product.weight) * rateObj.rate_per_gm_24k;
    const making = parseFloat(product.making_charges || 0);
    const stones = parseFloat(product.stone_charges || 0);
    return base + making + stones;
  };

  const applyFilters = () => {
    let filtered = [...products];
    if (filters.category) filtered = filtered.filter(p => p.category === filters.category);
    if (filters.metalType) filtered = filtered.filter(p => p.metal_type === filters.metalType);
    if (filters.brand) filtered = filtered.filter(p => p.brand === filters.brand);
    setFilteredProducts(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    if (key === 'category') setSearchParams(value ? { category: value } : {});
  };

  const categories = [...new Set(products.map(p => p.category))].filter(Boolean);
  const metalTypes = [...new Set(products.map(p => p.metal_type))].filter(Boolean);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#FCFAFA]">
      <div className="text-center">
        <Sparkles className="w-12 h-12 text-[#C5A059] animate-pulse mx-auto mb-4" />
        <p className="font-['Golden'] text-[10px] tracking-[0.4em] uppercase text-slate-400">Opening the Vault</p>
      </div>
    </div>
  );

  return (
    <div className="bg-[#FCFAFA] min-h-screen pb-20">
      {/* Header Section */}
      <div className="pt-32 pb-16 border-b border-[#C5A059]/10 bg-white">
        <div className="container mx-auto px-6 text-center">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#C5A059] font-['Golden'] text-[10px] tracking-[0.4em] uppercase mb-4 block">
            The Ashirwad Boutique
          </motion.span>
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-5xl md:text-7xl font-['AnticDidone-Regular'] text-[#111] mb-6 italic">
            {filters.category || "All Collections"}
          </motion.h1>
          <p className="font-['Tapestry-Regular'] text-slate-400 italic">Exploring {filteredProducts.length} unique masterpieces</p>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 mt-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* --- MINIMALIST FILTERS SIDEBAR --- */}
          <aside className="lg:w-72 flex-shrink-0">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden w-full flex items-center justify-between border border-black p-4 font-['Golden'] text-[10px] tracking-widest uppercase mb-4"
            >
              <span>Filters</span>
              <ChevronDown size={16} />
            </button>

            <div className={`${showFilters ? 'block' : 'hidden'} lg:block sticky top-32 space-y-12`}>
              <div>
                <h4 className="font-['Golden'] text-[11px] tracking-[0.3em] uppercase text-[#C5A059] mb-6">By Category</h4>
                <div className="flex flex-col space-y-3">
                  <button onClick={() => handleFilterChange('category', '')} className={`text-left text-sm transition-all ${!filters.category ? 'text-[#C5A059] pl-2' : 'text-slate-500 hover:text-black'}`}>All Pieces</button>
                  {categories.map(cat => (
                    <button key={cat} onClick={() => handleFilterChange('category', cat)} className={`text-left text-sm transition-all ${filters.category === cat ? 'text-[#C5A059] pl-2 border-l border-[#C5A059]' : 'text-slate-500 hover:text-black'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-['Golden'] text-[11px] tracking-[0.3em] uppercase text-[#C5A059] mb-6">Metal Purity</h4>
                <div className="flex flex-col space-y-3">
                  {metalTypes.map(metal => (
                    <button key={metal} onClick={() => handleFilterChange('metalType', metal === filters.metalType ? '' : metal)} className={`text-left text-sm transition-all ${filters.metalType === metal ? 'text-[#C5A059] pl-2 border-l border-[#C5A059]' : 'text-slate-500 hover:text-black'}`}>
                      {metal}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* --- PRODUCT GRID --- */}
          <main className="flex-1">
            <AnimatePresence mode='wait'>
              {filteredProducts.length > 0 ? (
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
                  {filteredProducts.map((product) => (
                    <CollectionCard 
                      key={product.id} 
                      product={product} 
                      price={calculateLivePrice(product)} 
                    />
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-40 bg-white border border-[#C5A059]/10 rounded-sm">
                  <p className="font-['Golden'] text-[10px] tracking-widest text-slate-400 uppercase">No pieces found matching your criteria</p>
                </div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

// --- ELITE COLLECTION CARD WITH VIDEO HOVER ---
const CollectionCard = ({ product, price }) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (isHovered && videoRef.current) {
      videoRef.current.play().catch(() => {});
    } else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isHovered]);

  return (
    <motion.div 
      layout
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer"
    >
      <Link to={`/products/${product.id}`}>
        <div className="relative aspect-[4/5] overflow-hidden bg-white mb-6 border border-slate-100 shadow-sm transition-all duration-700 group-hover:shadow-xl">
          <motion.img
            src={product.main_image}
            animate={{ opacity: isHovered && product.video_url ? 0 : 1 }}
            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
          />

          {product.video_url && (
            <video ref={videoRef} src={product.video_url} muted loop playsInline className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
          )}

          {/* Luxury Tags */}
          <div className="absolute top-4 left-4 flex flex-col space-y-2">
            <span className="bg-white/90 backdrop-blur-md text-[#111] text-[8px] px-3 py-1 font-['Golden'] tracking-[0.2em] uppercase border border-[#C5A059]/20">
              {product.metal_type}
            </span>
            {isHovered && (
               <motion.span initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-[#C5A059] text-white text-[8px] px-3 py-1 font-['Golden'] tracking-[0.2em] uppercase">
                BIS Hallmarked
              </motion.span>
            )}
          </div>

          <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-all duration-500 bg-white/80 backdrop-blur-sm border-t border-[#C5A059]/20">
            <div className="flex items-center justify-center space-x-2 text-[10px] font-['Golden'] tracking-widest uppercase text-black">
              <ShoppingBag size={14} />
              <span>Request View</span>
            </div>
          </div>
        </div>

        <div className="text-center px-2">
          <h3 className="font-['AnticDidone-Regular'] text-xl text-[#111] mb-1 group-hover:text-[#C5A059] transition-colors">{product.name}</h3>
          <div className="flex items-center justify-center space-x-4 mb-2">
            <div className="flex items-center text-slate-400 space-x-1">
              <Scale size={10} />
              <span className="text-[10px] font-light">{product.weight}g</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-[#C5A059]/30" />
            <span className="text-[10px] text-slate-400 uppercase tracking-widest">{product.category}</span>
          </div>
          <p className="text-lg font-light tracking-tighter text-[#111]">₹{Math.round(price).toLocaleString('en-IN')}</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default Products;