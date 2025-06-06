'use client';

import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { cn } from '@/utils/cn';

import ToggleSwitch from './toggle-switch';

interface ToggleOptionProps {
  id: string;
  label: string;
  tooltip?: string;
  isChecked?: boolean;
  onChange?: (checked: boolean) => void;
  description?: string;
  children?: React.ReactNode;
}

const ToggleOption = ({
  id,
  label,
  tooltip,
  isChecked,
  onChange,
  description,
  children,
}: ToggleOptionProps) => {
  return (
    <div className="py-1">
      <div className="flex items-center">
        {onChange !== undefined && (
          <ToggleSwitch
            id={id}
            checked={!!isChecked}
            onCheckedChange={onChange}
          />
        )}
        <Label
          htmlFor={id}
          className={cn(
            'ml-2 text-gray-700',
            onChange === undefined && 'font-medium',
          )}
        >
          {label}
        </Label>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipContent>
                <p className="w-[200px] text-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {description && (
        <p className="ml-12 text-sm text-gray-500">{description}</p>
      )}
      {children}
    </div>
  );
};

export default ToggleOption;
