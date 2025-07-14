import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { BitrefillProduct, ProductCategory } from '../types/bitrefill';
import { Coupon, SpinnerPrize, SpinnerResult, CouponCategory } from '../types/coupon';

interface AppState {
  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Wallet & Connection
  isConnected: boolean;
  walletAddress: string | null;
  setWalletInfo: (connected: boolean, address?: string) => void;
  
  // Spinner
  spinnerTickets: number;
  addSpinnerTickets: (count: number) => void;
  useSpinnerTicket: () => void;
  
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
  
  // Coupon System
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  addCoupon: (coupon: Coupon) => void;
  selectCoupon: (couponId: string) => void;
  unselectCoupon: () => void;
  useCoupon: (couponId: string) => void;
  getCouponsByCategory: (category: CouponCategory) => Coupon[];
  
  // Spinner System
  spinnerPrizes: SpinnerPrize[];
  spinnerResults: SpinnerResult[];
  isSpinning: boolean;
  spinnerSpeed: 'normal' | 'instant';
  addSpinnerResult: (result: SpinnerResult) => void;
  setSpinning: (spinning: boolean) => void;
  setSpinnerSpeed: (speed: 'normal' | 'instant') => void;
  
  // Gift Cards (for future use)
  selectedGiftCardCategory: string;
  setGiftCardCategory: (category: string) => void;
  
  // Scoreboard (for future use)
  userXP: number;
  userScore: number;
  addXP: (amount: number) => void;
  addScore: (amount: number) => void;
}

// Body scroll control functions
const disableBodyScroll = () => {
  const body = document.body;
  const scrollY = window.scrollY;
  
  body.style.position = 'fixed';
  body.style.top = `-${scrollY}px`;
  body.style.width = '100%';
  body.style.overflow = 'hidden';
};

const enableBodyScroll = () => {
  const body = document.body;
  const scrollY = body.style.top;
  
  body.style.position = '';
  body.style.top = '';
  body.style.width = '';
  body.style.overflow = '';
  
  if (scrollY) {
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
  }
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
      
      // Spinner
      spinnerTickets: 3, // Default starting tickets
      addSpinnerTickets: (count) => 
        set((state) => ({ 
          spinnerTickets: state.spinnerTickets + count 
        })),
      useSpinnerTicket: () => 
        set((state) => ({ 
          spinnerTickets: Math.max(0, state.spinnerTickets - 1) 
        })),
      
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
        disableBodyScroll();
        set({ selectedProduct: product });
      },
      closeProductModal: () => {
        enableBodyScroll();
        set({ selectedProduct: null });
      },
      
      // Coupon System
      coupons: [],
      selectedCoupon: null,
      addCoupon: (coupon) => 
        set((state) => ({ 
          coupons: [...state.coupons, coupon] 
        })),
      selectCoupon: (couponId) => 
        set((state) => {
          const coupons = state.coupons.map(c => ({
            ...c,
            isSelected: c.id === couponId
          }));
          const selectedCoupon = coupons.find(c => c.id === couponId) || null;
          return { coupons, selectedCoupon };
        }),
      unselectCoupon: () => 
        set((state) => ({
          coupons: state.coupons.map(c => ({ ...c, isSelected: false })),
          selectedCoupon: null
        })),
      useCoupon: (couponId) => 
        set((state) => ({
          coupons: state.coupons.map(c => 
            c.id === couponId ? { ...c, isUsed: true, isSelected: false } : c
          ),
          selectedCoupon: null
        })),
      getCouponsByCategory: (category: CouponCategory) => {
        const state = get();
        return state.coupons.filter(c => c.category === category && !c.isUsed);
      },
      
      // Spinner System
      spinnerPrizes: [
        { text: "5% OFF", isInstantWin: true, probability: 20, color: "#f97066", coupon: undefined },
        { text: "10% OFF", isInstantWin: true, probability: 15, color: "#2e90fa", coupon: undefined },
        { text: "15% OFF", isInstantWin: true, probability: 10, color: "#fdb022", coupon: undefined },
        { text: "20% OFF", isInstantWin: true, probability: 5, color: "#ee46bc", coupon: undefined },
        { text: "Try Again", isInstantWin: false, probability: 30, color: "#8f7f8f", coupon: undefined },
        { text: "Free Shipping", isInstantWin: true, probability: 15, color: "#00ff00", coupon: undefined },
        { text: "Lucky Day!", isInstantWin: true, probability: 5, color: "#854CFF", coupon: undefined }
      ],
      spinnerResults: [],
      isSpinning: false,
      spinnerSpeed: 'normal',
      addSpinnerResult: (result: SpinnerResult) => 
        set((state) => ({ 
          spinnerResults: [...state.spinnerResults, result] 
        })),
      setSpinning: (spinning: boolean) => 
        set({ isSpinning: spinning }),
      setSpinnerSpeed: (speed: 'normal' | 'instant') => 
        set({ spinnerSpeed: speed }),
      
      // Gift Cards
      selectedGiftCardCategory: 'all',
      setGiftCardCategory: (category: string) => 
        set({ selectedGiftCardCategory: category }),
      
      // Scoreboard
      userXP: 0,
      userScore: 0,
      addXP: (amount: number) => 
        set((state) => ({ userXP: state.userXP + amount })),
      addScore: (amount: number) => 
        set((state) => ({ userScore: state.userScore + amount })),
    }),
    {
      name: 'app-store',
    }
  )
); 