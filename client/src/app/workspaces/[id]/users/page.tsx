'use client';

import { useParams } from 'next/navigation';

import { Layout } from '@/components/layout/layout';
import { Button } from '@/components/ui/button';
import { columns } from '@/features/workspace/components/user-table/columns';
import { DataTable } from '@/features/workspace/components/user-table/data-table';
import { useGetWorkspaceMembers } from '@/features/workspace/hooks/use-get-workspace-members';

export default function WorkspacePage() {
  const { id: workspaceId } = useParams<{ id: string }>();
  const { data: workspace = [] } = useGetWorkspaceMembers(workspaceId);

  return (
    <Layout>
      <div className="flex flex-col gap-3 p-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">User Management</h1>
          <Button className="primary">Invite User</Button>
        </div>
        <div className="flex flex-col gap-8 rounded-xl bg-white p-5">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold">All Users</h2>
            <p>Manage users and their account roles</p>
          </div>
          <DataTable columns={columns} data={workspace} />
        </div>
      </div>
    </Layout>
  );
}
