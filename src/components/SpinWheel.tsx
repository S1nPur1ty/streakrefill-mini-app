import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Wheel } from 'react-custom-roulette';
import { useAppStore } from '../stores/useAppStore';
import { SpinWheelData, WonCoupon } from '../types/spinner';
import { rewardService } from '../services/rewardService';
import { statsService } from '../services/statsService';

interface SpinWheelProps {
  onWin: (coupon: WonCoupon) => void;
  spinLimit: { used: number, max: number };
  loading: boolean;
  user: any;
  useSpin: () => Promise<boolean>;
}

const wheelData: SpinWheelData[] = [
  { 
    option: '5% OFF', 
    style: { backgroundColor: '#00ff00', textColor: '#000000' }
  },
  { 
    option: '10% OFF', 
    style: { backgroundColor: '#1f2937', textColor: '#ffffff' }
  },
  { 
    option: '15% OFF', 
    style: { backgroundColor: '#00ff00', textColor: '#000000' }
  },
  { 
    option: '$5 FREE', 
    style: { backgroundColor: '#1f2937', textColor: '#ffffff' }
  },
  { 
    option: '20% OFF', 
    style: { backgroundColor: '#00ff00', textColor: '#000000' }
  },
  { 
    option: 'TRY AGAIN', 
    style: { backgroundColor: '#1f2937', textColor: '#ffffff' }
  },
  { 
    option: '25% OFF', 
    style: { backgroundColor: '#00ff00', textColor: '#000000' }
  },
  { 
    option: '$10 FREE', 
    style: { backgroundColor: '#1f2937', textColor: '#ffffff' }
  },
  {
    option: 'TRY AGAIN', 
    style: { backgroundColor: '#00ff00', textColor: '#000000' }
  },
  {
    option: '15% OFF', 
    style: { backgroundColor: '#1f2937', textColor: '#ffffff' }
  },
  {
    option: 'TRY AGAIN', 
    style: { backgroundColor: '#00ff00', textColor: '#000000' }
  },
  {
    option: '5% OFF', 
    style: { backgroundColor: '#1f2937', textColor: '#ffffff' }
  }
];

const prizeWeights = [15, 20, 10, 15, 8, 25, 5, 2, 14, 10, 10, 10]; // Higher numbers = more likely

export const SpinWheel = ({ onWin, spinLimit, loading, user, useSpin }: SpinWheelProps) => {
  const { addWonCoupon } = useAppStore();
  
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinSpeed, setSpinSpeed] = useState<'normal' | 'fast'>('normal');
  const [canSpinNow, setCanSpinNow] = useState(false);
  const prevSpinLimitRef = useRef(spinLimit);
  const initializedRef = useRef(false);

  // Calculate remaining spins
  const remainingSpins = Math.max(0, spinLimit.max - spinLimit.used);

  // Memoized can spin calculation to prevent unnecessary updates
  const canSpinCalculated = useMemo(() => {
    if (loading || !initializedRef.current) return false;
    return remainingSpins > 0 && !isSpinning;
  }, [remainingSpins, isSpinning, loading]);

  // Update can spin status only when calculation changes
  useEffect(() => {
    if (!loading) {
      initializedRef.current = true;
      setCanSpinNow(canSpinCalculated);
    }
  }, [canSpinCalculated, loading]);

  // Optimized spin limit change detection
  useEffect(() => {
    const prevLimit = prevSpinLimitRef.current;
    const hasSignificantChange = 
      prevLimit.max !== spinLimit.max || 
      prevLimit.used !== spinLimit.used;
    
    if (hasSignificantChange && !loading) {
      prevSpinLimitRef.current = spinLimit;
      // Only log when there's actual change and not initial state
      if (prevLimit.max !== 0 || prevLimit.used !== 0) {
        console.log('Spin limit updated:', spinLimit);
      }
    }
  }, [spinLimit, loading]);

  const handleSpinClick = useCallback(async () => {
    if (!canSpinNow || isSpinning || !user) return;
    
    // Weighted random selection
    const totalWeight = prizeWeights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    let selectedIndex = 0;
    
    for (let i = 0; i < prizeWeights.length; i++) {
      random -= prizeWeights[i];
      if (random <= 0) {
        selectedIndex = i;
        break;
      }
    }
    
    // Use a spin ticket in the database
    const spinUsed = await useSpin();
    
    if (!spinUsed) {
      console.error('Failed to use spin ticket');
      return;
    }

    setPrizeNumber(selectedIndex);
    setMustSpin(true);
    setIsSpinning(true);
    setCanSpinNow(false);
  }, [canSpinNow, isSpinning, user, useSpin]);

  const handleStopSpinning = useCallback(async () => {
    setMustSpin(false);
    setIsSpinning(false);
    
    const wonPrize = wheelData[prizeNumber];
    
    if (wonPrize.option !== 'TRY AGAIN' && user) {
      const coupon: WonCoupon = {
        id: Math.random().toString(36).substring(2, 9),
        type: wonPrize.option.includes('OFF') ? 'discount' : 'freebie',
        value: wonPrize.option.includes('OFF') 
          ? parseInt(wonPrize.option.replace('% OFF', ''))
          : parseInt(wonPrize.option.replace('$', '').replace(' FREE', '')),
        title: `Spin Wheel Prize: ${wonPrize.option}`,
        description: wonPrize.option.includes('OFF') 
          ? `Get ${wonPrize.option} on your next purchase`
          : `Free ${wonPrize.option.replace(' FREE', '')} credit`,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        wonAt: new Date(),
        used: false
      };
      
      // Store in local state for UI
      addWonCoupon(coupon);
      
      // Store in database (fire and forget - don't block UI)
      if (user) {
        Promise.all([
          rewardService.createSpinReward(
            user.id,
            coupon.value,
            coupon.title,
            'common', // Rarity
            wonPrize.style.backgroundColor // Color
          ),
          statsService.recordSpinWin(user.id, coupon.value)
        ]).then(([savedReward]) => {
          if (savedReward) {
            // Update the coupon with the database ID
            coupon.id = savedReward.id;
          }
        }).catch(error => {
          console.error('Error saving spin reward:', error);
        });
      }
      
      onWin(coupon);
    } else {
      // Show "try again" message
      onWin({
        id: 'try-again',
        type: 'discount',
        value: 0,
        title: 'Try Again!',
        description: 'Better luck next time! Keep spinning for amazing prizes.',
        expiresAt: new Date(),
        wonAt: new Date(),
        used: true
      });
    }
  }, [prizeNumber, addWonCoupon, onWin, user]);

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Spinning Wheel */}
      <div className="relative z-wheel">
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={wheelData}
          onStopSpinning={handleStopSpinning}
          backgroundColors={['#1f2937', '#374151']}
          textColors={['#ffffff']}
          outerBorderColor="#00bb00"
          outerBorderWidth={4}
          innerRadius={20}
          innerBorderColor="#00cc00"
          innerBorderWidth={4}
          radiusLineColor="#00ff00"
          radiusLineWidth={2}
          fontSize={20}
          textDistance={64}
          spinDuration={spinSpeed === 'fast' ? 0.2 : 0.4}
        />
        
        {/* Center Circle - Improved Button */}
        <div 
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-200 ${
            canSpinNow 
              ? 'bg-primary border-primary/20 shadow-[0_0_15px_rgba(0,255,0,0.5)] cursor-pointer hover:scale-120 animate-spin-button' 
              : 'bg-[#1f2937] border-[#1f2937] cursor-not-allowed opacity-70'
          }`}
        >
          <button 
            onClick={handleSpinClick} 
            disabled={!canSpinNow || loading}
            className={`text-center w-full h-full rounded-full flex items-center justify-center transition-all ${
              canSpinNow ? 'text-black font-bold hover:text-gray-800' : 'text-white font-bold'
            }`}
          >
            {canSpinNow ? "SPIN" : ""}
          </button>
        </div>
      </div>
      
      {/* Speed Toggle Button */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs text-gray-500">Normal</span>
          <div 
            onClick={() => setSpinSpeed(spinSpeed === 'normal' ? 'fast' : 'normal')}
            className={`relative w-10 h-5 rounded-full cursor-pointer transition-colors duration-300 ${
              spinSpeed === 'fast' ? 'bg-primary' : 'bg-gray-600'
            }`}
          >
            <div 
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all duration-300 ${
                spinSpeed === 'fast' ? 'left-[calc(100%-18px)]' : 'left-0.5'
              }`}
            />
          </div>
          <span className="text-xs text-gray-500">Fast</span>
        </div>
      </div>
    </div>
  );
};