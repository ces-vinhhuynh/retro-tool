import { useMutation, useQueryClient } from '@tanstack/react-query';

import { workspaceUsersService } from '../api/workspace-users';

export const useDeleteWorkspaceUser = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => workspaceUsersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['workspace-users'],
      });
    },
  });

  return { mutate, isPending };
};
