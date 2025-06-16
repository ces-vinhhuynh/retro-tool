'use client';

import { Loader2 } from 'lucide-react';
import { useState } from 'react';

import ConfirmModal from '@/components/modal/confirm-modal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import TemplatePreviewDialog from '@/features/health-check/components/sessions/template-preview-dialog';
import { useDeleteTemplate } from '@/features/health-check/hooks/use-health-check-templates';
import { useTeamTemplates } from '@/features/health-check/hooks/use-team-templates';
import { Template } from '@/features/health-check/types/templates';
import { MESSAGE } from '@/utils/messages';

import ManageCustomTemplateModal from '../manage-custom-template-modal';
import { CustomTemplateModalType, TemplateCard } from '../template-card';

interface SettingsTab {
  teamId: string;
  isAdmin: boolean;
}

export const SettingsTab = ({ teamId, isAdmin }: SettingsTab) => {
  const { data: templates, isLoading } = useTeamTemplates(teamId);
  const { deleteTemplate, isDeleting } = useDeleteTemplate();

  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  );
  const [isOpenPreview, setIsOpenPreview] = useState<boolean>(false);

  const [openModal, setOpenModal] = useState<CustomTemplateModalType | null>(
    null,
  );

  if (isLoading)
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-8 animate-spin" />
      </div>
    );

  return (
    <Card className="flex flex-col gap-8 p-4 md:p-6 lg:p-8">
      <div>
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-sm text-gray-500">
              Manage custom templates and settings in your workspace
            </p>
          </div>
          {isAdmin && (
            <Button
              onClick={() => {
                setSelectedTemplate(null);
                setOpenModal(CustomTemplateModalType.MANAGE);
              }}
            >
              Create custom template
            </Button>
          )}
        </div>
      </div>

      {templates && templates?.length > 0 && (
        <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
          {templates.map((template, index) => (
            <li key={`${template.id}_${index}`}>
              <TemplateCard
                template={template}
                handleClickPreview={() => {
                  setSelectedTemplate(template);
                  setIsOpenPreview(true);
                }}
                setOpenModal={setOpenModal}
                setSelectedTemplate={setSelectedTemplate}
                isAdmin={isAdmin}
              />
            </li>
          ))}
        </ul>
      )}

      <TemplatePreviewDialog
        open={isOpenPreview}
        onOpenChange={(open) => setIsOpenPreview(open)}
        template={selectedTemplate}
      />
      <ManageCustomTemplateModal
        open={openModal === CustomTemplateModalType.MANAGE}
        onClose={() => setOpenModal(null)}
        teamId={teamId}
        template={selectedTemplate}
        setSelectedTemplate={setSelectedTemplate}
      />
      <ConfirmModal
        variant="delete"
        isOpen={openModal === CustomTemplateModalType.DELETE}
        title={MESSAGE.DELETE_TEMPLATE_TITLE}
        description={MESSAGE.DELETE_TEMPLATE_DESCRIPTION}
        onCancel={() => setOpenModal(null)}
        onConfirm={() => {
          deleteTemplate(selectedTemplate?.id || '', {
            onSuccess: () => {
              setOpenModal(null);
              setSelectedTemplate(null);
            },
          });
        }}
        loading={isDeleting}
      />
    </Card>
  );
};
