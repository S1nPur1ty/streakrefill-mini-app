import { ShoppingCart, CircleNotch, Trophy, User, Gift } from "phosphor-react";
import { useAppStore } from "../stores";

export const BottomNavigation = () => {
  const { activeTab, setActiveTab, spinnerTickets } = useAppStore();

  const tabs = [
    { id: 'home', label: 'Home', icon: ShoppingCart },
    { id: 'rewards', label: 'Rewards', icon: Gift },
    { id: 'spinner', label: 'Spinner', icon: CircleNotch },
    { id: 'scoreboard', label: 'Scores', icon: Trophy },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <div className="fixed left-0 right-0 bottom-4 flex justify-center z-50 pointer-events-none select-none">
      <div className="flex w-full max-w-md mx-auto px-2">
        <nav className="flex flex-1 items-end justify-between bg-white/10 backdrop-blur-xl shadow-2xl rounded-full py-1 px-1 gap-1 pointer-events-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isCenter = tab.id === 'spinner';

            // Center tab (Spinner): visually distinct
            if (isCenter) {
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex flex-col items-center justify-center -mt-6 bg-white text-black shadow-xl rounded-full w-16 h-16 border-4 border-white transition-all duration-300 z-10 ${
                    isActive ? 'scale-110' : 'scale-100 opacity-90'
                  }`}
                  style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)' }}
                >
                  <Icon size={32} weight={isActive ? 'fill' : 'regular'} />
                  {spinnerTickets > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow border border-white/20">
                      {spinnerTickets > 9 ? '9+' : spinnerTickets}
                    </div>
                  )}
                </button>
              );
            }

            // Other tabs
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center h-12 transition-all duration-300 rounded-full relative ${
                  isActive ? 'text-white scale-110' : 'text-white/70 cursor-pointer hover:scale-110'
                }`}
              >
                <Icon size={24} weight={isActive ? 'fill' : 'regular'} />
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}; 