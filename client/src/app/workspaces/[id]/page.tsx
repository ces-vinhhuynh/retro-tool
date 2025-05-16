'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

import { Layout } from '@/components/layout/layout';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateWorkspaceUser } from '@/features/workspace/hooks/use-create-workspace-user';
import { useGetUsers } from '@/features/workspace/hooks/use-get-users';
import { inviteSchema } from '@/features/workspace/schema/workspace-user.schema';
import { Role } from '@/features/workspace/utils/role';

type InviteFormData = z.infer<typeof inviteSchema>;

export default function WorkspacePage({
  params: _params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: workspaceId } = useParams<{ id: string }>();

  const [open, setOpen] = useState(false);

  const { mutate: createWorkspaceUser } = useCreateWorkspaceUser();
  const { data: users } = useGetUsers();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
  });

  const onSubmit = async (data: InviteFormData) => {
    const { email } = data;
    const user = users?.find((user) => user.email === email);

    createWorkspaceUser({
      id: uuidv4(),
      workspaceId,
      userId: user?.id || email,
      // handle token with JWT contain email, workspaceId, expired date
      token: uuidv4(),
      role: Role.MEMBER,
    });

    handleClose();
  };

  const handleClose = () => {
    reset();
    setOpen(!open);
  };

  return (
    <Layout>
      <div className="flex flex-col gap-4 py-4">
        <div className="flex justify-between">
          <div className="">
            <h1 className="text-2xl font-bold">Welcome back,</h1>
            <p className="text-sm text-gray-500">
              Track your team health and recent retrospectives
            </p>
          </div>
          <Dialog open={open} onOpenChange={handleClose}>
            <DialogTrigger asChild>
              <Button variant="default">Invite Member</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite to Workspace</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="p-2">
                <div className="bg-ces-orange-100 rounded-md p-4 text-gray-700">
                  <span>
                    Send email invites to your team members so they can join and
                    start collaborating instantly.
                  </span>
                </div>
                <div className="flex items-end justify-between gap-2 pt-4">
                  <div className="flex-1">
                    <Label htmlFor="email" className="pb-2">
                      Email
                    </Label>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@example.com"
                          {...field}
                          value={field.value || ''}
                          aria-invalid={errors.email ? 'true' : 'false'}
                        />
                      )}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Invite'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
}
