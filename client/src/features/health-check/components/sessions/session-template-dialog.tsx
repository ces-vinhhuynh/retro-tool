'use client';

import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

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

import SessionFormStep from './session-form-step';
import TemplatePreviewDialog from './template-preview-dialog';
import TemplateSelectionStep from './template-selection-step';

interface SessionTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SessionTemplateDialog = ({
  open,
  onOpenChange,
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

  const { data: currentUser } = useCurrentUser();
  const { data: templates, isLoading: isLoadingTemplates } = useTemplates();
  const { createHealthCheck, isLoading: isCreatingHealthCheck } =
    useHealthCheckMutations();

  const validTemplates = useMemo(() => {
    return templates?.filter((template) => !template.deleted_at) || [];
  }, [templates]);

  const methods = useForm<HealthCheckFormData>({
    defaultValues: {
      title: '',
      dueDate: new Date(),
      displayMode: DisplayMode.GROUPED,
      allowNavigation: false,
    },
  });

  useEffect(() => {
    if (templateId) {
      const template =
        validTemplates?.find((tpl) => tpl.id === templateId) || null;
      setSelectedTemplate(template);
      setStep('form');
    } else if (validTemplates?.length) {
      setSelectedTemplate(
        validTemplates.filter((template) => !template.is_custom)[0] ||
          validTemplates[0],
      );
    }
  }, [validTemplates, templateId]);

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

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={() => {
          onOpenChange(false);
          setTemplateId('');
          setStep('choose');
        }}
      >
        <DialogContent className="max-h-[80vh] w-full max-w-2xl overflow-y-auto">
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
                onTemplateSelect={setSelectedTemplate}
                onPreview={(template) =>
                  setPreviewState({ open: true, template })
                }
                onContinue={() => setStep('form')}
                teamId={teamId}
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
    </>
  );
};

export default SessionTemplateDialog;
