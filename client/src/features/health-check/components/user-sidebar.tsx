import { ArrowRight, ChevronLeft, Plus, Users } from 'lucide-react';
import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useWelcomeModalStore } from '@/features/health-check/stores/welcome-modal-store';
import { cn } from '@/lib/utils';

import { useGetParticipants } from '../hooks/use-get-participants';
import { useSubMenuStore } from '../stores/sub-menu-store';
import { HealthCheck, ParticipantWithUser } from '../types/health-check';

interface UserSidebarProps {
  isOpen: boolean;
  healthCheckId: string;
  className?: string;
  healthCheck: HealthCheck;
}

const UserItem = ({ participant }: { participant: ParticipantWithUser }) => (
  <div className="flex items-center space-x-3 rounded-md p-2 transition-colors hover:bg-gray-100">
    <Avatar>
      <AvatarImage
        src={participant.user.avatar_url ?? ''}
        alt={participant.user.full_name ?? 'User'}
        className="h-8 w-8 bg-gray-300"
      />
      <AvatarFallback>
        {participant.user.full_name?.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
    <div className="min-w-0 flex-1">
      <div className="flex items-center justify-between">
        <p className="truncate text-sm font-medium">
          {participant.user.full_name}
        </p>
        <span className="text-ces-orange-600 text-xs font-medium">
          {participant.progress} %
        </span>
      </div>
      <div className="mt-1 w-full">
        <Progress value={participant.progress} className="h-1.5" />
      </div>
    </div>
  </div>
);

const UserSidebar = ({
  isOpen,
  healthCheckId,
  className,
  healthCheck,
}: UserSidebarProps) => {
  const { facilitator_id } = healthCheck;

  const { open: openWelcomeModal } = useWelcomeModalStore();
  const { setSelectedSubmenu } = useSubMenuStore();

  const { data: participants } = useGetParticipants(healthCheckId);

  const totalMembers = participants?.length ?? 0;

  const handleInviteClick = () => {
    openWelcomeModal(healthCheckId);
  };

  const facilitators = participants?.filter(
    (participant) => participant.user_id === facilitator_id,
  );

  const participantsFiltered = participants?.filter(
    (participant) => participant.user_id !== facilitator_id,
  );

  return (
    <div
      className={cn(
        'top-0 h-full w-100 overflow-hidden rounded-2xl bg-white transition-all duration-500 ease-in-out',
        className,
      )}
    >
      <div className="flex h-full flex-col rounded-2xl">
        <div className="flex items-center justify-between border-b p-4">
          <Button
            variant="ghost"
            onClick={() => setSelectedSubmenu('')}
            className="text-gray-500 transition-colors hover:text-gray-700"
          >
            {isOpen ? (
              <ArrowRight size={18} />
            ) : (
              <ChevronLeft size={18} className="hidden md:block" />
            )}
          </Button>
          <div
            className={cn(
              'flex items-center space-x-2',
              !isOpen && 'md:hidden',
            )}
          >
            <Users size={20} className="text-sidebar-primary" />
            <span className="font-medium">{totalMembers} Members</span>
          </div>
          {!isOpen && (
            <Users
              size={20}
              className="text-sidebar-primary mx-auto hidden md:block"
            />
          )}
        </div>

        <div className="flex flex-1 flex-col rounded-2xl">
          <div className={cn('p-4', !isOpen && 'md:hidden')}>
            <Button
              variant="default"
              className="flex w-full items-center justify-center gap-2 bg-[#E15D2F] font-medium text-white hover:bg-[#d04e22]"
              onClick={handleInviteClick}
            >
              <Plus size={16} />
              Invite participants
            </Button>
          </div>
          {!isOpen && (
            <div className="hidden justify-center p-4 md:flex">
              <Button
                size="icon"
                className="bg-[#E15D2F] text-white hover:bg-[#d04e22]"
                onClick={handleInviteClick}
              >
                <Plus size={16} />
              </Button>
            </div>
          )}

          <div className="flex flex-1 flex-col overflow-auto rounded-2xl p-4">
            {isOpen && (
              <>
                <div className="mb-6">
                  <h3 className="mb-2 text-xs font-semibold text-gray-500 uppercase">
                    Facilitators
                  </h3>
                  <div className="space-y-2">
                    {facilitators?.map((facilitator) => (
                      <UserItem
                        key={facilitator.user_id}
                        participant={facilitator}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex min-h-0 flex-1 flex-col">
                  <h3 className="mb-2 text-xs font-semibold text-gray-500 uppercase">
                    Participants
                  </h3>
                  <div className="max-h-3/6 flex-1 space-y-2 overflow-y-auto">
                    {participantsFiltered?.map((participant) => (
                      <UserItem
                        key={participant.user_id}
                        participant={participant}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;
