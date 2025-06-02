'use client';

import { Layout } from '@/components/layout/layout';

export default function WorkspacePage({
  params: _params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Layout>
      <div className="flex flex-col gap-3 p-3 sm:px-4 md:px-8 md:py-8 lg:px-10">
        <div className="flex justify-between">
          <div className="">
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-sm text-gray-500">
              Track your team health and recent retrospectives
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
