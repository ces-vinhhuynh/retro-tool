'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  HealthCheck,
  HealthCheckWithTeam,
  ParticipantWithUser,
} from '@/features/health-check/types/health-check';
import { Template } from '@/features/health-check/types/templates';
import { DataTable } from '@/features/workspace/components/data-table';
import { useInviteUserToTeam } from '@/features/workspace/hooks/use-invite-user-to-team';

import { TeamMember, useColumns } from '../invite-table/columns';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  healthCheck: HealthCheckWithTeam;
  template?: Template | null;
  teamMembers: TeamMember[];
  facilitatorIds: string[];
  participants: ParticipantWithUser[];
  handleInviteUser: (userIds: string[]) => void;
  isInviting: boolean;
  healthCheckId: string;
}

const emailSchema = z.string().email();

const WelcomeModal = ({
  isOpen,
  onClose,
  healthCheck,
  template,
  teamMembers,
  facilitatorIds,
  participants,
  handleInviteUser,
  isInviting,
  healthCheckId,
}: WelcomeModalProps) => {
  const [copied, setCopied] = useState(false);
  const [inviteIds, setInviteIds] = useState<string[]>([]);
  const pathname = usePathname();
  const [sessionLink, setSessionLink] = useState('');
  const participantIds = participants.map(({ user_id }) => user_id);

  // const { data: healthCheck, isLoading: isLoadingHealthCheck } = useHealthCheck(
  //     isHealthCheckRoute ? params.id : '',
  //   );
  //   const healthCheckData = healthCheck as HealthCheckWithTeam;

  const { mutate: inviteUserToTeam } = useInviteUserToTeam();

  useEffect(() => {
    // Use the current URL as the session link
    if (typeof window !== 'undefined') {
      setSessionLink(window.location.origin + pathname);
    }
  }, [pathname]);

  const handleCopy = () => {
    navigator.clipboard.writeText(sessionLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddUser = (id: string) => {
    const newInviteIds = [...inviteIds];
    newInviteIds.push(id);

    setInviteIds(newInviteIds);
  };

  const handleRemoveUser = (id: string) => {
    const newInviteIds = [...inviteIds];
    const index = newInviteIds.indexOf(id);
    if (index !== -1) {
      newInviteIds.splice(index, 1);
    }

    setInviteIds(newInviteIds);
  };

  const columns = useColumns(
    facilitatorIds,
    (healthCheck?.invited_user_ids as string[]) || [],
    participantIds,
    inviteIds,
    handleAddUser,
    handleRemoveUser,
    handleInviteUser,
    healthCheckId,
  );

  const handleInviteUsers = () => {
    handleInviteUser(inviteIds);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;

    e.preventDefault();
    const inputEl = e.currentTarget;
    const raw = inputEl.value;

    const tokens = raw.split(/[\s,]+/).filter(Boolean);

    tokens.forEach((token) => {
      const parsed = emailSchema.safeParse(token);
      if (parsed.success) {
        inviteUserToTeam({
          email: parsed.data,
          teamId: healthCheck.team_id || '',
          workspaceId: healthCheck.team.workspace_id,
        });
      }
    });

    inputEl.value = '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="max-w-3xl truncate text-2xl font-bold">
            Welcome to {healthCheck.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <h3 className="mb-2 text-xl font-bold">About This Session</h3>
            <p className="text-gray-600">
              This session uses the{' '}
              <span className="font-medium">
                {template?.name ?? 'Team Morale Assessment'}
              </span>{' '}
              template to gather feedback about your team&apos;s health and
              dynamics.
            </p>
          </div>
          <Tabs defaultValue="account">
            <TabsList>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="link">Code/Link</TabsTrigger>
            </TabsList>
            <TabsContent value="email" className="flex flex-col gap-2">
              <div className="bg-ces-orange-50 rounded-lg p-6">
                <DataTable columns={columns} data={teamMembers} />
                <Input
                  placeholder="Enter emails..."
                  onKeyDown={handleKeyDown}
                />
              </div>

              <Button
                className="w-fit self-end"
                onClick={handleInviteUsers}
                disabled={isInviting}
              >
                Invite
              </Button>
            </TabsContent>
            <TabsContent value="link">
              <div className="bg-ces-orange-50 rounded-lg p-6">
                <div className="flex flex-col md:flex-row md:items-start">
                  <div className="md:w-2/5">
                    <h4 className="mb-2 text-lg font-medium">Scan to Join</h4>
                    <div className="inline-block rounded-md bg-white p-4">
                      {/* Real QR code that encodes the current URL */}
                      {sessionLink && (
                        <QRCode
                          value={sessionLink}
                          size={192}
                          style={{
                            height: 'auto',
                            maxWidth: '100%',
                            width: '100%',
                          }}
                          viewBox={`0 0 256 256`}
                        />
                      )}
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0 md:w-3/5 md:pl-4">
                    <h4 className="mb-2 text-lg font-medium">
                      Share With Your Team
                    </h4>
                    <p className="mb-2 text-sm">
                      Invite participants by sharing this link:
                    </p>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={sessionLink}
                        readOnly
                        className="flex-1 rounded-md border bg-white p-2 text-sm"
                      />
                      <Button onClick={handleCopy} variant="outline" size="sm">
                        {copied ? 'Copied' : 'Copy'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
