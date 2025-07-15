import { useState } from 'react';
import { Gift, Clock, CheckCircle, ShoppingCart } from 'phosphor-react';
import { useAppStore } from '../stores/useAppStore';
import { WonCoupon } from '../types/spinner';
import { TabGroup } from '../components';

export const Rewards = () => {
  const { wonCoupons, selectCoupon, setActiveTab } = useAppStore();
  const [selectedTab, setSelectedTab] = useState<'active' | 'used' | 'expired'>('active');

  // Filter coupons by status
  const activeCoupons = wonCoupons.filter(
    (coupon: WonCoupon) => !coupon.used && coupon.expiresAt > new Date() && coupon.id !== 'try-again'
  );
  const usedCoupons = wonCoupons.filter(
    (coupon: WonCoupon) => coupon.used && coupon.id !== 'try-again'
  );
  const expiredCoupons = wonCoupons.filter(
    (coupon: WonCoupon) => !coupon.used && coupon.expiresAt <= new Date() && coupon.id !== 'try-again'
  );

  // Get the coupons for the current tab
  const displayedCoupons = {
    active: activeCoupons,
    used: usedCoupons,
    expired: expiredCoupons
  }[selectedTab];

  const handleSelectCoupon = (coupon: WonCoupon) => {
    selectCoupon(coupon);
    setActiveTab('home');
  };

  const CouponCard = ({ 
    coupon, 
    isUsed = false 
  }: { 
    coupon: WonCoupon, 
    isUsed?: boolean 
  }) => {
    const isExpired = coupon.expiresAt < new Date();
    
    return (
    <div className={`bg-gray-800 rounded-2xl p-4 border transition-all ${
      isUsed 
        ? 'border-gray-600 opacity-60' 
        : isExpired
          ? 'border-gray-600 opacity-70'
          : 'border-gray-700 hover:border-primary/30'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            coupon.type === 'discount' 
              ? 'bg-primary/20' 
              : 'bg-secondary/20'
          }`}>
            <Gift 
              size={24} 
              className={coupon.type === 'discount' ? 'text-primary' : 'text-secondary'} 
            />
          </div>
          <div>
            <div className={`text-2xl font-bold ${
              coupon.type === 'discount' ? 'text-primary' : 'text-secondary'
            }`}>
              {coupon.type === 'discount' ? `${coupon.value}% OFF` : `$${coupon.value} FREE`}
            </div>
            <div className="text-gray-400 text-sm">{coupon.description}</div>
          </div>
        </div>
        
        {isUsed && (
          <div className="flex items-center gap-1 text-green-400 text-sm">
            <CheckCircle size={16} />
            <span>Used</span>
          </div>
        )}
        
        {isExpired && !isUsed && (
          <div className="flex items-center gap-1 text-gray-400 text-sm">
            <Clock size={16} />
            <span>Expired</span>
          </div>
        )}
      </div>

      {!isUsed && !isExpired && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Clock size={16} />
              <span>Expires {coupon.expiresAt.toLocaleDateString()}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleSelectCoupon(coupon)}
                className="bg-primary cursor-pointer text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
              >
                <ShoppingCart size={16} />
                Use Now
              </button>
            </div>
          </div>
        </div>
      )}

      {isUsed && (
        <div className="space-y-2">
          <div className="text-xs text-gray-500">
            Used on {coupon.wonAt.toLocaleDateString()}
          </div>
        </div>
      )}
      
      {isExpired && !isUsed && (
        <div className="space-y-2">
          <div className="text-xs text-gray-500">
            Expired on {coupon.expiresAt.toLocaleDateString()}
          </div>
        </div>
      )}
    </div>
  );};

  return (
    <div className="flex-1 p-4 pt-0">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="pb-2">
          <h1 className="text-2xl font-bold text-white mb-2">My Rewards</h1>
          <p className="text-white">Your earned coupons and achievements</p>
        </div>

        {/* Tab Group */}
        <TabGroup
          tabs={[
            { id: 'active', label: 'Active', count: activeCoupons.length },
            { id: 'used', label: 'Used', count: usedCoupons.length },
            { id: 'expired', label: 'Expired', count: expiredCoupons.length }
          ]}
          activeTab={selectedTab}
          onTabChange={(tabId) => setSelectedTab(tabId as 'active' | 'used' | 'expired')}
        />

        {/* Display coupons based on selected tab */}
        {displayedCoupons.length > 0 ? (
          <div className="space-y-4">
            {displayedCoupons.map((coupon: WonCoupon) => (
              <CouponCard 
                key={coupon.id} 
                coupon={coupon} 
                isUsed={selectedTab === 'used'} 
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 text-center">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              {selectedTab === 'active' && <Gift size={32} className="text-gray-400" />}
              {selectedTab === 'used' && <CheckCircle size={32} className="text-gray-400" />}
              {selectedTab === 'expired' && <Clock size={32} className="text-gray-400" />}
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              No {selectedTab === 'active' ? 'Active' : selectedTab === 'used' ? 'Used' : 'Expired'} Coupons
            </h3>
            {selectedTab === 'active' && (
              <>
                <p className="text-gray-400 mb-4">
                  Spin the wheel to win discount coupons and free credits!
                </p>
                <button
                  onClick={() => setActiveTab('spinner')}
                  className="bg-primary hover:bg-secondary text-black px-6 py-3 rounded-2xl font-medium transition-colors"
                >
                  Go to Spinner
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 