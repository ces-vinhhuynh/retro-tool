'use client';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { HealthCheckFormData } from '@/features/health-check/types/health-check';

interface GeneralTabProps {
  formData: HealthCheckFormData;
  onFormDataChange: (data: Partial<HealthCheckFormData>) => void;
}

const GeneralTab = ({ formData, onFormDataChange }: GeneralTabProps) => {
  return (
    <div className="flex flex-col gap-4 py-4">
      <div>
        <Label htmlFor="session-name" className="block text-sm font-medium">
          Session Title
        </Label>
        <Input
          id="session-name"
          value={formData.title}
          onChange={(e) => onFormDataChange({ title: e.target.value })}
          placeholder="Team Health Check"
          required
        />
      </div>
      <div>
        <Label htmlFor="due-date" className="block text-sm font-medium">
          Due Date
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <div className="relative w-full">
              <Input
                id="due-date"
                value={
                  formData.dueDate
                    ? format(formData.dueDate, 'MMMM dd, yyyy')
                    : ''
                }
                readOnly
                className="cursor-pointer pr-10 text-left"
                placeholder="Pick a date"
              />
              <CalendarIcon className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formData.dueDate}
              onSelect={(date) => date && onFormDataChange({ dueDate: date })}
              className="rounded-md border shadow-sm"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default GeneralTab;
