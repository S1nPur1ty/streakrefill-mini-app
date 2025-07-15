import { useAppStore } from "../stores/useAppStore";
import {
  Star, 
  Fire, 
  Trophy, 
  Money, 
  CircleNotch, 
  CheckCircle, 
  Circle, 
  Target
} from "phosphor-react";

export const Milestones = () => {
  const { 
    currentStreak, 
    bestStreak, 
    purchaseHistory,
    wonCoupons
  } = useAppStore();

  // Calculate stats
  const totalSpent = purchaseHistory.reduce((sum, purchase) => sum + purchase.amount, 0);
  const spinWinningsValue = wonCoupons
    .filter(coupon => coupon.id !== 'try-again')
    .reduce((sum, coupon) => {
      if (coupon.type === 'freebie') {
        return sum + coupon.value;
      }
      return sum;
    }, 0);

  // Determine user level (simplified for demo)
  const userLevel = 7;
  const currentXP = 970;
  const requiredXP = 1300;
  const totalXP = 4570;
  const xpPercentage = (currentXP / requiredXP) * 100;

  // Milestone data
  const milestones = [
    {
      id: '3day',
      days: 3,
      status: 'completed',
      reward: 5,
      claimed: true,
      claimedDate: '7/14/2025'
    },
    {
      id: '5day',
      days: 5,
      status: 'in-progress',
      reward: 10,
      daysToGo: 2
    },
    {
      id: '7day',
      days: 7,
      status: 'locked',
      reward: 20
    },
    {
      id: '10day',
      days: 10,
      status: 'locked',
      reward: 30
    },
    {
      id: '14day',
      days: 14,
      status: 'locked',
      reward: 50
    },
    {
      id: '21day',
      days: 21,
      status: 'locked',
      reward: 75
    },
    {
      id: '30day',
      days: 30,
      status: 'locked',
      reward: 100
    }
  ];

  // Total rewards earned
  const totalRewards = milestones
    .filter(m => m.status === 'completed' && m.claimed)
    .reduce((sum, m) => sum + m.reward, 0);

  return (
    <div className="flex-1 p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="pb-4">
          <h1 className="text-2xl font-bold text-white mb-2">Milestones</h1>
          <p className="text-gray-400">Track your progress and earn rewards</p>
        </div>

        {/* Level Progress */}
        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700 relative">
          <div className="absolute top-5 right-5">
            <Star size={28} weight="fill" className="text-yellow-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Level {userLevel}</h2>
          
          <div className="mb-2 flex justify-between">
            <span className="text-gray-300">XP Progress</span>
            <span className="text-gray-300 font-semibold">{currentXP} / {requiredXP}</span>
          </div>
          
          <div className="h-3 bg-gray-700 rounded-full overflow-hidden mb-2">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"
              style={{ width: `${xpPercentage}%` }}
            ></div>
          </div>
          
          <div className="text-gray-500 text-sm">Total XP: {totalXP}</div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Current Streak */}
          <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Fire size={36} weight="fill" className="text-orange-500 mb-2" />
              <div className="text-4xl font-bold text-orange-500 mb-1">{currentStreak}</div>
              <div className="text-gray-300 font-medium">Daily Purchase Streak</div>
              <div className="text-gray-500 text-xs mt-1">Consecutive days</div>
            </div>
          </div>

          {/* Best Streak */}
          <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Trophy size={36} weight="fill" className="text-yellow-500 mb-2" />
              <div className="text-4xl font-bold text-yellow-500 mb-1">{bestStreak}</div>
              <div className="text-gray-300 font-medium">Best Daily Streak</div>
              <div className="text-gray-500 text-xs mt-1">All time record</div>
            </div>
          </div>

          {/* Total Spent */}
          <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Money size={36} weight="fill" className="text-green-500 mb-2" />
              <div className="text-4xl font-bold text-green-500 mb-1">${totalSpent}</div>
              <div className="text-gray-300 font-medium">Total Spent</div>
            </div>
          </div>

          {/* Spin Winnings */}
          <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
            <div className="flex flex-col items-center justify-center h-full text-center">
              <CircleNotch size={36} weight="fill" className="text-purple-500 mb-2" />
              <div className="text-4xl font-bold text-purple-500 mb-1">${spinWinningsValue}</div>
              <div className="text-gray-300 font-medium">Spin Winnings</div>
            </div>
          </div>
        </div>

        {/* Milestone Progress */}
        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-5">Milestone Progress</h2>

          <div className="space-y-4">
            {/* 3-Day Streak */}
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle size={24} weight="fill" className="text-green-500" />
                <div>
                  <div className="text-white font-semibold">3-Day Streak</div>
                  <div className="text-gray-400 text-sm">Claimed 7/14/2025</div>
                </div>
              </div>
              <div className="text-green-500 font-bold">$5</div>
            </div>

            {/* 5-Day Streak */}
            <div className="bg-gray-800 rounded-xl p-4 border border-orange-700/50 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Target size={24} weight="fill" className="text-orange-500" />
                  <div>
                    <div className="text-white font-semibold">5-Day Streak</div>
                    <div className="text-gray-400 text-sm">2 more days to go</div>
                  </div>
                </div>
                <div className="text-yellow-500 font-bold">$10</div>
              </div>
              <div className="text-orange-500 text-sm flex items-center gap-1">
                <Fire size={16} weight="fill" />
                <span>Next milestone! Keep your streak alive!</span>
              </div>
            </div>

            {/* 7-Day Streak */}
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Circle size={24} weight="regular" className="text-red-500" />
                <div>
                  <div className="text-white font-semibold">7-Day Streak</div>
                  <div className="text-gray-400 text-sm">Not achieved yet</div>
                </div>
              </div>
              <div className="text-gray-300 font-bold">$20</div>
            </div>

            {/* 10-Day Streak */}
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Circle size={24} weight="regular" className="text-red-500" />
                <div>
                  <div className="text-white font-semibold">10-Day Streak</div>
                  <div className="text-gray-400 text-sm">Not achieved yet</div>
                </div>
              </div>
              <div className="text-gray-300 font-bold">$30</div>
            </div>

            {/* 14-Day Streak */}
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Circle size={24} weight="regular" className="text-red-500" />
                <div>
                  <div className="text-white font-semibold">14-Day Streak</div>
                  <div className="text-gray-400 text-sm">Not achieved yet</div>
                </div>
              </div>
              <div className="text-gray-300 font-bold">$50</div>
            </div>

            {/* 21-Day Streak */}
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Circle size={24} weight="regular" className="text-red-500" />
                <div>
                  <div className="text-white font-semibold">21-Day Streak</div>
                  <div className="text-gray-400 text-sm">Not achieved yet</div>
                </div>
              </div>
              <div className="text-gray-300 font-bold">$75</div>
            </div>

            {/* 30-Day Streak */}
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Circle size={24} weight="regular" className="text-red-500" />
                <div>
                  <div className="text-white font-semibold">30-Day Streak</div>
                  <div className="text-gray-400 text-sm">Not achieved yet</div>
                </div>
              </div>
              <div className="text-gray-300 font-bold">$100</div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-700 flex items-center justify-between">
            <div className="text-white font-medium">Total Milestone Rewards:</div>
            <div className="text-green-500 font-bold">${totalRewards}</div>
          </div>
        </div>
      </div>
    </div>
  );
}; 