import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ChevronRight } from 'lucide-react';
import { ordersAPI } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Orders = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadOrders();
    } else {
      login().then(() => loadOrders()).catch(() => navigate('/'));
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      const data = await ordersAPI.getOrders(user.uid);
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'placed':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-warm-800 font-medium">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Package className="w-24 h-24 text-warm-300 mx-auto mb-6" />
        <h2 className="text-3xl font-bold font-serif text-warm-900 mb-4">No orders yet</h2>
        <p className="text-warm-600 mb-8">Start shopping to see your orders here</p>
        <button
          onClick={() => navigate('/products')}
          className="inline-block bg-gold-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gold-700 transition-colors"
        >
          Browse Collections
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-serif text-warm-900 mb-2">My Orders</h1>
        <p className="text-warm-600">{orders.length} order(s)</p>
      </div>

      <div className="space-y-4">
        {orders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card p-6"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold">Order #{order.id.slice(0, 8)}</h3>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-warm-600">
                  Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div className="mt-4 md:mt-0 text-right">
                <p className="text-sm text-warm-600">Total Amount</p>
                <p className="text-2xl font-bold text-warm-900">₹{order.total_amount.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* Order Items */}
            {order.items && Array.isArray(order.items) && (
              <div className="border-t border-warm-200 pt-4">
                <p className="text-sm font-semibold text-warm-800 mb-3">
                  {order.items.length} item(s)
                </p>
                <div className="space-y-2">
                  {order.items.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-3 text-sm text-warm-600">
                      <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                      <span>{item.name || `Item ${idx + 1}`}</span>
                      {item.quantity && <span className="text-warm-400">× {item.quantity}</span>}
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className="text-sm text-warm-500 ml-5">+{order.items.length - 3} more items</p>
                  )}
                </div>
              </div>
            )}

            {/* Customer Info */}
            {order.customer_info && (
              <div className="border-t border-warm-200 mt-4 pt-4">
                <p className="text-sm font-semibold text-warm-800 mb-2">Delivery Address</p>
                <div className="text-sm text-warm-600">
                  {order.customer_info.name && <p>{order.customer_info.name}</p>}
                  {order.customer_info.phone && <p>Phone: {order.customer_info.phone}</p>}
                  {order.customer_info.address && <p>{order.customer_info.address}</p>}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
