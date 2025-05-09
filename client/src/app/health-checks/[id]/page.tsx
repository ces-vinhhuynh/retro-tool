'use client';

import { useParams } from 'next/navigation';

import DiscussPhase from '@/features/health-check/components/discuss-phase';
import { useHealthCheck } from '@/features/health-check/hooks/use-health-check';
import { useResponse } from '@/features/health-check/hooks/use-response';
import { HealthCheckWithTemplate } from '@/features/health-check/types/health-check';

export default function HealthCheckPage() {
  const { id } = useParams<{ id: string }>();
  const { healthCheck } = useHealthCheck(id);
  const { responses } = useResponse(id);

  const data = healthCheck as HealthCheckWithTemplate;

  if (!data || !responses) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <DiscussPhase
        healthCheck={data}
        questions={data?.template?.questions}
        responses={responses}
      />
    </div>
  );
}
