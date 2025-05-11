'use client';

import { useParams } from 'next/navigation';
import React from 'react';

import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import HealthCheckSteps from '@/features/health-check/components/health-check-steps';
import { useHealthCheck, useHealthCheckMutations } from '@/features/health-check/hooks/use-health-check';
import { useHealthCheckSubscription } from '@/features/health-check/hooks/use-health-check-subscription';

export default function HealthCheckPage() {
  const { id } = useParams();
  const { healthCheck, isLoading, error } = useHealthCheckSubscription(
    id as string
  );

  const { data: currentUser } = useCurrentUser();
  const { data: healthCheckData } = useHealthCheck(id as string);
  const { updateHealthCheck } = useHealthCheckMutations();

  const isFacilitator = currentUser?.id === healthCheckData?.facilitator_id;

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
      <div className="flex justify-between items-center">
        <HealthCheckSteps
          currentStep={healthCheck.current_step || 1}
          healthCheckId={healthCheck.id}
          isFacilitator={isFacilitator}
          updateHealthCheck={updateHealthCheck}
        />
      </div>
    </div>
  );
}
