import { Handshake } from 'lucide-react';

import SubMenuWrapper from './sub-menu-wrapper';

const TeamAgreements = ({
  isOpen,
  className,
}: {
  isOpen: boolean;
  className?: string;
}) => {
  return (
    <SubMenuWrapper
      Icon={Handshake}
      title="Team Agreements"
      isOpen={isOpen}
      className={className}
    >
      team agreements
    </SubMenuWrapper>
  );
};

export default TeamAgreements;
