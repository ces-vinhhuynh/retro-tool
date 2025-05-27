'use client';

import { Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { Template } from '../../types/templates';

interface TemplateCardProps {
  template: Template;
  isSelected: boolean;
  onSelect: (template: Template) => void;
  onPreview: (template: Template) => void;
}

const TemplateCard = ({
  template,
  isSelected,
  onSelect,
  onPreview,
}: TemplateCardProps) => {
  return (
    <Card
      className={cn(
        'relative cursor-pointer border-2',
        isSelected ? 'border-primary' : 'border-transparent',
      )}
      onClick={() => onSelect(template)}
      tabIndex={0}
      aria-selected={isSelected}
    >
      <Button
        variant="ghost"
        className="focus:ring-primary absolute top-3 right-3 z-10 rounded-full bg-white p-1 hover:bg-gray-100 focus:ring-2 focus:outline-none"
        onClick={(e) => {
          e.stopPropagation();
          onPreview(template);
        }}
        aria-label={`Preview template ${template.name}`}
      >
        <Eye className="hover:text-primary h-5 w-5 text-gray-700" />
      </Button>
      <CardHeader>
        <CardTitle className="text-base font-bold">{template.name}</CardTitle>
        <CardDescription className="pt-1">
          {template.description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default TemplateCard;
