'use client';

import { useFormContext } from 'react-hook-form';

import { HealthCheckFormData } from '@/features/health-check/types/health-check';

import DisplayModeSelector from './display-mode-selector';

const OptionsTab = () => {
  const { watch, setValue } = useFormContext<HealthCheckFormData>();
  const displayMode = watch('displayMode');

  return (
    <div className="py-3">
      <div>
        <DisplayModeSelector
          currentMode={displayMode}
          onChange={(mode) => setValue('displayMode', mode)}
        />
      </div>
    </div>
  );
};

export default OptionsTab;
