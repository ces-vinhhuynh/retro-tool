'use client';

import { ReactNode } from 'react';

import StatCard from './stat-card';

interface TeamStatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBgColor: string;
  isMobile?: boolean;
}

const TeamStatCard = ({
  title,
  value,
  icon,
  iconBgColor,
  isMobile = false,
}: TeamStatCardProps) => {
  return (
    <StatCard title={isMobile ? '' : title} className="bg-white">
      <div className="flex items-center">
        <div
          className={`rounded-lg md:rounded-xl ${iconBgColor} p-2 pt-0 pb-0 md:p-3`}
        >
          {icon}
        </div>
        <div className="ml-3 flex flex-1 flex-row items-center justify-between gap-2 md:ml-4 md:flex-initial md:flex-col md:items-start md:justify-start md:gap-0">
          {isMobile && <h3 className="text-md font-medium">{title}</h3>}
          <h3 className="font-heading text-near-black dark:text-foreground text-lg font-bold md:text-2xl">
            {value}
          </h3>
        </div>
      </div>
    </StatCard>
  );
};

export default TeamStatCard;
