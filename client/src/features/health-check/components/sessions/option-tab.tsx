'use client';

import { HealthCheckFormData } from '@/features/health-check/types/health-check';

import DisplayModeSelector from './display-mode-selector';

interface OptionTabProps {
  formData: HealthCheckFormData;
  onFormDataChange: (data: Partial<HealthCheckFormData>) => void;
}

const OptionsTab = ({ formData, onFormDataChange }: OptionTabProps) => {
  return (
    <div className="py-3">
      <div>
        <DisplayModeSelector
          currentMode={formData.displayMode}
          onChange={(mode) => onFormDataChange({ displayMode: mode })}
        />
      </div>
    </div>
  );
};

export default OptionsTab;
