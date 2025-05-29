'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { HealthCheckSettings } from '@/features/health-check/types/health-check';

import DisplayModeSelector from './sessions/display-mode-selector';
import SettingModeOption from './sessions/setting-mode-option';
import ToggleOption from './sessions/toggle-option';

interface SettingDialogProps {
  settings: HealthCheckSettings;
  onChange: (settings: HealthCheckSettings) => void;
  trigger: React.ReactNode;
}

const SettingDialog = ({ settings, onChange, trigger }: SettingDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Health check settings</DialogTitle>
        </DialogHeader>
        <DisplayModeSelector
          currentMode={settings.display_mode}
          onChange={(mode) => onChange({ ...settings, display_mode: mode })}
        />
        <ToggleOption
          id="allow-navigation"
          label="Move to next question"
          tooltip="Choose if participants can navigate to previous or next questions"
        >
          <div className="flex flex-col gap-2 py-3">
            <SettingModeOption
              id="allow-navigation"
              label="Allow participants to move to next question"
              isSelected={settings.allow_participant_navigation}
              onChange={() =>
                onChange({
                  ...settings,
                  allow_participant_navigation:
                    !settings.allow_participant_navigation,
                })
              }
            />
          </div>
        </ToggleOption>
      </DialogContent>
    </Dialog>
  );
};

export default SettingDialog;
