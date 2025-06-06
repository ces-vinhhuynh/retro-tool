'use client';

import { useState, useEffect } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getAvatarCharacters } from '@/utils/user';

import { useUpdateFacilitators } from '../hooks/use-update-facilitators';
import { HealthCheck, ParticipantWithUser } from '../types/health-check';
import { HEALTH_CHECK_ROLE_OPTIONS } from '../utils/constants';

interface ParticipantRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  healthCheck: HealthCheck;
  participant: ParticipantWithUser;
}

const ParticipantRoleDialog = ({
  open,
  onOpenChange,
  participant,
  healthCheck,
}: ParticipantRoleDialogProps) => {
  const [role, setRole] = useState<string>('participant');
  const { mutate: updateFacilitators, isPending } = useUpdateFacilitators();

  useEffect(() => {
    if (participant && healthCheck) {
      const isFacilitator =
        !!participant.user_id &&
        healthCheck.facilitator_ids?.includes(String(participant.user_id));
      setRole(isFacilitator ? 'facilitator' : 'participant');
    }
  }, [participant, healthCheck]);

  const isOnlyFacilitator =
    healthCheck?.facilitator_ids?.length === 1 &&
    healthCheck?.facilitator_ids?.includes(String(participant?.user_id));

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);

    if (!participant || !healthCheck.id || isPending) return;

    const currentFacilitatorIds = Array.isArray(healthCheck.facilitator_ids)
      ? healthCheck.facilitator_ids
      : [];
    const userId = String(participant.user_id);

    const newFacilitatorIds =
      newRole === 'facilitator'
        ? currentFacilitatorIds.includes(userId)
          ? currentFacilitatorIds
          : [...currentFacilitatorIds, userId]
        : currentFacilitatorIds.filter((id) => id !== userId);

    updateFacilitators({
      id: healthCheck.id,
      facilitatorIds: newFacilitatorIds,
    });
    onOpenChange(false);
  };

  if (!participant) return null;

  const { email, full_name, avatar_url } = participant.user;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className="sr-only"></DialogTitle>
      <DialogContent className="w-[90vw] max-w-[40rem] px-4 py-6">
        <div className="flex flex-col items-center gap-3 py-4">
          <Avatar className="h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 xl:h-28 xl:w-28">
            <AvatarImage
              src={avatar_url ?? ''}
              alt={full_name ?? 'User'}
              className="h-full w-full object-cover"
            />
            <AvatarFallback className="text-lg md:text-xl lg:text-2xl">
              {getAvatarCharacters(full_name || 'U')}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center gap-1">
            <p className="text-lg font-medium md:text-xl lg:text-2xl">
              {full_name}
            </p>
            <p className="text-sm text-gray-500 md:text-base lg:text-lg">
              {email}
            </p>
          </div>

          <div className="flex w-full flex-col items-center gap-3 p-4 text-center">
            <Select
              value={role}
              onValueChange={handleRoleChange}
              disabled={isOnlyFacilitator || isPending}
            >
              <SelectTrigger className="w-full p-3 focus:ring-0 focus:ring-offset-0 focus:outline-none md:text-lg lg:p-4 lg:text-xl">
                <SelectValue placeholder="Select a role">
                  <span className="font-medium uppercase">
                    {
                      HEALTH_CHECK_ROLE_OPTIONS.find(
                        (roleOption) => roleOption.value === role,
                      )?.label
                    }
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="w-[var(--radix-select-trigger-width)] md:text-lg lg:text-xl">
                {HEALTH_CHECK_ROLE_OPTIONS.map((role) => (
                  <SelectItem
                    key={role.value}
                    value={role.value}
                    className="cursor-pointer hover:bg-slate-100 data-[state=checked]:bg-slate-100"
                  >
                    <div className="flex flex-col items-start p-2 lg:p-3">
                      <span className="font-medium uppercase">
                        {role.label}
                      </span>
                      <span className="text-muted-foreground text-xs md:text-sm lg:text-base">
                        {role.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {isOnlyFacilitator && (
              <p className="text-center text-xs text-amber-600 md:text-sm lg:text-base">
                Cannot change role - at least one facilitator is required
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParticipantRoleDialog;
