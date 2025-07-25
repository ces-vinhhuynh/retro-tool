import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

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

import { useCreateTeam } from '../hooks/use-create-team';
import { TeamFormValues, teamSchema } from '../schema/team.schema';

interface CreateTeamDialogProps {
  workspaceId: string;
  children?: React.ReactNode;
}

export const CreateTeamDialog = ({
  workspaceId,
  children,
}: CreateTeamDialogProps) => {
  const [open, setOpen] = useState(false);

  const { mutate: createTeam, isPending } = useCreateTeam();

  const methods = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      teamName: '',
    },
    mode: 'onSubmit',
  });

  const {
    register,
    formState: { errors },
    reset,
  } = methods;

  const handleSubmit = async (data: TeamFormValues) => {
    createTeam({
      name: data.teamName,
      workspace_id: workspaceId,
    });
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        reset();
      }}
    >
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button className="primary h-8 w-full rounded-md sm:w-fit md:h-10 md:text-base">
            <Plus className="h-4 w-4" />
            New Team
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="rounded-lg sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Team</DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form
            className="flex flex-col gap-5"
            onSubmit={methods.handleSubmit(handleSubmit)}
          >
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="teamName">Team Name</Label>
                <Input
                  id="teamName"
                  {...register('teamName')}
                  placeholder="Enter team name"
                  type="text"
                  required
                  autoComplete="off"
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                />
                {errors?.teamName && (
                  <span className="text-xs text-red-500">
                    {errors.teamName.message as string}
                  </span>
                )}
              </div>
            </div>

            <Button type="submit" disabled={isPending}>
              Create Team
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
