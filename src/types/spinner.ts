export interface SpinWheelData {
  option: string;
  style: {
    backgroundColor: string;
    textColor: string;
  };
}

export interface WonCoupon {
  id: string;
  type: 'discount' | 'freebie';
  value: number; // percentage for discount, fixed amount for freebie
  title: string;
  description: string;
  expiresAt: Date;
  wonAt: Date;
  used: boolean;
}

export interface PurchaseRecord {
  id: string;
  amount: number;
  date: Date;
  ticketsEarned: number;
}

export interface DailySpinLimit {
  date: string; // YYYY-MM-DD format
  ticketsUsed: number;
  maxTickets: number;
} 