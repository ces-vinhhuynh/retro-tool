'use client';

import { ReactNode } from 'react';

import StatCard from './stat-card';

interface TeamStatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBgColor: string;
}

const TeamStatCard = ({
  title,
  value,
  icon,
  iconBgColor,
}: TeamStatCardProps) => {
  return (
    <StatCard title={title} className="bg-white">
      <div className="flex items-center">
        <div className={`rounded-xl ${iconBgColor} p-3`}>{icon}</div>
        <div className="ml-4">
          <h3 className="font-heading text-near-black dark:text-foreground text-2xl font-bold">
            {value}
          </h3>
        </div>
      </div>
    </StatCard>
  );
};

export default TeamStatCard;
