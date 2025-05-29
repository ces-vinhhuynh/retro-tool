import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { TeamUpdate } from '@/types/team';
import { FAILED_TO_UPDATE_TEAM } from '@/utils/messages';

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
    onError: () => {
      toast.error(FAILED_TO_UPDATE_TEAM);
    },
  });

  return { mutate, isPending };
}
