import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

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
  
  // Gift Cards (for future use)
  selectedGiftCardCategory: string;
  setGiftCardCategory: (category: string) => void;
  
  // Scoreboard (for future use)
  userXP: number;
  userScore: number;
  addXP: (amount: number) => void;
  addScore: (amount: number) => void;
}

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