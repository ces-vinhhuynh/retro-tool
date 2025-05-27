import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { agreementsService } from '../../api/agreements';
import { AgreementInsert } from '../../types/agreements';

export const useAgreementMutation = () => {
  const createAgreement = (agreement: AgreementInsert) => {
    return agreementsService.create(agreement);
  };

  const deleteAgreement = (id: string) => {
    return agreementsService.delete(id);
  };

  const { mutate: createAgreements, isPending: isCreating } = useMutation({
    mutationFn: createAgreement,
    onSuccess: () => {
      //TODO: Handle success right here
    },
    onError: (error) => {
      toast.error('Failed to create agreement', {
        description: error.message,
      });
    },
  });

  const { mutate: deleteAgreements, isPending: isDeleting } = useMutation({
    mutationFn: deleteAgreement,
    onSuccess: () => {
      //TODO: Handle success right here
    },
    onError: (error) => {
      toast.error('Failed to create agreement', {
        description: error.message,
      });
    },
  });

  return {
    createAgreements,
    deleteAgreements,
    isLoading: isCreating || isDeleting,
  };
};
