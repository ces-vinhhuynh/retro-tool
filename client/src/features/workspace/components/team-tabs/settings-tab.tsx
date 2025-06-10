'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import TemplatePreviewDialog from '@/features/health-check/components/sessions/template-preview-dialog';
import { useTeamTemplates } from '@/features/health-check/hooks/use-team-templates';
import { Template } from '@/features/health-check/types/templates';

import ManageCustomTemplateModal from '../manage-custom-template-modal';
import { TemplateCard } from '../template-card';

interface SettingsTab {
  teamId: string;
}

export const SettingsTab = ({ teamId }: SettingsTab) => {
  const { data: templates, isLoading } = useTeamTemplates(teamId);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  );
  const [isOpenPreview, setIsOpenPreview] = useState<boolean>(false);

  const [open, setOpen] = useState(false);
  const [template, setTemplate] = useState<Template | null>(null);

  if (isLoading) return <></>;

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
          <Button
            onClick={() => {
              setTemplate(null);
              setOpen(true);
            }}
          >
            Create custom template
          </Button>
        </div>
      </div>

      {templates?.length && (
        <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
          {templates.map((template, index) => (
            <li key={`${template.id}_${index}`}>
              <TemplateCard
                template={template}
                handleClickPreview={() => {
                  setSelectedTemplate(template);
                  setIsOpenPreview(true);
                }}
                setOpen={setOpen}
                setTemplate={setTemplate}
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
        open={open}
        setOpen={setOpen}
        teamId={teamId}
        template={template}
        setTemplate={setTemplate}
      />
    </Card>
  );
};
