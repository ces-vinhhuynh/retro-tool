'use client';

import { useState } from 'react';

import { Card } from '@/components/ui/card';
import TemplatePreviewDialog from '@/features/health-check/components/sessions/template-preview-dialog';
import { useTeamTemplates } from '@/features/health-check/hooks/use-team-templates';
import { Template } from '@/features/health-check/types/templates';

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

  if (isLoading) return <></>;

  return (
    <Card className="flex flex-col gap-8 p-4 md:p-6 lg:p-8">
      <div>
        <h2 className="py-3 text-2xl font-bold text-gray-900">
          Custom templates
        </h2>
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
      </div>
      <TemplatePreviewDialog
        open={isOpenPreview}
        onOpenChange={(open) => setIsOpenPreview(open)}
        template={selectedTemplate}
      />
    </Card>
  );
};
