import { supabase, getErrorMessage } from '../lib';
import { User, Wallet } from '../types/database';

export const userService = {
  /**
   * Get user by wallet address
   */
  async getUserByWallet(address: string): Promise<User | null> {
    try {
      // First, find the wallet
      const { data: wallets, error: walletError } = await supabase
        .from('wallets')
        .select('user_id')
        .eq('address', address.toLowerCase())
        .limit(1)
        .maybeSingle();

      if (walletError) {
        console.error('Error finding wallet:', getErrorMessage(walletError));
        return null;
      }

      if (!wallets) {
        return null;
      }

      // Then get the user
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', wallets.user_id)
        .limit(1)
        .maybeSingle();

      if (userError) {
        console.error('Error finding user:', getErrorMessage(userError));
        return null;
      }

      return user;
    } catch (error) {
      console.error('Error in getUserByWallet:', getErrorMessage(error));
      return null;
    }
  },

  /**
   * Create a new user with wallet
   */
  async createUserWithWallet(address: string): Promise<User | null> {
    try {
      // Create user
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          connected: true,
          username: `user_${Math.random().toString(36).substring(2, 9)}`, // Default username
        })
        .select()
        .maybeSingle();

      if (userError) {
        console.error('Error creating user:', getErrorMessage(userError));
        return null;
      }

      // Create wallet linked to user
      const { error: walletError } = await supabase
        .from('wallets')
        .insert({
          user_id: newUser.id,
          address: address.toLowerCase(),
          chain: 'ethereum',
          verified: true,
          is_primary: true,
        });

      if (walletError) {
        console.error('Error creating wallet:', getErrorMessage(walletError));
        // Attempt to delete the created user since wallet creation failed
        await supabase.from('users').delete().eq('id', newUser.id);
        return null;
      }

      // Create initial stats
      const { error: statsError } = await supabase
        .from('stats')
        .insert({
          user_id: newUser.id,
          level: 1,
          xp: 0,
          achievements: [],
          spins_won: 0,
          best_spin: 0,
        });

      if (statsError) {
        console.error('Error creating stats:', getErrorMessage(statsError));
      }

      // Create initial streak
      const { error: streakError } = await supabase
        .from('streaks')
        .insert({
          user_id: newUser.id,
          current: 0,
          best: 0,
          freezes_used: 0,
          multiplier: 1,
        });

      if (streakError) {
        console.error('Error creating streak:', getErrorMessage(streakError));
      }

      return newUser;
    } catch (error) {
      console.error('Error in createUserWithWallet:', getErrorMessage(error));
      return null;
    }
  },

  /**
   * Get or create user by wallet address
   */
  async getOrCreateUserByWallet(address: string): Promise<User | null> {
    const existingUser = await this.getUserByWallet(address);
    if (existingUser) {
      return existingUser;
    }
    
    return await this.createUserWithWallet(address);
  },

  /**
   * Update user information
   */
  async updateUser(userId: string, updates: Partial<Omit<User, 'id' | 'created' | 'updated'>>): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error updating user:', getErrorMessage(error));
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in updateUser:', getErrorMessage(error));
      return null;
    }
  },

  /**
   * Get all wallets for a user
   */
  async getUserWallets(userId: string): Promise<Wallet[]> {
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error getting user wallets:', getErrorMessage(error));
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserWallets:', getErrorMessage(error));
      return [];
    }
  },
}; 