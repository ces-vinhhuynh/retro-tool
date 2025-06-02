'use client';

import { Label } from '@/components/ui/label';

import ToggleSwitch from './toggle-switch';

interface SettingModeOptionProps {
  id: string;
  label: string;
  isSelected: boolean;
  onChange: () => void;
}

const SettingModeOption = ({
  id,
  label,
  isSelected,
  onChange,
}: SettingModeOptionProps) => {
  console.log('🚀 ~ isSelected:', isSelected);
  return (
    <div className="flex cursor-pointer items-center justify-between rounded-md border bg-white p-2.5 transition-all hover:border-gray-300">
      <Label htmlFor={id} className="cursor-pointer text-gray-700">
        {label}
      </Label>
      <ToggleSwitch id={id} checked={isSelected} onCheckedChange={onChange} />
    </div>
  );
};

export default SettingModeOption;
