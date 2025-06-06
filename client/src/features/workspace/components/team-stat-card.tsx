'use client';

import { ReactNode } from 'react';

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
    <div className="dark:bg-card dark:border-border rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center">
        <div className={`rounded-xl ${iconBgColor} p-3`}>{icon}</div>
        <div className="ml-4">
          <p className="text-body text-secondary-text dark:text-muted-foreground">
            {title}
          </p>
          <h3 className="font-heading text-near-black dark:text-foreground text-2xl font-bold">
            {value}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default TeamStatCard;
