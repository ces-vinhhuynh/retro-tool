import { FunctionsHttpError } from '@supabase/supabase-js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { workspaceUsersService } from '../api/workspace-users';

export function useInviteUserToWorkspace() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      email,
      workspaceId,
    }: {
      email: string;
      workspaceId: string;
    }) => {
      const { data, error } = await workspaceUsersService.inviteUserToWorkspace(
        email,
        workspaceId,
      );

      if (error) {
        if (error instanceof FunctionsHttpError) {
          const errorMessage = await error.context.json();
          throw new Error(errorMessage.error);
        }
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-users'] });
      toast.success('Invitation sent successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to invite user to workspace', {
        description: error.message,
      });
    },
  });

  return { mutate, isPending };
}
