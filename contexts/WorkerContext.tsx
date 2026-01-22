import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { storage } from '../services/storage';
import { notificationService } from '../services/notificationService';
import * as supabaseService from '../services/supabaseService';
import type { Category, Order, Worker } from '../services/supabaseService';

interface CategoryDisplay {
  id: string;
  name: string;
  icon: string;
}

interface WorkerContextType {
  // Profile
  worker: Worker | null;
  fullName: string;
  phone: string;
  rating: number;
  completedOrders: number;
  successRate: number;
  minPrice: number;
  maxPrice: number;

  // Categories
  categories: CategoryDisplay[];
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;

  // Online status
  isOnline: boolean;
  setIsOnline: (value: boolean) => void;

  // Orders
  pendingOrders: Order[];
  myOrders: Order[];
  completedOrdersList: Order[];
  acceptOrder: (orderId: string) => Promise<void>;
  rejectOrder: (orderId: string) => void;
  completeOrder: (orderId: string) => Promise<void>;

  // Settings
  minPrice: number;
  maxPrice: number;
  setMinPrice: (price: number) => Promise<void>;
  setMaxPrice: (price: number) => Promise<void>;
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => Promise<void>;
  language: 'uz' | 'ru';
  setLanguage: (lang: 'uz' | 'ru') => Promise<void>;

  // Loading
  loading: boolean;
  refreshData: () => Promise<void>;
  totalEarnings: number;
}

export const WorkerContext = createContext<WorkerContextType | undefined>(undefined);

export function WorkerProvider({ children }: { children: ReactNode }) {
  // Profile state
  const [worker, setWorker] = useState<Worker | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [rating, setRating] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [successRate, setSuccessRate] = useState(0);
  const [minPriceState, setMinPriceState] = useState(200000);
  const [maxPriceState, setMaxPriceState] = useState(300000);

  // Categories
  const [categories, setCategories] = useState<CategoryDisplay[]>([]);
  const [selectedCategories, setSelectedCategoriesState] = useState<string[]>([]);

  // Online status
  const [isOnline, setIsOnlineState] = useState(false);

  // Orders
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [completedOrdersList, setCompletedOrdersList] = useState<Order[]>([]);

  // Settings
  const [isDarkMode, setIsDarkModeState] = useState(false);
  const [language, setLanguageState] = useState<'uz' | 'ru'>('uz');

  // Loading
  const [loading, setLoading] = useState(true);

  const totalEarnings = completedOrdersList.length * 250000;

  // Load initial data
  useEffect(() => {
    loadSettings();
    loadInitialData();
    notificationService.requestPermissions();
  }, []);

  // Real-time orders subscription
  useEffect(() => {
    if (!worker || !isOnline) return;

    const unsubscribe = supabaseService.subscribeToOrders(async (payload) => {
      console.log('Order change:', payload);
      
      if (payload.eventType === 'INSERT' && payload.new.status === 'pending') {
        // New order - check if it matches worker categories
        const workerCategories = await supabaseService.getWorkerCategories();
        const categoryIds = workerCategories.map((wc: any) => wc.category_id);
        
        if (categoryIds.includes(payload.new.category_id)) {
          // Send notification
          await notificationService.scheduleOrderNotification(
            payload.new.title,
            payload.new.location
          );
          // Refresh available orders
          loadAvailableOrders();
        }
      } else if (payload.eventType === 'UPDATE' && payload.new.worker_id === worker.id) {
        // Order updated for this worker
        if (payload.new.status === 'accepted') {
          await notificationService.scheduleApprovalNotification(payload.new.title);
        }
        loadMyOrders();
        loadAvailableOrders();
      }
    });

    return unsubscribe;
  }, [worker, isOnline]);

  const loadSettings = async () => {
    const settings = await storage.getItem<any>('workerSettings');
    if (settings) {
      setIsDarkModeState(settings.isDarkMode || false);
      setLanguageState(settings.language || 'uz');
    }
  };

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load categories
      const cats = await supabaseService.getCategories();
      setCategories(
        cats.map((c) => ({
          id: c.id,
          name: language === 'uz' ? c.name_uz : c.name_ru,
          icon: c.icon,
        }))
      );

      // Load worker profile
      const workerData = await supabaseService.getCurrentWorker();
      if (workerData) {
        setWorker(workerData);
        setFullName(workerData.full_name);
        setPhone(workerData.phone);
        setRating(workerData.rating);
        setCompletedOrders(workerData.completed_orders);
        setSuccessRate(workerData.success_rate);
        setMinPriceState(workerData.min_price);
        setMaxPriceState(workerData.max_price);
        setIsOnlineState(workerData.is_online);

        // Load worker categories
        const workerCats = await supabaseService.getWorkerCategories();
        setSelectedCategoriesState(workerCats.map((wc: any) => wc.category_id));

        // Load orders
        await loadAvailableOrders();
        await loadMyOrders();
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableOrders = async () => {
    try {
      const orders = await supabaseService.getAvailableOrders();
      setPendingOrders(orders);
    } catch (error) {
      console.error('Error loading available orders:', error);
    }
  };

  const loadMyOrders = async () => {
    try {
      const orders = await supabaseService.getMyOrders();
      const active = orders.filter(o => o.status !== 'completed');
      const completed = orders.filter(o => o.status === 'completed');
      setMyOrders(active);
      setCompletedOrdersList(completed);
    } catch (error) {
      console.error('Error loading my orders:', error);
    }
  };

  const refreshData = async () => {
    await loadInitialData();
  };

  const setIsOnline = async (online: boolean) => {
    try {
      if (worker) {
        await supabaseService.updateWorkerProfile({ is_online: online });
        setIsOnlineState(online);

        if (online) {
          await supabaseService.setWorkerCategories(selectedCategories);
          await loadAvailableOrders();
        } else {
          setPendingOrders([]);
        }
      }
    } catch (error) {
      console.error('Error updating online status:', error);
    }
  };

  const setSelectedCategories = (categories: string[]) => {
    setSelectedCategoriesState(categories);
  };

  const handleAcceptOrder = async (orderId: string) => {
    try {
      await supabaseService.acceptOrder(orderId);
      await loadAvailableOrders();
      await loadMyOrders();
      await setIsOnline(false);
    } catch (error) {
      console.error('Error accepting order:', error);
    }
  };

  const handleRejectOrder = (orderId: string) => {
    setPendingOrders(pendingOrders.filter(o => o.id !== orderId));
  };

  const handleCompleteOrder = async (orderId: string) => {
    try {
      await supabaseService.completeOrder(orderId);
      await loadMyOrders();
      await setIsOnline(true);
    } catch (error) {
      console.error('Error completing order:', error);
    }
  };

  const setMinPrice = async (price: number) => {
    setMinPriceState(price);
    if (worker) {
      await supabaseService.updateWorkerProfile({ min_price: price });
    }
  };

  const setMaxPrice = async (price: number) => {
    setMaxPriceState(price);
    if (worker) {
      await supabaseService.updateWorkerProfile({ max_price: price });
    }
  };

  const setIsDarkMode = async (value: boolean) => {
    setIsDarkModeState(value);
    const settings = await storage.getItem<any>('workerSettings') || {};
    await storage.setItem('workerSettings', { ...settings, isDarkMode: value });
  };

  const setLanguage = async (lang: 'uz' | 'ru') => {
    setLanguageState(lang);
    const settings = await storage.getItem<any>('workerSettings') || {};
    await storage.setItem('workerSettings', { ...settings, language: lang });
  };

  return (
    <WorkerContext.Provider
      value={{
        worker,
        fullName,
        phone,
        rating,
        completedOrders,
        successRate,
        minPrice: minPriceState,
        maxPrice: maxPriceState,
        categories,
        selectedCategories,
        setSelectedCategories,
        isOnline,
        setIsOnline,
        pendingOrders,
        myOrders,
        completedOrdersList,
        acceptOrder: handleAcceptOrder,
        rejectOrder: handleRejectOrder,
        completeOrder: handleCompleteOrder,
        minPrice: minPriceState,
        maxPrice: maxPriceState,
        setMinPrice,
        setMaxPrice,
        isDarkMode,
        setIsDarkMode,
        language,
        setLanguage,
        loading,
        refreshData,
        totalEarnings,
      }}
    >
      {children}
    </WorkerContext.Provider>
  );
}
