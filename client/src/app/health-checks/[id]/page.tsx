'use client';

import { useRouter } from 'next/navigation';

import { Layout } from '@/components/layout/layout';
import { Button } from '@/components/ui/button';

export default function HealthCheckPage({
  params: _params,
}: {
  params: { id: string };
}) {
  const router = useRouter();

  return (
    <Layout>
      <div className="py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Health Check</h1>
          <Button
            variant="outline"
            onClick={() => router.push('/health-checks')}
          >
            Back to Health Checks
          </Button>
        </div>

        <div className="py-12 text-center text-gray-500">
          <p>Health check details will be implemented later.</p>
        </div>
      </div>
    </Layout>
  );
}
