'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Template } from '@/lib/types';

interface TemplatePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: Template | null;
}

export function TemplatePreviewDialog({
  open,
  onOpenChange,
  template,
}: TemplatePreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-bold">
            {template ? template.name : 'Template Preview'}
          </DialogTitle>
          <DialogDescription className="pt-1">
            {template?.description}
          </DialogDescription>
        </DialogHeader>
        <div className="pt-4 py-4">
          {template?.questions.map((question, index) => (
            <div key={index} className="py-2">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#e07a5f] text-sm font-medium text-white">
                  {index + 1}
                </span>
                <div className="pt-1">
                  <p className="text-base font-bold">{question.title}</p>
                  <p className="text-base pt-1">{question.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
