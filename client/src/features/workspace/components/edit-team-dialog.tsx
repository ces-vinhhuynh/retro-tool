'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil } from 'lucide-react';
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

import { teamService } from '../api/team';
import { useUpdateTeam } from '../hooks/use-update-team';
import { TeamFormValues, teamSchema } from '../schema/team.schema';

interface EditTeamDialogProps {
  teamId: string;
}

export default function EditTeamDialog({ teamId }: EditTeamDialogProps) {
  const [open, setOpen] = useState(false);

  const { mutate: updateTeam, isPending } = useUpdateTeam();

  const methods = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema),
    defaultValues: async () => {
      const team = await teamService.getById(teamId);
      return {
        teamName: team?.name || '',
      };
    },
    mode: 'onSubmit',
  });

  const {
    register,
    reset,
    formState: { errors },
  } = methods;

  const handleSubmit = async (data: TeamFormValues) => {
    updateTeam({
      id: teamId,
      team: { name: data.teamName },
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
        <Button
          variant="ghost"
          className="primary hover:text-ces-orange-500 p-0 hover:bg-transparent"
        >
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-lg sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Team</DialogTitle>
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

            <Button
              className="bg-ces-orange-500 hover:bg-ces-orange-600"
              type="submit"
              disabled={isPending}
            >
              Update Team
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
