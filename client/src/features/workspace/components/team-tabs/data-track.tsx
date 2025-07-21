'use client';

import { BadgeAlert, Calendar, Handshake, SquareCheckBig } from 'lucide-react';

import { Agreement } from '@/features/health-check/types/agreements';
import {
  ActionItem,
  HealthCheck,
} from '@/features/health-check/types/health-check';
import { Issue } from '@/features/health-check/types/issues';
import { Template } from '@/features/health-check/types/templates';

import { TeamStatCard } from '../team-stat-card';

import { CategoryHealth } from './category-health';
import { TeamHealthTrend } from './team-health-trend';

interface DataTrackTabProps {
  agreements: Agreement[];
  issues: Issue[];
  actionItems: ActionItem[];
  scrumHealthChecks: HealthCheck[];
  templates: Template[];
  healthChecksGrouped: Record<string, HealthCheck[]>;
  teamId: string;
  isMobile: boolean;
}

export const DataTrackTab = ({
  agreements,
  issues,
  actionItems,
  scrumHealthChecks,
  templates,
  healthChecksGrouped,
  teamId,
  isMobile = false,
}: DataTrackTabProps) => {
  const filteredTemplates = templates.filter(
    (template) => template.team_id === teamId || template.team_id === null,
  );

  const stats = [
    {
      title: 'Total Team Agreements',
      value: agreements?.length || 0,
      icon: <Handshake className="h-4 w-4 text-yellow-500 md:h-6 md:w-6" />,
      iconBgColor: 'bg-yellow-500/10',
    },
    {
      title: 'Total Long-term Issues',
      value: issues?.length || 0,
      icon: (
        <BadgeAlert className="h-4 w-4 text-blue-600 md:h-6 md:w-6 dark:text-blue-400" />
      ),
      iconBgColor: 'bg-blue-500/10',
    },
    {
      title: 'Actions Not Done',
      value: actionItems?.length || 0,
      icon: (
        <SquareCheckBig className="h-4 w-4 text-green-600 md:h-6 md:w-6 dark:text-green-400" />
      ),
      iconBgColor: 'bg-green-500/10',
    },
    {
      title: 'Health Checks',
      value: scrumHealthChecks?.length || 0,
      icon: (
        <Calendar className="h-4 w-4 text-orange-600 md:h-6 md:w-6 dark:text-orange-400" />
      ),
      iconBgColor: 'bg-orange-500/10',
    },
  ];

  return (
    <div className="flex flex-col gap-4 p-2">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {stats.map((stat, index) => (
          <TeamStatCard
            key={`stat-${index}`}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            iconBgColor={stat.iconBgColor}
            isMobile={isMobile}
          />
        ))}
      </div>

      {/* Render TeamHealthTrend and CategoryHealth for each template */}
      {filteredTemplates.map((template) => {
        const healthChecks = healthChecksGrouped[template.id];

        return (
          <div key={template.id} className="flex flex-col gap-4">
            {/* Template Header */}
            <div className="border-b pt-6 pb-3 md:pt-8">
              <h3 className="text-center text-lg font-bold text-gray-900 md:text-left md:text-2xl dark:text-gray-100">
                {template.name}
              </h3>
            </div>

            <TeamHealthTrend healthChecks={healthChecks} isMobile={isMobile} />
            <CategoryHealth healthChecks={healthChecks} />
          </div>
        );
      })}
    </div>
  );
};
