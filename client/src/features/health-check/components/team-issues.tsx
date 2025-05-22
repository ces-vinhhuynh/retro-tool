import { BadgeAlert } from 'lucide-react';

import SubMenuWrapper from './sub-menu-wrapper';

const TeamIssues = ({
  isOpen,
  className,
}: {
  isOpen: boolean;
  className?: string;
}) => {
  return (
    <SubMenuWrapper
      Icon={BadgeAlert}
      title="Team Issues"
      isOpen={isOpen}
      className={className}
    >
      team agreements
    </SubMenuWrapper>
  );
};

export default TeamIssues;
