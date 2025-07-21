'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import {
  HEALTH_CHECK_TABS,
  HealthCheckTab,
} from '@/features/health-check/utils/constants';

import { GeneralTab } from './general-tab';
import { OptionsTab } from './option-tab';
import { TabNavigation } from './tab-navigation';

interface SessionFormStepProps {
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export const SessionFormStep = ({
  onSubmit,
  onBack,
  isSubmitting,
}: SessionFormStepProps) => {
  const [activeTab, setActiveTab] = useState<HealthCheckTab>('general');
  const { handleSubmit, watch } = useFormContext();
  const title = watch('title');

  return (
    <div className="py-4">
      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={HEALTH_CHECK_TABS}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        {activeTab === 'general' && <GeneralTab />}
        {activeTab === 'options' && <OptionsTab />}

        <DialogFooter className="pt-4">
          <Button
            variant="outline"
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !title?.trim()}
            className="text-primary-foreground"
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </DialogFooter>
      </form>
    </div>
  );
};
