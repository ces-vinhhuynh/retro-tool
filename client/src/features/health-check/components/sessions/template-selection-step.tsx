'use client';

import { AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Template } from '../../types/templates';

import { TemplateCard } from './template-card';

export enum TEMPLATE_TAB_LABELS {
  STANDARD = 'Standard',
  CUSTOM = 'Custom',
}

interface TemplateSelectionStepProps {
  teamId: string;
  templates: Template[] | undefined;
  selectedTemplate: Template | null;
  onTemplateSelect: (template: Template | null) => void;
  onPreview: (template: Template) => void;
  onContinue: () => void;
  hasInProgressHealthCheck: boolean;
}

export const TemplateSelectionStep = ({
  teamId,
  templates,
  selectedTemplate,
  onTemplateSelect,
  onPreview,
  onContinue,
  hasInProgressHealthCheck,
}: TemplateSelectionStepProps) => {
  const customTemplates =
    templates?.filter(
      (template) => template.is_custom && template.team_id === teamId,
    ) ?? [];
  const standardTemplates =
    templates?.filter((template) => !template.is_custom) ?? [];

  const templateTabs = [
    {
      label: TEMPLATE_TAB_LABELS.STANDARD,
      data: standardTemplates,
    },
    {
      label: TEMPLATE_TAB_LABELS.CUSTOM,
      data: customTemplates,
    },
  ];

  const handleTabChange = (value: string) => {
    const newTab = templateTabs.find((tab) => tab.label === value);

    if (newTab?.data.length) {
      onTemplateSelect(newTab.data[0]);
    } else {
      onTemplateSelect(null);
    }
  };

  return (
    <div className="flex flex-col gap-5 py-4">
      <Tabs
        defaultValue={TEMPLATE_TAB_LABELS.STANDARD}
        className="w-full"
        onValueChange={handleTabChange}
      >
        <TabsList className="grid w-full grid-cols-2">
          {Object.values(TEMPLATE_TAB_LABELS).map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="cursor-pointer text-sm uppercase"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        {templateTabs.map((tab) => (
          <TabsContent key={tab.label} value={tab.label} className="mt-4">
            <div className="grid grid-cols-1 gap-2">
              {tab.data.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  isSelected={selectedTemplate?.id === template.id}
                  onSelect={onTemplateSelect}
                  onPreview={onPreview}
                />
              ))}
              {tab.data.length === 0 && (
                <p className="text-muted-foreground text-center">
                  No {tab.label} templates available
                </p>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Inline warning message when there's an IN_PROGRESS health check */}
      {hasInProgressHealthCheck && selectedTemplate && (
        <div className="flex items-center gap-3 rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/10">
          <AlertTriangle className="h-10 w-10 text-red-600 sm:h-5 sm:w-5 dark:text-red-400" />
          <p className="text-sm text-red-700 dark:text-red-400">
            There is an In Progress health check using this template. Please
            close it before creating a new one.
          </p>
        </div>
      )}

      <DialogFooter>
        <Button
          className={`w-full ${hasInProgressHealthCheck ? 'cursor-not-allowed opacity-50' : ''}`}
          disabled={
            !selectedTemplate ||
            templates?.length === 0 ||
            hasInProgressHealthCheck
          }
          onClick={onContinue}
        >
          Continue
        </Button>
      </DialogFooter>
    </div>
  );
};
