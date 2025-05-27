'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
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
import {
  AUTHENTICATION_REQUIRED,
  AUTHENTICATION_REQUIRED_DESCRIPTION,
} from '@/utils/messages';

import { useNewSessionModalStore } from '../../stores/new-session-modal-store';
import {
  DisplayMode,
  HealthCheckStatus,
  HealthCheckFormData,
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
  const { id: team_id } = useParams<{ id: string }>();
  const { templateId, setTemplateId } = useNewSessionModalStore();
  const [step, setStep] = useState<'choose' | 'form'>('choose');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  );
  const [formData, setFormData] = useState<HealthCheckFormData>({
    title: '',
    dueDate: new Date(),
    displayMode: DisplayMode.GROUPED,
  });
  const [previewState, setPreviewState] = useState<{
    open: boolean;
    template: Template | null;
  }>({ open: false, template: null });

  const { data: currentUser } = useCurrentUser();
  const { data: templates, isLoading: isLoadingTemplates } = useTemplates();
  const { createHealthCheck, isLoading: isCreatingHealthCheck } =
    useHealthCheckMutations();

  useEffect(() => {
    if (templateId) {
      const template = templates?.find((tpl) => tpl.id === templateId) || null;
      setSelectedTemplate(template);
      setStep('form');
    } else if (templates?.length) {
      setSelectedTemplate(templates[0]);
    }
  }, [templates, templateId]);

  const handleCreate = async () => {
    if (!selectedTemplate || !currentUser) {
      toast.error(AUTHENTICATION_REQUIRED, {
        description: AUTHENTICATION_REQUIRED_DESCRIPTION,
      });
      return;
    }

    await createHealthCheck({
      title: formData.title,
      description: '',
      team_id,
      template_id: templateId || selectedTemplate.id,
      facilitator_id: currentUser.id,
      status: HealthCheckStatus.IN_PROGRESS,
      current_step: 1,
      settings: {
        display_mode: formData.displayMode,
      },
    });

    setTemplateId('');
    onOpenChange(false);
  };

  if (isLoadingTemplates) {
    return (
      <Card className="p-4">
        <div className="h-6 w-24 animate-pulse rounded bg-gray-200"></div>
        <div className="h-4 w-full animate-pulse rounded bg-gray-200 pt-2"></div>
      </Card>
    );
  }

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
                templates={templates}
                selectedTemplate={selectedTemplate}
                onTemplateSelect={setSelectedTemplate}
                onPreview={(template) =>
                  setPreviewState({ open: true, template })
                }
                onContinue={() => setStep('form')}
              />
            ))}

          {step === 'form' && (
            <SessionFormStep
              formData={formData}
              onFormDataChange={(data) =>
                setFormData((prev) => ({ ...prev, ...data }))
              }
              onSubmit={handleCreate}
              onBack={() => setStep('choose')}
              isSubmitting={isCreatingHealthCheck}
            />
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
