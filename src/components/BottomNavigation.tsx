import { Icon } from "./ui";
import { useAppStore } from "../stores/useAppStore";
import * as PhosphorIcons from 'phosphor-react';

type TabIconName = keyof typeof PhosphorIcons;

export const BottomNavigation = () => {
  const { activeTab, setActiveTab, spinnerTickets } = useAppStore();

  const tabs = [
    { id: 'home', label: 'Home', icon: 'ShoppingCart' as TabIconName },
    { id: 'rewards', label: 'Rewards', icon: 'Gift' as TabIconName },
    { id: 'spinner', label: 'Spinner', icon: 'CircleNotch' as TabIconName },
    { id: 'milestones', label: 'Milestones', icon: 'Star' as TabIconName },
    { id: 'profile', label: 'Profile', icon: 'User' as TabIconName }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 p-6 pb-safe z-navigation">
      {/* Floating pill container */}
      <div className="relative max-w-sm mx-auto">
        <div className="bg-gray-950/80 rounded-full px-1 py-1 shadow-2xl border border-gray-950">
          <div className="flex items-center justify-between">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative transition-all duration-1000 ease-out p-3 rounded-full group ${
                    isActive
                      ? 'bg-primary/10 backdrop-blur-sm'
                      : 'hover:bg-primary/5'
                  }`}
                >
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <div className="relative flex-shrink-0">
                      <Icon 
                        name={tab.icon}
                        size={24}
                        weight={isActive ? 'fill' : 'regular'} 
                        className={`transition-all duration-1000 ease-out ${
                            isActive 
                            ? 'text-primary' 
                            : 'text-white/70 group-hover:text-primary/80'
                        }`}
                      />
                    </div>
                    {tab.id === 'spinner' && spinnerTickets > 0 && (
                        <div className="absolute -top-1 -right-1 bg-primary text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
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