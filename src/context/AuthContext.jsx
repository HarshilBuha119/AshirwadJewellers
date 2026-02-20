import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, signInWithGoogle, signOut } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async () => {
    try {
      const user = await signInWithGoogle();
      toast.success(`Welcome, ${user.displayName}!`);
      return user;
    } catch (error) {
      toast.error('Failed to sign in. Please try again.');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
