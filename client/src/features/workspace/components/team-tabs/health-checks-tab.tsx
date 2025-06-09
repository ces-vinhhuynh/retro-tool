import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ScrumHealthCheck from '@/features/health-check/components/scrum-health-check';
import SessionTemplateDialog from '@/features/health-check/components/sessions/session-template-dialog';
import { useNewSessionModalStore } from '@/features/health-check/stores/new-session-modal-store';
import {
  HealthCheck,
  HealthCheckWithTemplate,
} from '@/features/health-check/types/health-check';

interface HealthChecksTabProps {
  healthChecksGrouped: Record<string, HealthCheck[]>;
  isAdmin: boolean;
}

const HealthChecksTab = ({
  healthChecksGrouped,
  isAdmin,
}: HealthChecksTabProps) => {
  const [showDialog, setShowDialog] = useState(false);

  const { setTemplateId } = useNewSessionModalStore();

  const onAddNewSession = (templateId: string) => {
    setShowDialog(true);
    setTemplateId(templateId);
  };

  return (
    <>
      <Card className="flex flex-col gap-8 p-4 md:p-6 lg:p-8">
        <div className="flex flex-col justify-end-safe gap-4 md:flex-row md:items-center">
          {isAdmin && (
            <div className="flex flex-col justify-end-safe gap-4 md:flex-row md:items-center">
              <Button
                variant="default"
                className="ml-auto"
                onClick={() => setShowDialog(true)}
              >
                New Health Check
              </Button>
            </div>
          )}
        </div>
        {Object.entries(healthChecksGrouped).map(([key, value]) => {
          if (value.length === 0) return null;
          return (
            <ScrumHealthCheck
              key={key}
              onAddNewSession={() => onAddNewSession(key)}
              scrumHealthChecks={value as HealthCheckWithTemplate[]}
              isShowAddNew={isAdmin}
            />
          );
        })}
      </Card>
      <SessionTemplateDialog
        open={showDialog}
        onOpenChange={() => setShowDialog(!showDialog)}
      />
    </>
  );
};

export default HealthChecksTab;
