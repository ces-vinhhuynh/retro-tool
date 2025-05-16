import { Layout } from '@/components/layout/layout';
import { Button } from '@/components/ui/button';
import {
  columns,
  WorkspaceUser,
} from '@/features/workspace/components/user-table/columns';
import { DataTable } from '@/features/workspace/components/user-table/data-table';

// TODO: Fetch data from hook
function getData(): WorkspaceUser[] {
  return [
    {
      id: '728ed52f',
      avatar_url: '',
      full_name: 'string',
      email: 'string',
      role: 'admin',
      projects: ['sdf', 'sd'],
    },
    {
      id: '728ed52f',
      avatar_url: '',
      full_name: 'string',
      email: 'string',
      role: 'owner',
      projects: ['sdf', 'sd'],
    },
    {
      id: '728ed52f',
      avatar_url: '',
      full_name: 'string',
      email: 'string',
      role: 'member',
      projects: ['sdf', 'sd'],
    },
    {
      id: '728ed52f',
      avatar_url: '',
      full_name: 'string',
      email: 'string',
      role: 'member',
      projects: ['sdf', 'sd'],
    },
    {
      id: '728ed52f',
      avatar_url: '',
      full_name: 'string',
      email: 'string',
      role: 'member',
      projects: ['sdf', 'sd'],
    },
  ];
}

export default function WorkspacePage({
  params: _params,
}: {
  params: Promise<{ id: string }>;
}) {
  const data = getData();

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
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </Layout>
  );
}
