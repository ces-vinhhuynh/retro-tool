'use client';

import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

import { Template } from '../../types/templates';

import TemplateCard from './template-card';

interface TemplateSelectionStepProps {
  templates: Template[] | undefined;
  selectedTemplate: Template | null;
  onTemplateSelect: (template: Template) => void;
  onPreview: (template: Template) => void;
  onContinue: () => void;
}

const TemplateSelectionStep = ({
  templates,
  selectedTemplate,
  onTemplateSelect,
  onPreview,
  onContinue,
}: TemplateSelectionStepProps) => {
  return (
    <div className="flex flex-col gap-5 py-4">
      <div className="grid grid-cols-1 gap-2">
        {templates?.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={selectedTemplate?.id === template.id}
            onSelect={onTemplateSelect}
            onPreview={onPreview}
          />
        ))}
      </div>
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
