import { supabase, getErrorMessage, getCurrentDateString, getCurrentDate } from '../lib';
import { Streak, Reward } from '../types/database';

export const streakService = {
  /**
   * Get user streak
   */
  async getUserStreak(userId: string): Promise<Streak | null> {
    try {
      const { data, error } = await supabase
        .from('streaks')
        .select('*')
        .eq('user_id', userId)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error getting user streak:', getErrorMessage(error));
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getUserStreak:', getErrorMessage(error));
      return null;
    }
  },

  /**
   * Update user streak after purchase
   */
  async updateStreakAfterPurchase(userId: string): Promise<Streak | null> {
    try {
      // Get current streak
      const streak = await this.getUserStreak(userId);
      if (!streak) {
        console.error('No streak found for user:', userId);
        return null;
      }

      const today = getCurrentDateString();
      let updateData: Partial<Streak> = {};
      let newStreak = streak.current;
      
      // If no last purchase, this is the first purchase
      if (!streak.last_purchase) {
        newStreak = 1;
        updateData = {
          current: newStreak,
          best: Math.max(streak.best, newStreak),
          last_purchase: today
        };
      } 
      // If already purchased today, streak doesn't change
      else if (streak.last_purchase === today) {
        return streak;
      } 
      else {
        // Check if the last purchase was yesterday
        const lastDate = new Date(streak.last_purchase);
        const currentDate = getCurrentDate();
        const timeDiff = currentDate.getTime() - lastDate.getTime();
        const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
        
        if (dayDiff === 1) {
          // Consecutive day, increase streak
          newStreak = streak.current + 1;
          updateData = {
            current: newStreak,
            best: Math.max(streak.best, newStreak),
            last_purchase: today
          };
        } else if (dayDiff > 1) {
          // Streak broken, reset to 1
          newStreak = 1;
          updateData = {
            current: newStreak,
            last_purchase: today
          };
        }
      }

      // Update streak in database
      const { data, error } = await supabase
        .from('streaks')
        .update(updateData)
        .eq('user_id', userId)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error updating streak:', getErrorMessage(error));
        return null;
      }

      // Check for streak milestones and create rewards
      await this.checkAndCreateStreakRewards(userId, newStreak);

      return data;
    } catch (error) {
      console.error('Error in updateStreakAfterPurchase:', getErrorMessage(error));
      return null;
    }
  },

  /**
   * Check for streak milestones and create rewards
   */
  async checkAndCreateStreakRewards(userId: string, currentStreak: number): Promise<void> {
    try {
      // Define milestone levels that should trigger rewards
      const milestones = [3, 5, 7, 10, 14, 21, 30, 60, 90];
      
      // Find the highest milestone reached
      const reachedMilestone = milestones.filter(m => currentStreak >= m).pop();
      
      if (!reachedMilestone) {
        return; // No milestone reached
      }

      // Check if this milestone reward has already been given
      const { data: existingRewards, error: checkError } = await supabase
        .from('rewards')
        .select('*')
        .eq('user_id', userId)
        .eq('reward_type', 'streak')
        .eq('milestone', reachedMilestone);

      if (checkError) {
        console.error('Error checking existing rewards:', getErrorMessage(checkError));
        return;
      }

      // If reward already given, do nothing
      if (existingRewards && existingRewards.length > 0) {
        return;
      }

      // Calculate reward amount based on milestone
      let rewardAmount = 0;
      switch (reachedMilestone) {
        case 3: rewardAmount = 5; break;
        case 5: rewardAmount = 10; break;
        case 7: rewardAmount = 20; break;
        case 10: rewardAmount = 30; break;
        case 14: rewardAmount = 50; break;
        case 21: rewardAmount = 75; break;
        case 30: rewardAmount = 100; break;
        case 60: rewardAmount = 200; break;
        case 90: rewardAmount = 300; break;
        default: rewardAmount = 10; break;
      }

      // Create the reward
      const { error: rewardError } = await supabase
        .from('rewards')
        .insert({
          user_id: userId,
          reward_type: 'streak',
          name: `${reachedMilestone}-Day Streak Bonus`,
          amount: rewardAmount,
          milestone: reachedMilestone,
          status: 'claimable',
          received_at: getCurrentDate().toISOString()
        });

      if (rewardError) {
        console.error('Error creating streak reward:', getErrorMessage(rewardError));
      }
    } catch (error) {
      console.error('Error in checkAndCreateStreakRewards:', getErrorMessage(error));
    }
  },

  /**
   * Get all streak rewards for a user
   */
  async getUserStreakRewards(userId: string): Promise<Reward[]> {
    try {
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .eq('user_id', userId)
        .eq('reward_type', 'streak')
        .order('created', { ascending: false });

      if (error) {
        console.error('Error getting streak rewards:', getErrorMessage(error));
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserStreakRewards:', getErrorMessage(error));
      return [];
    }
  },

  /**
   * Claim a streak reward
   */
  async claimStreakReward(rewardId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('rewards')
        .update({ status: 'claimed' })
        .eq('id', rewardId)
        .eq('status', 'claimable');

      if (error) {
        console.error('Error claiming streak reward:', getErrorMessage(error));
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in claimStreakReward:', getErrorMessage(error));
      return false;
    }
  }
}; 