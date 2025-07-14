export type CouponType = 'spinning_wheel' | 'milestone' | 'other';

export type CouponCategory = 'spinning wheel win coupons' | 'milestone coupons' | 'other';

export interface Coupon {
  id: string;
  title: string;
  description: string;
  discountPercent: number;
  discountValue?: number; // Fixed amount discount
  validUntil: Date;
  type: CouponType;
  category: CouponCategory;
  isUsed: boolean;
  isSelected: boolean;
  code: string;
  minPurchase?: number;
  maxDiscount?: number;
  icon?: string; // Icon name or emoji
  color: string; // Color theme for the coupon
}

export interface SpinnerPrize {
  text: string;
  coupon?: Coupon;
  isInstantWin: boolean;
  probability: number;
  color: string;
}

export interface SpinnerResult {
  prize: SpinnerPrize;
  timestamp: Date;
  spinId: string;
} 