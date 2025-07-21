'use client';

import { HealthCheckTab } from '@/features/health-check/utils/constants';
import { cn } from '@/utils/cn';

interface TabNavigationProps {
  activeTab: HealthCheckTab;
  onTabChange: (tab: HealthCheckTab) => void;
  tabs: { id: string; label: string }[];
}

export const TabNavigation = ({
  activeTab,
  onTabChange,
  tabs,
}: TabNavigationProps) => {
  return (
    <div className="flex border-b">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id as HealthCheckTab)}
          className={cn(
            'cursor-pointer px-6 py-3 text-sm font-medium transition-colors',
            activeTab === tab.id && 'border-primary text-primary border-b-2',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
