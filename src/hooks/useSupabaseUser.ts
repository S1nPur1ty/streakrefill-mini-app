import { useState, useEffect, useCallback, useRef } from 'react';
import { useAccount } from 'wagmi';
import { useAppStore } from '../stores/useAppStore';
import { userService } from '../services/userService';
import { streakService } from '../services/streakService';
import { statsService } from '../services/statsService';
import { purchaseService } from '../services/purchaseService';
import { rewardService } from '../services/rewardService';
import { User, Stats, Streak, Reward, Purchase, SpinLimit } from '../types/database';

export const useSupabaseUser = () => {
  const { address, isConnected } = useAccount();
  const { setWalletInfo, syncRewardsFromSupabase, setSpinnerTickets } = useAppStore();
  
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [streak, setStreak] = useState<Streak | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [spinLimit, setSpinLimit] = useState<SpinLimit | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Prevent duplicate fetches
  const isFetchingRef = useRef(false);
  const currentAddressRef = useRef<string | null>(null);

  // Main data fetching effect - ONLY runs when address/connection changes
  useEffect(() => {
    const fetchUserData = async () => {
      // Handle disconnection
      if (!address || !isConnected) {
        setUser(null);
        setStats(null);
        setStreak(null);
        setRewards([]);
        setPurchases([]);
        setSpinLimit(null);
        setLoading(false);
        setError(null);
        currentAddressRef.current = null;
        isFetchingRef.current = false;
        return;
      }

      // Prevent duplicate calls for same address
      if (isFetchingRef.current || currentAddressRef.current === address) {
        return;
      }

      isFetchingRef.current = true;
      currentAddressRef.current = address;
      setLoading(true);
      setError(null);

      try {
        console.log(`🔄 Fetching user data for: ${address}`);
        
        // Get or create user
        const userData = await userService.getOrCreateUserByWallet(address);
        if (!userData) {
          throw new Error('Failed to get or create user');
        }

        setUser(userData);

        // Fetch all data in parallel
        const [userStats, userStreak, userRewards, userPurchases, spinRewards, userSpinLimit] = await Promise.all([
          statsService.getUserStats(userData.id),
          streakService.getUserStreak(userData.id),
          streakService.getUserStreakRewards(userData.id),
          purchaseService.getUserPurchases(userData.id, 5),
          rewardService.getUserRewards(userData.id),
          purchaseService.getTodaySpinLimits(userData.id)
        ]);

        // Update all state
        setStats(userStats);
        setStreak(userStreak);
        setRewards(userRewards);
        setPurchases(userPurchases);
        setSpinLimit(userSpinLimit);

        // Update app store
        syncRewardsFromSupabase(spinRewards);
        setWalletInfo(true, address);
        
        if (userSpinLimit) {
          const remainingSpins = Math.max(0, userSpinLimit.max_spins - userSpinLimit.used);
          setSpinnerTickets(remainingSpins);
        }

        console.log(`✅ Successfully loaded data for: ${address}`);
      } catch (err) {
        console.error('❌ Error fetching user data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load user data');
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    };

    fetchUserData();
  }, [address, isConnected, setWalletInfo, syncRewardsFromSupabase, setSpinnerTickets]);

  // Simple refresh function - no complex dependencies
  const refreshData = useCallback(async () => {
    if (!user || isFetchingRef.current) {
      return { success: false };
    }

    try {
      // Just refetch the spin limit and rewards - most commonly updated data
      const [spinRewards, userSpinLimit] = await Promise.all([
        rewardService.getUserRewards(user.id),
        purchaseService.getTodaySpinLimits(user.id)
      ]);

      setSpinLimit(userSpinLimit);
      syncRewardsFromSupabase(spinRewards);
      
      if (userSpinLimit) {
        const remainingSpins = Math.max(0, userSpinLimit.max_spins - userSpinLimit.used);
        setSpinnerTickets(remainingSpins);
      }

      return { success: true };
    } catch (err) {
      console.error('Error refreshing data:', err);
      return { success: false, error: err };
    }
  }, [user, syncRewardsFromSupabase, setSpinnerTickets]);

  // Simple spin limit getter
  const getSpinLimit = useCallback(async () => {
    if (!user) return null;
    
    try {
      const limit = await purchaseService.getTodaySpinLimits(user.id);
      setSpinLimit(limit);
      
      if (limit) {
        const remainingSpins = Math.max(0, limit.max_spins - limit.used);
        setSpinnerTickets(remainingSpins);
      }
      
      return limit;
    } catch (err) {
      console.error('Error getting spin limit:', err);
      return null;
    }
  }, [user, setSpinnerTickets]);

  // Simple spin function
  const useSpin = useCallback(async () => {
    if (!user) return false;

    try {
      const success = await purchaseService.useSpinTicket(user.id);
      
      if (success) {
        // Update spin limit immediately
        await getSpinLimit();
      }
      
      return success;
    } catch (err) {
      console.error('Error using spin:', err);
      return false;
    }
  }, [user, getSpinLimit]);

  // Simple purchase creation
  const createPurchase = useCallback(async (
    amount: number, 
    currency: string = 'USD', 
    name?: string, 
    category?: string
  ) => {
    if (!user) {
      setError('No user found');
      return null;
    }

    try {
      const purchase = await purchaseService.createPurchase(
        user.id, 
        amount, 
        currency, 
        name, 
        category
      );

      if (purchase) {
        await refreshData();
        return purchase;
      }
      return null;
    } catch (err) {
      console.error('Error creating purchase:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      return null;
    }
  }, [user, refreshData]);

  // Simple can spin check
  const canSpin = useCallback(async () => {
    if (!user) return false;

    try {
      const limit = await purchaseService.getTodaySpinLimits(user.id);
      return limit ? limit.used < limit.max_spins : false;
    } catch (err) {
      console.error('Error checking spin eligibility:', err);
      return false;
    }
  }, [user]);

  return {
    user,
    stats,
    streak,
    rewards,
    purchases,
    spinLimit,
    loading,
    error,
    createPurchase,
    canSpin,
    useSpin,
    refreshData,
    getSpinLimit
  };
};