'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Layout } from '@/components/layout/layout';
import { DataTable } from '@/features/workspace/components/data-table';
import InviteDialog from '@/features/workspace/components/invite-dialog';
import UserCard from '@/features/workspace/components/user-card';
import { columns } from '@/features/workspace/components/user-table/columns';
import { useCreateWorkspaceUser } from '@/features/workspace/hooks/use-create-workspace-user';
import { useDeleteWorkspaceUser } from '@/features/workspace/hooks/use-delete-workspace-user';
import { useGetUsers } from '@/features/workspace/hooks/use-get-users';
import { useGetWorkspaceMembers } from '@/features/workspace/hooks/use-get-workspace-members';
import { useUpdateWorkspaceUser } from '@/features/workspace/hooks/use-update-workspace-user';
import { Role } from '@/features/workspace/utils/role';

export default function WorkspacePage() {
  const { id: workspaceId } = useParams<{ id: string }>();
  const { data: workspaceUsers = [] } = useGetWorkspaceMembers(workspaceId);
  const { mutate: deleteWorkspaceUser } = useDeleteWorkspaceUser();
  const { mutate: updateWorkspaceUser } = useUpdateWorkspaceUser();
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
      <div className="flex flex-col gap-3 p-3 sm:px-4 md:px-8 md:py-8 lg:px-10">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-xl font-bold md:text-2xl">User Management</h1>
          <div className="mb-1 sm:mb-0">
            <InviteDialog
              open={open}
              onClose={handleClose}
              onInvite={handleInvite}
            />
          </div>
        </div>
        <div className="flex flex-col gap-6 rounded-xl bg-white p-3 shadow-sm sm:p-5">
          <div className="flex flex-col">
            <h2 className="text-lg font-bold md:text-xl">All Users</h2>
            <p className="text-sm text-gray-600">
              Manage users and their account roles
            </p>
          </div>

          {/* Mobile */}
          <div className="flex flex-col gap-3 md:hidden">
            {workspaceUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onDelete={(userId) => deleteWorkspaceUser(userId)}
                onUpdateRole={(role) =>
                  updateWorkspaceUser({
                    id: user.id,
                    workspaceUser: { role },
                  })
                }
              />
            ))}
          </div>

          {/* Desktop */}
          <div className="hidden w-full overflow-x-auto md:block">
            <DataTable columns={columns} data={workspaceUsers} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
