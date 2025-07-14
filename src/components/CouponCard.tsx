import React from 'react';
import { Check, Clock } from 'phosphor-react';
import { Coupon } from '../types/coupon';
import { useAppStore } from '../stores';

interface CouponCardProps {
  coupon: Coupon;
}

export const CouponCard: React.FC<CouponCardProps> = ({ coupon }) => {
  const { selectCoupon, unselectCoupon } = useAppStore();

  const handleSelect = () => {
    if (coupon.isSelected) {
      unselectCoupon();
    } else {
      selectCoupon(coupon.id);
    }
  };

  const formatExpiryDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const isExpired = new Date() > coupon.validUntil;
  const isExpiringSoon = !isExpired && 
    (coupon.validUntil.getTime() - Date.now()) < 7 * 24 * 60 * 60 * 1000; // 7 days

  return (
    <div 
      className={`relative bg-gray-800 rounded-xl p-4 border-2 transition-all duration-200 cursor-pointer ${
        coupon.isSelected 
          ? 'border-primary shadow-lg shadow-primary/20' 
          : isExpired 
          ? 'border-gray-600 opacity-50' 
          : 'border-gray-700 hover:border-gray-600'
      }`}
      onClick={handleSelect}
      style={{
        background: coupon.isSelected 
          ? `linear-gradient(135deg, ${coupon.color}15, transparent)`
          : undefined
      }}
    >
      {/* Selection Indicator */}
      {coupon.isSelected && (
        <div className="absolute top-3 right-3">
          <div className="bg-primary rounded-full p-1">
            <Check size={14} className="text-black" />
          </div>
        </div>
      )}

      {/* Coupon Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
            style={{ backgroundColor: `${coupon.color}20`, color: coupon.color }}
          >
            {coupon.icon || '🎁'}
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">{coupon.title}</h3>
            <p className="text-gray-400 text-sm">{coupon.description}</p>
          </div>
        </div>
      </div>

      {/* Discount Value */}
      <div className="mb-3">
        {coupon.discountValue ? (
          <div className="text-2xl font-bold text-primary">
            {coupon.title === "Free Shipping" ? "FREE SHIPPING" : `$${coupon.discountValue} OFF`}
          </div>
        ) : (
          <div className="text-2xl font-bold text-primary">
            {coupon.discountPercent}% OFF
          </div>
        )}
      </div>

      {/* Coupon Code */}
      <div className="bg-gray-900 rounded-lg p-3 mb-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Code:</span>
          <span className="text-white font-mono font-semibold tracking-wider">
            {coupon.code}
          </span>
        </div>
      </div>

      {/* Conditions */}
      {(coupon.minPurchase || coupon.maxDiscount) && (
        <div className="text-xs text-gray-500 mb-3 space-y-1">
          {coupon.minPurchase && (
            <div>• Minimum purchase: ${coupon.minPurchase}</div>
          )}
          {coupon.maxDiscount && (
            <div>• Maximum discount: ${coupon.maxDiscount}</div>
          )}
        </div>
      )}

      {/* Expiry */}
      <div className="flex items-center justify-between">
        <div className={`flex items-center space-x-1 text-sm ${
          isExpired ? 'text-red-400' : isExpiringSoon ? 'text-yellow-400' : 'text-gray-400'
        }`}>
          <Clock size={14} />
          <span>
            {isExpired ? 'Expired' : 'Expires'} {formatExpiryDate(coupon.validUntil)}
          </span>
        </div>

        {/* Category Badge */}
        <div className="bg-gray-700 px-2 py-1 rounded text-xs text-gray-300">
          {coupon.type === 'spinning_wheel' ? 'Spin Win' : 
           coupon.type === 'milestone' ? 'Milestone' : 'Other'}
        </div>
      </div>

      {/* Overlay for expired coupons */}
      {isExpired && (
        <div className="absolute inset-0 bg-gray-900/50 rounded-xl flex items-center justify-center">
          <span className="text-red-400 font-semibold">EXPIRED</span>
        </div>
      )}
    </div>
  );
}; 