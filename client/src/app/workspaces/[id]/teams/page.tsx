'use client';

import { useParams } from 'next/navigation';

import { Layout } from '@/components/layout/layout';
import { Button } from '@/components/ui/button';
import { columns } from '@/features/workspace/components/team-table/columns';
import { DataTable } from '@/features/workspace/components/user-table/data-table';
import { useGetWorkspaceTeams } from '@/features/workspace/hooks/use-get-workspace-teams';

export default function WorkspacePage() {
  const { id: workspaceId } = useParams<{ id: string }>();
  const { data: teams = [] } = useGetWorkspaceTeams(workspaceId);

  return (
    <Layout>
      <div className="flex flex-col gap-3 p-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Teams Management</h1>
          <Button className="primary">Create Team</Button>
        </div>
        <div className="flex flex-col gap-8 rounded-xl bg-white p-5">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold">All Teams</h2>
            <p>Manage teams and track their health</p>
          </div>
          <DataTable columns={columns} data={teams} />
        </div>
      </div>
    </Layout>
  );
}
