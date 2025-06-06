'use client';

import { BadgeAlert, Calendar, Handshake, SquareCheckBig } from 'lucide-react';

import { Agreement } from '@/features/health-check/types/agreements';
import {
  ActionItem,
  HealthCheck,
} from '@/features/health-check/types/health-check';
import { Issue } from '@/features/health-check/types/issues';

import TeamStatCard from '../team-stat-card';

interface DataTrackTabProps {
  agreements: Agreement[];
  issues: Issue[];
  actionItems: ActionItem[];
  scrumHealthChecks: HealthCheck[];
}

const DataTrackTab = ({
  agreements,
  issues,
  actionItems,
  scrumHealthChecks,
}: DataTrackTabProps) => {
  const stats = [
    {
      title: 'Total Team Agreements',
      value: agreements?.length || 0,
      icon: <Handshake className="h-6 w-6 text-yellow-500" />,
      iconBgColor: 'bg-yellow-500/10',
    },
    {
      title: 'Total Long-term Issues',
      value: issues?.length || 0,
      icon: <BadgeAlert className="text-blue-600 dark:text-blue-400" />,
      iconBgColor: 'bg-blue-500/10',
    },
    {
      title: 'Actions Created',
      value: actionItems?.length || 0,
      icon: (
        <SquareCheckBig className="h-6 w-6 text-green-600 dark:text-green-400" />
      ),
      iconBgColor: 'bg-green-500/10',
    },
    {
      title: 'Health Checks',
      value: scrumHealthChecks?.length || 0,
      icon: (
        <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />
      ),
      iconBgColor: 'bg-orange-500/10',
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {stats.map((stat, index) => (
          <TeamStatCard
            key={`stat-${index}`}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            iconBgColor={stat.iconBgColor}
          />
        ))}
      </div>
    </div>
  );
};

export default DataTrackTab;
