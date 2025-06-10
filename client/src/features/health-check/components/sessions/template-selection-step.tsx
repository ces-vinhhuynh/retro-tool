'use client';

import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Template } from '../../types/templates';

import TemplateCard from './template-card';

export enum TEMPLATE_TAB_LABELS {
  STANDARD = 'Standard',
  CUSTOM = 'Custom',
}

interface TemplateSelectionStepProps {
  teamId: string;
  templates: Template[] | undefined;
  selectedTemplate: Template | null;
  onTemplateSelect: (template: Template) => void;
  onPreview: (template: Template) => void;
  onContinue: () => void;
}

const TemplateSelectionStep = ({
  teamId,
  templates,
  selectedTemplate,
  onTemplateSelect,
  onPreview,
  onContinue,
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
    const currentTab = templateTabs.find((tab) => tab.label === value);
    if (currentTab?.data.length) {
      onTemplateSelect(currentTab.data[0]);
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
      <DialogFooter>
        <Button
          className="w-full"
          disabled={!selectedTemplate || templates?.length === 0}
          onClick={onContinue}
        >
          Continue
        </Button>
      </DialogFooter>
    </div>
  );
};

export default TemplateSelectionStep;
