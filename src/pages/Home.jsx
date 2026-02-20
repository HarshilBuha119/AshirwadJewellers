import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Sparkles, ShoppingBag, ChevronRight, Scale } from 'lucide-react';
import { bannersAPI, jewelryAPI, metalRatesAPI } from '../config/supabase';

const Home = () => {
  const [banners, setBanners] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [metalRates, setMetalRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (banners.length > 0 ? (prev + 1) % banners.length : 0));
    }, 8000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const loadData = async () => {
    try {
      const [bannersData, productsData, ratesData] = await Promise.all([
        bannersAPI.getActive(),
        jewelryAPI.getAll(),
        metalRatesAPI.getRates(),
      ]);
      setBanners(bannersData);
      setFeaturedProducts(productsData.slice(0, 8));

      const unique = ratesData.reduce((acc, current) => {
        const x = acc.find(item => item.metal_type === current.metal_type);
        return !x ? acc.concat([current]) : acc;
      }, []);
      setMetalRates(unique);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setTimeout(() => setLoading(false), 1200);
    }
  };

  // --- PRICE CALCULATION ENGINE ---
  const calculateLivePrice = (product) => {
    // Find the rate for the product's metal type (e.g., Gold or Silver)
    const currentRateObj = metalRates.find(
      (r) => r.metal_type.toLowerCase() === product.metal_type?.toLowerCase()
    );

    if (!currentRateObj || !product.weight) return product.price;

    const rate = currentRateObj.rate_per_gm_24k;
    const weight = parseFloat(product.weight);
    const makingCharges = parseFloat(product.making_charges || 0);
    const stoneCharges = parseFloat(product.stone_charges || 0);

    // Basic formula: (Weight * Rate) + Making + Stones
    const total = (weight * rate) + makingCharges + stoneCharges;
    return total;
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#0d0d0d]">
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }}>
        <Sparkles className="text-[#C5A059] w-12 h-12" />
      </motion.div>
      <p className="mt-4 text-[#C5A059] font-['Golden'] tracking-[0.5em] uppercase text-[10px]">Syncing Live Rates</p>
    </div>
  );

  return (
    <div className="bg-[#FCFAFA] text-[#1A1A1A] overflow-x-hidden">

      {/* --- HERO SECTION --- */}
      {/* --- HERO SECTION (EXTRA VERSION APPLIED) --- */}
      <section
        ref={targetRef}
        style={{
          position: "relative",
          width: "100%",
          height: isMobile ? "65vh" : "90vh",
          overflow: "hidden",
          backgroundColor: "#0d0d0d",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBanner}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            {banners[currentBanner]?.is_video ? (
              <video
                src={banners[currentBanner]?.banner_url}
                autoPlay
                loop
                muted
                playsInline
                style={{
                  width: "100vw",
                  height: isMobile ? "65vh" : "90vh",
                  objectFit: isMobile ? "fill" : "fill",
                }}
              />
            ) : (
              <img
                src={banners[currentBanner]?.banner_url}
                alt="Luxury Background"
                style={{
                  width: "100vw",
                  height: isMobile ? "65vh" : "90vh",
                  objectFit: isMobile ? "fill" : "fill",
                }}
              />
            )}

            {/* Overlay */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent, rgba(0,0,0,0.8))",
                backgroundColor: "rgba(0,0,0,0.2)",
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Content Layer */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "0 24px",
          }}
        >
          <motion.div
            style={{ opacity, scale, y: textY }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <span
              style={{
                color: "#C5A059",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                fontSize: "10px",
                marginBottom: "16px",
                display: "block",
              }}
            >
              Live Market Integrated
            </span>

            <h1
              style={{
                fontSize: "clamp(2.5rem, 8vw, 6rem)",
                fontFamily: "serif",
                color: "white",
                marginBottom: "32px",
                fontStyle: "italic",
                lineHeight: 1.2,
              }}
            >
              {banners[currentBanner]?.festival_name || "Pure Brilliance"}
            </h1>

            <Link
              to="/products"
              style={{
                display: "inline-block",
                border: "1px solid rgba(255,255,255,0.4)",
                padding: "16px 40px",
                color: "white",
                textDecoration: "none",
                fontSize: "10px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                transition: "all 0.5s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#C5A059";
                e.target.style.color = "black";
                e.target.style.borderColor = "#C5A059";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = "white";
                e.target.style.borderColor = "rgba(255,255,255,0.4)";
              }}
            >
              Explore Live Boutique
            </Link>
          </motion.div>
        </div>
      </section>

      {/* --- LIVE METAL TICKER --- */}
      <div className="bg-[#111] py-8 border-y border-[#C5A059]/20 relative z-20">
        <div className="container mx-auto flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-32">
          {metalRates.map((rate, i) => (
            <div key={i} className="text-center group">
              <p className="text-[#C5A059]/50 font-['Golden'] text-[9px] tracking-[0.4em] uppercase mb-2">
                {rate.metal_type} 24K Live
              </p>
              <p className="text-white text-3xl font-light tracking-tighter">
                ₹{rate.rate_per_gm_24k.toLocaleString('en-IN')}
                <span className="text-[10px] text-white/30 ml-2">/ 1 G M</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* --- PRODUCT GRID --- */}
      <section className="py-32 container mx-auto px-6">
        <div className="max-w-xl mx-auto text-center mb-24">
          <h2 className="text-5xl font-['AnticDidone-Regular'] mb-6">Curated Treasures</h2>
          <p className="font-['Tapestry-Regular'] text-[#C5A059] text-xl italic">Prices updated with live market rates</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              livePrice={calculateLivePrice(product)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

const ProductCard = ({ product, livePrice }) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (isHovered && videoRef.current) {
      videoRef.current.play().catch(() => { });
    } else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isHovered]);

  return (
    <motion.div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="group">
      <Link to={`/products/${product.id}`}>
        <div className="relative aspect-[4/5] overflow-hidden border shadow-sm border-[#C5A059]/20 bg-[#F9F9F9] mb-8 group-hover:shadow-2xl transition-all duration-700">
          <motion.img
            src={product.main_image}
            animate={{ opacity: isHovered && product.video_url ? 0 : 1 }}
            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
          />

          {product.video_url && (
            <video ref={videoRef} src={product.video_url} muted loop playsInline className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
          )}

          {/* Live Badge */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 flex items-center space-x-2 rounded-full border border-[#C5A059]/20">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[8px] font-['Golden'] tracking-widest text-black uppercase">Live Price</span>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-10">
            <div className="bg-white/90 backdrop-blur-md py-4 flex items-center justify-center space-x-2 text-[10px] font-['Golden'] tracking-[0.3em] uppercase text-black">
              <ShoppingBag size={14} />
              <span>Discover</span>
            </div>
          </div>
        </div>

        <div className="text-center px-4">
          <span className="text-[9px] font-['Golden'] text-[#C5A059] tracking-[0.3em] uppercase block mb-2">{product.category}</span>
          <h3 className="font-['AnticDidone-Regular'] text-2xl text-[#111] mb-2">{product.name}</h3>

          <div className="flex flex-col items-center justify-center space-y-1">
            <div className="flex items-center space-x-2 text-slate-400 group-hover:text-black transition-colors">
              <Scale size={12} />
              <span className="text-[10px] font-light">{product.weight}g {product.metal_type}</span>
            </div>
            <p className="text-lg font-['Golden'] tracking-widest text-[#111]">
              ₹{Math.round(livePrice).toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default Home;