import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { BitrefillProduct, ProductCategory } from '../types/bitrefill';

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
    (set) => ({
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
    }),
    {
      name: 'app-store',
    }
  )
); 