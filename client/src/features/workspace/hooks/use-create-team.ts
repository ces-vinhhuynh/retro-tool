import { useMutation, useQueryClient } from '@tanstack/react-query';

import { teamService } from '../api/team';
import { TeamInsert } from '../types/team';

export function useCreateTeam() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (team: TeamInsert) => teamService.create(team),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-teams'] });
    },
  });

  return { mutate, isPending };
}
