import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { storage } from '../services/storage';
import { Order, generateMockOrder } from '../services/mockData';

interface WorkerContextType {
  isOnline: boolean;
  setIsOnline: (value: boolean) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  pendingOrders: Order[];
  myOrders: Order[];
  completedOrders: Order[];
  acceptOrder: (orderId: string) => void;
  rejectOrder: (orderId: string) => void;
  completeOrder: (orderId: string) => void;
  approveOrder: (orderId: string) => void;
  minPrice: number;
  maxPrice: number;
  setMinPrice: (price: number) => void;
  setMaxPrice: (price: number) => void;
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  language: 'uz' | 'ru';
  setLanguage: (lang: 'uz' | 'ru') => void;
}

export const WorkerContext = createContext<WorkerContextType | undefined>(undefined);

export function WorkerProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnlineState] = useState(false);
  const [selectedCategories, setSelectedCategoriesState] = useState<string[]>([]);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [minPrice, setMinPriceState] = useState(200000);
  const [maxPrice, setMaxPriceState] = useState(300000);
  const [isDarkMode, setIsDarkModeState] = useState(false);
  const [language, setLanguageState] = useState<'uz' | 'ru'>('uz');

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (isOnline && selectedCategories.length > 0) {
      const interval = setInterval(() => {
        if (myOrders.filter(o => o.status === 'accepted' || o.status === 'approved').length === 0) {
          const randomCategory = selectedCategories[Math.floor(Math.random() * selectedCategories.length)];
          const categoryData = [
            { id: '1', name: 'Qurilish ishlari' },
            { id: '2', name: 'Universal ishchi' },
            { id: '3', name: 'Buzish ishlari' },
            { id: '4', name: 'Yuk ortish/tushirish' },
          ].find(c => c.id === randomCategory);
          
          if (categoryData && Math.random() > 0.5) {
            const newOrder = generateMockOrder(categoryData.id, categoryData.name);
            setPendingOrders(prev => [newOrder, ...prev]);
          }
        }
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [isOnline, selectedCategories, myOrders]);

  const loadSettings = async () => {
    const settings = await storage.getItem<any>('workerSettings');
    if (settings) {
      setMinPriceState(settings.minPrice || 200000);
      setMaxPriceState(settings.maxPrice || 300000);
      setIsDarkModeState(settings.isDarkMode || false);
      setLanguageState(settings.language || 'uz');
    }
  };

  const setIsOnline = (value: boolean) => {
    setIsOnlineState(value);
  };

  const setSelectedCategories = (categories: string[]) => {
    setSelectedCategoriesState(categories);
  };

  const acceptOrder = (orderId: string) => {
    const order = pendingOrders.find(o => o.id === orderId);
    if (order) {
      const updatedOrder = { ...order, status: 'accepted' as const };
      setPendingOrders(prev => prev.filter(o => o.id !== orderId));
      setMyOrders(prev => [updatedOrder, ...prev]);
      setIsOnlineState(false);
      
      setTimeout(() => {
        approveOrder(orderId);
      }, 3000);
    }
  };

  const rejectOrder = (orderId: string) => {
    setPendingOrders(prev => prev.filter(o => o.id !== orderId));
  };

  const approveOrder = (orderId: string) => {
    setMyOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? {
              ...o,
              status: 'approved' as const,
              clientName: 'Alisher Karimov',
              clientPhone: '+998901234567',
            }
          : o
      )
    );
  };

  const completeOrder = (orderId: string) => {
    const order = myOrders.find(o => o.id === orderId);
    if (order) {
      const completedOrder = { ...order, status: 'completed' as const, completedAt: new Date() };
      setMyOrders(prev => prev.filter(o => o.id !== orderId));
      setCompletedOrders(prev => [completedOrder, ...prev]);
      setIsOnlineState(true);
    }
  };

  const setMinPrice = async (price: number) => {
    setMinPriceState(price);
    const settings = await storage.getItem<any>('workerSettings') || {};
    await storage.setItem('workerSettings', { ...settings, minPrice: price });
  };

  const setMaxPrice = async (price: number) => {
    setMaxPriceState(price);
    const settings = await storage.getItem<any>('workerSettings') || {};
    await storage.setItem('workerSettings', { ...settings, maxPrice: price });
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
        isOnline,
        setIsOnline,
        selectedCategories,
        setSelectedCategories,
        pendingOrders,
        myOrders,
        completedOrders,
        acceptOrder,
        rejectOrder,
        completeOrder,
        approveOrder,
        minPrice,
        maxPrice,
        setMinPrice,
        setMaxPrice,
        isDarkMode,
        setIsDarkMode,
        language,
        setLanguage,
      }}
    >
      {children}
    </WorkerContext.Provider>
  );
}
