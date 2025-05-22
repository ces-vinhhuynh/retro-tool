import { useMutation, useQueryClient } from '@tanstack/react-query';

import { TeamUpdate } from '@/types/team';

import { teamService } from '../api/team';

export function useUpdateTeam() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, team }: { id: string; team: TeamUpdate }) =>
      teamService.update(id, team),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-teams'] });
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });

  return { mutate, isPending };
}
