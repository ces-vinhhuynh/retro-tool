'use client';

import { cn } from '@/utils/cn';

interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const ToggleSwitch = ({
  id,
  checked,
  onCheckedChange,
}: ToggleSwitchProps) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      id={id}
      className={cn(
        'focus:ring-primary relative inline-flex h-5 w-10 cursor-pointer items-center rounded-full transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none',
        checked ? 'bg-primary' : 'bg-gray-200',
      )}
      onClick={() => onCheckedChange(!checked)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onCheckedChange(!checked);
        }
      }}
    >
      <span
        className={cn(
          'inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition-transform',
          checked ? 'translate-x-5' : 'translate-x-1',
        )}
      />
    </button>
  );
};
