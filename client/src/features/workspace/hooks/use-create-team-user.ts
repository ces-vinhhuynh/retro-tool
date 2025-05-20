import { useMutation, useQueryClient } from '@tanstack/react-query';

import { teamUsersService } from '../api/team-users';
import { TeamUserInsert } from '../types/team';

export function useCreateTeamUser() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (teamUser: TeamUserInsert) => teamUsersService.create(teamUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
    },
  });

  return { mutate, isPending };
}
