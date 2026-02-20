import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  Search,
  LogOut,
  Package,
  Crown,
  ChevronRight
} from 'lucide-react';
import { cartAPI } from '../config/supabase';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, login, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user) loadCartCount();
    else setCartCount(0);
  }, [user]);

  const loadCartCount = async () => {
    try {
      const cart = await cartAPI.getCart(user.uid);
      setCartCount(cart.length);
    } catch (error) { console.error(error); }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Collections', path: '/products' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled
          ? 'bg-white/90 backdrop-blur-xl border-b border-[#C5A059]/20 shadow-sm'
          : 'bg-white'
          }`}
      >
        {/* --- LUXURY ANNOUNCEMENT BAR --- */}
        <div className="bg-[#111] text-[#C5A059] py-2 overflow-hidden">
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-center text-[9px] md:text-[10px] tracking-[0.3em] md:tracking-[0.4em] uppercase font-['Golden'] px-4"
          >
            Complimentary Insured Shipping • Lifetime Buyback Guarantee
          </motion.p>
        </div>

        <div className="container mx-auto px-4 md:px-6 lg:px-12">
          {/* Increased mobile height to prevent "touching the top" */}
          <div className="flex items-center justify-between h-20 lg:h-24">

            {/* Left: Desktop Nav Items */}
            <div className="hidden lg:flex items-center space-x-8 flex-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="relative group text-[11px] tracking-[0.2em] uppercase font-['Golden'] text-slate-800"
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 h-[1px] bg-[#C5A059] transition-all duration-300 ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </Link>
              ))}
            </div>

            {/* Center: Brand Identity */}
            <Link to="/" className="flex items-center gap-3 group px-4">

              {/* LOGO */}
              <img
                src="../../logo.png"   // put logo inside public folder
                alt="Ashirwad Jewellers"
                className="h-10 md:h-12 w-auto object-contain rounded-full"
              />

              {/* TEXT */}
              <div className="flex flex-col leading-tight">
                <h1 className="text-xl md:text-2xl font-['AnticDidone-Regular'] tracking-tight text-[#111] whitespace-nowrap">
                  Ashirwad <span className="italic font-light">Jewellers</span>
                </h1>

                <p className="text-[7px] md:text-[8px] tracking-[0.4em] md:tracking-[0.5em] uppercase font-['Golden'] text-[#C5A059]">
                  Handcrafted Excellence
                </p>
              </div>

            </Link>

            {/* Right: Actions */}
            <div className="flex items-center justify-end space-x-2 md:space-x-4 flex-1">
              <div className="flex items-center space-x-1 md:space-x-3">
                <Link to="/favorites" className="p-2 hover:text-[#C5A059] transition-colors">
                  <Heart className="w-5 h-5" strokeWidth={1.2} />
                </Link>

                <Link to="/cart" className="p-2 hover:text-[#C5A059] transition-colors relative">
                  <ShoppingCart className="w-5 h-5" strokeWidth={1.2} />
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-0 bg-[#C5A059] text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* Desktop User Menu */}
                <div className="hidden md:block relative">
                  {user?.providerData[0]?.photoURL ? (
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="p-1 border border-[#C5A059]/30 rounded-full ml-2 hover:border-[#C5A059] transition-colors"
                    >
                      <img
                        src={user.providerData[0].photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'User'}&background=C5A059&color=fff`}
                        className="w-7 h-7 rounded-full object-cover"
                        alt="profile"
                      />
                    </button>
                  ) : (
                    <button
                      onClick={login}
                      className="text-[10px] tracking-[0.2em] uppercase font-['Golden'] border border-black px-5 py-2 hover:bg-black hover:text-white transition-all duration-500"
                    >
                      Sign In
                    </button>
                  )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setIsMenuOpen(true)}
                  className="lg:hidden p-2 text-slate-900 ml-1"
                >
                  <Menu size={24} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- DESKTOP USER DROPDOWN --- */}
        <AnimatePresence>
          {showUserMenu && user && (
            <>
              <div className="fixed inset-0 z-[-1]" onClick={() => setShowUserMenu(false)} />
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                className="absolute right-12 top-24 w-56 bg-white border border-slate-100 shadow-2xl p-4 font-['Golden']"
              >
                <p className="text-[9px] text-slate-400 mb-4 tracking-tight border-b pb-2 truncate">{user.email}</p>
                <Link to="/profile" className="flex items-center space-x-3 py-2.5 text-[11px] hover:text-[#C5A059]" onClick={() => setShowUserMenu(false)}>
                  <User size={14} /> <span>My Profile</span>
                </Link>
                <Link to="/orders" className="flex items-center space-x-3 py-2.5 text-[11px] hover:text-[#C5A059]" onClick={() => setShowUserMenu(false)}>
                  <Package size={14} /> <span>Order History</span>
                </Link>
                <button onClick={logout} className="flex items-center space-x-3 py-2.5 text-[11px] text-red-600 mt-2 border-t w-full">
                  <LogOut size={14} /> <span>Sign Out</span>
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* --- MOBILE FULLSCREEN MENU (FIXED) --- */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.4 }}
              className="fixed inset-0 bg-white z-[200] lg:hidden flex flex-col"
            >
              {/* Mobile Menu Header */}
              <div className="flex justify-between items-center p-6 border-b border-slate-50">
                <div className="flex items-center space-x-2">
                  <Crown className="text-[#C5A059]" size={20} />
                  <span className="font-['Golden'] text-[10px] tracking-widest uppercase">The Boutique</span>
                </div>
                <button onClick={() => setIsMenuOpen(false)} className="p-2">
                  <X size={28} strokeWidth={1} />
                </button>
              </div>

              {/* Mobile Auth / Profile Section */}
              <div className="p-8 bg-[#FCFAFA] border-b border-slate-100">
                {user ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={user.providerData[0].photoURL}
                        className="w-12 h-12 rounded-full border border-[#C5A059]/30"
                        alt="user"
                      />
                      <div>
                        <p className="text-sm font-['AnticDidone-Regular'] italic">{user.displayName || 'Distinguished Guest'}</p>
                        <p className="text-[9px] font-['Golden'] text-[#C5A059] uppercase tracking-tighter">Gold Member</p>
                      </div>
                    </div>
                    <button onClick={logout} className="text-red-400 p-2"><LogOut size={18} /></button>
                  </div>
                ) : (
                  <button
                    onClick={() => { login(); setIsMenuOpen(false); }}
                    className="w-full bg-[#111] text-white py-4 font-['Golden'] text-[10px] tracking-[0.3em] uppercase"
                  >
                    Enter the Boutique (Sign In)
                  </button>
                )}
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col p-8 space-y-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name} to={link.path}
                    className="text-3xl font-['AnticDidone-Regular'] flex items-center justify-between group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{link.name}</span>
                    <ChevronRight size={20} className="text-slate-200 group-hover:text-[#C5A059]" />
                  </Link>
                ))}
                {user && (
                  <>
                    <Link to="/profile" className="text-xl font-['AnticDidone-Regular'] pt-4 border-t border-slate-50" onClick={() => setIsMenuOpen(false)}>My Profile</Link>
                    <Link to="/orders" className="text-xl font-['AnticDidone-Regular']" onClick={() => setIsMenuOpen(false)}>Order History</Link>
                  </>
                )}
              </div>

              {/* Mobile Footer */}
              <div className="mt-auto p-8 text-center bg-[#111]">
                <p className="font-['Golden'] text-[8px] tracking-[0.4em] text-[#C5A059] uppercase">Handcrafted in India Since 1990</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* FIXED SPACER: Uses dynamic padding to ensure content never hides under the navbar */}
      <div className="pt-[110px] md:pt-[140px]"></div>
    </>
  );
};

export default Navbar;