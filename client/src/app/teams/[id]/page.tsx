'use client';

import { ChartSpline, House, Menu, User as UserIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import { Layout } from '@/components/layout/layout';
import InviteModal from '@/components/modal/invite-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ActionItems from '@/features/health-check/components/action-items';
import ScrumHealthCheck from '@/features/health-check/components/scrum-health-check';
import SessionTemplateDialog from '@/features/health-check/components/sessions/session-template-dialog';
import { useGetActionItemsByTeamId } from '@/features/health-check/hooks/use-get-action-items-by-team-id';
import { useGetHealthChecksByTeam } from '@/features/health-check/hooks/use-get-healt-checks-by-team';
import { useTemplates } from '@/features/health-check/hooks/use-health-check-templates';
import { useNewSessionModalStore } from '@/features/health-check/stores/new-session-modal-store';
import {
  HealthCheck,
  HealthCheckWithTemplate,
  User,
} from '@/features/health-check/types/health-check';
import { Template } from '@/features/health-check/types/templates';
import { splitHealthChecksByTemplateId } from '@/features/health-check/utils/health-checks';
import { DataTable } from '@/features/workspace/components/data-table';
import { columns } from '@/features/workspace/components/team-members-table/columns';
import UserCard from '@/features/workspace/components/user-card';
import { TeamRole } from '@/features/workspace/constants/user';
import { useDeleteTeamMember } from '@/features/workspace/hooks/use-delete-team-member';
import { useGetTeam } from '@/features/workspace/hooks/use-get-team';
import { useGetTeamMembers } from '@/features/workspace/hooks/use-get-team-member';
import { useInviteUserToTeam } from '@/features/workspace/hooks/use-invite-user-to-team';
import { useUpdateTeamUser } from '@/features/workspace/hooks/use-update-team-user';
import { MESSAGE } from '@/utils/messages';

const TeamPage = () => {
  const { id: teamId } = useParams<{ id: string }>();

  const [showDialog, setShowDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const { data: team } = useGetTeam(teamId);

  const { setTemplateId } = useNewSessionModalStore();
  const { data: teamMembers = [] } = useGetTeamMembers(teamId);

  const { data: scrumHealthChecks } = useGetHealthChecksByTeam(teamId);
  const { data: templates } = useTemplates();
  const { data: actionItems } = useGetActionItemsByTeamId(teamId);

  const { mutate: deleteTeamMember } = useDeleteTeamMember();
  const { mutate: updateTeamUser } = useUpdateTeamUser();
  const { mutate: inviteUserToTeam, isPending: isInvitingUserToTeam } =
    useInviteUserToTeam();

  const healthChecksGrouped = splitHealthChecksByTemplateId(
    templates as Template[],
    scrumHealthChecks as HealthCheck[],
  );

  const onAddNewSession = (templateId: string) => {
    setShowDialog(true);
    setTemplateId(templateId);
  };

  const handleInvite = (email: string) => {
    inviteUserToTeam({
      email,
      teamId: team?.id ?? '',
      workspaceId: team?.workspace_id ?? '',
    });
  };

  return (
    <Layout>
      <Tabs defaultValue={tabs[1].value} className="w-full p-4 md:p-6 lg:p-8">
        <TabsList className="grid w-full grid-cols-4">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="cursor-pointer"
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="health-checks">
          <SessionTemplateDialog
            open={showDialog}
            onOpenChange={() => setShowDialog(!showDialog)}
          />

          <div className="pt-10">
            <Card className="flex flex-col gap-8 p-4 md:p-6 lg:p-8">
              <div className="flex flex-col justify-end-safe gap-4 md:flex-row md:items-center">
                <Button
                  variant={'default'}
                  className="ml-auto"
                  onClick={() => setShowDialog(true)}
                >
                  New Health Check
                </Button>
              </div>
              <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50/50 shadow-lg">
                <div className="from-primary/5 pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent" />
                <CardHeader className="pb-2">
                  <CardTitle className="from-primary to-primary/80 bg-gradient-to-r bg-clip-text text-2xl font-semibold text-transparent">
                    Team actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 text-base font-medium text-gray-600">
                      Actions from team
                    </h3>
                    <ActionItems
                      actionItems={actionItems || []}
                      teamId={teamId}
                      teamMembers={teamMembers as unknown as User[]}
                    />
                  </div>
                </CardContent>
              </Card>
              {Object.entries(healthChecksGrouped).map(([key, value]) => {
                if (value.length === 0) return null;
                return (
                  <ScrumHealthCheck
                    key={key}
                    onAddNewSession={() => onAddNewSession(key)}
                    scrumHealthChecks={value as HealthCheckWithTemplate[]}
                    isShowAddNew={true}
                  />
                );
              })}
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="members">
          <div className="pt-10">
            <Card className="flex flex-col gap-8 p-4 md:p-6 lg:p-8">
              <div className="flex flex-col justify-end-safe gap-4 md:flex-row md:items-center">
                <Button
                  variant="default"
                  className="self-end"
                  onClick={() => setShowInviteDialog(true)}
                >
                  Invite member
                </Button>
                <InviteModal
                  open={showInviteDialog}
                  onClose={() => setShowInviteDialog(false)}
                  onSubmit={handleInvite}
                  isLoading={isInvitingUserToTeam}
                  title={MESSAGE.INVITE_TO_TEAM_TITLE}
                  description={MESSAGE.INVITE_TO_TEAM_DESCRIPTION}
                />
              </div>

              {/* Mobile */}
              <div className="flex flex-col gap-3 sm:hidden">
                {teamMembers.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onDelete={(userId) => deleteTeamMember(userId)}
                    onUpdateRole={(role) =>
                      updateTeamUser({
                        id: user.id,
                        teamUser: {
                          role: role as TeamRole,
                        },
                      })
                    }
                    isWorkspaceUserCard={false}
                  />
                ))}
              </div>

              {/* Desktop */}
              <div className="hidden w-full overflow-x-auto sm:block">
                <DataTable columns={columns} data={teamMembers} />
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default TeamPage;

const tabs = [
  { value: 'home', icon: <House className="size-4" />, label: 'Home' },
  {
    value: 'health-checks',
    icon: <Menu className="size-4" />,
    label: 'Health Checks',
  },
  { value: 'members', icon: <UserIcon className="size-4" />, label: 'Members' },
  {
    value: 'data-track',
    icon: <ChartSpline className="size-4" />,
    label: 'Data Track',
  },
];
