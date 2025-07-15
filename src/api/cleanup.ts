import { createClient } from '@supabase/supabase-js';
import { Database } from '../types';

/**
 * Endpoint to clean up user data from the database
 * This is a server-side function to avoid TypeScript errors with client-side code
 */
export async function cleanupUserData(userId: string) {
  try {
    // Initialize Supabase client
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }
    
    const supabase = createClient<Database>(supabaseUrl, supabaseKey);
    
    // Delete user's spin limits
    await supabase
      .from('spin_limits')
      .delete()
      .eq('user_id', userId);
    
    // Delete user's purchases
    await supabase
      .from('purchases')
      .delete()
      .eq('user_id', userId);
    
    // Delete user's rewards
    await supabase
      .from('rewards')
      .delete()
      .eq('user_id', userId);
    
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
      // First delete any existing streak
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
    
    console.log('✅ API: User data cleanup complete');
    return { success: true };
  } catch (error) {
    console.error('Error in cleanup process:', error);
    return { success: false, error };
  }
}

// If you're using this as an API route in a framework like Next.js
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  const { userId } = req.query;
  
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }
  
  try {
    const result = await cleanupUserData(userId);
    return res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
} 