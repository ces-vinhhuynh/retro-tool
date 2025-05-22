import { CircleCheck } from 'lucide-react';

import { ActionItem } from '../types/health-check';

import ActionItems from './action-items';
import SubMenuWrapper from './sub-menu-wrapper';

interface TeamActionsProps {
  isOpen: boolean;
  className?: string;
  actionItems: ActionItem[];
  teamId: string;
  healthCheckId: string;
}

const TeamActions = ({
  isOpen,
  className,
  actionItems,
  teamId,
  healthCheckId,
}: TeamActionsProps) => {
  return (
    <SubMenuWrapper
      Icon={CircleCheck}
      title="Team Actions"
      isOpen={isOpen}
      className={className}
    >
      <ActionItems
        actionItems={actionItems}
        healthCheckId={healthCheckId}
        teamId={teamId}
      />
    </SubMenuWrapper>
  );
};

export default TeamActions;
