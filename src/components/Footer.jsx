import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Instagram, Facebook, Twitter, MapPin, Phone, Mail, ArrowUpRight, Sparkles } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0D0D0D] text-white pt-24 pb-12 border-t border-[#C5A059]/20">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">

          {/* --- BRAND COLUMN (4 COLS) --- */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex flex-col mb-8 group w-fit">
              <img
                src="../../logo.png"   // put logo inside public folder
                alt="Ashirwad Jewellers"
                className="h-10 md:h-12 w-auto object-contain rounded-lg"
              />
              <h2 className="text-3xl font-['AnticDidone-Regular'] tracking-tight">
                Ashirwad <span className="italic font-light opacity-80">Jewellers</span>
              </h2>
              <p className="text-[9px] tracking-[0.5em] uppercase font-['Golden'] text-[#C5A059] mt-1">Handcrafted Excellence</p>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm mb-8 font-light italic">
              "Crafting timeless legacies since 1994. Each masterpiece is a testament to our commitment to purity, precision, and the art of fine jewelry."
            </p>
            <div className="flex space-x-5">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="text-white/40 hover:text-[#C5A059] transition-colors duration-300">
                  <Icon size={20} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* --- COLLECTIONS (2 COLS) --- */}
          <div className="lg:col-span-2">
            <h4 className="text-[#C5A059] font-['Golden'] text-[10px] tracking-[0.3em] uppercase mb-8">Collections</h4>
            <ul className="space-y-4">
              {['Necklaces', 'Rings', 'Bangles', 'Earrings', 'Diamond Wear'].map((item) => (
                <li key={item}>
                  <Link to={`/products?category=${item}`} className="text-sm text-white/60 hover:text-white transition-colors flex items-center group">
                    {item}
                    <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-all -translate-y-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* --- CLIENT CARE (2 COLS) --- */}
          <div className="lg:col-span-2">
            <h4 className="text-[#C5A059] font-['Golden'] text-[10px] tracking-[0.3em] uppercase mb-8">Client Care</h4>
            <ul className="space-y-4 font-light">
              {['Bespoke Service', 'Lifetime Buyback', 'Jewelry Care', 'Shipping Policy', 'Contact Us'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* --- CONTACT & NEWSLETTER (4 COLS) --- */}
          <div className="lg:col-span-4">
            <h4 className="text-[#C5A059] font-['Golden'] text-[10px] tracking-[0.3em] uppercase mb-8">The Atelier</h4>
            <ul className="space-y-6 mb-10">
              <li className="flex items-start space-x-4">
                <MapPin size={18} className="text-[#C5A059] shrink-0 mt-1" />
                <span className="text-sm text-white/60 leading-relaxed font-light">
                  Signature Gallery: 123 Heritage Lane,<br />Jewellery District, Mumbai, MH 400001
                </span>
              </li>
              <li className="flex items-center space-x-4">
                <Phone size={18} className="text-[#C5A059] shrink-0" />
                <span className="text-sm text-white/60 font-light">+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-4">
                <Mail size={18} className="text-[#C5A059] shrink-0" />
                <span className="text-sm text-white/60 font-light">atelier@ashirwad.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* --- BOTTOM BAR --- */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="flex space-x-8 text-[10px] font-['Golden'] tracking-[0.2em] text-white/30 uppercase">
            <a href="#" className="hover:text-[#C5A059] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#C5A059] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#C5A059] transition-colors">Cookies</a>
          </div>

          <p className="text-[10px] font-['Golden'] tracking-[0.2em] text-white/30 uppercase text-center">
            © {currentYear} Ashirwad Jewellers. Handcrafted in India.
          </p>

          <div className="flex items-center space-x-2 text-[#C5A059] opacity-80">
            <Sparkles size={14} />
            <Link to="/extra" className="group px-12 py-4 hover:bg-[#C5A059] transition-all duration-500">
              <span className="text-[9px] font-['Golden'] tracking-[0.3em] uppercase">BIS Hallmarked</span>
            </Link>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;