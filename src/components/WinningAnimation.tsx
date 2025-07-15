import { useEffect, useState } from 'react';
import { WonCoupon } from '../types/spinner';
import { Gift, X } from 'phosphor-react';

interface WinningAnimationProps {
  coupon: WonCoupon | null;
  onClose: () => void;
}

export const WinningAnimation = ({ coupon, onClose }: WinningAnimationProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'entering' | 'showing' | 'exiting'>('entering');

  useEffect(() => {
    if (coupon) {
      setIsVisible(true);
      setAnimationPhase('entering');
      
      // Animation sequence
      const enterTimer = setTimeout(() => setAnimationPhase('showing'), 100);
      const exitTimer = setTimeout(() => {
        setAnimationPhase('exiting');
        setTimeout(() => {
          setIsVisible(false);
          onClose();
        }, 500);
      }, 4000);

      return () => {
        clearTimeout(enterTimer);
        clearTimeout(exitTimer);
      };
    }
  }, [coupon, onClose]);

  if (!isVisible || !coupon) return null;

  const isTryAgain = coupon.id === 'try-again';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div 
        className={`relative bg-gray-900 rounded-3xl p-8 mx-4 max-w-md w-full border-2 transform transition-all duration-500 ${
          animationPhase === 'entering' 
            ? 'scale-50 opacity-0 rotate-12' 
            : animationPhase === 'showing'
            ? 'scale-100 opacity-100 rotate-0'
            : 'scale-110 opacity-0 -rotate-12'
        } ${
          isTryAgain 
            ? 'border-gray-600' 
            : 'border-primary shadow-2xl shadow-primary/30'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            setAnimationPhase('exiting');
            setTimeout(() => {
              setIsVisible(false);
              onClose();
            }, 500);
          }}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Confetti Animation */}
        {!isTryAgain && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-2 h-2 bg-primary animate-bounce`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`
                }}
              />
            ))}
          </div>
        )}

        <div className="text-center space-y-6">
          {/* Icon */}
          <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center ${
            isTryAgain ? 'bg-gray-700' : 'bg-primary/20'
          }`}>
            <Gift 
              size={40} 
              className={isTryAgain ? 'text-gray-400' : 'text-primary'} 
            />
          </div>

          {/* Title */}
          <div>
            <h2 className={`text-2xl font-bold mb-2 ${
              isTryAgain ? 'text-gray-300' : 'text-primary'
            }`}>
              {isTryAgain ? '🎯 Try Again!' : '🎉 Congratulations!'}
            </h2>
            <p className="text-gray-400 text-sm">
              {isTryAgain 
                ? "Better luck next time! Keep spinning for amazing prizes."
                : "You've won an amazing prize!"
              }
            </p>
          </div>

          {/* Prize Details */}
          {!isTryAgain && (
            <div className="bg-gray-800 rounded-2xl p-6 space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {coupon.type === 'discount' ? `${coupon.value}% OFF` : `$${coupon.value} FREE`}
                </div>
                <div className="text-gray-300 font-medium">{coupon.title}</div>
                <div className="text-gray-400 text-sm">{coupon.description}</div>
              </div>
              
              <div className="border-t border-gray-700 pt-4">
                <div className="text-xs text-gray-400 mb-1">Coupon Code</div>
                <div className="bg-gray-900 rounded-lg p-3 font-mono text-primary text-lg font-bold tracking-wider">
                  {coupon.code}
                </div>
              </div>
              
              <div className="text-xs text-gray-500">
                Valid until {coupon.expiresAt.toLocaleDateString()}
              </div>
            </div>
          )}

          {/* Action Message */}
          <div className={`text-sm ${isTryAgain ? 'text-gray-400' : 'text-primary'}`}>
            {isTryAgain 
              ? "Spin again when you have more tickets!"
              : "Check your rewards page to use this coupon!"
            }
          </div>
        </div>
      </div>
    </div>
  );
}; 