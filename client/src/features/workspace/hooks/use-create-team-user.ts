import { useMutation, useQueryClient } from '@tanstack/react-query';

import { TeamUserInsert } from '@/types/team';

import { teamUsersService } from '../api/team-users';

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
