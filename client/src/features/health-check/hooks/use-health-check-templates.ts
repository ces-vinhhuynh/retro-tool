import { useQuery } from '@tanstack/react-query';

import { templateService } from '../api/templates';

export function useTemplates() {
  return useQuery({
    queryKey: ['templates'],
    queryFn: () => templateService.getAll(),
  });
}

export function useTemplateById(id: string) {
  return useQuery({
    queryKey: ['template', id],
    queryFn: () => (templateService.getById(id)),
    enabled: !!id,
  });
}
