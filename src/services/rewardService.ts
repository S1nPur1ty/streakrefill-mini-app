import { supabase, getErrorMessage } from '../lib';
import { Reward } from '../types/database';

export const rewardService = {
  /**
   * Get user rewards
   */
  async getUserRewards(userId: string): Promise<Reward[]> {
    try {
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .eq('user_id', userId)
        .order('created', { ascending: false });

      if (error) {
        console.error('Error getting user rewards:', getErrorMessage(error));
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserRewards:', getErrorMessage(error));
      return [];
    }
  },

  /**
   * Create a new spin reward
   */
  async createSpinReward(
    userId: string, 
    amount: number, 
    name: string, 
    rarity: string,
    color?: string
  ): Promise<Reward | null> {
    try {
      const reward: Omit<Reward, 'id' | 'created'> = {
        user_id: userId,
        reward_type: 'spin',
        name,
        amount,
        rarity,
        color,
        received_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('rewards')
        .insert(reward)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error creating spin reward:', getErrorMessage(error));
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in createSpinReward:', getErrorMessage(error));
      return null;
    }
  },

  /**
   * Create a new streak reward
   */
  async createStreakReward(
    userId: string,
    amount: number,
    milestone: number,
    status: string = 'claimable'
  ): Promise<Reward | null> {
    try {
      const reward: Omit<Reward, 'id' | 'created'> = {
        user_id: userId,
        reward_type: 'streak',
        name: `${milestone}-Day Streak Bonus`,
        amount,
        milestone,
        status,
        received_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('rewards')
        .insert(reward)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error creating streak reward:', getErrorMessage(error));
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in createStreakReward:', getErrorMessage(error));
      return null;
    }
  },

  /**
   * Update reward status
   */
  async updateRewardStatus(rewardId: string, status: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('rewards')
        .update({ status })
        .eq('id', rewardId);

      if (error) {
        console.error('Error updating reward status:', getErrorMessage(error));
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateRewardStatus:', getErrorMessage(error));
      return false;
    }
  },

  /**
   * Mark a reward as used
   */
  async useReward(rewardId: string): Promise<boolean> {
    return this.updateRewardStatus(rewardId, 'used');
  },

  /**
   * Get claimable rewards
   */
  async getClaimableRewards(userId: string): Promise<Reward[]> {
    try {
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'claimable')
        .order('created', { ascending: false });

      if (error) {
        console.error('Error getting claimable rewards:', getErrorMessage(error));
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getClaimableRewards:', getErrorMessage(error));
      return [];
    }
  }
}; 