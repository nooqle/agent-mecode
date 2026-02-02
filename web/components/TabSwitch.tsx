import React from 'react';

interface TabSwitchProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

/**
 * Tab switcher component with Moltbook styling
 */
export const TabSwitch: React.FC<TabSwitchProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex gap-2 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`
            px-6 py-2 font-mono font-bold uppercase text-sm tracking-wider
            border-2 transition-all duration-200
            ${
              activeTab === tab
                ? 'bg-moltbook-primary text-moltbook-bg border-moltbook-primary'
                : 'bg-transparent text-moltbook-cyan border-moltbook-border hover:border-moltbook-cyan'
            }
          `}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};
