import { useState, useCallback } from 'react';
import { SpinWheel, ISpinWheelProps } from 'spin-wheel-game';
import { Lightning, Clock } from 'phosphor-react';
import { useAppStore } from '../stores';
import { Coupon, SpinnerResult } from '../types/coupon';

interface SpinnerWheelProps {
  className?: string;
}

export default function SpinnerWheel({ className = '' }: SpinnerWheelProps) {
  const {
    spinnerPrizes,
    isSpinning,
    spinnerSpeed,
    spinnerTickets,
    addSpinnerResult,
    addCoupon,
    setSpinning,
    setSpinnerSpeed,
    useSpinnerTicket
  } = useAppStore();

  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<SpinnerResult | null>(null);

  const generateCouponCode = () => {
    return `SPIN${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  };

  const handleSpinFinish = useCallback((result: string) => {
    setSpinning(false);
    
    // Find the winning prize
    const winningPrize = spinnerPrizes.find(prize => prize.text === result);
    
    if (winningPrize) {
      const spinResult: SpinnerResult = {
        prize: winningPrize,
        timestamp: new Date(),
        spinId: `spin-${Date.now()}`
      };

      // Add to spinner results
      addSpinnerResult(spinResult);
      setLastResult(spinResult);

      // Generate coupon if prize is instant win
      if (winningPrize.isInstantWin && winningPrize.text !== "Try Again") {
        const discountMatch = winningPrize.text.match(/(\d+)%/);
        const discountPercent = discountMatch ? parseInt(discountMatch[1]) : 10;
        
        const coupon: Coupon = {
          id: Date.now().toString(),
          title: `${winningPrize.text} Discount`,
          description: `${winningPrize.text} discount on your next purchase`,
          code: generateCouponCode(),
          discountPercent,
          validUntil: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)), // 30 days
          type: 'spinning_wheel',
          category: 'spinning wheel win coupons',
          isUsed: false,
          isSelected: false,
          color: winningPrize.color
        };
        addCoupon(coupon);
      }

      setShowResult(true);
    }
  }, [spinnerPrizes, addSpinnerResult, addCoupon, setSpinning]);

  const handleSpin = () => {
    if (spinnerTickets <= 0 || isSpinning) return;
    
    useSpinnerTicket();
    setSpinning(true);
    // The wheel will handle the actual spinning
  };

  const closeResultModal = () => {
    setShowResult(false);
    setLastResult(null);
  };

  // Convert spinner prizes to the format expected by spin-wheel-game
  const wheelSegments = spinnerPrizes.map(prize => ({
    segmentText: prize.text,
    segColor: prize.color
  }));

  const spinWheelProps: ISpinWheelProps = {
    segments: wheelSegments,
    onFinished: handleSpinFinish,
    primaryColor: '#0f0f0f', // Matrix dark theme
    contrastColor: '#00ff00', // Matrix green
    buttonText: isSpinning ? 'Spinning...' : 'SPIN',
    isOnlyOnce: false,
    size: 320,
    upDuration: spinnerSpeed === 'instant' ? 50 : 100,
    downDuration: spinnerSpeed === 'instant' ? 300 : 1000,
    fontFamily: 'Inter, system-ui, sans-serif',
    arrowLocation: 'top',
    showTextOnSpin: true,
    isSpinSound: false // Disable built-in sound for now
  };

  return (
    <div className={`flex flex-col items-center space-y-6 ${className}`}>
      {/* Speed Toggle */}
      <div className="flex items-center space-x-4 bg-gray-900/50 rounded-full p-2">
        <button
          onClick={() => setSpinnerSpeed('normal')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
            spinnerSpeed === 'normal'
              ? 'bg-green-500 text-black'
              : 'text-green-400 hover:bg-gray-800'
          }`}
        >
          <Clock size={16} />
          <span className="text-sm font-medium">Normal</span>
        </button>
        <button
          onClick={() => setSpinnerSpeed('instant')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
            spinnerSpeed === 'instant'
              ? 'bg-green-500 text-black'
              : 'text-green-400 hover:bg-gray-800'
          }`}
        >
          <Lightning size={16} />
          <span className="text-sm font-medium">Instant</span>
        </button>
      </div>

      {/* Ticket Info */}
      <div className="text-center">
        <div className="text-green-400 text-lg font-semibold">
          Tickets: {spinnerTickets}
        </div>
        <div className="text-gray-400 text-sm">
          {spinnerTickets <= 0 ? 'No tickets available' : 'Click SPIN to use 1 ticket'}
        </div>
      </div>

      {/* Spinner Wheel */}
      <div className="relative">
        <SpinWheel {...spinWheelProps} />
        
        {/* Custom overlay button for better control */}
        <button
          onClick={handleSpin}
          disabled={spinnerTickets <= 0 || isSpinning}
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
            w-16 h-16 rounded-full font-bold text-sm transition-all duration-200 z-10 ${
            spinnerTickets <= 0 || isSpinning
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600 text-black hover:scale-105 shadow-lg'
          }`}
        >
          {isSpinning ? (
            <div className="animate-spin">⚡</div>
          ) : spinnerTickets <= 0 ? (
            'No Tickets'
          ) : (
            'SPIN'
          )}
        </button>
      </div>

      {/* Result Modal */}
      {showResult && lastResult && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-green-500/30 rounded-lg p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-4">
                {lastResult.prize.isInstantWin ? 'Congratulations! 🎉' : 'Try Again! 😊'}
              </div>
              <div className="text-lg text-white mb-2">
                You won: {lastResult.prize.text}
              </div>
              {lastResult.prize.isInstantWin && lastResult.prize.text !== "Try Again" && (
                <div className="text-green-400 font-semibold mb-4">
                  Discount Coupon Generated!
                </div>
              )}
              <button
                onClick={closeResultModal}
                className="bg-green-500 hover:bg-green-600 text-black font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                {lastResult.prize.isInstantWin ? 'Awesome!' : 'Try Again!'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 