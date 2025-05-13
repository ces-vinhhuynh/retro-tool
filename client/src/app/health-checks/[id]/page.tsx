'use client';

import { useParams } from 'next/navigation';
import React from 'react';

import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import HealthCheckSteps from '@/features/health-check/components/health-check-steps';
import {
  useHealthCheck,
  useHealthCheckMutations,
} from '@/features/health-check/hooks/use-health-check';
import { useHealthCheckSubscription } from '@/features/health-check/hooks/use-health-check-subscription';

export const STEPS = {
  survey: { key: 1, value: 'Survey' },
  discuss: { key: 2, value: 'Discuss' },
  review: { key: 3, value: 'Review' },
  close: { key: 4, value: 'Close' },
};
const FIRST_STEP = STEPS['survey'];

export default function HealthCheckPage() {
  const { id } = useParams();
  const { healthCheck, isLoading, error } = useHealthCheckSubscription(
    id as string,
  );

  const { data: currentUser } = useCurrentUser();
  const { data: healthCheckData } = useHealthCheck(id as string);
  const { updateHealthCheck } = useHealthCheckMutations();

  const isFacilitator = currentUser?.id === healthCheckData?.facilitator_id;

  const handleChangeStep = (newStep: keyof typeof STEPS) => {
    if (!isFacilitator || !healthCheckData) return;

    if (STEPS[newStep].key === healthCheck?.current_step) return;

    updateHealthCheck({
      id: healthCheckData.id,
      healthCheck: {
        current_step: STEPS[newStep].key,
      },
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!healthCheck) {
    return <div>Health check not found</div>;
  }

  return (
    <div className="py-6">
      <div className="flex items-center justify-between">
        <HealthCheckSteps
          currentStep={healthCheck.current_step || FIRST_STEP.key}
          isFacilitator={isFacilitator}
          handleChangeStep={handleChangeStep}
        />
      </div>
    </div>
  );
}
