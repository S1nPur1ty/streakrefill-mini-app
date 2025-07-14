import React, { useState } from 'react';
import { Gift, Target, Star } from 'phosphor-react';
import { CouponCard } from '../components';
import { useAppStore } from '../stores';
import { CouponCategory } from '../types/coupon';

export const Rewards = () => {
  const { coupons, getCouponsByCategory, addCoupon } = useAppStore();
  const [activeCategory, setActiveCategory] = useState<CouponCategory>('spinning wheel win coupons');

  const categories: Array<{
    id: CouponCategory;
    label: string;
    icon: React.ReactNode;
    description: string;
  }> = [
    {
      id: 'spinning wheel win coupons',
      label: 'Spinning Wheel Wins',
      icon: <Gift size={20} />,
      description: 'Coupons won from the spinning wheel'
    },
    {
      id: 'milestone coupons',
      label: 'Milestone Rewards',
      icon: <Target size={20} />,
      description: 'Rewards for reaching milestones'
    },
    {
      id: 'other',
      label: 'Other Rewards',
      icon: <Star size={20} />,
      description: 'Special promotions and bonuses'
    }
  ];

  const activeCategoryCoupons = getCouponsByCategory(activeCategory);

  // Demo function to add sample coupons
  const addSampleCoupons = () => {
    const sampleCoupons = [
      {
        id: `milestone-${Date.now()}-1`,
        title: '25% OFF',
        description: 'Milestone reward for 10 purchases',
        discountPercent: 25,
        validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        type: 'milestone' as const,
        category: 'milestone coupons' as const,
        isUsed: false,
        isSelected: false,
        code: `MILE${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        color: '#fdb022',
        icon: '🏆',
        minPurchase: 100
      },
      {
        id: `other-${Date.now()}-2`,
        title: 'Welcome Bonus',
        description: 'Special welcome offer',
        discountPercent: 15,
        discountValue: 20,
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        type: 'other' as const,
        category: 'other' as const,
        isUsed: false,
        isSelected: false,
        code: `WELCOME${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        color: '#854CFF',
        icon: '🎊'
      }
    ];

    sampleCoupons.forEach(coupon => addCoupon(coupon));
  };

  return (
    <div className="flex-1 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Your Rewards</h1>
          <p className="text-gray-400">Manage your discount coupons and rewards</p>
        </div>

        {/* Category Tabs */}
        <div className="mb-6">
          <div className="flex space-x-2 bg-gray-800 rounded-lg p-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-primary text-black'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {category.icon}
                <span className="hidden sm:inline">{category.label}</span>
                <span className="sm:hidden">{category.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Category Description */}
        <div className="mb-6 text-center">
          <p className="text-gray-400">
            {categories.find(c => c.id === activeCategory)?.description}
          </p>
        </div>

        {/* Coupons Grid */}
        {activeCategoryCoupons.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeCategoryCoupons.map((coupon) => (
              <CouponCard key={coupon.id} coupon={coupon} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 opacity-50">
              {activeCategory === 'spinning wheel win coupons' ? '🎰' : 
               activeCategory === 'milestone coupons' ? '🏆' : '⭐'}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No {categories.find(c => c.id === activeCategory)?.label} Yet
            </h3>
            <p className="text-gray-400 mb-6">
              {activeCategory === 'spinning wheel win coupons' 
                ? 'Spin the wheel to earn discount coupons!' 
                : activeCategory === 'milestone coupons'
                ? 'Complete milestones to unlock special rewards'
                : 'Check back for special promotions and bonuses'}
            </p>
            
            {/* Demo button for milestone and other categories */}
            {activeCategory !== 'spinning wheel win coupons' && (
              <button
                onClick={addSampleCoupons}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Add Sample Coupons (Demo)
              </button>
            )}
          </div>
        )}

        {/* Selected Coupon Summary */}
        {coupons.some(c => c.isSelected) && (
          <div className="mt-8 bg-primary/10 border border-primary/30 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <span className="text-black text-sm">✓</span>
              </div>
              <span className="text-white font-semibold">
                Selected coupon will appear in the header
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 