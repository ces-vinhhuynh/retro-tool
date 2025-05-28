'use client';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useFormContext, Controller } from 'react-hook-form';

import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { HealthCheckFormData } from '@/features/health-check/types/health-check';

const GeneralTab = () => {
  const { register, control } = useFormContext<HealthCheckFormData>();

  return (
    <div className="flex flex-col gap-4 py-4">
      <div>
        <Label htmlFor="session-name" className="block text-sm font-medium">
          Session Title
        </Label>
        <Input
          id="session-name"
          {...register('title', { required: true })}
          placeholder="Team Health Check"
          required
        />
      </div>
      <div>
        <Label htmlFor="due-date" className="block text-sm font-medium">
          Due Date
        </Label>
        <Controller
          control={control}
          name="dueDate"
          render={({ field }) => (
            <Popover modal={true}>
              <PopoverTrigger asChild>
                <div className="relative w-full">
                  <Input
                    id="due-date"
                    value={
                      field.value ? format(field.value, 'MMMM dd, yyyy') : ''
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
                  selected={field.value}
                  onSelect={field.onChange}
                  className="rounded-md border shadow-sm"
                />
              </PopoverContent>
            </Popover>
          )}
        />
      </div>
    </div>
  );
};

export default GeneralTab;
