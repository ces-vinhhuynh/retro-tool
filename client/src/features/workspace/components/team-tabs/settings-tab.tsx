'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import TemplatePreviewDialog from '@/features/health-check/components/sessions/template-preview-dialog';
import { useTeamTemplates } from '@/features/health-check/hooks/use-team-templates';
import { Template } from '@/features/health-check/types/templates';

import CreateCustomTemplateModal from '../create-custom-template-modal';
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
          <Button onClick={() => setOpen(true)}>Create custom template</Button>
        </div>

        <CreateCustomTemplateModal
          open={open}
          setOpen={setOpen}
          teamId={teamId}
        />
      </div>

      {templates?.length && (
        <ul className="grid grid-cols-4 grid-rows-5 gap-5">
          {templates.map((template, index) => (
            <li key={`${template.id}_${index}`}>
              <TemplateCard
                template={template}
                handleClickPreview={() => {
                  setSelectedTemplate(template);
                  setIsOpenPreview(true);
                }}
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
    </Card>
  );
};
