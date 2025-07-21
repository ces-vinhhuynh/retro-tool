'use client';

import { useFormContext } from 'react-hook-form';

import { HealthCheckFormData } from '@/features/health-check/types/health-check';

import { DisplayModeSelector } from './display-mode-selector';
import { SettingModeOption } from './setting-mode-option';
import { ToggleOption } from './toggle-option';

export const OptionsTab = () => {
  const { watch, setValue } = useFormContext<HealthCheckFormData>();
  const displayMode = watch('displayMode');
  const allowNavigation = watch('allowNavigation');
  return (
    <div className="py-3">
      <div>
        <DisplayModeSelector
          currentMode={displayMode}
          onChange={(mode) => setValue('displayMode', mode)}
        />
        <ToggleOption
          id="allow-navigation-toggle"
          label="Move to next question"
          tooltip="Choose if participants can navigate to previous or next questions"
        >
          <div className="flex flex-col gap-2 py-3">
            <SettingModeOption
              id="allow-navigation-option"
              label="Allow participants to move to next question"
              isSelected={allowNavigation}
              onChange={() => setValue('allowNavigation', !allowNavigation)}
            />
          </div>
        </ToggleOption>
      </div>
    </div>
  );
};
