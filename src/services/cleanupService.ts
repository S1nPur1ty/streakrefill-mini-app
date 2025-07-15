import { supabase } from '../lib';

/**
 * Client-side service to clean up user data
 * Handles errors gracefully and provides a consistent interface
 */
export const cleanupService = {
  /**
   * Clean up all user data from the database
   */
  async cleanupUserData(userId: string): Promise<boolean> {
    try {
      // Check if Supabase client is configured properly
      if (!supabase) {
        console.error('Supabase client is not properly configured');
        return false;
      }

      // Delete user's spin limits
      try {
        await supabase
          .from('spin_limits')
          .delete()
          .eq('user_id', userId);
      } catch (err) {
        console.error('Failed to delete spin limits', err);
      }
      
      // Delete user's purchases
      try {
        await supabase
          .from('purchases')
          .delete()
          .eq('user_id', userId);
      } catch (err) {
        console.error('Failed to delete purchases', err);
      }
      
      // Delete user's rewards
      try {
        await supabase
          .from('rewards')
          .delete()
          .eq('user_id', userId);
      } catch (err) {
        console.error('Failed to delete rewards', err);
      }

      // Handle user's wallets - delete and recreate primary
      try {
        // Get primary wallet first
        const { data: wallets } = await supabase
          .from('wallets')
          .select('id, address')
          .eq('user_id', userId);
        
        const primaryWallet = wallets && wallets.length > 0 ? wallets[0] : null;
        
        // Delete all wallets
        await supabase
          .from('wallets')
          .delete()
          .eq('user_id', userId);
        
        // Recreate primary wallet if needed
        if (primaryWallet) {
          await supabase
            .from('wallets')
            .insert({
              user_id: userId,
              address: primaryWallet.address,
              chain: 'ethereum',
              verified: true,
              is_primary: true
            });
        }
      } catch (err) {
        console.error('Failed to handle wallets', err);
      }
      
      // Reset streak data
      try {
        // First try to delete any existing streak
        await supabase
          .from('streaks')
          .delete()
          .eq('user_id', userId);
        
        // Create new streak record
        await supabase
          .from('streaks')
          .insert({
            user_id: userId,
            current: 0,
            best: 0,
            freezes_used: 0,
            multiplier: 1
          });
      } catch (err) {
        console.error('Failed to reset streak', err);
      }
      
      // Reset stats data
      try {
        // Delete all stats for user
        await supabase
          .from('stats')
          .delete()
          .eq('user_id', userId);
        
        // Create new stats record
        await supabase
          .from('stats')
          .insert({
            user_id: userId,
            level: 1,
            xp: 0,
            achievements: [],
            spins_won: 0,
            best_spin: 0
          });
      } catch (err) {
        console.error('Failed to reset stats', err);
      }
      
      console.log('✅ User data cleanup complete');
      return true;
    } catch (error) {
      console.error('Error in cleanup process:', error);
      return false;
    }
  }
}; 