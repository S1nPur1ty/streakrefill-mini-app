import { useState } from 'react';
import { Question, Gift } from 'phosphor-react';
import { Modal } from './Modal';

interface HowItWorksModalProps {
  buttonClassName?: string;
}

export const HowItWorksModal = ({ buttonClassName }: HowItWorksModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  const content = (
    <>
      <div className="space-y-4 text-sm text-gray-300">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mt-0.5">
            <span className="text-primary font-bold text-xs">1</span>
          </div>
          <div>
            <div className="font-medium">Purchase Gift Cards</div>
            <div className="text-gray-400">Buy gift cards worth $50+ to earn spin tickets</div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mt-0.5">
            <span className="text-primary font-bold text-xs">2</span>
          </div>
          <div>
            <div className="font-medium">Earn Tickets</div>
            <div className="text-gray-400">Get 1 ticket for every $50 spent (max 3 spins/day)</div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mt-0.5">
            <span className="text-primary font-bold text-xs">3</span>
          </div>
          <div>
            <div className="font-medium">Spin & Win</div>
            <div className="text-gray-400">Win discount coupons and free credits</div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mt-0.5">
            <span className="text-primary font-bold text-xs">4</span>
          </div>
          <div>
            <div className="font-medium">Use Your Rewards</div>
            <div className="text-gray-400">Apply discounts and free credits to your purchases</div>
          </div>
        </div>
      </div>

      <div className="mt-5 bg-gray-800 rounded-xl p-3 border border-gray-700">
        <div className="text-xs text-gray-400 leading-relaxed">
          <p className="mb-2"><span className="text-primary font-semibold">Daily Limit:</span> You can use a maximum of 3 tickets per day.</p>
          <p className="mb-2"><span className="text-primary font-semibold">Streak Bonus:</span> Keep your daily purchase streak going to earn bonus rewards!</p>
          <p><span className="text-primary font-semibold">Expiration:</span> Coupons expire 30 days after being earned.</p>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Question mark button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors ${buttonClassName}`}
        aria-label="How it works"
      >
        <Question size={18} className="text-gray-300" />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="How It Works"
        icon={<Gift size={20} className="text-primary" />}
        maxWidth="max-w-lg"
      >
        {content}
      </Modal>
    </>
  );
}; 