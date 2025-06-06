'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';

import { Layout } from '@/components/layout/layout';
import InviteModal from '@/components/modal/invite-modal';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { DataTable } from '@/features/workspace/components/data-table';
import UserCard from '@/features/workspace/components/user-card';
import { useColumns } from '@/features/workspace/components/user-table/columns';
import { WORKSPACE_ROLES } from '@/features/workspace/constants/user';
import { useDeleteWorkspaceUser } from '@/features/workspace/hooks/use-delete-workspace-user';
import { useGetWorkspaceMembers } from '@/features/workspace/hooks/use-get-workspace-members';
import { useInviteUserToWorkspace } from '@/features/workspace/hooks/use-invite-user-to-workspace';
import { useUpdateWorkspaceUser } from '@/features/workspace/hooks/use-update-workspace-user';
import { useGetWorkspaceUser } from '@/features/workspace/hooks/use-workspace-user';
import { MESSAGE } from '@/utils/messages';

export default function WorkspacePage() {
  const { id: workspaceId } = useParams<{ id: string }>();
  const { data: workspaceUsers = [] } = useGetWorkspaceMembers(workspaceId);
  const { mutate: deleteWorkspaceUser } = useDeleteWorkspaceUser();
  const { mutate: updateWorkspaceUser } = useUpdateWorkspaceUser();
  const { mutate: inviteUserToWorkspace, isPending } =
    useInviteUserToWorkspace();

  const [isOpenModalInvite, setIsOpenModalInvite] = useState(false);
  const { data: currentUser } = useCurrentUser();

  const { data: workspaceUser } = useGetWorkspaceUser(
    workspaceId,
    currentUser?.id || '',
  );

  const isOwnerOrAdmin =
    workspaceUser?.role === WORKSPACE_ROLES.owner ||
    workspaceUser?.role === WORKSPACE_ROLES.admin;

  const columns = useColumns(isOwnerOrAdmin);

  const handleClose = () => {
    setIsOpenModalInvite(!isOpenModalInvite);
  };

  const handleInvite = async (email: string) => {
    inviteUserToWorkspace({
      email,
      workspaceId,
    });

    handleClose();
  };

  return (
    <Layout>
      <div className="flex flex-col gap-3 p-3 sm:px-4 md:px-8 md:py-8 lg:px-10">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-xl font-bold md:text-2xl">User Management</h1>
          <div className="mb-1 sm:mb-0">
            {isOwnerOrAdmin && (
              <>
                <Button
                  variant="default"
                  className="primary h-8 rounded-md md:h-10 md:text-base"
                  onClick={() => setIsOpenModalInvite(true)}
                >
                  Invite User
                </Button>
                <InviteModal
                  open={isOpenModalInvite}
                  onClose={handleClose}
                  onSubmit={handleInvite}
                  isLoading={isPending}
                  title={MESSAGE.INVITE_TO_WORKSPACE_TITLE}
                  description={MESSAGE.INVITE_TO_WORKSPACE_DESCRIPTION}
                />
              </>
            )}
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
                isOwnerOrAdmin={isOwnerOrAdmin}
                currentUserRole={workspaceUser?.role as WORKSPACE_ROLES}
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
