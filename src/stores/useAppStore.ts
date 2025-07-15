import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { BitrefillProduct, ProductCategory } from '../types/bitrefill';
import { WonCoupon, PurchaseRecord, DailySpinLimit } from '../types/spinner';
import { getCurrentDateString } from '../lib';
import { Reward } from '../types/database';

interface AppState {
  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Wallet & Connection
  isConnected: boolean;
  walletAddress: string | null;
  setWalletInfo: (connected: boolean, address?: string) => void;
  
  // Spinner System
  spinnerTickets: number;
  wonCoupons: WonCoupon[];
  purchaseHistory: PurchaseRecord[];
  dailySpinLimits: DailySpinLimit[];
  addSpinnerTickets: (count: number) => void;
  setSpinnerTickets: (count: number) => void; // New method to directly set tickets
  useSpinnerTicket: () => void;
  addWonCoupon: (coupon: WonCoupon) => void;
  syncRewardsFromSupabase: (rewards: Reward[]) => void; // New method to sync rewards from Supabase
  useCoupon: (couponId: string) => void;
  addPurchase: (amount: number) => void;
  canSpin: () => boolean;
  getTodaysSpinCount: () => number;
  
  // Streak System
  currentStreak: number;
  bestStreak: number;
  lastPurchaseDate: string | null;
  updateStreak: () => void;
  
  // Time Travel (for testing)
  currentTestDate: Date | null;
  isTimeTravelActive: boolean;
  advanceDay: () => void;
  resetToToday: () => void;
  getFormattedTestDate: () => string;
  
  // Selected Coupon
  selectedCoupon: WonCoupon | null;
  selectCoupon: (coupon: WonCoupon | null) => void;
  
  // Mini App Detection
  isMiniApp: boolean | null;
  isLoading: boolean;
  setMiniAppStatus: (isMiniApp: boolean, isLoading: boolean) => void;
  
  // User Preferences
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  
  // Products
  products: Record<ProductCategory, BitrefillProduct[]>;
  productsLoading: boolean;
  productsError: string | null;
  setProducts: (category: ProductCategory, products: BitrefillProduct[]) => void;
  setAllProducts: (products: Record<ProductCategory, BitrefillProduct[]>) => void;
  setProductsLoading: (loading: boolean) => void;
  setProductsError: (error: string | null) => void;
  
  // Modal State
  selectedProduct: BitrefillProduct | null;
  openProductModal: (product: BitrefillProduct) => void;
  closeProductModal: () => void;
  
  // Gift Cards (for future use)
  selectedGiftCardCategory: string;
  setGiftCardCategory: (category: string) => void;
  
  // Scoreboard (for future use)
  userXP: number;
  userScore: number;
  addXP: (amount: number) => void;
  addScore: (amount: number) => void;
}

// Helper function to convert Supabase Reward to WonCoupon
const rewardToWonCoupon = (reward: Reward): WonCoupon => {
  const isDiscount = reward.name?.includes('%');
  return {
    id: reward.id,
    type: isDiscount ? 'discount' : 'freebie',
    value: reward.amount,
    title: reward.name || 'Reward',
    description: isDiscount 
      ? `Get ${reward.amount}% OFF on your next purchase` 
      : `Free $${reward.amount} credit`,
    expiresAt: new Date(new Date(reward.received_at).getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from received date
    wonAt: new Date(reward.received_at),
    used: reward.status === 'used'
  };
};

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      // Navigation
      activeTab: 'home',
      setActiveTab: (tab) => set({ activeTab: tab }),
      
      // Wallet & Connection
      isConnected: false,
      walletAddress: null,
      setWalletInfo: (connected, address) => 
        set({ 
          isConnected: connected, 
          walletAddress: address || null 
        }),
      
      // Spinner System
      spinnerTickets: 0, // Default starting tickets
      wonCoupons: [],
      purchaseHistory: [],
      dailySpinLimits: [],
      
      addSpinnerTickets: (count) => 
        set((state) => ({ 
          spinnerTickets: state.spinnerTickets + count 
        })),
      
      // Direct setter for spinner tickets (for Supabase integration)
      setSpinnerTickets: (count) => 
        set({ spinnerTickets: count }),
        
      useSpinnerTicket: () => {
        const state = get();
        if (state.canSpin()) {
          const today = getCurrentDateString();
          const todayLimit = state.dailySpinLimits.find(limit => limit.date === today);
          
          set((state) => ({
            spinnerTickets: Math.max(0, state.spinnerTickets - 1),
            dailySpinLimits: state.dailySpinLimits.map(limit => 
              limit.date === today 
                ? { ...limit, ticketsUsed: limit.ticketsUsed + 1 }
                : limit
            ).concat(
              !todayLimit ? [{ date: today, ticketsUsed: 1, maxTickets: 3 }] : []
            )
          }));
        }
      },
      
      addWonCoupon: (coupon) =>
        set((state) => ({
          wonCoupons: [...state.wonCoupons, coupon]
        })),
        
      useCoupon: async (couponId) => {
        // First update local state
        set((state) => ({
          wonCoupons: state.wonCoupons.map(coupon =>
            coupon.id === couponId ? { ...coupon, used: true } : coupon
          )
        }));
        
        // Then update in Supabase
        try {
          const { rewardService } = await import('../services/rewardService');
          await rewardService.useReward(couponId);
        } catch (error) {
          console.error('Error marking coupon as used in database:', error);
        }
      },
        
      addPurchase: (amount) => {
        const ticketsEarned = Math.floor(amount / 50);
        const purchase: PurchaseRecord = {
          id: Math.random().toString(36).substring(2, 9),
          amount,
          date: new Date(getCurrentDateString()), // Use current test date if available
          ticketsEarned
        };
        
        set((state) => ({
          purchaseHistory: [...state.purchaseHistory, purchase],
          spinnerTickets: state.spinnerTickets + ticketsEarned
        }));
        
        // Update streak after a purchase
        const state = get();
        state.updateStreak();
      },
      
      canSpin: () => {
        const state = get();
        const today = getCurrentDateString();
        const todayLimit = state.dailySpinLimits.find(limit => limit.date === today);
        const todaysSpins = todayLimit?.ticketsUsed || 0;
        
        return state.spinnerTickets > 0 && todaysSpins < 3;
      },
      
      getTodaysSpinCount: () => {
        const state = get();
        const today = getCurrentDateString();
        const todayLimit = state.dailySpinLimits.find(limit => limit.date === today);
        return todayLimit?.ticketsUsed || 0;
      },
      
      // Streak System
      currentStreak: 0,
      bestStreak: 0,
      lastPurchaseDate: null,
      
      // Time Travel (for testing)
      currentTestDate: null,
      isTimeTravelActive: false,
      
      advanceDay: () => {
        if (!import.meta.env.DEV) {
          console.error('Time travel is only available in development mode');
          return;
        }
        
        set((state) => {
          // If no test date is set, start with today
          const baseDate = state.currentTestDate || new Date();
          const newDate = new Date(baseDate);
          newDate.setDate(newDate.getDate() + 1);
          
          console.log(`🕰️ Time Travel: Advanced to ${newDate.toDateString()}`);
          
          return { 
            currentTestDate: newDate,
            isTimeTravelActive: true 
          };
        });
      },
      
      resetToToday: () => {
        set({ 
          currentTestDate: null,
          isTimeTravelActive: false
        });
        console.log('🕰️ Time Travel: Reset to today');
      },
      
      getFormattedTestDate: () => {
        const state = get();
        if (!state.currentTestDate) {
          return new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
        }
        
        return state.currentTestDate.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      },
      
      updateStreak: () => {
        const today = getCurrentDateString();
        const state = get();
        
        if (!state.lastPurchaseDate) {
          // First purchase ever
          set({ 
            currentStreak: 1, 
            bestStreak: 1, 
            lastPurchaseDate: today 
          });
          return;
        }
        
        if (state.lastPurchaseDate === today) {
          // Already purchased today, streak doesn't change
          return;
        }
        
        // Check if the last purchase was yesterday
        const lastDate = new Date(state.lastPurchaseDate);
        const currentDate = new Date(today);
        const timeDiff = currentDate.getTime() - lastDate.getTime();
        const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
        
        if (dayDiff === 1) {
          // Consecutive day, increase streak
          const newStreak = state.currentStreak + 1;
          set({ 
            currentStreak: newStreak, 
            bestStreak: Math.max(newStreak, state.bestStreak), 
            lastPurchaseDate: today 
          });
        } else if (dayDiff > 1) {
          // Streak broken, reset to 1
          set({ 
            currentStreak: 1, 
            lastPurchaseDate: today 
          });
        }
      },
      
      // Selected Coupon
      selectedCoupon: null,
      selectCoupon: (coupon) => 
        set({ selectedCoupon: coupon }),
      
      // Mini App Detection
      isMiniApp: null,
      isLoading: true,
      setMiniAppStatus: (isMiniApp, isLoading) => 
        set({ isMiniApp, isLoading }),
      
      // User Preferences
      theme: 'dark',
      toggleTheme: () => 
        set((state) => ({ 
          theme: state.theme === 'dark' ? 'light' : 'dark' 
        })),
      
      // Products
      products: {
        xbox: [],
        playstation: [],
        nintendo: [],
        steam: []
      },
      productsLoading: false,
      productsError: null,
      setProducts: (category, products) =>
        set((state) => ({
          products: {
            ...state.products,
            [category]: products
          }
        })),
      setAllProducts: (products) =>
        set({ products }),
      setProductsLoading: (loading) =>
        set({ productsLoading: loading }),
      setProductsError: (error) =>
        set({ productsError: error }),
      
      // Modal State
      selectedProduct: null,
      openProductModal: (product) => {
        set({ selectedProduct: product });
      },
      closeProductModal: () => {
        set({ selectedProduct: null });
      },
      
      // Gift Cards
      selectedGiftCardCategory: 'all',
      setGiftCardCategory: (category) => 
        set({ selectedGiftCardCategory: category }),
      
      // Scoreboard
      userXP: 0,
      userScore: 0,
      addXP: (amount) => 
        set((state) => ({ userXP: state.userXP + amount })),
      addScore: (amount) => 
        set((state) => ({ userScore: state.userScore + amount })),

      // Sync rewards from Supabase
      syncRewardsFromSupabase: (rewards: Reward[]) => {
        const spinRewards = rewards.filter(reward => reward.reward_type === 'spin');
        const wonCoupons = spinRewards.map(rewardToWonCoupon);
        
        set({ wonCoupons });
      },
    }),
    {
      name: 'app-store',
    }
  )
); 