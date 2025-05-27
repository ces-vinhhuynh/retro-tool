import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { workspaceUsersService } from '../api/workspace-users';
import { Role } from '../utils/role';

export function useCreateWorkspaceUser() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      workspaceId,
      userId,
      token,
      role,
    }: {
      workspaceId: string;
      token: string;
      userId: string;
      role: Role;
    }) => {
      return workspaceUsersService.create({
        workspace_id: workspaceId,
        user_id: userId,
        token,
        status: 'accepted',
        role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      queryClient.invalidateQueries({ queryKey: ['workspace-users'] });
    },
    onError: (error) => {
      toast.error('Error creating workspace and project', {
        description: error.message,
      });
    },
  });

  return { mutate, isPending };
}
