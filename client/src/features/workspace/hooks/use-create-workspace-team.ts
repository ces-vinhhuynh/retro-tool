import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { workspaceService } from '../api/workspace';

export function useCreateWorkspaceTeam() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      workspaceId,
      teamId,
      workspaceName,
      teamName,
    }: {
      workspaceId: string;
      teamId: string;
      workspaceName: string;
      teamName: string;
    }) =>
      workspaceService.createWorkspaceAndTeam(
        workspaceId,
        workspaceName,
        teamId,
        teamName,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      toast.success('Workspace and team created successfully');
    },
    onError: (error) => {
      toast.error('Error creating workspace and team', {
        description: error.message,
      });
    },
  });

  return { mutate, isPending };
}
