'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  InviteViaEmailSchema,
  inviteViaEmailSchema,
} from '@/schema/invite-via-email.schema';

interface InviteModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
  title: string;
  description: string;
  isLoading: boolean;
}

const InviteModal = ({
  open,
  onClose,
  onSubmit,
  title,
  description,
  isLoading,
}: InviteModalProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteViaEmailSchema>({
    resolver: zodResolver(inviteViaEmailSchema),
  });

  const handleFormSubmit = async (data: InviteViaEmailSchema) => {
    onSubmit(data.email.trim());
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        onClose();
        reset();
      }}
    >
      <DialogContent className="rounded-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-2">
          <div className="bg-rhino-100 rounded-md p-4 text-gray-700">
            <span>{description}</span>
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
            <Button type="submit" disabled={isSubmitting || isLoading}>
              {isSubmitting || isLoading ? 'Sending...' : 'Send Invite'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;
