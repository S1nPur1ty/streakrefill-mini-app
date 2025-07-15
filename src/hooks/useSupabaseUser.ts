import { useState, useEffect, useCallback } from 'react';
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

  // Function to refresh all user data
  const refreshData = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);

    try {
      // Use Promise.all to fetch data in parallel
      const [userStats, userStreak, userRewards, userPurchases, spinRewards, userSpinLimit] = await Promise.all([
        statsService.getUserStats(user.id),
        streakService.getUserStreak(user.id),
        streakService.getUserStreakRewards(user.id),
        purchaseService.getUserPurchases(user.id, 5),
        rewardService.getUserRewards(user.id),
        purchaseService.getTodaySpinLimits(user.id)
      ]);
      
      // Update all state at once to minimize re-renders
      setStats(userStats);
      setStreak(userStreak);
      setRewards(userRewards);
      setPurchases(userPurchases);
      setSpinLimit(userSpinLimit);
      
      // Sync spin rewards to app store
      syncRewardsFromSupabase(spinRewards);
      
      // Update spinner tickets in global store
      if (userSpinLimit) {
        const remainingSpins = Math.max(0, userSpinLimit.max_spins - userSpinLimit.used);
        setSpinnerTickets(remainingSpins);
      }
      
      return { success: true };
    } catch (err) {
      console.error('Error refreshing user data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred while refreshing');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, [user, syncRewardsFromSupabase, setSpinnerTickets]);

  // Fetch user data when address changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (!address || !isConnected) {
        setUser(null);
        setStats(null);
        setStreak(null);
        setRewards([]);
        setPurchases([]);
        setSpinLimit(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Get or create user by wallet address
        const userData = await userService.getOrCreateUserByWallet(address);
        
        if (!userData) {
          throw new Error('Failed to get or create user');
        }

        setUser(userData);
        
        // Use Promise.all to fetch data in parallel
        const [userStats, userStreak, userRewards, userPurchases, spinRewards, userSpinLimit] = await Promise.all([
          statsService.getUserStats(userData.id),
          streakService.getUserStreak(userData.id),
          streakService.getUserStreakRewards(userData.id),
          purchaseService.getUserPurchases(userData.id, 5),
          rewardService.getUserRewards(userData.id),
          purchaseService.getTodaySpinLimits(userData.id)
        ]);
        
        // Update all state at once
        setStats(userStats);
        setStreak(userStreak);
        setRewards(userRewards);
        setPurchases(userPurchases);
        setSpinLimit(userSpinLimit);
        
        // Sync spin rewards to app store
        syncRewardsFromSupabase(spinRewards);
        
        // Update spinner tickets in global store
        if (userSpinLimit) {
          const remainingSpins = Math.max(0, userSpinLimit.max_spins - userSpinLimit.used);
          setSpinnerTickets(remainingSpins);
        }

        // Update store with connected status
        setWalletInfo(true, address);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [address, isConnected, setWalletInfo, syncRewardsFromSupabase, setSpinnerTickets]);

  // Function to create a purchase and update user data
  const createPurchase = async (
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
        // Refresh user data
        await refreshData();
        return purchase;
      }
      return null;
    } catch (err) {
      console.error('Error creating purchase:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      return null;
    }
  };

  // Function to check if user can spin today
  const canSpin = async () => {
    if (!user) {
      return false;
    }

    try {
      const spinLimit = await purchaseService.getTodaySpinLimits(user.id);
      if (!spinLimit) {
        return false;
      }

      return spinLimit.used < spinLimit.max_spins;
    } catch (err) {
      console.error('Error checking spin eligibility:', err);
      return false;
    }
  };

  // Function to get today's spin limit
  const getSpinLimit = useCallback(async () => {
    if (!user) return null;
    
    try {
      const limit = await purchaseService.getTodaySpinLimits(user.id);
      setSpinLimit(limit);
      
      // Update spinner tickets in global store
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

  // Function to use a spin
  const useSpin = async () => {
    if (!user) {
      return false;
    }

    const success = await purchaseService.useSpinTicket(user.id);
    
    // Update local spin limit after using a ticket
    if (success) {
      await getSpinLimit();
    }
    
    return success;
  };

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