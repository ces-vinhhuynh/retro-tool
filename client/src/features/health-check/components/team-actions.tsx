import { CircleCheck } from 'lucide-react';

import { ActionItemWithAssignees, User } from '../types/health-check';

import ActionItems from './action-items';
import SubMenuWrapper from './sub-menu-wrapper';

interface TeamActionsProps {
  className?: string;
  actionItems: ActionItemWithAssignees[];
  teamId: string;
  healthCheckId: string;
  teamMembers: User[];
  isAdmin?: boolean;
}

const TeamActions = ({
  className,
  actionItems,
  teamId,
  healthCheckId,
  teamMembers,
  isAdmin = false,
}: TeamActionsProps) => {
  return (
    <SubMenuWrapper
      Icon={CircleCheck}
      title="Team Actions"
      className={className}
    >
      <ActionItems
        actionItems={actionItems}
        healthCheckId={healthCheckId}
        teamId={teamId}
        teamMembers={teamMembers}
        isAdmin={isAdmin}
      />
    </SubMenuWrapper>
  );
};

export default TeamActions;
