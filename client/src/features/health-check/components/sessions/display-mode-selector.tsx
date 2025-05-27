import { DisplayMode } from '@/features/health-check/types/health-check';
import { cn } from '@/lib/utils';

import DisplayModeOption from './display-mode-option';
import ToggleOption from './toggle-option';

interface DisplayModeSelectorProps {
  currentMode: DisplayMode;
  onChange: (mode: DisplayMode) => void;
  className?: string;
}

const DISPLAY_MODES = [
  { value: DisplayMode.SINGLE, label: 'One by one' },
  { value: DisplayMode.GROUPED, label: 'Section by section' },
  { value: DisplayMode.ALL, label: 'All on one page' },
];

const DisplayModeSelector = ({
  currentMode,
  onChange,
  className = '',
}: DisplayModeSelectorProps) => {
  return (
    <ToggleOption
      id="display-mode"
      label="Display Mode"
      tooltip="Choose how questions will be displayed to participants"
    >
      <div className="py-3">
        <div className={cn('flex flex-col gap-2', className)}>
          {DISPLAY_MODES.map((mode) => (
            <DisplayModeOption
              key={mode.value}
              id={mode.value}
              label={mode.label}
              isSelected={currentMode === mode.value}
              onChange={() => onChange(mode.value)}
            />
          ))}
        </div>
      </div>
    </ToggleOption>
  );
};

export default DisplayModeSelector;
