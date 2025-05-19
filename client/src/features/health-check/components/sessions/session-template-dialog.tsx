'use client';

import { format } from 'date-fns';
import { CalendarIcon, Eye } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { useHealthCheckMutations } from '@/features/health-check/hooks/use-health-check';
import { useTemplates } from '@/features/health-check/hooks/use-health-check-templates';
import {
  AUTHENTICATION_REQUIRED,
  AUTHENTICATION_REQUIRED_DESCRIPTION,
} from '@/utils/messages';

import { useNewSessionModalStore } from '../../stores/new-session-modal-store';
import { HealthCheckStatus } from '../../types/health-check';
import { Template } from '../../types/templates';

import { TemplatePreviewDialog } from './template-preview-dialog';

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
  const [sessionName, setSessionName] = useState('');
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const { data: currentUser } = useCurrentUser();
  const { data: templates, isLoading: isLoadingTemplates } = useTemplates();
  const { createHealthCheck, isLoading: isCreatingHealthCheck } =
    useHealthCheckMutations();

  useEffect(() => {
    if (templateId) {
      setSelectedTemplate(
        templates?.find((tpl) => tpl.id === templateId) || null,
      );
      setStep('form');
    } else if (templates && templates.length > 0) {
      setSelectedTemplate(templates[0]);
    }
  }, [templates, templateId]);

  const handleContinue = () => setStep('form');
  const handleBack = () => setStep('choose');

  const handleCreate = async () => {
    if (!selectedTemplate) return;

    setIsSubmitting(true);

    if (!currentUser) {
      toast.error(AUTHENTICATION_REQUIRED, {
        description: AUTHENTICATION_REQUIRED_DESCRIPTION,
      });
      setIsSubmitting(false);
      return;
    }

    createHealthCheck({
      title: sessionName,
      description: '',
      team_id,
      template_id: templateId || selectedTemplate.id,
      facilitator_id: currentUser.id,
      status: HealthCheckStatus.IN_PROGRESS,
      current_step: 1,
    });

    setTemplateId('');
    onOpenChange(false);

    setIsSubmitting(false);
  };

  const handlePreview = (tpl: Template) => {
    setPreviewTemplate(tpl);
    setPreviewOpen(true);
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
          {step === 'choose' && (
            <div className="flex flex-col gap-5 py-4">
              <div className="grid grid-cols-1 gap-2">
                {isLoadingTemplates ? (
                  <Card className="p-4">
                    <div className="h-6 w-24 animate-pulse rounded bg-gray-200"></div>
                    <div className="h-4 w-full animate-pulse rounded bg-gray-200 pt-2"></div>
                  </Card>
                ) : (
                  templates?.map((tpl) => (
                    <Card
                      key={tpl.id}
                      className={`relative cursor-pointer border-2 ${
                        selectedTemplate?.id === tpl.id
                          ? 'border-primary'
                          : 'border-transparent'
                      }`}
                      onClick={() => setSelectedTemplate(tpl)}
                      tabIndex={0}
                      aria-selected={selectedTemplate?.id === tpl.id}
                    >
                      <button
                        type="button"
                        className="focus:ring-primary absolute top-3 right-3 z-10 rounded-full bg-white p-1 hover:bg-gray-100 focus:ring-2 focus:outline-none"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreview(tpl);
                        }}
                        aria-label={`Preview template ${tpl.name}`}
                      >
                        <Eye className="hover:text-primary h-5 w-5 text-gray-700" />
                      </button>
                      <CardHeader>
                        <CardTitle className="text-base font-bold">
                          {tpl.name}
                        </CardTitle>
                        <CardDescription className="pt-1">
                          {tpl.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))
                )}
              </div>
              <DialogFooter>
                <Button
                  className="w-full"
                  disabled={!selectedTemplate || templates?.length === 0}
                  onClick={handleContinue}
                >
                  Continue
                </Button>
              </DialogFooter>
            </div>
          )}
          {step === 'form' && (
            <form
              className="py-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleCreate();
              }}
            >
              <div className="py-2">
                <label
                  htmlFor="session-name"
                  className="block text-sm font-medium"
                >
                  Session Title
                </label>
                <Input
                  id="session-name"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  placeholder="Team Health Check"
                  required
                />
              </div>
              <div className="py-2">
                <label htmlFor="due-date" className="block text-sm font-medium">
                  Due Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="relative w-full">
                      <Input
                        id="due-date"
                        value={dueDate ? format(dueDate, 'MMMM dd, yyyy') : ''}
                        readOnly
                        className="cursor-pointer pr-10 text-left"
                        placeholder="Pick a date"
                      />
                      <CalendarIcon className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={(date) => date && setDueDate(date)}
                      className="rounded-md border shadow-sm"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <DialogFooter className="pt-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleBack}
                  disabled={isSubmitting}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={
                    isSubmitting || isCreatingHealthCheck || !sessionName.trim()
                  }
                  className="bg-primary text-primary-foreground"
                >
                  {isSubmitting || isCreatingHealthCheck
                    ? 'Creating...'
                    : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <TemplatePreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        template={previewTemplate}
      />
    </>
  );
};

export default SessionTemplateDialog;
