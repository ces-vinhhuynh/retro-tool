import { useMutation, useQueryClient } from '@tanstack/react-query';

import { workspaceUsersService } from '../api/workspace-users';
import { WorkspaceUserUpdate } from '../types/workspace-users';

export const useUpdateWorkspaceUser = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      id,
      workspaceUser,
    }: {
      id: string;
      workspaceUser: WorkspaceUserUpdate;
    }) => workspaceUsersService.update(id, workspaceUser),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['workspace-users', data.workspace_id],
      });
    },
  });

  return { mutate, isPending };
};
