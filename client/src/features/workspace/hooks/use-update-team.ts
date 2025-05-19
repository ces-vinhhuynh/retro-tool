import { useMutation, useQueryClient } from '@tanstack/react-query';

import { teamService } from '../api/team';
import { TeamUpdate } from '../types/team';

export function useUpdateTeam() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, team }: { id: string; team: TeamUpdate }) =>
      teamService.update(id, team),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-teams'] });
    },
  });

  return { mutate, isPending };
}
