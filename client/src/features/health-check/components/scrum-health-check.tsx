'use client';

import { useState } from 'react';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { useHealthCheckTransform } from '../hooks/use-health-check-transform';
import { useResponseByHealthChecks } from '../hooks/use-response-by-health-checks';
import { HealthCheckWithTemplate } from '../types/health-check';

import HealthCheckBreakdownView from './health-check-breakdown-view';
import HealthCheckTableView from './health-check-table-view';

interface ScrumHealthCheckProps {
  scrumHealthChecks: HealthCheckWithTemplate[];
  isShowAddNew?: boolean;
  onAddNewSession?: () => void;
  isShowTitle?: boolean;
}

const ScrumHealthCheck = ({
  scrumHealthChecks = [],
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
      <div className="flex items-center justify-between gap-x-3">
        {isShowTitle && title && (
          <h2 className="py-3 text-2xl font-bold text-gray-900">{title}</h2>
        )}
        <div className="flex items-center gap-3">
          <Label className="text-sm font-medium text-gray-700 uppercase">
            Show Breakdown
          </Label>
          <Switch
            checked={showBreakdown}
            onCheckedChange={setShowBreakdown}
            className="data-[state=checked]:bg-ces-orange-500"
          />
        </div>
      </div>

      {!showBreakdown ? (
        <HealthCheckTableView
          healthChecks={healthChecks}
          getHealthCheckRatings={getRatings}
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
  );
};

export default ScrumHealthCheck;
