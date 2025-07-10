'use client';

import { useState } from 'react';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { HealthCheckTableResponsiveConfig } from '../constants/health-check-table-config';
import { useHealthCheckTransform } from '../hooks/use-health-check-transform';
import { useResponseByHealthChecks } from '../hooks/use-response-by-health-checks';
import { HealthCheckWithTemplate } from '../types/health-check';

import HealthCheckBreakdownView from './health-check-breakdown-view';
import HealthCheckTableView from './health-check-table-view';

interface ScrumHealthCheckProps {
  scrumHealthChecks: HealthCheckWithTemplate[];
  responsiveConfig?: HealthCheckTableResponsiveConfig;
  isShowAddNew?: boolean;
  onAddNewSession?: () => void;
  isShowTitle?: boolean;
}

const ScrumHealthCheck = ({
  scrumHealthChecks = [],
  responsiveConfig,
  isShowAddNew = false,
  onAddNewSession,
  isShowTitle = true,
}: ScrumHealthCheckProps) => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const { data: scrumResponses = [] } = useResponseByHealthChecks(
    scrumHealthChecks?.map((check) => check.id) || [],
  );

  const { deleted_at, name: title } = scrumHealthChecks[0].template;

  const canStartNewHealthCheck = isShowAddNew && deleted_at === null;

  const { healthChecks, questionData, scoreRange, getRatings } =
    useHealthCheckTransform(scrumHealthChecks, scrumResponses);

  if (!healthChecks?.length) {
    return null;
  }

  return (
    <div className="rounded-lg bg-white">
      {/* Header with title and toggle */}
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-2">
        {isShowTitle && title && (
          <h2 className="text-lg font-bold text-gray-900 md:text-xl lg:text-2xl">
            {title}
          </h2>
        )}

        {/* Toggle Switch */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <Label className="text-xs font-medium text-gray-700 uppercase md:text-sm">
            Show Breakdown
          </Label>
          <Switch
            checked={showBreakdown}
            onCheckedChange={setShowBreakdown}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </div>

      {/* Content */}
      <div className="w-full">
        {!showBreakdown ? (
          <HealthCheckTableView
            healthChecks={healthChecks}
            getHealthCheckRatings={getRatings}
            responsiveConfig={responsiveConfig}
            isShowAddNew={canStartNewHealthCheck}
            onAddNewSession={onAddNewSession}
          />
        ) : (
          <HealthCheckBreakdownView
            healthChecks={healthChecks}
            questionData={questionData}
            scoreRange={scoreRange}
            isShowAddNew={canStartNewHealthCheck}
            onAddNewSession={onAddNewSession}
            getRatings={getRatings}
          />
        )}
      </div>
    </div>
  );
};

export default ScrumHealthCheck;
