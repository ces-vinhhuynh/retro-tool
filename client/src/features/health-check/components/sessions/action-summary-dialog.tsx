'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

import { useHealthCheckWithTemplate } from '../../hooks/use-health-check';
import {
  ActionItemWithAssignees,
  ActionPriority,
  ActionStatus,
  HealthCheckWithTemplate,
  Question,
  User,
} from '../../types/health-check';
import { PRIORITY_CONFIG, STATUS_CONFIG } from '../../utils/constants';
import { formatLocalizedDate } from '../../utils/time-format';
import { DatePopover } from '../date-popover';
import { PriorityPopover } from '../priority-popover';
import { StatusPopover } from '../status-popover';
import UserAssignmentPopover from '../user-assignment-popover';

interface ActionSummaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: ActionItemWithAssignees | null;
  teamMembers: User[];
  isHandlingNavigate: boolean;
}

const ActionSummaryDialog = ({
  open,
  onOpenChange,
  action,
  teamMembers,
  isHandlingNavigate,
}: ActionSummaryDialogProps) => {
  const questionId = action?.question_id || null;
  const healthCheckId = action?.health_check_id || null;

  const [openAssigneePopovers, setOpenAssigneePopovers] = useState<
    Record<string, boolean>
  >({});

  const { data: healthCheck } = useHealthCheckWithTemplate(healthCheckId || '');

  if (!action) return null;

  // Navigate to health check review page
  const handleNavigateToHealthCheck = () => {
    if (isHandlingNavigate && healthCheckId) {
      const baseUrl = `/health-checks/${healthCheckId}`;
      window.open(baseUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Navigate to original action card or question details
  const handleNavigateToQuestion = () => {
    if (isHandlingNavigate && healthCheckId) {
      const baseUrl = `/health-checks/${healthCheckId}`;
      const params = new URLSearchParams();
      params.set('questionId', action?.question_id || '');
      const url = `${baseUrl}?${params.toString()}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const getQuestionFromHealthCheck = (): Question | null => {
    if (!questionId || !healthCheck) return null;

    const healthCheckWithTemplate = healthCheck as HealthCheckWithTemplate;

    if (!healthCheckWithTemplate?.template?.questions) return null;

    const foundQuestion = healthCheckWithTemplate.template.questions.find(
      (item) => (item as Question)?.id === questionId,
    );

    return (foundQuestion as Question) || null;
  };

  const getAssignees = (item: ActionItemWithAssignees) => {
    return (
      item?.action_item_assignees
        ?.map((assignee) => assignee.team_user_id)
        .filter((id): id is string => id !== null) ?? []
    );
  };

  const getPriorityIcon = (priority: ActionPriority) => {
    const config = PRIORITY_CONFIG[priority];
    if (!config) return null;
    const Icon = config.icon;
    return <Icon className={config.className} size={20} />;
  };

  const getStatusIcon = (status: ActionStatus) => {
    const config = STATUS_CONFIG[status];
    if (!config) return null;
    const Icon = config.icon;
    return <Icon className={config.className} size={20} />;
  };

  const question = getQuestionFromHealthCheck();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-full max-w-md overflow-y-auto p-6 pl-6">
        <DialogTitle className="sr-only">Action Detail</DialogTitle>

        {/* Header: Status + Title */}
        <div className="flex items-start gap-2">
          {action.status && (
            <StatusPopover item={action} getStatusIcon={getStatusIcon} />
          )}
          <div className="text-2xl font-semibold text-gray-900">
            {action.title}
          </div>
        </div>

        {/* Body aligned with title */}
        <div className="mt-4 flex flex-col gap-2">
          {question?.title && (
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-600">
                INSPIRED BY&nbsp;
              </span>
              <button
                onClick={handleNavigateToQuestion}
                className="font-medium text-blue-600 hover:underline"
              >
                {question.title}
              </button>
              <span>
                &nbsp;in <em>{healthCheck?.title}</em>
              </span>
            </div>
          )}

          {action.created_at && (
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-600">
                ADDED&nbsp;
              </span>
              <button
                onClick={handleNavigateToHealthCheck}
                className="font-medium text-blue-600 hover:underline"
              >
                {formatLocalizedDate(action.created_at, 'en-GB')}
              </button>
            </div>
          )}

          {action.priority && (
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-600">
                PRIORITY&nbsp;
              </span>
              <PriorityPopover
                variant="text"
                item={action}
                isEditable={true}
                getPriorityIcon={getPriorityIcon}
              />
            </div>
          )}

          {action.due_date && (
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-600">
                DUE&nbsp;
              </span>
              <DatePopover item={action} isEditable={true} />
            </div>
          )}

          {action.action_item_assignees?.length > 0 && (
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-600">
                ASSIGNED TO&nbsp;
              </span>
              <UserAssignmentPopover
                variant="avatars"
                item={action}
                teamMembers={teamMembers}
                isEditable={false}
                assignees={getAssignees(action)}
                openPopovers={openAssigneePopovers}
                setOpenPopovers={setOpenAssigneePopovers}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="justify-end pt-4">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ActionSummaryDialog;
