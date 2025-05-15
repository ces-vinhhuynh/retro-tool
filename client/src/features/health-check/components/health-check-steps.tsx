import { Check } from 'lucide-react';

import { cn } from '@/utils/cn';

import { STEPS } from '../utils/constants';

interface HealthCheckStepsProps {
  currentStep: number;
  isFacilitator: boolean;
  handleChangeStep: (step: keyof typeof STEPS) => void;
}

const HealthCheckSteps = ({
  currentStep,
  isFacilitator,
  handleChangeStep,
}: HealthCheckStepsProps) => {
  return (
    <div className="w-[50%]">
      <div className="relative flex">
        {Object.values(STEPS).map(({ key, value }, index) => (
          <div key={key} className="flex w-full flex-col items-center">
            <button
              className={cn(
                'z-10 flex min-h-8 min-w-8 items-center justify-center rounded-full border-2 border-gray-200 bg-white text-gray-200',
                {
                  'border-orange-500 bg-orange-500 text-white':
                    key < currentStep,
                  'border-orange-500 text-orange-500': key === currentStep,
                },
              )}
              onClick={() => {
                if (isFacilitator) {
                  handleChangeStep(
                    Object.keys(STEPS)[index] as keyof typeof STEPS,
                  );
                }
              }}
              disabled={!isFacilitator}
            >
              {key < currentStep ? <Check /> : key}
            </button>
            <p
              className={cn('text-sm', {
                'text-gray-500': key > currentStep,
              })}
            >
              {value}
            </p>
          </div>
        ))}
        <div className="absolute top-[14px] left-[11%] h-1 w-[75%] bg-gray-200" />
      </div>
    </div>
  );
};

export default HealthCheckSteps;
