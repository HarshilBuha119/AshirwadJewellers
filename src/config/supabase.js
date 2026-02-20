import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Jewelry API
export const jewelryAPI = {
  // Get all jewelry products
  getAll: async () => {
    const { data, error } = await supabase
      .from('jewellary')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // Get jewelry by ID
  getById: async (id) => {
    const { data, error } = await supabase
      .from('jewellary')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  // Get jewelry by category
  getByCategory: async (category) => {
    const { data, error } = await supabase
      .from('jewellary')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
};

// Banners API
export const bannersAPI = {
  getActive: async () => {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: true });
    if (error) throw error;
    return data;
  },
};

// Cart API
export const cartAPI = {
  getCart: async (userId) => {
    const { data, error } = await supabase
      .from('cart')
      .select(`
        *,
        jewellary:product_id(*)
      `)
      .eq('user_id', userId);
    if (error) throw error;
    return data;
  },

  addToCart: async (userId, productId, quantity = 1, options = {}) => {
    // Check if item already exists
    const { data: existing } = await supabase
      .from('cart')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    if (existing) {
      // Update quantity
      const { data, error } = await supabase
        .from('cart')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      // Insert new item
      const { data, error } = await supabase
        .from('cart')
        .insert([{ user_id: userId, product_id: productId, quantity, options }])
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  },

  updateQuantity: async (cartId, quantity) => {
    const { data, error } = await supabase
      .from('cart')
      .update({ quantity })
      .eq('id', cartId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  removeFromCart: async (cartId) => {
    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('id', cartId);
    if (error) throw error;
  },

  clearCart: async (userId) => {
    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('user_id', userId);
    if (error) throw error;
  },
};

// Favorites API
export const favoritesAPI = {
  getFavorites: async (userId) => {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        jewellary:product_id(*)
      `)
      .eq('user_id', userId);
    if (error) throw error;
    return data;
  },

  addToFavorites: async (userId, productId) => {
    const { data, error } = await supabase
      .from('favorites')
      .insert([{ user_id: userId, product_id: productId }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  removeFromFavorites: async (favoriteId) => {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('id', favoriteId);
    if (error) throw error;
  },

  isFavorite: async (userId, productId) => {
    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();
    return !!data;
  },
};

// Orders API
export const ordersAPI = {
  getOrders: async (userId) => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  createOrder: async (userId, items, totalAmount, customerInfo) => {
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        user_id: userId,
        items,
        total_amount: totalAmount,
        customer_info: customerInfo,
        status: 'placed',
      }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

// Metal Rates API
export const metalRatesAPI = {
  getRates: async () => {
    const { data, error } = await supabase
      .from('metal_rates')
      .select('*');
    if (error) throw error;
    return data;
  },
};
