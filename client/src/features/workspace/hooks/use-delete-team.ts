import { useMutation, useQueryClient } from '@tanstack/react-query';

import { teamService } from '../api/team';

export function useDeleteTeam() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => teamService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-teams'] });
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });

  return { mutate, isPending };
}
