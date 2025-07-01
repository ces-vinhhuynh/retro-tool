import { BadgeAlert, Handshake, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardActionItems from '@/features/health-check/components/dashboard-action-items';
import EntryForm from '@/features/health-check/components/entry-form';
import SessionTemplateDialog from '@/features/health-check/components/sessions/session-template-dialog';
import { useAgreementMutation } from '@/features/health-check/hooks/agreements/use-agreements-mutation';
import { useAgreementsSubscription } from '@/features/health-check/hooks/agreements/use-agreements-subscription';
import { useIssuesMutation } from '@/features/health-check/hooks/issues/use-issues-mutation';
import { useIssuesSubscription } from '@/features/health-check/hooks/issues/use-issues-subscription';
import { useGetHealthChecksByTeam } from '@/features/health-check/hooks/use-get-healt-checks-by-team';
import { useTemplates } from '@/features/health-check/hooks/use-health-check-templates';
import { Agreement } from '@/features/health-check/types/agreements';
import {
  ActionItemWithAssignees,
  ActionStatus,
  HealthCheck,
  User,
} from '@/features/health-check/types/health-check';
import { Issue } from '@/features/health-check/types/issues';
import { Template } from '@/features/health-check/types/templates';
import { splitHealthChecksByTemplateId } from '@/features/health-check/utils/health-checks';
import { sortTemplatesByLatestHealthCheck } from '@/features/health-check/utils/template';

import { useGetTeamMembers } from '../../hooks/use-get-team-member';

import TeamHealthTrend from './team-health-trend';

interface HomeTabProps {
  teamId: string;
  actionItems: ActionItemWithAssignees[];
  agreements: Agreement[];
  issues: Issue[];
}

const HomeTab = ({ teamId, actionItems, agreements, issues }: HomeTabProps) => {
  const router = useRouter();
  const { data: teamMembers = [] } = useGetTeamMembers(teamId);

  // State to control EntryForm visibility
  const [showActionEntryForm, setShowActionEntryForm] = useState(false);
  const [showIssueEntryForm, setShowIssueEntryForm] = useState(false);
  const [showAgreementEntryForm, setShowAgreementEntryForm] = useState(false);

  // Forms for Issues and Agreements
  const issueForm = useForm<{ title: string }>({
    defaultValues: { title: '' },
  });

  const agreementForm = useForm<{ title: string }>({
    defaultValues: { title: '' },
  });

  // Hooks for creating issues and agreements
  const { createIssue, isLoading: isLoadingIssues } = useIssuesMutation();
  const { createAgreements, isLoading: isLoadingAgreements } =
    useAgreementMutation();

  const getIssueColor = (index: number) => {
    const colors = [
      'bg-red-50 border-red-200',
      'bg-yellow-50 border-yellow-200',
      'bg-green-50 border-green-200',
    ];
    return colors[index % colors.length];
  };

  useAgreementsSubscription(teamId);
  useIssuesSubscription(teamId);

  const { data: scrumHealthChecks = [] } = useGetHealthChecksByTeam(teamId);
  const { data: templates = [] } = useTemplates();

  const healthChecksGrouped = splitHealthChecksByTemplateId(
    templates as Template[],
    scrumHealthChecks as HealthCheck[],
  );

  const sortedTemplates = sortTemplatesByLatestHealthCheck(
    templates as Template[],
    scrumHealthChecks as HealthCheck[],
  );

  const [selectedTemplate] = useState<string>(sortedTemplates[0]?.id || '');
  const [showDialog, setShowDialog] = useState(false);

  const healthChecks = healthChecksGrouped[selectedTemplate];

  // Submit handlers
  const onSubmitIssue = issueForm.handleSubmit((data) => {
    if (!data.title.trim()) return;

    const newIssue = {
      title: data.title.trim(),
      team_id: teamId,
    };

    createIssue(newIssue, {
      onSuccess: () => {
        issueForm.reset();
        setShowIssueEntryForm(false);
      },
    });
  });

  const onSubmitAgreement = agreementForm.handleSubmit((data) => {
    if (!data.title.trim()) return;

    const newAgreement = {
      title: data.title.trim(),
      team_id: teamId,
    };

    createAgreements(newAgreement, {
      onSuccess: () => {
        agreementForm.reset();
        setShowAgreementEntryForm(false);
      },
    });
  });

  const inProgressTodoActionItems = actionItems.filter(
    (item) =>
      item.status === ActionStatus.TODO ||
      item.status === ActionStatus.IN_PROGRESS,
  );
  // Limit to top 3 action items for dashboard
  const displayedActionItems = inProgressTodoActionItems.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex items-center justify-between">
        <Button
          className="bg-primary ml-auto hover:bg-blue-900"
          onClick={() => setShowDialog(true)}
        >
          <Plus />
          New Health Check
        </Button>
      </div>

      {/* Main Dashboard Grid - Using flex layout for equal heights */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Top Team Actions Section - Left Column (2/3 width) */}
        <div className="lg:w-2/3">
          <Card className="flex h-full flex-col">
            <CardHeader className="flex flex-shrink-0 flex-col space-y-2 pb-4">
              <div className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-xl font-semibold">
                    Top Team Actions
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">
                    {inProgressTodoActionItems.length}/{actionItems.length} Todo
                    & In progress from 2 recent sprints
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border border-gray-300 bg-transparent text-blue-600 hover:bg-blue-50"
                  onClick={() => {
                    setShowActionEntryForm(!showActionEntryForm);
                  }}
                >
                  {showActionEntryForm ? 'Cancel' : 'Add Action'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col space-y-4">
              <div className="flex-1">
                <DashboardActionItems
                  showEntryForm={showActionEntryForm}
                  actionItems={displayedActionItems}
                  teamId={teamId}
                  teamMembers={teamMembers as unknown as User[]}
                  onEntryFormToggle={() => setShowActionEntryForm(false)}
                />
              </div>

              {actionItems.length > 0 && (
                <div className="flex-shrink-0 pt-4">
                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      className="border border-gray-300 bg-transparent text-blue-600 hover:bg-blue-50"
                      onClick={() => router.push(`/teams/${teamId}/actions`)}
                    >
                      View All Actions ({actionItems.length})
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Issues and Agreements (1/3 width) */}
        <div className="flex flex-col gap-6 lg:w-1/3">
          {/* Long Term Issues Section */}
          <Card className="flex h-full flex-col">
            <CardHeader className="flex flex-shrink-0 flex-row items-center justify-between space-y-0 pb-4">
              <div className="flex items-center gap-2">
                <BadgeAlert className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-lg font-semibold">
                  Long Term Issues
                </CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border border-gray-300 bg-transparent text-blue-600 hover:bg-blue-50"
                onClick={() => {
                  setShowIssueEntryForm(!showIssueEntryForm);
                }}
              >
                {showIssueEntryForm ? 'Cancel' : 'Add'}
              </Button>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              {/* EntryForm for Issues */}
              {showIssueEntryForm && (
                <div className="mb-4 flex-shrink-0">
                  <EntryForm
                    register={issueForm.register}
                    onSubmit={onSubmitIssue}
                    isDisabled={
                      issueForm.formState.isSubmitting || isLoadingIssues
                    }
                    placeholder="Add new issue..."
                    Icon={BadgeAlert}
                  />
                </div>
              )}

              {issues.length === 0 && !showIssueEntryForm ? (
                <div className="text-muted-foreground flex flex-1 items-center justify-center">
                  <p className="text-sm">No issues yet</p>
                </div>
              ) : showIssueEntryForm && issues.length === 0 ? (
                <div className="text-muted-foreground flex flex-1 items-center justify-center">
                  <p className="text-sm">Add your first issue above</p>
                </div>
              ) : (
                <>
                  <div className="flex-1 space-y-3">
                    {issues.slice(0, 3).map((issue, index) => (
                      <div
                        key={issue.id}
                        className={`rounded-lg border p-3 text-sm ${getIssueColor(index)}`}
                      >
                        {issue.title}
                      </div>
                    ))}
                  </div>
                  {issues.length > 0 && (
                    <div className="flex-shrink-0 pt-3">
                      <div className="flex justify-center">
                        <Button
                          variant="outline"
                          className="w-full border border-gray-300 bg-transparent text-blue-600 hover:bg-blue-50"
                          onClick={() =>
                            router.push(`/teams/${teamId}/long-term-issues`)
                          }
                        >
                          View All Issues ({issues.length})
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Team Agreements Section */}
          <Card className="flex h-full flex-col">
            <CardHeader className="flex flex-shrink-0 flex-row items-center justify-between space-y-0 pb-4">
              <div className="flex items-center gap-2">
                <Handshake className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg font-semibold">
                  Team Agreements
                </CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border border-gray-300 bg-transparent text-blue-600 hover:bg-blue-50"
                onClick={() => {
                  setShowAgreementEntryForm(!showAgreementEntryForm);
                }}
              >
                {showAgreementEntryForm ? 'Cancel' : 'Add'}
              </Button>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              {/* EntryForm for Agreements */}
              {showAgreementEntryForm && (
                <div className="mb-4 flex-shrink-0">
                  <EntryForm
                    register={agreementForm.register}
                    onSubmit={onSubmitAgreement}
                    isDisabled={
                      agreementForm.formState.isSubmitting ||
                      isLoadingAgreements
                    }
                    placeholder="Add new agreement..."
                    Icon={Handshake}
                  />
                </div>
              )}

              {agreements.length === 0 && !showAgreementEntryForm ? (
                <div className="text-muted-foreground flex flex-1 items-center justify-center">
                  <p className="text-sm">No agreements yet</p>
                </div>
              ) : showAgreementEntryForm && agreements.length === 0 ? (
                <div className="text-muted-foreground flex flex-1 items-center justify-center">
                  <p className="text-sm">Add your first agreement above</p>
                </div>
              ) : (
                <>
                  <div className="flex-1 space-y-3">
                    {agreements.slice(0, 3).map((agreement) => (
                      <div
                        key={agreement.id}
                        className="flex items-center gap-2 text-sm"
                      >
                        <div className="h-2 w-2 flex-shrink-0 rounded-full bg-blue-500"></div>
                        <span>{agreement.title}</span>
                      </div>
                    ))}
                  </div>
                  {agreements.length > 0 && (
                    <div className="flex-shrink-0 pt-3">
                      <div className="flex justify-center">
                        <Button
                          variant="outline"
                          className="w-full border border-gray-300 bg-transparent text-blue-600 hover:bg-blue-50"
                          onClick={() =>
                            router.push(`/teams/${teamId}/agreements`)
                          }
                        >
                          View All Agreements ({agreements.length})
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Data Trend Chart - Full Width */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold">Data Tracking</CardTitle>
          <div className="flex justify-center">
            <Button
              variant="outline"
              className="border border-gray-300 bg-transparent text-blue-600 hover:bg-blue-50"
              onClick={() => router.push(`/teams/${teamId}/health-checks`)}
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <TeamHealthTrend healthChecks={healthChecks} />
        </CardContent>
      </Card>

      <SessionTemplateDialog
        open={showDialog}
        onOpenChange={() => setShowDialog(!showDialog)}
      />
    </div>
  );
};

export default HomeTab;
