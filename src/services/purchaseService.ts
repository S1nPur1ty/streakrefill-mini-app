import { supabase, getErrorMessage, getCurrentDateString } from '../lib';
import { streakService } from './streakService';
import { statsService } from './statsService';
import { Purchase, SpinLimit } from '../types/database';

export const purchaseService = {
  /**
   * Create a new purchase record
   */
  async createPurchase(
    userId: string, 
    amount: number, 
    currency: string, 
    name?: string, 
    category?: string, 
    orderId?: string
  ): Promise<Purchase | null> {
    try {
      // Calculate XP earned (1 XP per dollar spent)
      const xpEarned = Math.floor(amount);

      // Create purchase record
      const purchase: Omit<Purchase, 'id' | 'created'> = {
        user_id: userId,
        amount,
        currency,
        name,
        category,
        order_id: orderId,
        xp: xpEarned,
        purchased: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('purchases')
        .insert(purchase)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error creating purchase:', getErrorMessage(error));
        return null;
      }

      // Update user streak
      await streakService.updateStreakAfterPurchase(userId);

      // Add XP to user stats
      await statsService.addUserXP(userId, xpEarned);

      // Update spin limits for today
      await this.updateSpinLimitsAfterPurchase(userId, amount);

      return data;
    } catch (error) {
      console.error('Error in createPurchase:', getErrorMessage(error));
      return null;
    }
  },

  /**
   * Get user purchase history
   */
  async getUserPurchases(userId: string, limit: number = 10): Promise<Purchase[]> {
    try {
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .eq('user_id', userId)
        .order('purchased', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error getting user purchases:', getErrorMessage(error));
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserPurchases:', getErrorMessage(error));
      return [];
    }
  },

  /**
   * Update spin limits after a purchase
   */
  async updateSpinLimitsAfterPurchase(userId: string, amount: number): Promise<void> {
    try {
      const today = getCurrentDateString();
      
      // Calculate tickets earned (1 ticket per $50 spent)
      const ticketsEarned = Math.floor(amount / 50);
      
      if (ticketsEarned <= 0) {
        return; // No tickets earned from this purchase
      }

      // Check if we already have a spin limit record for today
      const { data: existingLimit, error: checkError } = await supabase
        .from('spin_limits')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .limit(1)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Error checking spin limits:', getErrorMessage(checkError));
        return;
      }

      if (existingLimit) {
        // Update existing record - add to the max_spins, don't replace
        const newPurchaseAmount = existingLimit.purchase_amount + amount;
        const newMaxSpins = existingLimit.max_spins + ticketsEarned;
        
        const { error: updateError } = await supabase
          .from('spin_limits')
          .update({
            purchase_amount: newPurchaseAmount,
            max_spins: newMaxSpins
          })
          .eq('id', existingLimit.id);

        if (updateError) {
          console.error('Error updating spin limits:', getErrorMessage(updateError));
        }
      } else {
        // Create new record for today
        const { error: insertError } = await supabase
          .from('spin_limits')
          .insert({
            user_id: userId,
            date: today,
            used: 0,
            max_spins: ticketsEarned,
            purchase_amount: amount
          });

        if (insertError) {
          console.error('Error creating spin limits:', getErrorMessage(insertError));
        }
      }
    } catch (error) {
      console.error('Error in updateSpinLimitsAfterPurchase:', getErrorMessage(error));
    }
  },

  /**
   * Get user's spin limits for today
   */
  async getTodaySpinLimits(userId: string): Promise<SpinLimit | null> {
    try {
      const today = getCurrentDateString();
      
      const { data, error } = await supabase
        .from('spin_limits')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .limit(1)
        .maybeSingle();

      if (error) {
        if (error.code === 'PGRST116') { // No records found
          // Create a default record with no spins available
          // Check if user has any purchase history
          const { data: purchases } = await supabase
            .from('purchases')
            .select('amount')
            .eq('user_id', userId)
            .order('purchased', { ascending: false })
            .limit(10);
            
          // Calculate total purchase amount for the last 10 purchases
          const totalAmount = purchases?.reduce((sum, p) => sum + p.amount, 0) || 0;
          
          // Create a new spin limit record with default values
          // If they have purchase history, give them some initial tickets
          const initialTickets = Math.min(3, Math.floor(totalAmount / 100));
          
          const newLimit = {
            user_id: userId,
            date: today,
            used: 0,
            max_spins: initialTickets,
            purchase_amount: 0,
            created: new Date().toISOString()
          };
          
          // Insert the new record
          const { data: newData, error: insertError } = await supabase
            .from('spin_limits')
            .insert(newLimit)
            .select()
            .maybeSingle();
            
          if (insertError) {
            console.error('Error creating new spin limit:', getErrorMessage(insertError));
            return {
              id: 'default',
              user_id: userId,
              date: today,
              used: 0,
              max_spins: 0,
              purchase_amount: 0,
              created: new Date().toISOString()
            };
          }
          
          return newData;
        }
        
        console.error('Error getting spin limits:', getErrorMessage(error));
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getTodaySpinLimits:', getErrorMessage(error));
      return null;
    }
  },

  /**
   * Use a spin
   */
  async useSpinTicket(userId: string): Promise<boolean> {
    try {
      const today = getCurrentDateString();
      
      // Get today's spin limit
      const { data: spinLimit, error: limitError } = await supabase
        .from('spin_limits')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .limit(1)
        .maybeSingle();

      if (limitError) {
        console.error('Error getting spin limits:', getErrorMessage(limitError));
        return false;
      }

      // Check if user can spin
      if (!spinLimit || spinLimit.used >= spinLimit.max_spins) {
        return false;
      }

      // Update spin count
      const { error: updateError } = await supabase
        .from('spin_limits')
        .update({
          used: spinLimit.used + 1
        })
        .eq('id', spinLimit.id);

      if (updateError) {
        console.error('Error updating spin count:', getErrorMessage(updateError));
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in useSpinTicket:', getErrorMessage(error));
      return false;
    }
  }
}; 