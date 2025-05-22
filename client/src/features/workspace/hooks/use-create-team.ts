import { useMutation, useQueryClient } from '@tanstack/react-query';

import { TeamInsert } from '@/types/team';

import { teamService } from '../api/team';

export function useCreateTeam() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (team: TeamInsert) => teamService.create(team),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-teams'] });
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });

  return { mutate, isPending };
}
