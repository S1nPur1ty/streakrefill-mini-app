import { supabase, getErrorMessage } from '../lib';
import { Stats } from '../types/database'; 

export const statsService = {
  /**
   * Get user stats
   */
  async getUserStats(userId: string): Promise<Stats | null> {
    try {
      const { data, error } = await supabase
        .from('stats')
        .select('*')
        .eq('user_id', userId)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error getting user stats:', getErrorMessage(error));
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getUserStats:', getErrorMessage(error));
      return null;
    }
  },

  /**
   * Add XP to user stats and handle level-ups
   */
  async addUserXP(userId: string, xpAmount: number): Promise<Stats | null> {
    try {
      // Get current stats
      const stats = await this.getUserStats(userId);
      
      if (!stats) {
        console.error('No stats found for user:', userId);
        return null;
      }

      // Calculate new XP and potential level up
      const newXP = stats.xp + xpAmount;
      let newLevel = stats.level;
      
      // Simple level calculation: level = 1 + floor(xp / 1000)
      // Each level requires 1000 XP
      const potentialLevel = 1 + Math.floor(newXP / 1000);
      
      if (potentialLevel > newLevel) {
        newLevel = potentialLevel;
        // Could trigger level-up rewards here
      }

      // Update stats
      const { data, error } = await supabase
        .from('stats')
        .update({
          xp: newXP,
          level: newLevel
        })
        .eq('user_id', userId)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error updating user stats:', getErrorMessage(error));
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in addUserXP:', getErrorMessage(error));
      return null;
    }
  },

  /**
   * Update achievement for user
   */
  async addAchievement(userId: string, achievement: string): Promise<boolean> {
    try {
      // Get current stats
      const stats = await this.getUserStats(userId);
      
      if (!stats) {
        console.error('No stats found for user:', userId);
        return false;
      }

      // Check if achievement already exists
      if (stats.achievements.includes(achievement)) {
        return true; // Already has this achievement
      }

      // Add achievement
      const updatedAchievements = [...stats.achievements, achievement];
      
      const { error } = await supabase
        .from('stats')
        .update({
          achievements: updatedAchievements
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating achievements:', getErrorMessage(error));
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in addAchievement:', getErrorMessage(error));
      return false;
    }
  },

  /**
   * Record a spin win
   */
  async recordSpinWin(userId: string, winValue: number): Promise<boolean> {
    try {
      // Get current stats
      const stats = await this.getUserStats(userId);
      
      if (!stats) {
        console.error('No stats found for user:', userId);
        return false;
      }

      const updates: Partial<Stats> = {
        spins_won: stats.spins_won + 1
      };

      // Update best spin if this one is better
      if (winValue > stats.best_spin) {
        updates.best_spin = winValue;
      }

      const { error } = await supabase
        .from('stats')
        .update(updates)
        .eq('user_id', userId);

      if (error) {
        console.error('Error recording spin win:', getErrorMessage(error));
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in recordSpinWin:', getErrorMessage(error));
      return false;
    }
  },

  /**
   * Update user's favorite category
   */
  async updateFavoriteCategory(userId: string, category: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('stats')
        .update({
          favorite_category: category
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating favorite category:', getErrorMessage(error));
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateFavoriteCategory:', getErrorMessage(error));
      return false;
    }
  }
}; 