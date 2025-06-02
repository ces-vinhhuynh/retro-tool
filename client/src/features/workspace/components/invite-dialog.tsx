'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
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
import { inviteSchema } from '@/features/workspace/schema/workspace-user.schema';

type InviteFormData = z.infer<typeof inviteSchema>;

interface InviteDialogProps {
  open: boolean;
  onClose: () => void;
  onInvite: (email: string) => void;
  isPending: boolean;
}

const InviteDialog = ({
  open,
  onClose,
  onInvite,
  isPending,
}: InviteDialogProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
  });

  const onSubmit = async (data: InviteFormData) => {
    const { email } = data;
    onInvite(email);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="primary h-8 rounded-md md:h-10 md:text-base"
        >
          Invite User
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-lg">
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
            <Button type="submit" disabled={isSubmitting || isPending}>
              {isSubmitting || isPending ? 'Sending...' : 'Send Invite'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteDialog;
