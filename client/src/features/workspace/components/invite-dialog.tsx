'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

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
import { User } from '@/features/health-check/types/health-check';
import { useCreateWorkspaceUser } from '@/features/workspace/hooks/use-create-workspace-user';
import { inviteSchema } from '@/features/workspace/schema/workspace-user.schema';
import { Role } from '@/features/workspace/utils/role';
type InviteFormData = z.infer<typeof inviteSchema>;

interface InviteDialogProps {
  open: boolean;
  onClose: () => void;
  users: User[];
  workspaceId: string;
}

const InviteDialog = ({
  open,
  onClose,
  users,
  workspaceId,
}: InviteDialogProps) => {
  const { mutate: createWorkspaceUser } = useCreateWorkspaceUser();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
  });

  const onSubmit = async (data: InviteFormData) => {
    const { email } = data;
    const user = users.find((user) => user.email === email);

    createWorkspaceUser({
      id: uuidv4(),
      workspaceId,
      userId: user?.id ?? email,
      token: uuidv4(),
      role: Role.MEMBER,
    });

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
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
              Send email invites to your team members so they can join and start
              collaborating instantly.
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
  );
};

export default InviteDialog;
