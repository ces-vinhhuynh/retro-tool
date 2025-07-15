'use client';

import { ChevronDown, X } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';

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

// Tooltip component for desktop
const TooltipTitle = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      {showTooltip && (
        <div
          className="pointer-events-none fixed z-[9999] max-w-lg min-w-80 rounded-lg bg-gray-900 p-3 text-sm text-white shadow-xl"
          style={{
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <div className="leading-relaxed break-words">{title}</div>
        </div>
      )}
    </div>
  );
};

// Mobile popup component
const MobileTitlePopup = ({
  title,
  isOpen,
  onClose,
}: {
  title: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-[9999] -mx-2 flex items-start justify-center overflow-y-auto bg-black/60 px-4 pt-4 pb-4">
      <div className="relative my-auto w-full max-w-xs rounded-lg bg-white shadow-xl">
        <div className="relative max-h-[70vh] overflow-hidden p-4">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 z-10 rounded-full bg-white p-1 shadow-sm hover:bg-gray-100"
          >
            <X size={20} className="text-gray-600" />
          </button>
          <p className="pr-4 leading-relaxed break-words text-gray-900">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
};

// Truncated title component
const TruncatedTitle = ({ title }: { title: string }) => {
  const [showMobilePopup, setShowMobilePopup] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const isMobile = useIsMobile();

  useEffect(() => {
    setIsOverflowing(title.length > 100); // Adjust threshold as needed
  }, [title]);

  const truncatedContent = (
    <div className="relative">
      <div className="line-clamp-4 text-2xl leading-normal font-semibold text-gray-900">
        {title}
      </div>
      {isOverflowing && isMobile && (
        <button
          onClick={() => setShowMobilePopup(true)}
          className="absolute right-0 bottom-0 rounded-full border bg-white p-1 shadow-md hover:bg-gray-50"
        >
          <ChevronDown size={16} className="text-gray-600" />
        </button>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <>
        {truncatedContent}
        <MobileTitlePopup
          title={title}
          isOpen={showMobilePopup}
          onClose={() => setShowMobilePopup(false)}
        />
      </>
    );
  }

  // Desktop with tooltip
  if (isOverflowing) {
    return <TooltipTitle title={title}>{truncatedContent}</TooltipTitle>;
  }

  return truncatedContent;
};

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
            <StatusPopover
              item={action}
              getStatusIcon={getStatusIcon}
              isEditable={false}
            />
          )}
          <div className="min-w-0 flex-1">
            <TruncatedTitle title={action.title} />
          </div>
        </div>

        {/* Body aligned with title */}
        <div className="mt-4 flex flex-col gap-2">
          {question?.title && (
            <div className="h-6 text-sm leading-relaxed">
              <span className="font-medium text-gray-600">INSPIRED BY </span>
              <button
                onClick={
                  isHandlingNavigate && healthCheckId
                    ? handleNavigateToQuestion
                    : undefined
                }
                className={`font-medium break-words text-blue-600 ${
                  isHandlingNavigate && healthCheckId
                    ? 'cursor-pointer hover:underline'
                    : 'cursor-default'
                }`}
              >
                {question.title}
              </button>
              <span> in </span>
              <em className="break-words">{healthCheck?.title}</em>
            </div>
          )}

          {action.created_at && (
            <div className="h-6 text-sm leading-relaxed">
              <span className="font-medium text-gray-600">ADDED </span>
              <button
                onClick={
                  isHandlingNavigate && healthCheckId
                    ? handleNavigateToHealthCheck
                    : undefined
                }
                className={`font-medium text-blue-600 ${
                  isHandlingNavigate && healthCheckId
                    ? 'cursor-pointer hover:underline'
                    : 'cursor-default'
                }`}
              >
                {formatLocalizedDate(action.created_at, 'en-GB')}
              </button>
            </div>
          )}

          {action.priority && (
            <div className="flex h-6 items-center">
              <span className="text-sm font-medium text-gray-600">
                PRIORITY&nbsp;
              </span>
              <PriorityPopover
                variant="text"
                item={action}
                isEditable={false}
                getPriorityIcon={getPriorityIcon}
              />
            </div>
          )}

          {
            <div className="flex h-6 items-center">
              <span className="text-sm font-medium text-gray-600">
                DUE&nbsp;
              </span>
              <DatePopover
                item={action}
                isEditable={false}
                variant="text-no-lable"
              />
            </div>
          }

          {
            <div className="flex h-6 items-center">
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
          }
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
