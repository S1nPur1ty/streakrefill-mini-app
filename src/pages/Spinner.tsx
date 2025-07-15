import { useState, useEffect, useCallback } from 'react';
import { WonCoupon } from '../types/spinner';
import { Ticket, Clock } from 'phosphor-react';
import { useSupabaseUser } from '../hooks/useSupabaseUser';
import { useTimeTravel } from '../hooks/useTimeTravel';
import { useAppStore } from '../stores/useAppStore';
import { HowItWorksModal } from '../components/HowItWorksModal';
import { SpinWheel } from '../components/SpinWheel';
import { DevToolsModal } from '../components/DevToolsModal';
import { WinningAnimation } from '../components/WinningAnimation';
import { SpinnerSkeleton } from '../components/SkeletonLoader';

export const Spinner = () => {
  const [winningCoupon, setWinningCoupon] = useState<WonCoupon | null>(null);
  const { user, spinLimit, useSpin } = useSupabaseUser();
  const { setSpinnerTickets } = useAppStore();
  const { isTimeTravelActive, formattedDate, isDev } = useTimeTravel();

  // Debug logging to see what's happening
  console.log('Spinner Debug:', { user: !!user, spinLimit, loading: !user });

  // Use spinLimit directly from useSupabaseUser - no local state needed
  const currentSpinLimit = spinLimit
    ? { used: spinLimit.used, max: spinLimit.max_spins }
    : { used: 0, max: 0 };
  const remainingSpins = Math.max(0, currentSpinLimit.max - currentSpinLimit.used);

  // Only require user to be loaded - spinLimit can be null if user has no spins yet
  const loading = !user;

  // Update spinner tickets in global store - only when remainingSpins actually changes
  useEffect(() => {
    setSpinnerTickets(remainingSpins);
  }, [remainingSpins, setSpinnerTickets]);

  const handleWin = useCallback((coupon: WonCoupon) => {
    setWinningCoupon(coupon);
  }, []);

  const handleCloseWinning = useCallback(() => {
    setWinningCoupon(null);
  }, []);

  // Simple data change handler - no debouncing needed since useSupabaseUser handles it
  const handleDataChange = useCallback(() => {
    // The useSupabaseUser hook will handle the refresh automatically
    console.log('Dev tools data change - useSupabaseUser will handle refresh');
  }, []);

  // Show skeleton loader during initial load
  if (loading) {
    return <SpinnerSkeleton />;
  }

  return (
    <div className="flex-1 p-4">
      {/* Time Travel Banner */}
      {isTimeTravelActive && isDev && (
        <div className="bg-primary/20 border border-primary rounded-xl p-2 mb-4 text-center">
          <div className="flex items-center justify-center gap-2 text-primary">
            <Clock size={18} weight="bold" />
            <span className="font-medium">Changed Date: {formattedDate}</span>
          </div>
          <div className="text-xs text-white/70 mt-1">
            All data operations will use this date instead of today.
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <div className="relative text-center">
          <div className="absolute right-0 top-0 flex gap-3">
            <HowItWorksModal />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Spin to Win!</h1>
          <p className="text-gray-400">
            Get 1 free spin credit with every $50 game credit purchase—win discounts and crypto!
          </p>
        </div>

        {/* Tickets and Spins Counters */}
        <div className="flex justify-center">
          {/* Tickets counter */}
          <div className="bg-gray-800/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-700 flex items-center gap-1.5">
            <Ticket size={18} className="text-primary" weight="fill" />
            <span className="text-white font-medium">
              {loading ?
                "Loading..." :
                `${remainingSpins} ${remainingSpins === 1 ? 'Ticket' : 'Tickets'}`
              }
            </span>
          </div>
        </div>

        <SpinWheel
          onWin={handleWin}
          spinLimit={currentSpinLimit}
          loading={loading}
          user={user}
          useSpin={useSpin}
        />
      </div>

      {/* DevTools Modal - Fixed in bottom right corner, above bottom nav */}
      <div className="fixed bottom-24 right-4 z-50">
        <DevToolsModal onDataChange={handleDataChange} />
      </div>

      {/* Winning Animation */}
      {winningCoupon && (
        <WinningAnimation
          coupon={winningCoupon}
          onClose={handleCloseWinning}
        />
      )}
    </div>
  );
}; 