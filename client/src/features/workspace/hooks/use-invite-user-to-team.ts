import { FunctionsHttpError } from '@supabase/supabase-js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { teamUsersService } from '../api/team-users';

export function useInviteUserToTeam() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      email,
      teamId,
      workspaceId,
    }: {
      email: string;
      teamId: string;
      workspaceId: string;
    }) => {
      const { data, error } = await teamUsersService.inviteUserToTeam(
        email,
        teamId,
        workspaceId,
      );

      if (error) {
        if (error instanceof FunctionsHttpError) {
          const errorData = await error.context.json();
          throw new Error(errorData.error || error.message);
        }
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error('No data returned from server');
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['team-users'] });
      toast.success(data.isResend ? 'Invitation resent' : 'Invitation sent');
    },
    onError: (error: Error) => {
      toast.error('Failed to invite user to team', {
        description: error.message,
      });
    },
  });

  return { mutate, isPending };
}
