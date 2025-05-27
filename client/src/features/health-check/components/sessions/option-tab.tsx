'use client';

import {
  DisplayMode,
  HealthCheckFormData,
} from '@/features/health-check/types/health-check';

import DisplayModeOption from './display-mode-option';
import ToggleOption from './toggle-option';

interface OptionTabProps {
  formData: HealthCheckFormData;
  onFormDataChange: (data: Partial<HealthCheckFormData>) => void;
}

const OptionsTab = ({ formData, onFormDataChange }: OptionTabProps) => {
  return (
    <div className="py-3">
      <div>
        <ToggleOption
          id="display-mode"
          label="Display Mode"
          tooltip="Choose how questions will be displayed to participants"
        >
          <div className="flex flex-col gap-2 py-3">
            <DisplayModeOption
              id="one-by-one"
              label="One by one"
              isSelected={formData.displayMode === DisplayMode.SINGLE}
              onChange={() =>
                onFormDataChange({ displayMode: DisplayMode.SINGLE })
              }
            />
            <DisplayModeOption
              id="section-by-section"
              label="Section by section"
              isSelected={formData.displayMode === DisplayMode.GROUPED}
              onChange={() =>
                onFormDataChange({ displayMode: DisplayMode.GROUPED })
              }
            />
            <DisplayModeOption
              id="all-in-one"
              label="All on one page"
              isSelected={formData.displayMode === DisplayMode.ALL}
              onChange={() =>
                onFormDataChange({ displayMode: DisplayMode.ALL })
              }
            />
          </div>
        </ToggleOption>
      </div>
    </div>
  );
};

export default OptionsTab;
