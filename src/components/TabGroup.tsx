import { ReactNode } from 'react';

interface TabProps {
  id: string;
  label: string;
  count: number;
  icon?: ReactNode;
  active: boolean;
  onClick: () => void;
}

interface TabGroupProps {
  tabs: Omit<TabProps, 'active' | 'onClick'>[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const Tab = ({ label, count, active, onClick, icon }: TabProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center justify-center py-3 px-4 rounded-2xl transition-all ${
        active
          ? 'bg-gray-700 border border-gray-600'
          : 'bg-gray-800 border border-gray-700 hover:border-gray-600'
      }`}
    >
      {icon && <div className="mb-1">{icon}</div>}
      <div className={`text-2xl font-bold ${active ? 'text-primary' : 'text-gray-400'}`}>
        {count}
      </div>
      <div className={`text-xs ${active ? 'text-white' : 'text-gray-400'}`}>
        {label}
      </div>
    </button>
  );
};

export const TabGroup = ({ tabs, activeTab, onTabChange }: TabGroupProps) => {
  return (
    <div className="flex gap-3">
      {tabs.map((tab) => (
        <Tab
          key={tab.id}
          id={tab.id}
          label={tab.label}
          count={tab.count}
          icon={tab.icon}
          active={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
        />
      ))}
    </div>
  );
}; 