import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { TeamUserUpdate } from '@/types/team';
import { FAILED_TO_UPDATE_TEAM_USER_ROLE } from '@/utils/messages';

import { teamUsersService } from '../api/team-users';

export const useUpdateTeamUser = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, teamUser }: { id: string; teamUser: TeamUserUpdate }) =>
      teamUsersService.update(id, teamUser),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['team-members', data.team_id],
      });
    },
    onError: () => {
      toast.error(FAILED_TO_UPDATE_TEAM_USER_ROLE);
    },
  });

  return { mutate, isPending };
};
