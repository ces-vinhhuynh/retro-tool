'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import {
  HEALTH_CHECK_TABS,
  HealthCheckTab,
} from '@/features/health-check/utils/constants';

import { HealthCheckFormData } from '../../types/health-check';

import GeneralTab from './general-tab';
import OptionsTab from './option-tab';
import TabNavigation from './tab-navigation';

interface SessionFormStepProps {
  formData: HealthCheckFormData;
  onFormDataChange: (data: Partial<HealthCheckFormData>) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const SessionFormStep = ({
  formData,
  onFormDataChange,
  onSubmit,
  onBack,
  isSubmitting,
}: SessionFormStepProps) => {
  const [activeTab, setActiveTab] = useState<HealthCheckTab>('general');

  return (
    <div className="py-4">
      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={HEALTH_CHECK_TABS}
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        {activeTab === 'general' && (
          <GeneralTab formData={formData} onFormDataChange={onFormDataChange} />
        )}

        {activeTab === 'options' && (
          <OptionsTab formData={formData} onFormDataChange={onFormDataChange} />
        )}

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
            disabled={isSubmitting || !formData.title.trim()}
            className="text-primary-foreground"
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </DialogFooter>
      </form>
    </div>
  );
};

export default SessionFormStep;
