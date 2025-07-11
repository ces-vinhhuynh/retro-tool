import { Eye, MoreVertical, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Template } from '@/features/health-check/types/templates';

export enum CustomTemplateModalType {
  MANAGE = 'manage',
  DELETE = 'delete',
}

interface TemplateCardProps {
  template: Template;
  handleClickPreview: () => void;
  setOpenModal: (openModal: CustomTemplateModalType | null) => void;
  setSelectedTemplate: (template: Template) => void;
  isAdmin: boolean;
}

export const TemplateCard = ({
  template,
  handleClickPreview,
  setOpenModal,
  setSelectedTemplate,
  isAdmin,
}: TemplateCardProps) => {
  return (
    <div className="hover:bg-rhino-50/30 relative h-full max-h-60 min-h-40 rounded-sm border border-gray-400 p-5 transition-transform duration-200 ease-in-out">
      <div className="flex h-full flex-col gap-2 overflow-hidden">
        <p className="font truncate text-lg font-bold">{template?.name}</p>
        <p className="line-clamp-3 text-sm break-words">
          {template?.description}
        </p>
        <div className="mt-auto text-sm text-gray-500">
          {template?.min_value?.value} - {template?.max_value?.value}
        </div>
      </div>
      {isAdmin && (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="absolute top-3 right-3 h-8 w-8 p-0"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" portalled={false}>
            <DropdownMenuItem
              className="hover:text-primary flex w-full cursor-pointer justify-start gap-4 px-5"
              onClick={() => {
                setOpenModal(CustomTemplateModalType.MANAGE);
                setSelectedTemplate(template);
              }}
            >
              <Pencil className="h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="focus:text-primary flex w-full cursor-pointer justify-start gap-4 px-5 text-red-600 focus:bg-transparent focus-visible:ring-0"
              onClick={() => {
                setOpenModal(CustomTemplateModalType.DELETE);
                setSelectedTemplate(template);
              }}
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      <Button
        variant="ghost"
        className="hover:bg-accent hover:text-accent-foreground focus:ring-primary rounded-ful absolute right-3 bottom-3 z-10 w-9 p-1 focus:ring-0 focus:outline-none"
        aria-label={`Preview template ${template.name}`}
        onClick={handleClickPreview}
      >
        <Eye className="hover:text-primary h-5 w-5 text-gray-700" />
      </Button>
    </div>
  );
};
