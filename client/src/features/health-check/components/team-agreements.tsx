import { Handshake } from 'lucide-react';

import { Agreement } from '../types/agreements';

import EntryList from './entry-list';
import SubMenuWrapper from './sub-menu-wrapper';

interface TeamAgreementsProps {
  isOpen: boolean;
  className?: string;
  agreements: Agreement[];
  handleCreateAgreement: (title: string) => void;
  handleDeleteAgreement: (id: string) => void;
  isLoadingAgreements: boolean;
}

const TeamAgreements = ({
  isOpen,
  className,
  agreements,
  handleCreateAgreement,
  handleDeleteAgreement,
  isLoadingAgreements,
}: TeamAgreementsProps) => {
  return (
    <SubMenuWrapper
      Icon={Handshake}
      title="Team Agreements"
      isOpen={isOpen}
      className={className}
    >
      <EntryList
        items={agreements}
        emptyItemMessage="No agreements yet"
        Icon={Handshake}
        handleAddItem={handleCreateAgreement}
        handleDeleteItem={handleDeleteAgreement}
        isLoading={isLoadingAgreements}
      />
    </SubMenuWrapper>
  );
};

export default TeamAgreements;
