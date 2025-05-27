'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DisplayMode } from '@/features/health-check/types/health-check';

import DisplayModeSelector from './sessions/display-mode-selector';

interface DisplayModeDialogProps {
  currentMode: DisplayMode;
  onChange: (mode: DisplayMode) => void;
  trigger: React.ReactNode;
}

const DisplayModeDialog = ({
  currentMode,
  onChange,
  trigger,
}: DisplayModeDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Health check settings</DialogTitle>
        </DialogHeader>
        <DisplayModeSelector currentMode={currentMode} onChange={onChange} />
      </DialogContent>
    </Dialog>
  );
};

export default DisplayModeDialog;
