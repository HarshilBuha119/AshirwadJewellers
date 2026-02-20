import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Extra = () => {
  const [currentBanner, setCurrentBanner] = useState(0);

  const demoBanners = [
    {
      id: 1,
      is_video: true,
      banner_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      festival_name: "The Royal Legacy"
    },
    {
      id: 2,
      is_video: false,
      banner_url: "https://xlcshdtizkqibimmnnnl.supabase.co/storage/v1/object/public/banner-images/images/1771394853847.jpeg",
      festival_name: "Pure Brilliance"
    }
  ];

  // --- STYLES OBJECT ---
  const styles = {
    section: {
      position: 'relative',
      width: '100%',
      height: '70vh',
      overflow: 'hidden',
      backgroundColor: '#0d0d0d',
    },
    mediaLayer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    mediaItem: {
      width: '100vw',
      height: '100vh',
      objectFit: 'fill',
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent, rgba(0,0,0,0.8))',
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
    contentLayer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 10,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '0 24px',
      pointerEvents: 'none',
    },
    interactiveContent: {
      pointerEvents: 'auto',
    },
    label: {
      color: '#C5A059',
      letterSpacing: '0.4em',
      textTransform: 'uppercase',
      fontSize: '10px',
      marginBottom: '16px',
      display: 'block',
    },
    title: {
      fontSize: 'clamp(2.5rem, 8vw, 6rem)', // Fluid typography for mobile/desktop
      fontFamily: 'serif',
      color: 'white',
      marginBottom: '32px',
      fontStyle: 'italic',
      lineHeight: 1.2,
    },
    button: {
      display: 'inline-block',
      border: '1px solid rgba(255,255,255,0.4)',
      padding: '16px 40px',
      color: 'white',
      textDecoration: 'none',
      fontSize: '10px',
      letterSpacing: '0.3em',
      textTransform: 'uppercase',
      transition: 'all 0.5s ease',
    },
    controls: {
      position: 'absolute',
      bottom: '40px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 20,
      display: 'flex',
      gap: '16px',
    }
  };

  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh' }}>
      {/* --- HERO SECTION --- */}
      <section style={styles.section}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBanner}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            style={styles.mediaLayer}
          >
            {/* MEDIA LAYER */}
            {demoBanners[currentBanner].is_video ? (
              <video
                src={demoBanners[currentBanner].banner_url}
                autoPlay
                loop
                muted
                playsInline
                style={styles.mediaItem}
              />
            ) : (
              <img
                src={demoBanners[currentBanner].banner_url}
                alt="Luxury Background"
                style={styles.mediaItem}
              />
            )}

            {/* DARK OVERLAY */}
            <div style={styles.overlay} />
          </motion.div>
        </AnimatePresence>

        {/* CONTENT LAYER */}
        <div style={styles.contentLayer}>
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={styles.interactiveContent}
          >
            <span style={styles.label}>Live Market Integrated</span>
            <h1 style={styles.title}>{demoBanners[currentBanner].festival_name}</h1>
            
            <Link 
              to="/products" 
              style={styles.button}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#C5A059';
                e.target.style.color = 'black';
                e.target.style.borderColor = '#C5A059';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'white';
                e.target.style.borderColor = 'rgba(255,255,255,0.4)';
              }}
            >
              Explore Collection
            </Link>
          </motion.div>
        </div>

        {/* SLIDE TOGGLE */}
        <div style={styles.controls}>
          {demoBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentBanner(idx)}
              style={{
                width: '48px',
                height: '4px',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backgroundColor: currentBanner === idx ? '#C5A059' : 'rgba(255,255,255,0.3)',
              }}
            />
          ))}
        </div>
      </section>

      {/* Verification Text Below Hero */}
      <section style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', color: 'black' }}>Content continues here...</h2>
        <p style={{ color: '#666', marginTop: '8px' }}>
          The text above should never overlap this section because of Flexbox centering.
        </p>
      </section>
    </div>
  );
};

export default Extra;