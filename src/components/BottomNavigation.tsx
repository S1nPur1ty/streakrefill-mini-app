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
    <div className="fixed bottom-0 left-0 right-0 p-6 pb-safe">
      {/* Floating pill container */}
      <div className="relative max-w-sm mx-auto">
        <div className="bg-white/10 backdrop-blur-xl rounded-full px-1 py-1 shadow-2xl border border-white/10">
          <div className="flex items-center justify-between">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative transition-all duration-1000 ease-out p-3 rounded-full ${
                    isActive
                      ? 'bg-white/10 backdrop-blur-sm'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <div className="relative flex-shrink-0">
                      <Icon 
                        size={24} 
                        weight={isActive ? 'fill' : 'regular'} 
                        className={`transition-all duration-1000 ease-out ${
                            isActive 
                            ? 'text-white' 
                            : 'text-white/70'
                        }`}
                      />
                    </div>
                    {tab.id === 'spinner' && spinnerTickets > 0 && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                          {spinnerTickets > 9 ? '9+' : spinnerTickets}
                        </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}; 