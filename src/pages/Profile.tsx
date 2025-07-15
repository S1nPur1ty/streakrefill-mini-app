import { useAccount, useDisconnect } from "wagmi";
import { useAppStore } from "../stores/useAppStore";
import {
  Wallet,
  Trophy,
  Gift,
  Clock,
  Fire,
  Money,
  CircleNotch,
  Ticket,
  ShoppingBag,
  Gear,
  SignOut,
  Moon,
  Sun,
  Link
} from "phosphor-react";
// @ts-ignore
import blockies from "ethereum-blockies";
import { useEffect, useRef } from "react";

const BlockieAvatar = ({ address, size = 8 }: { address: string, size?: number }) => {
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (avatarRef.current && address) {
      const icon = blockies.create({
        seed: address.toLowerCase(),
        size: size / 2,
        scale: 4,
      });
      
      avatarRef.current.innerHTML = '';
      avatarRef.current.appendChild(icon);
    }
  }, [address, size]);

  return (
    <div 
      ref={avatarRef} 
      className={`w-${size} h-${size} rounded-lg overflow-hidden`}
    />
  );
};

export const Profile = () => {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const { 
    wonCoupons, 
    purchaseHistory, 
    currentStreak, 
    bestStreak,
    spinnerTickets,
    theme,
    toggleTheme
  } = useAppStore();

  // Calculate stats
  const totalSpent = purchaseHistory.reduce((sum, purchase) => sum + purchase.amount, 0);
  const activeCoupons = wonCoupons.filter(coupon => !coupon.used && coupon.id !== 'try-again' && coupon.expiresAt >= new Date());
  const spinWinningsValue = wonCoupons
    .filter(coupon => coupon.id !== 'try-again')
    .reduce((sum, coupon) => {
      if (coupon.type === 'freebie') {
        return sum + coupon.value;
      }
      return sum;
    }, 0);

  return (
    <div className="flex-1 p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="pb-4">
          <h1 className="text-2xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-gray-400">Account settings and statistics</p>
        </div>
        
        {/* Wallet & Account */}
        <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Wallet size={20} className="text-primary" />
            Wallet
          </h2>
          
          {isConnected ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <BlockieAvatar address={address || ''} size={12} />
                <div>
                  <div className="text-sm text-gray-400">Connected address</div>
                  <div className="font-mono text-white break-all">{address}</div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => disconnect()}
                  className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <SignOut size={16} />
                  Disconnect
                </button>
                <button className="flex items-center gap-2 bg-primary hover:bg-secondary text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  <Link size={16} />
                  View on Explorer
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-400 mb-4">Connect your wallet to view account details</p>
              <button className="bg-primary hover:bg-secondary text-black px-6 py-3 rounded-xl font-medium transition-colors">
                Connect Wallet
              </button>
            </div>
          )}
        </div>
        
        {/* Stats Overview */}
        <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Trophy size={20} className="text-yellow-500" />
            Stats Overview
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <Fire size={24} weight="fill" className="text-primary" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-primary">{currentStreak}</div>
                <div className="text-sm text-gray-400">Daily Purchase Streak</div>
                <div className="text-xs text-gray-500 mt-1">Consecutive days</div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <Trophy size={24} weight="fill" className="text-yellow-500" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-yellow-500">{bestStreak}</div>
                <div className="text-sm text-gray-400">Best Daily Streak</div>
                <div className="text-xs text-gray-500 mt-1">All time record</div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Money size={24} weight="fill" className="text-green-500" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-green-500">${totalSpent}</div>
                <div className="text-sm text-gray-400">Total Spent</div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <CircleNotch size={24} weight="fill" className="text-purple-500" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-purple-500">${spinWinningsValue}</div>
                <div className="text-sm text-gray-400">Spin Winnings</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Gift size={20} className="text-blue-500" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">{activeCoupons.length}</div>
                <div className="text-xs text-gray-400">Active Coupons</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center">
                <Ticket size={20} className="text-indigo-500" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">{spinnerTickets}</div>
                <div className="text-xs text-gray-400">Available Tickets</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                <ShoppingBag size={20} className="text-red-500" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">{purchaseHistory.length}</div>
                <div className="text-xs text-gray-400">Purchases Made</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                <Clock size={20} className="text-orange-500" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">
                  {purchaseHistory.length > 0 
                    ? new Date(Math.max(...purchaseHistory.map(p => p.date.getTime()))).toLocaleDateString() 
                    : 'Never'
                  }
                </div>
                <div className="text-xs text-gray-400">Last Purchase</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Settings */}
        <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Gear size={20} className="text-gray-400" />
            Settings
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-900 rounded-xl">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Moon size={20} className="text-blue-400" />
                ) : (
                  <Sun size={20} className="text-yellow-400" />
                )}
                <div>
                  <div className="font-medium text-white">Theme</div>
                  <div className="text-xs text-gray-400">Switch between dark and light mode</div>
                </div>
              </div>
              <button 
                onClick={toggleTheme}
                className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg text-sm text-white"
              >
                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-900 rounded-xl">
              <div className="flex items-center gap-3">
                <Link size={20} className="text-primary" />
                <div>
                  <div className="font-medium text-white">Social Connections</div>
                  <div className="text-xs text-gray-400">Connect your social accounts</div>
                </div>
              </div>
              <button className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg text-sm text-white">
                Configure
              </button>
            </div>
          </div>
        </div>
        
        {/* Version Info */}
        <div className="text-center text-gray-500 text-xs pt-4">
          <p>Streak Refill v1.0.0</p>
          <p className="mt-1">© 2023 Streak Refill. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}; 