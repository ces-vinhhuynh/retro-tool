import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { issuesService } from '../../api/issues';
import { IssueInsert } from '../../types/issues';

export const useIssuesMutation = () => {
  const createIssueMutation = (issue: IssueInsert) => {
    return issuesService.create(issue);
  };

  const deleteIssueMutation = (id: string) => {
    return issuesService.delete(id);
  };

  const { mutate: createIssue, isPending: isCreating } = useMutation({
    mutationFn: createIssueMutation,
    onSuccess: () => {
      //TODO: Handle success right here
    },
    onError: (error) => {
      toast.error('Failed to create issue', {
        description: error.message,
      });
    },
  });

  const { mutate: deleteIssue, isPending: isDeleting } = useMutation({
    mutationFn: deleteIssueMutation,
    onSuccess: () => {
      //TODO: Handle success right here
    },
    onError: (error) => {
      toast.error('Failed to delete issue', {
        description: error.message,
      });
    },
  });

  return {
    createIssue,
    deleteIssue,
    isLoading: isCreating || isDeleting,
  };
};
