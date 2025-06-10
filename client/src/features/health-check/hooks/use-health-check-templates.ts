import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { templateService } from '../api/templates';
import { TemplateInsert, TemplateUpdate } from '../types/templates';

export function useTemplates() {
  return useQuery({
    queryKey: ['templates'],
    queryFn: () => templateService.getAll(),
  });
}

export function useGetTemplateById(id: string) {
  return useQuery({
    queryKey: ['template', id],
    queryFn: () => templateService.getById(id),
    enabled: !!id,
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (template: TemplateInsert) => templateService.create(template),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      queryClient.invalidateQueries({
        queryKey: ['health-check-templates', data.team_id],
      });
      toast.success('Template created successfully');
    },
    onError: () => {
      toast.error('Failed to create template');
    },
  });
}

export function useUpdateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      templateId,
      template,
    }: {
      templateId: string;
      template: TemplateUpdate;
    }) => templateService.updateCustomTemplate(templateId, template),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      queryClient.invalidateQueries({
        queryKey: ['health-check-templates', data.team_id],
      });
      queryClient.invalidateQueries({
        queryKey: ['query-health-check-by-team', data.team_id],
      });
      toast.success('Template updated successfully');
    },
    onError: () => {
      toast.error('Failed to update template');
    },
  });
}
