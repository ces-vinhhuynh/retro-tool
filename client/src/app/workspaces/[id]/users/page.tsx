'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Layout } from '@/components/layout/layout';
import InviteDialog from '@/features/workspace/components/invite-dialog';
import { columns } from '@/features/workspace/components/user-table/columns';
import { DataTable } from '@/features/workspace/components/user-table/data-table';
import { useCreateWorkspaceUser } from '@/features/workspace/hooks/use-create-workspace-user';
import { useGetUsers } from '@/features/workspace/hooks/use-get-users';
import { useGetWorkspaceMembers } from '@/features/workspace/hooks/use-get-workspace-members';
import { Role } from '@/features/workspace/utils/role';

export default function WorkspacePage() {
  const { id: workspaceId } = useParams<{ id: string }>();
  const { data: workspace = [] } = useGetWorkspaceMembers(workspaceId);

  const { mutate: createWorkspaceUser } = useCreateWorkspaceUser();

  const [open, setOpen] = useState(false);

  const { data: users } = useGetUsers();

  const handleClose = () => {
    setOpen(!open);
  };

  const handleInvite = async (email: string) => {
    const user = users?.find((user) => user.email === email);

    createWorkspaceUser({
      workspaceId,
      userId: user?.id ?? email,
      token: uuidv4(),
      role: Role.MEMBER,
    });

    handleClose();
  };

  return (
    <Layout>
      <div className="flex flex-col gap-3 p-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">User Management</h1>
          <InviteDialog
            open={open}
            onClose={handleClose}
            onInvite={handleInvite}
          />
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
