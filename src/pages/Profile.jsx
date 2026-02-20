import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, ShoppingBag, Heart, LogOut, ChevronRight, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  console.log(user);

  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) navigate('/');
  }, [user, navigate]);

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="bg-[#FCFAFA] min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">

        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="text-[#C5A059] font-['Golden'] text-[10px] tracking-[0.4em] uppercase block mb-4">Account Overview</span>
          <h1 className="text-5xl font-['AnticDidone-Regular'] text-[#111] italic">Client Dossier</h1>
          <div className="h-[1px] w-20 bg-[#C5A059] mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left: Identity Card */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 border border-slate-100 shadow-sm relative overflow-hidden group"
            >
              {/* FIXED: Constrained the decorative background icon so it doesn't overlap */}


              <div className="relative z-10 flex flex-col items-center">
                <div className="w-24 h-24 mb-6 relative">
                  {user.providerData[0].photoURL ? (
                    <img
                      src={user.providerData[0].photoURL}
                      alt={user.displayName}
                      className="w-full h-full rounded-full object-cover border border-[#C5A059]/30 p-1 bg-white"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#f8f5f0] rounded-full flex items-center justify-center border border-[#C5A059]/20">
                      {/* Using the first letter of name if no photo */}
                      <span className="text-3xl font-serif text-[#C5A059]">
                        {user.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase() || 'H'}
                      </span>
                    </div>
                  )}
                  {/* Elite Ribbon Badge */}
                  <div className="absolute bottom-0 right-0 bg-[#111] p-1.5 rounded-full border-2 border-white shadow-sm">
                    <Award size={12} className="text-[#C5A059]" />
                  </div>
                </div>

                <h2 className="text-2xl font-['AnticDidone-Regular'] text-[#111] mb-1">
                  {user.displayName || 'Distinguished Guest'}
                </h2>
                <p className="text-[#C5A059] font-['Golden'] text-[9px] tracking-widest uppercase mb-8">Elite Member</p>

                <div className="w-full space-y-4 pt-6 border-t border-slate-50">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-[#FCFAFA] rounded-full"><Mail size={14} className="text-slate-400" /></div>
                    <div className="overflow-hidden">
                      <p className="text-[8px] font-['Golden'] text-slate-400 uppercase tracking-tighter">Identity Email</p>
                      <p className="text-sm text-[#111] truncate">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-[#FCFAFA] rounded-full"><Phone size={14} className="text-slate-400" /></div>
                    <div>
                      <p className="text-[8px] font-['Golden'] text-slate-400 uppercase tracking-tighter">Private Line</p>
                      <p className="text-sm text-[#111]">{user.phoneNumber || 'Not Registered'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Navigation & Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {[
                { title: 'Purchase History', desc: 'Track your reserved masterpieces', icon: ShoppingBag, path: '/orders' },
                { title: 'The Private Vault', desc: 'View your curated wishlist', icon: Heart, path: '/favorites' }
              ].map((item, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ x: 8 }}
                  onClick={() => navigate(item.path)}
                  className="flex items-center justify-between p-6 bg-white border border-slate-100 hover:border-[#C5A059]/30 transition-all text-left group"
                >
                  <div className="flex items-center space-x-6">
                    <div className="p-3 bg-[#FCFAFA] group-hover:bg-[#C5A059]/10 transition-colors">
                      <item.icon size={20} className="text-[#111] group-hover:text-[#C5A059]" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="font-['AnticDidone-Regular'] text-lg text-[#111]">{item.title}</h3>
                      <p className="text-xs text-slate-400 italic">{item.desc}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-[#C5A059]" />
                </motion.button>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-3 border border-red-100 text-red-400 py-4 hover:bg-red-50 transition-all font-['Golden'] text-[10px] tracking-[0.3em] uppercase"
              >
                <LogOut size={14} />
                <span>Terminate Session</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;