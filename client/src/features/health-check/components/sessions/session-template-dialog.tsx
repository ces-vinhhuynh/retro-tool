'use client';

import { AlertTriangle } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { useHealthCheckMutations } from '@/features/health-check/hooks/use-health-check';
import { useTemplates } from '@/features/health-check/hooks/use-health-check-templates';
import { MESSAGE } from '@/utils/messages';

import { useNewSessionModalStore } from '../../stores/new-session-modal-store';
import {
  DisplayMode,
  HealthCheckFormData,
  HealthCheckStatus,
} from '../../types/health-check';
import { Template } from '../../types/templates';

import { SessionFormStep } from './session-form-step';
import { TemplatePreviewDialog } from './template-preview-dialog';
import { TemplateSelectionStep } from './template-selection-step';

interface SessionTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hasInProgressHealthCheck: (templateId: string) => boolean;
  initialTemplateId?: string;
}

export const SessionTemplateDialog = ({
  open,
  onOpenChange,
  hasInProgressHealthCheck,
  initialTemplateId = '',
}: SessionTemplateDialogProps) => {
  const { id: teamId } = useParams<{ id: string }>();
  const { templateId, setTemplateId } = useNewSessionModalStore();
  const [step, setStep] = useState<'choose' | 'form'>('choose');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  );
  const [previewState, setPreviewState] = useState<{
    open: boolean;
    template: Template | null;
  }>({ open: false, template: null });
  const [showWarningDialog, setShowWarningDialog] = useState(false);

  const { data: currentUser } = useCurrentUser();
  const { data: templates, isLoading: isLoadingTemplates } = useTemplates();
  const { createHealthCheck, isLoading: isCreatingHealthCheck } =
    useHealthCheckMutations();

  const validTemplates = useMemo(() => {
    return templates?.filter((template) => !template.deleted_at) || [];
  }, [templates]);

  // Check if selected template has IN_PROGRESS health checks
  const hasInProgressForSelectedTemplate = useMemo(() => {
    if (!selectedTemplate) return false;
    return hasInProgressHealthCheck(selectedTemplate.id);
  }, [selectedTemplate, hasInProgressHealthCheck]);

  const methods = useForm<HealthCheckFormData>({
    defaultValues: {
      title: '',
      dueDate: new Date(),
      displayMode: DisplayMode.GROUPED,
      allowNavigation: false,
    },
  });

  useEffect(() => {
    setShowWarningDialog(false);

    const findTemplate = (id: string) =>
      validTemplates?.find((tpl) => tpl.id === id) || null;

    const getDefaultTemplate = () =>
      validTemplates?.filter((template) => !template.is_custom)[0] ||
      validTemplates?.[0] ||
      null;

    // Case 1: Direct templateId (go to 'form' step)
    if (templateId) {
      setSelectedTemplate(findTemplate(templateId));
      setStep('form');
      return;
    }

    // Case 2: Initial templateId (check for IN_PROGRESS)
    if (initialTemplateId) {
      const template = findTemplate(initialTemplateId);
      setSelectedTemplate(template);

      if (template && hasInProgressHealthCheck(template.id)) {
        setShowWarningDialog(true);
      }

      setStep('form');
      return;
    }

    // Case 3: Default template selection
    if (validTemplates?.length) {
      setSelectedTemplate(getDefaultTemplate());
      setStep('choose');
    }
  }, [validTemplates, templateId, initialTemplateId, hasInProgressHealthCheck]);

  // Reset states when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setShowWarningDialog(false);
      setStep('choose');
    }
  }, [open]);

  // Accept form data from react-hook-form
  const handleCreate = async (formData: HealthCheckFormData) => {
    if (!selectedTemplate || !currentUser) {
      toast.error(MESSAGE.AUTHENTICATION_REQUIRED, {
        description: MESSAGE.AUTHENTICATION_REQUIRED_DESCRIPTION,
      });
      return;
    }

    await createHealthCheck({
      title: formData.title,
      description: '',
      team_id: teamId,
      template_id: templateId || selectedTemplate.id,
      facilitator_ids: [currentUser.id],
      status: HealthCheckStatus.IN_PROGRESS,
      current_step: 1,
      settings: {
        display_mode: formData.displayMode,
        allow_participant_navigation: formData.allowNavigation,
      },
    });

    setTemplateId('');
    onOpenChange(false);
  };

  const handleContinue = () => {
    if (hasInProgressForSelectedTemplate) {
      return; // Don't allow continue if there's an IN_PROGRESS health check
    }
    setStep('form');
  };

  return (
    <>
      <Dialog
        open={open && !showWarningDialog}
        onOpenChange={() => {
          onOpenChange(false);
          setTemplateId('');
          setStep('choose');
          setShowWarningDialog(false);
        }}
      >
        <DialogContent className="h-auto max-h-[calc(100vh-2rem)] w-[calc(100vw-1rem)] overflow-y-auto p-4 sm:mx-auto sm:my-auto sm:h-auto sm:max-h-[80vh] sm:w-full sm:max-w-2xl sm:p-6">
          <DialogHeader>
            <DialogTitle>
              {step === 'choose' ? 'Select a template' : 'Create Session'}
            </DialogTitle>
          </DialogHeader>

          {step === 'choose' &&
            (isLoadingTemplates ? (
              <Card className="p-4">
                <div className="h-6 w-24 animate-pulse rounded bg-gray-200"></div>
                <div className="h-4 w-full animate-pulse rounded bg-gray-200 pt-2"></div>
              </Card>
            ) : (
              <TemplateSelectionStep
                templates={validTemplates}
                selectedTemplate={selectedTemplate}
                onTemplateSelect={(template) => setSelectedTemplate(template)}
                onPreview={(template) =>
                  setPreviewState({ open: true, template })
                }
                onContinue={handleContinue}
                teamId={teamId}
                hasInProgressHealthCheck={hasInProgressForSelectedTemplate}
              />
            ))}

          {step === 'form' && (
            <FormProvider {...methods}>
              <SessionFormStep
                onSubmit={methods.handleSubmit(handleCreate)}
                onBack={() => setStep('choose')}
                isSubmitting={isCreatingHealthCheck}
              />
            </FormProvider>
          )}
        </DialogContent>
      </Dialog>

      <TemplatePreviewDialog
        open={previewState.open}
        onOpenChange={(open) => setPreviewState((prev) => ({ ...prev, open }))}
        template={previewState.template}
      />

      {/* Warning AlertDialog for IN_PROGRESS health check */}
      <AlertDialog
        open={showWarningDialog}
        onOpenChange={(open) => {
          setShowWarningDialog(open);
          // Close main dialog when warning is dismissed
          if (!open) {
            onOpenChange(false);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Cannot create Health Check
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-700">
              There is an In Progress health check using this template. Please
              close it before creating a new one.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
