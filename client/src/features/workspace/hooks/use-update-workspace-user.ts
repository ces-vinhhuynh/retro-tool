import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { FAILED_TO_UPDATE_WORKSPACE_USER_ROLE } from '@/utils/messages';

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
    onError: () => {
      toast.error(FAILED_TO_UPDATE_WORKSPACE_USER_ROLE);
    },
  });

  return { mutate, isPending };
};
