// Clean TypeScript interfaces for database tables

export interface User {
  id: string;
  farcaster_id?: string;
  bitrefill_id?: string;
  email?: string;
  username?: string;
  avatar?: string;
  connected: boolean;
  created: string;
  updated: string;
}

export interface Stats {
  id: string;
  user_id: string;
  level: number;
  xp: number;
  achievements: string[];
  favorite_category?: string;
  spins_won: number;
  best_spin: number;
  created: string;
  updated: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  name?: string;
  category?: string;
  order_id?: string;
  xp: number;
  purchased: string;
  created: string;
}

export interface Streak {
  id: string;
  user_id: string;
  current: number;
  best: number;
  last_purchase?: string;
  freezes_used: number;
  multiplier: number;
  created: string;
  updated: string;
}

export interface Reward {
  id: string;
  user_id: string;
  reward_type: 'streak' | 'spin';
  name?: string;
  amount: number;
  milestone?: number; // for streak rewards
  rarity?: string; // for spin rewards
  color?: string; // for spin rewards
  status?: string; // for streak rewards
  received_at: string;
  created: string;
}

export interface SpinLimit {
  id: string;
  user_id: string;
  date: string;
  used: number;
  max_spins: number;
  purchase_amount: number;
  created: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  address: string;
  chain: string;
  type?: string;
  verified: boolean;
  is_primary: boolean;
  created: string;
  updated: string;
}

// Database types for Supabase
export type Database = {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created' | 'updated'>;
        Update: Partial<Omit<User, 'id' | 'created' | 'updated'>>;
      };
      stats: {
        Row: Stats;
        Insert: Omit<Stats, 'id' | 'created' | 'updated'>;
        Update: Partial<Omit<Stats, 'id' | 'created' | 'updated'>>;
      };
      purchases: {
        Row: Purchase;
        Insert: Omit<Purchase, 'id' | 'created'>;
        Update: Partial<Omit<Purchase, 'id' | 'created'>>;
      };
      streaks: {
        Row: Streak;
        Insert: Omit<Streak, 'id' | 'created' | 'updated'>;
        Update: Partial<Omit<Streak, 'id' | 'created' | 'updated'>>;
      };
      rewards: {
        Row: Reward;
        Insert: Omit<Reward, 'id' | 'created'>;
        Update: Partial<Omit<Reward, 'id' | 'created'>>;
      };
      spin_limits: {
        Row: SpinLimit;
        Insert: Omit<SpinLimit, 'id' | 'created'>;
        Update: Partial<Omit<SpinLimit, 'id' | 'created'>>;
      };
      wallets: {
        Row: Wallet;
        Insert: Omit<Wallet, 'id' | 'created' | 'updated'>;
        Update: Partial<Omit<Wallet, 'id' | 'created' | 'updated'>>;
      };
    };
    Views: {};
    Functions: {};
  };
}; 