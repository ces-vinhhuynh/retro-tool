'use client';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
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
import { cn } from '@/utils/cn';

import { LONG_TEXT_INPUT_MAX_LENGTH } from '../../utils/constants';

export const GeneralTab = () => {
  const { register, control, watch } = useFormContext<HealthCheckFormData>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 py-4">
      <div>
        <div className="flex justify-between pb-2">
          <Label htmlFor="session-name" className="block text-sm font-medium">
            Session Title
          </Label>
          <span className="text-muted-foreground text-xs">
            {watch('title', '')?.length}/{LONG_TEXT_INPUT_MAX_LENGTH}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <Input
            id="session-name"
            {...register('title', {
              required: true,
              maxLength: LONG_TEXT_INPUT_MAX_LENGTH,
            })}
            placeholder="Team Health Check"
            required
            maxLength={LONG_TEXT_INPUT_MAX_LENGTH}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="due-date" className="block pb-2 text-sm font-medium">
          Due Date
        </Label>
        <Controller
          control={control}
          name="dueDate"
          render={({ field }) => (
            <Popover
              modal={true}
              open={isCalendarOpen}
              onOpenChange={setIsCalendarOpen}
            >
              <PopoverTrigger asChild>
                <div className="relative w-full">
                  <Input
                    id="due-date"
                    value={
                      field.value ? format(field.value, 'MMMM dd, yyyy') : ''
                    }
                    readOnly
                    className={cn(
                      'cursor-pointer pr-10 text-left',
                      isCalendarOpen &&
                        'ring-offset-background ring-ring ring-2 ring-offset-2',
                    )}
                    placeholder="Pick a date"
                  />
                  <CalendarIcon className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => {
                    field.onChange(date);
                    setIsCalendarOpen(false);
                  }}
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
