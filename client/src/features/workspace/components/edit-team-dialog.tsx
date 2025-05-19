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
    defaultValues: {
      teamName: '',
    },
    mode: 'onSubmit',
  });

  const {
    register,
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="primary">
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
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
