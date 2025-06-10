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
        'relative cursor-pointer border',
        isSelected ? 'border-ces-orange-500' : 'border-transparent',
      )}
      onClick={() => onSelect(template)}
      tabIndex={0}
      aria-selected={isSelected}
    >
      <Button
        variant="ghost"
        className="focus:ring-primary hover:bg-ces-orange-100/70 hover:text-ces-orange-500 absolute top-3 right-3 z-10 size-8 rounded-full bg-white p-1 text-gray-500 focus:ring-0 focus:outline-none"
        onClick={(e) => {
          e.stopPropagation();
          onPreview(template);
        }}
        aria-label={`Preview template ${template.name}`}
      >
        <Eye className="h-5 w-5" />
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
