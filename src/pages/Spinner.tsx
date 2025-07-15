import { useState, useEffect, useCallback, useRef } from 'react';
import { WonCoupon } from '../types/spinner';
import { Ticket, Clock } from 'phosphor-react';
import { useSupabaseUser } from '../hooks/useSupabaseUser';
import { useTimeTravel } from '../hooks/useTimeTravel';
import { useAppStore } from '../stores/useAppStore';
import { HowItWorksModal } from '../components/HowItWorksModal';
import { SpinWheel } from '../components/SpinWheel';
import { DevToolsModal } from '../components/DevToolsModal';
import { WinningAnimation } from '../components/WinningAnimation';

export const Spinner = () => {
  const [winningCoupon, setWinningCoupon] = useState<WonCoupon | null>(null);
  const [localSpinLimit, setLocalSpinLimit] = useState({ used: 0, max: 0 });
  const [loading, setLoading] = useState(true);
  const { user, spinLimit, getSpinLimit, refreshData } = useSupabaseUser();
  const { setSpinnerTickets } = useAppStore();
  const { isTimeTravelActive, formattedDate, isDev } = useTimeTravel();
  const initialLoadRef = useRef(true);

  // Calculate remaining spins
  const remainingSpins = Math.max(0, localSpinLimit.max - localSpinLimit.used);

  // Update spinner tickets in global store
  useEffect(() => {
    setSpinnerTickets(remainingSpins);
  }, [remainingSpins, setSpinnerTickets]);

  // Update local spin limit whenever the spinLimit from useSupabaseUser changes
  useEffect(() => {
    if (spinLimit) {
      setLocalSpinLimit({
        used: spinLimit.used,
        max: spinLimit.max_spins
      });
      setLoading(false);
      initialLoadRef.current = false;
    } else if (!loading && initialLoadRef.current) {
      // If we don't have a spinLimit yet and we're still on initial load, fetch it
      loadSpinData();
    }
  }, [spinLimit]);

  // Load spin data from database
  const loadSpinData = useCallback(async () => {
    if (!user) {
      setLocalSpinLimit({ used: 0, max: 0 });
      setLoading(false);
      initialLoadRef.current = false;
      return;
    }

    // Only show loading on first load
    if (initialLoadRef.current) {
      setLoading(true);
    }
    
    try {
      console.log('Loading spin data...');
      const spinLimitData = await getSpinLimit();
      if (spinLimitData) {
        console.log('Spin data loaded:', spinLimitData);
        setLocalSpinLimit({
          used: spinLimitData.used,
          max: spinLimitData.max_spins
        });
      } else {
        setLocalSpinLimit({ used: 0, max: 0 });
      }
      initialLoadRef.current = false;
    } catch (error) {
      console.error("Failed to load spin data:", error);
      setLocalSpinLimit({ used: 0, max: 0 });
    } finally {
      setLoading(false);
    }
  }, [user, getSpinLimit]);

  // Comprehensive data refresh function
  const refreshAllData = useCallback(async () => {
    if (!user) return;
    
    console.log('Refreshing all spinner data...');
    
    try {
      // First refresh user data (stats, streak, etc.)
      await refreshData();
      // Then refresh spinner-specific data
      await loadSpinData();
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  }, [user, refreshData, loadSpinData]);

  // Handle data changes from DevToolsModal
  const handleDataChange = useCallback(() => {
    console.log('Data change detected, refreshing...');
    // Do a full refresh when DevToolsModal changes data
    refreshAllData();
  }, [refreshAllData]);

  // Initial data load
  useEffect(() => {
    if (initialLoadRef.current) {
      loadSpinData();
    }
  }, [loadSpinData]);

  // Effect to reload data when time travel status changes
  useEffect(() => {
    if (user && isTimeTravelActive !== undefined) {
      console.log('Time travel status changed, refreshing data...');
      refreshAllData();
    }
  }, [isTimeTravelActive, user, refreshAllData]);

  const handleWin = useCallback((coupon: WonCoupon) => {
    setWinningCoupon(coupon);
    // Refresh data after winning to update UI
    loadSpinData();
  }, [loadSpinData]);

  const handleCloseWinning = useCallback(() => {
    setWinningCoupon(null);
  }, []);

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
          spinLimit={localSpinLimit}
          loading={loading}
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