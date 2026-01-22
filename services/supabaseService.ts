import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

const createStorageAdapter = () => {
  if (Platform.OS === 'web') {
    return {
      getItem: (key: string) => {
        if (typeof window !== 'undefined' && window.localStorage) {
          return Promise.resolve(window.localStorage.getItem(key));
        }
        return Promise.resolve(null);
      },
      setItem: (key: string, value: string) => {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(key, value);
          return Promise.resolve();
        }
        return Promise.resolve();
      },
      removeItem: (key: string) => {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(key);
          return Promise.resolve();
        }
        return Promise.resolve();
      },
    };
  } else {
    return AsyncStorage;
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: createStorageAdapter() as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// =====================================================
// TYPES
// =====================================================

export interface Category {
  id: string;
  name_uz: string;
  name_ru: string;
  icon: string;
  created_at: string;
}

export interface Worker {
  id: string;
  full_name: string;
  phone: string;
  rating: number;
  completed_orders: number;
  success_rate: number;
  min_price: number;
  max_price: number;
  is_online: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkerCategory {
  id: string;
  worker_id: string;
  category_id: string;
  created_at: string;
}

export interface Order {
  id: string;
  customer_id: string;
  worker_id: string | null;
  category_id: string;
  title: string;
  description: string;
  location: string;
  images: string[];
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'rejected';
  customer_phone: string | null;
  created_at: string;
  updated_at: string;
  category?: Category;
}

// =====================================================
// CATEGORIES
// =====================================================

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name_uz');

  if (error) throw error;
  return data as Category[];
}

// =====================================================
// WORKER PROFILE
// =====================================================

export async function getCurrentWorker() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('workers')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
  return data as Worker | null;
}

export async function createWorkerProfile(profile: {
  full_name: string;
  phone: string;
  min_price?: number;
  max_price?: number;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('workers')
    .insert({
      id: user.id,
      full_name: profile.full_name,
      phone: profile.phone,
      min_price: profile.min_price || 200000,
      max_price: profile.max_price || 300000,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Worker;
}

export async function updateWorkerProfile(updates: Partial<Worker>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('workers')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data as Worker;
}

// =====================================================
// WORKER CATEGORIES
// =====================================================

export async function getWorkerCategories() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('worker_categories')
    .select(`
      id,
      category_id,
      categories (
        id,
        name_uz,
        name_ru,
        icon
      )
    `)
    .eq('worker_id', user.id);

  if (error) throw error;
  return data;
}

export async function setWorkerCategories(categoryIds: string[]) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Delete existing categories
  await supabase
    .from('worker_categories')
    .delete()
    .eq('worker_id', user.id);

  // Insert new categories
  if (categoryIds.length > 0) {
    const { error } = await supabase
      .from('worker_categories')
      .insert(
        categoryIds.map(categoryId => ({
          worker_id: user.id,
          category_id: categoryId,
        }))
      );

    if (error) throw error;
  }
}

// =====================================================
// ORDERS
// =====================================================

export async function getAvailableOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      category:categories (
        id,
        name_uz,
        name_ru,
        icon
      )
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Order[];
}

export async function getMyOrders() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      category:categories (
        id,
        name_uz,
        name_ru,
        icon
      )
    `)
    .eq('worker_id', user.id)
    .in('status', ['accepted', 'in_progress', 'completed'])
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Order[];
}

export async function acceptOrder(orderId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('orders')
    .update({
      worker_id: user.id,
      status: 'accepted',
    })
    .eq('id', orderId)
    .eq('status', 'pending')
    .select()
    .single();

  if (error) throw error;
  return data as Order;
}

export async function rejectOrder(orderId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('orders')
    .update({ status: 'rejected' })
    .eq('id', orderId)
    .eq('worker_id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data as Order;
}

export async function completeOrder(orderId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('orders')
    .update({ status: 'completed' })
    .eq('id', orderId)
    .eq('worker_id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data as Order;
}

// =====================================================
// REAL-TIME SUBSCRIPTIONS
// =====================================================

export function subscribeToOrders(
  callback: (payload: any) => void
) {
  const channel = supabase
    .channel('orders-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'orders',
      },
      callback
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
