import { useQuery } from '@tanstack/react-query';

import supabaseClient from '@/lib/supabase/client';

import { ActionItemWithAssignees } from '../types/health-check';

async function getActionItemWithAssigneesById(actionId: string): Promise<ActionItemWithAssignees> {
  const { data, error } = await supabaseClient
    .from('action_items')
    .select(`
      *,
      action_item_assignees (*)
    `)
    .eq('id', actionId)
    .single();

  if (error) throw error;
  return data as ActionItemWithAssignees;
};

export const useGetActionItemWithAssignees = (actionId: string) => {
  const query = useQuery({
    queryKey: ['action-item-with-assignees', actionId],
    queryFn: () => getActionItemWithAssigneesById(actionId),
    enabled: !!actionId,
  });

  return query;
};