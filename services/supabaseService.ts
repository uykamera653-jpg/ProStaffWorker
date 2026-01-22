import { createClient } from '@supabase/supabase-js';

// IMPORTANT: Bu qiymatlarni Supabase Dashboard'dan olish kerak
// 1. https://supabase.com/dashboard -> Your Project
// 2. Settings -> API
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Database types
export interface Order {
  id: string;
  client_id: string;
  category_id: string;
  category_name: string;
  location: string;
  description: string;
  images: string[];
  status: 'pending' | 'accepted' | 'approved' | 'completed' | 'cancelled';
  worker_id: string | null;
  client_phone?: string;
  created_at: string;
  completed_at: string | null;
}

export interface Worker {
  id: string;
  user_id: string;
  categories: string[];
  is_online: boolean;
  min_price: number;
  max_price: number;
  rating: number;
  total_jobs: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name_uz: string;
  name_ru: string;
  icon: string;
  is_active: boolean;
}

/**
 * Worker Service - Ishchi profili bilan ishlash
 */
export const workerService = {
  // Ishchi profilini olish
  async getWorkerProfile(userId: string): Promise<Worker | null> {
    try {
      const { data, error } = await supabase
        .from('workers')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching worker profile:', error);
      return null;
    }
  },

  // Ishchi profilini yaratish
  async createWorkerProfile(userId: string): Promise<Worker | null> {
    try {
      const { data, error } = await supabase
        .from('workers')
        .insert({
          user_id: userId,
          categories: [],
          is_online: false,
          min_price: 200000,
          max_price: 300000,
          rating: 0,
          total_jobs: 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating worker profile:', error);
      return null;
    }
  },

  // Ishchi holatini yangilash (online/offline)
  async updateOnlineStatus(workerId: string, isOnline: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('workers')
        .update({ is_online: isOnline })
        .eq('id', workerId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating online status:', error);
      return false;
    }
  },

  // Ishchi kategoriyalarini yangilash
  async updateCategories(workerId: string, categories: string[]): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('workers')
        .update({ categories })
        .eq('id', workerId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating categories:', error);
      return false;
    }
  },

  // Narx oralig'ini yangilash
  async updatePriceRange(workerId: string, minPrice: number, maxPrice: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('workers')
        .update({ min_price: minPrice, max_price: maxPrice })
        .eq('id', workerId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating price range:', error);
      return false;
    }
  },
};

/**
 * Order Service - Buyurtmalar bilan ishlash
 */
export const orderService = {
  // Yangi buyurtmalarni olish (ishchi kategoriyalariga mos)
  async getAvailableOrders(categories: string[]): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('status', 'pending')
        .in('category_id', categories)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching available orders:', error);
      return [];
    }
  },

  // Ishchi buyurtmalarini olish
  async getWorkerOrders(workerId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('worker_id', workerId)
        .in('status', ['accepted', 'approved'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching worker orders:', error);
      return [];
    }
  },

  // Tugallangan buyurtmalar (tarix)
  async getCompletedOrders(workerId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('worker_id', workerId)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching completed orders:', error);
      return [];
    }
  },

  // Buyurtmani qabul qilish
  async acceptOrder(orderId: string, workerId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: 'accepted',
          worker_id: workerId,
        })
        .eq('id', orderId)
        .eq('status', 'pending'); // Faqat pending buyurtmalarni qabul qilish

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error accepting order:', error);
      return false;
    }
  },

  // Buyurtmani rad etish
  async rejectOrder(orderId: string): Promise<boolean> {
    try {
      // Buyurtma holatini o'zgartirmaymiz, faqat ishchi uchun yashiramiz
      return true;
    } catch (error) {
      console.error('Error rejecting order:', error);
      return false;
    }
  },

  // Buyurtmani tugatish
  async completeOrder(orderId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error completing order:', error);
      return false;
    }
  },

  // Real-time: Yangi buyurtmalarni tinglash
  subscribeToNewOrders(categories: string[], callback: (order: Order) => void) {
    return supabase
      .channel('new-orders')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
          filter: `category_id=in.(${categories.join(',')})`,
        },
        (payload) => {
          callback(payload.new as Order);
        }
      )
      .subscribe();
  },

  // Real-time: Buyurtma holatini tinglash
  subscribeToOrderStatus(orderId: string, callback: (order: Order) => void) {
    return supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          callback(payload.new as Order);
        }
      )
      .subscribe();
  },
};

/**
 * Category Service - Kategoriyalar bilan ishlash
 */
export const categoryService = {
  // Barcha faol kategoriyalarni olish
  async getActiveCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },
};
