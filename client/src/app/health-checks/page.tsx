'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { Layout } from '@/components/layout/layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import HealthCheckCard from '@/features/health-check/components/health-check-card';
import { SessionTemplateDialog } from '@/features/health-check/components/sessions/session-template-dialog';
import { useHealthChecks } from '@/features/health-check/hooks/use-health-check';
import { SessionProvider } from '@/lib/context/session-context';

export default function HealthCheckPage() {
  const [showDialog, setShowDialog] = useState(false);
  const queryClient = useQueryClient();
  const { data: healthChecks = [], isLoading: loading } = useHealthChecks();

  // Refresh the list when dialog closes (in case a new health check was created)
  const handleDialogChange = (open: boolean) => {
    setShowDialog(open);
    if (!open) {
      // Invalidate the query to refetch the latest data
      queryClient.invalidateQueries({ queryKey: ['healthChecks'] });
    }
  };

  return (
    <Layout>
      <SessionProvider>
        <SessionTemplateDialog
          open={showDialog}
          onOpenChange={handleDialogChange}
        />
        <div className="py-10">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold">Retro Tool</h1>
              <p className="text-muted-foreground pt-1">
                Create and manage team health check sessions
              </p>
            </div>
            <Button
              className="self-start md:self-center"
              onClick={() => setShowDialog(true)}
            >
              New Retro Session
            </Button>
          </div>

          <div className="py-4">
            <h2 className="text-xl font-semibold">Your Health Checks</h2>

            {loading && (
              <div className="py-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 w-48 rounded bg-gray-200"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 w-full rounded bg-gray-200"></div>
                    </CardContent>
                    <CardFooter>
                      <div className="h-4 w-24 rounded bg-gray-200"></div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
            {!loading && healthChecks.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">
                    No health checks found. Create your first one!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {healthChecks.map((healthCheck) => (
                  <HealthCheckCard
                    key={healthCheck.id}
                    healthCheck={healthCheck}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </SessionProvider>
    </Layout>
  );
}
