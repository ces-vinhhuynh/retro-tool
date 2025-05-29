import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { FAILED_TO_DELETE_TEAM } from '@/utils/messages';

import { teamService } from '../api/team';

export function useDeleteTeam() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => teamService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-teams'] });
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
    onError: () => {
      toast.error(FAILED_TO_DELETE_TEAM);
    },
  });

  return { mutate, isPending };
}
