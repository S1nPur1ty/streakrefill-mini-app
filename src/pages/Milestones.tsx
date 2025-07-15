import { useState } from 'react';
import { useSupabaseUser } from "../hooks/useSupabaseUser";
import { useAppStore } from "../stores/useAppStore";
import { streakService } from "../services/streakService";
import {
  Star, 
  Fire, 
  Trophy, 
  Money, 
  CircleNotch, 
  CheckCircle, 
  Circle, 
  Target,
  SpinnerGap
} from "phosphor-react";

export const Milestones = () => {
  const { user, stats, streak, rewards, purchases, loading, refreshData } = useSupabaseUser();
  const { wonCoupons } = useAppStore();
  const [claimingReward, setClaimingReward] = useState<string | null>(null);

  // Debug logging to track data updates
  console.log('Milestones Debug:', {
    user: !!user,
    stats: stats ? { level: stats.level, xp: stats.xp } : null,
    streak: streak ? { current: streak.current, best: streak.best } : null,
    rewardsCount: rewards.length,
    purchasesCount: purchases.length
  });

  // Return loading state if data isn't ready
  if (loading || !user || !stats || !streak) {
    return (
      <div className="flex-1 p-4 pb-24">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-64"></div>
          </div>
          <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-700 rounded w-32"></div>
              <div className="h-3 bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-700 rounded w-24"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate stats from real data
  const totalSpent = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);
  const spinWinningsValue = wonCoupons
    .filter(coupon => coupon.id !== 'try-again')
    .reduce((sum, coupon) => {
      if (coupon.type === 'freebie') {
        return sum + coupon.value;
      }
      return sum;
    }, 0);

  // Real user level and XP from database
  const userLevel = stats.level;
  const totalXP = stats.xp;
  
  // Calculate XP for current level (each level requires 1000 XP)
  const baseXPForCurrentLevel = (userLevel - 1) * 1000;
  const currentXP = totalXP - baseXPForCurrentLevel;
  const requiredXP = 1000; // XP needed for next level
  const xpPercentage = Math.min((currentXP / requiredXP) * 100, 100);

  // Real streak data from database
  const currentStreak = streak.current;
  const bestStreak = streak.best;

  // Define milestone levels and rewards
  const milestoneDefinitions = [
    { days: 3, reward: 5 },
    { days: 5, reward: 10 },
    { days: 7, reward: 20 },
    { days: 10, reward: 30 },
    { days: 14, reward: 50 },
    { days: 21, reward: 75 },
    { days: 30, reward: 100 }
  ];

  // Get streak rewards from database
  const streakRewards = rewards.filter(r => r.reward_type === 'streak');

  // Build milestone data with real status
  const milestones = milestoneDefinitions.map(milestone => {
    const reward = streakRewards.find(r => r.milestone === milestone.days);
    
    let status: 'completed' | 'in-progress' | 'locked' = 'locked';
    let claimed = false;
    let claimedDate: string | undefined;
    let daysToGo: number | undefined;

    if (bestStreak >= milestone.days) {
      status = 'completed';
      if (reward) {
        claimed = reward.status === 'claimed';
        claimedDate = reward.status === 'claimed' 
          ? new Date(reward.received_at).toLocaleDateString() 
          : undefined;
      }
    } else if (currentStreak > 0 && milestone.days <= currentStreak + 3) {
      // Show as in-progress if within 3 days of current streak
      status = 'in-progress';
      daysToGo = milestone.days - currentStreak;
    }

    return {
      id: `${milestone.days}day`,
      days: milestone.days,
      status,
      reward: milestone.reward,
      claimed,
      claimedDate,
      daysToGo
    };
  });

  // Calculate total rewards earned from database
  const totalRewards = streakRewards
    .filter(r => r.status === 'claimed')
    .reduce((sum, r) => sum + r.amount, 0);

  // Function to claim a milestone reward
  const claimReward = async (milestoneId: string, days: number) => {
    if (!user) return;
    
    // Find the reward for this milestone
    const reward = streakRewards.find(r => r.milestone === days && r.status === 'claimable');
    if (!reward) return;

    setClaimingReward(milestoneId);
    
    try {
      // Claim the reward in the database
      const success = await streakService.claimStreakReward(reward.id);
      
      if (success) {
        console.log(`✅ Successfully claimed ${days}-day streak reward: $${reward.amount}`);
        
        // Refresh data to update UI and rewards counter
        await refreshData();
        
        console.log(`🎫 Milestone reward claimed! Check the rewards tab for your $${reward.amount} credit.`);
      } else {
        console.error('Failed to claim reward. Please try again.');
      }
    } catch (error) {
      console.error('Error claiming reward:', error);
    } finally {
      setClaimingReward(null);
    }
  };

  return (
    <div className="flex-1 p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="pb-4 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Milestones</h1>
            <p className="text-gray-400">Track your progress and earn rewards</p>
          </div>
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
            {milestones.map((milestone) => {
              // Determine icon and styling based on status
              let icon, iconColor, borderColor, rewardColor;
              let statusText = '';
              
              if (milestone.status === 'completed') {
                icon = <CheckCircle size={24} weight="fill" className="text-green-500" />;
                iconColor = 'text-green-500';
                borderColor = 'border-gray-700';
                rewardColor = 'text-green-500';
                statusText = milestone.claimed 
                  ? `Claimed ${milestone.claimedDate}` 
                  : 'Ready to claim!';
              } else if (milestone.status === 'in-progress') {
                icon = <Target size={24} weight="fill" className="text-orange-500" />;
                iconColor = 'text-orange-500';
                borderColor = 'border-orange-700/50';
                rewardColor = 'text-yellow-500';
                statusText = `${milestone.daysToGo} more day${milestone.daysToGo === 1 ? '' : 's'} to go`;
              } else {
                icon = <Circle size={24} weight="regular" className="text-gray-500" />;
                iconColor = 'text-gray-500';
                borderColor = 'border-gray-700';
                rewardColor = 'text-gray-300';
                statusText = 'Not achieved yet';
              }

              // Check if this milestone is ready to claim
              const isReadyToClaim = milestone.status === 'completed' && !milestone.claimed;
              const isClaimingThis = claimingReward === milestone.id;

              return (
                <div 
                  key={milestone.id}
                  className={`bg-gray-800 rounded-xl p-4 border ${borderColor} ${
                    milestone.status === 'in-progress' || isReadyToClaim ? 'flex flex-col' : 'flex items-center justify-between'
                  }`}
                >
                  <div className={milestone.status === 'in-progress' || isReadyToClaim ? 'flex items-center justify-between mb-2' : 'flex items-center gap-3'}>
                    <div className="flex items-center gap-3">
                      {icon}
                      <div>
                        <div className="text-white font-semibold">{milestone.days}-Day Streak</div>
                        <div className="text-gray-400 text-sm">{statusText}</div>
                      </div>
                    </div>
                    <div className={`${rewardColor} font-bold`}>${milestone.reward}</div>
                  </div>
                  
                  {milestone.status === 'in-progress' && (
                    <div className="text-orange-500 text-sm flex items-center gap-1">
                      <Fire size={16} weight="fill" />
                      <span>Next milestone! Keep your streak alive!</span>
                    </div>
                  )}

                  {isReadyToClaim && (
                    <button
                      onClick={() => claimReward(milestone.id, milestone.days)}
                      disabled={isClaimingThis}
                      className="bg-primary hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed text-black px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      {isClaimingThis ? (
                        <>
                          <SpinnerGap size={16} className="animate-spin" />
                          <span>Claiming...</span>
                        </>
                      ) : (
                        <>
                          <Money size={16} weight="fill" />
                          <span>Claim ${milestone.reward}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
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