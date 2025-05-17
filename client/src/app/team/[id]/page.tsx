'use client';

import { ChartSpline, House, Menu, User } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import { Layout } from '@/components/layout/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ActionItems from '@/features/health-check/components/action-items';
import ScrumHealthCheck from '@/features/health-check/components/scrum-health-check';
import { SessionTemplateDialog } from '@/features/health-check/components/sessions/session-template-dialog';
import { useGetHealthChecksByTeamsAndTemplate } from '@/features/health-check/hooks/use-get-health-checks-by-teams-and-template';
import { useResponseByHealthChecks } from '@/features/health-check/hooks/use-response-by-health-checks';
import { HealthCheckWithTemplate } from '@/features/health-check/types/health-check';
import { SessionProvider } from '@/lib/context/session-context';

const TeamPage = () => {
  const { id: teamId } = useParams<{ id: string }>();
  const [showDialog, setShowDialog] = useState(false);
  const { data: scrumHealthChecks } = useGetHealthChecksByTeamsAndTemplate(
    // TODO: Remove this hardcoded value with real value
    '361391f3-5033-40ec-9fc9-a442ebafe971',
    teamId || '',
  );

  const { data: scrumResponses } = useResponseByHealthChecks(
    scrumHealthChecks?.map((check) => check.id) || [],
  );

  return (
    <Layout>
      <Tabs defaultValue={tabs[0].value} className="w-full py-10">
        <TabsList className="grid w-full grid-cols-4">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.icon}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="retrospective">
          <SessionProvider>
            <SessionTemplateDialog
              open={showDialog}
              onOpenChange={() => setShowDialog(!showDialog)}
            />
          </SessionProvider>

          <div className="pt-10">
            <Card className="flex flex-col gap-8 p-10">
              <div className="flex flex-col justify-end-safe gap-4 md:flex-row md:items-center">
                <Button
                  variant={'default'}
                  className="self-start md:self-center"
                  onClick={() => setShowDialog(true)}
                >
                  New Retro Session
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
                      Actions from this health check
                    </h3>
                    <ActionItems
                      actionItems={[]}
                      // TODO: Remove this hardcoded value with real value
                      healthCheckId={'31fac6b7-f9af-4de5-adcf-ceadde0397aa'}
                    />
                  </div>
                </CardContent>
              </Card>
              <Card className="mx-auto w-full">
                <CardContent className="flex flex-col gap-2 p-2">
                  <ScrumHealthCheck
                    scrumHealthChecks={
                      scrumHealthChecks as HealthCheckWithTemplate[]
                    }
                    scrumResponses={scrumResponses || []}
                    isShowAddNew={true}
                  />
                </CardContent>
              </Card>
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
    value: 'retrospective',
    icon: <Menu className="size-4" />,
    label: 'Retrospective',
  },
  { value: 'members', icon: <User className="size-4" />, label: 'Members' },
  {
    value: 'data-track',
    icon: <ChartSpline className="size-4" />,
    label: 'Data Track',
  },
];
