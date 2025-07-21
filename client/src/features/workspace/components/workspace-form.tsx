import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { WorkspaceTeamFormValues } from '../schema/workspace-team.schema';

export const WorkspaceForm = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<WorkspaceTeamFormValues>();

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="workspaceName">Workspace Name</Label>
        <Input
          id="workspaceName"
          {...register('workspace.workspaceName')}
          placeholder="Enter workspace name"
          type="text"
        />
        {errors.workspace?.workspaceName && (
          <span className="text-xs text-red-500">
            {errors.workspace.workspaceName.message as string}
          </span>
        )}
      </div>
    </div>
  );
};
