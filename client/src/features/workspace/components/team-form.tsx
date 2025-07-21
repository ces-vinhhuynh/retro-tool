import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { WorkspaceTeamFormValues } from '../schema/workspace-team.schema';

export const TeamForm = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<WorkspaceTeamFormValues>();

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="teamName">Team Name</Label>
        <Input
          id="teamName"
          {...register('team.teamName')}
          placeholder="Enter team name"
          type="text"
          required
        />
        {errors.team?.teamName && (
          <span className="text-xs text-red-500">
            {errors.team.teamName.message as string}
          </span>
        )}
      </div>
    </div>
  );
};
