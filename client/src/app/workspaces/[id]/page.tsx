'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Layout } from '@/components/layout/layout';
import InviteDialog from '@/features/workspace/components/invite-dialog';
import { useCreateWorkspaceUser } from '@/features/workspace/hooks/use-create-workspace-user';
import { useGetUsers } from '@/features/workspace/hooks/use-get-users';
import { Role } from '@/features/workspace/utils/role';

export default function WorkspacePage({
  params: _params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: workspaceId } = useParams<{ id: string }>();
  const { mutate: createWorkspaceUser } = useCreateWorkspaceUser();

  const [open, setOpen] = useState(false);

  const { data: users } = useGetUsers();

  const handleClose = () => {
    setOpen(!open);
  };

  const handleInvite = async (email: string) => {
    const user = users?.find((user) => user.email === email);

    createWorkspaceUser({
      id: uuidv4(),
      workspaceId,
      userId: user?.id ?? email,
      token: uuidv4(),
      role: Role.MEMBER,
    });

    handleClose();
  };

  return (
    <Layout>
      <div className="flex flex-col gap-4 py-4">
        <div className="flex justify-between">
          <div className="">
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-sm text-gray-500">
              Track your team health and recent retrospectives
            </p>
          </div>
          <InviteDialog
            open={open}
            onClose={handleClose}
            onInvite={handleInvite}
          />
        </div>
      </div>
    </Layout>
  );
}
