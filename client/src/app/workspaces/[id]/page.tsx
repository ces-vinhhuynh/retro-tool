'use client';

import { Layout } from '@/components/layout/layout';

export default function WorkspacePage({
  params: _params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Layout>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Welcome back,</h1>
        <p className="text-sm text-gray-500">
          Track your team health and recent retrospectives
        </p>
      </div>
    </Layout>
  );
}
